// Archivo .ics de la cita (RFC 5545). Lo adjunta el correo de confirmación y lo
// descarga la pantalla de confirmación del sitio: Apple Calendar, Outlook y Gmail lo abren.

const utc = (instante) => new Date(instante).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
const texto = (s) =>
  String(s ?? '').replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
// Las líneas largas se pliegan: salto + espacio al inicio de la continuación.
const plegar = (linea) => linea.match(/.{1,70}/gu).join('\r\n ');

export function crearIcs({ id, inicio, fin, profesional, especialidad, direccion, cancelar }) {
  const descripcion = [`Culmen Odontología · ${especialidad}`, cancelar && `Para cancelar: ${cancelar}`]
    .filter(Boolean)
    .join('\n');
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Culmen Odontologia//Reservas//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${id}@culmenodontologia.cl`,
    `DTSTAMP:${utc(Date.now())}`,
    `DTSTART:${utc(inicio)}`,
    `DTEND:${utc(fin)}`,
    `SUMMARY:${texto(`Hora dental · ${profesional}`)}`,
    `LOCATION:${texto(`Culmen Odontología, ${direccion}`)}`,
    `DESCRIPTION:${texto(descripcion)}`,
    'BEGIN:VALARM',
    'TRIGGER:-P1D',
    'ACTION:DISPLAY',
    `DESCRIPTION:${texto('Mañana tienes hora en Culmen Odontología')}`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].map(plegar).join('\r\n') + '\r\n';
}
