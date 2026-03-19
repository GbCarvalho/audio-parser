# Design: Waveform Player

## Goal

Replace the native `<audio controls>` element with a custom waveform player using WaveSurfer.js v7.

## Library

**WaveSurfer.js v7** (`wavesurfer.js`) — direct package, no Vue wrapper.
Initialized manually in `onMounted`, destroyed in `onUnmounted`.

## Component: `WaveformPlayer.vue`

### Props
```ts
defineProps<{ src: string }>()
```

### Emits
```ts
defineEmits<{ timeupdate: [time: number] }>()
```

### Exposes
```ts
defineExpose({ seekTo: (time: number) => void, play: () => void })
```

### Internal state
- `isLoading: boolean` — true while WaveSurfer fetches + decodes
- `isPlaying: boolean` — mirrors WaveSurfer play state
- `currentTime: number` — mirrors timeupdate
- `duration: number` — set on `ready` event
- `volume: number` — 0–1, default 1
- `speed: number` — 1 of [0.75, 1, 1.5, 2], default 1

### WaveSurfer config
```ts
WaveSurfer.create({
  container: containerRef.value,
  url: props.src,
  waveColor: '#C9D9EC',         // muted navy tint (unplayed)
  progressColor: '#3D5A80',     // navy (played)
  cursorColor: '#3D5A80',
  height: 56,
  barWidth: 2,
  barGap: 1,
  barRadius: 0,                 // sharp bars, no radius
  normalize: true,
  interact: true,               // click to seek
})
```

### Events wired
- `ready` → `isLoading = false`, `duration = ws.getDuration()`
- `timeupdate` → `currentTime = time`, `emit('timeupdate', time)`
- `play` / `pause` → `isPlaying = true / false`
- `finish` → `isPlaying = false`
- `error` → show error state

## Visual Layout

```
┌─────────────────────────────────────────────────┐
│  [waveform canvas — full width, 56px tall]       │  ← loading: animated pulse
└─────────────────────────────────────────────────┘
  ▶  00:00 / 04:32     ·  1×  ·  0.75  1.5  2      🔊 ──────●──
```

- **Waveform**: navy progress on muted-navy unplayed; sharp bars, no radius
- **Play/pause**: flat square button, `i-lucide-play` / `i-lucide-pause`, navy on active
- **Time**: `currentTime / duration` in IBM Plex Mono, `text-ink-muted`
- **Speed**: plain text toggles `0.75× 1× 1.5× 2×`; active = `text-navy font-medium`
- **Volume**: `<input type="range">` styled with accent-color, preceded by mute icon
- **Loading skeleton**: a flat `animate-pulse` bar replacing the canvas

## Integration with `index.vue`

`index.vue` currently:
1. Holds `media` ref to `<audio>` element
2. Reads `currentTime` via `@timeupdate` listener
3. Calls `media.value.currentTime = time` for seeking
4. Calls `media.value.play()` on sentence click

After change:
1. Replace `media` with `player` ref to `WaveformPlayer`
2. Listen to `@timeupdate` emitted by `WaveformPlayer`
3. Call `player.value.seekTo(time)` for seeking
4. Call `player.value.play()` on sentence click

## Cleanup

`onUnmounted(() => wavesurfer.destroy())`

## Error state

If WaveSurfer emits `error`, show a one-line message in place of the waveform:
`"Erro ao carregar áudio."` / `"Failed to load audio."`
