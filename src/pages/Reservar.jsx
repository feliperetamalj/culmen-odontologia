import { useSearchParams } from 'react-router-dom';
import { areaDe } from '../data/equipo.js';
import { useTitulo } from '../hooks/useTitulo.js';
import { Etiqueta } from '../components/ui';
import { Reserva } from '../components/reserva/Reserva.jsx';
import s from './Reservar.module.css';

export function Reservar() {
  useTitulo('Reserva tu hora online', 'Elige sede, especialidad, profesional, día y hora. Confirmación inmediata por correo. Culmen Odontología, Talca.', '/reservar');
  const [q] = useSearchParams();
  const profesional = q.get('profesional') ?? undefined;
  const inicial = {
    sede: q.get('sede') ?? undefined,
    area: q.get('area') ?? (profesional ? areaDe(profesional).id : undefined),
    profesional,
  };
  return (
    <>
      <section className={`${s.cabecera} on-dark`}>
        <div className="contenedor">
          <Etiqueta claro>Reserva online</Etiqueta>
          <h1>Reserva tu hora <em>en un minuto</em></h1>
          <p>Horas libres reales de ambas sedes. Recibes la confirmación por correo, con un enlace para cancelar si lo necesitas.</p>
        </div>
      </section>
      <section className={s.cuerpo}>
        <div className="contenedor">
          <Reserva key={q.toString()} inicial={inicial} nivel="h2" />
        </div>
      </section>
    </>
  );
}
