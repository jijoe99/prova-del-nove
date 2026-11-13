// Unico posto da cambiare per rinominare il blog.
export const SITE = {
  name: 'Prova del Nove',
  tagline: 'Problemi veri, soluzioni provate.',
  description:
    'Prendo domande reali dalle community tecniche, costruisco una soluzione e la provo in un ambiente isolato prima di raccontarla.',
  contatto: 'giordano.odorico@gmail.com',
};

export const TIPI = {
  demo: { path: 'demo', label: 'Demo', plurale: 'Demo', desc: 'Strumenti funzionanti da provare. I dati sono sempre fittizi.' },
  tutorial: { path: 'tutorial', label: 'Tutorial', plurale: 'Tutorial', desc: 'Guide passo per passo, con gli errori comuni.' },
  'caso-studio': { path: 'casi-studio', label: 'Caso studio', plurale: 'Casi studio', desc: 'Lavori reali, pubblicati solo con il permesso scritto del cliente.' },
} as const;
export type Tipo = keyof typeof TIPI;
