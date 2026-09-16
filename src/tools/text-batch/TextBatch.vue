<script setup lang="ts">
import { ref, computed } from 'vue'
import ToolLayout from '@/layouts/ToolLayout.vue'
import CodeEditor from '@/components/editor/CodeEditor.vue'
import { applyOps, findReplace, OP_LABELS, type BatchOp } from './processor'
import { copyToClipboard } from '@/composables/useClipboard'

const input = ref('banana\napple\nbanana\n\nCherry')
const selected = ref<BatchOp[]>(['dedupe', 'removeEmpty'])
const replaceFind = ref('')
const replaceWith = ref('')
const useRegex = ref(false)
const caseSensitive = ref(false)

const replaceResult = computed(() => findReplace(input.value, { find: replaceFind.value, replace: replaceWith.value, regex: useRegex.value, caseSensitive: caseSensitive.value }))

function toggle(op: BatchOp) {
  const i = selected.value.indexOf(op)
  if (i >= 0) selected.value.splice(i, 1)
  else selected.value.push(op)
}

const output = computed(() => {
  let out = applyOps(selected.value.length ? input.value : input.value, selected.value)
  if (replaceFind.value) out = replaceResult.value.output
  return out
})
</script>
<template>
  <ToolLayout>
    <div class="space-y-4">
      <div class="card p-4">
        <div class="text-sm font-medium mb-2">处理操作（按顺序应用）</div>
        <div class="flex flex-wrap gap-2">
          <button v-for="(label, op) in OP_LABELS" :key="op" @click="toggle(op as BatchOp)"
                  :class="['text-xs px-2.5 py-1.5 rounded-full border transition-colors', selected.includes(op as BatchOp) ? 'bg-primary/10 border-primary/40 text-primary' : 'hover:border-primary/40 text-muted-foreground']">
            {{ label }}
          </button>
        </div>
        <div class="mt-3 flex flex-wrap items-center gap-2">
          <input v-model="replaceFind" placeholder="查找（支持正则开关）" class="flex-1 min-w-[160px] px-3 py-1.5 rounded-lg border text-sm bg-white dark:bg-slate-900" />
          <input v-model="replaceWith" placeholder="替换为" class="flex-1 min-w-[160px] px-3 py-1.5 rounded-lg border text-sm bg-white dark:bg-slate-900" />
          <label class="flex items-center gap-1.5 text-xs text-muted-foreground"><input type="checkbox" v-model="useRegex" class="accent-blue-600" /> 正则</label>
          <label class="flex items-center gap-1.5 text-xs text-muted-foreground"><input type="checkbox" v-model="caseSensitive" class="accent-blue-600" /> 区分大小写</label>
          <span v-if="replaceFind" class="text-xs text-muted-foreground">{{ replaceResult.matches }} 处匹配</span>
        </div>
      </div>

      <div class="grid lg:grid-cols-2 gap-4">
        <div>
          <div class="text-sm font-medium mb-2">输入</div>
          <CodeEditor v-model="input" language="text" />
        </div>
        <div>
          <div class="text-sm font-medium mb-2">输出</div>
          <pre class="text-sm font-mono bg-slate-50 dark:bg-slate-800 border rounded-lg p-3 overflow-auto max-h-[420px] whitespace-pre-wrap">{{ output }}</pre>
        </div>
      </div>
      <div class="flex justify-end">
        <button @click="copyToClipboard(output)" class="btn-primary">复制结果</button>
      </div>
    </div>
  </ToolLayout>
</template>
