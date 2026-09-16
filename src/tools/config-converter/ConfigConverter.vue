<script setup lang="ts">
import { ref, computed } from 'vue'
import ToolLayout from '@/layouts/ToolLayout.vue'
import CodeEditor from '@/components/editor/CodeEditor.vue'
import { convertConfig, type ConfigFormat } from './processor'
import { copyToClipboard } from '@/composables/useClipboard'
import { downloadText } from '@/utils/download'

const input = ref(`server:\n  host: 0.0.0.0\n  port: 8080\ntags:\n  - web\n  - api\ndebug: true\n`)
const from = ref<ConfigFormat>('yaml')
const to = ref<ConfigFormat>('json')
const formats: { key: ConfigFormat; label: string }[] = [
  { key: 'json', label: 'JSON' }, { key: 'yaml', label: 'YAML' }, { key: 'toml', label: 'TOML' }
]

const result = computed(() => convertConfig(input.value, from.value, to.value))
function swap() {
  if (!result.value.ok) return
  input.value = result.value.output!
  const f = from.value; from.value = to.value; to.value = f
}
</script>
<template>
  <ToolLayout>
    <div class="space-y-4">
      <div class="card p-4 flex flex-wrap items-center gap-2">
        <select v-model="from" class="px-3 py-2 rounded-lg border text-sm bg-white dark:bg-slate-900">
          <option v-for="f in formats" :key="f.key" :value="f.key">{{ f.label }}</option>
        </select>
        <span class="text-muted-foreground text-sm">→</span>
        <select v-model="to" class="px-3 py-2 rounded-lg border text-sm bg-white dark:bg-slate-900">
          <option v-for="f in formats" :key="f.key" :value="f.key">{{ f.label }}</option>
        </select>
        <div class="flex-1"></div>
        <button @click="swap" class="btn-ghost border-border">结果 → 输入</button>
        <button v-if="result.ok" @click="copyToClipboard(result.output!)" class="btn-ghost border-border">复制</button>
        <button v-if="result.ok" @click="downloadText(`config.${to}`, result.output!)" class="btn-primary">下载</button>
      </div>

      <div class="grid lg:grid-cols-2 gap-4">
        <div>
          <div class="text-sm font-medium mb-2">输入 ({{ formats.find(f=>f.key===from)?.label }})</div>
          <CodeEditor v-model="input" language="text" />
        </div>
        <div>
          <div class="text-sm font-medium mb-2">输出 ({{ formats.find(f=>f.key===to)?.label }})</div>
          <pre v-if="result.ok" class="text-xs font-mono bg-slate-50 dark:bg-slate-800 border rounded-lg p-3 overflow-auto max-h-[480px] whitespace-pre">{{ result.output }}</pre>
          <div v-else class="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg text-sm text-red-600">{{ result.error }}</div>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>
