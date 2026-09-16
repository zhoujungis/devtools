<script setup lang="ts">
import { ref, computed } from 'vue'
import ToolLayout from '@/layouts/ToolLayout.vue'
import { copyToClipboard } from '@/composables/useClipboard'
import { downloadText } from '@/utils/download'
import { useToastStore } from '@/stores/toast'
import { UploadCloud, FileImage, X, ArrowLeftRight } from 'lucide-vue-next'

const toast = useToastStore()
const file = ref<File | null>(null)
const dataUrl = ref('')
const dragging = ref(false)
const fileInput = ref<HTMLInputElement>()

// Base64 → 图片
const b64Input = ref('')
const previewSrc = ref('')

const mime = computed(() => file.value?.type || 'image/png')
const sizeKb = computed(() => file.value ? (file.value.size / 1024).toFixed(1) : '0')
const b64Length = computed(() => dataUrl.value.length)

function onPick(e: Event) {
  const f = (e.target as HTMLInputElement).files?.[0]
  if (f) loadFile(f)
  ;(e.target as HTMLInputElement).value = ''
}
function onDrop(e: DragEvent) {
  dragging.value = false
  const f = e.dataTransfer?.files?.[0]
  if (f) loadFile(f)
}
function loadFile(f: File) {
  if (!f.type.startsWith('image/')) { toast.show('请选择图片文件', 'error'); return }
  file.value = f
  const reader = new FileReader()
  reader.onload = () => { dataUrl.value = reader.result as string }
  reader.readAsDataURL(f)
}
function clearFile() { file.value = null; dataUrl.value = '' }

function fromBase64() {
  let src = b64Input.value.trim()
  if (!src) return
  if (!src.startsWith('data:')) src = `data:image/png;base64,${src}`
  previewSrc.value = src
}
function b64Part() {
  return b64Input.value.trim().replace(/^data:[^;]+;base64,/, '')
}
function saveDecoded() {
  try {
    const bin = atob(b64Part())
    const bytes = Uint8Array.from(bin, c => c.charCodeAt(0))
    const blob = new Blob([bytes], { type: 'image/png' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'image.png'
    a.click()
    URL.revokeObjectURL(a.href)
  } catch { toast.show('Base64 无效，无法解码', 'error') }
}
function downloadDataUrl() {
  if (!dataUrl.value) return
  downloadText(`image-base64.txt`, dataUrl.value)
}
</script>
<template>
  <ToolLayout>
    <div class="space-y-4">
      <!-- 图片 → Base64 -->
      <div>
        <div class="text-sm font-medium mb-2">图片 → Base64 Data URL</div>
        <div
          v-if="!file"
          class="flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors"
          :class="dragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'"
          role="button" tabindex="0" aria-label="选择或拖入图片"
          @click="fileInput?.click()" @keydown.enter="fileInput?.click()"
          @dragover.prevent="dragging = true" @dragleave.prevent="dragging = false" @drop.prevent="onDrop"
        >
          <UploadCloud class="w-8 h-8 text-muted-foreground" />
          <p class="text-sm">点击选择图片，或拖拽到此处</p>
          <p class="text-xs text-muted-foreground">PNG / JPEG / GIF / WebP / SVG · 仅在本地处理</p>
        </div>
        <div v-else class="card p-4">
          <div class="flex items-center gap-3">
            <img v-if="dataUrl" :src="dataUrl" alt="预览" class="w-14 h-14 object-contain rounded-lg border" />
            <div class="flex-1 min-w-0">
              <div class="text-sm font-medium truncate">{{ file.name }}</div>
              <div class="text-xs text-muted-foreground">{{ mime }} · {{ sizeKb }} KB · Base64 后约 {{ (b64Length/1024).toFixed(1) }} KB</div>
            </div>
            <button @click="clearFile" class="btn-ghost shrink-0" aria-label="移除"><X class="w-4 h-4" /></button>
          </div>
          <div class="mt-3 flex items-center gap-2">
            <code class="flex-1 text-[11px] font-mono break-all bg-slate-50 dark:bg-slate-800 border px-2 py-2 rounded-lg max-h-24 overflow-auto">{{ dataUrl }}</code>
            <div class="flex flex-col gap-2 shrink-0">
              <button @click="copyToClipboard(dataUrl)" class="btn-ghost border-border">复制</button>
              <button @click="downloadDataUrl" class="btn-ghost border-border">保存 .txt</button>
            </div>
          </div>
        </div>
        <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onPick" />
      </div>

      <!-- Base64 → 图片 -->
      <div>
        <div class="text-sm font-medium mb-2 flex items-center gap-2"><ArrowLeftRight class="w-4 h-4 text-muted-foreground" /> Base64 → 图片</div>
        <div class="flex gap-2">
          <textarea v-model="b64Input" rows="3" placeholder="粘贴 Base64 或 data:image/png;base64,... (支持纯 Base64)" class="flex-1 px-3 py-2 rounded-lg border font-mono text-xs bg-white dark:bg-slate-900"></textarea>
          <div class="flex flex-col gap-2 shrink-0">
            <button @click="fromBase64" class="btn-primary"><FileImage class="w-4 h-4" /> 预览</button>
            <button v-if="previewSrc" @click="saveDecoded" class="btn-ghost border-border">下载图片</button>
          </div>
        </div>
        <div v-if="previewSrc" class="mt-3 card p-4 flex justify-center">
          <img :src="previewSrc" alt="解码预览" class="max-h-64 object-contain rounded-lg" @error="toast.show('无法渲染：Base64 不是有效图片', 'error')" />
        </div>
      </div>
    </div>
  </ToolLayout>
</template>
