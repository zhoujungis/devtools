<script setup lang="ts">
import { ref } from 'vue'
import ToolLayout from '@/layouts/ToolLayout.vue'
import { copyToClipboard } from '@/composables/useClipboard'

const host = ref('example.com')
const command = () => `ping ${host.value.trim() || 'example.com'}`
</script>
<template>
  <ToolLayout>
    <div class="max-w-2xl space-y-4">
      <div class="p-4 rounded-lg border border-blue-200 bg-blue-50 dark:bg-blue-900/20 text-sm text-blue-800 dark:text-blue-200">
        出于浏览器安全模型限制，网页无法直接创建 ICMP Echo 请求，也无法读取系统级 ping 的结果。需要真实 ICMP 测试时，请在终端或桌面端运行命令。
      </div>
      <label class="block text-sm font-medium">主机名或 IP
        <input v-model="host" class="mt-1 w-full px-3 py-2.5 border rounded-lg font-mono text-sm bg-white dark:bg-slate-900" placeholder="example.com" />
      </label>
      <div class="border rounded-lg overflow-hidden">
        <div class="px-3 py-2 bg-slate-50 dark:bg-slate-800 text-xs font-medium flex justify-between"><span>Windows / macOS / Linux</span><button @click="copyToClipboard(command())" class="text-xs border px-2 py-1 rounded">复制命令</button></div>
        <code class="block p-4 font-mono text-sm">{{ command() }}</code>
      </div>
      <p class="text-xs text-muted-foreground">Windows 默认发送 4 个请求；Linux 和 macOS 可使用 <code>ping -c 4 {{ host || 'example.com' }}</code>。</p>
    </div>
  </ToolLayout>
</template>
