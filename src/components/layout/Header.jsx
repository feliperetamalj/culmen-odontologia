import { useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { NAV, SEDES } from '../../data/clinica.js';
import { whatsapp } from '../../utils/enlaces.js';
import { Boton, Icono } from '../ui';
import logo from '../../assets/marca/logo-blanco.png';
import s from './Header.module.css';

export function Header() {
  const menu = useRef(null);
  const { pathname } = useLocation();
  useEffect(() => menu.current?.close(), [pathname]); // cerrar al navegar

  return (
    <header className={`${s.header} on-dark`}>
      <div className={`contenedor ${s.barra}`}>
        <Link to="/" className={s.marca} aria-label="Culmen Odontología, inicio">
          <img src={logo} alt="" width="150" height="58" />
        </Link>

        <nav aria-label="Principal" className={s.nav}>
          <ul>
            {NAV.map((n) => (
              <li key={n.a}>
                <NavLink to={n.a} className={({ isActive }) => `${s.enlace} ${isActive ? s.activo : ''}`}>
                  {n.texto}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className={s.acciones}>
          <Boton a="/reservar" tamano="sm" className={s.cta}>
            <Icono nombre="calendario" />
            Reservar hora
          </Boton>
          <button
            type="button"
            className={s.botonMenu}
            onClick={() => menu.current.showModal()}
            aria-haspopup="dialog"
          >
            <Icono nombre="menu" tamano="24" />
            <span className="sr-only">Abrir menú</span>
          </button>
        </div>
      </div>

      <dialog ref={menu} className={s.menu} aria-label="Menú" onClick={(e) => e.target === menu.current && menu.current.close()}>
        <div className={s.menuCuerpo}>
          <div className={s.menuCabecera}>
            <img src={logo} alt="Culmen Odontología" width="130" height="50" />
            <button type="button" className={s.botonMenu} onClick={() => menu.current.close()}>
              <Icono nombre="cerrar" tamano="24" />
              <span className="sr-only">Cerrar menú</span>
            </button>
          </div>
          <nav aria-label="Menú móvil">
            <ul className={s.menuLista}>
              <li><NavLink to="/" end className={s.menuEnlace}>Inicio</NavLink></li>
              {NAV.map((n) => (
                <li key={n.a}><NavLink to={n.a} className={s.menuEnlace}>{n.texto}</NavLink></li>
              ))}
            </ul>
          </nav>
          <div className={s.menuPie}>
            <Boton a="/reservar" tamano="lg">
              <Icono nombre="calendario" />
              Reservar hora online
            </Boton>
            {SEDES.map((sede) => (
              <Boton key={sede.id} a={whatsapp(sede.whatsapp)} variante="contornoClaro">
                <Icono nombre="mensaje" />
                WhatsApp {sede.nombre.replace('Sucursal ', '')}
              </Boton>
            ))}
          </div>
        </div>
      </dialog>
    </header>
  );
}
