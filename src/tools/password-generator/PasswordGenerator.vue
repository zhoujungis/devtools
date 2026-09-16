<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import ToolLayout from '@/layouts/ToolLayout.vue'
import { generatePassword, generatePassphrase, entropyBits, strengthLabel, DEMO_WORDS } from './processor'
import { copyToClipboard } from '@/composables/useClipboard'
import { RefreshCw, Copy } from 'lucide-vue-next'

const mode = ref<'password' | 'passphrase'>('password')
const length = ref(16)
const opts = ref({ uppercase: true, lowercase: true, numbers: true, symbols: true, excludeAmbiguous: true })
const wordCount = ref(4)
const separator = ref('-')
const result = ref('')

function generate() {
  result.value = mode.value === 'password'
    ? generatePassword({ length: length.value, ...opts.value })
    : generatePassphrase(DEMO_WORDS, wordCount.value, separator.value)
}

watch([mode, length, opts, wordCount, separator], generate, { deep: true, immediate: true })

const poolSize = computed(() => {
  let n = 0
  if (opts.value.uppercase) n += opts.value.excludeAmbiguous ? 24 : 26
  if (opts.value.lowercase) n += opts.value.excludeAmbiguous ? 25 : 26
  if (opts.value.numbers) n += opts.value.excludeAmbiguous ? 8 : 10
  if (opts.value.symbols) n += 26
  return mode.value === 'passphrase' ? DEMO_WORDS.length : n
})
const bits = computed(() => entropyBits(poolSize.value, mode.value === 'passphrase' ? wordCount.value : length.value))
const strength = computed(() => strengthLabel(bits.value))
</script>
<template>
  <ToolLayout>
    <div class="space-y-4">
      <div class="card p-4">
        <div class="flex gap-2 mb-4">
          <button @click="mode='password'" :class="['btn-ghost', mode==='password' && '!text-primary bg-primary/10']">随机密码</button>
          <button @click="mode='passphrase'" :class="['btn-ghost', mode==='passphrase' && '!text-primary bg-primary/10']">记忆短语</button>
        </div>

        <div class="flex items-center gap-2">
          <code class="flex-1 text-base font-mono break-all bg-slate-50 dark:bg-slate-800 border px-3 py-3 rounded-lg">{{ result || '请至少选择一种字符' }}</code>
          <button @click="generate" class="btn-primary shrink-0" title="重新生成"><RefreshCw class="w-4 h-4" /> 生成</button>
          <button @click="copyToClipboard(result)" class="btn-ghost border-border shrink-0" title="复制"><Copy class="w-4 h-4" /></button>
        </div>

        <div class="mt-3 flex items-center gap-3 text-sm">
          <span>强度：<b :class="strength.color">{{ strength.label }}</b></span>
          <span class="text-muted-foreground">熵 ~{{ bits }} bits</span>
          <div class="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden max-w-[200px]">
            <div class="h-full brand-gradient rounded-full transition-all" :style="{ width: Math.min(100, bits / 128 * 100) + '%' }"></div>
          </div>
        </div>
      </div>

      <div v-if="mode==='password'" class="card p-4 space-y-3">
        <label class="flex items-center gap-3 text-sm">
          <span class="w-20 shrink-0">长度</span>
          <input type="range" min="6" max="64" v-model.number="length" class="flex-1 accent-blue-600" />
          <span class="w-10 text-right font-mono">{{ length }}</span>
        </label>
        <label class="flex items-center gap-2 text-sm"><input type="checkbox" v-model="opts.uppercase" class="accent-blue-600" /> 大写字母 A-Z</label>
        <label class="flex items-center gap-2 text-sm"><input type="checkbox" v-model="opts.lowercase" class="accent-blue-600" /> 小写字母 a-z</label>
        <label class="flex items-center gap-2 text-sm"><input type="checkbox" v-model="opts.numbers" class="accent-blue-600" /> 数字 0-9</label>
        <label class="flex items-center gap-2 text-sm"><input type="checkbox" v-model="opts.symbols" class="accent-blue-600" /> 符号 !@#$%...</label>
        <label class="flex items-center gap-2 text-sm"><input type="checkbox" v-model="opts.excludeAmbiguous" class="accent-blue-600" /> 排除易混淆字符 (0 O 1 l I)</label>
      </div>

      <div v-else class="card p-4 space-y-3">
        <label class="flex items-center gap-3 text-sm">
          <span class="w-20 shrink-0">单词数</span>
          <input type="range" min="3" max="8" v-model.number="wordCount" class="flex-1 accent-blue-600" />
          <span class="w-10 text-right font-mono">{{ wordCount }}</span>
        </label>
        <label class="flex items-center gap-3 text-sm">
          <span class="w-20 shrink-0">分隔符</span>
          <input v-model="separator" maxlength="3" class="w-20 px-2 py-1 border rounded-lg font-mono text-sm bg-white dark:bg-slate-900" />
        </label>
        <p class="text-xs text-muted-foreground">内置 30 个常见英文单词词表，可组合出高熵且易口述的密码。</p>
      </div>
    </div>
  </ToolLayout>
</template>
