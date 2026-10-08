// Íconos de trazo 24×24 que heredan color y tamaño del texto.
const TRAZOS = {
  calendario: <><rect x="3.5" y="5" width="17" height="15.5" rx="2.5" /><path d="M3.5 10h17M8 3v4M16 3v4" /></>,
  reloj: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>,
  ubicacion: <><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" /><circle cx="12" cy="10" r="2.4" /></>,
  mensaje: <><path d="M20.5 11.5a8.5 8.5 0 0 1-12.6 7.4L3.5 20l1.2-4.2A8.5 8.5 0 1 1 20.5 11.5Z" /><path d="M9 9.5c.3 2.4 2.1 4.3 4.6 5l1.2-1.3-1.7-1-1 .7a3.6 3.6 0 0 1-1.8-1.8l.7-1-1-1.7L9 9.5Z" /></>,
  flecha: <path d="M4.5 12h15m-5.5-6 6 6-6 6" />,
  chevronIzq: <path d="m14.5 6-6 6 6 6" />,
  chevronDer: <path d="m9.5 6 6 6-6 6" />,
  chevronAbajo: <path d="m6 9.5 6 6 6-6" />,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  cerrar: <path d="M6 6l12 12M18 6 6 18" />,
  menu: <path d="M4 7h16M4 12h16M4 17h10" />,
  estrella: <path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9L12 3.5Z" fill="currentColor" stroke="none" />,
  correo: <><rect x="3.5" y="5.5" width="17" height="13" rx="2" /><path d="m4 7 8 6 8-6" /></>,
  corazon: <path d="M12 20s-7.5-4.4-7.5-10.1A4.4 4.4 0 0 1 12 7.3a4.4 4.4 0 0 1 7.5 2.6C19.5 15.6 12 20 12 20Z" />,
  opciones: <><path d="M4 7h9M17 7h3M4 17h3M11 17h9" /><circle cx="15" cy="7" r="2" /><circle cx="9" cy="17" r="2" /></>,
  escaner: <><path d="M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H16M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16" /><path d="M8.5 9c0-1.2 1-2 2-2 .6 0 1 .3 1.5.3s.9-.3 1.5-.3c1 0 2 .8 2 2 0 2.2-.9 3-1.2 5.2-.2 1-1.3 1-1.5 0l-.4-1.7c-.1-.4-.7-.4-.8 0l-.4 1.7c-.2 1-1.3 1-1.5 0C9.4 12 8.5 11.2 8.5 9Z" /></>,
  calma: <><path d="M12 20c4.5 0 8-3.4 8-8.2V5c-5 0-8 1.5-8 1.5S9 5 4 5v6.8C4 16.6 7.5 20 12 20Z" /><path d="M9 12.5c.8 1 1.8 1.5 3 1.5s2.2-.5 3-1.5" /></>,
  usuario: <><circle cx="12" cy="8.5" r="3.5" /><path d="M5 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5" /></>,
  escudo: <><path d="M12 3.5 19 6v5.5c0 4.3-3 7.7-7 9-4-1.3-7-4.7-7-9V6l7-2.5Z" /><path d="m9 12 2 2 4-4" /></>,
  tarjeta: <><rect x="3" y="6" width="18" height="12.5" rx="2" /><path d="M3 10h18M7 15h3" /></>,
  externo: <path d="M14 4h6v6M20 4l-8.5 8.5M18 14v4.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6H10" />,
  alerta: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5v5.5M12 16.2v.3" /></>,
  pausa: <path d="M9 6v12M15 6v12" strokeWidth="2.4" />,
  play: <path d="M8 5.5v13l10.5-6.5L8 5.5Z" fill="currentColor" />,
  pregunta: <><circle cx="12" cy="12" r="8.5" /><path d="M9.6 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1.1.9-1.1 1.6v.4M12 16.6v.3" /></>,
  diente: <path d="M7.5 4.5c-2.2 0-3.5 1.8-3.5 4.2 0 2.6 1.2 4 1.7 6.4.5 2.4.9 4.4 2.3 4.4 1.6 0 1.4-4.5 4-4.5s2.4 4.5 4 4.5c1.4 0 1.8-2 2.3-4.4.5-2.4 1.7-3.8 1.7-6.4 0-2.4-1.3-4.2-3.5-4.2-1.9 0-2.8 1.2-4.5 1.2S9.4 4.5 7.5 4.5Z" />,
  nino: <><circle cx="12" cy="8" r="3.2" /><path d="M6.5 20c.4-3.3 2.7-5.3 5.5-5.3s5.1 2 5.5 5.3M9.8 7.2c.8-1.4 3.2-1.6 4.4-.2" /></>,
  sonrisa: <><circle cx="12" cy="12" r="8.5" /><path d="M8.5 13.5c.9 1.3 2.1 2 3.5 2s2.6-.7 3.5-2M9 9.5v.3M15 9.5v.3" /></>,
  rayo: <path d="M13 3.5 5.5 13.5H12l-1 7 7.5-10H12l1-7Z" />,
};

export function Icono({ nombre, tamano = '1.25em', className, titulo }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={tamano}
      height={tamano}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={titulo ? undefined : true}
      role={titulo ? 'img' : undefined}
      aria-label={titulo}
      focusable="false"
      style={{ flexShrink: 0 }}
    >
      {TRAZOS[nombre]}
    </svg>
  );
}
