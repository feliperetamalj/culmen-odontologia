import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { SEDES } from '../../data/clinica.js';
import { whatsapp } from '../../utils/enlaces.js';
import { Boton, Icono } from '../ui';
import s from './BarraMovil.module.css';

/** Acción persistente en móvil: aparece pasado el primer pantallazo. */
export function BarraMovil() {
  const centinela = useRef(null);
  const [pasado, setPasado] = useState(false);
  const [sobreAgenda, setSobreAgenda] = useState(false);
  const { pathname } = useLocation();
  const visible = pasado && !sobreAgenda && !pathname.startsWith('/reserva');

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setPasado(!e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(centinela.current);
    return () => io.disconnect();
  }, []);

  // Con la agenda en pantalla, su propio resumen fijo ocupa ese lugar.
  useEffect(() => {
    const agenda = document.getElementById('reservar');
    setSobreAgenda(false);
    if (!agenda) return;
    const io = new IntersectionObserver(([e]) => setSobreAgenda(e.isIntersecting));
    io.observe(agenda);
    return () => io.disconnect();
  }, [pathname]);

  return (
    <>
      <div ref={centinela} className={s.centinela} aria-hidden="true" />
      <div className={`${s.barra} ${visible ? s.visible : ''}`} inert={visible ? undefined : ''}>
        <Boton a="/reservar" className={s.principal}>
          <Icono nombre="calendario" />
          Reservar hora
        </Boton>
        <details className={s.wa}>
          <summary aria-label="Escribir por WhatsApp">
            <Icono nombre="mensaje" tamano="22" />
          </summary>
          <div className={s.opciones}>
            {SEDES.map((sede) => (
              <a key={sede.id} href={whatsapp(sede.whatsapp)} target="_blank" rel="noopener noreferrer">
                WhatsApp {sede.nombre.replace('Sucursal ', '')}
              </a>
            ))}
          </div>
        </details>
      </div>
    </>
  );
}
