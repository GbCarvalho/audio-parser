<script setup lang="ts">
const { t } = useI18n()

const summaryItems = computed(() => [
  { title: t('summaryTitle'), text: t('summaryText') },
  { title: t('keyPointsTitle'), text: t('keyPointsText') },
])
</script>

<template>
  <UCard :ui="{ body: 'p-4 sm:p-6' }">
    <div class="mb-4 flex items-center justify-between">
      <h2 class="text-base font-semibold text-gray-800">{{ t('summarizationTitle') }}</h2>
      <span class="text-xs text-gray-400">{{ t('comingSoon') }}</span>
    </div>
    <div class="space-y-4">
      <div
        v-for="item in summaryItems"
        :key="item.title"
        class="rounded-xl border border-dashed border-gray-200 bg-gray-50/60 p-4 text-sm text-gray-600"
      >
        <div class="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
          {{ item.title }}
        </div>
        <p>{{ item.text }}</p>
      </div>
    </div>
  </UCard>
</template>
