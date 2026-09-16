<script setup lang="ts">
import { ref, computed } from 'vue'
import ToolLayout from '@/layouts/ToolLayout.vue'
import { copyToClipboard } from '@/composables/useClipboard'

const x = ref(0), y = ref(16), blur = ref(32), spread = ref(-8)
const color = ref('#6366f1')
const opacity = ref(35)
const inset = ref(false)
const radius = ref(16)
const dark = ref(false)

const shadowColor = computed(() => {
  const h = color.value.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${(opacity.value / 100).toFixed(2)})`
})

const css = computed(() => {
  const base = `${inset.value ? 'inset ' : ''}${x.value}px ${y.value}px ${blur.value}px ${spread.value}px ${shadowColor.value}`
  return dark.value
    ? `box-shadow:\n  ${base},\n  ${inset.value ? 'inset ' : ''}0 0 0 1px rgba(255, 255, 255, 0.05);`
    : `box-shadow: ${base};`
})
const tailwind = computed(() => {
  const parts = [`shadow-[${x.value}px_${y.value}px_${blur.value}px_${spread.value}px_${shadowColor.value.replace(/,/g, '')}${inset.value ? '_inset' : ''}]`]
  return parts[0]
})
</script>
<template>
  <ToolLayout>
    <div class="space-y-4">
      <div class="card p-10 flex items-center justify-center" :class="dark ? 'bg-slate-950' : 'bg-slate-50'">
        <div class="w-48 h-32 bg-white dark:bg-slate-800 transition-all duration-200"
             :style="{ borderRadius: radius + 'px', boxShadow: css.replace('box-shadow:', '').replace(/;/g, '').replace(/\n/g, ' ').trim() }"></div>
      </div>

      <div class="card p-4">
        <div class="flex items-center gap-2 flex-wrap">
          <code class="flex-1 text-xs font-mono bg-slate-50 dark:bg-slate-800 border px-3 py-2 rounded-lg whitespace-pre">{{ css }}</code>
          <button @click="copyToClipboard(css)" class="btn-primary shrink-0">复制 CSS</button>
        </div>
        <div class="mt-2 text-xs text-muted-foreground">Tailwind 任意值：<code class="font-mono">{{ tailwind }}</code></div>
      </div>

      <div class="card p-4 grid sm:grid-cols-2 gap-x-6 gap-y-3">
        <label class="flex items-center gap-3 text-sm"><span class="w-16 text-muted-foreground">X 偏移</span><input type="range" min="-40" max="40" v-model.number="x" class="flex-1 accent-blue-600" /><span class="w-10 text-right font-mono text-xs">{{ x }}</span></label>
        <label class="flex items-center gap-3 text-sm"><span class="w-16 text-muted-foreground">Y 偏移</span><input type="range" min="-40" max="60" v-model.number="y" class="flex-1 accent-blue-600" /><span class="w-10 text-right font-mono text-xs">{{ y }}</span></label>
        <label class="flex items-center gap-3 text-sm"><span class="w-16 text-muted-foreground">模糊</span><input type="range" min="0" max="100" v-model.number="blur" class="flex-1 accent-blue-600" /><span class="w-10 text-right font-mono text-xs">{{ blur }}</span></label>
        <label class="flex items-center gap-3 text-sm"><span class="w-16 text-muted-foreground">扩散</span><input type="range" min="-30" max="40" v-model.number="spread" class="flex-1 accent-blue-600" /><span class="w-10 text-right font-mono text-xs">{{ spread }}</span></label>
        <label class="flex items-center gap-3 text-sm"><span class="w-16 text-muted-foreground">颜色</span><input type="color" v-model="color" class="w-12 h-8 rounded border cursor-pointer" /><input type="range" min="0" max="100" v-model.number="opacity" class="flex-1 accent-blue-600" /><span class="w-10 text-right font-mono text-xs">{{ opacity }}%</span></label>
        <div class="flex items-center gap-4 text-sm">
          <label class="flex items-center gap-2"><input type="checkbox" v-model="inset" class="accent-blue-600" /> 内阴影</label>
          <label class="flex items-center gap-2"><input type="checkbox" v-model="dark" class="accent-blue-600" /> 暗色背景</label>
          <label class="flex items-center gap-2 ml-auto"><span class="text-muted-foreground">圆角 {{ radius }}px</span><input type="range" min="0" max="40" v-model.number="radius" class="accent-blue-600" /></label>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>
