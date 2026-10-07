import { useTitulo } from '../hooks/useTitulo.js';
import { PageHero } from '../components/sections/PageHero.jsx';
import { Bloques } from '../components/sections/Bloques.jsx';
import { SeccionReserva } from '../components/sections/SeccionReserva.jsx';

/** Página de tratamiento armada desde src/data/paginas.js, cerrando con la agenda en vivo. */
export function Tratamiento({ pagina }) {
  useTitulo(pagina.titulo, pagina.descripcion, pagina.ruta);
  return (
    <>
      <PageHero {...pagina} />
      <Bloques bloques={pagina.bloques} />
      <SeccionReserva
        key={pagina.ruta}
        titulo={pagina.cta.titulo}
        texto={pagina.cta.texto}
        inicial={{ area: pagina.area }}
      />
    </>
  );
}
