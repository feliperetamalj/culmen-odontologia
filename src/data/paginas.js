// Contenido de la portada y de las páginas de tratamiento. Fuente: culmenodontologia.cl,
// con ortografía corregida. Las imágenes se nombran por archivo de src/assets/fotos.

export const PILARES = [
  { icono: 'corazon', titulo: 'No juzgamos', texto: 'Cada historia es distinta. Te recibimos con empatía, sin críticas sobre tu salud dental actual.' },
  { icono: 'opciones', titulo: 'Libertad de elegir', texto: 'Te explicamos todas las alternativas. Tú decides qué tratamiento se adapta mejor a ti.' },
  { icono: 'escaner', titulo: 'Tecnología de punta', texto: 'Escáner intraoral 3D y diseño digital para diagnósticos precisos y tratamientos más rápidos.' },
  { icono: 'calma', titulo: 'Odontología sin miedo', texto: 'Ambiente relajado, sedación disponible y un equipo preparado para manejar la ansiedad dental.' },
];

export const TRATAMIENTOS = [
  { titulo: 'Ortodoncia', texto: 'Invisalign, brackets metálicos y estéticos, ortopedia para niños.', a: '/ortodoncia', area: 'ortodoncia', foto: 'alineadores' },
  { titulo: 'Implantes y rehabilitación', texto: 'Recupera dientes perdidos con planificación digital 3D.', a: '/implantes-y-rehabilitacion', area: 'implantes', foto: 'planificacion-itero' },
  { titulo: 'Sedación', texto: 'Consciente o endovenosa, para atenderte sin temor.', a: '/sedacion', area: 'general', foto: 'sedacion-consciente' },
  { titulo: 'Odontología general', texto: 'Evaluación, caries, limpiezas, exodoncias y urgencias.', a: '/especialidades#odontologia-general', area: 'general', foto: 'procedimiento' },
  { titulo: 'Odontopediatría', texto: 'Atención para niños y adolescentes, desde la primera visita.', a: '/especialidades#odontopediatria', area: 'ninos', foto: 'modelo-dental' },
  { titulo: 'Más especialidades', texto: 'Endodoncia, periodoncia, TTM, cirugía maxilofacial y armonización facial.', a: '/especialidades', area: 'endodoncia', foto: 'atencion-general' },
];

export const EXPERIENCIA = [
  { titulo: 'Diagnóstico personalizado', texto: 'Nos tomamos el tiempo para evaluar tu caso a fondo y explicarte cada detalle.' },
  { titulo: 'Acompañamiento constante', texto: 'Estamos contigo en cada paso del tratamiento, resolviendo dudas.' },
  { titulo: 'Tecnología de vanguardia', texto: 'Herramientas modernas para procedimientos mínimamente invasivos.' },
  { titulo: 'Calidad humana', texto: 'Un equipo que te trata con la misma calidez que a su propia familia.' },
];

export const INSTALACIONES = [
  { foto: 'escaner-3d', texto: 'Escaneo digital 3D, sin moldes de pasta' },
  { foto: 'sirona-3d', texto: 'Diseño digital de piezas en software Sirona' },
  { foto: 'radiografia-tablet', texto: 'Revisamos tu radiografía contigo, en pantalla' },
  { foto: 'recepcion-paciente', texto: 'Recepción y coordinación de tu tratamiento' },
  { foto: 'modelo-dental', texto: 'Te mostramos cada alternativa en un modelo' },
  { foto: 'escaneo-digital', texto: 'Tecnología de escaneo intraoral' },
];

export const COBERTURA = {
  isapres: ['Zurich', 'Consorcio', 'Chilena Consolidada', 'Bice Vida', 'Sermecoop'],
  convenios: ['Colegio Médico de Talca', 'Viña Terranoble', 'Coca-Cola Embonor Talca'],
  seguro: [
    { valor: '70%', texto: 'de cobertura' },
    { valor: '0,50 UF', texto: 'de deducible' },
    { valor: '40 UF', texto: 'de límite anual' },
  ],
};

// --- Páginas de tratamiento -------------------------------------------------
// Bloques: tarjetas · detalle (texto + imagen) · pasos · chips · equipo

export const PAGINAS = {
  ortodoncia: {
    ruta: '/ortodoncia',
    titulo: 'Ortodoncia en Talca',
    descripcion: 'Invisalign, brackets metálicos y estéticos y ortopedia infantil en Talca. Diagnóstico con escáner 3D y plan conversado contigo.',
    etiqueta: 'Ortodoncia',
    h1: ['Ortodoncia', 'a tu medida'],
    bajada: 'Mejora tu sonrisa y tu salud funcional con un tratamiento diseñado para ti, desde la planificación 3D hasta el último control.',
    foto: 'ortodoncia-hero',
    alt: 'El Dr. Andrés Aguayo, ortodoncista, atendiendo a un paciente en Culmen',
    area: 'ortodoncia',
    bloques: [
      {
        tipo: 'tarjetas', etiqueta: 'Tu plan, conversado contigo', titulo: 'No creemos en soluciones de molde',
        texto: 'Cada sonrisa es distinta y requiere una evaluación completa para encontrar el camino más efectivo, cómodo y estético para ti.',
        items: [
          { titulo: 'Diagnóstico claro', texto: 'Estudiamos tu caso con tecnología 3D para entender exactamente qué necesitas.' },
          { titulo: 'Alternativas según tu caso', texto: 'Todas las opciones viables, desde brackets tradicionales hasta alineadores invisibles.' },
          { titulo: 'Seguimiento', texto: 'Te acompañamos en cada control para asegurar que el avance sea el esperado.' },
          { titulo: 'Tecnología de apoyo', texto: 'Escáneres intraorales y software de planificación para mayor precisión.' },
        ],
      },
      {
        tipo: 'detalle', id: 'invisalign', etiqueta: 'Alineadores', titulo: 'Invisalign',
        texto: 'Alineadores transparentes que corrigen la posición de tus dientes de forma casi imperceptible y se adaptan a tu rutina.',
        chips: ['Invisible', 'Cómodo', 'Removible', 'Estético'],
        puntos: [
          'Evaluación y planificación personalizada con escáner 3D.',
          'Alineación progresiva con controles periódicos programados.',
          'Mayor discreción durante todo el tratamiento.',
          'Higiene más simple: te los sacas para comer y cepillarte.',
        ],
        foto: 'alineadores', alt: 'Alineadores transparentes Invisalign sostenidos por un profesional',
      },
      {
        tipo: 'detalle', id: 'convencional', etiqueta: 'Brackets', titulo: 'Ortodoncia convencional', invertido: true,
        texto: 'Métodos probados y efectivos para resolver desde los casos más simples hasta los más complejos.',
        subitems: [
          { titulo: 'Brackets tradicionales', texto: 'Metálicos, de alta resistencia y eficacia comprobada. Corrigen todo tipo de maloclusiones y apiñamientos severos.' },
          { titulo: 'Brackets estéticos', texto: 'De cerámica o zafiro, del color del diente. Discreción sin usar alineadores.' },
        ],
        foto: 'brackets-esteticos', alt: 'Modelo dental con brackets estéticos cerámicos',
      },
      {
        tipo: 'tarjetas', id: 'ortopedia', etiqueta: 'Niños', titulo: 'Ortopedia en niños',
        texto: 'Durante el crecimiento se puede guiar el desarrollo de los maxilares, siempre según evaluación clínica.',
        items: [
          { titulo: 'Disyuntores', texto: 'Aparatos que pueden apoyar el desarrollo del maxilar durante el crecimiento.' },
          { titulo: 'Máscaras de tracción frontal', texto: 'Indicadas en algunos casos para acompañar el crecimiento y mejorar la relación entre maxilares.' },
        ],
      },
      { tipo: 'equipo', titulo: 'Nuestro equipo de ortodoncia', ids: ['andres-aguayo', 'carla-aravena'] },
    ],
    cta: { titulo: '¿Listo para evaluar tu caso?', texto: 'Reserva tu hora y conversemos tus alternativas con un diagnóstico claro.' },
  },

  implantes: {
    ruta: '/implantes-y-rehabilitacion',
    titulo: 'Implantes y rehabilitación oral en Talca',
    descripcion: 'Implantes dentales y rehabilitación oral en Talca con tomografía 3D y planificación digital. Especialistas en ambas sedes.',
    etiqueta: 'Implantes y rehabilitación',
    h1: ['Vuelve a masticar', 'y sonreír tranquilo'],
    bajada: 'Implantes y rehabilitación oral con planificación digital personalizada, para recuperar función y estética.',
    foto: 'implantes-hero',
    alt: 'Procedimiento de implantes dentales en Culmen Odontología',
    area: 'implantes',
    bloques: [
      {
        tipo: 'detalle', etiqueta: 'Rehabilitación oral', titulo: '¿Qué es la rehabilitación oral?',
        texto: 'Es la especialidad que devuelve función, estética y salud a tu boca cuando perdiste uno o varios dientes, o cuando están muy dañados.',
        puntos: [
          'Restauración de dientes perdidos o deteriorados con prótesis e implantes.',
          'Recuperación de la función masticatoria y del habla.',
          'Mejora visible en la estética de tu sonrisa.',
          'Prevención de problemas futuros, como desgaste dental o de la articulación.',
          'Plan de tratamiento integral adaptado a ti.',
        ],
        foto: 'laboratorio', alt: 'Profesional trabajando en laboratorio dental',
      },
      {
        tipo: 'detalle', etiqueta: 'Planificación', titulo: 'Cada implante se estudia antes', invertido: true,
        texto: 'Un implante requiere un estudio previo detallado para que el resultado sea duradero y predecible.',
        puntos: [
          'Tomografía computarizada 3D.',
          'Análisis de la calidad y cantidad de hueso disponible.',
          'Planificación digital de la posición del implante.',
          'Elección del tipo de implante según tu caso.',
          'Conversación transparente sobre tiempos, procedimientos y alternativas.',
        ],
        foto: 'planificacion-itero', alt: 'Planificación digital del tratamiento en escáner iTero',
      },
      {
        tipo: 'tarjetas', etiqueta: 'Beneficios', titulo: 'Por qué un implante',
        texto: 'Es la solución más duradera y natural para reemplazar dientes perdidos.',
        items: [
          { titulo: 'Durabilidad', texto: 'Con el cuidado adecuado pueden durar décadas.' },
          { titulo: 'Preserva el hueso', texto: 'Estimula el hueso maxilar y evita que pierda volumen.' },
          { titulo: 'Aspecto natural', texto: 'La corona se diseña para mimetizarse con tus dientes.' },
          { titulo: 'Función completa', texto: 'Masticar, hablar y sonreír con confianza.' },
          { titulo: 'Respeta dientes sanos', texto: 'A diferencia de un puente, no requiere tallar los dientes vecinos.' },
          { titulo: 'Calidad de vida', texto: 'Vuelve a disfrutar tus comidas favoritas.' },
        ],
      },
      {
        tipo: 'pasos', etiqueta: 'Proceso', titulo: 'Paso a paso, sin sorpresas',
        items: [
          { titulo: 'Evaluación inicial', texto: 'Examen clínico, imágenes 3D y conversación sobre tus expectativas.' },
          { titulo: 'Planificación digital', texto: 'Diseño del plan quirúrgico y protésico personalizado.' },
          { titulo: 'Colocación del implante', texto: 'Cirugía mínimamente invasiva con anestesia local o sedación.' },
          { titulo: 'Osteointegración', texto: 'El implante se une al hueso durante 3 a 6 meses.' },
          { titulo: 'Corona definitiva', texto: 'Se instala la prótesis final y recuperas tu sonrisa.' },
          { titulo: 'Seguimiento', texto: 'Controles periódicos para asegurar el resultado a largo plazo.' },
        ],
      },
      {
        tipo: 'detalle', etiqueta: 'Materiales y tecnología', titulo: 'Materiales biocompatibles, resultados predecibles',
        puntos: [
          'Implantes de titanio de grado médico con superficie tratada.',
          'Coronas de zirconio y cerámica libre de metal.',
          'Tomografía computarizada 3D.',
          'Software de diseño digital para visualizar el resultado.',
          'Escáner intraoral: impresiones digitales más cómodas y precisas.',
        ],
        foto: 'implante-procedimiento', alt: 'Dentista realizando un procedimiento de implantes',
      },
      { tipo: 'equipo', titulo: 'Equipo clínico', ids: ['carlos-mendez', 'juan-pablo-aguilera', 'karina-valdes', 'sergio-espinoza'] },
    ],
    cta: { titulo: 'Agenda tu evaluación', texto: 'Cuéntanos tu caso y conversemos alternativas según tu diagnóstico.' },
  },

  sedacion: {
    ruta: '/sedacion',
    titulo: 'Sedación dental en Talca',
    descripcion: 'Sedación consciente (gas de la risa) y sedación endovenosa con médico anestesista en Talca. Atención dental sin miedo.',
    etiqueta: 'Sedación',
    h1: ['Atenderte', 'sin miedo'],
    bajada: 'Si tienes ansiedad o miedo por experiencias anteriores, te acompañamos y guiamos para que vivas una atención libre de temores.',
    foto: 'sala-espera',
    alt: 'Paciente esperando relajado en la sala de espera de Culmen',
    area: 'general',
    bloques: [
      {
        tipo: 'detalle', etiqueta: 'Más conocida como gas de la risa', titulo: 'Sedación consciente',
        texto: 'Estarás despierto, pero totalmente relajado durante la atención.',
        puntos: ['Disponible para adultos y niños.', 'Efecto rápido y seguro.', 'Te recuperas en minutos.'],
        foto: 'sedacion-consciente', alt: 'Mascarilla de sedación consciente con óxido nitroso',
      },
      {
        tipo: 'detalle', etiqueta: 'Para tratamientos largos o mucha ansiedad', titulo: 'Sedación profunda endovenosa', invertido: true,
        texto: 'Estarás dormido, pero a diferencia de la anestesia general respiras por ti mismo, lo que reduce riesgos y tiempo de recuperación.',
        puntos: ['Administrada por un médico anestesista certificado.', 'Pabellón certificado por la Seremi de Salud.'],
        foto: 'sedacion-endovenosa', alt: 'Administración de sedación endovenosa con equipamiento médico',
      },
    ],
    cta: { titulo: '¿Quieres atenderte con más tranquilidad?', texto: 'Reserva tu hora y conversemos qué alternativa es adecuada para ti, según evaluación clínica. Indícalo en el comentario de la reserva.' },
  },

  especialidades: {
    ruta: '/especialidades',
    titulo: 'Especialidades dentales en Talca',
    descripcion: 'Odontología general, odontopediatría, endodoncia, periodoncia, TTM, cirugía maxilofacial y armonización facial en Talca.',
    etiqueta: 'Especialidades',
    h1: ['Un especialista', 'para cada caso'],
    bajada: 'Un equipo especializado para resolver tu caso con un diagnóstico claro. Si no sabes cuál necesitas, empieza por odontología general y te orientamos.',
    foto: 'atencion-general',
    alt: 'Profesional de Culmen realizando una atención dental con protección completa',
    area: 'general',
    bloques: [
      {
        tipo: 'detalle', id: 'odontologia-general', etiqueta: 'Para empezar', titulo: 'Odontología general', area: 'general',
        texto: 'Diagnóstico personalizado y preciso, de la mano de profesionales calificados y tecnología de punta.',
        profesionales: [['constanza-yanez', 'Ambas sedes'], ['alicia-aravena', 'Centro'], ['barbara-avendano', 'Las Rastras'], ['karla-villarreal', 'Las Rastras']],
        chips: ['Tratamiento de caries', 'Limpiezas', 'Prevención', 'Exodoncias', 'Urgencias'],
        foto: 'procedimiento', alt: 'Dentista realizando un procedimiento a una paciente',
      },
      {
        tipo: 'detalle', id: 'odontopediatria', etiqueta: 'Niños y adolescentes', titulo: 'Odontopediatría', area: 'ninos', invertido: true,
        texto: 'Atención integral para niños y adolescentes, creando un vínculo de confianza desde las primeras etapas y acompañando su desarrollo.',
        profesionales: [['rosario-cardenas', 'Especialista'], ['karina-huerta', '']],
        chips: ['Tratamiento de caries', 'Limpiezas', 'Prevención', 'Exodoncias', 'Urgencias', 'Conductos en dientes temporales', 'Mantenedores de espacio'],
        foto: 'modelo-dental', alt: 'Asistente dental mostrando un modelo de dientes a un paciente',
      },
      {
        tipo: 'detalle', id: 'endodoncia', etiqueta: 'Tratamiento de conducto', titulo: 'Endodoncia', area: 'endodoncia',
        texto: 'Con un tratamiento de conducto preservamos tus dientes naturales, eliminamos el dolor y evitamos perder la pieza.',
        profesionales: [['pablo-astorga', '']],
        foto: 'consulta', alt: 'Dentista atendiendo a un paciente en consulta',
      },
      {
        tipo: 'detalle', id: 'ttm', etiqueta: 'TTM y DOF', titulo: 'Trastornos temporomandibulares y dolor orofacial', area: 'ttm', invertido: true,
        texto: 'Tratamos trastornos de los músculos faciales y de la articulación temporomandibular para evitar dolor y condiciones degenerativas.',
        profesionales: [['pablo-venegas', '']],
        foto: 'ttm', alt: 'Profesional del área de TTM frente al logotipo de la clínica',
      },
      {
        tipo: 'detalle', id: 'cirugia', etiqueta: 'Alta complejidad', titulo: 'Cirugía maxilofacial', area: 'cirugia',
        texto: 'Soluciones quirúrgicas para problemas craneofaciales y dentofaciales, para recuperar confianza y calidad de vida.',
        profesionales: [['fabian-quiroz', '']],
        foto: 'cirugia-maxilofacial', alt: 'Procedimiento de cirugía maxilofacial',
      },
      {
        tipo: 'detalle', id: 'periodoncia', etiqueta: 'Encías', titulo: 'Periodoncia', area: 'periodoncia', invertido: true,
        texto: 'Cuidamos los tejidos que sostienen tus dientes —encías, hueso y ligamentos— para evitar enfermedades que los dañen o hagan perder.',
        profesionales: [['francisca-del-pino', '']],
        foto: 'periodoncia', alt: 'Profesional de Culmen en la clínica',
      },
      {
        tipo: 'detalle', id: 'armonizacion', etiqueta: 'Estética orofacial', titulo: 'Armonización facial', area: 'armonizacion',
        texto: 'Tratamientos estéticos y funcionales mínimamente invasivos para el equilibrio del rostro, con resultados armónicos y seguros.',
        profesionales: [['daniela-uribe', '']],
      },
      { tipo: 'guia' },
    ],
    cta: { titulo: '¿No sabes qué especialidad necesitas?', texto: 'Reserva una evaluación de odontología general y te orientamos según tu diagnóstico.' },
  },

  financiamiento: {
    ruta: '/financiamiento',
    titulo: 'Financiamiento y seguros dentales',
    descripcion: 'Seguro dental Culmen con Chubb, reembolso en línea I-Med, convenios y pago en cuotas en Culmen Odontología, Talca.',
    etiqueta: 'Financiamiento',
    h1: ['Que el costo', 'no te detenga'],
    bajada: 'Tenemos varias formas de ayudarte a financiar tu tratamiento para que recuperes tu salud oral y sonrías con confianza.',
    foto: 'financiamiento-hero',
    alt: 'Recepción de Culmen Odontología atendiendo a una paciente',
    area: 'general',
    bloques: [
      {
        tipo: 'chips', id: 'reembolso', etiqueta: 'Reembolso en línea', titulo: 'Bonificación automática I-Med',
        texto: 'Si tienes seguro complementario con alguna de estas compañías, el reembolso se hace en el momento. Si tu seguro no está, igual te dejamos listo el trámite el mismo día.',
        items: COBERTURA.isapres,
      },
      {
        tipo: 'tarjetas', id: 'seguro', oscuro: true, etiqueta: 'Seguro Culmen · con Chubb', titulo: 'Nuestro propio seguro dental',
        texto: 'Somos la única clínica de la región con seguro propio, en colaboración con Chubb, con valores accesibles para ti y tu familia.',
        cifras: COBERTURA.seguro,
        items: [
          { titulo: 'Plan Vital Base', texto: 'Coberturas dentales para ti y tu familia. Consulta el detalle con nuestros asesores.' },
          { titulo: 'Plan Vital Care', texto: 'Coberturas dentales para ti y tu familia. Consulta el detalle con nuestros asesores.' },
          { titulo: 'Plan Vital Plus', texto: 'Coberturas dentales para ti y tu familia. Consulta el detalle con nuestros asesores.' },
        ],
        notas: ['Carencia de 1 día para urgencias.', '30 días para tratamientos básicos y preventivos.', '180 días para prótesis e implantes.'],
      },
      {
        tipo: 'chips', id: 'convenios', etiqueta: 'Convenios', titulo: 'Beneficios para empresas',
        texto: 'Descuentos y beneficios para trabajadores y sus familias. ¿Tienes una empresa y te interesa un convenio? Escríbenos.',
        items: COBERTURA.convenios,
      },
      {
        tipo: 'tarjetas', id: 'pagos', etiqueta: 'Métodos de pago', titulo: 'Paga como te acomode',
        items: [
          { titulo: 'Efectivo, débito y crédito', texto: 'Aceptamos todos los medios de pago habituales.' },
          { titulo: 'Pago en cuotas', texto: 'Facilidades para que hagas tu tratamiento sin preocupaciones.' },
          { titulo: 'Cuotas sin interés', texto: 'Revisa las promociones vigentes con tarjetas bancarias.' },
        ],
      },
    ],
    cta: { titulo: 'Resolvamos tu caso y tu presupuesto', texto: 'En la primera cita te entregamos un diagnóstico claro y todas las alternativas, para que decidas con calma.' },
  },
};
