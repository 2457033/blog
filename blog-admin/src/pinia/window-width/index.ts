import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useWindow = defineStore('useWindow', () => {
  const screenWidth = ref(window.innerWidth)
  const scrollHeight = ref(window.innerHeight)

  function updateWidth(value: number) {
    screenWidth.value = value
  }

  function updateHeight(value: number) {
    scrollHeight.value = value
  }

  return { screenWidth, updateWidth, scrollHeight, updateHeight }
})
