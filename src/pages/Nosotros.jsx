import { APOYO, CIFRAS } from '../data/equipo.js';
import { retrato } from '../utils/media.js';
import { useTitulo } from '../hooks/useTitulo.js';
import { Cabecera, Reveal } from '../components/ui';
import { PageHero } from '../components/sections/PageHero.jsx';
import { Equipo } from '../components/sections/Equipo.jsx';
import { SeccionReserva } from '../components/sections/SeccionReserva.jsx';
import s from './Nosotros.module.css';

export function Nosotros() {
  useTitulo('Nuestro equipo', `Conoce a los ${CIFRAS.profesionales} profesionales de Culmen Odontología en Talca: ortodoncia, implantes, odontopediatría, periodoncia, endodoncia y más.`, '/nosotros');
  return (
    <>
      <PageHero
        etiqueta="Nosotros"
        h1={['Un equipo', 'que te acompaña']}
        bajada="Diagnóstico claro, trato humano y especialistas para resolver tu caso, en dos sedes en Talca."
        foto="hero-equipo"
        alt="El equipo de Culmen Odontología frente al logotipo de la clínica"
        area="general"
      />
      <Equipo
        titulo={<>Conoce a nuestros <em>{CIFRAS.profesionales} profesionales</em></>}
        texto="Altamente capacitados y unidos por una misma vocación: cuidar tu salud dental con excelencia, empatía y la mejor tecnología disponible."
      />
      <section className={s.apoyo}>
        <div className="contenedor">
          <Cabecera
            etiqueta="Equipo de apoyo"
            titulo={<>Te reciben y te acompañan <em>de principio a fin</em></>}
            texto="El pilar de la clínica: desde que llegas hasta que terminas tu tratamiento."
          />
          <ul className={s.grilla}>
            {APOYO.map((p, i) => (
              <Reveal as="li" key={p.id} retraso={(i % 4) * 60} className={s.persona}>
                <img src={retrato(p.id)} alt={`Retrato de ${p.nombre}`} loading="lazy" width="640" height="800" />
                <h3>{p.nombre}</h3>
                <p>{p.rol}</p>
              </Reveal>
            ))}
          </ul>
          <p className={s.nota}>TONS: Técnico en Odontología Nivel Superior.</p>
        </div>
      </section>
      <SeccionReserva
        titulo={<>¿Listo para <em>conocernos?</em></>}
        texto="Reserva tu primera cita y descubre cómo podemos ayudarte a recuperar tu mejor sonrisa."
      />
    </>
  );
}
