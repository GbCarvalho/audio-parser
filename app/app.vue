<script setup lang="ts">
import { useTemplateRef } from 'vue'

const media = useTemplateRef('audio')

const moveTo = (time) => {
  media.value.currentTime = time
}

const data = await import('@/assets/data.json');

const getSeconds = (seconds: number) => {
  return Math.round(seconds % 60).toString().padStart(2, '0');
}
const getMinutes = (seconds: number) => {
  return Math.floor(seconds / 60).toString().padStart(2, '0');
}
</script>

<template>
  <div class="items-center justify-center w-screen h-screen">
    <audio ref="audio" controls>
      <source src="https://github.com/Azure-Samples/cognitive-services-speech-sdk/raw/master/scenarios/call-center/sampledata/Call6_mono_16k_az_apply_loan.wav"/>
    </audio>
    <div v-for="segment in data.segments" :key="segment.start">
      <a @click.prevent="moveTo(segment.start)">[{{ getMinutes(segment.start) }}:{{ getSeconds(segment.start) }}]</a> <a class="cursor-pointer" v-for="word in segment.words" :key="word.word" @click.prevent="moveTo(word.start)" >{{ word.word + " " }}</a>
    </div>
  </div>
</template>
