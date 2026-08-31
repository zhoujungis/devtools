<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { getToolByPath } from '@/data/tools'
import { useFavoritesStore } from '@/stores/favorites'
import { useRecentStore } from '@/stores/recent'
import { Star } from 'lucide-vue-next'
import ToolIcon from '@/components/common/ToolIcon.vue'
import { watch } from 'vue'

defineProps<{ title?: string }>()
const route = useRoute()
const tool = computed(()=> getToolByPath(route.path))
const fav = useFavoritesStore()
const recent = useRecentStore()

watch(() => route.path, () => {
  if(tool.value) recent.push(tool.value.id)
}, { immediate: true })

const isFav = computed(()=> tool.value ? fav.isFavorite(tool.value.id) : false)
const processingMode = computed(() => tool.value?.processing || 'local')
const usesExternalService = computed(() => processingMode.value === 'external')
const hasOptionalExternalService = computed(() => processingMode.value === 'mixed')
</script>
<template>
  <div class="max-w-[1400px] mx-auto">
    <div class="flex items-center gap-2 text-sm text-muted-foreground mb-4">
      <router-link to="/" class="hover:text-foreground">首页</router-link>
      <span>/</span>
      <router-link v-if="tool" :to="`/category/${tool.category}`" class="hover:text-foreground">{{ tool.category }}</router-link>
      <span>/</span>
      <span class="text-foreground font-medium">{{ tool?.nameZh || title }}</span>
    </div>

    <div class="bg-white dark:bg-slate-900 rounded-xl border p-6 mb-6">
      <div class="flex items-start justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold flex items-center gap-3">
            <span v-if="tool" class="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400"><ToolIcon :name="tool.icon" class="w-5 h-5" /></span>
            {{ tool?.nameZh }}
            <span class="text-sm font-normal text-muted-foreground hidden sm:inline">{{ tool?.name }}</span>
          </h1>
          <p class="text-sm text-muted-foreground mt-1">{{ tool?.description }}</p>
          <p class="text-xs mt-2 inline-flex items-center gap-1.5 px-2 py-1 rounded-full" :class="usesExternalService || hasOptionalExternalService ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300' : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'">
            <span class="w-2 h-2 rounded-full" :class="usesExternalService || hasOptionalExternalService ? 'bg-amber-500' : 'bg-green-500 animate-pulse'"></span> {{ usesExternalService ? '包含外部请求 · 请注意隐私' : hasOptionalExternalService ? '默认本地 · 可选外部请求' : '本地处理 · 隐私优先' }}
          </p>
        </div>
        <button v-if="tool" @click="fav.toggle(tool.id)" :class="['p-2 rounded-full border shrink-0', isFav ? 'bg-amber-50 border-amber-200 text-amber-500' : 'hover:bg-slate-50 dark:hover:bg-slate-800']" :title="isFav ? '取消收藏' : '收藏'">
          <Star class="w-5 h-5" :fill="isFav ? 'currentColor' : 'none'" />
        </button>
      </div>
    </div>

    <div class="bg-white dark:bg-slate-900 rounded-xl border p-4 sm:p-6">
      <slot />
    </div>

    <div v-if="tool" class="mt-6 bg-white dark:bg-slate-900 rounded-xl border p-6 text-sm leading-6 max-w-none">
      <h3>关于 {{ tool.nameZh }}</h3>
      <p>{{ tool.description }}。{{ usesExternalService ? '此工具会向第三方服务发送查询请求，请勿输入敏感信息，并以服务返回结果为准。' : hasOptionalExternalService ? '代码分析在浏览器本地完成；使用网页或 GitHub 导入时会访问对应外部服务，请勿输入敏感信息。' : '所有处理均在浏览器本地完成，不会上传到服务器，适合处理敏感数据。' }}</p>
      <ul>
        <li>关键词：{{ tool.keywords.join('、') }}</li>
        <li>分类：{{ tool.category }}</li>
        <li>路径：<code>{{ tool.path }}</code></li>
      </ul>
      <p class="text-xs text-muted-foreground">提示：使用 Ctrl+K 快速搜索其他工具。</p>
    </div>
  </div>
</template>
