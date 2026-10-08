import { useEffect, useRef, useState } from 'react';
import { RESENAS, SEDES, VIDEO } from '../data/clinica.js';
import { CIFRAS } from '../data/equipo.js';
import { COBERTURA, EXPERIENCIA, INSTALACIONES, PILARES, TRATAMIENTOS } from '../data/paginas.js';
import { foto } from '../utils/media.js';
import { reservarCon } from '../utils/enlaces.js';
import { useTitulo } from '../hooks/useTitulo.js';
import { Boton, Cabecera, Etiqueta, Icono, Reveal } from '../components/ui';
import { Equipo } from '../components/sections/Equipo.jsx';
import { Preguntas } from '../components/sections/Preguntas.jsx';
import { Sedes } from '../components/sections/Sedes.jsx';
import { Guia } from '../components/sections/Guia.jsx';
import s from './Inicio.module.css';

const DESTACADOS = [
  'andres-aguayo', 'rosario-cardenas', 'carlos-mendez', 'juan-pablo-aguilera',
  'constanza-yanez', 'francisca-del-pino', 'pablo-venegas', 'barbara-avendano',
];

export function Inicio() {
  useTitulo(null, 'Clínica dental en Talca con sedes en el Centro y Las Rastras. Reserva tu hora online: primera evaluación de hasta 45 minutos, ortodoncia, implantes, sedación y 17 profesionales. 5.0 en Google.', '/');
  return (
    <>
      <Hero />
      <PrimeraCita />
      <Tratamientos />
      <Guia />
      <Equipo
        ids={DESTACADOS}
        titulo={<>{CIFRAS.profesionales} profesionales, <em>una misma forma de atender</em></>}
        texto="Especialistas formados en las principales universidades del país, unidos por la misma vocación: cuidar tu salud dental con excelencia y empatía."
        verTodos
        fondo="blanco"
      />
      <Cobertura />
      <Experiencia />
      <Resenas />
      <Sedes />
      <Preguntas />
    </>
  );
}

function Hero() {
  return (
    <section className={`${s.hero} on-dark`}>
      <HeroFondo />
      <div className={`contenedor ${s.heroContenido}`}>
        <div className={s.heroTexto}>
          <Etiqueta claro>Clínica dental en Talca · Centro y Las Rastras</Etiqueta>
          <h1 className={s.titular}>
            <span className={s.linea}>Odontología sin miedo,</span>{' '}
            <em className={s.linea}>con un plan que decides tú.</em>
          </h1>
          <p className={s.bajada}>
            En tu primera cita nos tomamos hasta 45 minutos para conocerte, resolver tus dudas y entregarte un
            diagnóstico claro. Sin juicios, con todas las alternativas sobre la mesa.
          </p>
          <div className={s.acciones}>
            <Boton a="/reservar" tamano="lg">
              <Icono nombre="calendario" /> Reservar hora
            </Boton>
            <Boton a="#sedes" tamano="lg" variante="contornoClaro">
              <Icono nombre="ubicacion" /> Nuestras sedes
            </Boton>
          </div>
          <p className={s.micro}><Icono nombre="check" tamano="16" /> Reserva en 1 minuto · confirmación inmediata por correo</p>
        </div>
      </div>

      <div className="contenedor">
        <dl className={s.pruebas}>
          <div>
            <dt>Google</dt>
            <dd>
              <span className={s.estrellas} aria-hidden="true">{[0, 1, 2, 3, 4].map((i) => <Icono key={i} nombre="estrella" tamano="15" />)}</span>
              <strong className="tabular">{RESENAS.nota.toFixed(1)}</strong> · {RESENAS.total} reseñas
            </dd>
          </div>
          <div><dt>Equipo</dt><dd><strong className="tabular">{CIFRAS.profesionales}</strong> profesionales</dd></div>
          <div><dt>Sedes</dt><dd><strong className="tabular">{SEDES.length}</strong> en Talca</dd></div>
          <div><dt>Sedación</dt><dd>Consciente y endovenosa</dd></div>
        </dl>
      </div>
    </section>
  );
}

// Foto del equipo de inmediato; el video de presentación se suma cuando la página
// terminó de cargar (no compite con la primera pintura). Solo se muestra cuando
// YouTube confirma que está reproduciendo: si el navegador bloquea la reproducción
// automática, queda la foto. Sin video si se pidió menos movimiento o ahorro de datos.
const YT = 'https://www.youtube-nocookie.com';
const VIDEO_SRC = `${YT}/embed/${VIDEO.youtube}?autoplay=1&mute=1&loop=1&playlist=${VIDEO.youtube}&controls=0&playsinline=1&rel=0&modestbranding=1&disablekb=1&iv_load_policy=3&enablejsapi=1`;

function HeroFondo() {
  const [cargar, setCargar] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pausado, setPausado] = useState(false);
  const iframe = useRef(null);

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || navigator.connection?.saveData) return;
    const t = setTimeout(() => setCargar(true), document.readyState === 'complete' ? 600 : 2000);
    return () => clearTimeout(t);
  }, []);

  // Estado del reproductor vía postMessage (API de iframes de YouTube, sin cargar su script).
  useEffect(() => {
    if (!cargar) return;
    let espera;
    const alRecibir = (e) => {
      if (e.origin !== YT || e.source !== iframe.current?.contentWindow) return;
      let d;
      try { d = JSON.parse(e.data); } catch { return; }
      const estado = d.event === 'onStateChange' ? d.info : d.info?.playerState;
      // 1 = reproduciendo. Se espera a que YouTube oculte título y rótulos.
      if (estado === 1 && !espera) espera = setTimeout(() => setVisible(true), 3500);
    };
    window.addEventListener('message', alRecibir);
    return () => { window.removeEventListener('message', alRecibir); clearTimeout(espera); };
  }, [cargar]);

  const escuchar = () =>
    iframe.current?.contentWindow?.postMessage(JSON.stringify({ event: 'listening', id: 'hero', channel: 'widget' }), YT);

  const alternar = () => {
    iframe.current?.contentWindow?.postMessage(
      JSON.stringify({ event: 'command', func: pausado ? 'playVideo' : 'pauseVideo', args: [] }),
      YT,
    );
    setPausado(!pausado);
  };

  return (
    <>
      <div className={s.fondo}>
        <img src={foto('hero-equipo')} alt="" fetchpriority="high" decoding="async" width="1800" height="1203" />
        {cargar && (
          <iframe
            ref={iframe}
            className={`${s.video} ${visible ? s.videoVisible : ''}`}
            src={`${VIDEO_SRC}&origin=${encodeURIComponent(window.location.origin)}`}
            title={VIDEO.titulo}
            allow="autoplay; encrypted-media; picture-in-picture"
            tabIndex={-1}
            aria-hidden="true"
            onLoad={escuchar}
          />
        )}
        <div className={s.velo} />
      </div>
      {visible && (
        <button type="button" className={s.pausa} onClick={alternar}>
          <Icono nombre={pausado ? 'play' : 'pausa'} tamano="18" />
          <span className="sr-only">{pausado ? 'Reproducir video de presentación' : 'Pausar video de presentación'}</span>
        </button>
      )}
    </>
  );
}

function PrimeraCita() {
  return (
    <section className={s.primera}>
      <div className={`contenedor ${s.primeraGrilla}`}>
        <Reveal className={s.promesa}>
          <Etiqueta>Tu primera cita</Etiqueta>
          <p className={s.cuarenta} aria-hidden="true">45<span>min</span></p>
          <h2>Nos tomamos el tiempo que necesitas.</h2>
          <p>
            Hasta 45 minutos para conocerte, resolver tus dudas y entregarte un diagnóstico claro, con un plan de
            tratamiento definido contigo según tus necesidades y preferencias.
          </p>
        </Reveal>
        <ul className={s.pilares}>
          {PILARES.map((p, i) => (
            <Reveal as="li" key={p.titulo} retraso={i * 80} className={s.pilar}>
              <span className={s.pilarIcono}><Icono nombre={p.icono} tamano="26" /></span>
              <h3>{p.titulo}</h3>
              <p>{p.texto}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Tratamientos() {
  return (
    <section className={s.tratamientos}>
      <div className="contenedor">
        <Cabecera
          etiqueta="Tratamientos"
          titulo={<>¿Qué necesitas <em>resolver?</em></>}
          texto="Desde una limpieza hasta un implante. Si no sabes por dónde empezar, reserva odontología general y te orientamos."
        />
        <ul className={s.catalogo}>
          {TRATAMIENTOS.map((t, i) => (
            <Reveal as="li" key={t.titulo} retraso={(i % 3) * 80} className={s.tratamiento}>
              <div className={s.tratamientoFoto}>
                <img src={foto(t.foto)} alt="" loading="lazy" decoding="async" />
              </div>
              <div className={s.tratamientoCuerpo}>
                <h3>{t.titulo}</h3>
                <p>{t.texto}</p>
                <div className={s.tratamientoAcciones}>
                  <Boton a={t.a} variante="texto">Conocer más<span className="sr-only"> sobre {t.titulo}</span> <Icono nombre="flecha" /></Boton>
                  <Boton a={reservarCon({ area: t.area })} variante="contorno" tamano="sm">Ver horas<span className="sr-only"> de {t.titulo}</span></Boton>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Cobertura() {
  return (
    <section className={s.cobertura}>
      <div className="contenedor">
        <Cabecera
          etiqueta="Financiamiento"
          titulo={<>¿Me sirve <em>mi seguro?</em></>}
          texto="Lo resolvemos el mismo día. Y si no tienes seguro, también tenemos alternativas."
        />
        <div className={s.coberturaGrilla}>
          <Reveal className={s.cobCaja}>
            <Icono nombre="escudo" tamano="28" />
            <h3>Reembolso en línea I-Med</h3>
            <p>Bonificación automática con:</p>
            <ul className={s.lista}>{COBERTURA.isapres.map((x) => <li key={x.nombre}>{x.nombre}</li>)}</ul>
            <p className={s.cobNota}>¿Otro seguro? Te dejamos listo el reembolso el mismo día.</p>
          </Reveal>
          <Reveal className={`${s.cobCaja} ${s.cobDestacada} on-dark`} retraso={90}>
            <Icono nombre="corazon" tamano="28" />
            <h3>Seguro Culmen con Chubb</h3>
            <p>La única clínica de la región con seguro dental propio.</p>
            <dl className={s.cobCifras}>
              {COBERTURA.seguro.map((c) => (
                <div key={c.texto}><dt>{c.texto}</dt><dd className="tabular">{c.valor}</dd></div>
              ))}
            </dl>
          </Reveal>
          <Reveal className={s.cobCaja} retraso={180}>
            <Icono nombre="tarjeta" tamano="28" />
            <h3>Convenios y cuotas</h3>
            <p>Beneficios para trabajadores de:</p>
            <ul className={s.lista}>{COBERTURA.convenios.map((x) => <li key={x.nombre}>{x.nombre}</li>)}</ul>
            <p className={s.cobNota}>Efectivo, débito y crédito, con pago en cuotas.</p>
          </Reveal>
        </div>
        <Boton a="/financiamiento" variante="texto" className={s.cobMas}>
          Ver todas las opciones de financiamiento <Icono nombre="flecha" />
        </Boton>
      </div>
    </section>
  );
}

function Experiencia() {
  return (
    <section className={`${s.experiencia} on-dark`}>
      <div className="contenedor">
        <Cabecera
          claro
          etiqueta="Tu experiencia en Culmen"
          titulo={<>Tecnología de punta, <em>trato de familia</em></>}
          texto="Espacios pensados para tu comodidad, con equipamiento digital que hace los diagnósticos más precisos y los tratamientos más rápidos."
        />
        <ul className={s.experienciaLista}>
          {EXPERIENCIA.map((x) => (
            <li key={x.titulo}><h3>{x.titulo}</h3><p>{x.texto}</p></li>
          ))}
        </ul>
        <ul className={s.galeria}>
          {INSTALACIONES.map((x, i) => (
            <Reveal as="li" key={x.foto} retraso={(i % 3) * 80} className={s.galeriaItem}>
              <figure>
                <img src={foto(x.foto)} alt={x.texto} loading="lazy" decoding="async" />
                <figcaption>{x.texto}</figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Resenas() {
  return (
    <section className={s.resenas}>
      <div className={`contenedor ${s.resenasGrilla}`}>
        <div className={s.nota}>
          <p className={s.notaNumero}>{RESENAS.nota.toFixed(1)}</p>
          <div>
            <span className={s.estrellasOscuras} aria-hidden="true">{[0, 1, 2, 3, 4].map((i) => <Icono key={i} nombre="estrella" tamano="20" />)}</span>
            <h2 className={s.notaTitulo}>{RESENAS.total} pacientes nos calificaron en Google</h2>
            <p className={s.notaFecha}>Promedio de ambas sedes al {RESENAS.fecha}.</p>
          </div>
        </div>
        <ul className={s.sedesResenas}>
          {SEDES.map((sede) => (
            <li key={sede.id}>
              <a href={sede.maps} target="_blank" rel="noopener noreferrer">
                <span>
                  <strong>{sede.nombre}</strong>
                  <small className="tabular">{sede.resenas.nota.toFixed(1)} ★ · {sede.resenas.total} reseñas</small>
                </span>
                <Icono nombre="externo" />
                <span className="sr-only">(abre Google Maps)</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
