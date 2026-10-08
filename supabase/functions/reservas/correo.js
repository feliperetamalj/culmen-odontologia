// Correo de confirmación de hora. HTML para clientes de correo: tablas, estilos en
// línea y fuentes de respaldo (Gmail y Outlook ignoran casi todo lo demás).
// Colores y tipografía = los del sitio: tinta #121110, oro #C9A35A / #8A6A2F, marfil.

const TZ = 'America/Santiago';
const C = {
  fondo: '#F4EFE6', tarjeta: '#FFFFFF', tinta: '#141210', oscuro: '#121110', suave: '#6B6358',
  oro: '#C9A35A', oroTexto: '#8A6A2F', oroClaro: '#FBF7EE', borde: '#ECE4D6', claroSobreOscuro: '#BDB4A6',
};
const SERIF = "'Cormorant Garamond', Georgia, 'Times New Roman', serif";
const SANS = "Helvetica, Arial, sans-serif";

const fmt = (opc) => (i) => new Intl.DateTimeFormat('es-CL', { timeZone: TZ, ...opc }).format(new Date(i));
const diaSemana = fmt({ weekday: 'long' });
const diaNumero = fmt({ day: 'numeric' });
const mes = fmt({ month: 'short' });
const fechaLarga = fmt({ weekday: 'long', day: 'numeric', month: 'long' });
const hora = fmt({ hour: '2-digit', minute: '2-digit', hour12: false });
const mayus = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const boton = (href, texto, primario) =>
  `<a href="${esc(href)}" style="display:inline-block;padding:14px 24px;border-radius:999px;font:700 14px ${SANS};text-decoration:none;` +
  (primario ? `background:${C.oro};color:${C.oscuro};` : `border:1px solid #D9CDB6;color:${C.tinta};`) +
  `">${texto}</a>`;

const etiqueta = (t, color = C.oroTexto) =>
  `<p style="margin:0 0 6px;font:700 11px ${SANS};letter-spacing:.18em;text-transform:uppercase;color:${color}">${t}</p>`;

/**
 * @param r     fila de reservas
 * @param prof  fila de profesionales
 * @param sede  fila de sedes
 * @param site  URL del sitio (logo, retratos y enlace de cancelación)
 * @param googleCalendar  enlace "agregar a Google Calendar"
 */
export function correoConfirmacion({ r, prof, sede, site, googleCalendar }) {
  const nombre = esc(r.nombre.split(' ')[0]);
  const cancelar = `${site}/reserva/cancelar?token=${r.cancel_token}`;
  const wa = `https://wa.me/${sede.whatsapp.replace('+', '')}`;
  const minutos = Math.round((Date.parse(r.fin) - Date.parse(r.inicio)) / 60000);
  const asunto = `Tu hora en Culmen: ${fechaLarga(r.inicio)}, ${hora(r.inicio)}`;

  const datos = [
    ['Paciente', r.nombre], ['Celular', String(r.telefono).replace(/^\+56(\d)(\d{4})(\d{4})$/, '+56 $1 $2 $3')], ['Motivo', r.motivo], ['Previsión', r.prevision], ['Comentario', r.comentario],
  ].filter(([, v]) => v).map(([k, v]) =>
    `<tr><td style="padding:6px 0;width:96px;vertical-align:top;font:12px ${SANS};color:${C.suave}">${k}</td>` +
    `<td style="padding:6px 0;font:600 14px ${SANS};color:${C.tinta}">${esc(v)}</td></tr>`).join('');

  const paso = (n, titulo, texto) =>
    `<tr><td style="width:40px;vertical-align:top;padding:0 0 16px">
      <div style="width:28px;height:28px;border-radius:50%;background:${C.oscuro};color:${C.oro};font:700 13px/28px ${SANS};text-align:center">${n}</div>
    </td><td style="vertical-align:top;padding:2px 0 16px">
      <p style="margin:0;font:700 14px ${SANS};color:${C.tinta}">${titulo}</p>
      <p style="margin:2px 0 0;font:14px/1.5 ${SANS};color:${C.suave}">${texto}</p>
    </td></tr>`;

  const html = `<!doctype html>
<html lang="es"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only"><meta name="supported-color-schemes" content="light">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600&display=swap" rel="stylesheet">
<title>${esc(asunto)}</title>
</head>
<body style="margin:0;padding:0;background:${C.fondo};-webkit-text-size-adjust:100%">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${esc(`${mayus(fechaLarga(r.inicio))} a las ${hora(r.inicio)} con ${prof.nombre}, ${sede.nombre}.`)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.fondo}"><tr><td align="center" style="padding:28px 12px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px">

  <!-- Encabezado -->
  <tr><td style="background:${C.oscuro};border-radius:20px 20px 0 0;padding:30px 32px 26px;text-align:center">
    <img src="${site}/email/logo.png" width="190" alt="Culmen Odontología" style="display:inline-block;border:0;max-width:190px;height:auto">
    <div style="width:48px;height:2px;background:${C.oro};margin:20px auto 0;font-size:0;line-height:0">&nbsp;</div>
  </td></tr>

  <!-- Saludo -->
  <tr><td style="background:${C.tarjeta};padding:36px 32px 8px;text-align:center">
    <div style="display:inline-block;width:44px;height:44px;border-radius:50%;background:${C.oroClaro};border:1px solid ${C.borde};color:${C.oroTexto};font:700 22px/44px ${SANS};margin-bottom:14px">&#10003;</div>
    ${etiqueta('Hora confirmada')}
    <h1 style="margin:0;font:600 34px/1.1 ${SERIF};color:${C.tinta}">Te esperamos, ${nombre}.</h1>
    <p style="margin:10px 0 0;font:15px/1.6 ${SANS};color:${C.suave}">Tu hora quedó reservada. Aquí tienes todo lo que necesitas.</p>
  </td></tr>

  <!-- Ficha de la cita -->
  <tr><td style="background:${C.tarjeta};padding:24px 32px">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${C.borde};border-radius:16px;background:${C.oroClaro}">
      <tr>
        <td width="104" style="width:104px;padding:18px 0 18px 18px;vertical-align:top">
          <table role="presentation" width="86" cellpadding="0" cellspacing="0" style="background:${C.oscuro};border-radius:14px">
            <tr><td style="padding:12px 0 2px;text-align:center;font:700 11px ${SANS};letter-spacing:.18em;text-transform:uppercase;color:${C.oro}">${esc(mes(r.inicio).replace('.', ''))}</td></tr>
            <tr><td style="text-align:center;font:600 40px/1 ${SERIF};color:#FFFFFF">${diaNumero(r.inicio)}</td></tr>
            <tr><td style="padding:4px 0 12px;text-align:center;font:12px ${SANS};color:${C.claroSobreOscuro}">${esc(diaSemana(r.inicio))}</td></tr>
          </table>
        </td>
        <td style="padding:18px 18px 18px 14px;vertical-align:top">
          ${etiqueta('Hora')}
          <p style="margin:0;font:700 24px/1.1 ${SANS};color:${C.tinta}">${hora(r.inicio)} <span style="font-weight:400;color:${C.suave};font-size:16px">– ${hora(r.fin)} · ${minutos} min</span></p>
          <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:16px"><tr>
            <td style="width:52px;vertical-align:middle"><img src="${site}/email/equipo/${esc(prof.id)}.jpg" width="44" height="44" alt="" style="display:block;border-radius:50%;border:0"></td>
            <td style="vertical-align:middle">
              <p style="margin:0;font:700 15px ${SANS};color:${C.tinta}">${esc(prof.nombre)}</p>
              <p style="margin:2px 0 0;font:13px ${SANS};color:${C.suave}">${esc(prof.especialidad)}</p>
            </td>
          </tr></table>
        </td>
      </tr>
      <tr><td colspan="2" style="padding:0 18px 18px">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid ${C.borde}"><tr><td style="padding-top:14px">
          ${etiqueta('Sede')}
          <p style="margin:0;font:700 15px ${SANS};color:${C.tinta}">${esc(sede.nombre)}</p>
          <p style="margin:2px 0 0;font:14px ${SANS};color:${C.suave}">${esc(sede.direccion)}</p>
        </td></tr></table>
      </td></tr>
    </table>
  </td></tr>

  <!-- Acciones -->
  <tr><td style="background:${C.tarjeta};padding:0 32px 8px;text-align:center">
    ${boton(googleCalendar, 'Agregar a Google Calendar', true)}
    <span style="display:inline-block;width:8px"></span>
    ${boton(sede.maps_url, 'Cómo llegar', false)}
    <p style="margin:14px 0 0;font:13px/1.6 ${SANS};color:${C.suave}">¿Apple Calendar u Outlook? Abre el archivo adjunto <b style="color:${C.tinta}">hora-culmen.ics</b>: queda en tu calendario con recordatorio el día antes.</p>
  </td></tr>

  <!-- Datos de la reserva -->
  <tr><td style="background:${C.tarjeta};padding:28px 32px 4px">
    ${etiqueta('Datos de tu reserva', C.suave)}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${datos}</table>
  </td></tr>

  <!-- Antes de tu visita -->
  <tr><td style="background:${C.tarjeta};padding:24px 32px 12px">
    <h2 style="margin:0 0 16px;font:600 24px/1.2 ${SERIF};color:${C.tinta}">Antes de tu visita</h2>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      ${paso(1, 'Llega 10 minutos antes', 'Así hacemos tu ingreso con calma.')}
      ${paso(2, 'Trae tu cédula de identidad', 'Y tu credencial de seguro o previsión, si tienes. Si tu seguro no tiene convenio, te dejamos listo el reembolso el mismo día.')}
      ${paso(3, '¿Te da miedo el dentista?', 'Cuéntanos al llegar. Atendemos sin juicios y tenemos opciones de sedación.')}
    </table>
  </td></tr>

  <!-- ¿No puedes asistir? -->
  <tr><td style="background:${C.tarjeta};padding:8px 32px 36px">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.fondo};border-radius:14px"><tr><td style="padding:18px 20px">
      <p style="margin:0;font:700 14px ${SANS};color:${C.tinta}">¿No puedes asistir?</p>
      <p style="margin:4px 0 12px;font:14px/1.5 ${SANS};color:${C.suave}">Cancela tu hora para que otro paciente pueda usarla, o escríbenos para cambiarla.</p>
      <a href="${cancelar}" style="font:700 14px ${SANS};color:${C.oroTexto}">Cancelar mi hora</a>
      <span style="color:${C.borde}">&nbsp;&nbsp;|&nbsp;&nbsp;</span>
      <a href="${wa}" style="font:700 14px ${SANS};color:${C.oroTexto}">WhatsApp ${esc(sede.nombre.replace('Sucursal ', ''))}</a>
    </td></tr></table>
  </td></tr>

  <!-- Pie -->
  <tr><td style="background:${C.oscuro};border-radius:0 0 20px 20px;padding:26px 32px;text-align:center">
    <p style="margin:0;font:italic 600 20px/1.3 ${SERIF};color:${C.oro}">Odontología sin miedo, con un plan que decides tú.</p>
    <p style="margin:12px 0 0;font:12px/1.7 ${SANS};color:${C.claroSobreOscuro}">
      Sucursal Centro · 1 Sur N°690, Of. 1116, Edificio Plaza, Talca<br>
      Sucursal Las Rastras · 4 1/2 Norte N°3539, Talca<br>
      Lunes a viernes 9:00–19:00 · Sábado 9:00–13:00
    </p>
    <p style="margin:12px 0 0;font:12px ${SANS};color:${C.claroSobreOscuro}">Recibes este correo porque reservaste una hora en <a href="${site}" style="color:${C.oro}">culmenodontologia.cl</a>.</p>
  </td></tr>

</table>
</td></tr></table>
</body></html>`;

  const texto = [
    `Te esperamos, ${r.nombre.split(' ')[0]}. Tu hora en Culmen Odontología quedó reservada.`,
    '',
    `Día: ${mayus(fechaLarga(r.inicio))}`,
    `Hora: ${hora(r.inicio)} – ${hora(r.fin)}`,
    `Profesional: ${prof.nombre} (${prof.especialidad})`,
    `Sede: ${sede.nombre}, ${sede.direccion}`,
    '',
    `Agregar a Google Calendar: ${googleCalendar}`,
    `Cómo llegar: ${sede.maps_url}`,
    `Cancelar tu hora: ${cancelar}`,
  ].join('\n');

  return { asunto, html, texto };
}
