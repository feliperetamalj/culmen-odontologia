// Validaciones compartidas: las usa la Edge Function (autoridad) y el formulario
// del sitio (respuesta inmediata). Un solo lugar para las reglas.

/** RUT chileno → "12345678-K" si el dígito verificador cuadra, si no null. */
export function normalizarRut(valor) {
  const s = String(valor ?? '').replace(/[^0-9kK]/g, '').toUpperCase();
  if (s.length < 8 || s.length > 9) return null;
  const cuerpo = s.slice(0, -1);
  if (!/^\d+$/.test(cuerpo)) return null;
  let suma = 0;
  let factor = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += Number(cuerpo[i]) * factor;
    factor = factor === 7 ? 2 : factor + 1;
  }
  const resto = 11 - (suma % 11);
  const dv = resto === 11 ? '0' : resto === 10 ? 'K' : String(resto);
  return s.slice(-1) === dv ? `${cuerpo}-${dv}` : null;
}

/** "12345678-K" → "12.345.678-K" para mostrar. */
export function formatearRut(valor) {
  const s = String(valor ?? '').replace(/[^0-9kK]/g, '').toUpperCase();
  if (s.length < 2) return s;
  const cuerpo = s.slice(0, -1).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${cuerpo}-${s.slice(-1)}`;
}

/** Celular chileno → "+56912345678", si no null. Acepta "9 1234 5678" o "+56 9…". */
export function normalizarTelefono(valor) {
  let d = String(valor ?? '').replace(/\D/g, '');
  if (d.length === 9) d = `56${d}`;
  return /^569\d{8}$/.test(d) ? `+${d}` : null;
}

export function validarEmail(valor) {
  const v = String(valor ?? '').trim().toLowerCase();
  return v.length <= 160 && /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/.test(v) ? v : null;
}

/** Devuelve { datos, errores } con los campos del paciente ya normalizados. */
export function validarPaciente(p = {}) {
  const errores = {};
  const nombre = String(p.nombre ?? '').trim().replace(/\s+/g, ' ');
  const rut = normalizarRut(p.rut);
  const email = validarEmail(p.email);
  const telefono = normalizarTelefono(p.telefono);
  const prevision = String(p.prevision ?? '').trim().slice(0, 60);
  const comentario = String(p.comentario ?? '').trim().slice(0, 500);

  if (nombre.length < 3 || nombre.length > 120 || !nombre.includes(' ')) errores.nombre = 'Escribe tu nombre y apellido.';
  if (!rut) errores.rut = 'Revisa el RUT: el dígito verificador no coincide.';
  if (!email) errores.email = 'Escribe un correo válido, ahí llega tu confirmación.';
  if (!telefono) errores.telefono = 'Escribe un celular de 9 dígitos, por ejemplo 9 1234 5678.';

  return { datos: { nombre, rut, email, telefono, prevision, comentario }, errores };
}
