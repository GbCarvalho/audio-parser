<script setup lang="ts">
import type { TimelineItem } from '@nuxt/ui'

const {items, currentTime} = defineProps<{
  items: TranscriptItem[]
  currentTime: number
  onSeek: (time: number) => void
}>()

type Sentence = {
  start: number
  end: number
  text: string
}

type TranscriptItem = TimelineItem & {
  sentences: Sentence[]
  originalData?: any
}

const { t } = useI18n()

const activeItem = computed(() => {
  const idx = items.findIndex(p =>
    currentTime >= p.originalData.start && currentTime <= p.originalData.end
  )
  return idx
})

const scrollContainer = ref<HTMLElement | null>(null)

watch(activeItem, (idx) => {
  const el = scrollContainer.value?.querySelector<HTMLElement>(
    `[data-paragraph-index="${idx}"]`
  )
  el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
})

function isSentenceActive(sentence: Sentence): boolean {
  return currentTime >= sentence.start && currentTime <= sentence.end + 0.3
}

function isSentencePast(sentence: Sentence): boolean {
  return currentTime > sentence.end + 0.3
}
</script>

<template>
  <div class="flex flex-col h-full border border-border-warm bg-surface">
    <div class="px-4 pt-4 pb-3 sm:px-6 sm:pt-5 shrink-0 flex items-center justify-between border-b border-border-warm">
      <h2 class="text-sm font-semibold text-ink">{{ t('transcriptionsTitle') }}</h2>
      <span class="text-xs text-ink-faint font-mono">{{ items.length }} {{ t('blocks') }}</span>
    </div>
    <div ref="scrollContainer" class="flex-1 min-h-0 overflow-y-auto px-4 sm:px-6 py-4">
      <UTimeline
        :items="items"
        :model-value="activeItem"
        :ui="{
          date: 'float-start mr-1 text-ink-faint text-xs font-mono',
          item: 'gap-3',
          title: 'text-sm font-semibold text-ink',
          description: 'text-sm leading-relaxed text-ink-muted'
        }"
        class="pt-1"
      >
        <template #description="{ item, index }">
          <div class="flex flex-wrap gap-y-1" :data-paragraph-index="index ?? items.indexOf(item)">
            <a
              v-for="sentence in item.sentences"
              :key="sentence.text"
              class="cursor-pointer px-1 py-0.5 transition-opacity hover:opacity-80"
              @click.prevent="onSeek(sentence.start)"
            >
              <span :class="{
                'text-navy font-medium': isSentenceActive(sentence),
                'opacity-40': isSentencePast(sentence),
              }">{{ sentence.text + ' ' }}</span>
            </a>
          </div>
        </template>

        <template #date="{ item }">
          {{ item.date }}
        </template>
      </UTimeline>
    </div>
  </div>
</template>
