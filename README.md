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

```
app/
├── assets/
│   ├── data.ts          # Deepgram transcription sample data
│   └── main.css         # Tailwind + @nuxt/ui entry
├── composables/
│   └── useI18n.ts       # Locale detection and t() helper
├── components/
│   └── transcripts/
│       ├── TranscriptionPanel.vue
│       └── SummarizationPanel.vue
├── locales/
│   ├── pt.ts            # pt-BR strings (source of truth for keys)
│   └── en.ts            # English strings
├── pages/
│   └── index.vue        # Main page
└── plugins/
    └── temporal.ts      # Temporal API polyfill
```
