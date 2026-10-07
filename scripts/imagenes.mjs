// Convierte las fotos originales del sitio anterior a WebP optimizado y genera
// logotipos, favicon e imagen Open Graph.
//   npm run imagenes -- <carpeta-con-originales>
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const ORIGEN = process.argv[2];
if (!ORIGEN) throw new Error('Uso: npm run imagenes -- <carpeta-con-originales>');
const src = (f) => path.join(ORIGEN, f);
const FOTOS = 'src/assets/fotos';
const EQUIPO = 'src/assets/equipo';
const MARCA = 'src/assets/marca';
const PUBLIC = 'public';
await Promise.all([FOTOS, EQUIPO, MARCA, `${PUBLIC}/email`].map((d) => mkdir(d, { recursive: true })));

// Retratos: recorte 4:5 desde arriba (cara y torso).
const RETRATOS = {
  'andres-aguayo': 'e24f0c7a13eb883cd044c85f7a5654e8.jpg',
  'carla-aravena': 'dc5fd50b2dfac97af3dd92163c17eb46.png',
  'carlos-mendez': '1aa4f64e0e1c5203c6b6e989fab3a4dd.jpg',
  'rosario-cardenas': '2aeb7d6d4b30df534e8c5d661d31c996.jpg',
  'juan-pablo-aguilera': 'c3ddeb636ee986b6069ead3f73fba0fb.jpg',
  'francisca-del-pino': '46d45eac8a66e4e8bd905ba6d8d44775.png',
  'sergio-espinoza': 'de16fd21bc9145c16ad9275e757dbfe4.jpg',
  'constanza-yanez': '772ee94583d844d976f9c6d516cbabe8.png',
  'daniela-uribe': '1ca1146c70699f1f5557e3c0a4b6a23d.png',
  'karina-huerta': 'dcd3f7ca908aaa0f0eb53b628b85def8.png',
  'barbara-avendano': 'eda6274c3a0800a059f21df2dc5daf63.jpg',
  'karla-villarreal': 'eecee97b8bcd0bf217a291747258a085.png',
  'pablo-venegas': '816387b6720eb9a5ec1ddbad1a9d74e5.jpg',
  'alicia-aravena': 'bc30a28b4adbfd4afbcc768a3f329e68.png',
  'samuel-abarza': '985099267e14f297a4ebcc2d14666997.png',
  'roselvis-limpio': '41de692db05c6f10e3679a574969ffed.jpg',
  'yeraldy-gajardo': '7061ff370c1e353d1b3849c3e491ab34.jpg',
  'sebastian-campos': '274a2a85e7a8e975c1b5daa58720a208.jpg',
  'camila-olave': '7c1253d38acd1668c8eb040d769c49d3.jpg',
  'camila-arias': '9be5a6de1c82edae633c7c0b4d00ac32.jpg',
  'yemily-valenzuela': '119c0df5ca6bc622c9a86b1cdd4243e1.jpg',
};

// Escenas: ancho máximo, proporción original.
const ESCENAS = {
  'hero-equipo': ['bry01997-4crJt.jpg', 1800],
  recepcion: ['1598b378c81d3223eda33c84b974cb94.jpg', 1000],
  'recepcion-paciente': ['50f7304d6b6fb6c3f9caa987c2356ecd.jpg', 1200],
  'modelo-dental': ['7606a773ff0b84934f1225d3221fffe0.jpg', 1200],
  'radiografia-tablet': ['9c1577acb2b894700a229f16f481467b.jpg', 1200],
  'escaner-3d': ['61d8484b41168f15d8df9568b6457864.jpg', 1200],
  'escaneo-digital': ['a6685c42fc0314204658e6b97ff85c25.jpg', 1200],
  'sirona-3d': ['3afc533e4f88dd6f0206260a3fe48908.jpg', 1200],
  consulta: ['8fe08f59aa92ecb6539c43c649eb3bb0.jpg', 1000],
  procedimiento: ['b36db872b1a24671694655929cd52b07.jpg', 1000],
  'sala-espera': ['48c9d83b9eb606b7d37cb87bd9d4eb37.jpg', 1000],
  'ortodoncia-hero': ['dr-andres-aguayo---ortodoncista-7-1ECig.jpg', 1800],
  alineadores: ['dsc09683-BDpnG.jpg', 1000],
  brackets: ['5e90d6a2f1066386f0978970d0e6de32.jpg', 1000],
  'brackets-esteticos': ['9707ec71-0319-479b-83a6-611406102176-OuvP4.jpg', 1200],
  'implantes-hero': ['bry02048-xPJxC.jpg', 1800],
  laboratorio: ['eb30169504aa7080575150f7cdd2a63a.jpg', 1200],
  'implante-procedimiento': ['66280998869debb378c6a516c797efcc.jpg', 1200],
  sillon: ['c9a4c38861abf0691ac218c289ea90da.jpg', 1200],
  'planificacion-itero': ['eaa561e2d552f0b0851f54d62f176a99.jpg', 1200],
  'sedacion-consciente': ['gas2-860x575-1-8eRN8.webp', 860],
  'sedacion-endovenosa': ['sedacion-DI1tq.jpg', 724],
  'atencion-general': ['dsc09530-kAM6b.jpg', 1000],
  'cirugia-maxilofacial': ['bry02021-PHrX9.jpg', 1000],
  'financiamiento-hero': ['dsc09484-6GFrS.jpg', 1400],
  ttm: ['cd08029ef7076ae8e14cd8b7ce0cc295.jpg', 1000],
  periodoncia: ['792c6f3e92593eb13ccf03a47c45be42.jpg', 1000],
};

for (const [nombre, archivo] of Object.entries(RETRATOS)) {
  await sharp(src(archivo))
    .resize(640, 800, { fit: 'cover', position: 'north' })
    .webp({ quality: 74 })
    .toFile(`${EQUIPO}/${nombre}.webp`);
}

for (const [nombre, [archivo, ancho]] of Object.entries(ESCENAS)) {
  await sharp(src(archivo))
    .resize({ width: ancho, withoutEnlargement: true })
    .webp({ quality: 72 })
    .toFile(`${FOTOS}/${nombre}.webp`);
}

// --- Marca ---------------------------------------------------------------
// Logotipo original (texto negro, fondo transparente) recortado a su contenido.
const LOGO = src('60c0d23c339179e11c3fddf70c6772c1.png');
const logoClaro = await sharp(LOGO).trim().toBuffer();
await sharp(logoClaro).resize({ width: 520 }).png({ compressionLevel: 9 }).toFile(`${MARCA}/logo.png`);

// Versión para fondo oscuro: el texto negro pasa a blanco, el oro se conserva.
const { data, info } = await sharp(logoClaro).raw().toBuffer({ resolveWithObject: true });
for (let i = 0; i < data.length; i += 4) {
  const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
  if (r - b < 40) { data[i] = 255; data[i + 1] = 255; data[i + 2] = 255; } // neutro → blanco
}
const logoOscuro = await sharp(data, { raw: info }).png().toBuffer();
await sharp(logoOscuro).resize({ width: 520 }).png({ compressionLevel: 9 }).toFile(`${MARCA}/logo-blanco.png`);
await sharp(logoOscuro).resize({ width: 440 }).png({ compressionLevel: 9 }).toFile(`${PUBLIC}/email/logo.png`);

// Isotipo (diente dorado): la franja izquierda del logotipo, recortada a su contenido.
const meta = await sharp(logoClaro).metadata();
const isotipo = await sharp(logoClaro)
  .extract({ left: 0, top: 0, width: Math.round(meta.width * 0.235), height: meta.height })
  .trim()
  .toBuffer();
const cuadrado = (lado, fondo) =>
  sharp(isotipo)
    .resize(Math.round(lado * 0.72), Math.round(lado * 0.72), { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .extend({
      top: Math.round(lado * 0.14), bottom: lado - Math.round(lado * 0.72) - Math.round(lado * 0.14),
      left: Math.round(lado * 0.14), right: lado - Math.round(lado * 0.72) - Math.round(lado * 0.14),
      background: fondo,
    });
await sharp(isotipo).resize({ height: 160 }).png().toFile(`${MARCA}/isotipo.png`);
await cuadrado(64, { r: 0, g: 0, b: 0, alpha: 0 }).png().toFile(`${PUBLIC}/favicon.png`);
await sharp(await cuadrado(180, '#121110').png().toBuffer())
  .flatten({ background: '#121110' })
  .png()
  .toFile(`${PUBLIC}/apple-touch-icon.png`);

// --- Open Graph 1200×630: foto real del equipo, velo y logotipo real encima ----
const og = await sharp(src('bry01997-4crJt.jpg')).resize(1200, 630, { fit: 'cover', position: 'centre' }).toBuffer();
const velo = Buffer.from(`<svg width="1200" height="630"><defs><linearGradient id="g" x1="0" x2="1">
  <stop offset="0" stop-color="#121110" stop-opacity=".92"/><stop offset=".62" stop-color="#121110" stop-opacity=".55"/>
  <stop offset="1" stop-color="#121110" stop-opacity=".1"/></linearGradient></defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <rect x="72" y="388" width="64" height="3" fill="#C9A35A"/>
  <text x="72" y="452" font-family="Helvetica, Arial, sans-serif" font-size="40" font-weight="600" fill="#FFFFFF">Reserva tu hora online</text>
  <text x="72" y="500" font-family="Helvetica, Arial, sans-serif" font-size="26" fill="#E8DCC2">Sucursal Centro y Las Rastras · Talca</text>
</svg>`);
const logoOg = await sharp(logoOscuro).resize({ width: 470 }).toBuffer();
await sharp(og)
  .composite([{ input: velo }, { input: logoOg, left: 66, top: 150 }])
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(`${PUBLIC}/og-image.jpg`);

console.log('Imágenes listas.');
