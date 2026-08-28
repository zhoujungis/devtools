import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { safeGet, safeSet } from '@/utils/storage'

export const useFavoritesStore = defineStore('favorites', () => {
  const favorites = ref<string[]>(safeGet<string[]>('favorites', [], (value): value is string[] => Array.isArray(value) && value.every(item => typeof item === 'string')))
  watch(favorites, v => safeSet('favorites', v), { deep: true })
  function toggle(id: string) {
    if (favorites.value.includes(id)) favorites.value = favorites.value.filter(x => x!==id)
    else favorites.value.push(id)
  }
  function isFavorite(id: string) { return favorites.value.includes(id) }
  function clear() { favorites.value = [] }
  return { favorites, toggle, isFavorite, clear }
})
