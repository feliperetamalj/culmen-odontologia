export const whatsapp = (numero, texto = 'Hola, vengo desde el sitio web de Culmen y quiero agendar una hora.') =>
  `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;

export const mapaEmbed = ([lat, lng]) => `https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed`;

const utc = (i) => new Date(i).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
export const googleCalendar = ({ inicio, fin, profesional, especialidad, direccion }) =>
  `https://calendar.google.com/calendar/render?${new URLSearchParams({
    action: 'TEMPLATE',
    text: `Hora dental · ${profesional}`,
    dates: `${utc(inicio)}/${utc(fin)}`,
    details: `Culmen Odontología · ${especialidad}`,
    location: `Culmen Odontología, ${direccion}`,
  })}`;

export const reservarCon = ({ area, profesional, sede } = {}) => {
  const q = new URLSearchParams(Object.entries({ area, profesional, sede }).filter(([, v]) => v));
  const query = q.toString();
  return query ? `/reservar?${query}` : '/reservar';
};
