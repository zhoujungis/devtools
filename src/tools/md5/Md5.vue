<script setup lang="ts">
import { ref, watch } from 'vue'
import ToolLayout from '@/layouts/ToolLayout.vue'
import CodeEditor from '@/components/editor/CodeEditor.vue'
import { md5Text, md5File, formatSize } from './processor'
import { copyToClipboard } from '@/composables/useClipboard'
import { UploadCloud, FileText, X } from 'lucide-vue-next'

const input = ref('Hello DevBox')
const textResult = ref('')
const file = ref<File | null>(null)
const fileResult = ref('')
const fileBusy = ref(false)
const dragging = ref(false)

const fileInput = ref<HTMLInputElement>()

watch(input, v => { textResult.value = md5Text(v) }, { immediate: true })

watch(file, async f => {
  fileResult.value = ''
  if (!f) return
  fileBusy.value = true
  try {
    fileResult.value = await md5File(f)
  } finally {
    fileBusy.value = false
  }
})

function onPick(e: Event) {
  const target = e.target as HTMLInputElement
  const f = target.files?.[0]
  if (f) file.value = f
  target.value = ''
}

function onDrop(e: DragEvent) {
  dragging.value = false
  const f = e.dataTransfer?.files?.[0]
  if (f) file.value = f
}

function clearFile() {
  file.value = null
  fileResult.value = ''
}
</script>
<template>
  <ToolLayout>
    <div class="space-y-4">
      <div>
        <div class="text-sm font-medium mb-2">文本 MD5</div>
        <CodeEditor v-model="input" language="text" placeholder="输入要计算 MD5 的文本..." />
        <div class="mt-2 flex items-center gap-2">
          <code class="flex-1 text-xs font-mono break-all bg-slate-50 dark:bg-slate-800 border px-2 py-2 rounded-lg">{{ textResult }}</code>
          <button @click="copyToClipboard(textResult)" class="btn-ghost border-border shrink-0">复制</button>
        </div>
      </div>

      <div>
        <div class="text-sm font-medium mb-2">文件 MD5</div>
        <div
          v-if="!file"
          class="flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors"
          :class="dragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'"
          role="button" tabindex="0" aria-label="选择或拖入文件计算 MD5"
          @click="fileInput?.click()"
          @keydown.enter="fileInput?.click()"
          @dragover.prevent="dragging = true"
          @dragleave.prevent="dragging = false"
          @drop.prevent="onDrop"
        >
          <UploadCloud class="w-8 h-8 text-muted-foreground" />
          <p class="text-sm">点击选择文件，或拖拽文件到此处</p>
          <p class="text-xs text-muted-foreground">文件仅在浏览器本地计算，不会上传</p>
        </div>
        <div v-else class="card p-4">
          <div class="flex items-center gap-3">
            <span class="icon-chip w-9 h-9 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"><FileText class="w-5 h-5" /></span>
            <div class="flex-1 min-w-0">
              <div class="text-sm font-medium truncate">{{ file.name }}</div>
              <div class="text-xs text-muted-foreground">{{ formatSize(file.size) }}{{ file.type ? ` · ${file.type}` : '' }}</div>
            </div>
            <button @click="clearFile" class="btn-ghost shrink-0" aria-label="移除文件"><X class="w-4 h-4" /></button>
          </div>
          <div class="mt-3 flex items-center gap-2">
            <code class="flex-1 text-xs font-mono break-all bg-slate-50 dark:bg-slate-800 border px-2 py-2 rounded-lg">
              {{ fileBusy ? '计算中...' : fileResult }}
            </code>
            <button v-if="!fileBusy && fileResult" @click="copyToClipboard(fileResult)" class="btn-ghost border-border shrink-0">复制</button>
          </div>
        </div>
        <input ref="fileInput" type="file" class="hidden" @change="onPick" />
      </div>
    </div>
  </ToolLayout>
</template>
