import { useEffect, useId, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ANSIEDAD, GUIA } from '../../data/guia.js';
import { areaPorId, porId } from '../../data/equipo.js';
import { iniciales, retrato } from '../../utils/media.js';
import { reservarCon } from '../../utils/enlaces.js';
import { Boton, Cabecera, Etiqueta, Icono } from '../ui';
import s from './Guia.module.css';

/** "¿Qué necesito?": 2 o 3 preguntas → motivo recomendado → horas de ese motivo. */
export function Guia() {
  const [ruta, setRuta] = useState(['inicio']); // preguntas recorridas
  const [eleccion, setEleccion] = useState(null); // { area, nota }
  const [ansiedad, setAnsiedad] = useState(null);
  const titulo = useRef(null);
  const paso = ruta.length + (eleccion ? 1 : 0) + (ansiedad !== null ? 1 : 0);
  const pasoPrevio = useRef(paso);

  // Al avanzar o volver, el foco va a la nueva pregunta (teclado y lector de pantalla).
  useEffect(() => {
    if (pasoPrevio.current === paso) return;
    pasoPrevio.current = paso;
    titulo.current?.focus({ preventScroll: true });
  }, [paso]);

  const volver = () => {
    if (ansiedad !== null) setAnsiedad(null);
    else if (eleccion) setEleccion(null);
    else setRuta((r) => r.slice(0, -1));
  };
  const reiniciar = () => { setRuta(['inicio']); setEleccion(null); setAnsiedad(null); };

  const nodo = GUIA[ruta.at(-1)];
  const area = eleccion && areaPorId(eleccion.area);

  return (
    <section className={s.seccion} id="guia">
      <div className={`contenedor ${s.grilla}`}>
        <Cabecera
          etiqueta="Guía rápida"
          titulo={<>¿No sabes qué <em>especialidad necesitas?</em></>}
          texto="Responde dos o tres preguntas y te decimos con quién reservar. Si igual tienes dudas, empieza por odontología general: te orientamos en la evaluación."
        />

        <div className={s.tarjeta}>
          <div className={s.barra}>
            <span className={s.progreso} aria-hidden="true">
              {[1, 2, 3].map((n) => <i key={n} className={n <= paso ? s.lleno : ''} />)}
            </span>
            {paso > 1 && (
              <button type="button" className={s.volver} onClick={volver}>
                <Icono nombre="chevronIzq" tamano="18" /> Volver
              </button>
            )}
          </div>

          <div key={paso} className={s.paso}>
            {!eleccion ? (
              <Pregunta tituloRef={titulo} pregunta={nodo.pregunta}>
                {nodo.opciones.map((o) => (
                  <Opcion
                    key={o.texto}
                    icono={o.icono}
                    onClick={() => (o.siguiente ? setRuta((r) => [...r, o.siguiente]) : setEleccion(o))}
                  >
                    {o.texto}
                  </Opcion>
                ))}
              </Pregunta>
            ) : ansiedad === null ? (
              <Pregunta tituloRef={titulo} pregunta={ANSIEDAD.pregunta}>
                {ANSIEDAD.opciones.map((o) => (
                  <Opcion key={o.texto} onClick={() => setAnsiedad(o.valor)}>{o.texto}</Opcion>
                ))}
              </Pregunta>
            ) : (
              <div className={s.resultado} aria-live="polite">
                <Etiqueta>Te recomendamos</Etiqueta>
                <h3 ref={titulo} tabIndex={-1} className={s.pregunta}>{area.nombre}</h3>
                <p className={s.detalle}>{area.detalle}.</p>
                {eleccion.nota && <p className={s.nota}>{eleccion.nota}</p>}
                <ul className={s.personas} aria-label="Profesionales que atienden">
                  {area.profesionales.map((id) => {
                    const p = porId(id);
                    const src = p.foto && retrato(id);
                    return (
                      <li key={id} title={p.nombre}>
                        {src ? <img src={src} alt={p.nombre} loading="lazy" /> : <span aria-label={p.nombre}>{iniciales(p.nombre)}</span>}
                      </li>
                    );
                  })}
                </ul>
                {ansiedad && (
                  <p className={s.calma}>
                    <Icono nombre="calma" tamano="22" />
                    <span>
                      Te entendemos. Tenemos <Link to="/sedacion">sedación consciente y endovenosa</Link>. Cuéntalo en el comentario al
                      reservar y lo conversamos en tu evaluación.
                    </span>
                  </p>
                )}
                <div className={s.acciones}>
                  <Boton a={reservarCon({ area: area.id })} tamano="lg">
                    <Icono nombre="calendario" /> Ver horas de {area.nombre.toLowerCase()}
                  </Boton>
                  <Boton variante="texto" onClick={reiniciar}>Empezar de nuevo</Boton>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Pregunta({ tituloRef, pregunta, children }) {
  const id = useId();
  return (
    <div role="group" aria-labelledby={id}>
      <h3 id={id} ref={tituloRef} tabIndex={-1} className={s.pregunta}>{pregunta}</h3>
      <div className={s.opciones}>{children}</div>
    </div>
  );
}

function Opcion({ icono, onClick, children }) {
  return (
    <button type="button" className={s.opcion} onClick={onClick}>
      {icono && <span className={s.opcionIcono}><Icono nombre={icono} tamano="22" /></span>}
      <span className={s.opcionTexto}>{children}</span>
      <Icono nombre="chevronDer" tamano="18" className={s.flecha} />
    </button>
  );
}
