<script setup lang="ts">
import { ref } from 'vue'
import { copyToClipboard } from '@/composables/useClipboard'

const cheats = [
  { title:'Git 常用', items:['git clone <url>','git status','git add .','git commit -m "msg"','git push','git pull','git branch','git checkout -b <branch>','git merge <branch>','git rebase main','git log --oneline','git stash'] },
  { title:'Docker 常用', items:['docker ps','docker ps -a','docker images','docker pull <image>','docker run -d -p 8080:80 <image>','docker exec -it <container> bash','docker logs -f <container>','docker-compose up -d','docker-compose down'] },
  { title:'Linux 常用', items:['ls -la','cd <dir>','pwd','cp -r <src> <dst>','mv <src> <dst>','rm -rf <path>','chmod +x <file>','chown user:group <file>','grep -r "pattern" .','find . -name "*.js"','tar -czvf archive.tar.gz <dir>','ssh user@host'] },
  { title:'Nginx 常用', items:['nginx -t','nginx -s reload','nginx -s stop','systemctl restart nginx','tail -f /var/log/nginx/error.log'] },
]

const q = ref('')
</script>
<template>
  <div>
    <h1 class="text-2xl font-bold">开发者速查表</h1>
    <p class="text-sm text-muted-foreground mt-1">常用命令一键复制</p>
    <input v-model="q" placeholder="搜索命令..." class="mt-4 w-full max-w-md px-3 py-2 rounded-lg border bg-white dark:bg-slate-900 text-sm" />
    <div class="grid md:grid-cols-2 gap-6 mt-6">
      <div v-for="cat in cheats" :key="cat.title" class="bg-white dark:bg-slate-900 border rounded-xl p-4">
        <h3 class="font-semibold mb-3">{{ cat.title }}</h3>
        <div class="space-y-1.5">
          <div v-for="cmd in cat.items.filter(i=> !q || i.toLowerCase().includes(q.toLowerCase()))" :key="cmd" class="flex items-center gap-2 group">
            <code class="flex-1 text-xs sm:text-sm font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1.5 rounded">{{ cmd }}</code>
            <button @click="copyToClipboard(cmd)" class="opacity-0 group-hover:opacity-100 focus:opacity-100 text-xs px-2 py-1 border rounded hover:bg-slate-50 dark:hover:bg-slate-800">复制</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
