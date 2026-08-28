<script setup lang="ts">
import { ref, computed } from 'vue'
import ToolLayout from '@/layouts/ToolLayout.vue'
import { calcCidr } from './processor'
import { copyToClipboard } from '@/composables/useClipboard'

const input = ref('192.168.1.0/24')
const result = computed(()=> calcCidr(input.value))
</script>
<template>
  <ToolLayout>
    <div class="max-w-xl">
      <label class="text-sm font-medium">CIDR</label>
      <input v-model="input" class="mt-1 w-full px-3 py-3 border rounded-lg font-mono text-sm" placeholder="192.168.1.0/24" />
      <div class="flex gap-1.5 mt-2">
        <button v-for="p in ['192.168.1.0/24','10.0.0.0/8','172.16.0.0/12','192.168.0.0/16']" :key="p" @click="input=p" class="text-xs px-2 py-1 border rounded-full font-mono">{{ p }}</button>
      </div>

      <div v-if="!result.valid" class="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded text-sm text-red-600">{{ result.error }}</div>
      <div v-else class="mt-4 border rounded-lg overflow-hidden divide-y">
        <div v-for="(v,k) in { Network: result.network, Broadcast: result.broadcast, 'First IP': result.first, 'Last IP': result.last, Total: String(result.total), Usable: String(result.usable), Mask: result.mask, CIDR: result.cidr }" :key="k" class="flex items-center gap-2 px-3 py-2.5 text-sm">
          <span class="w-24 font-medium text-muted-foreground">{{ k }}</span>
          <code class="flex-1 font-mono bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded text-xs">{{ v }}</code>
          <button @click="copyToClipboard(String(v))" class="text-xs border px-2 py-0.5 rounded">复制</button>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>
