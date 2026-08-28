<script setup lang="ts">
import { ref, computed } from 'vue'
import ToolLayout from '@/layouts/ToolLayout.vue'
import { testRegex, presets } from './processor'
import { copyToClipboard } from '@/composables/useClipboard'
import DOMPurify from 'dompurify'

const pattern = ref('^[a-zA-Z0-9]+$')
const flags = ref('g')
const text = ref('hello123\nHello\n123')
const replaceWith = ref('[$&]')
const result = computed(()=> testRegex(pattern.value, flags.value, text.value, replaceWith.value))
function escapeHtml(value:string) {
  return value.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;')
}
const highlightHtml = computed(()=>{
  if(!result.value.isValid || !pattern.value) return DOMPurify.sanitize(escapeHtml(text.value), { ALLOWED_TAGS: [] })
  try{
    const re = new RegExp(pattern.value, flags.value.includes('g')? flags.value : flags.value+'g')
    const highlighted = text.value.replace(re, (m)=> `<mark class="bg-amber-200 dark:bg-amber-600 px-0.5 rounded">${escapeHtml(m)}</mark>`)
    return DOMPurify.sanitize(highlighted, { ALLOWED_TAGS: ['mark'], ALLOWED_ATTR: ['class'] })
  }catch{ return DOMPurify.sanitize(escapeHtml(text.value), { ALLOWED_TAGS: [] }) }
})
function applyPreset(k:string){ const p=(presets as any)[k]; pattern.value=p.pattern; flags.value=p.flags; text.value=p.text }
</script>
<template>
  <ToolLayout>
    <div class="space-y-4">
      <div>
        <label class="text-sm font-medium">正则表达式</label>
        <div class="flex gap-2 mt-1">
          <span class="px-2 py-2 bg-slate-100 dark:bg-slate-800 rounded-l border-y border-l font-mono">/</span>
          <input v-model="pattern" class="flex-1 px-3 py-2 border-y font-mono text-sm" placeholder="^[a-z]+" />
          <span class="px-2 py-2 bg-slate-100 dark:bg-slate-800 font-mono">/</span>
          <input v-model="flags" class="w-20 px-2 py-2 border rounded-r font-mono text-sm" placeholder="gim" />
        </div>
        <div class="flex flex-wrap gap-1.5 mt-2">
          <span class="text-xs text-muted-foreground">模板:</span>
          <button v-for="(_,k) in presets" :key="k" @click="applyPreset(k)" class="text-xs px-2 py-0.5 border rounded-full hover:bg-slate-50 dark:hover:bg-slate-800">{{ k }}</button>
          <label class="text-xs flex items-center gap-1 ml-2" v-for="f in ['g','i','m','s','u']" :key="f"><input type="checkbox" :checked="flags.includes(f)" @change="()=> flags.includes(f)? flags=flags.replace(f,'') : flags+=f" />{{ f }}</label>
        </div>
        <div v-if="result.error" class="mt-2 text-xs text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded p-2">{{ result.error }}</div>
      </div>

      <div class="grid lg:grid-cols-2 gap-4">
        <div>
          <label class="text-sm font-medium">测试文本</label>
          <textarea v-model="text" rows="8" class="mt-1 w-full px-3 py-2 border rounded-lg font-mono text-sm" placeholder="输入要测试的文本..."></textarea>
          <div class="mt-2">
            <label class="text-xs">替换为 (replace)</label>
            <input v-model="replaceWith" class="w-full px-2 py-1 border rounded font-mono text-xs mt-1" placeholder="[$&] $1 ..." />
            <div v-if="result.replaced!==undefined" class="mt-1 p-2 bg-slate-50 dark:bg-slate-800 rounded font-mono text-xs break-all">{{ result.replaced }}</div>
          </div>
        </div>
        <div>
          <div class="text-sm font-medium flex items-center gap-2">结果 <span v-if="result.isValid" :class="result.matches.length? 'text-green-600':'text-amber-600'" class="text-xs">{{ result.matches.length? `✓ 匹配 ${result.matches.length} 处` : '○ 无匹配' }}</span></div>
          <div class="mt-1 border rounded-lg p-3 bg-slate-50 dark:bg-slate-900 min-h-[140px] font-mono text-sm whitespace-pre-wrap break-all" v-html="highlightHtml"></div>

          <div v-if="result.matches.length" class="mt-3 border rounded-lg overflow-hidden">
            <div class="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 text-xs font-medium">匹配详情</div>
            <div class="divide-y max-h-[200px] overflow-auto">
              <div v-for="(m,i) in result.matches" :key="i" class="px-3 py-1.5 text-xs font-mono flex gap-2">
                <span class="text-muted-foreground">#{{ i+1 }}</span>
                <span class="bg-amber-100 dark:bg-amber-900/30 px-1 rounded">{{ m.match }}</span>
                <span class="text-muted-foreground">@{{ m.index }}</span>
                <span v-if="m.groups.length" class="ml-auto">groups: {{ m.groups.join(', ') }}</span>
                <button @click="copyToClipboard(m.match)" class="ml-auto border px-1 rounded">复制</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>
