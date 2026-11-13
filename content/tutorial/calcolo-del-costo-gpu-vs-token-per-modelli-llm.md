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
- Un sistema operativo con Python 3 installato.
- Un file JSON che descrive lo scenario di utilizzo (vedi esempio più avanti).

### Installazione e uso

1. **Salva il codice** del programma in un file chiamato `calc.py`:
   ```python
   import json
   import sys
   import math

   NUMERIC_FIELDS = {
       "carico_mensile": ("token_input", "token_output"),
       "token": ("prezzo_input_per_milione", "prezzo_output_per_milione"),
       "gpu": ("prezzo_ora", "token_output_al_secondo", "token_input_al_secondo",
               "ore_fatturazione_minima", "ore_mese_sempre_accesa"),
   }

   def validate_scenario(scenario):
       if not isinstance(scenario, dict):
           return ["Lo scenario deve essere un oggetto JSON"]
       errors = []
       if not isinstance(scenario.get("valuta"), str):
           errors.append("Chiave mancante o non valida: valuta")
       for section, fields in NUMERIC_FIELDS.items():
           values = scenario.get(section)
           if not isinstance(values, dict):
               errors.append(f"Chiave mancante: {section}")
               continue
           for field in fields:
               v = values.get(field)
               if v is None:
                   errors.append(f"Chiave mancante: {section}.{field}")
               elif isinstance(v, bool) or not isinstance(v, (int, float)):
                   errors.append(f"{section}.{field} deve essere un numero")
               elif v <= 0:
                   errors.append(f"{section}.{field} deve essere maggiore di zero")
       gpu = scenario.get("gpu")
       if isinstance(gpu, dict) and gpu.get("modalita") not in ("a_consumo", "sempre_accesa"):
           errors.append("gpu.modalita deve essere 'a_consumo' o 'sempre_accesa'")
       return errors

   def calculate_pareggio(scenario):
       input_tokens = scenario['carico_mensile']['token_input']
       output_tokens = scenario['carico_mensile']['token_output']
       prezzo_input_per_milione = scenario['token']['prezzo_input_per_milione']
       prezzo_output_per_milione = scenario['token']['prezzo_output_per_milione']
       prezzo_ora = scenario['gpu']['prezzo_ora']
       token_output_al_secondo = scenario['gpu']['token_output_al_secondo']
       token_input_al_secondo = scenario['gpu']['token_input_al_secondo']
       modalita = scenario['gpu']['modalita']
       ore_mese_sempre_accesa = scenario['gpu']['ore_mese_sempre_accesa']

       if output_tokens == 0:
           r = 0
       else:
           r = input_tokens / output_tokens

       ct = (r * prezzo_input_per_milione + prezzo_output_per_milione) / 1e6
       cg = prezzo_ora / 3600 * (r / token_input_al_secondo + 1 / token_output_al_secondo)

       if modalita == "sempre_accesa":
           return (ore_mese_sempre_accesa * prezzo_ora) / ct
       else:
           if cg < ct:
               return 0
           else:
               return None

   def calculate_costs(scenario, json_output=False):
       errors = validate_scenario(scenario)
       if errors:
           for error in errors:
               print(f"Errore: {error}", file=sys.stderr)
           sys.exit(2)

       input_tokens = scenario['carico_mensile']['token_input']
       output_tokens = scenario['carico_mensile']['token_output']
       prezzo_input_per_milione = scenario['token']['prezzo_input_per_milione']
       prezzo_output_per_milione = scenario['token']['prezzo_output_per_milione']
       prezzo_ora = scenario['gpu']['prezzo_ora']
       token_output_al_secondo = scenario['gpu']['token_output_al_secondo']
       token_input_al_secondo = scenario['gpu']['token_input_al_secondo']
       ore_fatturazione_minima = scenario['gpu']['ore_fatturazione_minima']
       ore_mese_sempre_accesa = scenario['gpu']['ore_mese_sempre_accesa']
       modalita = scenario['gpu']['modalita']

       costo_token = (input_tokens / 1e6) * prezzo_input_per_milione + (output_tokens / 1e6) * prezzo_output_per_milione

       ore_necessarie = (input_tokens / token_input_al_secondo + output_tokens / token_output_al_secondo) / 3600

       if modalita == 'a_consumo':
           ore_pagate = math.ceil(ore_necessarie / ore_fatturazione_minima) * ore_fatturazione_minima
       else:
           ore_pagate = ore_mese_sempre_accesa

       costo_gpu = ore_pagate * prezzo_ora

       differenza = costo_token - costo_gpu
       piu_economica = "gpu" if costo_gpu < costo_token else "token"

       pareggio_token_output = calculate_pareggio(scenario)

       avvisi = []
       if modalita == 'sempre_accesa' and ore_necessarie > ore_mese_sempre_accesa:
           avvisi.append("Una GPU non basta")

       result = {
           "valuta": scenario['valuta'],
           "costo_token": round(costo_token, 2),
           "ore_necessarie": round(ore_necessarie, 4),
           "ore_pagate": ore_pagate,
           "costo_gpu": round(costo_gpu, 2),
           "utilizzo_gpu": round(ore_necessarie / ore_pagate, 4) if ore_pagate > 0 else 0,
           "differenza": round(differenza, 2),
           "piu_economica": piu_economica,
           "pareggio_token_output": pareggio_token_output,
           "avvisi": avvisi,
           "nota": "Stime basate sui parametri inseriti; non includono configurazione, manutenzione, latenza e tempi di avvio."
       }

       if json_output:
           return result
       print_table(result)
       return None

   def print_table(r):
       v = r["valuta"]
       pareggio = r["pareggio_token_output"]
       if pareggio is None:
           pareggio_txt = "la GPU non conviene mai"
       elif pareggio == 0:
           pareggio_txt = "la GPU conviene a ogni volume (arrotondamento delle ore escluso)"
       else:
           pareggio_txt = f"{pareggio:,.0f} token output al mese"
       rows = [
           ("Costo mensile a token", f"{r['costo_token']:.2f} {v}"),
           ("Ore GPU necessarie", f"{r['ore_necessarie']:.2f}"),
           ("Ore GPU pagate", f"{r['ore_pagate']}"),
           ("Costo GPU mensile", f"{r['costo_gpu']:.2f} {v}"),
           ("Utilizzo GPU", f"{r['utilizzo_gpu']:.1%}"),
           ("Differenza (token - GPU)", f"{r['differenza']:.2f} {v}"),
           ("Più economica", r["piu_economica"].upper()),
           ("Punto di pareggio", pareggio_txt),
       ]
       width = max(len(k) for k, _ in rows)
       for k, val in rows:
           print(f"{k:<{width}}  {val}")
       for a in r["avvisi"]:
           print(f"ATTENZIONE: {a}")
       print(r["nota"])

   def main():
       if len(sys.argv) > 1 and sys.argv[1] == '--help':
           print("Uso: python calc.py <file_json> [--json]")
           sys.exit(0)

       if len(sys.argv) != 2 and len(sys.argv) != 3:
           print("Uso: python calc.py <file_json> [--json]")
           sys.exit(2)

       json_file = sys.argv[1]
       json_output = len(sys.argv) == 3 and sys.argv[2] == '--json'

       try:
           with open(json_file, 'r', encoding='utf-8') as f:
               scenario = json.load(f)
       except (FileNotFoundError, IsADirectoryError, PermissionError):
           print(f"Errore: impossibile leggere il file {json_file}", file=sys.stderr)
           sys.exit(2)
       except (json.JSONDecodeError, UnicodeDecodeError):
           print(f"Errore: {json_file} non contiene JSON valido", file=sys.stderr)
           sys.exit(2)

       result = calculate_costs(scenario, json_output)
       if json_output and result is not None:
           print(json.dumps(result, indent=2))

   if __name__ == "__main__":
       main()
   ```

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
