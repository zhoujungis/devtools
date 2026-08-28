import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
  const storedTheme = typeof window !== 'undefined' ? window.localStorage.getItem('theme') : null
  const theme = ref<'light'|'dark'|'system'>(storedTheme === 'light' || storedTheme === 'dark' || storedTheme === 'system' ? storedTheme : 'system')
  function applyTheme() {
    if (typeof window === 'undefined') return
    const isDark = theme.value === 'dark' || (theme.value === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    document.documentElement.classList.toggle('dark', isDark)
    window.localStorage.setItem('theme', theme.value)
  }
  watch(theme, applyTheme, { immediate: true })
  if (typeof window !== 'undefined') {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => { if (theme.value==='system') applyTheme() })
  }
  function setTheme(t: 'light'|'dark'|'system') { theme.value = t }
  function toggleTheme() { theme.value = document.documentElement.classList.contains('dark') ? 'light' : 'dark' }
  return { theme, setTheme, toggleTheme, applyTheme }
})
