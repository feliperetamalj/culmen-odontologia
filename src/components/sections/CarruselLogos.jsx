import { useState } from 'react';
import s from './CarruselLogos.module.css';

const LOGOS = import.meta.glob('../../assets/convenios/*.webp', { eager: true, import: 'default' });
const logo = (nombre) => LOGOS[`../../assets/convenios/${nombre}.webp`];

/**
 * Cinta de logos en movimiento continuo. Se detiene (y muestra los colores) al pasar
 * el cursor, al enfocarla con teclado o al tocarla en el celular; otro toque la
 * reanuda. Con "reducir movimiento" queda fija. La serie va duplicada para que el
 * bucle no tenga salto; las copias se ocultan a lectores de pantalla.
 */
export function CarruselLogos({ items, etiqueta }) {
  const [detenido, setDetenido] = useState(false);
  const alternar = () => setDetenido((d) => !d);
  const serie = Array.from({ length: Math.max(2, Math.ceil(8 / items.length)) }, () => items).flat();
  const tarjeta = (x, clave, copia) => (
    <li key={clave} className={s.tarjeta} aria-hidden={copia || undefined}>
      <img src={logo(x.logo)} alt={copia ? '' : x.nombre} loading="lazy" decoding="async" draggable="false" />
    </li>
  );

  return (
    <div
      className={`${s.ventana} ${detenido ? s.detenido : ''}`}
      tabIndex={0}
      role="group"
      aria-label={`${etiqueta} Toca o presiona Enter para detener o reanudar.`}
      onClick={alternar}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), alternar())}
    >
      <ul className={s.pista}>
        {serie.map((x, i) => tarjeta(x, `a${i}`, i >= items.length))}
        {serie.map((x, i) => tarjeta(x, `b${i}`, true))}
      </ul>
    </div>
  );
}
