-- Datos iniciales. Sedes y profesionales salen del sitio actual (culmenodontologia.cl).
-- ⚠ HORARIOS PROVISORIOS: el sitio solo publica el horario general de la clínica
--   (Lun–Vie 9:00–19:00 · Sáb 9:00–13:00). Reemplazar por la agenda real de cada
--   profesional antes de publicar (Supabase → Table Editor → horarios).

insert into sedes (id, nombre, direccion, whatsapp, maps_url) values
  ('centro', 'Sucursal Centro',
   '1 Sur N°690, Of. 1116, Piso 11, Edificio Plaza, Talca', '+56978778785',
   'https://maps.app.goo.gl/oaRH7erTnJ3T1Vxj6'),
  ('las-rastras', 'Sucursal Las Rastras',
   '4 1/2 Norte N°3539, Las Rastras, Talca', '+56982751418',
   'https://www.google.com/maps/search/?api=1&query=Culmen%20Odontolog%C3%ADa%20Sucursal%20Las%20Rastras%20Talca');

insert into profesionales (id, nombre, especialidad) values
  ('andres-aguayo',       'Dr. Andrés Aguayo Espinoza',   'Ortodoncia'),
  ('carla-aravena',       'Dra. Carla Aravena',           'Ortodoncia y Ortopedia'),
  ('carlos-mendez',       'Dr. Carlos Méndez Carrasco',   'Rehabilitación Oral'),
  ('rosario-cardenas',    'Dra. Rosario Cárdenas Camus',  'Odontopediatría'),
  ('juan-pablo-aguilera', 'Dr. Juan Pablo Aguilera',      'Implantología'),
  ('karina-valdes',       'Dra. Karina Valdés Gaete',     'Rehabilitación Oral'),
  ('francisca-del-pino',  'Dra. Francisca Del Pino',      'Periodoncia'),
  ('sergio-espinoza',     'Dr. Sergio Espinoza Lazo',     'Rehabilitación Oral'),
  ('constanza-yanez',     'Dra. Constanza Yáñez Fuentes', 'Odontología General'),
  ('daniela-uribe',       'Dra. Daniela Uribe',           'Armonización Facial'),
  ('karina-huerta',       'Dra. Karina Huerta',           'Odontología General y Odontopediatría'),
  ('barbara-avendano',    'Dra. Bárbara Avendaño Bravo',  'Odontología General'),
  ('karla-villarreal',    'Dra. Karla Villarreal Cepeda', 'Odontología General'),
  ('pablo-astorga',       'Dr. Pablo Astorga Allende',    'Endodoncia'),
  ('pablo-venegas',       'Dr. Pablo Venegas Quiñones',   'Trastornos Temporomandibulares y Dolor Orofacial'),
  ('fabian-quiroz',       'Dr. Fabián Quiroz Escobar',    'Cirugía Maxilofacial'),
  ('alicia-aravena',      'Dra. Alicia Aravena Calderón', 'Odontología General');

-- Sede publicada en el sitio: Alicia Aravena → Centro; Bárbara Avendaño, Karla Villarreal,
-- Karina Valdés, Sergio Espinoza → Las Rastras. El resto atiende en ambas (provisorio:
-- Centro lun/mié/vie, Las Rastras mar/jue/sáb, para no ofrecer la misma hora en dos lugares).
with asignacion (profesional_id, sede_id, dias) as (
  select id, 'centro', array[1,2,3,4,5,6] from profesionales where id = 'alicia-aravena'
  union all
  select id, 'las-rastras', array[1,2,3,4,5,6] from profesionales
   where id in ('barbara-avendano', 'karla-villarreal', 'karina-valdes', 'sergio-espinoza')
  union all
  select id, 'centro', array[1,3,5] from profesionales
   where id not in ('alicia-aravena', 'barbara-avendano', 'karla-villarreal', 'karina-valdes', 'sergio-espinoza')
  union all
  select id, 'las-rastras', array[2,4,6] from profesionales
   where id not in ('alicia-aravena', 'barbara-avendano', 'karla-villarreal', 'karina-valdes', 'sergio-espinoza')
), bloques (desde, hasta, sabado) as (
  values ('09:00'::time, '13:00'::time, true), ('14:00'::time, '19:00'::time, false)
)
insert into horarios (profesional_id, sede_id, dia, desde, hasta)
select a.profesional_id, a.sede_id, d, b.desde, b.hasta
from asignacion a
cross join unnest(a.dias) d
cross join bloques b
where d < 6 or b.sabado;

insert into feriados (fecha, nombre) values
  ('2026-10-12', 'Encuentro de Dos Mundos'),
  ('2026-10-31', 'Día de las Iglesias Evangélicas y Protestantes'),
  ('2026-11-01', 'Día de Todos los Santos'),
  ('2026-12-08', 'Inmaculada Concepción'),
  ('2026-12-25', 'Navidad'),
  ('2027-01-01', 'Año Nuevo'),
  ('2027-03-26', 'Viernes Santo'),
  ('2027-03-27', 'Sábado Santo'),
  ('2027-05-01', 'Día del Trabajo'),
  ('2027-05-21', 'Día de las Glorias Navales'),
  ('2027-06-21', 'Día Nacional de los Pueblos Indígenas'),
  ('2027-06-28', 'San Pedro y San Pablo'),
  ('2027-07-16', 'Virgen del Carmen'),
  ('2027-08-15', 'Asunción de la Virgen'),
  ('2027-09-17', 'Feriado adicional Fiestas Patrias'),
  ('2027-09-18', 'Independencia Nacional'),
  ('2027-09-19', 'Día de las Glorias del Ejército'),
  ('2027-10-11', 'Encuentro de Dos Mundos'),
  ('2027-10-31', 'Día de las Iglesias Evangélicas y Protestantes'),
  ('2027-11-01', 'Día de Todos los Santos'),
  ('2027-12-08', 'Inmaculada Concepción'),
  ('2027-12-25', 'Navidad');
