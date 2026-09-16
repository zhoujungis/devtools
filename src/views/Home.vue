<script setup lang="ts">
import { computed, ref } from 'vue'
import { tools, searchTools } from '@/data/tools'
import { categories, getCategoryById } from '@/data/categories'
import { useFavoritesStore } from '@/stores/favorites'
import { useRecentStore } from '@/stores/recent'
import { useRouter } from 'vue-router'
import { Search, Flame, Clock, Star, Sparkles, ArrowRight } from 'lucide-vue-next'
import ToolIcon from '@/components/common/ToolIcon.vue'

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
function softColor(category:string){ return getCategoryById(category)?.color.soft || 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300' }
const hotKeywords = ['JSON','Base64','JWT','UUID','Timestamp']
</script>
<template>
  <div class="space-y-8">
    <!-- Hero -->
    <section class="relative text-center py-10 sm:py-14 overflow-hidden">
      <div aria-hidden="true" class="absolute inset-0 pointer-events-none">
        <div class="absolute -top-16 left-1/2 -translate-x-1/2 w-[480px] h-[280px] bg-blue-500/15 dark:bg-blue-500/10 rounded-full blur-3xl"></div>
        <div class="absolute top-8 left-[18%] w-40 h-40 bg-violet-500/15 dark:bg-violet-500/10 rounded-full blur-3xl"></div>
        <div class="absolute top-8 right-[18%] w-40 h-40 bg-cyan-500/10 dark:bg-cyan-500/10 rounded-full blur-3xl"></div>
      </div>
      <div class="relative">
        <span class="inline-flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/10 border border-primary/20 rounded-full px-3 py-1 mb-4">
          <Sparkles class="w-3 h-3" /> Fast · Private · Useful
        </span>
        <h1 class="text-3xl sm:text-5xl font-bold tracking-tight">
          程序员的<span class="text-gradient">在线工具箱</span>
        </h1>
        <p class="mt-4 text-muted-foreground max-w-xl mx-auto">{{ tools.length }} 个快速、免费、隐私优先的工具<span class="hidden sm:inline"> · 打开即用 · 数据不出浏览器</span></p>
        <div class="mt-8 max-w-[560px] mx-auto rounded-full p-[1.5px] bg-border focus-within:bg-gradient-to-r focus-within:from-blue-600 focus-within:to-violet-600 transition-colors">
          <div class="relative">
            <Search class="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input v-model="q" placeholder="搜索工具... 试试 json、base64、jwt" class="w-full pl-11 pr-20 py-3 rounded-full border border-transparent bg-white dark:bg-slate-900 shadow-soft focus:outline-none text-sm" @keydown.enter="onSearchEnter" />
            <kbd class="absolute right-2 top-1/2 -translate-y-1/2 hidden sm:inline rounded-full">Ctrl K</kbd>
          </div>
        </div>
        <div class="mt-4 flex flex-wrap gap-2 justify-center">
          <button v-for="k in hotKeywords" :key="k" @click="onHot(k)" class="text-xs px-3 py-1 rounded-full bg-white dark:bg-slate-900 border shadow-sm hover:border-primary/50 hover:text-primary hover:-translate-y-0.5 transition-all duration-200">{{ k }}</button>
        </div>
      </div>
    </section>

    <!-- Featured -->
    <section>
      <h2 class="flex items-center gap-2 font-semibold mb-3"><Flame class="w-5 h-5 text-orange-500"/> 热门工具</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <button v-for="(t,i) in featured" :key="t.id" @click="go(t.path)" class="animate-fade-up card card-hover text-left p-4 group" :style="{ animationDelay: `${i*50}ms` }">
          <div class="flex items-center gap-3">
            <div class="icon-chip w-10 h-10" :class="softColor(t.category)"><ToolIcon :name="t.icon" /></div>
            <div class="flex-1">
              <div class="font-medium text-sm">{{ t.nameZh }}</div>
              <div class="text-xs text-muted-foreground">{{ t.name }}</div>
            </div>
            <ArrowRight class="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 -translate-x-1 transition-all duration-200" />
          </div>
          <p class="text-xs text-muted-foreground mt-2 line-clamp-1">{{ t.description }}</p>
        </button>
      </div>
    </section>

    <!-- Recent & Favorites (client-only: depends on localStorage) -->
    <client-only>
      <div class="grid lg:grid-cols-2 gap-6">
      <section class="card p-4">
        <h3 class="flex items-center gap-2 font-medium text-sm mb-3"><Clock class="w-4 h-4"/> 最近使用</h3>
        <div v-if="recentTools.length===0" class="text-xs text-muted-foreground py-6 text-center">暂无记录，去使用一个工具吧</div>
        <div v-else class="flex flex-wrap gap-2">
          <button v-for="t in recentTools" :key="t.id" @click="go(t.path)" class="text-xs px-3 py-1.5 rounded-full border bg-slate-50 dark:bg-slate-800 hover:border-primary/50 hover:text-primary transition-colors">{{ t.nameZh }}</button>
        </div>
      </section>
      <section class="card p-4">
        <h3 class="flex items-center gap-2 font-medium text-sm mb-3"><Star class="w-4 h-4 text-amber-500"/> 我的收藏</h3>
        <div v-if="favoriteTools.length===0" class="text-xs text-muted-foreground py-6 text-center">点击工具页的 ⭐ 收藏工具</div>
        <div v-else class="flex flex-wrap gap-2">
          <button v-for="t in favoriteTools" :key="t.id" @click="go(t.path)" class="text-xs px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 border hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors">{{ t.nameZh }}</button>
        </div>
      </section>
      </div>
    </client-only>

    <!-- All categories -->
    <section>
      <h2 class="flex items-center gap-2 font-semibold mb-3"><Sparkles class="w-5 h-5 text-violet-500"/> 全部工具</h2>
      <div class="space-y-6">
        <div v-for="cat in populatedCategories" :key="cat.id" class="card p-4">
          <div class="flex items-center gap-2 mb-3">
            <div class="w-2 h-6 rounded-full" :class="cat.color.solid"></div>
            <span :class="['icon-chip w-6 h-6 rounded-md', cat.color.soft]"><ToolIcon :name="cat.icon" class="w-4 h-4" /></span>
            <h3 class="font-medium">{{ cat.nameZh }}</h3>
            <span class="text-xs text-muted-foreground">{{ cat.name }}</span>
            <span class="ml-auto text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">{{ allByCategory[cat.id]?.length || 0 }}</span>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            <button v-for="t in allByCategory[cat.id]" :key="t.id" @click="go(t.path)" class="text-left px-3 py-2.5 rounded-lg border hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-primary/40 flex items-center gap-3 transition-colors">
              <span class="icon-chip w-7 h-7 rounded-md" :class="softColor(t.category)"><ToolIcon :name="t.icon" class="w-4 h-4" /></span>
              <span class="text-sm flex-1 truncate">{{ t.nameZh }}</span>
              <span v-if="t.featured" class="text-[10px] text-white brand-gradient px-1.5 py-0.5 rounded-full">热门</span>
            </button>
            <div v-if="!allByCategory[cat.id] || allByCategory[cat.id].length===0" class="text-xs text-muted-foreground col-span-3 py-4 text-center">该分类暂无工具</div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>