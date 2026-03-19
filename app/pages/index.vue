<script setup lang="ts">
import { useTemplateRef, ref, reactive, computed, type Ref } from 'vue'
import TranscriptionPanel from '~/components/transcripts/TranscriptionPanel.vue'
import SummarizationPanel from '~/components/transcripts/SummarizationPanel.vue'
import sampleData from '~/assets/data'
import type { TimelineItem } from '@nuxt/ui'

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

const AUDIO_URL = 'https://github.com/Azure-Samples/cognitive-services-speech-sdk/raw/master/scenarios/call-center/sampledata/Call6_mono_16k_az_apply_loan.wav'

const media = useTemplateRef<HTMLAudioElement>('audio') as Ref<HTMLAudioElement | null>
const data = ref<DeepgramValue | null>(sampleData)
const currentTime = ref(0)

function moveTo(time: number) {
  if (!media.value) return
  media.value.currentTime = time
}

const tabs = [
  { label: 'Transcrição', slot: 'transcription' },
  { label: 'Resumo', slot: 'summarization' },
]

function onTextClick(time: number) {
  moveTo(time)
  if (!media?.value) return
  media.value.play()
}

function updateCurrentTime() {
  if (!media.value) return
  currentTime.value = media.value.currentTime
}

function formatTime(seconds: number) {
  const ms = Math.floor(seconds * 1000)
  return Temporal.Duration.from({ milliseconds: ms })
    .round({ largestUnit: 'hours' })
    .toLocaleString(undefined, { style: 'digital', fractionalDigits: 0, hoursDisplay: 'auto' })
}

const transcripts = ref<TranscriptItem[]>(
  data.value?.results.channels?.[0]?.alternatives?.[0]?.paragraphs?.paragraphs.map(paragraph => ({
    date: formatTime(paragraph.start),
    title: 'Falante ' + paragraph.speaker,
    icon: 'i-lucide-user',
    description: '',
    sentences: paragraph.sentences,
    originalData: paragraph
  })) || []
)
</script>

<template>
  <div class="min-h-screen bg-linear-to-b from-gray-50 via-white to-white">
    <div class="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8 sm:py-10">
      <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div class="space-y-1">
          <h1 class="text-2xl font-semibold text-gray-900 sm:text-3xl">Transcrição</h1>
          <p class="text-sm text-gray-500">Ouça e clique nos trechos para navegar.</p>
        </div>
        <div class="flex items-center gap-2">
          <span class="inline-flex items-center gap-2 rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700 ring-1 ring-primary-100">
            <span class="h-1.5 w-1.5 rounded-full bg-primary-500"></span>
            Reprodução ativa
          </span>
        </div>
      </div>

      <div class="sticky top-0 z-20 mb-6 bg-gray-50/80 pt-4 backdrop-blur sm:mb-8 sm:pt-6">
        <UCard class="backdrop-blur" :ui="{ body: 'p-4 sm:p-6' }">
          <div class="flex flex-col gap-4">
            <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div class="flex items-center gap-2 text-sm font-medium text-gray-700">
                <span class="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary-50 text-primary-600 ring-1 ring-primary-100">
                  <UIcon name="i-lucide-audio-lines" class="h-4 w-4" />
                </span>
                Áudio
              </div>
              <div class="flex items-center gap-2 text-xs text-gray-400">
                <span class="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                Tempo atual: {{ formatTime(currentTime) }}
              </div>
            </div>
            <div class="rounded-2xl border border-gray-200 bg-white/80 p-3 shadow-sm ring-1 ring-gray-100 backdrop-blur sm:p-4">
              <audio
                ref="audio"
                controls
                @timeupdate="updateCurrentTime"
                class="w-full rounded-xl bg-white"
              >
                <source :src="AUDIO_URL">
              </audio>
            </div>
          </div>
        </UCard>
      </div>

      <UTabs :items="tabs" class="w-full">
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
