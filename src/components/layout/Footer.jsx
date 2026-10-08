import { Link } from 'react-router-dom';
import { CLINICA, DESARROLLO, NAV, SEDES } from '../../data/clinica.js';
import { whatsapp } from '../../utils/enlaces.js';
import { Boton, Icono } from '../ui';
import logo from '../../assets/marca/logo-blanco.png';
import s from './Footer.module.css';

export function Footer() {
  return (
    <footer className={`${s.footer} on-dark`}>
      <div className="contenedor">
        <div className={s.cierre}>
          <p className={s.promesa}>
            Odontología sin miedo, <em>con un plan que decides tú.</em>
          </p>
          <Boton a="/reservar" tamano="lg">
            <Icono nombre="calendario" />
            Reservar mi hora
          </Boton>
        </div>

        <div className={s.grilla}>
          <div className={s.marca}>
            <img src={logo} alt="Culmen Odontología" width="190" height="73" loading="lazy" />
            <p>Clínica dental en Talca. {CLINICA.lema}.</p>
          </div>

          {SEDES.map((sede) => (
            <address key={sede.id} className={s.columna}>
              <h2>{sede.nombre}</h2>
              <p>{sede.direccion}<br />{sede.referencia}</p>
              <a href={whatsapp(sede.whatsapp)} target="_blank" rel="noopener noreferrer" className={s.enlace}>
                <Icono nombre="mensaje" /> {sede.telefono}
              </a>
              <a href={sede.maps} target="_blank" rel="noopener noreferrer" className={s.enlace}>
                <Icono nombre="ubicacion" /> Cómo llegar
              </a>
            </address>
          ))}

          <div className={s.columna}>
            <h2>Horario</h2>
            <dl className={s.horario}>
              {CLINICA.horario.map(([d, h]) => (
                <div key={d}><dt>{d}</dt><dd className="tabular">{h}</dd></div>
              ))}
            </dl>
            <a href={`mailto:${CLINICA.email}`} className={s.enlace}>
              <Icono nombre="correo" /> {CLINICA.email}
            </a>
          </div>
        </div>

        <div className={s.base}>
          <nav aria-label="Pie de página">
            <ul>
              {NAV.map((n) => <li key={n.a}><Link to={n.a}>{n.texto}</Link></li>)}
              <li><Link to="/reservar">Reservar hora</Link></li>
            </ul>
          </nav>
          <p>© {new Date().getFullYear()} {CLINICA.nombre} · © {DESARROLLO.nombre} {DESARROLLO.anio}</p>
        </div>
      </div>
    </footer>
  );
}
