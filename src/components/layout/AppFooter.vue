<script setup lang="ts">
import { tools } from '@/data/tools'
</script>
<template>
  <footer class="border-t mt-12 py-8 text-center text-sm text-muted-foreground">
    <div class="mx-auto max-w-[1400px] px-4">
      <p class="font-medium text-foreground flex items-center justify-center gap-2">
        <span class="w-5 h-5 rounded-md brand-gradient flex items-center justify-center text-white text-[10px]">D</span>
        DevBox · 程序员工具箱
      </p>
      <p class="mt-1">{{ tools.length }} 个快速、免费、隐私优先的开发者工具 · 数据默认在浏览器本地处理</p>
      <p class="mt-2 text-xs">© 2026 DevBox · Fast · Private · Useful · <a href="https://github.com" class="hover:text-primary hover:underline transition-colors">GitHub</a></p>
    </div>
  </footer>
</template>
