<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <div class="flex flex-col h-full border border-border-warm bg-surface">
    <div class="px-4 pt-4 pb-3 sm:px-6 sm:pt-5 shrink-0 flex items-center justify-between border-b border-border-warm">
      <h2 class="text-sm font-semibold text-ink">{{ t('summarizationTitle') }}</h2>
      <span class="text-xs text-ink-faint font-mono">{{ t('comingSoon') }}</span>
    </div>
    <div class="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
      <div class="mb-4 text-ink-faint">
        <UIcon name="i-lucide-file-text" class="h-8 w-8" />
      </div>
      <p class="text-sm font-medium text-ink mb-1">{{ t('summaryTitle') }}</p>
      <p class="text-sm text-ink-muted max-w-xs">{{ t('summaryText') }}</p>
    </div>
  </div>
</template>
