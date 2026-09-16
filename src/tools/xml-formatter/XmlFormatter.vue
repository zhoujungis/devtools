<script setup lang="ts">
import { ref, computed } from 'vue'
import ToolLayout from '@/layouts/ToolLayout.vue'
import CodeEditor from '@/components/editor/CodeEditor.vue'
import { formatXml, xmlToJson, type XmlFormatResult } from './processor'
import { copyToClipboard } from '@/composables/useClipboard'
import { downloadText } from '@/utils/download'

const input = ref('<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel><title>DevBox</title><item><title>工具箱</title><link>https://example.com</link></item></channel></rss>')
const indent = ref(2)
const removeAttrs = ref(false)
const mode = ref<'format' | 'json'>('format')

const result = computed<XmlFormatResult>(() => {
  try {
    return mode.value === 'format'
      ? formatXml(input.value, { indentSize: indent.value, removeAttributes: removeAttrs.value })
      : xmlToJson(input.value)
  } catch (e: any) { return { ok: false, error: e.message } }
})
</script>
<template>
  <ToolLayout>
    <div class="space-y-4">
      <div class="card p-4 flex flex-wrap items-center gap-3">
        <button @click="mode='format'" :class="['btn-ghost', mode==='format' && '!text-primary bg-primary/10']">格式化</button>
        <button @click="mode='json'" :class="['btn-ghost', mode==='json' && '!text-primary bg-primary/10']">转 JSON</button>
        <label v-if="mode==='format'" class="flex items-center gap-2 text-sm text-muted-foreground">
          缩进
          <select v-model.number="indent" class="px-2 py-1 rounded-lg border bg-white dark:bg-slate-900 text-sm">
            <option :value="2">2 空格</option><option :value="4">4 空格</option>
          </select>
        </label>
        <label v-if="mode==='format'" class="flex items-center gap-2 text-sm text-muted-foreground">
          <input type="checkbox" v-model="removeAttrs" class="accent-blue-600" /> 移除属性
        </label>
        <div class="flex-1"></div>
        <button v-if="result.ok" @click="copyToClipboard(result.output!)" class="btn-ghost border-border">复制</button>
        <button v-if="result.ok" @click="downloadText(mode==='json' ? 'output.json' : 'formatted.xml', result.output!)" class="btn-primary">下载</button>
      </div>

      <div class="grid lg:grid-cols-2 gap-4">
        <div>
          <div class="text-sm font-medium mb-2">XML 输入</div>
          <CodeEditor v-model="input" language="xml" />
        </div>
        <div>
          <div class="text-sm font-medium mb-2">{{ mode === 'json' ? 'JSON 输出' : '格式化输出' }}</div>
          <pre v-if="result.ok" class="text-xs font-mono bg-slate-50 dark:bg-slate-800 border rounded-lg p-3 overflow-auto max-h-[480px] whitespace-pre">{{ result.output }}</pre>
          <div v-else class="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg text-sm text-red-600">{{ result.error }}</div>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>
