<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { Search, Star, Moon, Sun, Menu, X } from 'lucide-vue-next'
import { useSettingsStore } from '@/stores/settings'

const settings = useSettingsStore()
const showMobileMenu = ref(false)
const emit = defineEmits<{ (e:'openSearch'):void }>()
const navCategories = [
  { id: 'developer', label: '开发' },
  { id: 'encoding', label: '编码' },
  { id: 'security', label: '加密' },
  { id: 'network', label: '网络' },
  { id: 'text', label: '文本' },
  { id: 'generator', label: '生成器' }
]

function handleKey(e:KeyboardEvent){
  if((e.ctrlKey||e.metaKey) && e.key.toLowerCase()==='k'){ e.preventDefault(); emit('openSearch') }
}
onMounted(()=> window.addEventListener('keydown', handleKey))
onBeforeUnmount(()=> window.removeEventListener('keydown', handleKey))
watch(showMobileMenu, value => { document.body.classList.toggle('overflow-hidden', value) })
onBeforeUnmount(() => document.body.classList.remove('overflow-hidden'))
</script>
<template>
  <header class="sticky top-0 z-40 w-full border-b glass">
    <div class="mx-auto max-w-[1400px] px-4 h-14 flex items-center gap-4">
      <router-link to="/" class="flex items-center gap-2 font-bold text-lg shrink-0 group">
        <div class="w-8 h-8 rounded-lg brand-gradient flex items-center justify-center text-white text-sm shadow-sm group-hover:shadow-glow transition-shadow duration-300">D</div>
        <span>DevBox</span>
        <span class="hidden sm:inline text-xs font-normal text-muted-foreground ml-1">程序员工具箱</span>
      </router-link>

      <nav class="hidden lg:flex items-center gap-1 ml-6 text-sm">
        <router-link to="/" class="px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" active-class="!text-primary bg-primary/10 font-medium">首页</router-link>
        <router-link v-for="c in navCategories" :key="c.id" :to="`/category/${c.id}`" class="px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" active-class="!text-primary bg-primary/10 font-medium">{{ c.label }}</router-link>
        <router-link to="/cheatsheet" class="px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" active-class="!text-primary bg-primary/10 font-medium">速查表</router-link>
      </nav>

      <div class="flex-1"></div>

      <button @click="emit('openSearch')" class="hidden md:flex items-center gap-2 text-sm text-muted-foreground border rounded-full px-3 py-1.5 hover:border-primary/40 hover:bg-slate-50 dark:hover:bg-slate-800 w-[220px] justify-between transition-colors">
        <span class="flex items-center gap-2"><Search class="w-4 h-4"/> 搜索工具...</span>
        <kbd class="hidden lg:inline">Ctrl K</kbd>
      </button>
      <button @click="emit('openSearch')" aria-label="搜索工具" title="搜索工具" class="md:hidden p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"><Search class="w-5 h-5"/></button>

      <router-link to="/favorites" class="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800" title="收藏"><Star class="w-5 h-5"/></router-link>
      <button @click="settings.toggleTheme()" class="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="切换主题">
        <Sun class="w-5 h-5 dark:hidden transition-transform duration-500 hover:rotate-90" />
        <Moon class="w-5 h-5 hidden dark:block transition-transform duration-500 hover:-rotate-12" />
      </button>

      <button class="lg:hidden p-2" aria-label="打开导航菜单" :aria-expanded="showMobileMenu" @click="showMobileMenu=!showMobileMenu">
        <Menu v-if="!showMobileMenu" class="w-5 h-5"/>
        <X v-else class="w-5 h-5"/>
      </button>
    </div>
    <transition name="menu">
      <div v-if="showMobileMenu" class="lg:hidden border-t glass p-4 flex flex-col gap-1">
        <router-link @click="showMobileMenu=false" to="/" class="py-2 px-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">首页</router-link>
        <router-link @click="showMobileMenu=false" to="/category/developer" class="py-2 px-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">开发工具</router-link>
        <router-link @click="showMobileMenu=false" to="/category/encoding" class="py-2 px-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">编码/解码</router-link>
        <router-link @click="showMobileMenu=false" to="/category/security" class="py-2 px-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">加密/安全</router-link>
        <router-link @click="showMobileMenu=false" to="/category/network" class="py-2 px-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">网络工具</router-link>
        <router-link @click="showMobileMenu=false" to="/category/text" class="py-2 px-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">文本工具</router-link>
        <router-link @click="showMobileMenu=false" to="/category/generator" class="py-2 px-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">生成器</router-link>
        <router-link @click="showMobileMenu=false" to="/cheatsheet" class="py-2 px-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">速查表</router-link>
      </div>
    </transition>
  </header>
</template>
<style scoped>
.menu-enter-active, .menu-leave-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.menu-enter-from, .menu-leave-to { opacity: 0; transform: translateY(-6px); }
</style>
