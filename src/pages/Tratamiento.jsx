import { useTitulo } from '../hooks/useTitulo.js';
import { PageHero } from '../components/sections/PageHero.jsx';
import { Bloques } from '../components/sections/Bloques.jsx';
import { CtaReserva } from '../components/sections/CtaReserva.jsx';

/** Página de tratamiento armada desde src/data/paginas.js, cerrando con la agenda en vivo. */
export function Tratamiento({ pagina }) {
  useTitulo(pagina.titulo, pagina.descripcion, pagina.ruta);
  return (
    <>
      <PageHero {...pagina} />
      <Bloques bloques={pagina.bloques} />
      <CtaReserva titulo={pagina.cta.titulo} texto={pagina.cta.texto} area={pagina.area} />
    </>
  );
}
