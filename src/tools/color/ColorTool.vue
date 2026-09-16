<script setup lang="ts">
import { ref, computed } from 'vue'
import ToolLayout from '@/layouts/ToolLayout.vue'
import { hexToRgb, rgbToHsl, hslToRgb, rgbToHex, contrastRatio, shades, harmonies } from './processor'
import { copyToClipboard } from '@/composables/useClipboard'

const color = ref('#3b82f6')
const textColor = ref('#ffffff')

const rgb = computed(() => hexToRgb(color.value) || { r: 0, g: 0, b: 0 })
const hsl = computed(() => rgbToHsl(rgb.value))
const shadesList = computed(() => shades(color.value))
const harmonyList = computed(() => harmonies(color.value))
const contrast = computed(() => contrastRatio(color.value, textColor.value) || 0)
const contrastAa = computed(() => contrast.value >= 4.5)
const contrastAaa = computed(() => contrast.value >= 7)

function setFromRgb(e: Event) {
  const t = e.target as HTMLInputElement
  color.value = rgbToHex({ r: Number(t.value.slice(1,3) ? 0 : 0), g: 0, b: 0 })
}
</script>
<template>
  <ToolLayout>
    <div class="space-y-4">
      <div class="card p-4 flex flex-wrap items-center gap-4">
        <input type="color" :value="color" @input="color = ($event.target as HTMLInputElement).value" class="w-16 h-16 rounded-lg border cursor-pointer p-1" aria-label="选择颜色" />
        <div class="space-y-1 text-sm font-mono">
          <div>HEX <button class="hover:text-primary cursor-pointer" @click="copyToClipboard(color)">{{ color }}</button></div>
          <div>RGB <button class="hover:text-primary cursor-pointer" @click="copyToClipboard(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)">rgb({{ rgb.r }}, {{ rgb.g }}, {{ rgb.b }})</button></div>
          <div>HSL <button class="hover:text-primary cursor-pointer" @click="copyToClipboard(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`)">hsl({{ hsl.h }}, {{ hsl.s }}%, {{ hsl.l }}%)</button></div>
        </div>
        <div class="flex-1"></div>
        <div class="text-center">
          <div class="w-24 h-16 rounded-lg border flex items-center justify-center font-bold text-lg" :style="{ background: color, color: textColor }">Aa</div>
          <div class="text-xs text-muted-foreground mt-1">对比度 {{ contrast.toFixed(2) }}</div>
          <div class="text-xs mt-0.5">
            <span :class="contrastAa ? 'text-green-600' : 'text-red-500'">AA {{ contrastAa ? '✓' : '✗' }}</span>
            <span :class="contrastAaa ? 'text-green-600' : 'text-red-500'" class="ml-2">AAA {{ contrastAaa ? '✓' : '✗' }}</span>
          </div>
          <input type="color" :value="textColor" @input="textColor = ($event.target as HTMLInputElement).value" class="w-8 h-6 mt-1 cursor-pointer" aria-label="前景文字颜色" />
        </div>
      </div>

      <div class="card p-4">
        <div class="text-sm font-medium mb-3">明暗色阶（Lightness 梯度）</div>
        <div class="grid grid-cols-9 gap-1">
          <button v-for="(s,i) in shadesList" :key="i" @click="copyToClipboard(s)" :title="s" class="h-12 rounded-md border border-black/5 hover:scale-105 transition-transform" :style="{ background: s }"></button>
        </div>
      </div>

      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="h in harmonyList" :key="h.name" class="card p-4">
          <div class="text-sm font-medium mb-2">{{ h.name }}</div>
          <div class="flex gap-1">
            <button v-for="(c,i) in h.colors" :key="i" @click="copyToClipboard(c)" :title="c" class="flex-1 h-10 rounded-md border border-black/5 hover:scale-105 transition-transform" :style="{ background: c }"></button>
          </div>
          <div class="text-[10px] font-mono text-muted-foreground mt-1.5">{{ h.colors.join(' ') }}</div>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>
