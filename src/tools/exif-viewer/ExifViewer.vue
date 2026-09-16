<script setup lang="ts">
import { ref } from 'vue'
import ToolLayout from '@/layouts/ToolLayout.vue'
import exifr from 'exifr'
import { useToastStore } from '@/stores/toast'
import { UploadCloud, X } from 'lucide-vue-next'

const toast = useToastStore()
const file = ref<File | null>(null)
const previewUrl = ref('')
const tags = ref<Record<string, unknown> | null>(null)
const dragging = ref(false)
const fileInput = ref<HTMLInputElement>()

const LABELS: Record<string, string> = {
  Make: '相机制造商', Model: '相机型号', LensModel: '镜头',
  FNumber: '光圈', ExposureTime: '快门', ISO: 'ISO', FocalLength: '焦距',
  DateTimeOriginal: '拍摄时间', CreateDate: '创建时间', ModifyDate: '修改时间',
  GPSLatitude: 'GPS 纬度', GPSLongitude: 'GPS 经度',
  ImageWidth: '宽度', ImageHeight: '高度', Orientation: '方向',
  Software: '软件', WhiteBalance: '白平衡', Flash: '闪光灯', ExposureMode: '曝光模式'
}

function fmtValue(key: string, v: unknown): string {
  if (v == null) return String(v)
  if (key === 'ExposureTime' && typeof v === 'number') return v < 1 ? `1/${Math.round(1 / v)}s` : `${v}s`
  if (key === 'FNumber' && typeof v === 'number') return `f/${v}`
  if (key === 'FocalLength' && typeof v === 'number') return `${v}mm`
  if (key === 'ISO' && typeof v === 'number') return String(v)
  if (v instanceof Date) return v.toLocaleString()
  if (typeof v === 'number') return Number.isInteger(v) ? String(v) : v.toFixed(6)
  if (Array.isArray(v)) return v.join(', ')
  return String(v)
}

async function loadFile(f: File) {
  if (!f.type.startsWith('image/')) { toast.show('请选择图片文件', 'error'); return }
  file.value = f
  previewUrl.value = URL.createObjectURL(f)
  tags.value = null
  try {
    const all = await exifr.parse(f, { tiff: true, exif: true, gps: true })
    if (!all || !Object.keys(all).length) {
      toast.show('该图片没有 EXIF 信息（可能被社交平台清洗过）', 'info')
      return
    }
    const ordered: Record<string, unknown> = {}
    Object.keys(LABELS).forEach(k => { if (all[k] !== undefined) ordered[k] = all[k] })
    Object.keys(all).filter(k => LABELS[k] === undefined && typeof all[k] !== 'object').slice(0, 20)
      .forEach(k => { ordered[k] = all[k] })
    tags.value = ordered
  } catch {
    toast.show('EXIF 解析失败', 'error')
  }
}

function clear() { file.value = null; previewUrl.value = ''; tags.value = null }
</script>
<template>
  <ToolLayout>
    <div class="space-y-4">
      <div
        v-if="!file"
        class="flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors"
        :class="dragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'"
        role="button" tabindex="0" aria-label="选择或拖入图片查看 EXIF"
        @click="fileInput?.click()" @keydown.enter="fileInput?.click()"
        @dragover.prevent="dragging = true" @dragleave.prevent="dragging = false" @drop.prevent="e => { dragging=false; const f=e.dataTransfer?.files?.[0]; if(f) loadFile(f) }"
      >
        <UploadCloud class="w-8 h-8 text-muted-foreground" />
        <p class="text-sm">点击选择照片，或拖拽到此处</p>
        <p class="text-xs text-muted-foreground">解析 EXIF 元数据 · 仅在本地读取，不会上传</p>
      </div>
      <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="e => { const f=(e.target as HTMLInputElement).files?.[0]; if(f) loadFile(f); (e.target as HTMLInputElement).value='' }" />

      <template v-if="file">
        <div class="card p-4 flex items-center gap-3">
          <img :src="previewUrl" alt="预览" class="w-16 h-16 object-cover rounded-lg border" />
          <div class="flex-1 min-w-0">
            <div class="text-sm font-medium truncate">{{ file.name }}</div>
            <div class="text-xs text-muted-foreground">{{ (file.size / 1024).toFixed(1) }} KB · {{ tags ? Object.keys(tags).length + ' 项元数据' : '无 EXIF' }}</div>
          </div>
          <button @click="clear" class="btn-ghost shrink-0" aria-label="移除"><X class="w-4 h-4" /></button>
        </div>

        <div v-if="tags" class="card divide-y">
          <div v-for="(v, k) in tags" :key="k" class="flex items-center gap-3 px-4 py-2.5 text-sm">
            <span class="w-28 shrink-0 text-muted-foreground text-xs">{{ LABELS[k as string] || k }}</span>
            <code class="font-mono text-xs break-all">{{ fmtValue(k as string, v) }}</code>
          </div>
        </div>
        <p v-else class="text-center text-sm text-muted-foreground py-6">未找到 EXIF 数据</p>
        <p class="text-xs text-muted-foreground">提示：发布照片前可先用本工具确认是否携带 GPS 位置等隐私信息。</p>
      </template>
    </div>
  </ToolLayout>
</template>
