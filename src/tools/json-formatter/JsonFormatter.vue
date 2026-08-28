<script setup lang="ts">
import { ref, computed } from 'vue'
import ToolLayout from '@/layouts/ToolLayout.vue'
import CodeEditor from '@/components/editor/CodeEditor.vue'
import { formatJson } from './processor'
import { copyToClipboard } from '@/composables/useClipboard'
import { downloadText } from '@/utils/download'
import { useToastStore } from '@/stores/toast'

const input = ref('{\n  "name": "DevBox",\n  "version": "1.0.0",\n  "features": ["fast","private","useful"]\n}')
const indent = ref(2)
const toast = useToastStore()

const result = computed(() => formatJson(input.value, indent.value))
const output = computed(() => result.value.valid ? result.value.formatted : result.value.error || '')

function doFormat(){ // trigger via computed already
  if(result.value.valid) toast.show('✓ 已格式化')
  else toast.show('✗ JSON 错误', 'error')
}
function doMinify(){
  if(!result.value.valid){ toast.show(result.value.error||'格式错误','error'); return }
  input.value = result.value.minified
  toast.show('✓ 已压缩')
}
function doCopy(){ copyToClipboard(output.value) }
function doDownload(){ downloadText('formatted.json', output.value, 'application/json') }
function doClear(){ input.value='' }
</script>
<template>
  <ToolLayout>
    <div class="flex flex-wrap gap-2 mb-4 text-sm">
      <label class="flex items-center gap-2">缩进
        <select v-model.number="indent" class="border rounded px-2 py-1 bg-white dark:bg-slate-900">
          <option :value="2">2 空格</option>
          <option :value="4">4 空格</option>
          <option :value="0">Tab</option>
        </select>
      </label>
      <div class="flex-1"></div>
      <button @click="doFormat" class="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg">格式化</button>
      <button @click="doMinify" class="px-3 py-1.5 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">压缩</button>
      <button @click="doCopy" class="px-3 py-1.5 border rounded-lg">复制</button>
      <button @click="doDownload" class="px-3 py-1.5 border rounded-lg">下载</button>
      <button @click="doClear" class="px-3 py-1.5 border rounded-lg">清空</button>
    </div>

    <div v-if="!result.valid" class="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-300">
      <div class="font-medium">❌ JSON 格式错误 <span v-if="result.line">第 {{result.line}} 行，第 {{result.column}} 列</span></div>
      <div class="font-mono text-xs mt-1 break-all">{{ result.error }}</div>
      <div class="text-xs mt-1 opacity-80">请检查附近的括号、引号或逗号。</div>
    </div>

    <div class="grid lg:grid-cols-2 gap-4">
      <div>
        <div class="text-sm font-medium mb-2">输入</div>
        <CodeEditor v-model="input" language="json" placeholder='粘贴 JSON...' />
      </div>
      <div>
        <div class="text-sm font-medium mb-2">输出 <span v-if="result.valid" class="text-xs font-normal text-green-600">✓ 有效 JSON</span></div>
        <CodeEditor :modelValue="output" language="json" :readonly="true" />
        <div class="mt-2 flex gap-2">
          <button @click="copyToClipboard(output)" class="flex-1 py-1.5 border rounded-lg text-sm">一键复制结果</button>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>
