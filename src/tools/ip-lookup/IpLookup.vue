<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue'
import ToolLayout from '@/layouts/ToolLayout.vue'
import { lookupIp, type IpLookupResult } from './processor'
import { copyToClipboard } from '@/composables/useClipboard'

const input = ref('')
const result = ref<IpLookupResult | null>(null)
const loading = ref(false)
let controller: AbortController | null = null
let requestId = 0
onBeforeUnmount(() => { requestId++; controller?.abort() })

async function lookup() {
  const currentRequest = ++requestId
  controller?.abort()
  controller = new AbortController()
  loading.value = true
  const nextResult = await lookupIp(input.value, controller.signal)
  if (currentRequest !== requestId) return
  result.value = nextResult
  loading.value = false
}
</script>
<template>
  <ToolLayout>
    <div class="max-w-3xl space-y-4">
      <div class="flex gap-2 items-end">
        <label class="flex-1 text-sm font-medium">IP 地址（留空查询当前出口 IP）
          <input v-model="input" @keydown.enter="lookup" class="mt-1 w-full px-3 py-2.5 border rounded-lg font-mono text-sm bg-white dark:bg-slate-900" placeholder="8.8.8.8" />
        </label>
        <button @click="lookup" :disabled="loading" class="px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm disabled:opacity-50">{{ loading ? '查询中...' : '查询' }}</button>
      </div>
      <div class="p-3 rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-900/20 text-xs text-amber-800 dark:text-amber-200">
        查询会把 IP 地址发送到 ipwho.is 第三方服务；地理位置和运营商信息仅供参考。
      </div>
      <div v-if="result && !result.success" class="p-3 rounded-lg border border-red-200 bg-red-50 dark:bg-red-900/20 text-sm text-red-700 dark:text-red-300">{{ result.error }}</div>
      <div v-else-if="result?.data" class="border rounded-lg overflow-hidden">
        <div class="px-3 py-2 bg-slate-50 dark:bg-slate-800 text-xs font-medium flex justify-between"><span>IP 信息</span><button @click="copyToClipboard(JSON.stringify(result.data, null, 2))" class="text-xs border px-2 py-1 rounded">复制 JSON</button></div>
        <div class="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x">
          <div class="divide-y">
            <div v-for="item in [['IP', result.data.ip], ['类型', result.data.type], ['国家', result.data.country], ['地区', result.data.region], ['城市', result.data.city], ['时区', result.data.timezone?.id]]" :key="String(item[0])" class="flex gap-3 px-3 py-2.5 text-sm"><span class="w-20 shrink-0 text-muted-foreground">{{ item[0] }}</span><span class="font-mono text-xs break-all">{{ item[1] || '-' }}</span></div>
          </div>
          <div class="divide-y">
            <div v-for="item in [['组织', result.data.connection?.org], ['ISP', result.data.connection?.isp], ['ASN', result.data.connection?.asn], ['经纬度', result.data.latitude && result.data.longitude ? `${result.data.latitude}, ${result.data.longitude}` : '-'], ['安全代理', result.data.security?.vpn ? 'VPN' : result.data.security?.proxy ? 'Proxy' : '未识别']]" :key="String(item[0])" class="flex gap-3 px-3 py-2.5 text-sm"><span class="w-20 shrink-0 text-muted-foreground">{{ item[0] }}</span><span class="font-mono text-xs break-all">{{ item[1] || '-' }}</span></div>
          </div>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>
