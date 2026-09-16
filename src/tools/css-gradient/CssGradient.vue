<script setup lang="ts">
import { ref, computed } from 'vue'
import ToolLayout from '@/layouts/ToolLayout.vue'
import { copyToClipboard } from '@/composables/useClipboard'

const presets = [
  { name: '品牌蓝紫', stops: ['#2563eb', '#7c3aed'] },
  { name: '日落橙', stops: ['#f97316', '#ef4444'] },
  { name: '翡翠', stops: ['#10b981', '#0ea5e9'] },
  { name: '粉紫梦境', stops: ['#ec4899', '#8b5cf6', '#6366f1'] },
  { name: '暗夜金', stops: ['#0f172a', '#1e293b', '#b45309'] },
  { name: '薄荷', stops: ['#a7f3d0', '#34d399'] }
]

const stops = ref<string[]>(['#2563eb', '#7c3aed'])
const angle = ref(90)
const type = ref<'linear' | 'radial'>('linear')

const css = computed(() => {
  const body = stops.value.join(', ')
  return type.value === 'linear'
    ? `background: linear-gradient(${angle.value}deg, ${body});`
    : `background: radial-gradient(circle at center, ${body});`
})

function addStop() { if (stops.value.length < 6) stops.value.push('#94a3b8') }
function removeStop(i: number) { if (stops.value.length > 2) stops.value.splice(i, 1) }
</script>
<template>
  <ToolLayout>
    <div class="space-y-4">
      <div class="card overflow-hidden">
        <div class="h-40" :style="type==='linear' ? { background: `linear-gradient(${angle}deg, ${stops.join(', ')})` } : { background: `radial-gradient(circle at center, ${stops.join(', ')})` }"></div>
        <div class="p-4 flex items-center gap-2 flex-wrap">
          <code class="flex-1 text-xs font-mono break-all bg-slate-50 dark:bg-slate-800 border px-3 py-2 rounded-lg">{{ css }}</code>
          <button @click="copyToClipboard(css)" class="btn-primary shrink-0">复制 CSS</button>
        </div>
      </div>

      <div class="card p-4 space-y-3">
        <div class="flex flex-wrap items-center gap-3">
          <div class="flex gap-1">
            <button v-for="t in (['linear','radial'] as const)" :key="t" @click="type=t" :class="['btn-ghost', type===t && '!text-primary bg-primary/10']">{{ t === 'linear' ? '线性' : '径向' }}</button>
          </div>
          <label v-if="type==='linear'" class="flex items-center gap-2 text-sm flex-1 min-w-[220px]">
            <span class="text-muted-foreground shrink-0">角度 {{ angle }}°</span>
            <input type="range" min="0" max="360" v-model.number="angle" class="flex-1 accent-blue-600" />
          </label>
        </div>
        <div class="flex flex-wrap gap-3 items-center">
          <div v-for="(s,i) in stops" :key="i" class="flex items-center gap-1.5">
            <input type="color" v-model="stops[i]" class="w-10 h-10 rounded-lg border cursor-pointer p-0.5" :aria-label="`颜色 ${i+1}`" />
            <button v-if="stops.length > 2" @click="removeStop(i)" class="text-muted-foreground hover:text-red-500 text-sm" :aria-label="`删除颜色 ${i+1}`">✕</button>
          </div>
          <button @click="addStop" class="btn-ghost border-border">+ 加颜色</button>
          <div class="flex-1"></div>
          <span class="text-xs text-muted-foreground">预设：</span>
          <button v-for="p in presets" :key="p.name" @click="stops=[...p.stops]" class="text-xs px-2.5 py-1 rounded-full border hover:border-primary/50 hover:text-primary transition-colors">{{ p.name }}</button>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>
