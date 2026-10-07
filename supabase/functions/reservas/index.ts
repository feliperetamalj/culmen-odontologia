// Edge Function pública del sistema de reservas.
// POST { accion: 'horas' | 'reservar' | 'ver' | 'cancelar', ... }
//
// Secretos (Supabase → Edge Functions → Secrets):
//   RESEND_API_KEY          correo de confirmación (sin ella, la reserva funciona y el correo se omite)
//   EMAIL_FROM              "Culmen Odontología <reservas@culmenodontologia.cl>"
//   EMAIL_REPLY_TO          contacto@culmenodontologia.cl
//   SITE_URL                https://www.culmenodontologia.cl
//   GOOGLE_SERVICE_ACCOUNT  JSON de la cuenta de servicio con acceso a los calendarios
import { createClient } from 'npm:@supabase/supabase-js@2.45.4';
import { validarPaciente } from './validar.js';

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
    enviarCorreo(r.email, `Hora confirmada · ${fechaLarga(r.inicio)}, ${hora(r.inicio)}`, correoConfirmacion(r, prof, sed))
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

const fechaLarga = (iso: string) =>
  new Intl.DateTimeFormat('es-CL', { timeZone: TZ, weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(iso));
const hora = (iso: string) =>
  new Intl.DateTimeFormat('es-CL', { timeZone: TZ, hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(iso));
const esc = (s: unknown) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
const utcCompacto = (iso: string) => new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

// deno-lint-ignore no-explicit-any
type Fila = Record<string, any>;

function resumen(r: Fila, prof: Fila, sede: Fila) {
  return {
    inicio: r.inicio, fin: r.fin, nombre: r.nombre.split(' ')[0],
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

// --- Correo (Resend) ----------------------------------------------------------

async function enviarCorreo(para: string, asunto: string, html: string) {
  const key = Deno.env.get('RESEND_API_KEY');
  if (!key) { console.warn('RESEND_API_KEY no configurada: correo omitido.'); return false; }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: Deno.env.get('EMAIL_FROM') ?? 'Culmen Odontología <reservas@culmenodontologia.cl>',
      reply_to: Deno.env.get('EMAIL_REPLY_TO') ?? 'contacto@culmenodontologia.cl',
      to: [para], subject: asunto, html,
    }),
  });
  if (!res.ok) console.error('Resend', res.status, await res.text());
  return res.ok;
}

function correoConfirmacion(r: Fila, prof: Fila, sede: Fila) {
  const fila = (k: string, v: string) =>
    `<tr><td style="padding:10px 0;color:#6b6358;font-size:13px;width:110px;vertical-align:top">${k}</td>` +
    `<td style="padding:10px 0;color:#141210;font-size:15px;font-weight:600">${v}</td></tr>`;
  const cancelar = `${SITE}/reserva/cancelar?token=${r.cancel_token}`;
  const wa = `https://wa.me/${sede.whatsapp.replace('+', '')}`;
  return `<!doctype html><html lang="es"><body style="margin:0;background:#f4efe6;font-family:Helvetica,Arial,sans-serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4efe6;padding:24px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden">
  <tr><td style="background:#121110;padding:28px 32px"><img src="${SITE}/email/logo.png" width="200" alt="Culmen Odontología" style="display:block;border:0"></td></tr>
  <tr><td style="padding:32px">
    <p style="margin:0 0 6px;color:#8a6a2f;font-size:12px;letter-spacing:.16em;text-transform:uppercase;font-weight:700">Hora confirmada</p>
    <h1 style="margin:0 0 16px;color:#141210;font-size:24px;line-height:1.25">Hola ${esc(r.nombre.split(' ')[0])}, te esperamos.</h1>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #ece4d6;border-bottom:1px solid #ece4d6;margin:8px 0 24px">
      ${fila('Día', esc(fechaLarga(r.inicio)))}
      ${fila('Hora', `${hora(r.inicio)} – ${hora(r.fin)}`)}
      ${fila('Profesional', `${esc(prof.nombre)}<br><span style="font-weight:400;color:#6b6358;font-size:13px">${esc(prof.especialidad)}</span>`)}
      ${fila('Sede', `${esc(sede.nombre)}<br><span style="font-weight:400;color:#6b6358;font-size:13px">${esc(sede.direccion)}</span>`)}
    </table>
    <table role="presentation" cellpadding="0" cellspacing="0"><tr>
      <td style="background:#121110;border-radius:999px"><a href="${enlaceGoogleCalendar(r, prof, sede)}" style="display:inline-block;padding:13px 22px;color:#ffffff;text-decoration:none;font-size:14px;font-weight:700">Agregar a mi calendario</a></td>
      <td style="width:10px"></td>
      <td style="border:1px solid #d9cdb6;border-radius:999px"><a href="${esc(sede.maps_url)}" style="display:inline-block;padding:12px 20px;color:#141210;text-decoration:none;font-size:14px;font-weight:700">Cómo llegar</a></td>
    </tr></table>
    <p style="margin:28px 0 8px;color:#141210;font-size:15px;font-weight:700">Para tu visita</p>
    <ul style="margin:0;padding-left:18px;color:#3d3830;font-size:14px;line-height:1.7">
      <li>Llega 10 minutos antes.</li>
      <li>Trae tu cédula de identidad y, si tienes, tu credencial de seguro o previsión.</li>
      <li>Si sientes ansiedad o miedo al dentista, cuéntanos: tenemos opciones de sedación.</li>
    </ul>
    <p style="margin:28px 0 0;color:#6b6358;font-size:13px;line-height:1.6">¿No puedes asistir? <a href="${cancelar}" style="color:#8a6a2f;font-weight:700">Cancela tu hora aquí</a> para liberarla, o escríbenos por <a href="${wa}" style="color:#8a6a2f;font-weight:700">WhatsApp</a>.</p>
  </td></tr>
  <tr><td style="background:#faf7f1;padding:20px 32px;color:#6b6358;font-size:12px;line-height:1.6">Culmen Odontología · Talca<br>Responde este correo si tienes dudas: contacto@culmenodontologia.cl</td></tr>
</table></td></tr></table></body></html>`;
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
