import { Link } from 'react-router-dom';
import s from './Boton.module.css';

/** Botón o enlace con aspecto de botón. `a` interno → Link, externo → <a>, sin `a` → <button>. */
export function Boton({ a, variante = 'primario', tamano = 'md', className = '', children, ...resto }) {
  const clase = `${s.boton} ${s[variante]} ${s[tamano]} ${className}`;
  if (a && /^(https?:|mailto:|tel:)/.test(a)) {
    return <a href={a} className={clase} target="_blank" rel="noopener noreferrer" {...resto}>{children}</a>;
  }
  if (a) return <Link to={a} className={clase} {...resto}>{children}</Link>;
  return <button type="button" className={clase} {...resto}>{children}</button>;
}
