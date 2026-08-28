<script setup lang="ts">
import { computed, ref } from 'vue'
import { tools, searchTools } from '@/data/tools'
import { categories } from '@/data/categories'
import { useFavoritesStore } from '@/stores/favorites'
import { useRecentStore } from '@/stores/recent'
import { useRouter } from 'vue-router'
import { Search, Flame, Clock, Star, Sparkles, ArrowRight } from 'lucide-vue-next'

const fav = useFavoritesStore()
const recent = useRecentStore()
const router = useRouter()
const q = ref('')

const featured = computed(()=> tools.filter(t=>t.featured).slice(0,6))
const recentTools = computed(()=> recent.recent.map(id=> tools.find(t=>t.id===id)).filter(Boolean) as typeof tools)
const favoriteTools = computed(()=> fav.favorites.map(id=> tools.find(t=>t.id===id)).filter(Boolean) as typeof tools)
const allByCategory = computed(()=>{
  const map: Record<string, typeof tools> = {}
  categories.forEach(c=> map[c.id]= tools.filter(t=>t.category===c.id))
  return map
})
const populatedCategories = computed(() => categories.filter(category => allByCategory.value[category.id]?.length))
function go(path:string){ router.push(path) }
function onSearchEnter(){ const r = searchTools(q.value)[0]; if(r) go(r.path) }
function onHot(k:string){ q.value=k; const r=searchTools(k)[0]; if(r) go(r.path) }
const hotKeywords = ['JSON','Base64','JWT','UUID','Timestamp']
</script>
<template>
  <div class="space-y-8">
    <!-- Hero -->
    <section class="text-center py-8 sm:py-12">
      <h1 class="text-3xl sm:text-4xl font-bold tracking-tight">程序员的在线工具箱</h1>
      <p class="mt-3 text-muted-foreground">{{ tools.length }} 个快速、免费、隐私优先的工具 · 打开即用 · 本地处理</p>
      <div class="mt-6 max-w-[560px] mx-auto relative">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input v-model="q" placeholder="搜索工具... 试试 json、base64、jwt" class="w-full pl-10 pr-20 py-3 rounded-full border bg-white dark:bg-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm" @keydown.enter="onSearchEnter" />
        <kbd class="absolute right-2 top-1/2 -translate-y-1/2 hidden sm:inline text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full border">Ctrl K</kbd>
      </div>
      <div class="mt-4 flex flex-wrap gap-2 justify-center">
        <button v-for="k in hotKeywords" :key="k" @click="onHot(k)" class="text-xs px-3 py-1 rounded-full bg-white dark:bg-slate-900 border hover:border-primary hover:text-primary">{{ k }}</button>
      </div>
    </section>

    <!-- Featured -->
    <section>
      <h2 class="flex items-center gap-2 font-semibold mb-3"><Flame class="w-5 h-5 text-orange-500"/> 热门工具</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <button v-for="t in featured" :key="t.id" @click="go(t.path)" class="text-left bg-white dark:bg-slate-900 border rounded-xl p-4 hover:shadow-md hover:border-primary/30 transition-all group">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600">{{ t.nameZh.slice(0,1) }}</div>
            <div class="flex-1">
              <div class="font-medium text-sm">{{ t.nameZh }}</div>
              <div class="text-xs text-muted-foreground">{{ t.name }}</div>
            </div>
            <ArrowRight class="w-4 h-4 opacity-0 group-hover:opacity-100 transition" />
          </div>
          <p class="text-xs text-muted-foreground mt-2 line-clamp-1">{{ t.description }}</p>
        </button>
      </div>
    </section>

    <!-- Recent & Favorites -->
    <div class="grid lg:grid-cols-2 gap-6">
      <section class="bg-white dark:bg-slate-900 border rounded-xl p-4">
        <h3 class="flex items-center gap-2 font-medium text-sm mb-3"><Clock class="w-4 h-4"/> 最近使用</h3>
        <div v-if="recentTools.length===0" class="text-xs text-muted-foreground py-6 text-center">暂无记录，去使用一个工具吧</div>
        <div v-else class="flex flex-wrap gap-2">
          <button v-for="t in recentTools" :key="t.id" @click="go(t.path)" class="text-xs px-3 py-1.5 rounded-full border bg-slate-50 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-700">{{ t.nameZh }}</button>
        </div>
      </section>
      <section class="bg-white dark:bg-slate-900 border rounded-xl p-4">
        <h3 class="flex items-center gap-2 font-medium text-sm mb-3"><Star class="w-4 h-4 text-amber-500"/> 我的收藏</h3>
        <div v-if="favoriteTools.length===0" class="text-xs text-muted-foreground py-6 text-center">点击工具页的 ⭐ 收藏工具</div>
        <div v-else class="flex flex-wrap gap-2">
          <button v-for="t in favoriteTools" :key="t.id" @click="go(t.path)" class="text-xs px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 border hover:bg-amber-100">{{ t.nameZh }}</button>
        </div>
      </section>
    </div>

    <!-- All categories -->
    <section>
      <h2 class="flex items-center gap-2 font-semibold mb-3"><Sparkles class="w-5 h-5 text-violet-500"/> 全部工具</h2>
      <div class="space-y-6">
        <div v-for="cat in populatedCategories" :key="cat.id" class="bg-white dark:bg-slate-900 border rounded-xl p-4">
          <div class="flex items-center gap-2 mb-3">
            <div class="w-2 h-6 rounded-full" :class="cat.color"></div>
            <h3 class="font-medium">{{ cat.nameZh }}</h3>
            <span class="text-xs text-muted-foreground">{{ cat.name }}</span>
            <span class="ml-auto text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">{{ allByCategory[cat.id]?.length || 0 }}</span>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            <button v-for="t in allByCategory[cat.id]" :key="t.id" @click="go(t.path)" class="text-left px-3 py-2.5 rounded-lg border hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-3">
              <span class="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">{{ t.nameZh.slice(0,2) }}</span>
              <span class="text-sm flex-1 truncate">{{ t.nameZh }}</span>
              <span v-if="t.featured" class="text-[10px] bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full">热门</span>
            </button>
            <div v-if="!allByCategory[cat.id] || allByCategory[cat.id].length===0" class="text-xs text-muted-foreground col-span-3 py-4 text-center">该分类暂无工具</div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
