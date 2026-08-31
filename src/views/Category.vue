<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { categories } from '@/data/categories'
import { getToolsByCategory } from '@/data/tools'
import ToolIcon from '@/components/common/ToolIcon.vue'

const route = useRoute()
const router = useRouter()
const cat = computed(()=> categories.find(c=>c.id===route.params.id))
const list = computed(()=> cat.value ? getToolsByCategory(cat.value.id) : [])
</script>
<template>
  <div>
    <div v-if="!cat" class="text-center py-16">分类不存在</div>
    <div v-else>
      <div class="mb-6">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg flex items-center justify-center text-white" :class="cat.color"><ToolIcon :name="cat.icon" /></div>
          <div>
            <h1 class="text-xl font-bold">{{ cat.nameZh }} <span class="text-sm font-normal text-muted-foreground">{{ cat.name }}</span></h1>
            <p class="text-sm text-muted-foreground">{{ cat.description }}</p>
          </div>
        </div>
      </div>
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <button v-for="t in list" :key="t.id" @click="router.push(t.path)" class="text-left bg-white dark:bg-slate-900 border rounded-xl p-4 hover:shadow-md">
          <div class="flex items-center gap-2.5">
            <span class="w-7 h-7 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300"><ToolIcon :name="t.icon" class="w-4 h-4" /></span>
            <div class="font-medium text-sm">{{ t.nameZh }}</div>
          </div>
          <div class="text-xs text-muted-foreground mt-1.5">{{ t.name }}</div>
          <p class="text-xs text-muted-foreground mt-2">{{ t.description }}</p>
        </button>
      </div>
    </div>
  </div>
</template>
