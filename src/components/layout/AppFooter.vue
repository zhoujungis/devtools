<script setup lang="ts">
import { tools } from '@/data/tools'
</script>
<template>
  <footer class="border-t mt-12 py-8 text-center text-sm text-muted-foreground">
    <div class="mx-auto max-w-[1400px] px-4">
      <p class="font-medium text-foreground">DevBox · 程序员工具箱</p>
      <p class="mt-1">{{ tools.length }} 个快速、免费、隐私优先的开发者工具 · 数据默认在浏览器本地处理</p>
      <p class="mt-2 text-xs">© 2026 DevBox · Fast · Private · Useful · <a href="https://github.com" class="hover:underline">GitHub</a></p>
    </div>
  </footer>
</template>
