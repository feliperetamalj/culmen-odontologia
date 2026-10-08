import { porId } from '../../data/equipo.js';
import { foto, iniciales, retrato } from '../../utils/media.js';
import { reservarCon } from '../../utils/enlaces.js';
import { Boton, Cabecera, Etiqueta, Icono, Reveal } from '../ui';
import { Equipo } from './Equipo.jsx';
import { Guia } from './Guia.jsx';
import s from './Bloques.module.css';

/** Renderiza los bloques de contenido de una página de tratamiento (src/data/paginas.js). */
export function Bloques({ bloques }) {
  return bloques.map((b, i) => {
    const fondo = b.oscuro ? s.oscuro : i % 2 ? s.blanco : s.claro;
    if (b.tipo === 'guia') return <Guia key={i} />;
    if (b.tipo === 'equipo') return <Equipo key={i} ids={b.ids} titulo={b.titulo} fondo={i % 2 ? 'blanco' : 'claro'} />;
    const Tipo = TIPOS[b.tipo];
    return (
      <section key={i} id={b.id} className={`${s.seccion} ${fondo} ${b.oscuro ? 'on-dark' : ''}`}>
        <div className="contenedor"><Tipo {...b} /></div>
      </section>
    );
  });
}

function Tarjetas({ etiqueta, titulo, texto, items, cifras, notas, oscuro }) {
  return (
    <>
      <Cabecera etiqueta={etiqueta} titulo={titulo} texto={texto} claro={oscuro} />
      {cifras && (
        <dl className={s.cifras}>
          {cifras.map((c) => (
            <div key={c.texto}><dt>{c.texto}</dt><dd className="tabular">{c.valor}</dd></div>
          ))}
        </dl>
      )}
      <ul className={s.tarjetas}>
        {items.map((it, i) => (
          <Reveal as="li" key={it.titulo} retraso={(i % 3) * 70} className={s.tarjeta}>
            <span className={s.indice} aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
            <h3>{it.titulo}</h3>
            <p>{it.texto}</p>
          </Reveal>
        ))}
      </ul>
      {notas && (
        <ul className={s.notas}>
          {notas.map((n) => <li key={n}><Icono nombre="reloj" tamano="16" /> {n}</li>)}
        </ul>
      )}
    </>
  );
}

function Detalle({ etiqueta, titulo, texto, chips, puntos, subitems, profesionales, foto: nombre, alt, invertido, area }) {
  return (
    <div className={`${s.detalle} ${invertido ? s.invertido : ''} ${nombre ? '' : s.sinFoto}`}>
      <Reveal className={s.detalleTexto}>
        {etiqueta && <Etiqueta>{etiqueta}</Etiqueta>}
        <h2>{titulo}</h2>
        {texto && <p className={s.lead}>{texto}</p>}
        {chips && (
          <ul className={s.chips}>{chips.map((c) => <li key={c}>{c}</li>)}</ul>
        )}
        {puntos && (
          <ul className={s.puntos}>
            {puntos.map((p) => <li key={p}><Icono nombre="check" tamano="18" /> {p}</li>)}
          </ul>
        )}
        {subitems && (
          <div className={s.subitems}>
            {subitems.map((x) => <div key={x.titulo}><h3>{x.titulo}</h3><p>{x.texto}</p></div>)}
          </div>
        )}
        {profesionales && (
          <ul className={s.personas}>
            {profesionales.map(([id, sede]) => {
              const p = porId(id);
              const src = p.foto && retrato(id);
              return (
                <li key={id}>
                  <span className={s.mini} aria-hidden="true">{src ? <img src={src} alt="" loading="lazy" /> : iniciales(p.nombre)}</span>
                  <span><strong>{p.nombre}</strong>{sede && <small>{sede}</small>}</span>
                </li>
              );
            })}
          </ul>
        )}
        {area && (
          <Boton a={reservarCon({ area })} variante="oscuro">
            Ver horas disponibles <Icono nombre="flecha" />
          </Boton>
        )}
      </Reveal>
      {nombre && (
        <Reveal className={s.detalleFoto} retraso={120}>
          <img src={foto(nombre)} alt={alt} loading="lazy" decoding="async" />
        </Reveal>
      )}
    </div>
  );
}

function Pasos({ etiqueta, titulo, texto, items }) {
  return (
    <>
      <Cabecera etiqueta={etiqueta} titulo={titulo} texto={texto} />
      <ol className={s.pasos}>
        {items.map((it, i) => (
          <Reveal as="li" key={it.titulo} retraso={(i % 3) * 70}>
            <span className={s.paso} aria-hidden="true">{i + 1}</span>
            <h3>{it.titulo}</h3>
            <p>{it.texto}</p>
          </Reveal>
        ))}
      </ol>
    </>
  );
}

function Chips({ etiqueta, titulo, texto, items }) {
  return (
    <div className={s.chipsBloque}>
      <Cabecera etiqueta={etiqueta} titulo={titulo} texto={texto} />
      <ul className={s.muro}>
        {items.map((x) => <li key={x}>{x}</li>)}
      </ul>
    </div>
  );
}

const TIPOS = { tarjetas: Tarjetas, detalle: Detalle, pasos: Pasos, chips: Chips };
