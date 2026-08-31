<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { tools } from '@/data/tools'

const route = useRoute()
const tool = computed(() => tools.find(t => t.id === route.meta.toolId))
const title = computed(() => (route.meta.title as string) || 'DevBox · 程序员工具箱')
const description = computed(
  () => tool.value?.description || 'DevBox 程序员工具箱：快速、免费、隐私优先的开发者工具。'
)
const keywords = computed(() => tool.value?.keywords.join(',') || 'DevBox,开发者工具,程序员工具箱')
const url = computed(() => {
  void route.path
  return typeof window !== 'undefined' ? window.location.href : route.path
})

useHead({
  title,
  htmlAttrs: { lang: 'zh-CN' },
  meta: [
    { name: 'description', content: description },
    { name: 'keywords', content: keywords },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: url },
    { name: 'twitter:card', content: 'summary_large_image' }
  ]
})
</script>
<template>
  <DefaultLayout>
    <router-view />
  </DefaultLayout>
</template>
