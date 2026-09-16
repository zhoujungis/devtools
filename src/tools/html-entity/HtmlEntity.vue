<script setup lang="ts">
import { ref, computed } from 'vue'
import ToolLayout from '@/layouts/ToolLayout.vue'
import CodeEditor from '@/components/editor/CodeEditor.vue'
import { encodeHtmlEntities, decodeHtmlEntities } from './processor'
import { copyToClipboard } from '@/composables/useClipboard'

const mode = ref<'encode' | 'decode'>('encode')
const encodeAll = ref(false)
const input = ref('<div class="hello">你好 & 欢迎 © 2026</div>')

const output = computed(() => mode.value === 'encode' ? encodeHtmlEntities(input.value, encodeAll.value ? 'all' : 'basic') : decodeHtmlEntities(input.value))
</script>
<template>
  <ToolLayout>
    <div class="space-y-4">
      <div class="card p-4 flex flex-wrap items-center gap-2">
        <button @click="mode='encode'" :class="['btn-ghost', mode==='encode' && '!text-primary bg-primary/10']">编码</button>
        <button @click="mode='decode'" :class="['btn-ghost', mode==='decode' && '!text-primary bg-primary/10']">解码</button>
        <label v-if="mode==='encode'" class="flex items-center gap-2 text-sm text-muted-foreground ml-2">
          <input type="checkbox" v-model="encodeAll" class="accent-blue-600" /> 编码所有非 ASCII 字符
        </label>
        <div class="flex-1"></div>
        <button @click="copyToClipboard(output)" class="btn-ghost border-border">复制结果</button>
      </div>

      <div>
        <div class="text-sm font-medium mb-2">{{ mode === 'encode' ? '原文' : '实体文本' }}</div>
        <CodeEditor v-model="input" language="text" :placeholder="mode === 'encode' ? '<div>你好</div>' : '&lt;div&gt;&#20013;&lt;/div&gt;'" />
      </div>

      <div>
        <div class="text-sm font-medium mb-2">结果</div>
        <code class="block text-sm font-mono break-all bg-slate-50 dark:bg-slate-800 border px-3 py-2 rounded-lg min-h-[60px]">{{ output || '—' }}</code>
        <p class="text-xs text-muted-foreground mt-2">支持 &amp;#NNN; 十进制与 &amp;#xHHHH; 十六进制数字实体，以及常用命名实体。</p>
      </div>
    </div>
  </ToolLayout>
</template>
