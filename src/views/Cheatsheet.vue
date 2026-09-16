<script setup lang="ts">
import { ref } from 'vue'
import { copyToClipboard } from '@/composables/useClipboard'

const cheats = [
  { title:'Git 常用', items:['git clone <url>','git status','git add .','git commit -m "msg"','git push','git pull','git branch','git checkout -b <branch>','git merge <branch>','git rebase main','git log --oneline','git stash'] },
  { title:'Docker 常用', items:['docker ps','docker ps -a','docker images','docker pull <image>','docker run -d -p 8080:80 <image>','docker exec -it <container> bash','docker logs -f <container>','docker-compose up -d','docker-compose down'] },
  { title:'Linux 常用', items:['ls -la','cd <dir>','pwd','cp -r <src> <dst>','mv <src> <dst>','rm -rf <path>','chmod +x <file>','chown user:group <file>','grep -r "pattern" .','find . -name "*.js"','tar -czvf archive.tar.gz <dir>','ssh user@host'] },
  { title:'Nginx 常用', items:['nginx -t','nginx -s reload','nginx -s stop','systemctl restart nginx','tail -f /var/log/nginx/error.log'] },
  { title:'HTTP 状态码', items:['200 OK — 请求成功','201 Created — 已创建','204 No Content — 无返回体','301 Moved Permanently — 永久重定向','302 Found — 临时重定向','304 Not Modified — 缓存有效','400 Bad Request — 请求参数错误','401 Unauthorized — 未认证','403 Forbidden — 无权限','404 Not Found — 资源不存在','429 Too Many Requests — 请求过于频繁','500 Internal Server Error — 服务器错误','502 Bad Gateway — 网关错误','503 Service Unavailable — 服务不可用','504 Gateway Timeout — 网关超时'] },
  { title:'MIME 类型', items:['text/html — HTML 文档','text/css — 样式表','text/plain — 纯文本','application/json — JSON 数据','application/xml — XML 数据','application/pdf — PDF 文档','application/javascript — JS 脚本','application/octet-stream — 二进制流','image/png — PNG 图片','image/jpeg — JPEG 图片','image/webp — WebP 图片','image/svg+xml — SVG 矢量图','multipart/form-data — 文件上传','application/x-www-form-urlencoded — 表单提交'] },
]

const q = ref('')
</script>
<template>
  <div>
    <h1 class="text-2xl font-bold">开发者速查表</h1>
    <p class="text-sm text-muted-foreground mt-1">常用命令一键复制</p>
    <input v-model="q" placeholder="搜索命令..." class="mt-4 w-full max-w-md px-3 py-2 rounded-lg border bg-white dark:bg-slate-900 text-sm focus:border-primary/50 outline-none" />
    <div class="grid md:grid-cols-2 gap-6 mt-6">
      <div v-for="cat in cheats" :key="cat.title" class="card p-4">
        <h3 class="font-semibold mb-3">{{ cat.title }}</h3>
        <div class="space-y-1.5">
          <div v-for="cmd in cat.items.filter(i=> !q || i.toLowerCase().includes(q.toLowerCase()))" :key="cmd" class="flex items-center gap-2 group">
            <code class="flex-1 text-xs sm:text-sm font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1.5 rounded group-hover:bg-primary/10 dark:group-hover:bg-primary/20 transition-colors">{{ cmd }}</code>
            <button @click="copyToClipboard(cmd)" class="opacity-0 group-hover:opacity-100 focus:opacity-100 text-xs px-2 py-1 border rounded hover:bg-slate-50 dark:hover:bg-slate-800">复制</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
