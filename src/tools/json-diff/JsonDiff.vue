<script setup lang="ts">
import { ref, computed } from 'vue'
import ToolLayout from '@/layouts/ToolLayout.vue'
import CodeEditor from '@/components/editor/CodeEditor.vue'
import { jsonDiff } from './processor'
import { diffLines } from 'diff'

const left = ref('{\n  "name": "DevBox",\n  "version": "1.0.0"\n}')
const right = ref('{\n  "name": "DevBox",\n  "version": "1.1.0",\n  "author": "AI"\n}')
const result = computed(()=> jsonDiff(left.value, right.value))
const lineDiff = computed(()=>{
  if(!result.value.aFormatted || !result.value.bFormatted) return []
  return diffLines(result.value.aFormatted, result.value.bFormatted)
})
</script>
<template>
  <ToolLayout>
    <div class="grid lg:grid-cols-2 gap-4">
      <div>
        <div class="text-sm font-medium mb-2">JSON A</div>
        <CodeEditor v-model="left" language="json" />
      </div>
      <div>
        <div class="text-sm font-medium mb-2">JSON B</div>
        <CodeEditor v-model="right" language="json" />
      </div>
    </div>

    <div class="mt-4 p-3 rounded-lg text-sm" :class="result.equal ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 text-green-700 dark:text-green-300' : 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 text-amber-700 dark:text-amber-300'">
      <span v-if="result.error">❌ {{ result.error }}</span>
      <span v-else-if="result.equal">✓ 两个 JSON 完全相同</span>
      <span v-else>⚠️ 两个 JSON 存在差异</span>
    </div>

    <div v-if="lineDiff.length" class="mt-4 border rounded-lg overflow-hidden">
      <div class="text-xs font-medium px-3 py-2 bg-slate-50 dark:bg-slate-900 border-b">差异对比 (绿色新增 / 红色删除)</div>
      <pre class="p-3 text-xs font-mono overflow-auto max-h-[400px]"><span v-for="(part,i) in lineDiff" :key="i" :class="{ 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300': part.added, 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300': part.removed }">{{ part.value }}</span></pre>
    </div>
  </ToolLayout>
</template>
