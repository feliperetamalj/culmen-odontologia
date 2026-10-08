// Datos de la clínica. Fuente: culmenodontologia.cl y fichas de Google Maps (7 oct 2026).

export const CLINICA = {
  nombre: 'Culmen Odontología',
  lema: 'La evolución de la odontología',
  email: 'contacto@culmenodontologia.cl',
  horario: [
    ['Lunes a viernes', '9:00 – 19:00'],
    ['Sábado', '9:00 – 13:00'],
    ['Domingo y festivos', 'Cerrado'],
  ],
};

// Crédito del desarrollo en el pie de página.
export const DESARROLLO = { nombre: 'RB Software Solutions', anio: 2026 };

export const SEDES = [
  {
    id: 'centro',
    nombre: 'Sucursal Centro',
    direccion: '1 Sur N°690, Of. 1116, Piso 11',
    referencia: 'Edificio Plaza, Talca',
    whatsapp: '56978778785',
    telefono: '+56 9 7877 8785',
    coords: [-35.4271861, -71.6669121],
    maps: 'https://maps.app.goo.gl/oaRH7erTnJ3T1Vxj6',
    resenas: { nota: 5.0, total: 208 },
  },
  {
    id: 'las-rastras',
    nombre: 'Sucursal Las Rastras',
    direccion: '4 1/2 Norte N°3539',
    referencia: 'Las Rastras, Talca',
    whatsapp: '56982751418',
    telefono: '+56 9 8275 1418',
    coords: [-35.4308928, -71.6215055],
    maps: 'https://www.google.com/maps/place/Culmen+Odontolog%C3%ADa+-+Talca+%7C+Sucursal+Las+Rastras/@-35.4308928,-71.6215055,17z/data=!4m6!3m5!1s0x9665c77eaf30e119:0x4f94a8007608dc9a!8m2!3d-35.4308928!4d-71.6215055!16s%2Fg%2F11s5w4v34j',
    resenas: { nota: 5.0, total: 346 },
  },
];

export const sedePorId = (id) => SEDES.find((s) => s.id === id) ?? SEDES[0];

export const RESENAS = {
  nota: 5.0,
  total: SEDES.reduce((n, s) => n + s.resenas.total, 0),
  fecha: '7 de octubre de 2026',
};

export const NAV = [
  { a: '/nosotros', texto: 'Nosotros' },
  { a: '/ortodoncia', texto: 'Ortodoncia' },
  { a: '/implantes-y-rehabilitacion', texto: 'Implantes' },
  { a: '/sedacion', texto: 'Sedación' },
  { a: '/especialidades', texto: 'Especialidades' },
  { a: '/financiamiento', texto: 'Financiamiento' },
];

export const PREGUNTAS = [
  {
    p: '¿Cuánto dura la primera cita?',
    r: 'Hasta 45 minutos. Te examinamos, resolvemos tus dudas y te entregamos un diagnóstico claro con un plan de tratamiento que defines con nosotros.',
  },
  {
    p: '¿Puedo usar mi seguro complementario?',
    r: 'Tenemos bonificación automática en línea (I-Med) con Zurich, Consorcio, Chilena Consolidada, Bice Vida y Sermecoop. Si tu seguro no está en la lista, te dejamos listo el trámite de reembolso el mismo día.',
  },
  {
    p: 'Me da miedo ir al dentista. ¿Qué hago?',
    r: 'Cuéntanoslo al reservar. Te atendemos sin juicios y tenemos dos opciones de sedación: consciente (gas de la risa, para adultos y niños) y endovenosa profunda, con médico anestesista en pabellón certificado por la Seremi de Salud.',
  },
  {
    p: '¿Atienden niños?',
    r: 'Sí. Odontopediatría con la Dra. Rosario Cárdenas, especialista, y la Dra. Karina Huerta. Para ortopedia infantil (disyuntores, máscaras de tracción) atiende la Dra. Carla Aravena.',
  },
  {
    p: '¿Cómo cancelo o cambio mi hora?',
    r: 'El correo de confirmación trae un enlace para cancelar en un clic, y así la hora queda libre para otro paciente. Para cambiarla, cancela y reserva otra, o escríbenos por WhatsApp.',
  },
  {
    p: '¿Atienden urgencias?',
    r: 'Sí, dentro de odontología general. Si tienes dolor, escríbenos por WhatsApp a la sede más cercana para buscarte la primera hora posible.',
  },
  {
    p: '¿Qué medios de pago aceptan?',
    r: 'Efectivo, débito y crédito, con facilidades de pago en cuotas. Revisa las promociones de cuotas sin interés con tarjetas bancarias.',
  },
];

// Video de presentación oficial (canal de YouTube de la clínica). Fondo del hero.
export const VIDEO = { youtube: 'a3OkmneGoNU', titulo: 'Presentación Culmen Odontología, Talca' };
