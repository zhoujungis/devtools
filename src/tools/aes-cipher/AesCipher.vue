<script setup lang="ts">
import { ref } from 'vue'
import ToolLayout from '@/layouts/ToolLayout.vue'
import CodeEditor from '@/components/editor/CodeEditor.vue'
import { encryptText, decryptText } from './processor'
import { copyToClipboard } from '@/composables/useClipboard'
import { useToastStore } from '@/stores/toast'
import { Lock, Unlock } from 'lucide-vue-next'

const toast = useToastStore()
const mode = ref<'encrypt' | 'decrypt'>('encrypt')
const password = ref('')
const input = ref('')
const output = ref('')
const busy = ref(false)

async function run() {
  if (!password.value || !input.value) { toast.show('请输入内容和密码', 'warning'); return }
  busy.value = true
  try {
    output.value = mode.value === 'encrypt'
      ? await encryptText(input.value, password.value)
      : await decryptText(input.value, password.value)
  } catch (e) {
    output.value = ''
    toast.show(mode.value === 'decrypt' ? '解密失败：密码错误或数据损坏' : '加密失败', 'error')
  } finally {
    busy.value = false
  }
}

function swap() {
  input.value = output.value
  output.value = ''
  mode.value = mode.value === 'encrypt' ? 'decrypt' : 'encrypt'
}
</script>
<template>
  <ToolLayout>
    <div class="space-y-4">
      <div class="card p-4">
        <div class="flex flex-wrap items-center gap-2">
          <button @click="mode='encrypt'" :class="['btn-ghost', mode==='encrypt' && '!text-primary bg-primary/10']"><Lock class="w-4 h-4" /> 加密</button>
          <button @click="mode='decrypt'" :class="['btn-ghost', mode==='decrypt' && '!text-primary bg-primary/10']"><Unlock class="w-4 h-4" /> 解密</button>
          <div class="flex-1"></div>
          <button @click="swap" class="btn-ghost border-border">结果 → 输入</button>
        </div>
        <p class="text-xs text-muted-foreground mt-2">
          AES-256-GCM · PBKDF2(150000 次, SHA-256) 派生密钥 · 输出为 Base64(盐 16B + IV 12B + 密文)，全部在浏览器本地完成
        </p>
      </div>

      <div>
        <div class="text-sm font-medium mb-2">{{ mode === 'encrypt' ? '明文' : '密文 (Base64)' }}</div>
        <CodeEditor v-model="input" language="text" :placeholder="mode === 'encrypt' ? '输入要加密的文本...' : '粘贴 Base64 密文...'" />
      </div>

      <div class="flex items-center gap-2">
        <input v-model="password" type="password" placeholder="密码（用于派生密钥）" class="flex-1 px-3 py-2 rounded-lg border bg-white dark:bg-slate-900 text-sm" />
        <button @click="run" :disabled="busy" class="btn-primary shrink-0 disabled:opacity-50">{{ busy ? '处理中...' : mode === 'encrypt' ? '加密' : '解密' }}</button>
        <button v-if="output" @click="copyToClipboard(output)" class="btn-ghost border-border shrink-0">复制结果</button>
      </div>

      <div v-if="output">
        <div class="text-sm font-medium mb-2">结果</div>
        <code class="block text-xs font-mono break-all bg-slate-50 dark:bg-slate-800 border px-3 py-2 rounded-lg">{{ output }}</code>
      </div>
    </div>
  </ToolLayout>
</template>
