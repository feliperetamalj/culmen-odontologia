import { NAV } from '../data/clinica.js';
import { useTitulo } from '../hooks/useTitulo.js';
import { Boton, Etiqueta, Icono } from '../components/ui';
import s from './Cancelar.module.css';

export function NoEncontrada() {
  useTitulo('Página no encontrada');
  return (
    <section className={`${s.pagina} on-dark`}>
      <div className={`contenedor ${s.caja}`}>
        <Etiqueta claro>Error 404</Etiqueta>
        <h1>Esta página no existe, pero tu hora sí puede.</h1>
        <p>Quizás buscabas alguno de estos tratamientos:</p>
        <div className={s.acciones}>
          <Boton a="/reservar"><Icono nombre="calendario" /> Reservar hora</Boton>
          {NAV.slice(1, 4).map((n) => <Boton key={n.a} a={n.a} variante="contornoClaro">{n.texto}</Boton>)}
        </div>
      </div>
    </section>
  );
}
