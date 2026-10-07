import { useEffect, useMemo, useRef, useState } from 'react';
import { AREAS, areaPorId, porId } from '../../data/equipo.js';
import { SEDES, sedePorId } from '../../data/clinica.js';
import { api } from '../../utils/api.js';
import { diaDe, esManana, fechaLarga, hora, partesDia, rangoDias, sumarDias } from '../../utils/fechas.js';
import { googleCalendar, whatsapp } from '../../utils/enlaces.js';
import { iniciales, retrato } from '../../utils/media.js';
import { formatearRut, validarPaciente } from '../../../supabase/functions/reservas/validar.js';
import { Boton, Icono } from '../ui';
import s from './Reserva.module.css';

const DIAS = 14;
const PREVISIONES = ['Fonasa', 'Isapre', 'Seguro Culmen (Chubb)', 'Seguro complementario', 'Particular'];
const FORM_VACIO = { nombre: '', rut: '', email: '', telefono: '', prevision: '', comentario: '' };
const suave = () => (matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth');

export function Reserva({ inicial = {}, nivel: H = 'h3' }) {
  const areaInicial = areaPorId(inicial.area);
  const [sede, setSede] = useState(SEDES.some((x) => x.id === inicial.sede) ? inicial.sede : SEDES[0].id);
  const [area, setArea] = useState(areaInicial.id);
  const [prof, setProf] = useState(areaInicial.profesionales.includes(inicial.profesional) ? inicial.profesional : 'todos');
  const [desde, setDesde] = useState(null);
  const [recarga, setRecarga] = useState(0);
  const [carga, setCarga] = useState({ estado: 'cargando', slots: [], desde: null, error: null });
  const [dia, setDia] = useState(null);
  const [slot, setSlot] = useState(null);
  const [paso, setPaso] = useState(1);
  const [aviso, setAviso] = useState(null);
  const [resultado, setResultado] = useState(null);
  const raiz = useRef(null);
  const tituloPaso = useRef(null);
  const pasoPrevio = useRef(paso);

  // Horas libres de la sede y el motivo elegidos, 14 días a la vez.
  useEffect(() => {
    const ctrl = new AbortController();
    setCarga((c) => ({ ...c, estado: 'cargando', error: null }));
    api('horas', { sede, profesionales: areaPorId(area).profesionales, desde, dias: DIAS }, { signal: ctrl.signal })
      .then((r) => setCarga({ estado: 'listo', slots: r.slots, desde: r.desde, error: null }))
      .catch((e) => e.name !== 'AbortError' && setCarga({ estado: 'error', slots: [], desde: null, error: e.message }));
    return () => ctrl.abort();
  }, [sede, area, desde, recarga]);

  const conHoras = useMemo(() => new Set(carga.slots.map((x) => x.p)), [carga.slots]);

  // dia → (inicio → slot). Con "cualquier profesional" cada hora aparece una vez.
  const porDia = useMemo(() => {
    const mapa = new Map();
    for (const x of carga.slots) {
      if (prof !== 'todos' && x.p !== prof) continue;
      const d = diaDe(x.i);
      if (!mapa.has(d)) mapa.set(d, new Map());
      if (!mapa.get(d).has(x.i)) mapa.get(d).set(x.i, x);
    }
    return mapa;
  }, [carga.slots, prof]);

  useEffect(() => {
    if (carga.estado !== 'listo') return;
    if (!dia || !porDia.has(dia)) setDia(porDia.keys().next().value ?? null);
    if (slot && !porDia.get(diaDe(slot.i))?.has(slot.i)) setSlot(null);
  }, [porDia, carga.estado]); // eslint-disable-line react-hooks/exhaustive-deps

  // Al cambiar de paso, el foco va al título del paso (lectores de pantalla y teclado).
  useEffect(() => {
    if (pasoPrevio.current === paso) return;
    pasoPrevio.current = paso;
    tituloPaso.current?.focus({ preventScroll: true });
    raiz.current?.scrollIntoView({ behavior: suave(), block: 'start' });
  }, [paso]);

  const dias = carga.desde ? rangoDias(carga.desde, DIAS) : [];
  const horasDelDia = dia ? [...(porDia.get(dia)?.values() ?? [])] : [];
  const areaActual = areaPorId(area);
  const sedeActual = sedePorId(sede);
  const otraSede = SEDES.find((x) => x.id !== sede);
  const hoy = diaDe(Date.now());
  const opcionesProf = areaActual.profesionales.filter((id) => conHoras.has(id) || id === prof);

  const cambiar = (fn) => (e) => { fn(e.target.value); setSlot(null); setAviso(null); };
  const elegirSede = cambiar((v) => { setSede(v); setDesde(null); });
  const elegirArea = cambiar((v) => { setArea(v); setProf('todos'); setDesde(null); });

  const reiniciar = () => {
    setResultado(null); setSlot(null); setPaso(1); setRecarga((n) => n + 1);
  };

  return (
    <div ref={raiz} className={s.reserva} aria-busy={carga.estado === 'cargando'}>
      <ol className={s.pasos} aria-label="Pasos de la reserva">
        {['Elige tu hora', 'Tus datos', 'Confirmación'].map((t, i) => (
          <li key={t} aria-current={paso === i + 1 ? 'step' : undefined} className={paso > i + 1 ? s.hecho : ''}>
            <span className={s.numero}>{paso > i + 1 ? <Icono nombre="check" tamano="14" /> : i + 1}</span>
            <span className={s.pasoTexto}>{t}</span>
          </li>
        ))}
      </ol>

      {paso === 1 && (
        <div className={s.eleccion}>
          <H ref={tituloPaso} tabIndex={-1} className="sr-only">Paso 1: elige tu hora</H>
          <div className={s.filtros}>
            <fieldset className={s.grupo}>
              <legend>Sede</legend>
              <div className={s.segmentado}>
                {SEDES.map((x) => (
                  <label key={x.id} className={s.segmento}>
                    <input type="radio" name="sede" value={x.id} checked={sede === x.id} onChange={elegirSede} />
                    <span>{x.nombre.replace('Sucursal ', '')}</span>
                  </label>
                ))}
              </div>
              <p className={s.direccion}><Icono nombre="ubicacion" /> {sedeActual.direccion}, {sedeActual.referencia}</p>
            </fieldset>

            <fieldset className={s.grupo}>
              <legend>¿Qué necesitas?</legend>
              <div className={s.areas}>
                {AREAS.map((a) => (
                  <label key={a.id} className={s.area}>
                    <input type="radio" name="area" value={a.id} checked={area === a.id} onChange={elegirArea} />
                    <span className={s.areaNombre}>{a.nombre}</span>
                    <span className={s.areaDetalle}>{a.detalle}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          </div>

          <div className={s.agenda}>
            <fieldset className={s.grupo}>
              <legend>Profesional</legend>
              <div className={s.profesionales}>
                <label className={s.chip}>
                  <input type="radio" name="prof" value="todos" checked={prof === 'todos'} onChange={cambiar(setProf)} />
                  <span className={s.avatarTodos} aria-hidden="true"><Icono nombre="usuario" tamano="16" /></span>
                  Primera hora disponible
                </label>
                {opcionesProf.map((id) => {
                  const p = porId(id);
                  return (
                    <label key={id} className={s.chip}>
                      <input type="radio" name="prof" value={id} checked={prof === id} onChange={cambiar(setProf)} />
                      <Avatar p={p} />
                      {p.nombre}
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <fieldset className={s.grupo}>
              <div className={s.calendarioCabecera}>
                <legend>Día</legend>
                <div className={s.navFechas}>
                  <button
                    type="button"
                    onClick={() => { setDesde(sumarDias(carga.desde, -DIAS)); setSlot(null); }}
                    disabled={!carga.desde || carga.desde <= hoy}
                    aria-label="Fechas anteriores"
                  >
                    <Icono nombre="chevronIzq" />
                  </button>
                  <button
                    type="button"
                    onClick={() => { setDesde(sumarDias(carga.desde, DIAS)); setSlot(null); }}
                    disabled={!carga.desde}
                    aria-label="Fechas siguientes"
                  >
                    <Icono nombre="chevronDer" />
                  </button>
                </div>
              </div>
              <div className={s.dias}>
                {carga.estado === 'cargando' && !dias.length
                  ? Array.from({ length: 7 }, (_, i) => <span key={i} className={`${s.dia} ${s.esqueleto}`} />)
                  : dias.map((d) => {
                      const n = porDia.get(d)?.size ?? 0;
                      const p = partesDia(d);
                      return (
                        <label key={d} className={`${s.dia} ${n ? '' : s.sinHoras}`}>
                          <input
                            type="radio" name="dia" value={d} checked={dia === d} disabled={!n}
                            onChange={() => { setDia(d); setSlot(null); }}
                            aria-label={`${p.largo}, ${n ? `${n} horas libres` : 'sin horas'}`}
                          />
                          <span className={s.diaSemana}>{d === hoy ? 'hoy' : p.semana}</span>
                          <span className={s.diaNumero}>{p.numero}</span>
                          <span className={s.diaMes}>{n ? `${n} h` : p.mes}</span>
                        </label>
                      );
                    })}
              </div>
            </fieldset>

            {aviso && (
              <p className={s.aviso} role="alert"><Icono nombre="alerta" /> {aviso}</p>
            )}

            {carga.estado === 'error' ? (
              <SinHoras titulo="No pudimos cargar las horas." texto={carga.error} sede={sedeActual}>
                <Boton variante="oscuro" onClick={() => setRecarga((n) => n + 1)}>Reintentar</Boton>
              </SinHoras>
            ) : carga.estado === 'listo' && porDia.size === 0 ? (
              <SinHoras
                titulo="No quedan horas online en estas fechas."
                texto={`Para ${prof === 'todos' ? areaActual.nombre.toLowerCase() : porId(prof).nombre} en ${sedeActual.nombre}. Prueba la otra sede o las fechas siguientes.`}
                sede={sedeActual}
              >
                <Boton variante="oscuro" onClick={() => { setSede(otraSede.id); setDesde(null); }}>
                  Ver {otraSede.nombre.replace('Sucursal ', '')}
                </Boton>
                <Boton variante="contorno" onClick={() => setDesde(sumarDias(carga.desde, DIAS))}>
                  Fechas siguientes
                </Boton>
              </SinHoras>
            ) : (
              <fieldset className={`${s.grupo} ${carga.estado === 'cargando' ? s.cargando : ''}`}>
                <legend>{dia ? `Horas del ${partesDia(dia).largo}` : 'Horas'}</legend>
                {[['Mañana', true], ['Tarde', false]].map(([rotulo, manana]) => {
                  const lista = horasDelDia.filter((x) => esManana(x.i) === manana);
                  if (!lista.length) return null;
                  return (
                    <div key={rotulo} className={s.bloqueHoras}>
                      <p className={s.rotulo}>{rotulo}</p>
                      <div className={s.horas}>
                        {lista.map((x) => (
                          <label key={x.i} className={s.hora}>
                            <input
                              type="radio" name="hora" value={x.i} checked={slot?.i === x.i}
                              onChange={() => { setSlot(x); setAviso(null); }}
                            />
                            <span className="tabular">{hora(x.i)}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </fieldset>
            )}
          </div>

          <div className={`${s.resumen} ${slot ? s.resumenActivo : ''}`}>
            {slot ? (
              <>
                <Avatar p={porId(slot.p)} grande />
                <div className={s.resumenTexto}>
                  <strong>{fechaLarga(slot.i)}, {hora(slot.i)}</strong>
                  <span>{porId(slot.p).nombre} · {sedeActual.nombre}</span>
                </div>
                <Boton onClick={() => setPaso(2)} className={s.continuar}>
                  Continuar <Icono nombre="flecha" />
                </Boton>
              </>
            ) : (
              <p className={s.resumenVacio}><Icono nombre="reloj" /> Elige un día y una hora para continuar.</p>
            )}
          </div>
        </div>
      )}

      {paso === 2 && slot && (
        <Datos
          H={H}
          tituloRef={tituloPaso}
          slot={slot}
          sede={sedeActual}
          area={areaActual}
          onVolver={() => setPaso(1)}
          onListo={(r) => { setResultado(r); setPaso(3); }}
          onOcupada={(mensaje) => { setAviso(mensaje); setSlot(null); setPaso(1); setRecarga((n) => n + 1); }}
        />
      )}

      {paso === 3 && resultado && <Confirmacion H={H} tituloRef={tituloPaso} resultado={resultado} onOtra={reiniciar} />}
    </div>
  );
}

function Avatar({ p, grande = false }) {
  const src = p.foto && retrato(p.id);
  return (
    <span className={`${s.avatar} ${grande ? s.avatarGrande : ''}`} aria-hidden="true">
      {src ? <img src={src} alt="" loading="lazy" /> : iniciales(p.nombre)}
    </span>
  );
}

function SinHoras({ titulo, texto, sede, children }) {
  return (
    <div className={s.sinHorasCaja}>
      <p className={s.sinHorasTitulo}>{titulo}</p>
      <p>{texto}</p>
      <div className={s.sinHorasAcciones}>
        {children}
        <Boton variante="texto" a={whatsapp(sede.whatsapp)}>
          <Icono nombre="mensaje" /> Escribir por WhatsApp
        </Boton>
      </div>
    </div>
  );
}

// --- Paso 2 ------------------------------------------------------------------

function Datos({ H, tituloRef, slot, sede, area, onVolver, onListo, onOcupada }) {
  const [form, setForm] = useState(FORM_VACIO);
  const [errores, setErrores] = useState({});
  const [tocados, setTocados] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState(null);
  const trampa = useRef(null);
  const p = porId(slot.p);

  const actualizar = (campo) => (e) => {
    const valor = e.target.value;
    setForm((f) => ({ ...f, [campo]: valor }));
    if (tocados[campo]) setErrores(validarPaciente({ ...form, [campo]: valor }).errores);
  };
  const salir = (campo) => () => {
    setTocados((t) => ({ ...t, [campo]: true }));
    if (campo === 'rut' && form.rut) setForm((f) => ({ ...f, rut: formatearRut(f.rut) }));
    setErrores(validarPaciente(form).errores);
  };

  async function enviar(e) {
    e.preventDefault();
    setErrorEnvio(null);
    const { errores: errs } = validarPaciente(form);
    setErrores(errs);
    setTocados({ nombre: true, rut: true, email: true, telefono: true });
    const primero = Object.keys(errs)[0];
    if (primero) { document.getElementById(`r-${primero}`)?.focus(); return; }

    setEnviando(true);
    try {
      const r = await api('reservar', {
        sede: sede.id, profesional: slot.p, inicio: slot.i, motivo: area.nombre,
        paciente: form, empresa: trampa.current?.value,
      });
      if (r.ok === false) { setErrores(r.errores ?? {}); return; }
      onListo(r);
    } catch (err) {
      if (err.status === 409) onOcupada(err.message);
      else setErrorEnvio(err.message);
    } finally {
      setEnviando(false);
    }
  }

  const campo = (id, etiqueta, props = {}, ayuda) => {
    const error = tocados[id] && errores[id];
    return (
      <div className={s.campo}>
        <label htmlFor={`r-${id}`}>{etiqueta}</label>
        <input
          id={`r-${id}`}
          value={form[id]}
          onChange={actualizar(id)}
          onBlur={salir(id)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `r-${id}-error` : ayuda ? `r-${id}-ayuda` : undefined}
          required
          {...props}
        />
        {error ? (
          <p id={`r-${id}-error`} className={s.error}><Icono nombre="alerta" tamano="16" /> {error}</p>
        ) : ayuda ? (
          <p id={`r-${id}-ayuda`} className={s.ayuda}>{ayuda}</p>
        ) : null}
      </div>
    );
  };

  return (
    <form className={s.datos} onSubmit={enviar} noValidate>
      <div className={s.datosResumen}>
        <Avatar p={p} grande />
        <div>
          <p className={s.datosFecha}>{fechaLarga(slot.i)}</p>
          <p className={`${s.datosHora} tabular`}>{hora(slot.i)} – {hora(slot.f)}</p>
          <p>{p.nombre} · {p.especialidad}</p>
          <p className={s.datosSede}><Icono nombre="ubicacion" tamano="16" /> {sede.nombre}, {sede.direccion}</p>
        </div>
        <Boton variante="texto" onClick={onVolver} className={s.cambiar}>Cambiar</Boton>
      </div>

      <div className={s.formulario}>
        <H ref={tituloRef} tabIndex={-1} className={s.tituloPaso}>¿A nombre de quién reservamos?</H>
        <div className={s.campos}>
          {campo('nombre', 'Nombre y apellido', { autoComplete: 'name' })}
          {campo('rut', 'RUT', { autoComplete: 'off', inputMode: 'text', placeholder: '12.345.678-9', maxLength: 12 })}
          {campo('email', 'Correo electrónico', { type: 'email', autoComplete: 'email', inputMode: 'email' }, 'Aquí te llega la confirmación.')}
          {campo('telefono', 'Celular', { type: 'tel', autoComplete: 'tel', inputMode: 'tel', placeholder: '9 1234 5678' }, 'Por si necesitamos avisarte algo de tu hora.')}
          <div className={s.campo}>
            <label htmlFor="r-prevision">Previsión <span className={s.opcional}>(opcional)</span></label>
            <select id="r-prevision" value={form.prevision} onChange={actualizar('prevision')}>
              <option value="">Selecciona</option>
              {PREVISIONES.map((x) => <option key={x}>{x}</option>)}
            </select>
          </div>
          <div className={`${s.campo} ${s.ancho}`}>
            <label htmlFor="r-comentario">¿Algo que debamos saber? <span className={s.opcional}>(opcional)</span></label>
            <textarea
              id="r-comentario" rows={3} maxLength={500} value={form.comentario} onChange={actualizar('comentario')}
              placeholder="Por ejemplo: tengo dolor, quiero evaluar sedación, es para mi hijo…"
            />
          </div>
          <div className={s.trampa} aria-hidden="true">
            <label htmlFor="r-empresa">Empresa</label>
            <input id="r-empresa" ref={trampa} tabIndex={-1} autoComplete="off" />
          </div>
        </div>

        {errorEnvio && <p className={s.aviso} role="alert"><Icono nombre="alerta" /> {errorEnvio}</p>}

        <div className={s.enviar}>
          <Boton type="submit" tamano="lg" disabled={enviando}>
            {enviando ? 'Reservando…' : 'Confirmar reserva'}
            {!enviando && <Icono nombre="check" />}
          </Boton>
          <p className={s.legal}>
            Usamos tus datos solo para gestionar esta hora. Recibirás la confirmación por correo, con un enlace para cancelar si lo necesitas.
          </p>
        </div>
      </div>
    </form>
  );
}

// --- Paso 3 ------------------------------------------------------------------

function Confirmacion({ H, tituloRef, resultado, onOtra }) {
  const r = resultado.reserva;
  return (
    <div className={s.confirmacion}>
      <span className={s.sello} aria-hidden="true"><Icono nombre="check" tamano="34" /></span>
      <H ref={tituloRef} tabIndex={-1} className={s.tituloConfirmacion}>
        Listo, {r.nombre}. Tu hora quedó reservada.
      </H>
      <dl className={s.detalle}>
        <div><dt>Día</dt><dd>{fechaLarga(r.inicio)}</dd></div>
        <div><dt>Hora</dt><dd className="tabular">{hora(r.inicio)} – {hora(r.fin)}</dd></div>
        <div><dt>Profesional</dt><dd>{r.profesional}<small>{r.especialidad}</small></dd></div>
        <div><dt>Sede</dt><dd>{r.sede}<small>{r.direccion}</small></dd></div>
      </dl>
      <p className={s.correo}>
        {resultado.correo
          ? 'Te enviamos la confirmación por correo, con un enlace para cancelar si lo necesitas.'
          : 'Tu hora quedó registrada, pero no pudimos enviarte el correo. Guarda una captura de esta pantalla o escríbenos por WhatsApp si necesitas cambiarla.'}
      </p>
      <div className={s.confirmacionAcciones}>
        <Boton a={googleCalendar(r)} variante="oscuro"><Icono nombre="calendario" /> Agregar a mi calendario</Boton>
        <Boton a={r.maps} variante="contorno"><Icono nombre="ubicacion" /> Cómo llegar</Boton>
        <Boton variante="texto" onClick={onOtra}>Reservar otra hora</Boton>
      </div>
    </div>
  );
}
