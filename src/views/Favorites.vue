<script setup lang="ts">
import { computed } from 'vue'
import { useFavoritesStore } from '@/stores/favorites'
import { tools } from '@/data/tools'
import { useRouter } from 'vue-router'
import ToolIcon from '@/components/common/ToolIcon.vue'
const fav = useFavoritesStore()
const router = useRouter()
const list = computed(()=> fav.favorites.map(id=> tools.find(t=>t.id===id)).filter(Boolean) as typeof tools)
</script>
<template>
  <client-only>
  <div>
    <h1 class="text-xl font-bold mb-4">我的收藏 ⭐</h1>
    <div v-if="list.length===0" class="bg-white dark:bg-slate-900 border rounded-xl p-12 text-center text-muted-foreground">
      <p>还没有收藏任何工具</p>
      <p class="text-xs mt-2">在工具页面点击 ⭐ 即可收藏</p>
      <router-link to="/" class="inline-block mt-4 text-sm text-primary hover:underline">去首页看看</router-link>
    </div>
    <div v-else class="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
      <div v-for="t in list" :key="t.id" class="bg-white dark:bg-slate-900 border rounded-xl p-4 flex flex-col">
        <div class="flex items-center gap-2.5">
          <span class="w-7 h-7 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300"><ToolIcon :name="t.icon" class="w-4 h-4" /></span>
          <div class="font-medium text-sm">{{ t.nameZh }}</div>
        </div>
        <div class="text-xs text-muted-foreground mt-1.5">{{ t.name }}</div>
        <p class="text-xs text-muted-foreground mt-2 flex-1">{{ t.description }}</p>
        <div class="flex gap-2 mt-3">
          <button @click="router.push(t.path)" class="flex-1 text-sm bg-primary text-primary-foreground py-1.5 rounded-lg">打开</button>
          <button @click="fav.toggle(t.id)" class="px-3 py-1.5 border rounded-lg text-sm">取消</button>
        </div>
      </div>
    </div>
    <button v-if="list.length" @click="fav.clear()" class="mt-6 text-sm text-red-500 hover:underline">清空收藏</button>
  </div>
  </client-only>
</template>
