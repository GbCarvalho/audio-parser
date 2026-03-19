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

const highlightedTime = reactive({
  "text-primary-500": true,
  "opacity-50": true,
  "font-semibold": true
});

const activeItem = computed(() => {
  const activeItemIndex = items.findIndex(paragraph => {
    return currentTime >= paragraph.originalData.start && currentTime <= paragraph.originalData.end;
  })
  return Math.max(activeItemIndex, 0);
});

const scrollContainer = ref<HTMLElement | null>(null)

watch(activeItem, (idx) => {
  const el = scrollContainer.value?.querySelector<HTMLElement>(
    `[data-paragraph-index="${idx}"]`
  )
  el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
})
</script>

<template>
  <UCard :ui="{ root: 'flex flex-col h-full', body: 'p-4 sm:p-6 flex flex-col flex-1 min-h-0' }">
    <div class="mb-4 shrink-0 flex items-center justify-between">
      <h2 class="text-base font-semibold text-gray-800">{{ t('transcriptionsTitle') }}</h2>
      <span class="text-xs text-gray-400">{{ items.length }} {{ t('blocks') }}</span>
    </div>
    <div ref="scrollContainer" class="flex-1 min-h-0 overflow-y-auto pr-1">
      <UTimeline
        :items="items"
        :ui="{
          date: 'float-start mr-1 text-gray-400 text-xs',
          item: 'gap-3',
          title: 'text-sm font-semibold text-gray-900',
          description: 'text-sm leading-relaxed text-gray-600'
        }"
        class="pt-2"
        v-model="activeItem"
      >
        <template #description="{ item, index }">
          <div class="flex flex-wrap gap-y-1" :data-paragraph-index="index ?? items.indexOf(item)">
            <a
              v-for="sentence in item.sentences"
              :key="sentence.text"
              class="cursor-pointer rounded px-1 py-0.5 transition hover:bg-primary-50"
              @click.prevent="onSeek(sentence.start)"
            >
              <span :class="[(currentTime + 0.3 > sentence.start) ? highlightedTime : '']">
                {{ sentence.text + ' ' }}
              </span>
            </a>
          </div>
        </template>

        <template #date="{ item }">
          [{{ item.date }}]
        </template>
      </UTimeline>
    </div>
  </UCard>
</template>
