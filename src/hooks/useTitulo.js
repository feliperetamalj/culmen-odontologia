import { useEffect } from 'react';

const BASE = 'https://www.culmenodontologia.cl';

/** Título, descripción y canónica por ruta. */
export function useTitulo(titulo, descripcion, ruta) {
  useEffect(() => {
    document.title = titulo ? `${titulo} · Culmen Odontología` : 'Culmen Odontología · Clínica dental en Talca · Reserva tu hora online';
    if (descripcion) document.querySelector('meta[name="description"]')?.setAttribute('content', descripcion);
    if (ruta !== undefined) document.querySelector('link[rel="canonical"]')?.setAttribute('href', `${BASE}${ruta}`);
  }, [titulo, descripcion, ruta]);
}
