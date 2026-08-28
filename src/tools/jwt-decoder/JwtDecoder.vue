<script setup lang="ts">
import { ref, computed } from 'vue'
import ToolLayout from '@/layouts/ToolLayout.vue'
import CodeEditor from '@/components/editor/CodeEditor.vue'
import { decodeJwt } from './processor'
import { copyToClipboard } from '@/composables/useClipboard'

const input = ref('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkRldkJveCIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxNzE2MjM5MDIyLCJpc3MiOiJkZXZib3gifQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c')
const result = computed(()=> decodeJwt(input.value))
</script>
<template>
  <ToolLayout>
    <div class="mb-2 text-sm font-medium">输入 JWT</div>
    <CodeEditor v-model="input" language="text" placeholder="eyJhbGciOiJIUzI1Ni..." />
    <div v-if="result.error" class="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded text-sm text-red-600">{{ result.error }}</div>
    <div v-else-if="result.valid" class="mt-4 grid lg:grid-cols-2 gap-4">
      <div>
        <div class="flex items-center gap-2 mb-2"><span class="text-sm font-semibold">HEADER</span><button @click="copyToClipboard(result.headerJson||'')" class="text-xs border px-2 py-0.5 rounded">复制</button></div>
        <CodeEditor :modelValue="result.headerJson||''" language="json" :readonly="true" />
        <div class="mt-4 flex items-center gap-2 mb-2"><span class="text-sm font-semibold">PAYLOAD</span><button @click="copyToClipboard(result.payloadJson||'')" class="text-xs border px-2 py-0.5 rounded">复制</button></div>
        <CodeEditor :modelValue="result.payloadJson||''" language="json" :readonly="true" />
      </div>
      <div class="space-y-3">
        <div class="bg-white dark:bg-slate-900 border rounded-lg p-4">
          <h4 class="font-medium text-sm mb-2">签名 Signature</h4>
          <p class="font-mono text-xs break-all bg-slate-50 dark:bg-slate-800 p-2 rounded">{{ result.signature }}</p>
          <p class="text-xs text-amber-600 dark:text-amber-400 mt-2">⚠️ JWT 解码不代表签名验证成功。验证需服务端使用密钥。</p>
        </div>
        <div class="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 text-sm space-y-1">
          <div class="flex justify-between"><span class="text-muted-foreground">算法 alg</span><span class="font-mono">{{ result.header?.alg }}</span></div>
          <div class="flex justify-between"><span class="text-muted-foreground">类型 typ</span><span class="font-mono">{{ result.header?.typ }}</span></div>
          <div v-if="result.issuedAt" class="flex justify-between"><span class="text-muted-foreground">签发时间 iat</span><span>{{ result.issuedAt }}</span></div>
          <div v-if="result.expiration" class="flex justify-between"><span class="text-muted-foreground">过期时间 exp</span><span>{{ result.expiration }}</span></div>
          <div v-if="result.payload?.iss" class="flex justify-between"><span class="text-muted-foreground">签发者 iss</span><span>{{ result.payload.iss }}</span></div>
          <div v-if="result.payload?.sub" class="flex justify-between"><span class="text-muted-foreground">主题 sub</span><span>{{ result.payload.sub }}</span></div>
        </div>
        <div class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded text-xs text-blue-700 dark:text-blue-300">所有解码在浏览器本地完成，不会发送到服务器。</div>
      </div>
    </div>
  </ToolLayout>
</template>
