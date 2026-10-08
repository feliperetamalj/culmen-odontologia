// Guía "¿Qué necesito?": 2 o 3 preguntas que terminan en un motivo de AREAS (equipo.js).
// Cada opción lleva `area` (resultado) o `siguiente` (otra pregunta).

export const GUIA = {
  inicio: {
    pregunta: '¿Qué te trae a Culmen?',
    opciones: [
      { icono: 'rayo', texto: 'Tengo dolor o una urgencia', siguiente: 'dolor' },
      { icono: 'sonrisa', texto: 'Quiero alinear mis dientes', area: 'ortodoncia' },
      { icono: 'diente', texto: 'Me falta un diente o tengo dientes muy dañados', area: 'implantes' },
      { icono: 'nino', texto: 'Es para un niño o niña', siguiente: 'ninos' },
      { icono: 'check', texto: 'Un control, limpieza o evaluación', area: 'general' },
      { icono: 'corazon', texto: 'Estética del rostro', area: 'armonizacion' },
    ],
  },
  dolor: {
    pregunta: '¿Dónde sientes el dolor?',
    opciones: [
      { texto: 'En un diente o muela', area: 'general', nota: 'Si necesitas un tratamiento de conducto, en la evaluación te derivamos a endodoncia.' },
      { texto: 'En la mandíbula, al masticar o al abrir la boca', area: 'ttm' },
      { texto: 'Me sangran o duelen las encías', area: 'periodoncia' },
      { texto: 'No estoy seguro', area: 'general' },
    ],
  },
  ninos: {
    pregunta: '¿Qué necesita?',
    opciones: [
      { texto: 'Un control, caries o limpieza', area: 'ninos' },
      { texto: 'Revisar cómo crecen sus dientes o su mandíbula', area: 'ortodoncia', nota: 'La Dra. Carla Aravena atiende ortopedia infantil: disyuntores y máscaras de tracción.' },
    ],
  },
};

export const ANSIEDAD = {
  pregunta: '¿Te da ansiedad ir al dentista?',
  opciones: [
    { texto: 'Sí, bastante', valor: true },
    { texto: 'No, voy tranquilo', valor: false },
  ],
};
