// Edge Function pública del sistema de reservas.
// POST { accion: 'horas' | 'reservar' | 'ver' | 'cancelar', ... }
//
// Secretos (Supabase → Edge Functions → Secrets):
//   Correo (sin ninguno de los dos, la reserva funciona y el correo se omite):
//     SMTP_HOST, SMTP_PORT (465), SMTP_USER, SMTP_PASS   p. ej. Gmail con contraseña de aplicación
//     RESEND_API_KEY                                     alternativa por API
//   EMAIL_FROM              "Culmen Odontología <reservas@culmenodontologia.cl>"
//   EMAIL_REPLY_TO          contacto@culmenodontologia.cl
//   SITE_URL                https://www.culmenodontologia.cl
//   GOOGLE_SERVICE_ACCOUNT  JSON de la cuenta de servicio con acceso a los calendarios
import { createClient } from 'npm:@supabase/supabase-js@2.45.4';
import { SMTPClient } from 'https://deno.land/x/denomailer@1.6.0/mod.ts';
import { validarPaciente } from './validar.js';
import { crearIcs } from './calendario.js';
import { correoConfirmacion } from './correo.js';

const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, {
  auth: { persistSession: false },
});

const TZ = 'America/Santiago';
const SITE = (Deno.env.get('SITE_URL') ?? 'https://www.culmenodontologia.cl').replace(/\/$/, '');
const MAX_HORAS_POR_RUT = 2;
const SLUG = /^[a-z0-9-]{2,40}$/;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });
class Fallo extends Error {
  constructor(public status: number, message: string) { super(message); }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (req.method !== 'POST') return json({ error: 'Método no permitido.' }, 405);
  try {
    const body = await req.json().catch(() => { throw new Fallo(400, 'Solicitud inválida.'); });
    switch (body?.accion) {
      case 'horas': return json(await horas(body));
      case 'reservar': return json(await reservar(body));
      case 'ver': return json(await ver(body));
      case 'cancelar': return json(await cancelar(body));
      default: throw new Fallo(400, 'Acción desconocida.');
    }
  } catch (e) {
    if (e instanceof Fallo) return json({ error: e.message }, e.status);
    console.error(e);
    return json({ error: 'Tuvimos un problema. Intenta nuevamente o escríbenos por WhatsApp.' }, 500);
  }
});

// --- Horas disponibles --------------------------------------------------------

const hoySantiago = () => new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(new Date());
const fechaSantiago = (iso: string) => new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(new Date(iso));

async function horas(b: { sede?: string; profesionales?: string[]; desde?: string; dias?: number }) {
  const sede = String(b.sede ?? '');
  const profesionales = Array.isArray(b.profesionales) ? b.profesionales.map(String).slice(0, 20) : [];
  if (!SLUG.test(sede) || !profesionales.length || !profesionales.every((p) => SLUG.test(p))) {
    throw new Fallo(400, 'Elige sede y especialidad.');
  }
  const hoy = hoySantiago();
  const desde = /^\d{4}-\d{2}-\d{2}$/.test(b.desde ?? '') && b.desde! > hoy ? b.desde! : hoy;
  const dias = Math.min(Math.max(Number(b.dias) || 14, 1), 31);

  const { data, error } = await db.rpc('slots_disponibles', {
    p_profesionales: profesionales, p_sede: sede, p_desde: desde, p_dias: dias,
  });
  if (error) throw error;
  let slots = data as { profesional_id: string; inicio: string; fin: string }[];

  // Los eventos del Google Calendar de cada profesional (vacaciones, bloqueos, citas
  // tomadas por WhatsApp) también ocupan horas.
  const { data: cals } = await db.from('profesionales').select('id, calendar_id')
    .in('id', profesionales).not('calendar_id', 'is', null);
  if (cals?.length && slots.length) {
    const ocupado = await ocupadoGoogle(cals.map((c) => c.calendar_id), slots[0].inicio, slots.at(-1)!.fin);
    const calDe = Object.fromEntries(cals.map((c) => [c.id, c.calendar_id]));
    slots = slots.filter((s) => {
      const tramos = ocupado[calDe[s.profesional_id]] ?? [];
      const i = Date.parse(s.inicio), f = Date.parse(s.fin);
      return !tramos.some((t) => Date.parse(t.start) < f && Date.parse(t.end) > i);
    });
  }
  return { desde, dias, slots: slots.map((s) => ({ p: s.profesional_id, i: s.inicio, f: s.fin })) };
}

// --- Reservar -----------------------------------------------------------------

async function reservar(b: Record<string, unknown>) {
  if (b.empresa) throw new Fallo(400, 'Solicitud inválida.'); // campo trampa para bots
  const sede = String(b.sede ?? '');
  const profesional = String(b.profesional ?? '');
  const inicio = String(b.inicio ?? '');
  if (!SLUG.test(sede) || !SLUG.test(profesional) || Number.isNaN(Date.parse(inicio))) {
    throw new Fallo(400, 'Elige una hora disponible.');
  }
  const { datos, errores } = validarPaciente(b.paciente as Record<string, unknown>);
  if (Object.keys(errores).length) return { ok: false, errores };
  const motivo = String(b.motivo ?? '').slice(0, 80) || null;

  // La hora debe seguir libre (incluye bloqueos de Google Calendar).
  const libres = await horas({ sede, profesionales: [profesional], desde: fechaSantiago(inicio), dias: 1 });
  const slot = libres.slots.find((s) => Date.parse(s.i) === Date.parse(inicio));
  if (!slot) throw new Fallo(409, 'Esa hora acaba de ser tomada. Elige otra, por favor.');

  const { count } = await db.from('reservas').select('id', { count: 'exact', head: true })
    .eq('rut', datos.rut).eq('estado', 'confirmada').gt('inicio', new Date().toISOString());
  if ((count ?? 0) >= MAX_HORAS_POR_RUT) {
    throw new Fallo(429, `Ya tienes ${MAX_HORAS_POR_RUT} horas agendadas. Para otra, escríbenos por WhatsApp.`);
  }

  const { data: r, error } = await db.from('reservas').insert({
    profesional_id: profesional, sede_id: sede, inicio: slot.i, fin: slot.f,
    nombre: datos.nombre, rut: datos.rut, email: datos.email, telefono: datos.telefono,
    prevision: datos.prevision || null, motivo, comentario: datos.comentario || null,
  }).select().single();
  if (error?.code === '23P01') throw new Fallo(409, 'Esa hora acaba de ser tomada. Elige otra, por favor.');
  if (error) throw error;

  const [{ data: prof }, { data: sed }] = await Promise.all([
    db.from('profesionales').select('*').eq('id', profesional).single(),
    db.from('sedes').select('*').eq('id', sede).single(),
  ]);

  // Calendario y correo no bloquean la reserva: si fallan, queda registrada igual.
  const [eventoId, correo] = await Promise.all([
    crearEvento(prof.calendar_id ?? sed.calendar_id, r, prof, sed).catch((e) => (console.error('Google', e), null)),
    enviarCorreo(
      r.email,
      correoConfirmacion({ r, prof, sede: sed, site: SITE, googleCalendar: enlaceGoogleCalendar(r, prof, sed) }),
      crearIcs({ ...resumen(r, prof, sed), cancelar: `${SITE}/reserva/cancelar?token=${r.cancel_token}` }),
    )
      .catch((e) => (console.error('Correo', e), false)),
  ]);
  if (eventoId) await db.from('reservas').update({ google_event_id: eventoId }).eq('id', r.id);

  return { ok: true, correo, reserva: resumen(r, prof, sed) };
}

// --- Ver y cancelar (desde el enlace del correo) ------------------------------

async function porToken(token: unknown) {
  if (!UUID.test(String(token ?? ''))) throw new Fallo(400, 'El enlace no es válido.');
  const { data } = await db.from('reservas').select('*, profesionales(*), sedes(*)')
    .eq('cancel_token', String(token)).maybeSingle();
  if (!data) throw new Fallo(404, 'No encontramos esta reserva.');
  return data;
}

async function ver(b: { token?: string }) {
  const r = await porToken(b.token);
  return {
    estado: r.estado,
    cancelable: r.estado === 'confirmada' && Date.parse(r.inicio) > Date.now(),
    reserva: resumen(r, r.profesionales, r.sedes),
  };
}

async function cancelar(b: { token?: string }) {
  const r = await porToken(b.token);
  if (r.estado === 'cancelada') return { ok: true, yaCancelada: true };
  if (Date.parse(r.inicio) <= Date.now()) throw new Fallo(409, 'Esta hora ya pasó.');
  const { error } = await db.from('reservas').update({ estado: 'cancelada', cancelada_en: new Date().toISOString() })
    .eq('id', r.id).eq('estado', 'confirmada');
  if (error) throw error;
  const calId = r.profesionales.calendar_id ?? r.sedes.calendar_id;
  if (r.google_event_id && calId) await borrarEvento(calId, r.google_event_id).catch((e) => console.error('Google', e));
  return { ok: true };
}

// --- Formato ------------------------------------------------------------------

const utcCompacto = (iso: string) => new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

// deno-lint-ignore no-explicit-any
type Fila = Record<string, any>;

function resumen(r: Fila, prof: Fila, sede: Fila) {
  return {
    id: r.id, inicio: r.inicio, fin: r.fin, nombre: r.nombre.split(' ')[0],
    profesional: prof.nombre, especialidad: prof.especialidad,
    sede: sede.nombre, direccion: sede.direccion, maps: sede.maps_url, whatsapp: sede.whatsapp,
  };
}

function enlaceGoogleCalendar(r: Fila, prof: Fila, sede: Fila) {
  const q = new URLSearchParams({
    action: 'TEMPLATE',
    text: `Hora dental · ${prof.nombre}`,
    dates: `${utcCompacto(r.inicio)}/${utcCompacto(r.fin)}`,
    details: `Culmen Odontología · ${prof.especialidad}\nPara cancelar: ${SITE}/reserva/cancelar?token=${r.cancel_token}`,
    location: `Culmen Odontología, ${sede.direccion}`,
  });
  return `https://calendar.google.com/calendar/render?${q}`;
}

// --- Correo (SMTP o Resend) ---------------------------------------------------
// Supabase bloquea los puertos 25 y 587: usar SMTP con TLS directo en 465.

async function enviarCorreo(para: string, { asunto, html, texto }: { asunto: string; html: string; texto: string }, ics: string) {
  const from = Deno.env.get('EMAIL_FROM') ?? 'Culmen Odontología <reservas@culmenodontologia.cl>';
  const replyTo = Deno.env.get('EMAIL_REPLY_TO') ?? 'contacto@culmenodontologia.cl';
  const host = Deno.env.get('SMTP_HOST');
  if (host) {
    const smtp = new SMTPClient({
      connection: {
        hostname: host,
        port: Number(Deno.env.get('SMTP_PORT') ?? 465),
        tls: true,
        auth: { username: Deno.env.get('SMTP_USER')!, password: Deno.env.get('SMTP_PASS')! },
      },
    });
    try {
      await smtp.send({
        from, to: para, replyTo, subject: asunto, html,
        content: texto,
        attachments: [{ filename: 'hora-culmen.ics', content: ics, encoding: 'text', contentType: 'text/calendar; charset=utf-8; method=PUBLISH' }],
      });
      return true;
    } finally {
      await smtp.close();
    }
  }
  const key = Deno.env.get('RESEND_API_KEY');
  if (!key) { console.warn('Sin SMTP_HOST ni RESEND_API_KEY: correo omitido.'); return false; }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from, reply_to: replyTo, to: [para], subject: asunto, html, text: texto,
      attachments: [{ filename: 'hora-culmen.ics', content: btoa(String.fromCharCode(...new TextEncoder().encode(ics))) }],
    }),
  });
  if (!res.ok) console.error('Resend', res.status, await res.text());
  return res.ok;
}

// --- Google Calendar (cuenta de servicio, JWT firmado con WebCrypto) ----------

let tokenCache: { valor: string; vence: number } | null = null;

async function tokenGoogle() {
  const raw = Deno.env.get('GOOGLE_SERVICE_ACCOUNT');
  if (!raw) return null;
  if (tokenCache && tokenCache.vence > Date.now() + 60_000) return tokenCache.valor;
  const sa = JSON.parse(raw);
  const b64 = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const txt = (o: unknown) => b64(new TextEncoder().encode(JSON.stringify(o)));
  const ahora = Math.floor(Date.now() / 1000);
  const sinFirma = `${txt({ alg: 'RS256', typ: 'JWT' })}.${txt({
    iss: sa.client_email, scope: 'https://www.googleapis.com/auth/calendar',
    aud: 'https://oauth2.googleapis.com/token', iat: ahora, exp: ahora + 3600,
  })}`;
  const der = Uint8Array.from(atob(sa.private_key.replace(/-----[^-]+-----|\s/g, '')), (c) => c.charCodeAt(0));
  const clave = await crypto.subtle.importKey('pkcs8', der, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign']);
  const firma = new Uint8Array(await crypto.subtle.sign('RSASSA-PKCS1-v1_5', clave, new TextEncoder().encode(sinFirma)));
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: `${sinFirma}.${b64(firma)}` }),
  });
  if (!res.ok) throw new Error(`token ${res.status} ${await res.text()}`);
  const { access_token, expires_in } = await res.json();
  tokenCache = { valor: access_token, vence: Date.now() + expires_in * 1000 };
  return access_token as string;
}

async function google(ruta: string, init: RequestInit = {}) {
  const token = await tokenGoogle();
  if (!token) return null;
  const res = await fetch(`https://www.googleapis.com/calendar/v3${ruta}`, {
    ...init, headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  });
  if (!res.ok && res.status !== 410) throw new Error(`${ruta} ${res.status} ${await res.text()}`);
  return res.status === 204 || res.status === 410 ? {} : res.json();
}

// ponytail: si Google no responde se muestran las horas sin descontar sus bloqueos;
// la base de datos igual impide reservas duplicadas entre pacientes web.
async function ocupadoGoogle(ids: string[], desde: string, hasta: string): Promise<Record<string, { start: string; end: string }[]>> {
  try {
    const r = await google('/freeBusy', {
      method: 'POST',
      body: JSON.stringify({ timeMin: desde, timeMax: hasta, items: ids.map((id) => ({ id })) }),
    });
    return Object.fromEntries(Object.entries(r?.calendars ?? {}).map(([id, c]) => [id, (c as Fila).busy ?? []]));
  } catch (e) {
    console.error('freeBusy', e);
    return {};
  }
}

async function crearEvento(calId: string | null, r: Fila, prof: Fila, sede: Fila) {
  if (!calId) return null;
  const ev = await google(`/calendars/${encodeURIComponent(calId)}/events`, {
    method: 'POST',
    body: JSON.stringify({
      summary: `${r.nombre} · ${prof.nombre}`,
      location: `${sede.nombre} — ${sede.direccion}`,
      description: [
        'Reserva web', `Paciente: ${r.nombre}`, `RUT: ${r.rut}`, `Teléfono: ${r.telefono}`, `Correo: ${r.email}`,
        r.prevision && `Previsión: ${r.prevision}`, r.motivo && `Motivo: ${r.motivo}`, r.comentario && `Comentario: ${r.comentario}`,
      ].filter(Boolean).join('\n'),
      start: { dateTime: r.inicio, timeZone: TZ },
      end: { dateTime: r.fin, timeZone: TZ },
      extendedProperties: { private: { reserva_id: r.id } },
    }),
  });
  return ev?.id ?? null;
}

const borrarEvento = (calId: string, id: string) =>
  google(`/calendars/${encodeURIComponent(calId)}/events/${encodeURIComponent(id)}`, { method: 'DELETE' });
