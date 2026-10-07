// npm run check — comprueba las reglas de validación del paciente.
import assert from 'node:assert/strict';
import { normalizarRut, formatearRut, normalizarTelefono, validarEmail, validarPaciente } from './validar.js';

assert.equal(normalizarRut('11.111.111-1'), '11111111-1');
assert.equal(normalizarRut('7.654.321-6'), '7654321-6');
assert.equal(normalizarRut('12.345.678-5'), '12345678-5');
assert.equal(normalizarRut('12345678-9'), null, 'dígito verificador incorrecto');
assert.equal(normalizarRut('1-9'), null, 'muy corto');
assert.equal(normalizarRut('14.569.484-k'), null);
assert.equal(normalizarRut('10.000.013-K'), '10000013-K', 'acepta K minúscula o mayúscula');
assert.equal(formatearRut('123456785'), '12.345.678-5');

assert.equal(normalizarTelefono('9 1234 5678'), '+56912345678');
assert.equal(normalizarTelefono('+56 9 8275 1418'), '+56982751418');
assert.equal(normalizarTelefono('2 2345 6789'), null, 'fijo no es celular');
assert.equal(normalizarTelefono('12345'), null);

assert.equal(validarEmail(' Paciente@Correo.CL '), 'paciente@correo.cl');
assert.equal(validarEmail('sin-arroba.cl'), null);

const ok = validarPaciente({ nombre: 'Ana Pérez', rut: '11.111.111-1', email: 'ana@correo.cl', telefono: '912345678' });
assert.deepEqual(ok.errores, {});
const mal = validarPaciente({ nombre: 'Ana', rut: '1', email: 'x', telefono: '1' });
assert.deepEqual(Object.keys(mal.errores).sort(), ['email', 'nombre', 'rut', 'telefono']);

console.log('validar.js: OK');
