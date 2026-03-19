<script setup lang="ts">
const summaryItems = [
  { title: 'Resumo', text: 'Resumo automático aparecerá aqui.' },
  { title: 'Pontos-chave', text: 'Principais tópicos destacados do áudio.' }
]
</script>

<template>
  <UCard :ui="{ body: 'p-4 sm:p-6' }">
    <div class="mb-4 flex items-center justify-between">
      <h2 class="text-base font-semibold text-gray-800">Sumarização</h2>
      <span class="text-xs text-gray-400">Em breve</span>
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
