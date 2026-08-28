<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { Search, Star, Moon, Sun, Menu, X } from 'lucide-vue-next'
import { useSettingsStore } from '@/stores/settings'

const settings = useSettingsStore()
const showMobileMenu = ref(false)
const emit = defineEmits<{ (e:'openSearch'):void }>()

function handleKey(e:KeyboardEvent){
  if((e.ctrlKey||e.metaKey) && e.key.toLowerCase()==='k'){ e.preventDefault(); emit('openSearch') }
}
onMounted(()=> window.addEventListener('keydown', handleKey))
onBeforeUnmount(()=> window.removeEventListener('keydown', handleKey))
watch(showMobileMenu, value => { document.body.classList.toggle('overflow-hidden', value) })
onBeforeUnmount(() => document.body.classList.remove('overflow-hidden'))
</script>
<template>
  <header class="sticky top-0 z-40 w-full border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
    <div class="mx-auto max-w-[1400px] px-4 h-14 flex items-center gap-4">
      <router-link to="/" class="flex items-center gap-2 font-bold text-lg shrink-0">
        <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white text-sm">D</div>
        <span>DevBox</span>
        <span class="hidden sm:inline text-xs font-normal text-muted-foreground ml-1">程序员工具箱</span>
      </router-link>

      <nav class="hidden lg:flex items-center gap-1 ml-6 text-sm">
        <router-link to="/" class="px-3 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800" active-class="bg-slate-100 dark:bg-slate-800">首页</router-link>
        <router-link to="/category/developer" class="px-3 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">开发</router-link>
        <router-link to="/category/encoding" class="px-3 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">编码</router-link>
        <router-link to="/category/security" class="px-3 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">加密</router-link>
        <router-link to="/category/network" class="px-3 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">网络</router-link>
        <router-link to="/category/text" class="px-3 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">文本</router-link>
        <router-link to="/category/generator" class="px-3 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">生成器</router-link>
        <router-link to="/cheatsheet" class="px-3 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">速查表</router-link>
      </nav>

      <div class="flex-1"></div>

      <button @click="emit('openSearch')" class="hidden md:flex items-center gap-2 text-sm text-muted-foreground border rounded-full px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 w-[220px] justify-between">
        <span class="flex items-center gap-2"><Search class="w-4 h-4"/> 搜索工具...</span>
        <kbd class="hidden lg:inline text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border">Ctrl K</kbd>
      </button>
      <button @click="emit('openSearch')" aria-label="搜索工具" title="搜索工具" class="md:hidden p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"><Search class="w-5 h-5"/></button>

      <router-link to="/favorites" class="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800" title="收藏"><Star class="w-5 h-5"/></router-link>
      <button @click="settings.toggleTheme()" class="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="切换主题">
        <Sun class="w-5 h-5 dark:hidden" />
        <Moon class="w-5 h-5 hidden dark:block" />
      </button>

      <button class="lg:hidden p-2" aria-label="打开导航菜单" :aria-expanded="showMobileMenu" @click="showMobileMenu=!showMobileMenu">
        <Menu v-if="!showMobileMenu" class="w-5 h-5"/>
        <X v-else class="w-5 h-5"/>
      </button>
    </div>
    <div v-if="showMobileMenu" class="lg:hidden border-t bg-white dark:bg-slate-900 p-4 flex flex-col gap-2">
      <router-link @click="showMobileMenu=false" to="/" class="py-2">首页</router-link>
      <router-link @click="showMobileMenu=false" to="/category/developer" class="py-2">开发工具</router-link>
      <router-link @click="showMobileMenu=false" to="/category/encoding" class="py-2">编码/解码</router-link>
      <router-link @click="showMobileMenu=false" to="/category/security" class="py-2">加密/安全</router-link>
      <router-link @click="showMobileMenu=false" to="/category/network" class="py-2">网络工具</router-link>
      <router-link @click="showMobileMenu=false" to="/category/text" class="py-2">文本工具</router-link>
      <router-link @click="showMobileMenu=false" to="/category/generator" class="py-2">生成器</router-link>
      <router-link @click="showMobileMenu=false" to="/cheatsheet" class="py-2">速查表</router-link>
    </div>
  </header>
</template>
