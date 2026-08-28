<script setup lang="ts">
import { computed, ref } from 'vue'
import ToolLayout from '@/layouts/ToolLayout.vue'
import { pingHttp, type PingSample } from './processor'

const target = ref('https://example.com')
const samples = ref<PingSample[]>([])
const loading = ref(false)
const error = ref('')
let runId = 0
const successful = computed(() => samples.value.filter(sample => sample.ok))
const average = computed(() => successful.value.length ? Math.round(successful.value.reduce((sum, sample) => sum + sample.ms, 0) / successful.value.length) : null)

async function ping() {
  const currentRun = ++runId
  loading.value = true
  error.value = ''
  samples.value = []
  const result = await pingHttp(target.value, 4, 8000, sample => { if (currentRun === runId) samples.value.push(sample) })
  if (currentRun !== runId) return
  error.value = result.error || ''
  loading.value = false
}
</script>
<template>
  <ToolLayout>
    <div class="max-w-3xl space-y-4">
      <div class="flex gap-2 items-end">
        <label class="flex-1 text-sm font-medium">目标地址
          <input v-model="target" @keydown.enter="ping" class="mt-1 w-full px-3 py-2.5 border rounded-lg font-mono text-sm bg-white dark:bg-slate-900" placeholder="https://example.com" />
        </label>
        <button @click="ping" :disabled="loading" class="px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm disabled:opacity-50">{{ loading ? '检测中...' : '开始检测' }}</button>
      </div>
      <div class="p-3 rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-900/20 text-xs text-amber-800 dark:text-amber-200">
        浏览器不能直接发送 ICMP；本工具使用 HTTP HEAD 请求测量网络往返时间，目标服务器可能因 CORS 或防火墙拒绝请求。
      </div>
      <div v-if="error" class="p-3 rounded-lg border border-red-200 bg-red-50 dark:bg-red-900/20 text-sm text-red-700 dark:text-red-300">{{ error }}</div>
      <div v-if="samples.length" class="border rounded-lg overflow-hidden">
        <div class="px-3 py-2 bg-slate-50 dark:bg-slate-800 text-xs font-medium flex justify-between"><span>检测结果</span><span v-if="average !== null">平均 {{ average }} ms</span></div>
        <div class="divide-y">
          <div v-for="(sample, index) in samples" :key="index" class="px-3 py-2.5 flex items-center gap-3 text-sm"><span class="w-16 text-muted-foreground">第 {{ index + 1 }} 次</span><span :class="sample.ok ? 'text-green-600' : 'text-red-600'">{{ sample.ok ? '成功' : '失败' }}</span><span class="ml-auto font-mono text-xs">{{ sample.ok ? `${sample.ms} ms` : sample.error }}</span></div>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>
