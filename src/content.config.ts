import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Schema = contratto con la Fase 5. Se cambia un campo, cambia anche l'agente delle bozze.
const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content' }),
  schema: z
    .object({
      title: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      tipo: z.enum(['demo', 'tutorial', 'caso-studio']),
      strumenti: z.array(z.string()).default([]),
      stato: z.enum(['bozza', 'approvata', 'pubblicata']),
      fonte_problema: z.string().url().optional(),
      dati_fittizi: z.boolean().default(false),
      uso_ia: z.string().optional(),
      permesso_cliente: z.string().optional(),
      opportunita_id: z.string().optional(),
    })
    .refine((p) => p.tipo !== 'demo' || p.dati_fittizi === true, {
      message: 'Le demo devono avere dati_fittizi: true',
    })
    .refine((p) => p.tipo !== 'caso-studio' || !!p.permesso_cliente?.trim(), {
      message: 'Un caso studio richiede permesso_cliente (riferimento al permesso scritto)',
    }),
});

export const collections = { posts };
