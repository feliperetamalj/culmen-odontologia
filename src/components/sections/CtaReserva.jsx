import { reservarCon } from '../../utils/enlaces.js';
import { Boton, Cabecera, Icono } from '../ui';
import s from './CtaReserva.module.css';

/** Cierre de página: invita a reservar en /reservar, con la especialidad ya elegida. */
export function CtaReserva({ titulo, texto, area }) {
  return (
    <section className={s.seccion}>
      <div className="contenedor">
        <Cabecera etiqueta="Reserva online" titulo={titulo} texto={texto} centrado>
          <Boton a={reservarCon({ area })} tamano="lg" className={s.boton}>
            <Icono nombre="calendario" /> Reservar hora
          </Boton>
        </Cabecera>
      </div>
    </section>
  );
}
