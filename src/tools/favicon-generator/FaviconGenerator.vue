<script setup lang="ts">
import { ref, watch } from 'vue'
import ToolLayout from '@/layouts/ToolLayout.vue'
import { RefreshCw } from 'lucide-vue-next'

const text = ref('D')
const bg = ref('#2563eb')
const fg = ref('#ffffff')
const shape = ref<'rounded' | 'circle' | 'square'>('rounded')

const canvas = ref<HTMLCanvasElement>()

function draw() {
  const c = canvas.value
  if (!c) return
  const ctx = c.getContext('2d')!
  const S = 512
  c.width = S; c.height = S
  ctx.clearRect(0, 0, S, S)
  // background shape
  ctx.fillStyle = bg.value
  const r = shape.value === 'rounded' ? S * 0.22 : 0
  ctx.beginPath()
  if (shape.value === 'circle') {
    ctx.arc(S / 2, S / 2, S / 2, 0, Math.PI * 2)
  } else if (r > 0) {
    ctx.roundRect(0, 0, S, S, r)
  } else {
    ctx.rect(0, 0, S, S)
  }
  ctx.fill()
  // letter
  ctx.fillStyle = fg.value
  ctx.font = `bold ${Math.floor(S * 0.6)}px Inter, system-ui, sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text.value.slice(0, 2) || 'A', S / 2, S / 2 + S * 0.03)
}

watch([text, bg, fg, shape], draw, { immediate: true })

function download(size: number) {
  const c = canvas.value
  if (!c) return
  c.toBlob(blob => {
    if (!blob) return
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `icon-${size}x${size}.png`
    a.click()
    URL.revokeObjectURL(a.href)
  }, 'image/png')
}
function downloadAll() {
  ;[192, 512].forEach((s, i) => setTimeout(() => download(s), i * 300))
}
function faviconHtml() {
  return `<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">\n<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">\n<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">`
}
</script>
<template>
  <ToolLayout>
    <div class="space-y-4">
      <div class="grid lg:grid-cols-2 gap-4">
        <div class="card p-4 space-y-3">
          <label class="block text-sm">
            <span class="text-muted-foreground">字母 / 文字（最多 2 字符）</span>
            <input v-model="text" maxlength="2" class="mt-1 w-full px-3 py-2 rounded-lg border text-lg font-bold bg-white dark:bg-slate-900" />
          </label>
          <div class="flex gap-4">
            <label class="flex items-center gap-2 text-sm">
              <span class="text-muted-foreground">背景</span>
              <input type="color" v-model="bg" class="w-10 h-8 rounded border cursor-pointer" />
            </label>
            <label class="flex items-center gap-2 text-sm">
              <span class="text-muted-foreground">文字</span>
              <input type="color" v-model="fg" class="w-10 h-8 rounded border cursor-pointer" />
            </label>
            <div class="flex items-center gap-1">
              <button v-for="s in (['rounded','circle','square'] as const)" :key="s" @click="shape=s" :class="['btn-ghost text-xs', shape===s && '!text-primary bg-primary/10']">
                {{ s === 'rounded' ? '圆角' : s === 'circle' ? '圆形' : '方形' }}
              </button>
            </div>
            <button @click="() => { bg = '#' + Math.floor(Math.random()*0xffffff).toString(16).padStart(6,'0') }" class="btn-ghost ml-auto" title="随机背景色"><RefreshCw class="w-4 h-4" /></button>
          </div>
        </div>

        <div class="card p-6 flex flex-col items-center gap-4">
          <canvas ref="canvas" class="w-40 h-40 shadow-soft rounded-2xl"></canvas>
          <div class="flex flex-wrap gap-2 justify-center">
            <button @click="download(16)" class="btn-ghost border-border text-xs">16px</button>
            <button @click="download(32)" class="btn-ghost border-border text-xs">32px</button>
            <button @click="download(180)" class="btn-ghost border-border text-xs">180px</button>
            <button @click="download(192)" class="btn-ghost border-border text-xs">192px</button>
            <button @click="download(512)" class="btn-ghost border-border text-xs">512px</button>
            <button @click="downloadAll" class="btn-primary text-xs">下载 PWA 套图</button>
          </div>
        </div>
      </div>

      <div class="card p-4">
        <div class="text-sm font-medium mb-2">HTML 引用片段</div>
        <pre class="text-xs font-mono bg-slate-50 dark:bg-slate-800 border rounded-lg p-3 overflow-x-auto">{{ faviconHtml() }}</pre>
        <p class="text-xs text-muted-foreground mt-2">PNG 由 canvas 在本地绘制生成，透明外区（圆形）保留透明通道。</p>
      </div>
    </div>
  </ToolLayout>
</template>
