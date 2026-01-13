<script setup lang="ts">
import { useTemplateRef, ref } from 'vue'
import test from '../../../assets/data'

interface Word {
  word: string
  start: number
}

interface Segment {
  start: number
  words: Array<Word>
}

interface DataValue {
  segments: Array<Segment>
}

const media = useTemplateRef<HTMLAudioElement>('audio')
const data = ref<DataValue | null>(test)
const currentTime = ref(0)

function moveTo(time: number) {
  if(!media?.value) return;
  media.value.currentTime = time
}
const getSeconds = (seconds: number) => {
  return Math.round(seconds % 60).toString().padStart(2, '0');
}
const getMinutes = (seconds: number) => {
  return Math.floor(seconds / 60).toString().padStart(2, '0');
}

function onTextClick(time: number) {
  moveTo(time);
  media.value?.play();
}

function updateCurrentTime() {
  if(!media?.value) return;
  currentTime.value = media.value.currentTime;
}
</script>

<template>
  <div class="items-center justify-center w-screen h-screen">
    <audio ref="audio" controls @timeupdate="updateCurrentTime">
      <source src="https://github.com/Azure-Samples/cognitive-services-speech-sdk/raw/master/scenarios/call-center/sampledata/Call6_mono_16k_az_apply_loan.wav" >
    </audio>
    <div v-for="segment in data?.segments" :key="segment.start">
      <a @click.prevent="onTextClick(segment.start)">[{{ getMinutes(segment.start) }}:{{ getSeconds(segment.start) }}]</a> 
      <a v-for="word in segment.words" :key="word.word" class="cursor-pointer" @click.prevent="moveTo(word.start)" >
        <b v-if="currentTime + 0.3 > word.start">
          {{ word.word + " " }}
        </b>
        <span v-else>
          {{ word.word + " " }}
        </span>
      </a>
    </div>
  </div>
</template>