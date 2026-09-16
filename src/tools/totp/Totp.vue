<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from 'vue'
import ToolLayout from '@/layouts/ToolLayout.vue'
import { totpAt, remainingSeconds, otpauthUri, type TotpAlgo } from './processor'
import { copyToClipboard } from '@/composables/useClipboard'
import { RefreshCw } from 'lucide-vue-next'

const secret = ref('GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ')
const digits = ref(6)
const period = ref(30)
const algo = ref<TotpAlgo>('SHA-1')
const account = ref('me@example.com')
const issuer = ref('DevBox')
const code = ref('')
const error = ref('')
const tick = ref(0)

let timer: ReturnType<typeof setInterval> | undefined
async function refresh() {
  try {
    code.value = await totpAt(secret.value, Date.now(), { digits: digits.value, period: period.value, algo: algo.value })
    error.value = ''
  } catch (e) {
    code.value = ''
    error.value = e instanceof Error ? e.message : '密钥格式错误'
  }
}
refresh()
timer = setInterval(async () => { tick.value++; await refresh() }, 1000)
onBeforeUnmount(() => { if (timer) clearInterval(timer) })

const remain = computed(() => remainingSeconds(Date.now(), period.value))
const pct = computed(() => remain.value / period.value * 100)
const uri = computed(() => {
  try {
    return otpauthUri({ issuer: issuer.value, account: account.value, secret: secret.value, digits: digits.value, period: period.value, algo: algo.value })
  } catch { return '' }
})
</script>
<template>
  <ToolLayout>
    <div class="space-y-4">
      <div class="card p-6 text-center" :key="tick">
        <div class="text-xs text-muted-foreground mb-1">当前验证码（每秒自动刷新）</div>
        <div class="text-5xl font-mono font-bold tracking-[0.2em] text-gradient select-all">{{ code || '------' }}</div>
        <div v-if="error" class="text-sm text-red-500 mt-2">{{ error }}</div>
        <div class="mt-4 flex items-center justify-center gap-2">
          <button @click="refresh" class="btn-ghost border-border"><RefreshCw class="w-4 h-4" /> 立即刷新</button>
          <button v-if="code" @click="copyToClipboard(code)" class="btn-primary">复制验证码</button>
        </div>
        <div class="mt-4 max-w-[240px] mx-auto">
          <div class="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div class="h-full rounded-full transition-all duration-1000" :class="pct > 30 ? 'brand-gradient' : 'bg-red-500'" :style="{ width: pct + '%' }"></div>
          </div>
          <div class="text-xs text-muted-foreground mt-1">{{ remain }}s 后刷新</div>
        </div>
      </div>

      <div class="card p-4 space-y-3">
        <label class="block text-sm">
          <span class="text-muted-foreground">Base32 密钥</span>
          <input v-model="secret" class="mt-1 w-full px-3 py-2 rounded-lg border font-mono text-sm bg-white dark:bg-slate-900" placeholder="如 JBSWY3DPEHPK3PXP" />
        </label>
        <div class="grid sm:grid-cols-3 gap-3">
          <label class="block text-sm">
            <span class="text-muted-foreground">算法</span>
            <select v-model="algo" class="mt-1 w-full px-3 py-2 rounded-lg border text-sm bg-white dark:bg-slate-900">
              <option>SHA-1</option><option>SHA-256</option><option>SHA-512</option>
            </select>
          </label>
          <label class="block text-sm">
            <span class="text-muted-foreground">位数</span>
            <select v-model.number="digits" class="mt-1 w-full px-3 py-2 rounded-lg border text-sm bg-white dark:bg-slate-900">
              <option :value="6">6 位</option><option :value="8">8 位</option>
            </select>
          </label>
          <label class="block text-sm">
            <span class="text-muted-foreground">周期（秒）</span>
            <select v-model.number="period" class="mt-1 w-full px-3 py-2 rounded-lg border text-sm bg-white dark:bg-slate-900">
              <option :value="30">30</option><option :value="60">60</option>
            </select>
          </label>
        </div>
        <div class="grid sm:grid-cols-2 gap-3">
          <label class="block text-sm">
            <span class="text-muted-foreground">账户</span>
            <input v-model="account" class="mt-1 w-full px-3 py-2 rounded-lg border text-sm bg-white dark:bg-slate-900" />
          </label>
          <label class="block text-sm">
            <span class="text-muted-foreground">服务名</span>
            <input v-model="issuer" class="mt-1 w-full px-3 py-2 rounded-lg border text-sm bg-white dark:bg-slate-900" />
          </label>
        </div>
      </div>

      <div v-if="uri" class="card p-4">
        <div class="text-sm font-medium mb-2">otpauth:// 迁移 URI（可用于导入验证器 App）</div>
        <div class="flex items-center gap-2">
          <code class="flex-1 text-xs font-mono break-all bg-slate-50 dark:bg-slate-800 border px-2 py-2 rounded-lg">{{ uri }}</code>
          <button @click="copyToClipboard(uri)" class="btn-ghost border-border shrink-0">复制</button>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>
