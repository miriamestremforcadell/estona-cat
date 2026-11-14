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

Aquesta versió és una base d'interfície i arquitectura, no una versió educativa acabada. Les tres primeres lliçons del món «Els fonaments» tenen contingut marcat com a validat. Els altres set mons permeten consultar la introducció teòrica, però les lliçons i activitats encara estan en preparació. Les activitats de mostra no s'activen ni es consideren contingut publicable.

Encara falten el banc d'exercicis revisat, els àudios enregistrats, la validació completa d'accessibilitat i les proves reals en Safari/iOS. El funcionament offline s'ha de verificar en dispositius reals abans de donar-lo per garantit.

## Continguts i fonts

Els continguts educatius s'han separat de la lògica de la interfície a `content.js`. Les expressions publicables han de tenir estat `validat`. Les primeres lliçons es basen en l'Optimot (fitxa 6655/11) i la GIEC (§ 31.2.5.1). No s'hi han d'afegir exercicis no revisats ni respostes suposadament correctes.

## Drets

© 2026 ESTONA. Tots els drets reservats. No s'atorga cap llicència general de reutilització.
