// Imágenes resueltas en compilación (con hash, sin parpadeo).
const FOTOS = import.meta.glob('../assets/fotos/*.webp', { eager: true, import: 'default' });
const EQUIPO = import.meta.glob('../assets/equipo/*.webp', { eager: true, import: 'default' });

export const foto = (nombre) => FOTOS[`../assets/fotos/${nombre}.webp`];
export const retrato = (id) => EQUIPO[`../assets/equipo/${id}.webp`];

export const iniciales = (nombre) =>
  nombre.replace(/^Dra?\.\s*/, '').split(' ').slice(0, 2).map((p) => p[0]).join('');
