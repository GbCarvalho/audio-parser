# audio-parser

A single-page transcription demo built with Nuxt 4. Plays a call-center audio sample and displays its Deepgram transcription with click-to-seek, speaker highlighting, and bilingual support (English / pt-BR).

## Features

- **Audio playback** — browser-native player with real-time position tracking
- **Click-to-seek** — click any sentence in the transcript to jump to that moment
- **Speaker highlighting** — active sentences are highlighted as audio plays
- **Bilingual UI** — auto-detects browser language (English default); toggle between EN and PT with one click
- **Summarization tab** — placeholder for future AI-generated summaries

## Tech stack

- [Nuxt 4](https://nuxt.com) + Vue 3
- [@nuxt/ui](https://ui.nuxt.com) (Tailwind CSS v4, component library)
- [VueUse](https://vueuse.org) — `useNavigatorLanguage` for locale detection
- [Temporal API](https://tc39.es/proposal-temporal/) with polyfill for time formatting
- TypeScript strict mode

## Getting started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Other commands

```bash
pnpm build    # production build
pnpm preview  # preview production build locally
```

## Project structure

Standard [Nuxt 4 `app/` directory](https://nuxt.com/docs/guide/directory-structure/app) layout. Non-conventional folders:

- `app/assets/data.ts` — bundled Deepgram sample transcription (replaces a real API call)
- `app/locales/` — EN and pt-BR string catalogs; `pt.ts` is the source of truth for i18n keys
- `app/composables/useI18n.ts` — locale detection and `t()` helper (wraps `useNavigatorLanguage`)
- `app/plugins/temporal.ts` — Temporal API polyfill registered before any page renders
