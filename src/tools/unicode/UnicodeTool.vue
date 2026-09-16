<script setup lang="ts">
import { ref, computed } from 'vue'
import ToolLayout from '@/layouts/ToolLayout.vue'
import CodeEditor from '@/components/editor/CodeEditor.vue'
import { charToCodepoints, decodeEscape, codepointInfo } from './processor'
import { copyToClipboard } from '@/composables/useClipboard'

const input = ref('Hello DevBox 中文 😀')
const decodeInput = ref('&#20013;&#x1F600; \\u{48}ello')

const formats = [
  { key: 'U+', label: 'U+ 码点' },
  { key: 'unicode', label: '\\u{...}' },
  { key: 'html', label: 'HTML 实体' },
  { key: 'decimal', label: '十进制' },
  { key: 'hex', label: '十六进制' },
] as const
type FmtKey = typeof formats[number]['key']
const format = ref<FmtKey>('U+')

const encoded = computed(() => charToCodepoints(input.value, format.value as any))
const decoded = computed(() => { try { return decodeEscape(decodeInput.value) } catch { return '（含非法转义）' } })
const chars = computed(() => Array.from(input.value).slice(0, 12))
</script>
<template>
  <ToolLayout>
    <div class="space-y-4">
      <div>
        <div class="text-sm font-medium mb-2">字符 → 码点</div>
        <CodeEditor v-model="input" language="text" placeholder="输入任意文本（支持 Emoji）" />
        <div class="mt-2 flex flex-wrap gap-2">
          <button v-for="f in formats" :key="f.key" @click="format=f.key" :class="['btn-ghost text-xs', format===f.key && '!text-primary bg-primary/10']">{{ f.label }}</button>
          <div class="flex-1"></div>
          <button @click="copyToClipboard(encoded)" class="btn-ghost border-border text-xs">复制结果</button>
        </div>
        <code class="block mt-2 text-xs font-mono break-all bg-slate-50 dark:bg-slate-800 border px-3 py-2 rounded-lg">{{ encoded }}</code>
      </div>

      <div class="card p-4 overflow-x-auto" v-if="chars.length">
        <table class="w-full text-xs">
          <thead><tr class="text-muted-foreground text-left">
            <th class="py-1.5 pr-4 font-medium">字符</th><th class="py-1.5 pr-4 font-medium">码点</th>
            <th class="py-1.5 pr-4 font-medium">十进制</th><th class="py-1.5 pr-4 font-medium">UTF-8</th>
            <th class="py-1.5 pr-4 font-medium">UTF-16</th><th class="py-1.5 font-medium">区块</th>
          </tr></thead>
          <tbody class="font-mono">
            <tr v-for="(ch,i) in chars" :key="i" class="border-t border-border/50">
              <td class="py-1.5 pr-4 text-base">{{ ch }}</td>
              <td class="py-1.5 pr-4">{{ codepointInfo(ch).cp }}</td>
              <td class="py-1.5 pr-4">{{ codepointInfo(ch).decimal }}</td>
              <td class="py-1.5 pr-4">{{ codepointInfo(ch).utf8 }}</td>
              <td class="py-1.5 pr-4">{{ codepointInfo(ch).utf16 }}</td>
              <td class="py-1.5">{{ codepointInfo(ch).block }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div>
        <div class="text-sm font-medium mb-2">转义 → 字符</div>
        <CodeEditor v-model="decodeInput" language="text" placeholder="&#20013; \u{4e2d} \u4e2d %u4e2d" />
        <code class="block mt-2 text-sm font-mono break-all bg-slate-50 dark:bg-slate-800 border px-3 py-2 rounded-lg">{{ decoded }}</code>
        <p class="text-xs text-muted-foreground mt-2">支持 \u{...}、\uXXXX、&#NNN;、&#xHH;、%uXXXX 五种格式</p>
      </div>
    </div>
  </ToolLayout>
</template>
