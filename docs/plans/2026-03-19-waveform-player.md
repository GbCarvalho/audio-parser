# Waveform Player Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the native `<audio controls>` element with a custom waveform player using WaveSurfer.js v7 that includes play/pause, time display, speed, and volume controls.

**Architecture:** A self-contained `WaveformPlayer.vue` component initializes WaveSurfer on mount, renders the waveform canvas, and exposes `seekTo(time)` and `play()` for external control. `index.vue` replaces its `<audio>` ref and `timeupdate` listener with the new component's ref and emitted events.

**Tech Stack:** `wavesurfer.js` v7, Vue 3 `<script setup>`, Nuxt 4, IBM Plex Mono (already loaded via @nuxt/fonts), Tailwind v4 with design tokens (`text-navy`, `text-ink-muted`, `font-mono`, `border-border-warm`)

---

### Task 1: Install wavesurfer.js

**Files:**
- Modify: `package.json` (via pnpm)

**Step 1: Install the package**

```bash
cd /Users/gabrielcarvalho/Developer/personal/audio-parser
pnpm add wavesurfer.js
```

Expected output: wavesurfer.js added to `dependencies` in `package.json`.

**Step 2: Verify**

```bash
grep '"wavesurfer.js"' package.json
```

Expected: a line like `"wavesurfer.js": "^7.x.x"`

**Step 3: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: add wavesurfer.js dependency"
```

---

### Task 2: Create WaveformPlayer.vue

**Files:**
- Create: `app/components/WaveformPlayer.vue`

**Step 1: Create the component**

Create `/Users/gabrielcarvalho/Developer/personal/audio-parser/app/components/WaveformPlayer.vue` with the following content:

```vue
<script setup lang="ts">
import WaveSurfer from 'wavesurfer.js'

const props = defineProps<{ src: string }>()
const emit = defineEmits<{ timeupdate: [time: number] }>()

const containerRef = ref<HTMLElement | null>(null)
const isLoading = ref(true)
const isPlaying = ref(false)
const hasError = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(1)
const speed = ref(1)
const speeds = [0.75, 1, 1.5, 2]

let ws: WaveSurfer | null = null

const { t } = useI18n()

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function togglePlay() {
  ws?.playPause()
}

function setSpeed(s: number) {
  speed.value = s
  ws?.setPlaybackRate(s)
}

function onVolumeChange(e: Event) {
  const v = parseFloat((e.target as HTMLInputElement).value)
  volume.value = v
  ws?.setVolume(v)
}

function seekTo(time: number) {
  ws?.setTime(time)
}

function play() {
  ws?.play()
}

defineExpose({ seekTo, play })

onMounted(() => {
  if (!containerRef.value) return

  ws = WaveSurfer.create({
    container: containerRef.value,
    url: props.src,
    waveColor: '#C9D9EC',
    progressColor: '#3D5A80',
    cursorColor: '#3D5A80',
    height: 56,
    barWidth: 2,
    barGap: 1,
    barRadius: 0,
    normalize: true,
    interact: true,
  })

  ws.on('ready', () => {
    isLoading.value = false
    duration.value = ws!.getDuration()
  })

  ws.on('timeupdate', (time: number) => {
    currentTime.value = time
    emit('timeupdate', time)
  })

  ws.on('play', () => { isPlaying.value = true })
  ws.on('pause', () => { isPlaying.value = false })
  ws.on('finish', () => { isPlaying.value = false })

  ws.on('error', () => {
    isLoading.value = false
    hasError.value = true
  })
})

onUnmounted(() => {
  ws?.destroy()
  ws = null
})
</script>

<template>
  <div class="flex flex-col gap-3">
    <!-- Waveform canvas -->
    <div class="relative">
      <!-- Loading skeleton -->
      <div
        v-if="isLoading && !hasError"
        class="h-14 w-full animate-pulse bg-surface-alt"
      />
      <!-- Error state -->
      <p v-else-if="hasError" class="h-14 flex items-center text-sm text-ink-muted font-mono">
        {{ t('audioError') }}
      </p>
      <!-- Canvas target — always rendered so WaveSurfer can mount -->
      <div
        ref="containerRef"
        :class="(isLoading || hasError) ? 'absolute inset-0 opacity-0 pointer-events-none' : ''"
      />
    </div>

    <!-- Controls -->
    <div class="flex items-center gap-4">
      <!-- Play/pause -->
      <button
        @click="togglePlay"
        class="shrink-0 text-navy hover:opacity-70 transition-opacity"
        :disabled="isLoading || hasError"
      >
        <UIcon :name="isPlaying ? 'i-lucide-pause' : 'i-lucide-play'" class="h-5 w-5" />
      </button>

      <!-- Time -->
      <span class="text-xs text-ink-muted font-mono tabular-nums shrink-0">
        {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
      </span>

      <!-- Speed toggles -->
      <div class="flex items-center gap-2 ml-auto">
        <button
          v-for="s in speeds"
          :key="s"
          @click="setSpeed(s)"
          class="text-xs font-mono transition-colors"
          :class="speed === s ? 'text-navy font-medium' : 'text-ink-faint hover:text-ink-muted'"
        >
          {{ s }}×
        </button>
      </div>

      <!-- Volume -->
      <div class="flex items-center gap-1.5 shrink-0">
        <UIcon name="i-lucide-volume-2" class="h-3.5 w-3.5 text-ink-faint" />
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          :value="volume"
          @input="onVolumeChange"
          class="w-16 accent-navy h-1 cursor-pointer"
        />
      </div>
    </div>
  </div>
</template>
```

**Step 2: Add the missing i18n key to both locale files**

In `app/locales/pt.ts`, add to the object:
```ts
audioError: 'Erro ao carregar o áudio.',
```

In `app/locales/en.ts`, add to the object:
```ts
audioError: 'Failed to load audio.',
```

> Note: `pt.ts` exports the type `I18nKey`. Add the key there first, then TypeScript will require it in `en.ts`.

**Step 3: Commit**

```bash
git add app/components/WaveformPlayer.vue app/locales/pt.ts app/locales/en.ts
git commit -m "feat: add WaveformPlayer component with WaveSurfer.js"
```

---

### Task 3: Wire WaveformPlayer into index.vue

**Files:**
- Modify: `app/pages/index.vue`

The goal is to replace the `<audio>` element and its associated logic with `WaveformPlayer`.

**Step 1: Update the script block**

Remove:
- `import { useTemplateRef, ref, reactive, computed, type Ref } from 'vue'` → keep only what's needed (no `reactive`; keep `ref`, `computed`)
- `const media = useTemplateRef<HTMLAudioElement>('audio') as Ref<HTMLAudioElement | null>`
- `function moveTo(time: number) { ... }`
- `function updateCurrentTime() { ... }`

Add:
```ts
import WaveformPlayer from '~/components/WaveformPlayer.vue'
const player = useTemplateRef<InstanceType<typeof WaveformPlayer>>('player')
```

Update `onTextClick`:
```ts
function onTextClick(time: number) {
  player.value?.seekTo(time)
  player.value?.play()
}
```

Update `updateCurrentTime` — this is now driven by the component's `timeupdate` event. Remove the function entirely. `currentTime` is set via the handler on the component.

**Step 2: Update the template**

Replace the audio player block. Find and replace:
```html
      <!-- Audio player -->
      <div class="mb-4 shrink-0 border border-border-warm bg-surface p-4 sm:p-5">
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs font-medium text-ink-muted uppercase tracking-wide font-mono">{{ t('audio') }}</span>
          <span class="text-xs text-ink-faint font-mono">{{ formatTime(currentTime) }}</span>
        </div>
        <audio
          ref="audio"
          controls
          @timeupdate="updateCurrentTime"
          class="w-full"
        >
          <source :src="AUDIO_URL">
        </audio>
      </div>
```

With:
```html
      <!-- Audio player -->
      <div class="mb-4 shrink-0 border border-border-warm bg-surface p-4 sm:p-5">
        <WaveformPlayer
          ref="player"
          :src="AUDIO_URL"
          @timeupdate="currentTime = $event"
        />
      </div>
```

**Step 3: Clean up unused imports**

After the changes, `reactive` and `type Ref` are no longer used. Remove them from the import line:
```ts
import { useTemplateRef, ref, computed } from 'vue'
```

Also remove `updateCurrentTime` from the script if it wasn't already removed.

**Step 4: Verify visually**

Run `pnpm dev` and open http://localhost:3000.

Check:
- The waveform loads and renders (may take 1–2s to decode the WAV)
- The loading skeleton appears while decoding
- Play/pause button works
- Clicking the waveform seeks to that position
- Clicking a transcript sentence seeks and plays
- Speed toggles change playback rate
- Volume slider works
- Time display updates as audio plays
- Auto-scroll in the transcript follows playback

**Step 5: Commit**

```bash
git add app/pages/index.vue
git commit -m "feat: wire WaveformPlayer into main page, remove native audio element"
```

---

### Task 4: Push and create PR

**Step 1: Push branch**

```bash
git push
```

**Step 2: Create PR**

```bash
gh pr create --title "feat: waveform audio player" --body "$(cat <<'EOF'
## Summary

- Replaces native `<audio controls>` with a custom waveform player built on WaveSurfer.js v7
- Waveform renders in navy on warm paper background, matching the Japanese-Swiss design system
- Custom controls: play/pause, time display (IBM Plex Mono), speed toggles (0.75× 1× 1.5× 2×), volume slider
- Loading skeleton while WaveSurfer fetches and decodes the audio
- Error state with i18n copy for both EN and PT
- `seekTo(time)` and `play()` exposed for transcript click-to-seek integration

## Test Plan

- [ ] Waveform renders after ~1–2s decode delay
- [ ] Loading skeleton visible during decode
- [ ] Play/pause toggles correctly
- [ ] Click on waveform seeks to position; transcript panel follows
- [ ] Click on transcript sentence seeks + plays; waveform updates
- [ ] Speed toggles change playback rate (verify with faster speech)
- [ ] Volume slider audibly changes volume
- [ ] Time display matches actual playback position

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

Expected: PR URL printed to stdout.
