// Cliente de la Edge Function `reservas`. URL y clave anon de Supabase son públicas por diseño:
// la seguridad la dan RLS (tablas cerradas) y las validaciones de la función.
const URL = 'https://mutvlergwxknqiyaefnv.supabase.co/functions/v1/reservas';
const KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11dHZsZXJnd3hrbnFpeWFlZm52Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE0MTE5NjQsImV4cCI6MjEwNjk4Nzk2NH0.SjVxyi1Gn9_uOwNoJaEAGZWBM7TUcx3ez0-yy1bBvLs';

export async function api(accion, datos = {}, { signal } = {}) {
  let res;
  try {
    res = await fetch(URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${KEY}`, apikey: KEY },
      body: JSON.stringify({ accion, ...datos }),
      signal,
    });
  } catch (e) {
    if (e.name === 'AbortError') throw e;
    throw Object.assign(new Error('Sin conexión. Revisa tu internet e intenta nuevamente.'), { status: 0 });
  }
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(json.error || 'No pudimos completar la solicitud.'), { status: res.status });
  return json;
}
