<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import ToolLayout from '@/layouts/ToolLayout.vue'
import QRCode from 'qrcode'

const text = ref('https://example.com')
const width = ref(240)
const margin = ref(2)
const dark = ref('#0f172a')
const light = ref('#ffffff')
const dataUrl = ref('')
const svgStr = ref('')
const error = ref('')
let generation = 0

async function gen(){
  const current = ++generation
  error.value = ''
  if(!text.value) { dataUrl.value=''; svgStr.value=''; return }
  try {
    const options = { width: width.value, margin: margin.value, color:{ dark: dark.value, light: light.value } }
    const [png, svg] = await Promise.all([QRCode.toDataURL(text.value, options), QRCode.toString(text.value, { ...options, type:'svg' })])
    if (current === generation) { dataUrl.value = png; svgStr.value = svg }
  } catch (e) { if (current === generation) { dataUrl.value=''; svgStr.value=''; error.value = e instanceof Error ? e.message : '二维码生成失败' } }
}
watch([text,width,margin,dark,light], gen)
onMounted(gen)
onBeforeUnmount(() => { generation++ })

function downloadPng(){
  const a=document.createElement('a'); a.href=dataUrl.value; a.download='qrcode.png'; a.click()
}
function downloadSvg(){
  const blob=new Blob([svgStr.value],{type:'image/svg+xml'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='qrcode.svg'; a.click(); URL.revokeObjectURL(url)
}
</script>
<template>
  <ToolLayout>
    <div class="grid lg:grid-cols-2 gap-6">
      <div class="space-y-3">
        <div>
          <label class="text-sm font-medium">文本 / 链接</label>
          <textarea v-model="text" rows="3" class="mt-1 w-full px-3 py-2 border rounded-lg text-sm" placeholder="https://example.com"></textarea>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <label class="text-sm">尺寸 <input v-model.number="width" type="range" min="128" max="512" class="w-full" /><span class="text-xs">{{ width }}px</span></label>
          <label class="text-sm">边距 <input v-model.number="margin" type="range" min="0" max="8" class="w-full" /><span class="text-xs">{{ margin }}</span></label>
        </div>
        <div class="flex gap-3">
          <label class="text-sm">前景 <input v-model="dark" type="color" class="ml-2 w-8 h-8 p-0 border rounded" /></label>
          <label class="text-sm">背景 <input v-model="light" type="color" class="ml-2 w-8 h-8 p-0 border rounded" /></label>
        </div>
        <div class="flex gap-2">
          <button @click="downloadPng" :disabled="!dataUrl" class="px-3 py-1.5 bg-primary text-primary-foreground rounded-full text-sm disabled:opacity-50">下载 PNG</button>
          <button @click="downloadSvg" :disabled="!svgStr" class="px-3 py-1.5 border rounded-full text-sm disabled:opacity-50">下载 SVG</button>
        </div>
      </div>
      <div class="flex flex-col items-center justify-center card p-6">
        <div v-if="dataUrl" class="p-4 bg-white rounded-lg shadow">
          <img :src="dataUrl" :width="width" :height="width" alt="QR Code" class="rounded" />
        </div>
        <p v-else class="text-sm text-muted-foreground">{{ error || '输入内容生成二维码' }}</p>
        <p class="text-xs text-muted-foreground mt-2">实时生成 · 本地处理</p>
      </div>
    </div>
  </ToolLayout>
</template>
