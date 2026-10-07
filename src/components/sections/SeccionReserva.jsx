import { Reserva } from '../reserva/Reserva.jsx';
import { Cabecera } from '../ui';
import s from './SeccionReserva.module.css';

export function SeccionReserva({ etiqueta = 'Reserva online', titulo, texto, inicial, nivel }) {
  return (
    <section className={s.seccion} id="reservar">
      <div className="contenedor">
        <Cabecera etiqueta={etiqueta} titulo={titulo} texto={texto} nivel={nivel} />
        <Reserva inicial={inicial} />
      </div>
    </section>
  );
}
