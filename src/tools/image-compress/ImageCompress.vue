<script setup lang="ts">
import { ref } from 'vue'
import ToolLayout from '@/layouts/ToolLayout.vue'
import { useToastStore } from '@/stores/toast'
import { UploadCloud, X } from 'lucide-vue-next'

const toast = useToastStore()
const file = ref<File | null>(null)
const originalUrl = ref('')
const compressedUrl = ref('')
const originalSize = ref(0)
const compressedSize = ref(0)
const quality = ref(70)
const maxWidth = ref(1920)
const format = ref<'image/jpeg' | 'image/webp'>('image/webp')
const busy = ref(false)
const dragging = ref(false)
const fileInput = ref<HTMLInputElement>()
const imgEl = ref<HTMLImageElement>()

async function loadFile(f: File) {
  if (!f.type.startsWith('image/')) { toast.show('请选择图片文件', 'error'); return }
  if (f.type === 'image/svg+xml') { toast.show('SVG 请使用下载方式，压缩针对位图', 'error'); return }
  file.value = f
  originalSize.value = f.size
  originalUrl.value = URL.createObjectURL(f)
  compressedUrl.value = ''
  // 等图片加载后立即压缩一次
  setTimeout(compress, 100)
}

function setFormat(f: 'image/webp' | 'image/jpeg') {
  format.value = f
  setTimeout(compress, 0)
}

async function compress() {
  const img = imgEl.value
  if (!img || !file.value) return
  busy.value = true
  try {
    const scale = Math.min(1, maxWidth.value / img.naturalWidth)
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(img.naturalWidth * scale)
    canvas.height = Math.round(img.naturalHeight * scale)
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    const blob: Blob | null = await new Promise(res => canvas.toBlob(res, format.value, quality.value / 100))
    if (!blob) throw new Error('编码失败')
    compressedSize.value = blob.size
    compressedUrl.value = URL.createObjectURL(blob)
  } catch (e: any) {
    toast.show('压缩失败：' + e.message, 'error')
  } finally {
    busy.value = false
  }
}

function clear() {
  file.value = null
  originalUrl.value = ''
  compressedUrl.value = ''
}

function download() {
  if (!compressedUrl.value) return
  const a = document.createElement('a')
  a.href = compressedUrl.value
  a.download = `compressed.${format.value === 'image/webp' ? 'webp' : 'jpg'}`
  a.click()
}

const savedPct = () => originalSize.value ? Math.max(0, Math.round((1 - compressedSize.value / originalSize.value) * 100)) : 0
</script>
<template>
  <ToolLayout>
    <div class="space-y-4">
      <div
        v-if="!file"
        class="flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors"
        :class="dragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'"
        role="button" tabindex="0" aria-label="选择或拖入图片"
        @click="fileInput?.click()" @keydown.enter="fileInput?.click()"
        @dragover.prevent="dragging = true" @dragleave.prevent="dragging = false" @drop.prevent="e => { dragging=false; const f=e.dataTransfer?.files?.[0]; if(f) loadFile(f) }"
      >
        <UploadCloud class="w-8 h-8 text-muted-foreground" />
        <p class="text-sm">点击选择图片，或拖拽到此处</p>
        <p class="text-xs text-muted-foreground">输出 WebP / JPEG · 全程本地处理，不消耗流量</p>
      </div>
      <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="e => { const f=(e.target as HTMLInputElement).files?.[0]; if(f) loadFile(f); (e.target as HTMLInputElement).value='' }" />

      <template v-if="file">
        <div class="card p-4 flex flex-wrap items-center gap-4">
          <label class="flex items-center gap-2 text-sm">
            <span class="text-muted-foreground shrink-0">质量 {{ quality }}%</span>
            <input type="range" min="10" max="95" v-model.number="quality" class="w-32 accent-blue-600" @change="compress" />
          </label>
          <label class="flex items-center gap-2 text-sm">
            <span class="text-muted-foreground shrink-0">最大宽 {{ maxWidth }}px</span>
            <input type="range" min="320" max="3840" step="80" v-model.number="maxWidth" class="w-36 accent-blue-600" @change="compress" />
          </label>
          <div class="flex gap-1">
            <button v-for="f in (['image/webp','image/jpeg'] as const)" :key="f" @click="setFormat(f)" :class="['btn-ghost text-xs', format===f && '!text-primary bg-primary/10']">{{ f === 'image/webp' ? 'WebP' : 'JPEG' }}</button>
          </div>
          <div class="flex-1"></div>
          <span v-if="compressedUrl" class="text-sm">
            <span class="text-muted-foreground">{{ (originalSize/1024).toFixed(0) }} KB →</span>
            <b class="text-green-600"> {{ (compressedSize/1024).toFixed(1) }} KB</b>
            <span class="text-green-600"> (省 {{ savedPct() }}%)</span>
          </span>
          <button @click="download" :disabled="!compressedUrl || busy" class="btn-primary disabled:opacity-50">{{ busy ? '压缩中...' : '下载' }}</button>
          <button @click="clear" class="btn-ghost" aria-label="移除"><X class="w-4 h-4" /></button>
        </div>

        <div class="grid lg:grid-cols-2 gap-4">
          <div class="card p-4">
            <div class="text-sm font-medium mb-2">原图（{{ (originalSize/1024).toFixed(1) }} KB）</div>
            <div class="rounded-lg border overflow-hidden flex items-center justify-center min-h-[200px] bg-[repeating-conic-gradient(#f1f5f9_0%_25%,white_0%_50%)] bg-[length:16px_16px] dark:bg-slate-800">
              <img ref="imgEl" :src="originalUrl" alt="原图" class="max-h-[360px] object-contain" @load="compress" />
            </div>
          </div>
          <div class="card p-4">
            <div class="text-sm font-medium mb-2">压缩后（{{ (compressedSize/1024).toFixed(1) }} KB）</div>
            <div class="rounded-lg border overflow-hidden flex items-center justify-center min-h-[200px] bg-[repeating-conic-gradient(#f1f5f9_0%_25%,white_0%_50%)] bg-[length:16px_16px] dark:bg-slate-800">
              <img v-if="compressedUrl" :src="compressedUrl" alt="压缩后" class="max-h-[360px] object-contain" />
              <span v-else class="text-xs text-muted-foreground">调整参数后自动生成</span>
            </div>
          </div>
        </div>
      </template>
    </div>
  </ToolLayout>
</template>
