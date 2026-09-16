<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import ToolLayout from '@/layouts/ToolLayout.vue'
import { nowTimestamp, timestampToDate, dateToTimestamp } from './processor'
import { copyToClipboard } from '@/composables/useClipboard'

const now = ref(nowTimestamp())
let timer: any
onMounted(()=> timer = setInterval(()=> now.value = nowTimestamp(), 1000))
onBeforeUnmount(()=> clearInterval(timer))

const tsInput = ref(String(Math.floor(Date.now()/1000)))
const tsUnit = ref<'s'|'ms'>('s')
const dateInput = ref('2026-08-28 14:30:20')

const tsToDate = computed(()=> {
  const n = Number(tsInput.value)
  if(!tsInput.value.trim() || !Number.isFinite(n)) return '无效时间戳'
  return timestampToDate(n, tsUnit.value)
})
const dateToTs = computed(()=> {
  const v = dateToTimestamp(dateInput.value, tsUnit.value)
  return v===null ? '无效日期' : String(v)
})
</script>
<template>
  <ToolLayout>
    <div class="grid lg:grid-cols-3 gap-4 mb-6">
      <div class="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 text-center">
        <div class="text-xs text-muted-foreground">当前时间 (本地)</div>
        <div class="text-lg font-mono font-bold mt-1">{{ now.local }}</div>
        <div class="text-xs text-muted-foreground mt-1">{{ now.iso }}</div>
      </div>
      <div class="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-center">
        <div class="text-xs text-muted-foreground">Unix 秒</div>
        <div class="text-lg font-mono font-bold mt-1">{{ now.seconds }}</div>
        <button @click="copyToClipboard(String(now.seconds))" class="text-xs border px-2 py-0.5 rounded mt-2">复制</button>
      </div>
      <div class="bg-violet-50 dark:bg-violet-900/20 rounded-xl p-4 text-center">
        <div class="text-xs text-muted-foreground">Unix 毫秒</div>
        <div class="text-lg font-mono font-bold mt-1">{{ now.ms }}</div>
        <button @click="copyToClipboard(String(now.ms))" class="text-xs border px-2 py-0.5 rounded mt-2">复制</button>
      </div>
    </div>

    <div class="grid lg:grid-cols-2 gap-6">
      <div class="card p-4">
        <h3 class="font-medium text-sm mb-3">时间戳 → 日期</h3>
        <div class="flex gap-2 mb-2">
          <input v-model="tsInput" class="flex-1 px-3 py-2 border rounded-lg font-mono text-sm" placeholder="1710000000" />
          <select v-model="tsUnit" class="px-2 py-2 border rounded-lg text-sm">
            <option value="s">秒</option>
            <option value="ms">毫秒</option>
          </select>
        </div>
        <div class="p-3 bg-slate-50 dark:bg-slate-800 rounded font-mono text-sm">{{ tsToDate }}</div>
        <div class="flex gap-2 mt-2">
          <button @click="copyToClipboard(tsToDate)" class="text-xs border px-2 py-1 rounded">复制</button>
          <button @click="tsInput=String(now.seconds)" class="text-xs border px-2 py-1 rounded">填入当前</button>
        </div>
      </div>
      <div class="card p-4">
        <h3 class="font-medium text-sm mb-3">日期 → 时间戳</h3>
        <input v-model="dateInput" class="w-full px-3 py-2 border rounded-lg text-sm mb-2" placeholder="2026-08-28 14:30:20" />
        <div class="p-3 bg-slate-50 dark:bg-slate-800 rounded font-mono text-sm">{{ dateToTs }}</div>
        <div class="text-xs text-muted-foreground mt-1">支持 ISO8601、YYYY-MM-DD HH:mm:ss、RFC3339</div>
        <div class="flex gap-2 mt-2">
          <button @click="copyToClipboard(dateToTs)" class="text-xs border px-2 py-1 rounded">复制</button>
          <button @click="dateInput=now.local" class="text-xs border px-2 py-1 rounded">填入当前</button>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>
