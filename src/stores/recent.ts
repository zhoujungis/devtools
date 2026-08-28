import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { safeGet, safeSet } from '@/utils/storage'

export const useRecentStore = defineStore('recent', () => {
  const recent = ref<string[]>(safeGet<string[]>('recentTools', [], (value): value is string[] => Array.isArray(value) && value.every(item => typeof item === 'string')))
  watch(recent, v => safeSet('recentTools', v), { deep: true })
  function push(id: string) {
    recent.value = [id, ...recent.value.filter(x=>x!==id)].slice(0,20)
  }
  function clear(){ recent.value=[] }
  return { recent, push, clear }
})
