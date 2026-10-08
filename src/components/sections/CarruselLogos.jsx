import { useState } from 'react';
import { Icono } from '../ui';
import s from './CarruselLogos.module.css';

const LOGOS = import.meta.glob('../../assets/convenios/*.webp', { eager: true, import: 'default' });
const logo = (nombre) => LOGOS[`../../assets/convenios/${nombre}.webp`];

/**
 * Cinta de logos en movimiento continuo. Se detiene al pasar el cursor, al enfocar
 * con teclado y con el botón de pausa; con "reducir movimiento" queda fija.
 * La serie va duplicada para que el bucle no tenga salto; las copias se ocultan a
 * lectores de pantalla.
 */
export function CarruselLogos({ items, etiqueta }) {
  const [pausado, setPausado] = useState(false);
  const serie = Array.from({ length: Math.max(2, Math.ceil(8 / items.length)) }, () => items).flat();
  const tarjeta = (x, clave, copia) => (
    <li key={clave} className={s.tarjeta} aria-hidden={copia || undefined}>
      <img src={logo(x.logo)} alt={copia ? '' : x.nombre} loading="lazy" decoding="async" />
    </li>
  );

  return (
    <div className={`${s.carrusel} ${pausado ? s.pausado : ''}`}>
      <div className={s.ventana}>
        <ul className={s.pista} aria-label={etiqueta}>
          {serie.map((x, i) => tarjeta(x, `a${i}`, i >= items.length))}
          {serie.map((x, i) => tarjeta(x, `b${i}`, true))}
        </ul>
      </div>
      <button type="button" className={s.control} onClick={() => setPausado(!pausado)} aria-pressed={pausado}>
        <Icono nombre={pausado ? 'play' : 'pausa'} tamano="14" />
        {pausado ? 'Reanudar' : 'Pausar'}
      </button>
    </div>
  );
}
