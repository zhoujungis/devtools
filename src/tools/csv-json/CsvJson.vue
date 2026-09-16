<script setup lang="ts">
import { ref, computed } from 'vue'
import ToolLayout from '@/layouts/ToolLayout.vue'
import { csvToJson, jsonToCsv, type CsvJsonResult } from './processor'
import { copyToClipboard } from '@/composables/useClipboard'
import { useToastStore } from '@/stores/toast'
import CodeEditor from '@/components/editor/CodeEditor.vue'

const toast = useToastStore()
const mode = ref<'csv2json' | 'json2csv'>('csv2json')
const csvInput = ref('name,age,active\nAlice,30,true\nBob,25,false')
const jsonInput = ref(JSON.stringify([
  { name: 'Alice', age: 30, active: true },
  { name: 'Bob', age: 25, active: false }
], null, 2))
const header = ref(true)
const delimiter = ref(',')

const result = computed<CsvJsonResult>(() => {
  try {
    return mode.value === 'csv2json'
      ? csvToJson(csvInput.value, { header: header.value, delimiter: delimiter.value })
      : jsonToCsv(jsonInput.value, { header: header.value, delimiter: delimiter.value })
  } catch (e: any) { return { ok: false, error: e.message } }
})
const output = computed(() => {
  if (!result.value.ok) return result.value.error || ''
  const d = result.value.data
  return mode.value === 'csv2json' ? JSON.stringify(d, null, 2) : String(d)
})
function swap() {
  if (!result.value.ok) return
  if (mode.value === 'csv2json') { jsonInput.value = output.value; mode.value = 'json2csv' }
  else { csvInput.value = output.value; mode.value = 'csv2json' }
}
</script>
<template>
  <ToolLayout>
    <div class="space-y-4">
      <div class="card p-4 flex flex-wrap items-center gap-2">
        <button @click="mode='csv2json'" :class="['btn-ghost', mode==='csv2json' && '!text-primary bg-primary/10']">CSV → JSON</button>
        <button @click="mode='json2csv'" :class="['btn-ghost', mode==='json2csv' && '!text-primary bg-primary/10']">JSON → CSV</button>
        <label class="flex items-center gap-2 text-sm text-muted-foreground ml-2">
          <input type="checkbox" v-model="header" class="accent-blue-600" /> 首行为表头
        </label>
        <label class="flex items-center gap-2 text-sm text-muted-foreground">
          分隔符 <input v-model="delimiter" maxlength="1" class="w-12 px-2 py-1 border rounded font-mono text-sm bg-white dark:bg-slate-900" />
        </label>
        <div class="flex-1"></div>
        <button @click="swap" class="btn-ghost border-border">结果 → 输入</button>
        <button @click="copyToClipboard(output)" class="btn-ghost border-border">复制</button>
      </div>

      <div class="grid lg:grid-cols-2 gap-4">
        <div>
          <div class="text-sm font-medium mb-2">{{ mode === 'csv2json' ? 'CSV 输入' : 'JSON 输入' }}</div>
          <CodeEditor :model-value="mode === 'csv2json' ? csvInput : jsonInput" language="text" @update:model-value="v => mode === 'csv2json' ? csvInput = v : jsonInput = v" />
        </div>
        <div>
          <div class="text-sm font-medium mb-2">{{ mode === 'csv2json' ? 'JSON 输出' : 'CSV 输出' }}</div>
          <pre v-if="result.ok" class="text-xs font-mono bg-slate-50 dark:bg-slate-800 border rounded-lg p-3 overflow-auto max-h-[420px] whitespace-pre">{{ output }}</pre>
          <div v-else class="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg text-sm text-red-600">{{ result.error }}</div>
        </div>
      </div>
      <p class="text-xs text-muted-foreground">自动类型推断：数字/true/false/null 会被转换为对应 JSON 类型；下载结果可用浏览器另存。</p>
    </div>
  </ToolLayout>
</template>
