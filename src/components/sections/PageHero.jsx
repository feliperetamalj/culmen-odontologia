import { Boton, Etiqueta, Icono } from '../ui';
import { foto } from '../../utils/media.js';
import { reservarCon } from '../../utils/enlaces.js';
import s from './PageHero.module.css';

/** Encabezado oscuro de las páginas interiores: texto a la izquierda, foto real con forma de corona. */
export function PageHero({ etiqueta, h1, bajada, foto: nombre, alt, area }) {
  return (
    <section className={`${s.hero} on-dark`}>
      <div className={`contenedor ${s.grilla}`}>
        <div className={s.texto}>
          <Etiqueta claro>{etiqueta}</Etiqueta>
          <h1>
            {h1[0]} <em>{h1[1]}</em>
          </h1>
          <p className={s.bajada}>{bajada}</p>
          <div className={s.acciones}>
            <Boton a={reservarCon({ area })} tamano="lg">
              <Icono nombre="calendario" /> Ver horas disponibles
            </Boton>
          </div>
        </div>
        {nombre && (
          <div className={s.foto}>
            <img src={foto(nombre)} alt={alt} fetchpriority="high" decoding="async" />
          </div>
        )}
      </div>
    </section>
  );
}
