<script setup lang="ts">
import { ref, computed, watch, nextTick, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { searchTools } from '@/data/tools'
import { getCategoryById } from '@/data/categories'
import { Search } from 'lucide-vue-next'
import ToolIcon from '@/components/common/ToolIcon.vue'

function softColor(category:string){ return getCategoryById(category)?.color.soft || 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300' }
function categoryZh(category:string){ return getCategoryById(category)?.nameZh || category }

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ (e:'close'):void }>()
const router = useRouter()
const query = ref('')
const inputRef = ref<HTMLInputElement>()
const dialogRef = ref<HTMLElement>()
let restoreFocus: HTMLElement | null = null
const selected = ref(0)

const results = computed(() => searchTools(query.value).slice(0,12))

watch(() => props.open, async v => {
  document.body.classList.toggle('overflow-hidden', v)
  if(v){ restoreFocus = document.activeElement as HTMLElement | null; query.value=''; selected.value=0; await nextTick(); inputRef.value?.focus() }
  else restoreFocus?.focus()
})
onBeforeUnmount(() => {
  document.body.classList.remove('overflow-hidden')
  restoreFocus?.focus()
})
watch(results, value => { selected.value = Math.min(selected.value, Math.max(0, value.length - 1)) })

function close(){ emit('close') }
function go(path:string){ close(); router.push(path) }
function onKey(e:KeyboardEvent){
  if(e.key==='ArrowDown'){ e.preventDefault(); selected.value=Math.min(selected.value+1, results.value.length-1) }
  else if(e.key==='ArrowUp'){ e.preventDefault(); selected.value=Math.max(0, selected.value-1) }
  else if(e.key==='Enter'){ const t=results.value[selected.value]; if(t) go(t.path) }
  else if(e.key==='Escape'){ close() }
  else if(e.key==='Tab') {
    const focusables = [...(dialogRef.value?.querySelectorAll<HTMLElement>('button, input') ?? [])].filter(el => !el.hasAttribute('disabled'))
    if (focusables.length) {
      const index = focusables.indexOf(document.activeElement as HTMLElement)
      const next = focusables[(index + (e.shiftKey ? -1 : 1) + focusables.length) % focusables.length]
      e.preventDefault(); next.focus()
    }
  }
}
</script>
<template>
  <div v-if="open" class="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] p-4" @keydown="onKey">
    <transition name="modal-fade" appear>
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="close"></div>
    </transition>
    <transition name="modal-scale" appear>
    <div ref="dialogRef" role="dialog" aria-modal="true" aria-labelledby="search-dialog-title" class="relative w-full max-w-[640px] bg-white dark:bg-slate-900 rounded-xl shadow-2xl overflow-hidden border animate-scale-in">
      <div class="flex items-center gap-3 px-4 py-3 border-b">
        <Search class="w-5 h-5 text-muted-foreground" />
        <span id="search-dialog-title" class="sr-only">搜索工具</span>
        <input ref="inputRef" v-model="query" role="combobox" aria-controls="search-results" :aria-activedescendant="results[selected]?.id ? `search-${results[selected].id}` : undefined" aria-autocomplete="list" placeholder="搜索工具... 例如 json, base64, jwt" class="flex-1 bg-transparent outline-none text-sm" />
        <kbd>ESC</kbd>
      </div>
      <div id="search-results" role="listbox" class="max-h-[50vh] overflow-auto p-2">
        <div v-if="results.length===0" class="text-center text-sm text-muted-foreground py-8">未找到工具</div>
        <button v-for="(t,i) in results" :key="t.id" @click="go(t.path)" :id="`search-${t.id}`" role="option" :aria-selected="i===selected"
            class="relative w-full text-left px-3 py-3 rounded-lg flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800"
            :class="{ 'bg-slate-100 dark:bg-slate-800': i===selected }">
          <span v-if="i===selected" class="absolute left-0 top-2 bottom-2 w-[3px] rounded-full brand-gradient"></span>
          <div class="icon-chip w-9 h-9" :class="softColor(t.category)"><ToolIcon :name="t.icon" class="w-4 h-4" /></div>
          <div class="flex-1 min-w-0">
            <div class="text-sm font-medium">{{ t.nameZh }} <span class="text-xs text-muted-foreground">{{ t.name }}</span></div>
            <div class="text-xs text-muted-foreground truncate">{{ t.description }}</div>
          </div>
          <span class="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full shrink-0">{{ categoryZh(t.category) }}</span>
        </button>
      </div>
      <div class="px-4 py-2 text-xs text-muted-foreground border-t flex gap-4">
        <span><kbd class="mr-1">↑</kbd><kbd class="mr-1">↓</kbd>选择</span><span><kbd class="mr-1">↵</kbd>进入</span><span><kbd class="mr-1">ESC</kbd>关闭</span>
      </div>
    </div>
    </transition>
  </div>
</template>
<style scoped>
.modal-fade-enter-active { transition: opacity 0.18s ease; }
.modal-fade-enter-from { opacity: 0; }
.modal-scale-enter-active { transition: opacity 0.18s ease, transform 0.18s ease; }
.modal-scale-enter-from { opacity: 0; transform: scale(0.96) translateY(-8px); }
</style>
