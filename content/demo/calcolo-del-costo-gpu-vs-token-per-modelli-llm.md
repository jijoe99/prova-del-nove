---
title: Calcolo del costo GPU vs token per modelli LLM
description: Un confronto pratico tra pagare per ore di GPU o per token per l'uso
  di modelli LLM open-source.
date: '2026-11-13'
tipo: demo
strumenti:
- Python
stato: pubblicata
fonte_problema: https://news.ycombinator.com/item?id=50420874
dati_fittizi: true
uso_ia: Testo e codice generati con modelli locali (qwen3-coder:30b, qwen-coder);
  codice rivisto da Claude
permesso_cliente: ''
opportunita_id: c12f1447ae9e
---

> **Demo con dati fittizi.** Prezzi, velocità e volumi sono inventati per l'esempio: sostituiscili con i tuoi prima di trarre conclusioni.

Questo articolo presenta uno strumento semplice per decidere come pagare l'inferenza di modelli linguistici (LLM) open-source: noleggiare una GPU a ore oppure pagare un fornitore per ogni token elaborato.

Il tool è scritto in Python usando solo librerie standard e può aiutare a capire quale opzione sia più conveniente in base al volume mensile di token e alla velocità della GPU.

### Dati di esempio
I dati usati per l'esempio sono **fittizi**, come indicato nel file JSON:

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

### Risultati dell'analisi
Eseguendo il comando `python calc.py esempio.json`, si ottiene il seguente output:

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

### Spiegazione dei risultati

- **Costo mensile a token**: 16,00 EUR. Questo è il costo totale se si sceglie di pagare per token.
- **Ore GPU necessarie**: 10,42 ore. È il tempo che la GPU impiega per elaborare il volume mensile di token.
- **Ore GPU pagate**: 11 ore. Poiché la modalità è `a_consumo` e l'ora minima fatturabile è 1 ora, le ore vengono arrotondate per eccesso.
- **Costo GPU mensile**: 13,20 EUR. Il costo totale della GPU per il mese, calcolato come ore pagate × prezzo/ora.
- **Utilizzo GPU**: 94,7%. Significa che la GPU è utilizzata per circa il 95% del tempo pagato.
- **Differenza (token - GPU)**: 2,80 EUR. Il costo a token è superiore al costo della GPU di questa quantità.
- **Più economica**: GPU. In questo caso, usare la GPU è più conveniente rispetto a pagare per token.
- **Punto di pareggio**: la GPU conviene a ogni volume (arrotondamento delle ore escluso). Questo indica che, anche senza considerare l'arrotondamento, la GPU è sempre vantaggiosa.

### Note
I risultati sono basati sulle ipotesi e sui dati forniti. Non tengono conto di fattori come configurazione hardware, manutenzione, latenza o tempi di avvio della GPU.

### Codice
Il codice è stato generato con modelli IA locali e rivisto da Claude.

## Fonti

- https://news.ycombinator.com/item?id=50420874 (discussione pubblica di origine)
