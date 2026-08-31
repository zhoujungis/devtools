<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { EditorView, placeholder as cmPlaceholder } from '@codemirror/view'
import { EditorState, Compartment, type Extension } from '@codemirror/state'
import { basicSetup } from 'codemirror'
import { oneDark } from '@codemirror/theme-one-dark'

const props = withDefaults(defineProps<{
  modelValue: string
  language?: 'json'|'javascript'|'html'|'css'|'markdown'|'sql'|'yaml'|'xml'|'text'
  placeholder?: string
  ariaLabel?: string
  readonly?: boolean
}>(), {
  language: 'text',
  placeholder: '',
  ariaLabel: '',
  readonly: false
})
const emit = defineEmits<{ (e:'update:modelValue', v:string): void }>()

const editorRef = ref<HTMLDivElement>()
let view: EditorView | null = null
let languageCompartment: Compartment
let themeCompartment: Compartment
let readonlyCompartment: Compartment
let editorToken = 0

async function langExt(): Promise<Extension> {
  switch(props.language){
    case 'json': return (await import('@codemirror/lang-json')).json()
    case 'javascript': return (await import('@codemirror/lang-javascript')).javascript()
    case 'html': return (await import('@codemirror/lang-html')).html()
    case 'css': return (await import('@codemirror/lang-css')).css()
    case 'markdown': return (await import('@codemirror/lang-markdown')).markdown()
    case 'sql': return (await import('@codemirror/lang-sql')).sql()
    case 'yaml': return (await import('@codemirror/lang-yaml')).yaml()
    case 'xml': return (await import('@codemirror/lang-xml')).xml()
    default: return []
  }
}

function isDark(){ return document.documentElement.classList.contains('dark') }
function themeExt(): Extension { return isDark() ? oneDark : [] }

async function createEditor(){
  if(!editorRef.value) return
  const token = ++editorToken
  const language = await langExt()
  if (token !== editorToken || !editorRef.value) return
  const updateListener = EditorView.updateListener.of(vu => {
    if(vu.docChanged){
      const txt = vu.state.doc.toString()
      if(txt !== props.modelValue) emit('update:modelValue', txt)
    }
  })
  const extensions: Extension[] = [
    basicSetup,
    languageCompartment.of(language),
    updateListener,
    EditorView.lineWrapping,
    themeCompartment.of(themeExt()),
    readonlyCompartment.of(EditorState.readOnly.of(props.readonly)),
  ]
  if (props.placeholder) extensions.push(cmPlaceholder(props.placeholder))
  const state = EditorState.create({ doc: props.modelValue, extensions })
  view = new EditorView({ state, parent: editorRef.value })
  if (props.ariaLabel) view.contentDOM.setAttribute('aria-label', props.ariaLabel)
}

watch(() => props.modelValue, v => {
  if(view && v !== view.state.doc.toString()){
    view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: v } })
  }
})
watch(() => props.language, async () => {
  const token = ++editorToken
  const language = await langExt()
  if(view && token === editorToken) view.dispatch({ effects: languageCompartment.reconfigure(language) })
})
watch(() => props.readonly, value => {
  if(view) view.dispatch({ effects: readonlyCompartment.reconfigure(EditorState.readOnly.of(value)) })
})

let mo: MutationObserver | null = null
onMounted(() => {
  languageCompartment = new Compartment()
  themeCompartment = new Compartment()
  readonlyCompartment = new Compartment()
  createEditor()
  mo = new MutationObserver(() => {
    if(view) view.dispatch({ effects: themeCompartment.reconfigure(themeExt()) })
  })
  mo.observe(document.documentElement, { attributes:true, attributeFilter:['class'] })
})
onBeforeUnmount(() => { editorToken++; view?.destroy(); mo?.disconnect() })

defineExpose({ focus: () => view?.focus() })
</script>
<template>
  <div ref="editorRef" class="min-h-[180px] text-sm"></div>
</template>
