<script setup lang="ts">
import { ref, computed } from 'vue'
import ToolLayout from '@/layouts/ToolLayout.vue'
import CodeEditor from '@/components/editor/CodeEditor.vue'
import { urlEncode, urlDecodeResult, parseUrl } from './processor'
import { copyToClipboard } from '@/composables/useClipboard'

const mode = ref<'encode'|'decode'|'parse'>('encode')
const input = ref('https://example.com/search?q=hello world&lang=zh-CN#section')
const output = computed(()=>{
  if(mode.value==='encode') return urlEncode(input.value)
  if(mode.value==='decode') return urlDecodeResult(input.value).text
  return ''
})
const decodeError = computed(() => mode.value === 'decode' ? urlDecodeResult(input.value).error : undefined)
const parsed = computed(()=> mode.value==='parse' ? parseUrl(input.value) : null)
</script>
<template>
  <ToolLayout>
    <div class="flex flex-wrap gap-2 mb-4">
      <div class="flex rounded-full border p-1 bg-slate-100 dark:bg-slate-800">
        <button @click="mode='encode'" :class="['px-4 py-1 rounded-full text-sm', mode==='encode'?'bg-white dark:bg-slate-900 shadow':'']">编码</button>
        <button @click="mode='decode'" :class="['px-4 py-1 rounded-full text-sm', mode==='decode'?'bg-white dark:bg-slate-900 shadow':'']">解码</button>
        <button @click="mode='parse'" :class="['px-4 py-1 rounded-full text-sm', mode==='parse'?'bg-white dark:bg-slate-900 shadow':'']">解析 URL</button>
      </div>
      <button @click="copyToClipboard(mode==='parse' ? JSON.stringify(parsed,null,2) : output)" class="px-3 py-1.5 bg-primary text-primary-foreground rounded-full text-sm">复制结果</button>
      <button @click="input=''" class="px-3 py-1.5 border rounded-full text-sm">清空</button>
    </div>

    <div class="grid lg:grid-cols-2 gap-4">
      <div>
        <div class="text-sm font-medium mb-2">输入</div>
        <CodeEditor v-model="input" language="text" placeholder="https://example.com/?q=hello world" />
      </div>
      <div>
        <div class="text-sm font-medium mb-2">输出</div>
        <div v-if="mode!=='parse'">
          <div v-if="decodeError" class="mb-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded text-xs text-red-600">{{ decodeError }}</div>
          <CodeEditor :modelValue="output" language="text" :readonly="true" />
        </div>
        <div v-else>
          <div v-if="parsed && 'error' in parsed" class="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded text-sm text-red-600">{{ parsed.error }}</div>
          <div v-else-if="parsed" class="border rounded-lg overflow-hidden text-sm">
            <div class="divide-y">
              <div v-for="(v,k) in parsed" :key="k" class="flex gap-2 px-3 py-2 even:bg-slate-50 dark:even:bg-slate-800/50">
                <span class="w-24 shrink-0 font-medium text-muted-foreground">{{ k }}</span>
                <span class="flex-1 font-mono text-xs break-all">{{ k==='query' ? JSON.stringify(v,null,2) : String(v) }}</span>
                <button @click="copyToClipboard(String(k==='query'? JSON.stringify(v): v))" class="text-xs px-1.5 py-0.5 border rounded">复制</button>
              </div>
            </div>
            <div v-if="'query' in parsed && Object.keys((parsed as any).query).length" class="p-3 bg-slate-50 dark:bg-slate-900 border-t">
              <div class="text-xs font-medium mb-1">Query 参数</div>
              <div class="space-y-1">
                <div v-for="(qv,qk) in (parsed as any).query" :key="qk" class="flex gap-2 text-xs font-mono">
                  <span class="text-blue-600">{{ qk }}</span><span>=</span><span class="text-green-600 break-all">{{ qv }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>
