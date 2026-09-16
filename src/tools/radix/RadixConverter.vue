<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import ToolLayout from '@/layouts/ToolLayout.vue'
import { convertBase, parseAuto, parseToDecimal } from './processor'
import { copyToClipboard } from '@/composables/useClipboard'

const input = ref('255')
const fromBase = ref(10)
const bases = [2, 8, 10, 16, 32, 36]
const results = ref<Record<number, string>>({})

const parsed = computed(() => parseAuto(input.value))
const decimal = computed(() => parseToDecimal(input.value, fromBase.value))

function refresh() {
  const dec = decimal.value
  results.value = {}
  if (dec === null) return
  bases.forEach(b => { results.value[b] = convertBase(input.value, fromBase.value, b) })
}
watch([input, fromBase], refresh, { immediate: true })
</script>
<template>
  <ToolLayout>
    <div class="space-y-4">
      <div class="card p-4">
        <div class="flex flex-wrap items-center gap-3">
          <label class="text-sm flex items-center gap-2">
            <span class="text-muted-foreground">输入进制</span>
            <select v-model.number="fromBase" class="px-3 py-2 rounded-lg border text-sm bg-white dark:bg-slate-900">
              <option v-for="b in bases" :key="b" :value="b">{{ b }} 进制</option>
            </select>
          </label>
          <input v-model="input" class="flex-1 min-w-[240px] px-3 py-2 rounded-lg border font-mono text-sm bg-white dark:bg-slate-900" placeholder="输入数值，如 ff、255、0b1010" />
          <span v-if="parsed" class="text-xs text-muted-foreground">自动识别为 {{ parsed.base }} 进制</span>
        </div>
        <p v-if="decimal === null && input.trim()" class="mt-2 text-xs text-red-500">当前输入不是 {{ fromBase }} 进制的合法数字</p>
      </div>

      <div class="card divide-y">
        <div v-for="b in bases.filter(b => b !== fromBase)" :key="b" class="flex items-center gap-3 px-4 py-3">
          <span class="w-20 text-xs font-mono font-medium text-muted-foreground">{{ b }} 进制</span>
          <code class="flex-1 text-xs font-mono break-all bg-slate-50 dark:bg-slate-800 px-2 py-1.5 rounded">{{ results[b] || '—' }}</code>
          <button @click="copyToClipboard(results[b] || '')" class="text-xs border px-2 py-1 rounded hover:bg-slate-50 dark:hover:bg-slate-800">复制</button>
        </div>
      </div>

      <p class="text-xs text-muted-foreground">支持 2–36 进制与大整数（超出 Number.MAX_SAFE_INTEGER 也可精确转换），支持 0x / 0o / 0b 前缀自动识别。</p>
    </div>
  </ToolLayout>
</template>
