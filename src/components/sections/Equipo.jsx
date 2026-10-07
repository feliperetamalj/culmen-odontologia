import { useRef, useState } from 'react';
import { PROFESIONALES, areaDe, porId } from '../../data/equipo.js';
import { iniciales, retrato } from '../../utils/media.js';
import { reservarCon } from '../../utils/enlaces.js';
import { Boton, Cabecera, Icono, Reveal } from '../ui';
import s from './Equipo.module.css';

export function Equipo({ ids, etiqueta = 'Equipo', titulo, texto, verTodos = false, fondo = 'claro' }) {
  const lista = ids ? ids.map(porId) : PROFESIONALES;
  const dialogo = useRef(null);
  const [activo, setActivo] = useState(null);
  const abrir = (p) => { setActivo(p); dialogo.current.showModal(); };

  return (
    <section className={`${s.seccion} ${s[fondo]}`} id="equipo">
      <div className="contenedor">
        <Cabecera etiqueta={etiqueta} titulo={titulo} texto={texto} />
        <ul className={s.grilla}>
          {lista.map((p, i) => (
            <Reveal as="li" key={p.id} retraso={(i % 4) * 70}>
              <article className={s.tarjeta}>
                <Foto p={p} />
                <div className={s.cuerpo}>
                  <h3 className={s.nombre}>{p.nombre}</h3>
                  <p className={s.especialidad}>{p.especialidad}</p>
                  {p.sede && <p className={s.sede}><Icono nombre="ubicacion" tamano="14" /> {p.sede}</p>}
                  <div className={s.acciones}>
                    {p.cv.length > 0 && (
                      <button type="button" className={s.perfil} onClick={() => abrir(p)} aria-haspopup="dialog">
                        Ver perfil<span className="sr-only"> de {p.nombre}</span>
                      </button>
                    )}
                    <Boton a={reservarCon({ area: areaDe(p.id).id, profesional: p.id })} variante="oscuro" tamano="sm">
                      Reservar<span className="sr-only"> con {p.nombre}</span>
                    </Boton>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </ul>
        {verTodos && (
          <div className={s.todos}>
            <Boton a="/nosotros" variante="contorno">
              Conoce a los {PROFESIONALES.length} profesionales <Icono nombre="flecha" />
            </Boton>
          </div>
        )}
      </div>

      <dialog
        ref={dialogo}
        className={s.dialogo}
        aria-labelledby="perfil-nombre"
        onClick={(e) => e.target === dialogo.current && dialogo.current.close()}
      >
        {activo && (
          <div className={s.perfilCuerpo}>
            <Foto p={activo} />
            <div className={s.perfilTexto}>
              <button type="button" className={s.cerrar} onClick={() => dialogo.current.close()}>
                <Icono nombre="cerrar" tamano="22" /><span className="sr-only">Cerrar</span>
              </button>
              <p className={s.especialidad}>{activo.especialidad}</p>
              <h2 id="perfil-nombre" className={s.perfilNombre}>{activo.nombre}</h2>
              <ul className={s.cv}>
                {activo.cv.map((linea) => (
                  <li key={linea}><Icono nombre="check" tamano="18" /> {linea}</li>
                ))}
              </ul>
              <Boton a={reservarCon({ area: areaDe(activo.id).id, profesional: activo.id })} tamano="lg">
                <Icono nombre="calendario" /> Reservar con {activo.nombre.split(' ').slice(0, 2).join(' ')}
              </Boton>
            </div>
          </div>
        )}
      </dialog>
    </section>
  );
}

function Foto({ p }) {
  const src = p.foto && retrato(p.id);
  return (
    <div className={s.foto}>
      {src ? (
        <img src={src} alt={`Retrato de ${p.nombre}`} loading="lazy" decoding="async" width="640" height="800" />
      ) : (
        <span className={s.monograma} aria-hidden="true">{iniciales(p.nombre)}</span>
      )}
    </div>
  );
}
