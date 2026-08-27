# Level Up

Juego de práctica de inglés para Laura Bedoya (UX/UI Designer): vocabulario de diseño y frases de entrevista de trabajo, en formato arcade — 3 vidas, niveles que suben con la dificultad, racha de aciertos y mejor puntaje guardado en el navegador.

Contenido curado a mano por Claude a partir del perfil real de Laura (Koronet, Karibik, Triario) — sin API externa.

## Stack

React 19 + Vite + Tailwind CSS v4.

## Desarrollo

```
npm install
npm run dev
```

## Deploy

```
npm run deploy
```

Publica `dist/` a la rama `gh-pages` vía el paquete [`gh-pages`](https://www.npmjs.com/package/gh-pages).

## Agregar preguntas

Edita `src/data/questions.js` — cada pregunta tiene `difficulty` (1-3), `type` (`term` | `phrase` | `fill`), `prompt`, `options` (4) y `answerIndex`.
