<script setup lang="ts">
import { ref, computed } from 'vue'
import ToolLayout from '@/layouts/ToolLayout.vue'
import CodeEditor from '@/components/editor/CodeEditor.vue'
import { copyToClipboard } from '@/composables/useClipboard'
import { downloadText } from '@/utils/download'
import { useToastStore } from '@/stores/toast'

const toast = useToastStore()
const input = ref(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#2563eb"/><stop offset="1" stop-color="#7c3aed"/>
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="14" fill="url(#g)"/>
  <text x="32" y="42" font-family="sans-serif" font-size="32" font-weight="bold" fill="#fff" text-anchor="middle">D</text>
</svg>`)

const width = ref(240)
const bgColor = ref('#ffffff')
const dataUrl = ref('')

function render() {
  try {
    const blob = new Blob([input.value], { type: 'image/svg+xml' })
    dataUrl.value = URL.createObjectURL(blob)
  } catch {
    toast.show('SVG 解析失败', 'error')
  }
}
render()

function optimize() {
  let s = input.value
  const before = s.length
  s = s.replace(/<!--[\s\S]*?-->/g, '')
  s = s.replace(/>\s+</g, '><')
  s = s.replace(/\s{2,}/g, ' ')
  s = s.trim()
  input.value = s
  toast.show(`已清理空白与注释，${before} → ${s.length} 字符`, 'success')
  setTimeout(render, 0)
}

const stats = computed(() => ({ chars: input.value.length, kb: (new Blob([input.value]).size / 1024).toFixed(2) }))
</script>
<template>
  <ToolLayout>
    <div class="space-y-4">
      <div class="card p-4 flex flex-wrap items-center gap-3">
        <label class="flex items-center gap-2 text-sm">
          <span class="text-muted-foreground">预览宽度</span>
          <input type="range" min="80" max="480" v-model.number="width" class="w-32 accent-blue-600" />
          <span class="font-mono text-xs w-12">{{ width }}px</span>
        </label>
        <label class="flex items-center gap-2 text-sm">
          <span class="text-muted-foreground">背景</span>
          <input type="color" v-model="bgColor" class="w-9 h-7 rounded border cursor-pointer" />
        </label>
        <div class="flex-1"></div>
        <span class="text-xs text-muted-foreground">{{ stats.chars }} 字符 · {{ stats.kb }} KB</span>
        <button @click="optimize" class="btn-ghost border-border">清理优化</button>
        <button @click="copyToClipboard(input)" class="btn-ghost border-border">复制</button>
        <button @click="downloadText('image.svg', input, 'image/svg+xml')" class="btn-primary">下载 .svg</button>
      </div>

      <div class="grid lg:grid-cols-2 gap-4">
        <div>
          <div class="text-sm font-medium mb-2">SVG 源码</div>
          <CodeEditor v-model="input" language="html" @update:model-value="render" />
        </div>
        <div>
          <div class="text-sm font-medium mb-2">预览</div>
          <div class="card p-4 flex items-center justify-center min-h-[320px]">
            <img v-if="dataUrl" :src="dataUrl" :style="{ width: width + 'px', background: bgColor }" alt="SVG 预览"
                 class="rounded-lg border" @error="toast.show('SVG 无法渲染：请检查语法', 'error')" />
            <span v-else class="text-xs text-muted-foreground">无有效内容</span>
          </div>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>
