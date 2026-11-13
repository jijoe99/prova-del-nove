---
title: "Un modello locale con Ollama in 15 minuti"
description: "Esempio di tutorial: installa Ollama, scarica un modello piccolo e fai la prima domanda."
date: 2026-11-10
tipo: tutorial
strumenti: [Ollama]
stato: pubblicata
uso_ia: "Testo preparato con un modello locale e riletto da una persona."
opportunita_id: "esempio-0002"
---

Questo è un **articolo di esempio** per vedere l'aspetto di un tutorial.

## Cosa serve

- Un computer con almeno 8 GB di memoria.
- Circa 5 GB di spazio libero.

## Passi

1. Scarica Ollama dal sito ufficiale e installalo.
2. Apri il terminale e scarica un modello piccolo:

```bash
ollama pull llama3.2
```

3. Fai la prima domanda:

```bash
ollama run llama3.2 "Spiegami la prova del nove"
```

## Errori comuni

- **Risposte molto lente:** il modello è troppo grande per la tua memoria. Prova uno più piccolo.
- **Comando non trovato:** chiudi e riapri il terminale dopo l'installazione.
