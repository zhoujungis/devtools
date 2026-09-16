<script setup lang="ts">
import { ref, computed } from 'vue'
import ToolLayout from '@/layouts/ToolLayout.vue'
import CodeEditor from '@/components/editor/CodeEditor.vue'
import { charStats } from './processor'
import { copyToClipboard } from '@/composables/useClipboard'

const input = ref(`DevBox 是程序员的在线工具箱。
所有工具均在浏览器本地运行，无需登录。
Built with Vue 3, Vite and Tailwind CSS.`)

const s = computed(() => charStats(input.value))
const items = computed(() => [
  { label: '字符数', value: s.value.chars },
  { label: '字符（不含空格）', value: s.value.charsNoSpaces },
  { label: '词数（中文字+英文词）', value: s.value.words },
  { label: '行数', value: s.value.lines },
  { label: '句子数', value: s.value.sentences },
  { label: '段落数', value: s.value.paragraphs },
  { label: '中文字符', value: s.value.cjkChars },
  { label: '英文字母', value: s.value.asciiChars },
  { label: '数字', value: s.value.digits },
  { label: '预计阅读', value: `${s.value.readingMinutes} 分钟` }
])
</script>
<template>
  <ToolLayout>
    <div class="space-y-4">
      <div>
        <div class="text-sm font-medium mb-2 flex items-center justify-between">
          <span>文本</span>
          <button @click="copyToClipboard(input)" class="text-xs text-muted-foreground hover:text-primary">复制文本</button>
        </div>
        <CodeEditor v-model="input" language="text" placeholder="输入或粘贴文本..." />
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div v-for="it in items" :key="it.label" class="card p-3 text-center">
          <div class="text-2xl font-bold text-gradient">{{ it.value }}</div>
          <div class="text-xs text-muted-foreground mt-1">{{ it.label }}</div>
        </div>
      </div>

      <div v-if="s.topChars.length" class="card p-4">
        <div class="text-sm font-medium mb-3">字符频率 Top 10</div>
        <div class="space-y-1.5">
          <div v-for="t in s.topChars" :key="t.char" class="flex items-center gap-3 text-xs">
            <code class="w-10 text-center bg-slate-100 dark:bg-slate-800 rounded px-1 py-0.5">{{ t.char === ' ' ? '␣' : t.char }}</code>
            <div class="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div class="h-full brand-gradient rounded-full" :style="{ width: (t.count / s.topChars[0].count * 100) + '%' }"></div>
            </div>
            <span class="w-10 text-right font-mono text-muted-foreground">{{ t.count }}</span>
          </div>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>
