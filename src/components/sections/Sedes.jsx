import { CLINICA, SEDES } from '../../data/clinica.js';
import { mapaEmbed, reservarCon, whatsapp } from '../../utils/enlaces.js';
import { Boton, Cabecera, Icono, Reveal } from '../ui';
import s from './Sedes.module.css';

export function Sedes() {
  return (
    <section className={s.seccion} id="sedes">
      <div className="contenedor">
        <Cabecera
          etiqueta="Dos sedes en Talca"
          titulo={<>Elige la que te <em>quede más cerca</em></>}
          texto="Mismo equipo, misma forma de atender. Ambas sedes atienden de lunes a sábado."
        />
        <div className={s.grilla}>
          {SEDES.map((sede, i) => (
            <Reveal as="article" key={sede.id} className={s.sede} retraso={i * 90}>
              <iframe
                className={s.mapa}
                src={mapaEmbed(sede.coords)}
                title={`Mapa de ${sede.nombre}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className={s.cuerpo}>
                <h3>{sede.nombre}</h3>
                <p className={s.direccion}>{sede.direccion}<br />{sede.referencia}</p>
                <dl className={s.horario}>
                  {CLINICA.horario.map(([d, h]) => (
                    <div key={d}><dt>{d}</dt><dd className="tabular">{h}</dd></div>
                  ))}
                </dl>
                <div className={s.acciones}>
                  <Boton a={reservarCon({ sede: sede.id })} variante="oscuro">
                    <Icono nombre="calendario" /> Reservar aquí
                  </Boton>
                  <Boton a={whatsapp(sede.whatsapp)} variante="contorno">
                    <Icono nombre="mensaje" /> {sede.telefono}
                  </Boton>
                  <Boton a={sede.maps} variante="texto">
                    <Icono nombre="ubicacion" /> Cómo llegar
                  </Boton>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
