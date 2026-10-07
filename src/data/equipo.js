// Equipo clínico y de apoyo. Fuente: culmenodontologia.cl/nosotros.
// `id` es el mismo de la tabla `profesionales` en Supabase.
// `foto: false` → el sitio anterior usaba una foto de banco de imágenes; se muestra un monograma.

export const PROFESIONALES = [
  {
    id: 'andres-aguayo', nombre: 'Dr. Andrés Aguayo Espinoza', especialidad: 'Ortodoncia', foto: true,
    cv: [
      'Cirujano dentista, Universidad de Concepción, con distinción máxima.',
      'Especialista en Ortodoncia y Ortopedia Dentomaxilofacial, Pontificia Universidad Católica, con distinción máxima.',
      'Diplomado en Ortodoncia Preventiva e Interceptiva, Universidad Mayor.',
      'Certificación Invisalign Doctor (alineadores invisibles) y en instalación de microtornillos.',
      '15 años de experiencia en servicio público y privado.',
      'Casos de alta complejidad: anomalías faciales, pacientes de ortodoncia quirúrgica e hiperplasias condilares.',
      'Miembro de la Sociedad de Ortodoncia y del Colegio de Dentistas de Chile.',
    ],
  },
  {
    id: 'carla-aravena', nombre: 'Dra. Carla Aravena', especialidad: 'Ortodoncia y Ortopedia', foto: true,
    cv: [
      'Cirujana dentista enfocada en Ortodoncia y Ortopedia Dentomaxilofacial.',
      'Diagnóstico y tratamiento de anomalías dentales y faciales.',
      'Tratamientos para pacientes de todas las edades.',
    ],
  },
  {
    id: 'carlos-mendez', nombre: 'Dr. Carlos Méndez Carrasco', especialidad: 'Rehabilitación Oral', foto: true, sede: 'Ambas sedes',
    cv: [
      'Cirujano dentista, Universidad de Talca, con distinción máxima.',
      'Especialista en Rehabilitación Oral con mención en prótesis implanto y dentosoportada, Universidad del Desarrollo (2023).',
      'Diplomado en odontología restauradora adhesiva biomimética, Universidad Diego Portales (2021).',
      'Diplomado en composites posteriores con el Dr. Carlos Villavicencio, Brasil.',
      'Más de 7 años de experiencia.',
    ],
  },
  {
    id: 'rosario-cardenas', nombre: 'Dra. Rosario Cárdenas Camus', especialidad: 'Odontopediatría', foto: true,
    cv: [
      'Cirujano dentista, Universidad de Talca, con distinción máxima.',
      'Especialista en Odontopediatría, Universidad Andrés Bello, con distinción máxima.',
      'Diplomados en diagnóstico ortodóncico (UNAB) y ortodoncia interceptiva (CPO Baurú, Brasil).',
      'Magíster y diplomado en Docencia, Universidad Andrés Bello.',
      'Miembro de la Sociedad de Odontopediatría y del Colegio de Dentistas de Chile.',
      'Más de 6 años de experiencia clínica.',
    ],
  },
  {
    id: 'juan-pablo-aguilera', nombre: 'Dr. Juan Pablo Aguilera', especialidad: 'Implantología', foto: true, sede: 'Ambas sedes',
    cv: [
      'Cirujano dentista, Universidad de Talca, con distinción máxima.',
      'Especialista en Implantología Bucomaxilofacial, Universidad del Desarrollo Concepción, con distinción máxima.',
      'Premio al mejor alumno de postgrado en Implantología Bucomaxilofacial UDD.',
      'Diplomado en Implantología, Universidad de Santiago de Chile.',
      'Miembro de la Sociedad de Implantología Oral de Chile, sede Concepción.',
    ],
  },
  {
    id: 'karina-valdes', nombre: 'Dra. Karina Valdés Gaete', especialidad: 'Rehabilitación Oral', foto: false, sede: 'Las Rastras',
    cv: [
      'Cirujana dentista, Universidad de Talca, con distinción máxima.',
      'Especialista en rehabilitación oral dento e implantoasistida, Universidad del Desarrollo, con distinción máxima.',
      'Diplomado en Estética Maxilofacial, Brasil.',
      '7 años de experiencia en rehabilitaciones de alta complejidad y diseño de sonrisa.',
    ],
  },
  {
    id: 'francisca-del-pino', nombre: 'Dra. Francisca Del Pino', especialidad: 'Periodoncia', foto: true,
    cv: [
      'Cirujano dentista, Universidad de Talca.',
      'Especialista en Periodoncia, Universidad del Desarrollo, Santiago.',
      'Diplomada en Cirugía Plástica Periodontal y Periimplantaria, Universidad de Talca.',
      'Residencia clínica en París, centro de educación continua 26k.',
      'Miembro de la Sociedad de Periodoncia de Chile. 10 años de experiencia.',
    ],
  },
  {
    id: 'sergio-espinoza', nombre: 'Dr. Sergio Espinoza Lazo', especialidad: 'Rehabilitación Oral', foto: true, sede: 'Las Rastras',
    cv: [
      'Cirujano dentista, Universidad San Sebastián.',
      'Especialista en Rehabilitación Oral, Universidad del Desarrollo.',
      'Diplomado en odontología restauradora biomimética, Universidad Diego Portales.',
      '10 años de experiencia en servicio privado.',
    ],
  },
  {
    id: 'constanza-yanez', nombre: 'Dra. Constanza Yáñez Fuentes', especialidad: 'Odontología General', foto: true, sede: 'Ambas sedes',
    cv: [
      'Cirujana dentista, Universidad de Talca, con distinción máxima.',
      'Semestre académico en la Universidad de Granada (España): estética dental y atención de pacientes con necesidades especiales.',
      'Enfoque en odontología preventiva, restauradora y rehabilitación básica, para todas las edades.',
      'Cursa formación en Lengua de Señas Chilena para profesionales de la salud.',
    ],
  },
  {
    id: 'daniela-uribe', nombre: 'Dra. Daniela Uribe', especialidad: 'Armonización Facial', foto: true,
    cv: [
      'Cirujana dentista especialista en Armonización Orofacial.',
      'Procedimientos mínimamente invasivos para el equilibrio del rostro.',
    ],
  },
  {
    id: 'karina-huerta', nombre: 'Dra. Karina Huerta', especialidad: 'Odontología General y Odontopediatría', foto: true,
    cv: [
      'Cirujana dentista enfocada en odontología general y odontopediatría.',
      'Cuidado dental familiar, con especial atención a pacientes infantiles.',
      'Enfoque preventivo y educación en salud oral desde temprana edad.',
    ],
  },
  {
    id: 'barbara-avendano', nombre: 'Dra. Bárbara Avendaño Bravo', especialidad: 'Odontología General', foto: true, sede: 'Las Rastras',
    cv: [
      'Cirujano dentista, Universidad de Talca. 6 años de experiencia.',
      'Diplomado de estética en rehabilitación oral, Universidad de Los Andes.',
      'Máster en estética facial, ENOVA, Brasil.',
      'Cursos en farmacología clínica (PUC), carillas dentales y odontología mínimamente invasiva.',
    ],
  },
  {
    id: 'karla-villarreal', nombre: 'Dra. Karla Villarreal Cepeda', especialidad: 'Odontología General', foto: true, sede: 'Las Rastras',
    cv: [
      'Cirujano dentista, Universidad de Talca (2013).',
      'Diplomado en prevención e intercepción de anomalías dentomaxilares, Universidad del Desarrollo.',
      'Cursa la especialización en Ortodoncia y Ortopedia Dentomaxilofacial, Universidad de Talca.',
      'Más de 10 años de experiencia en servicio público y privado.',
    ],
  },
  { id: 'pablo-astorga', nombre: 'Dr. Pablo Astorga Allende', especialidad: 'Endodoncia', foto: false, cv: [] },
  {
    id: 'pablo-venegas', nombre: 'Dr. Pablo Venegas Quiñones', especialidad: 'Trastornos Temporomandibulares y Dolor Orofacial', foto: true,
    cv: [
      'Cirujano dentista, Universidad de Talca.',
      'Especialista en TTM y Dolor Orofacial, Universidad del Desarrollo – Clínica Alemana.',
      'Diplomado en Estabilidad Mandibular y Oclusión, UDD – Clínica Alemana.',
      'Diplomado en Psicología Clínica con enfoque cognitivo conductual, UNAB.',
      '10 años de experiencia en servicio público y privado.',
    ],
  },
  { id: 'fabian-quiroz', nombre: 'Dr. Fabián Quiroz Escobar', especialidad: 'Cirugía Maxilofacial', foto: false, cv: [] },
  {
    id: 'alicia-aravena', nombre: 'Dra. Alicia Aravena Calderón', especialidad: 'Odontología General', foto: true, sede: 'Centro',
    cv: [
      'Cirujano dentista, Universidad de Talca.',
      'Diplomada en Medicina Estética, Instituto Harmony – FACOP.',
      'Curso de Gestión de Servicios, Calidad y Seguridad en Salud, Universidad de Los Andes.',
    ],
  },
];

export const porId = (id) => PROFESIONALES.find((p) => p.id === id);

export const APOYO = [
  { id: 'samuel-abarza', nombre: 'Samuel Abarza', rol: 'Administración y recepción de pacientes' },
  { id: 'roselvis-limpio', nombre: 'Roselvis Limpio', rol: 'Recepcionista y asistente dental · Centro' },
  { id: 'yeraldy-gajardo', nombre: 'Yeraldy Gajardo', rol: 'TONS · Centro' },
  { id: 'sebastian-campos', nombre: 'Sebastián Campos', rol: 'TONS · Centro' },
  { id: 'camila-olave', nombre: 'Camila Olave', rol: 'TONS · Las Rastras' },
  { id: 'camila-arias', nombre: 'Camila Arias', rol: 'TONS · Las Rastras' },
  { id: 'yemily-valenzuela', nombre: 'Yemily Valenzuela', rol: 'TONS · Las Rastras' },
];

// Motivos de consulta para reservar: cada uno agrupa a quienes lo atienden.
export const AREAS = [
  { id: 'general', nombre: 'Odontología general', detalle: 'Evaluación, caries, limpiezas, urgencias',
    profesionales: ['constanza-yanez', 'alicia-aravena', 'barbara-avendano', 'karla-villarreal', 'karina-huerta'] },
  { id: 'ortodoncia', nombre: 'Ortodoncia', detalle: 'Invisalign, brackets, ortopedia infantil',
    profesionales: ['andres-aguayo', 'carla-aravena'] },
  { id: 'implantes', nombre: 'Implantes y rehabilitación', detalle: 'Implantes, coronas, prótesis',
    profesionales: ['carlos-mendez', 'juan-pablo-aguilera', 'karina-valdes', 'sergio-espinoza'] },
  { id: 'ninos', nombre: 'Odontopediatría', detalle: 'Atención para niños y adolescentes',
    profesionales: ['rosario-cardenas', 'karina-huerta'] },
  { id: 'endodoncia', nombre: 'Endodoncia', detalle: 'Tratamiento de conducto', profesionales: ['pablo-astorga'] },
  { id: 'periodoncia', nombre: 'Periodoncia', detalle: 'Encías y soporte del diente', profesionales: ['francisca-del-pino'] },
  { id: 'ttm', nombre: 'TTM y dolor orofacial', detalle: 'Mandíbula, bruxismo, dolor facial', profesionales: ['pablo-venegas'] },
  { id: 'cirugia', nombre: 'Cirugía maxilofacial', detalle: 'Cirugía de alta complejidad', profesionales: ['fabian-quiroz'] },
  { id: 'armonizacion', nombre: 'Armonización facial', detalle: 'Estética orofacial', profesionales: ['daniela-uribe'] },
];

export const areaPorId = (id) => AREAS.find((a) => a.id === id) ?? AREAS[0];
export const areaDe = (profesionalId) => AREAS.find((a) => a.profesionales.includes(profesionalId)) ?? AREAS[0];

export const CIFRAS = {
  profesionales: PROFESIONALES.length,
  especialidades: AREAS.length,
};
