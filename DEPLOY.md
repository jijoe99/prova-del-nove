# Blog "Prova del Nove": uso e pubblicazione

Sito statico fatto con Astro, pubblicato su Cloudflare Pages.

## Anteprima in locale

```bash
cd blog
npm install
npm run dev
```

Poi apri http://localhost:4321. `npm run build` controlla che tutto compili.

## Dove vanno gli articoli

Cartella `blog/content/`, un file `.md` per articolo, nella sottocartella del tipo: `demo/`, `tutorial/`, `casi-studio/`.
Il sito mostra solo gli articoli con `stato: pubblicata`. I file che iniziano con `esempio-` mostrano l'avviso "Articolo di esempio": vanno eliminati prima del lancio.

Campi del frontmatter (contratto con la Fase 5, definito in `src/content.config.ts`):

```yaml
title, description, date (AAAA-MM-GG)
tipo: demo | tutorial | caso-studio
strumenti: [ ... ]
stato: bozza | approvata | pubblicata
fonte_problema: URL            # facoltativo
dati_fittizi: true             # obbligatorio per le demo
uso_ia: testo
permesso_cliente: testo        # obbligatorio per i casi studio
opportunita_id: testo
```

La build fallisce se una demo non ha `dati_fittizi: true` o se un caso studio non ha `permesso_cliente`.

## Dove vive il sito

**Cloudflare Pages**, collegato a questo repo: a ogni merge su `main` Cloudflare costruisce e pubblica da solo.
Indirizzo: https://prova-del-nove.pages.dev/

Impostazioni del progetto su Cloudflare:
- comando di build `npm run build`, cartella di output `dist`;
- variabili: `SITE_URL=https://prova-del-nove.pages.dev`, `BASE_PATH=/`, `NODE_VERSION=24`;
- anteprime delle pull request **disattivate** (Settings > Builds > Branch control): un'anteprima mostrerebbe in pubblico un articolo prima del merge.

Il vecchio indirizzo GitHub Pages (https://jijoe99.github.io/prova-del-nove/) resta attivo solo per reindirizzare:
il workflow `.github/workflows/sito.yml` pubblica lì una pagina di rinvio per ogni pagina del sito, così i link già condivisi continuano a funzionare.

## Flusso delle bozze

1. L'agente della Fase 5 prepara un file Markdown con `stato: bozza` e apre una pull request.
2. Il workflow controlla che la build passi.
3. Tu leggi, correggi, imposti `stato: pubblicata` e fai il merge.
4. Al merge su `main` il sito si aggiorna da solo.

## Da fare prima del lancio

- Eliminare i tre file `esempio-*.md`.
- Rileggere la pagina Contatti e il testo del footer.
