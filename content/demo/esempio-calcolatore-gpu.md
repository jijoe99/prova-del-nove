---
title: "GPU a ore o prezzo a token? Un calcolatore per decidere"
description: "Esempio di demo: confronta il costo di una GPU noleggiata a ore con quello di un servizio che fa pagare a token."
date: 2026-11-13
tipo: demo
strumenti: [Python, Docker, Ollama]
stato: pubblicata
fonte_problema: "https://example.com/domanda-di-esempio"
dati_fittizi: true
uso_ia: "Codice generato con un modello locale, rivisto da Claude e provato in un ambiente isolato."
opportunita_id: "esempio-0001"
---

Questo è un **articolo di esempio**: serve a vedere come appare una demo. I prezzi e i volumi sono inventati.

## Il problema

Chi usa un modello di linguaggio si chiede se conviene noleggiare una GPU a ore o pagare un servizio a token. La risposta dipende da quante richieste fai al mese e da quanto tempo la GPU resta accesa senza lavorare.

## Come funziona la demo

Inserisci tre numeri: richieste al mese, token medi per richiesta e prezzo orario della GPU. Il calcolatore confronta i due costi e dice quale conviene.

| Scenario (dati fittizi) | GPU a ore | A token | Conviene |
| --- | --- | --- | --- |
| 20.000 richieste al mese | 210 € | 34 € | a token |
| 120.000 richieste al mese | 210 € | 164 € | a token |
| 400.000 richieste al mese | 210 € | 548 € | GPU a ore |

## Come l'ho provata

Il codice gira in un contenitore Docker senza rete. I test controllano che i tre scenari sopra diano il risultato atteso e che valori strani (zero richieste, prezzo negativo) vengano rifiutati con un messaggio chiaro.

## Limiti

Il calcolo ignora il tempo di avvio della GPU e le differenze di qualità tra i modelli. Per una scelta vera servono i prezzi aggiornati dei fornitori.
