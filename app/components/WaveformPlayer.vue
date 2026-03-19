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
  ws?.seekTo(time)
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
      <div
        v-if="isLoading && !hasError"
        class="h-14 w-full animate-pulse bg-surface-alt"
      />
      <p v-else-if="hasError" class="h-14 flex items-center text-sm text-ink-muted font-mono">
        {{ t('audioError') }}
      </p>
      <div
        ref="containerRef"
        :class="(isLoading || hasError) ? 'absolute inset-0 opacity-0 pointer-events-none' : ''"
      />
    </div>

    <!-- Controls -->
    <div class="flex items-center gap-4">
      <button
        @click="togglePlay"
        class="shrink-0 text-navy hover:opacity-70 transition-opacity"
        :disabled="isLoading || hasError"
      >
        <UIcon :name="isPlaying ? 'i-lucide-pause' : 'i-lucide-play'" class="h-5 w-5" />
      </button>

      <span class="text-xs text-ink-muted font-mono tabular-nums shrink-0">
        {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
      </span>

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
