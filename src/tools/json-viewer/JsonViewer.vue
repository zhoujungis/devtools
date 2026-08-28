<script setup lang="ts">
import { ref, computed } from 'vue'
import ToolLayout from '@/layouts/ToolLayout.vue'
import CodeEditor from '@/components/editor/CodeEditor.vue'
import { parseJsonSafe } from './processor'
import { copyToClipboard } from '@/composables/useClipboard'

const input = ref('{"name":"DevBox","stack":["Vue","TypeScript","Vite"],"meta":{"author":"AI","private":true,"count":42}}')
const expanded = ref<Set<string>>(new Set(['$']))
const parsed = computed(()=> parseJsonSafe(input.value))

function collectExpandablePaths(value: unknown, path = '$', result = new Set<string>()) {
  if (!value || typeof value !== 'object') return result
  result.add(path)
  if (Array.isArray(value)) value.forEach((item, index) => collectExpandablePaths(item, `${path}.${index}`, result))
  else Object.entries(value).forEach(([key, item]) => collectExpandablePaths(item, `${path}.${key}`, result))
  return result
}

function toggle(path:string){
  if(expanded.value.has(path)) expanded.value.delete(path)
  else expanded.value.add(path)
  expanded.value = new Set(expanded.value)
}
function expandAll() { expanded.value = collectExpandablePaths(parsed.value.data) }
function collapseAll() { expanded.value = new Set(['$']) }
</script>
<template>
  <ToolLayout>
    <div class="grid lg:grid-cols-2 gap-4">
      <div>
        <div class="text-sm font-medium mb-2">输入 JSON</div>
        <CodeEditor v-model="input" language="json" />
        <div v-if="parsed.error" class="mt-2 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded p-2 font-mono text-xs break-all">{{ parsed.error }}</div>
      </div>
      <div>
        <div class="text-sm font-medium mb-2 flex items-center gap-2">树形视图
          <button @click="expandAll" class="text-xs border px-2 py-0.5 rounded">全部展开</button>
          <button @click="collapseAll" class="text-xs border px-2 py-0.5 rounded">全部折叠</button>
        </div>
        <div class="border rounded-lg p-3 bg-slate-50 dark:bg-slate-900 min-h-[300px] font-mono text-sm overflow-auto">
          <div v-if="parsed.error" class="text-muted-foreground">等待有效 JSON...</div>
          <JsonNodeView v-else :data="parsed.data" path="$" :expanded="expanded" @toggle="toggle" />
        </div>
        <div class="mt-2 text-xs text-muted-foreground">点击 ▶ 展开/折叠 · 数据本地解析</div>
      </div>
    </div>
  </ToolLayout>
</template>

<script lang="ts">
import { defineComponent, h } from 'vue'
const JsonNodeView: any = defineComponent({
  props:{ data: null, path:{type:String,required:true}, expanded:{type:Object as any, required:true}, keyName:{type:String, default:''} },
  emits:['toggle'],
  setup(props, {emit}){
    return (): any => {
      const v:any = (props as any).data
      const t = v===null?'null':Array.isArray(v)?'array':typeof v
      const isObj = t==='object' || t==='array'
      const path = (props as any).path
      const expanded = (props as any).expanded as Set<string>
      const exp = expanded.has(path)
      const keyName = (props as any).keyName
      if(!isObj){
        return h('div',{class:'flex gap-2 py-0.5'},
          [ keyName? h('span',{class:'text-violet-600 dark:text-violet-400'}, keyName+':'):null,
            h('span',{class: t==='string'?'text-green-600': t==='number'?'text-blue-600': t==='boolean'?'text-orange-600':'text-slate-500', onClick:()=> copyToClipboard(String(v)) }, t==='string'?`"${v}"`: String(v)),
            h('span',{class:'text-xs text-muted-foreground'}, `(${t})`)
          ])
      }
      const entries = t==='array' ? (v as any[]).map((val,i)=>({k:String(i), val})) : Object.entries(v).map(([k,val])=>({k, val}))
      return h('div', {class:'ml-1'},
        [
          h('div',{class:'flex items-center gap-1 cursor-pointer select-none', onClick:()=> emit('toggle', path)},
            [ h('span',{class:'w-4 text-center text-muted-foreground'}, exp?'▼':'▶'),
              keyName? h('span',{class:'text-violet-600'}, keyName+':'):null,
              h('span',{class:'text-slate-500 text-xs'}, t==='array'?`Array[${entries.length}]`:`Object {${entries.length}}`),
              h('span',{class:'text-xs text-muted-foreground ml-1'}, exp?'':'... '+ (t==='array'?' ]': ' }'))
            ]),
          exp? h('div',{class:'ml-4 border-l border-slate-200 dark:border-slate-700 pl-2'},
            entries.map(e=> h(JsonNodeView as any, { data:e.val, path: path+'.'+e.k, expanded, keyName:e.k, onToggle:(p:string)=> emit('toggle',p) }))) : null
        ])
    }
  }
})
</script>
