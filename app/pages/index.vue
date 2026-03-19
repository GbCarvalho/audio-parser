<script setup lang="ts">
import { useTemplateRef, ref, computed } from 'vue'
import { Temporal } from 'temporal-polyfill'
import TranscriptionPanel from '~/components/transcripts/TranscriptionPanel.vue'
import SummarizationPanel from '~/components/transcripts/SummarizationPanel.vue'
import WaveformPlayer from '~/components/WaveformPlayer.vue'
import sampleData from '~/assets/data'
import type { TimelineItem } from '@nuxt/ui'

const { t, locale, toggleLocale } = useI18n()

interface Word {
  word: string
  start: number
  end: number
  speaker?: number
}

interface Paragraphs {
  sentences: Array<{
    start: number
    end: number
    text: string
  }>
  speaker: number
  num_words: number
  start: number
  end: number
}

interface DeepgramValue {
  metadata: {
    transaction_key: string
    request_id: string
    sha256: string
    created: string
    duration: number
    channels: number
    models: Array<string>
  }
  results: {
    channels: Array<{
      alternatives: Array<{
        transcript: string
        confidence: number
        words: Array<Word>
        paragraphs: {
          transcript: string
          paragraphs: Array<Paragraphs>
        }
      }>
    }>
  }
}

type Sentence = Paragraphs['sentences'][number]

interface TranscriptItem extends TimelineItem {
  sentences: Sentence[]
}

const AUDIO_URL = 'https://raw.githubusercontent.com/Azure-Samples/cognitive-services-speech-sdk/master/scenarios/call-center/sampledata/Call6_mono_16k_az_apply_loan.wav'

const player = useTemplateRef<InstanceType<typeof WaveformPlayer>>('player')
const data = ref<DeepgramValue | null>(sampleData)
const currentTime = ref(0)

const tabs = computed(() => [
  { label: t('tabTranscription'), slot: 'transcription' },
  { label: t('tabSummary'), slot: 'summarization' },
])

function onTextClick(time: number) {
  player.value?.seekTo(time)
  player.value?.play()
}

function formatTime(seconds: number) {
  const ms = Math.floor(seconds * 1000)
  return Temporal.Duration.from({ milliseconds: ms })
    .round({ largestUnit: 'hours' })
    .toLocaleString(undefined, { style: 'digital', fractionalDigits: 0, hoursDisplay: 'auto' })
}

const transcripts = computed<TranscriptItem[]>(() =>
  data.value?.results.channels?.[0]?.alternatives?.[0]?.paragraphs?.paragraphs.map(paragraph => ({
    date: formatTime(paragraph.start),
    title: t('speaker') + ' ' + paragraph.speaker,
    icon: 'i-lucide-user',
    description: '',
    sentences: paragraph.sentences,
    originalData: paragraph
  })) || []
)
</script>

<template>
  <div class="h-screen w-screen overflow-hidden flex flex-col bg-page">
    <div class="mx-auto w-full max-w-5xl px-4 py-4 sm:px-6 lg:px-8 sm:py-6 flex flex-col flex-1 min-h-0">

      <!-- Header -->
      <div class="mb-4 shrink-0 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div class="space-y-0.5">
          <h1 class="text-xl font-semibold text-ink sm:text-2xl">{{ t('title') }}</h1>
          <p class="text-sm text-ink-muted">{{ t('subtitle') }}</p>
        </div>
        <button
          @click="toggleLocale"
          class="inline-flex items-center gap-1.5 border border-border-warm bg-surface px-3 py-1 text-xs font-medium text-ink-muted transition hover:bg-surface-alt hover:text-ink self-start sm:self-auto"
        >
          <UIcon name="i-lucide-languages" class="h-3.5 w-3.5" />
          {{ locale === 'pt' ? 'EN' : 'PT' }}
        </button>
      </div>

      <!-- Audio player -->
      <div class="mb-4 shrink-0 border border-border-warm bg-surface p-4 sm:p-5">
        <ClientOnly>
          <WaveformPlayer
            ref="player"
            :src="AUDIO_URL"
            @timeupdate="currentTime = $event"
          />
          <template #fallback>
            <div class="h-14 w-full animate-pulse bg-surface-alt" />
          </template>
        </ClientOnly>
      </div>

      <!-- Tabs -->
      <UTabs :items="tabs" class="w-full flex-1 min-h-0 flex flex-col overflow-hidden" :ui="{ content: 'flex-1 min-h-0 overflow-hidden' }">
        <template #transcription>
          <TranscriptionPanel
            :items="transcripts"
            :current-time="currentTime"
            :on-seek="onTextClick"
          />
        </template>
        <template #summarization>
          <SummarizationPanel />
        </template>
      </UTabs>

    </div>
  </div>
</template>
