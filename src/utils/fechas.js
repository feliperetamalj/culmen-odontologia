// Todas las horas se muestran en la hora de la clínica, aunque el paciente esté en otra zona.
export const TZ = 'America/Santiago';

const fmt = (opciones) => new Intl.DateTimeFormat('es-CL', { timeZone: TZ, ...opciones });
const iso = new Intl.DateTimeFormat('en-CA', { timeZone: TZ });

/** "2026-10-09" de un instante, en hora de Santiago. */
export const diaDe = (instante) => iso.format(new Date(instante));
export const hora = (instante) => fmt({ hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(instante));
export const fechaLarga = (instante) => fmt({ weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(instante));
export const esManana = (instante) => Number(fmt({ hour: 'numeric', hour12: false }).format(new Date(instante))) < 13;

/** "YYYY-MM-DD" + n días (aritmética a mediodía UTC: inmune a cambios de horario). */
export const sumarDias = (dia, n) => new Date(Date.parse(`${dia}T12:00:00Z`) + n * 86400000).toISOString().slice(0, 10);
export const rangoDias = (desde, n) => Array.from({ length: n }, (_, i) => sumarDias(desde, i));

const etiqueta = (opciones) => new Intl.DateTimeFormat('es-CL', { timeZone: 'UTC', ...opciones });
export const partesDia = (dia) => {
  const d = new Date(`${dia}T12:00:00Z`);
  return {
    semana: etiqueta({ weekday: 'short' }).format(d).replace('.', ''),
    numero: d.getUTCDate(),
    mes: etiqueta({ month: 'short' }).format(d).replace('.', ''),
    largo: etiqueta({ weekday: 'long', day: 'numeric', month: 'long' }).format(d),
  };
};
