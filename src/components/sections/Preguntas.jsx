import { PREGUNTAS } from '../../data/clinica.js';
import { Cabecera, Icono } from '../ui';
import s from './Preguntas.module.css';

export function Preguntas() {
  return (
    <section className={s.seccion} id="preguntas">
      <div className={`contenedor ${s.grilla}`}>
        <Cabecera
          etiqueta="Preguntas frecuentes"
          titulo={<>Lo que nos preguntan <em>antes de venir</em></>}
          texto="Si tu duda no está aquí, escríbenos por WhatsApp y te respondemos."
        />
        <div className={s.lista}>
          {PREGUNTAS.map(({ p, r }) => (
            <details key={p} className={s.item}>
              <summary>
                {p}
                <Icono nombre="chevronAbajo" className={s.icono} />
              </summary>
              <p>{r}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
