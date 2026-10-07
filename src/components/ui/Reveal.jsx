import { useEffect, useRef } from 'react';

// Un solo IntersectionObserver para toda la página; cada elemento se desobserva al aparecer.
let io;
const observador = () =>
  (io ??= new IntersectionObserver(
    (entradas) => entradas.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.dataset.reveal = 'visible';
      io.unobserve(e.target);
    }),
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  ));

export function Reveal({ as: Tag = 'div', retraso = 0, style, children, ...resto }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    observador().observe(el);
    return () => observador().unobserve(el);
  }, []);
  return (
    <Tag ref={ref} data-reveal="" style={{ ...style, '--reveal-delay': `${retraso}ms` }} {...resto}>
      {children}
    </Tag>
  );
}
