import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Al cambiar de ruta vuelve arriba, o salta al ancla si la URL trae una. */
export function IrArriba() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      requestAnimationFrame(() => document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView());
      return;
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname, hash]);
  return null;
}
