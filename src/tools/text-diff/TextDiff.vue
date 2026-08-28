<script setup lang="ts">
import { ref, computed } from 'vue'
import ToolLayout from '@/layouts/ToolLayout.vue'
import CodeEditor from '@/components/editor/CodeEditor.vue'
import { getLineDiff, getCharDiff } from './processor'

const left = ref('Hello World\nThis is DevBox\nVersion 1.0')
const right = ref('Hello World\nThis is DevBox Toolbox\nVersion 1.1')
const mode = ref<'lines'|'chars'>('lines')
const diff = computed(()=> mode.value === 'chars' ? getCharDiff(left.value, right.value) : getLineDiff(left.value, right.value))
</script>
<template>
  <ToolLayout>
    <div class="flex gap-2 mb-3">
      <span class="text-sm text-muted-foreground">模式:</span>
      <button @click="mode='lines'" :class="['text-xs px-3 py-1 rounded-full border', mode==='lines'?'bg-primary text-primary-foreground':'']">行级 Diff</button>
      <button @click="mode='chars'" :class="['text-xs px-3 py-1 rounded-full border', mode==='chars'?'bg-primary text-primary-foreground':'']">字符 Diff</button>
    </div>
    <div class="grid lg:grid-cols-2 gap-4">
      <div>
        <div class="text-sm font-medium mb-2">原文</div>
        <CodeEditor v-model="left" language="text" />
      </div>
      <div>
        <div class="text-sm font-medium mb-2">新版</div>
        <CodeEditor v-model="right" language="text" />
      </div>
    </div>
    <div class="mt-4 border rounded-lg overflow-hidden">
      <div class="px-3 py-2 bg-slate-50 dark:bg-slate-800 text-xs font-medium border-b">对比结果</div>
      <pre class="p-3 text-xs font-mono whitespace-pre-wrap break-all"><span v-for="(p,i) in diff" :key="i" :class="{ 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300': p.removed, 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300': p.added }">{{ p.value }}</span></pre>
    </div>
    <div class="mt-2 text-xs text-muted-foreground">红色为删除，绿色为新增，与 GitHub Diff 类似</div>
  </ToolLayout>
</template>
