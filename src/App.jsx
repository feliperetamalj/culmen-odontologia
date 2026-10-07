import { Route, Routes } from 'react-router-dom';
import { BarraMovil, Footer, Header, IrArriba } from './components/layout';
import { Inicio } from './pages/Inicio.jsx';
import { Nosotros } from './pages/Nosotros.jsx';
import { Tratamiento } from './pages/Tratamiento.jsx';
import { Reservar } from './pages/Reservar.jsx';
import { Cancelar } from './pages/Cancelar.jsx';
import { NoEncontrada } from './pages/NoEncontrada.jsx';
import { PAGINAS } from './data/paginas.js';

export function App() {
  return (
    <>
      <a href="#contenido" className="skip-link">Saltar al contenido</a>
      <IrArriba />
      <Header />
      <main id="contenido" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/nosotros" element={<Nosotros />} />
          {Object.entries(PAGINAS).map(([clave, pagina]) => (
            <Route key={clave} path={pagina.ruta} element={<Tratamiento pagina={pagina} />} />
          ))}
          <Route path="/reservar" element={<Reservar />} />
          <Route path="/reserva/cancelar" element={<Cancelar />} />
          <Route path="*" element={<NoEncontrada />} />
        </Routes>
      </main>
      <Footer />
      <BarraMovil />
    </>
  );
}
