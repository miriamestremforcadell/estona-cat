# ESTONA

**Aprèn a dir les hores en català.**

Primera estructura tècnica de desenvolupament (0.2.0). Aplicació web estàtica pensada per instal·lar-se com a PWA a iPhone.

## Estructura

- `index.html`: estructura i vistes de l'aplicació.
- `styles.css`: sistema visual adaptable, mode clar/fosc i accessibilitat bàsica.
- `app.js`: navegació, IndexedDB, preferències, progrés i còpies de seguretat.
- `content.js`: banc estructurat de continguts educatius amb estats de validació.
- `manifest.webmanifest`: configuració PWA.
- `service-worker.js`: memòria cau inicial de recursos.
- `assets/estona-icon.svg`: icona vectorial de l'espardenya.

## Desenvolupament

Serveix la carpeta amb qualsevol servidor estàtic local. Per exemple:

```bash
python3 -m http.server 8000
```

Després obre `http://localhost:8000`.

## Estat important

Aquesta versió incorpora 35 lliçons distribuïdes en vuit mons, 147 expressions horàries úniques validades, 48 combinacions bàsiques del sistema de campanar, 36 alternatives del sistema de rellotge i 96 exemples de minuts en increments de cinc minuts, exemples de mitjos quarts i expressions aproximatives, durades i intervals documentats, aproximacions i sistema internacional. Les vuit modalitats de pràctica utilitzen exemples marcats com a validats. El banc encara s'ha d'ampliar i sotmetre a proves lingüístiques i pedagògiques més extenses.

Encara falten l'ampliació del banc d'exercicis, els àudios enregistrats, la validació completa d'accessibilitat i les proves reals en Safari/iOS. El funcionament offline s'ha de verificar en dispositius reals abans de donar-lo per garantit.

## Continguts i fonts

Els continguts educatius s'han separat de la lògica de la interfície a `content.js`. Les expressions publicables han de tenir estat `validat`. El banc revisat es basa principalment en la GIEC en línia (§ 31.2.5.1 i § 31.2.3) i incorpora l'Optimot com a font complementària. Les formes del sistema de rellotge es reconeixen com a vàlides segons els usos territorials; les aproximacions no es converteixen en minuts exactes. No s'hi han d'afegir exercicis no revisats ni respostes suposadament correctes.

## Drets

© 2026 ESTONA. Tots els drets reservats. No s'atorga cap llicència general de reutilització.
