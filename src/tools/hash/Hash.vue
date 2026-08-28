<script setup lang="ts">
import { ref, watch } from 'vue'
import ToolLayout from '@/layouts/ToolLayout.vue'
import CodeEditor from '@/components/editor/CodeEditor.vue'
import { hashMD5, hashSHA, type HashAlgo } from './processor'
import { copyToClipboard } from '@/composables/useClipboard'

const input = ref('Hello DevBox')
const algos: HashAlgo[] = ['MD5','SHA-1','SHA-256','SHA-384','SHA-512']
const results = ref<Record<string,string>>({})
const hmacKey = ref('')
const compareA = ref('')
const compareB = ref('')
let computeRun = 0

async function compute(){
  const run = ++computeRun
  results.value = {}
  const next: Record<string, string> = { MD5: hashMD5(input.value) }
  for(const a of algos.filter(x=>x!=='MD5') as any){
    next[a] = await hashSHA(input.value, a)
    if (run !== computeRun) return
  }
  if(hmacKey.value){
    // simple HMAC via SHA-256 using WebCrypto import key
    try{
      const enc = new TextEncoder()
      const key = await crypto.subtle.importKey('raw', enc.encode(hmacKey.value), {name:'HMAC', hash:'SHA-256'}, false, ['sign'])
      const sig = await crypto.subtle.sign('HMAC', key, enc.encode(input.value))
      next['HMAC-SHA256'] = Array.from(new Uint8Array(sig)).map(b=>b.toString(16).padStart(2,'0')).join('')
    }catch{ next['HMAC-SHA256']='error' }
  }
  if (run === computeRun) results.value = next
}
watch([input, hmacKey], compute, { immediate:true })
</script>
<template>
  <ToolLayout>
    <div class="space-y-4">
      <div>
        <div class="text-sm font-medium mb-2">输入文本</div>
        <CodeEditor v-model="input" language="text" placeholder="输入要计算 Hash 的内容..." />
        <div class="mt-2 flex gap-2">
          <input v-model="hmacKey" placeholder="HMAC Key (可选，生成 HMAC-SHA256)" class="flex-1 px-3 py-2 rounded-lg border bg-white dark:bg-slate-900 text-sm" />
          <button @click="compareA=results['SHA-256']||''" class="text-xs border px-3 py-1 rounded">填入比较</button>
        </div>
      </div>

      <div class="border rounded-lg overflow-hidden">
        <div class="px-3 py-2 bg-slate-50 dark:bg-slate-800 text-xs font-medium">Hash 结果（优先使用 Web Crypto API）</div>
        <div class="divide-y">
          <div v-for="algo in [...algos, ...(hmacKey?'HMAC-SHA256':[])]" :key="algo" class="flex items-center gap-2 px-3 py-2.5">
            <span class="w-28 text-xs font-mono font-medium">{{ algo }}</span>
            <code class="flex-1 text-xs font-mono break-all bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded">{{ results[algo] || '计算中...' }}</code>
            <button @click="copyToClipboard(results[algo]||'')" class="text-xs border px-2 py-1 rounded">复制</button>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-900 border rounded-lg p-4">
        <div class="text-sm font-medium mb-2">Hash 对比</div>
        <div class="grid sm:grid-cols-2 gap-2">
          <input v-model="compareA" placeholder="Hash A" class="px-3 py-2 border rounded-lg font-mono text-xs" />
          <input v-model="compareB" placeholder="Hash B" class="px-3 py-2 border rounded-lg font-mono text-xs" />
        </div>
        <div v-if="compareA && compareB" class="mt-2 text-sm" :class="compareA.trim().toLowerCase()===compareB.trim().toLowerCase() ? 'text-green-600' : 'text-red-600'">
          {{ compareA.trim().toLowerCase()===compareB.trim().toLowerCase() ? '✓ 一致' : '✗ 不一致' }}
        </div>
        <p class="text-xs text-muted-foreground mt-2">所有计算在浏览器本地完成；大文件建议分片处理（此处为文本演示）。</p>
      </div>
    </div>
  </ToolLayout>
</template>
