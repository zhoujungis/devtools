<script setup lang="ts">
import { ref, computed } from 'vue'
import ToolLayout from '@/layouts/ToolLayout.vue'
import CodeEditor from '@/components/editor/CodeEditor.vue'
import { formatSql, type SqlDialect } from './processor'
import { copyToClipboard } from '@/composables/useClipboard'

const input = ref('select * from users where id=1 and status=1 order by created_at desc limit 10')
const dialect = ref<SqlDialect>('mysql')
const result = computed(()=> formatSql(input.value, dialect.value))
</script>
<template>
  <ToolLayout>
    <div class="flex flex-wrap gap-2 mb-4">
      <select v-model="dialect" class="px-3 py-1.5 border rounded-full text-sm bg-white dark:bg-slate-900">
        <option value="mysql">MySQL</option>
        <option value="postgresql">PostgreSQL</option>
        <option value="sqlite">SQLite</option>
        <option value="sql">SQL 通用</option>
        <option value="oracle">Oracle</option>
        <option value="tsql">SQL Server</option>
      </select>
      <button @click="copyToClipboard(result.formatted)" class="px-3 py-1.5 bg-primary text-primary-foreground rounded-full text-sm">复制结果</button>
      <button @click="input=''" class="px-3 py-1.5 border rounded-full text-sm">清空</button>
    </div>
    <div v-if="result.error" class="mb-3 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded text-xs text-red-600">{{ result.error }}</div>
    <div class="grid lg:grid-cols-2 gap-4">
      <div>
        <div class="text-sm font-medium mb-2">输入 SQL</div>
        <CodeEditor v-model="input" language="sql" />
      </div>
      <div>
        <div class="text-sm font-medium mb-2">格式化结果</div>
        <CodeEditor :modelValue="result.formatted" language="sql" :readonly="true" />
      </div>
    </div>
  </ToolLayout>
</template>
