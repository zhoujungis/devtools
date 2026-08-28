<script setup lang="ts">
import { ref, computed } from 'vue'
import ToolLayout from '@/layouts/ToolLayout.vue'
import { parseCron } from './processor'

const input = ref('*/5 * * * *')
const result = computed(()=> parseCron(input.value))
const presets = ['* * * * *','*/5 * * * *','0 * * * *','0 0 * * *','0 9 * * 1','30 2 * * *']
</script>
<template>
  <ToolLayout>
    <div class="max-w-2xl">
      <label class="text-sm font-medium">Cron 表达式</label>
      <input v-model="input" class="mt-1 w-full px-3 py-3 border rounded-lg font-mono text-sm" placeholder="*/5 * * * *" />
      <div class="flex flex-wrap gap-1.5 mt-2">
        <button v-for="p in presets" :key="p" @click="input=p" class="text-xs px-2 py-1 border rounded-full font-mono hover:bg-slate-50 dark:hover:bg-slate-800">{{ p }}</button>
      </div>

      <div v-if="!result.valid" class="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded text-sm text-red-600">{{ result.error }}</div>
      <div v-else class="mt-4 space-y-3">
        <div class="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 rounded">
          <div class="font-medium text-green-700 dark:text-green-300">{{ result.desc }}</div>
        </div>
        <div class="border rounded-lg overflow-hidden">
          <div class="px-3 py-2 bg-slate-50 dark:bg-slate-800 text-xs font-medium">未来 5 次执行时间</div>
          <div class="divide-y font-mono text-sm">
            <div v-for="(t,i) in result.next" :key="i" class="px-3 py-2 flex justify-between"><span class="text-muted-foreground">#{{ i+1 }}</span><span>{{ t }}</span></div>
          </div>
        </div>
        <div class="text-xs text-muted-foreground">格式: 分 时 日 月 周 (0-59 0-23 1-31 1-12 0-7)</div>
      </div>
    </div>
  </ToolLayout>
</template>
