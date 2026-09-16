<script setup lang="ts">
import { ref } from 'vue'
import ToolLayout from '@/layouts/ToolLayout.vue'
import { generateUsers, generateCreditCard, type MockUser } from './processor'
import { copyToClipboard } from '@/composables/useClipboard'
import { downloadText } from '@/utils/download'
import { RefreshCw } from 'lucide-vue-next'

const count = ref(5)
const users = ref<MockUser[]>(generateUsers(5))
const card = ref(generateCreditCard())

function regen() {
  users.value = generateUsers(count.value)
  card.value = generateCreditCard()
}
const usersJson = () => JSON.stringify(users.value, null, 2)
</script>
<template>
  <ToolLayout>
    <div class="space-y-4">
      <div class="card p-4 flex flex-wrap items-center gap-3">
        <label class="flex items-center gap-2 text-sm">
          <span class="text-muted-foreground">数量</span>
          <input type="number" min="1" max="100" v-model.number="count" class="w-20 px-2 py-1.5 border rounded-lg bg-white dark:bg-slate-900 text-sm" />
        </label>
        <button @click="regen" class="btn-primary"><RefreshCw class="w-4 h-4" /> 重新生成</button>
        <div class="flex-1"></div>
        <button @click="copyToClipboard(usersJson())" class="btn-ghost border-border">复制 JSON</button>
        <button @click="downloadText('mock-users.json', usersJson(), 'application/json')" class="btn-ghost border-border">下载 .json</button>
      </div>

      <div class="card overflow-x-auto">
        <table class="w-full text-xs">
          <thead><tr class="text-muted-foreground text-left bg-slate-50 dark:bg-slate-800/60">
            <th class="px-3 py-2 font-medium">姓名</th><th class="px-3 py-2 font-medium">邮箱</th>
            <th class="px-3 py-2 font-medium">手机号</th><th class="px-3 py-2 font-medium">城市地址</th>
            <th class="px-3 py-2 font-medium">公司</th><th class="px-3 py-2 font-medium">注册时间</th>
          </tr></thead>
          <tbody>
            <tr v-for="u in users" :key="u.email" class="border-t border-border/50 hover:bg-slate-50 dark:hover:bg-slate-800/50">
              <td class="px-3 py-2 whitespace-nowrap">{{ u.name }}</td>
              <td class="px-3 py-2 font-mono">{{ u.email }}</td>
              <td class="px-3 py-2 font-mono">{{ u.phone }}</td>
              <td class="px-3 py-2">{{ u.address }}</td>
              <td class="px-3 py-2">{{ u.company }}</td>
              <td class="px-3 py-2 font-mono">{{ u.registeredAt }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="card p-4">
        <div class="text-sm font-medium mb-2">测试银行卡号（Luhn 校验合法，仅供联调）</div>
        <div class="flex flex-wrap items-center gap-3">
          <code class="font-mono text-sm bg-slate-50 dark:bg-slate-800 border px-3 py-2 rounded-lg">{{ card.number }}</code>
          <span class="text-sm text-muted-foreground">有效期 {{ card.expiry }} · CVV {{ card.cvv }}</span>
          <div class="flex-1"></div>
          <button @click="copyToClipboard(card.number.replace(/\s/g,''))" class="btn-ghost border-border">复制卡号</button>
        </div>
      </div>

      <p class="text-xs text-muted-foreground">所有数据均在浏览器本地随机生成，姓名/地址等为常见中文样例，仅用于开发测试填充。</p>
    </div>
  </ToolLayout>
</template>
