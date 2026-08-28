<script setup lang="ts">
import { ref, computed } from 'vue'
import ToolLayout from '@/layouts/ToolLayout.vue'
import CodeEditor from '@/components/editor/CodeEditor.vue'
import { renderMarkdown } from './processor'
import { copyToClipboard } from '@/composables/useClipboard'

const input = ref(`# DevBox\n\n> 程序员工具箱\n\n## Features\n\n- **Fast** - 打开即用\n- *Private* - 本地处理\n- [Link](https://example.com)\n\n\`\`\`js\nconsole.log("hello")\n\`\`\`\n\n| 工具 | 描述 |\n|------|------|\n| JSON | 格式化 |\n| Base64 | 编码 |\n`)
const html = computed(()=> renderMarkdown(input.value))
</script>
<template>
  <ToolLayout>
    <div class="grid lg:grid-cols-2 gap-4">
      <div>
        <div class="text-sm font-medium mb-2 flex items-center gap-2">Markdown 输入 <button @click="copyToClipboard(input)" class="text-xs border px-2 py-0.5 rounded">复制</button></div>
        <CodeEditor v-model="input" language="markdown" />
      </div>
      <div>
        <div class="text-sm font-medium mb-2 flex items-center gap-2">预览 <button @click="copyToClipboard(html)" class="text-xs border px-2 py-0.5 rounded">复制 HTML</button></div>
        <div class="border rounded-lg p-4 bg-white dark:bg-slate-900 min-h-[380px] text-sm leading-6 max-w-none overflow-auto" v-html="html"></div>
        <div class="mt-2">
          <div class="text-xs font-medium mb-1">HTML 源码</div>
          <CodeEditor :modelValue="html" language="html" :readonly="true" />
        </div>
      </div>
    </div>
  </ToolLayout>
</template>
