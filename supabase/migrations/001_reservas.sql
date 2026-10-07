-- Sistema de reservas Culmen Odontología.
-- Todo el acceso pasa por la Edge Function `reservas` (service role):
-- RLS activo y sin políticas = el navegador no puede leer ni escribir tablas.

create extension if not exists btree_gist with schema extensions;

create table sedes (
  id          text primary key,
  nombre      text not null,
  direccion   text not null,
  whatsapp    text not null,
  maps_url    text not null,
  calendar_id text            -- Google Calendar de la sede (si el profesional no tiene uno propio)
);

create table profesionales (
  id           text primary key,  -- mismo slug que src/data/equipo.js
  nombre       text not null,
  especialidad text not null,
  calendar_id  text,              -- Google Calendar propio: sus eventos bloquean horas
  activo       boolean not null default true
);

-- Bloques de atención semanales. dia: 0 = domingo … 6 = sábado (extract(dow)).
create table horarios (
  id             bigint generated always as identity primary key,
  profesional_id text not null references profesionales on delete cascade,
  sede_id        text not null references sedes,
  dia            smallint not null check (dia between 0 and 6),
  desde          time not null,
  hasta          time not null,
  duracion_min   smallint not null default 45 check (duracion_min between 10 and 240),
  check (hasta > desde)
);
create index on horarios (sede_id, profesional_id);

create table feriados (
  fecha  date primary key,
  nombre text not null
);

create table reservas (
  id              uuid primary key default gen_random_uuid(),
  profesional_id  text not null references profesionales,
  sede_id         text not null references sedes,
  inicio          timestamptz not null,
  fin             timestamptz not null,
  estado          text not null default 'confirmada' check (estado in ('confirmada', 'cancelada')),
  nombre          text not null check (char_length(nombre) between 3 and 120),
  rut             text not null check (rut ~ '^[0-9]{7,8}-[0-9K]$'),
  email           text not null check (char_length(email) <= 160),
  telefono        text not null check (telefono ~ '^\+56[0-9]{9}$'),
  prevision       text check (char_length(prevision) <= 60),
  motivo          text check (char_length(motivo) <= 80),
  comentario      text check (char_length(comentario) <= 500),
  cancel_token    uuid not null unique default gen_random_uuid(),
  google_event_id text,
  creada_en       timestamptz not null default now(),
  cancelada_en    timestamptz,
  check (fin > inicio),
  -- Un profesional nunca tiene dos horas confirmadas que se toquen, en ninguna sede.
  -- La base de datos lo garantiza aunque dos pacientes reserven en el mismo milisegundo.
  constraint reservas_sin_tope exclude using gist (
    profesional_id with =, tstzrange(inicio, fin) with &&
  ) where (estado = 'confirmada')
);
create index on reservas (rut) where estado = 'confirmada';

alter table sedes         enable row level security;
alter table profesionales enable row level security;
alter table horarios      enable row level security;
alter table feriados      enable row level security;
alter table reservas      enable row level security;

-- Horas libres: bloques semanales − feriados − reservas confirmadas − próximas 2 h.
-- Los bloqueos de Google Calendar los descuenta la Edge Function.
create or replace function slots_disponibles(
  p_profesionales text[], p_sede text, p_desde date, p_dias int default 14
) returns table (profesional_id text, inicio timestamptz, fin timestamptz)
language sql stable
set search_path = public
as $$
  with bloques as (
    select h.profesional_id, d::date as fecha, h.desde, h.hasta,
           make_interval(mins => h.duracion_min) as paso
    from generate_series(p_desde, p_desde + (least(greatest(p_dias, 1), 62) - 1), interval '1 day') d
    join horarios h on h.dia = extract(dow from d)
    join profesionales p on p.id = h.profesional_id and p.activo
    where h.sede_id = p_sede
      and h.profesional_id = any (p_profesionales)
      and not exists (select 1 from feriados f where f.fecha = d::date)
  ), candidatos as (
    select b.profesional_id,
           t at time zone 'America/Santiago'            as inicio,
           (t + b.paso) at time zone 'America/Santiago' as fin
    from bloques b,
         generate_series(b.fecha + b.desde, b.fecha + b.hasta - b.paso, b.paso) t
  )
  select c.profesional_id, c.inicio, c.fin
  from candidatos c
  where c.inicio > now() + interval '2 hours'
    and not exists (
      select 1 from reservas r
      where r.profesional_id = c.profesional_id
        and r.estado = 'confirmada'
        and tstzrange(r.inicio, r.fin) && tstzrange(c.inicio, c.fin)
    )
  order by c.inicio, c.profesional_id;
$$;

revoke execute on function slots_disponibles(text[], text, date, int) from public, anon, authenticated;
grant  execute on function slots_disponibles(text[], text, date, int) to service_role;
