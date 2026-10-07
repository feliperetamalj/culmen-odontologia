import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../utils/api.js';
import { fechaLarga, hora } from '../utils/fechas.js';
import { whatsapp } from '../utils/enlaces.js';
import { useTitulo } from '../hooks/useTitulo.js';
import { Boton, Etiqueta, Icono } from '../components/ui';
import s from './Cancelar.module.css';

export function Cancelar() {
  useTitulo('Cancelar hora');
  const [q] = useSearchParams();
  const token = q.get('token');
  const [estado, setEstado] = useState({ fase: 'cargando' });

  useEffect(() => {
    if (!token) { setEstado({ fase: 'error', mensaje: 'El enlace no es válido.' }); return; }
    api('ver', { token })
      .then((r) => setEstado({ fase: r.estado === 'cancelada' ? 'cancelada' : r.cancelable ? 'confirmar' : 'pasada', ...r }))
      .catch((e) => setEstado({ fase: 'error', mensaje: e.message }));
  }, [token]);

  async function cancelar() {
    setEstado((e) => ({ ...e, enviando: true }));
    try {
      await api('cancelar', { token });
      setEstado((e) => ({ ...e, fase: 'lista', enviando: false }));
    } catch (err) {
      setEstado((e) => ({ ...e, enviando: false, mensaje: err.message }));
    }
  }

  const r = estado.reserva;
  return (
    <section className={`${s.pagina} on-dark`}>
      <div className={`contenedor ${s.caja}`}>
        <Etiqueta claro>Tu reserva</Etiqueta>
        {estado.fase === 'cargando' && <h1>Buscando tu reserva…</h1>}
        {estado.fase === 'error' && (
          <>
            <h1>No encontramos esta reserva</h1>
            <p>{estado.mensaje} Si necesitas ayuda, escríbenos por WhatsApp.</p>
            <Boton a="/reservar">Reservar una hora</Boton>
          </>
        )}
        {r && (
          <>
            <h1>
              {estado.fase === 'confirmar' && '¿Quieres cancelar esta hora?'}
              {estado.fase === 'lista' && 'Listo, tu hora fue cancelada'}
              {estado.fase === 'cancelada' && 'Esta hora ya estaba cancelada'}
              {estado.fase === 'pasada' && 'Esta hora ya pasó'}
            </h1>
            <dl className={`${s.detalle} ${estado.fase === 'confirmar' ? '' : s.tachado}`}>
              <div><dt>Día</dt><dd>{fechaLarga(r.inicio)}, {hora(r.inicio)}</dd></div>
              <div><dt>Profesional</dt><dd>{r.profesional}</dd></div>
              <div><dt>Sede</dt><dd>{r.sede} · {r.direccion}</dd></div>
            </dl>
            {estado.mensaje && estado.fase === 'confirmar' && (
              <p className={s.error} role="alert"><Icono nombre="alerta" /> {estado.mensaje}</p>
            )}
            <div className={s.acciones}>
              {estado.fase === 'confirmar' ? (
                <>
                  <Boton variante="primario" onClick={cancelar} disabled={estado.enviando}>
                    {estado.enviando ? 'Cancelando…' : 'Sí, cancelar mi hora'}
                  </Boton>
                  <Boton a="/" variante="contornoClaro">No, mantener mi hora</Boton>
                </>
              ) : (
                <>
                  <Boton a="/reservar">Reservar otra hora</Boton>
                  <Boton a={whatsapp(r.whatsapp.replace('+', ''))} variante="contornoClaro">
                    <Icono nombre="mensaje" /> Escribir por WhatsApp
                  </Boton>
                </>
              )}
            </div>
            {estado.fase === 'lista' && <p>La hora quedó libre para otro paciente. Gracias por avisarnos.</p>}
          </>
        )}
      </div>
    </section>
  );
}
