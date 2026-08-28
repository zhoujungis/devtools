<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue'
import ToolLayout from '@/layouts/ToolLayout.vue'
import { queryDns, type DnsRecordType, type DnsResult } from './processor'
import { copyToClipboard } from '@/composables/useClipboard'

const domain = ref('example.com')
const recordType = ref<DnsRecordType>('A')
const result = ref<DnsResult | null>(null)
const loading = ref(false)
let controller: AbortController | null = null
let requestId = 0
onBeforeUnmount(() => { requestId++; controller?.abort() })

async function lookup() {
  const currentRequest = ++requestId
  controller?.abort()
  controller = new AbortController()
  loading.value = true
  const nextResult = await queryDns(domain.value, recordType.value, controller.signal)
  if (currentRequest !== requestId) return
  result.value = nextResult
  loading.value = false
}
</script>
<template>
  <ToolLayout>
    <div class="max-w-3xl space-y-4">
      <div class="flex flex-wrap gap-2 items-end">
        <label class="flex-1 min-w-[220px] text-sm font-medium">域名
          <input v-model="domain" @keydown.enter="lookup" class="mt-1 w-full px-3 py-2.5 border rounded-lg font-mono text-sm bg-white dark:bg-slate-900" placeholder="example.com" />
        </label>
        <label class="text-sm font-medium">记录类型
          <select v-model="recordType" class="mt-1 block px-3 py-2.5 border rounded-lg text-sm bg-white dark:bg-slate-900">
            <option v-for="type in ['A','AAAA','CNAME','MX','NS','TXT','CAA']" :key="type" :value="type">{{ type }}</option>
          </select>
        </label>
        <button @click="lookup" :disabled="loading" class="px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm disabled:opacity-50">{{ loading ? '查询中...' : '查询' }}</button>
      </div>

      <div class="p-3 rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-900/20 text-xs text-amber-800 dark:text-amber-200">
        请求会通过 Cloudflare DNS over HTTPS 发送到外部服务；此工具不使用浏览器本地 DNS。
      </div>

      <div v-if="result && !result.valid" class="p-3 rounded-lg border border-red-200 bg-red-50 dark:bg-red-900/20 text-sm text-red-700 dark:text-red-300">{{ result.error }}</div>
      <div v-else-if="result" class="border rounded-lg overflow-hidden">
        <div class="px-3 py-2 bg-slate-50 dark:bg-slate-800 text-xs font-medium flex justify-between"><span>查询结果</span><span class="text-muted-foreground">状态码 {{ result.status ?? '-' }}</span></div>
        <div v-if="!result.answers.length" class="p-6 text-center text-sm text-muted-foreground">未找到 {{ recordType }} 记录</div>
        <div v-else class="divide-y">
          <div v-for="(answer, index) in result.answers" :key="`${answer.name}-${index}`" class="px-3 py-2.5 flex gap-3 items-start text-sm">
            <span class="w-16 shrink-0 font-mono text-xs text-muted-foreground">{{ recordType }}</span>
            <code class="flex-1 break-all font-mono text-xs">{{ answer.data }}</code>
            <button @click="copyToClipboard(answer.data)" class="text-xs border px-2 py-1 rounded shrink-0">复制</button>
          </div>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>
