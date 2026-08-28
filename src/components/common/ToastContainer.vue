<script setup lang="ts">
import { useToastStore } from '@/stores/toast'
const toast = useToastStore()
</script>
<template>
  <div class="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
    <transition-group name="toast">
      <div v-for="t in toast.toasts" :key="t.id"
           :role="t.type === 'error' ? 'alert' : 'status'"
           :aria-live="t.type === 'error' ? 'assertive' : 'polite'"
           class="pointer-events-auto px-4 py-3 rounded-lg shadow-lg text-sm font-medium flex items-center gap-2 min-w-[200px] max-w-sm"
           :class="{
             'bg-green-600 text-white': t.type==='success',
             'bg-red-600 text-white': t.type==='error',
             'bg-amber-500 text-white': t.type==='warning',
             'bg-slate-800 text-white dark:bg-slate-700': t.type==='info'
           }">
        <span>{{ t.message }}</span>
        <button class="ml-auto opacity-70 hover:opacity-100" aria-label="关闭提示" title="关闭提示" @click="toast.dismiss(t.id)">✕</button>
      </div>
    </transition-group>
  </div>
</template>
<style scoped>
.toast-move, .toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from { opacity:0; transform: translateY(10px) scale(0.95); }
.toast-leave-to { opacity:0; transform: translateY(-10px) scale(0.95); }
</style>
