# Culmen Odontología — sitio + reservas online

Sitio multipágina (React 18 + Vite + CSS Modules) con sistema de reservas propio
sobre Supabase (Postgres + Edge Function), correo de confirmación con Resend y
eventos en Google Calendar de la clínica.

```
npm install
npm run dev        # http://localhost:5173
npm run build      # compila a dist/
npm run check      # prueba las validaciones de RUT, celular y correo
npm run imagenes -- <carpeta-originales>   # regenera WebP, logos, favicon y og-image
```

## Cómo funciona la reserva

1. El paciente elige **sede → motivo → profesional (o el primero disponible) → día → hora**.
2. Ve solo horas libres reales: horario semanal − feriados − reservas confirmadas −
   eventos del Google Calendar del profesional − próximas 2 horas.
3. Ingresa nombre, RUT (con dígito verificador), correo y celular.
4. Se guarda la reserva, se crea el evento en Google Calendar y se envía el correo
   con botón *Agregar a mi calendario*, *Cómo llegar* y un enlace para cancelar.
5. Cancelar desde el correo libera la hora y borra el evento del calendario.

Garantías: la base de datos impide dos horas superpuestas del mismo profesional
(restricción `reservas_sin_tope`, incluso entre sedes); máximo 2 horas futuras por
RUT; campo trampa contra bots; el navegador no puede leer ninguna tabla (RLS sin
políticas, todo pasa por la Edge Function).

| Pieza | Dónde |
|---|---|
| Proyecto Supabase | `culmen-odontologia` (`mutvlergwxknqiyaefnv`, São Paulo) |
| Esquema y datos | `supabase/migrations/` |
| Edge Function | `supabase/functions/reservas/` (acciones `horas`, `reservar`, `ver`, `cancelar`) |
| Interfaz | `src/components/reserva/Reserva.jsx` |
| Contenido del sitio | `src/data/` (clínica, equipo, páginas) |

## Pendiente antes de publicar

### 1. Horarios reales de cada profesional ⚠️

Los horarios cargados son **provisorios** (el sitio anterior solo publicaba el horario
general Lun–Vie 9–19 y Sáb 9–13). En Supabase → *Table Editor* → `horarios`, una fila
por bloque: `profesional_id`, `sede_id` (`centro` / `las-rastras`), `dia`
(0 = domingo … 6 = sábado), `desde`, `hasta`, `duracion_min` (45 por defecto).
Para sacar a alguien de la agenda online: `profesionales.activo = false`.
Feriados en la tabla `feriados` (cargados hasta diciembre de 2027: **agregar los de 2028 antes de octubre de 2027**).
La agenda online permite reservar en el mes en curso y los dos siguientes (`MESES_RESERVABLES`, igual en `src/utils/fechas.js` y en la Edge Function).

### 2. Correo de confirmación (Resend)

1. Crear cuenta en resend.com y agregar el dominio `culmenodontologia.cl`
   (Resend entrega 3 registros DNS: agregarlos en Hostinger).
2. Crear una API key.
3. Supabase → *Edge Functions* → *Secrets*:
   - `RESEND_API_KEY` = la key
   - `EMAIL_FROM` = `Culmen Odontología <reservas@culmenodontologia.cl>`
   - `EMAIL_REPLY_TO` = `contacto@culmenodontologia.cl`
   - `SITE_URL` = `https://www.culmenodontologia.cl`

Sin la key la reserva funciona igual y la pantalla avisa que el correo no salió.

### 3. Google Calendar de la clínica

1. Google Cloud Console → crear proyecto → habilitar **Google Calendar API**.
2. *IAM → Cuentas de servicio* → crear una → *Claves* → JSON.
3. En Google Calendar, compartir cada calendario con el correo de la cuenta de
   servicio con permiso **"Hacer cambios en los eventos"**.
4. Guardar el ID de cada calendario (Configuración del calendario → *ID del calendario*):
   - en `profesionales.calendar_id` → las reservas de ese profesional caen en su
     calendario, y **sus eventos (vacaciones, bloqueos, horas tomadas por WhatsApp)
     ocultan esas horas en la web**;
   - o en `sedes.calendar_id` → calendario general de la sede, para quien no tenga uno propio.
5. Secret `GOOGLE_SERVICE_ACCOUNT` = el contenido completo del JSON.

### 4. Despliegue (Vercel)

Repositorio: `github.com/feliperetamalj/culmen-odontologia`, conectado al proyecto
Vercel `culmen-odontologia` → https://culmen-odontologia.vercel.app

- **Cada push a `main` publica en producción.** Para revisar antes, trabaja en otra
  rama: cada push ahí genera una URL de previsualización.
- `vercel.json` ya trae reescrituras de rutas y cabeceras de seguridad.
- Dominio propio: Vercel → proyecto → Settings → Domains → agregar
  `culmenodontologia.cl` y `www`, y crear en Hostinger los registros DNS que indique.
La URL y la clave anon de Supabase están en `src/utils/api.js` (son públicas por diseño).

## Informe del sitio anterior (culmenodontologia.cl)

- Las páginas internas se titulan **"Hostinger Horizons"** en la pestaña y en Google;
  el favicon es el de Vite y el HTML declara idioma inglés (`lang="en"`).
- El enlace **"abrir en maps" de la Sucursal Las Rastras está roto** ("Dynamic Link Not Found").
- En Ortodoncia, el botón **"Quirúrgica"** no lleva a ningún contenido.
- **Fotos de banco de imágenes** presentadas como profesionales: Dra. Karina Valdés,
  Dr. Pablo Astorga y Dr. Fabián Quiroz.
  En el sitio nuevo se muestran con monograma hasta tener su retrato.
- La portada abre con un video de YouTube en pantalla negra mientras carga.
- Textos con palabras en inglés o errores: "Su *satisfaction*", "corrige la *position*",
  "anestesia local *or* sedación", "herramientas *modernos*", "minimamente", "Mascaras".
- Afirmación médica "Sin riesgos" en sedación consciente: se reemplazó por "Efecto rápido y seguro".
- No mostraba la cantidad de reseñas: hoy son **5.0 con 554 reseñas** (208 Centro + 346 Las Rastras, 7-oct-2026).
- Todas las reservas dependían de WhatsApp: ninguna disponibilidad visible ni confirmación escrita.
