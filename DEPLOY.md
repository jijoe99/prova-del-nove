# Blog "Prova del Nove": uso e pubblicazione

Sito statico fatto con Astro. Nessun deploy è stato eseguito: questa pagina spiega come farlo quando decidi tu.

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

## Pubblicazione gratuita: due strade

Prima va deciso dove vive il blog. GitHub Pages gratuito, secondo la documentazione ufficiale, ha un limite di 1 GB per sito e 100 GB di banda al mese, e non è pensato per attività commerciali. La documentazione letta non conferma l'uso con repo privati sul piano gratuito: controlla la pagina "GitHub Pages" nei piani prima di contare su quella strada.

**Strada A (consigliata): repo pubblico separato solo per il blog.**
1. Crea su GitHub un repo pubblico vuoto, per esempio `prova-del-nove`. Il repo del progetto resta privato.
2. Copia dentro il contenuto della cartella `blog/` (senza `node_modules`, `dist`, `.astro`, `screenshots`). La cartella `.github/workflows/sito.yml` deve stare alla radice del nuovo repo.
3. In Settings > Pages imposta Source: GitHub Actions.
4. Fai il primo push su `main`: il workflow costruisce e pubblica.
5. L'indirizzo sarà `https://TUOUTENTE.github.io/prova-del-nove/`.

Con questa strada il repo contiene solo il blog: niente codice del progetto, niente dati di clienti.

**Strada B: Cloudflare Pages collegato al repo privato.**
Cloudflare Pages ha un piano gratuito (500 build al mese, 20.000 file per sito). Se funzioni con repo privati sul piano gratuito va verificato nella loro documentazione prima di usarlo. Impostazioni di build: cartella radice `blog`, comando `npm run build`, cartella di output `dist`. Qui `SITE_URL` e `BASE_PATH` non servono per un dominio proprio di Cloudflare.

## Flusso delle bozze

1. L'agente della Fase 5 prepara un file Markdown con `stato: bozza` e apre una pull request.
2. Il workflow controlla che la build passi.
3. Tu leggi, correggi, imposti `stato: pubblicata` e fai il merge.
4. Al merge su `main` il sito si aggiorna da solo.

## Da fare prima del lancio

- Scrivere l'indirizzo di contatto in `src/site.ts` (campo `contatto`).
- Eliminare i tre file `esempio-*.md`.
- Rileggere la pagina Contatti e il testo del footer.
