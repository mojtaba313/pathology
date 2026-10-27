# pathology

Interactive Persian pathology study app built with React and Vite.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Content

Modules live in `src/modules/<module>/module.json` with one JSON file per lesson in `src/modules/<module>/lessons/`. Handout images and source PDFs are served from `public/assets` and `public/sources`.

See [`docs/MODULE_AUTHORING.md`](docs/MODULE_AUTHORING.md) for the module JSON contract, examples, HTML rules, and an AI authoring prompt.

## Validate modules

```bash
npm run validate:modules
```

`npm run build` runs the same validation automatically.
