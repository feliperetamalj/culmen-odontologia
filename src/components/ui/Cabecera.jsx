import { Etiqueta } from './Etiqueta.jsx';
import s from './Cabecera.module.css';

/** Encabezado de sección: etiqueta + titular + bajada. */
export function Cabecera({ etiqueta, titulo, texto, claro = false, centrado = false, nivel: H = 'h2', children }) {
  return (
    <div className={`${s.cabecera} ${centrado ? s.centrado : ''} ${claro ? s.claro : ''}`}>
      {etiqueta && <Etiqueta claro={claro}>{etiqueta}</Etiqueta>}
      <H className={s.titulo}>{titulo}</H>
      {texto && <p className={s.texto}>{texto}</p>}
      {children}
    </div>
  );
}
