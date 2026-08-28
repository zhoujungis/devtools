<script setup lang="ts">
import { ref } from 'vue'
import ToolLayout from '@/layouts/ToolLayout.vue'
import { generateMany } from './processor'
import { copyToClipboard } from '@/composables/useClipboard'
import { downloadText } from '@/utils/download'

const count = ref(5)
const uppercase = ref(false)
const hyphens = ref(true)
const list = ref<string[]>(generateMany(5, {uppercase:false, hyphens:true}))
function gen(cnt?:number){
  const c = cnt ?? count.value
  list.value = generateMany(c, {uppercase:uppercase.value, hyphens:hyphens.value})
}
</script>
<template>
  <ToolLayout>
    <div class="flex flex-wrap gap-3 items-end mb-4">
      <label class="text-sm">数量 <input v-model.number="count" type="number" min="1" max="1000" class="w-20 ml-2 px-2 py-1 border rounded" /></label>
      <label class="flex items-center gap-1 text-sm"><input type="checkbox" v-model="uppercase" @change="gen()" /> 大写</label>
      <label class="flex items-center gap-1 text-sm"><input type="checkbox" v-model="hyphens" @change="gen()" /> 连字符 -</label>
      <button @click="gen()" class="px-4 py-1.5 bg-primary text-primary-foreground rounded-full text-sm">生成</button>
      <button @click="gen(1)" class="px-3 py-1.5 border rounded-full text-sm">生成 1 个</button>
      <button @click="gen(10)" class="px-3 py-1.5 border rounded-full text-sm">生成 10 个</button>
      <button @click="gen(100)" class="px-3 py-1.5 border rounded-full text-sm">生成 100 个</button>
      <button @click="copyToClipboard(list.join('\n'))" class="px-3 py-1.5 border rounded-full text-sm">复制全部</button>
      <button @click="downloadText('uuids.txt', list.join('\n'))" class="px-3 py-1.5 border rounded-full text-sm">下载</button>
    </div>
    <div class="border rounded-lg overflow-hidden">
      <div class="max-h-[480px] overflow-auto divide-y font-mono text-sm">
        <div v-for="(u,i) in list" :key="i" class="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800">
          <span class="flex-1 break-all">{{ u }}</span>
          <button @click="copyToClipboard(u)" class="text-xs border px-2 py-0.5 rounded">复制</button>
        </div>
      </div>
    </div>
    <p class="text-xs text-muted-foreground mt-2">使用 crypto.randomUUID()，本地生成，无需网络。</p>
  </ToolLayout>
</template>
