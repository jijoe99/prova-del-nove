---
title: 'Tutorial: confrontare GPU a ore e prezzo a token con Python'
description: Passo passo, come usare uno script Python per capire se conviene noleggiare
  una GPU a ore o pagare un fornitore a token.
date: '2026-11-13'
tipo: tutorial
strumenti:
- Python
stato: pubblicata
fonte_problema: https://news.ycombinator.com/item?id=50420874
dati_fittizi: false
uso_ia: Testo e codice generati con modelli locali (qwen3-coder:30b, qwen-coder);
  codice rivisto da Claude
permesso_cliente: ''
opportunita_id: c12f1447ae9e
---

Questo tutorial spiega come confrontare due modi di pagare l'inferenza di modelli linguistici (LLM) open-source: noleggiare una GPU a ore oppure pagare un fornitore per ogni token elaborato. Il tool è scritto in Python e usa solo librerie standard.

### Prerequisiti
- Un computer con Python 3 installato (la guida del prodotto spiega come installarlo).
- Un file JSON che descrive lo scenario di utilizzo (vedi esempio più avanti).

### Installazione e uso

1. **Procurati il programma.** Il programma completo, con la guida d'uso passo passo e una versione Excel, sarà disponibile nel negozio (link in arrivo). Qui sotto trovi come si usa e cosa produce.

2. **Crea un file di esempio** chiamato `esempio.json` con il seguente contenuto:
   ```json
   {
     "nota": "Prezzi e velocità fittizi, solo per esempio: sostituiscili con quelli reali del tuo fornitore e della tua GPU.",
     "valuta": "EUR",
     "carico_mensile": {
       "token_input": 50000000,
       "token_output": 10000000
     },
     "token": {
       "prezzo_input_per_milione": 0.2,
       "prezzo_output_per_milione": 0.6
     },
     "gpu": {
       "prezzo_ora": 1.2,
       "token_output_al_secondo": 400,
       "token_input_al_secondo": 4000,
       "modalita": "a_consumo",
       "ore_fatturazione_minima": 1,
       "ore_mese_sempre_accesa": 730
     }
   }
   ```

3. **Esegui il programma**:
   ```bash
   python calc.py esempio.json
   ```

### Output del comando

L'output del comando è il seguente:
```
Costo mensile a token     16.00 EUR
Ore GPU necessarie        10.42
Ore GPU pagate            11
Costo GPU mensile         13.20 EUR
Utilizzo GPU              94.7%
Differenza (token - GPU)  2.80 EUR
Più economica             GPU
Punto di pareggio         la GPU conviene a ogni volume (arrotondamento delle ore escluso)
Stime basate sui parametri inseriti; non includono configurazione, manutenzione, latenza e tempi di avvio.
```

### Opzioni avanzate

Per ottenere l'output in formato JSON:
```bash
python calc.py esempio.json --json
```

Per visualizzare le opzioni di utilizzo:
```bash
python calc.py --help
```

## Fonti
- https://news.ycombinator.com/item?id=50420874 (discussione pubblica di origine)
