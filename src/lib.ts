import { getCollection } from 'astro:content';
import { TIPI, type Tipo } from './site';

// Il sito mostra solo i post con stato "pubblicata".
export async function pubblicati(tipo?: Tipo) {
  const all = await getCollection('posts', (p) => p.data.stato === 'pubblicata' && (!tipo || p.data.tipo === tipo));
  return all.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}
export const href = (base: string, p: { id: string; data: { tipo: Tipo } }) =>
  `${base.replace(/\/$/, '')}/${TIPI[p.data.tipo].path}/${p.id.split('/').pop()!.replace(/\.md$/, '')}/`;
export const èEsempio = (id: string) => id.split('/').pop()!.startsWith('esempio-');
export const fmt = (d: Date) => d.toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
