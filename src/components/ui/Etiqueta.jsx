import s from './Etiqueta.module.css';

/** Etiqueta de sección precedida por la onda de la corona del logotipo. */
export function Etiqueta({ children, claro = false, className = '' }) {
  return (
    <p className={`${s.etiqueta} ${claro ? s.claro : ''} ${className}`}>
      <svg viewBox="0 0 40 12" aria-hidden="true" className={s.onda}>
        <path d="M1 9.5c5-6 10-7.5 15-4.5s9 4.5 14 1.5S37 2.5 39 2" />
      </svg>
      {children}
    </p>
  );
}
