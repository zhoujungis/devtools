<script setup lang="ts">
import { ref, computed } from 'vue'
import ToolLayout from '@/layouts/ToolLayout.vue'
import CodeEditor from '@/components/editor/CodeEditor.vue'
import { encodeBase64, decodeBase64 } from './processor'
import { copyToClipboard } from '@/composables/useClipboard'
import { downloadText } from '@/utils/download'

const input = ref('Hello DevBox!')
const mode = ref<'encode'|'decode'>('encode')

const output = computed(()=>{
  if(mode.value==='encode') return encodeBase64(input.value)
  const r = decodeBase64(input.value)
  return r.error ? r.error : r.text
})
const isError = computed(()=> mode.value==='decode' && decodeBase64(input.value).error)

function swap(){
  const out = output.value
  if(!isError.value){ input.value = out; mode.value = mode.value==='encode'?'decode':'encode' }
}
function onFileChange(e: Event){
  const target = e.target as HTMLInputElement
  const f = target.files?.[0]
  if(!f) return
  const r = new FileReader()
  r.onload = () => { const b = r.result as string; const base64 = b.split(',')[1] || b; input.value = base64; mode.value='decode' }
  r.readAsDataURL(f)
}
</script>
<template>
  <ToolLayout>
    <div class="flex flex-wrap gap-2 mb-4">
      <div class="flex rounded-full border p-1 bg-slate-100 dark:bg-slate-800">
        <button @click="mode='encode'" :class="['px-4 py-1 rounded-full text-sm', mode==='encode'?'bg-white dark:bg-slate-900 shadow':'']">编码 Text → Base64</button>
        <button @click="mode='decode'" :class="['px-4 py-1 rounded-full text-sm', mode==='decode'?'bg-white dark:bg-slate-900 shadow':'']">解码 Base64 → Text</button>
      </div>
      <button @click="swap" class="px-3 py-1.5 border rounded-full text-sm">⇄ 交换</button>
      <button @click="copyToClipboard(output)" class="px-3 py-1.5 bg-primary text-primary-foreground rounded-full text-sm">复制结果</button>
      <button @click="downloadText('base64.txt', output)" class="px-3 py-1.5 border rounded-full text-sm">下载</button>
      <button @click="input=''" class="px-3 py-1.5 border rounded-full text-sm">清空</button>
    </div>

    <div class="grid lg:grid-cols-2 gap-4">
      <div>
        <div class="text-sm font-medium mb-2">{{ mode==='encode'?'输入文本':'输入 Base64' }}</div>
        <CodeEditor v-model="input" language="text" />
        <div class="mt-2 flex gap-2">
          <label class="flex-1 flex items-center justify-center gap-2 border-2 border-dashed rounded-lg py-6 text-sm text-muted-foreground cursor-pointer hover:border-primary">
            <input type="file" class="hidden" @change="onFileChange" />
            📁 拖拽或点击上传文件 → 转 Base64
          </label>
        </div>
      </div>
      <div>
        <div class="text-sm font-medium mb-2">{{ mode==='encode'?'Base64 输出':'文本输出' }}</div>
        <CodeEditor :modelValue="output" language="text" :readonly="true" />
        <div v-if="isError" class="mt-2 text-xs text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded p-2">{{ output }}</div>
      </div>
    </div>

    <div class="mt-6 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg text-xs text-muted-foreground">
      <p>• 文本编码使用 UTF-8 → Base64</p>
      <p>• 图片/文件可直接拖拽，结果为纯 Base64 字符串，可用于 <code>data:image/png;base64,...</code></p>
      <p>• 所有处理在浏览器本地完成</p>
    </div>
  </ToolLayout>
</template>
