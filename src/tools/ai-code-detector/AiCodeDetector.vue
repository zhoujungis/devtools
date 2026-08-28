<script setup lang="ts">
import { computed, ref, onBeforeUnmount } from 'vue'
import { Bot, ClipboardCopy, RotateCcw, Trash2, ShieldCheck, Upload, Globe, GitBranch } from 'lucide-vue-next'
import ToolLayout from '@/layouts/ToolLayout.vue'
import CodeEditor from '@/components/editor/CodeEditor.vue'
import { analyzeCode, parseGithubRepository, sampleCode } from './processor'
import { copyToClipboard } from '@/composables/useClipboard'

const source = ref(sampleCode())
type EditorLanguage = 'json' | 'javascript' | 'html' | 'css' | 'markdown' | 'sql' | 'yaml' | 'xml' | 'text'
const language = ref<EditorLanguage>('javascript')
const analyzed = ref(false)
const result = computed(() => analyzeCode(source.value))
const sourceMode = ref<'code' | 'web' | 'github'>('code')
const webUrl = ref('')
const sourceError = ref('')
const sourceName = ref('示例代码')
const loadingWeb = ref(false)
const githubRepo = ref('')
const githubBranch = ref('')
const githubFiles = ref<string[]>([])
const loadingGithub = ref(false)
const fileInput = ref<HTMLInputElement>()
let activeController: AbortController | null = null
onBeforeUnmount(() => activeController?.abort())

const fileLanguage: Record<string, EditorLanguage> = {
  html: 'html', htm: 'html', css: 'css', js: 'javascript', mjs: 'javascript',
  ts: 'javascript', vue: 'html', jsx: 'javascript', tsx: 'javascript',
  json: 'json', md: 'markdown', sql: 'sql', yaml: 'yaml', yml: 'yaml', xml: 'xml'
}

function selectFile() {
  fileInput.value?.click()
}

async function onFileChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  sourceError.value = ''
  if (file.size > 2_000_000) {
    sourceError.value = '文件超过 2 MB，请选择较小的源码文件'
    if (fileInput.value) fileInput.value.value = ''
    return
  }
  try {
    source.value = await file.text()
    const extension = file.name.split('.').pop()?.toLowerCase() || ''
    language.value = fileLanguage[extension] || 'text'
    sourceName.value = file.name
    analyzed.value = false
  } catch {
    sourceError.value = '无法读取本地文件'
  } finally {
    if (fileInput.value) fileInput.value.value = ''
  }
}

function normalizePageUrl(input: string): string | null {
  const value = input.trim()
  if (!value) return null
  try {
    const url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`)
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : null
  } catch {
    return null
  }
}

async function fetchWebPage() {
  const url = normalizePageUrl(webUrl.value)
  if (!url) {
    sourceError.value = '请输入有效的 HTTP 或 HTTPS 网页地址'
    return
  }
  activeController?.abort()
  const controller = new AbortController()
  activeController = controller
  const timer = window.setTimeout(() => controller.abort(), 10000)
  loadingWeb.value = true
  sourceError.value = ''
  try {
    const response = await fetch(url, { signal: controller.signal, cache: 'no-store', headers: { accept: 'text/html,text/plain;q=0.9,*/*;q=0.8' } })
    if (!response.ok) throw new Error(`网页返回 HTTP ${response.status}`)
    const html = await response.text()
    if (html.length > 2_000_000) throw new Error('网页源码超过 2 MB，请改用本地文件或粘贴关键代码')
    source.value = html
    language.value = 'html'
    sourceName.value = url
    analyzed.value = false
  } catch (error) {
    sourceError.value = error instanceof Error && error.name === 'AbortError'
      ? '网页请求超时（10 秒）'
      : `${error instanceof Error ? error.message : '网页读取失败'}；目标站点可能未开放 CORS`
  } finally {
    window.clearTimeout(timer)
    if (activeController === controller) activeController = null
    loadingWeb.value = false
  }
}

type GithubTreeEntry = { path: string; type: string; size?: number }
const sourceExtensions = new Set(['.html', '.htm', '.css', '.scss', '.less', '.js', '.mjs', '.cjs', '.ts', '.tsx', '.jsx', '.vue', '.svelte', '.json', '.md', '.yaml', '.yml', '.xml'])
const ignoredDirectories = new Set(['.git', 'node_modules', 'dist', 'build', 'coverage', 'vendor', 'public/assets'])

function isSourceEntry(entry: GithubTreeEntry): boolean {
  const lowerPath = entry.path.toLowerCase()
  if (entry.type !== 'blob' || [...ignoredDirectories].some(dir => lowerPath.split('/').includes(dir))) return false
  const extension = lowerPath.slice(lowerPath.lastIndexOf('.'))
  return sourceExtensions.has(extension)
}

function encodePathPart(value: string): string {
  return value.split('/').map(part => encodeURIComponent(part)).join('/')
}

async function fetchGithubRepository() {
  const repositoryRef = parseGithubRepository(githubRepo.value)
  if (!repositoryRef) {
    sourceError.value = '请输入公开 GitHub 仓库地址，例如 https://github.com/vuejs/core 或 vuejs/core'
    return
  }
  activeController?.abort()
  const controller = new AbortController()
  activeController = controller
  const timer = window.setTimeout(() => controller.abort(), 20000)
  loadingGithub.value = true
  sourceError.value = ''
  try {
    const apiHeaders = { accept: 'application/vnd.github+json', 'x-github-api-version': '2022-11-28' }
    const base = `https://api.github.com/repos/${encodeURIComponent(repositoryRef.owner)}/${encodeURIComponent(repositoryRef.repository)}`
    const repoResponse = await fetch(base, { signal: controller.signal, headers: apiHeaders, cache: 'no-store' })
    if (!repoResponse.ok) throw new Error(repoResponse.status === 404 ? '仓库不存在、不是公开仓库或无权访问' : `GitHub 返回 HTTP ${repoResponse.status}`)
    const repoData = await repoResponse.json() as { default_branch?: string }
    const branch = githubBranch.value.trim() || repoData.default_branch || 'main'
    const treeResponse = await fetch(`${base}/git/trees/${encodeURIComponent(branch)}?recursive=1`, { signal: controller.signal, headers: apiHeaders, cache: 'no-store' })
    if (!treeResponse.ok) throw new Error(`无法读取分支“${branch}”的文件树（HTTP ${treeResponse.status}）`)
    const treeData = await treeResponse.json() as { truncated?: boolean; tree?: GithubTreeEntry[] }
    if (treeData.truncated) throw new Error('仓库文件过多，GitHub 返回了截断的文件树，请改用较小的仓库或指定分支')
    const candidates = (treeData.tree || []).filter(isSourceEntry).sort((a, b) => (a.path.length - b.path.length) || a.path.localeCompare(b.path))
    const selected: GithubTreeEntry[] = []
    let totalSize = 0
    for (const entry of candidates) {
      const size = entry.size || 0
      if (size > 120_000 || totalSize + size > 800_000) continue
      selected.push(entry)
      totalSize += size
      if (selected.length >= 24) break
    }
    if (!selected.length) throw new Error('仓库中没有找到可分析的源码文件，或文件超过大小限制')
    const contents = await Promise.all(selected.map(async entry => {
      const rawUrl = `https://raw.githubusercontent.com/${encodeURIComponent(repositoryRef.owner)}/${encodeURIComponent(repositoryRef.repository)}/${encodePathPart(branch)}/${encodePathPart(entry.path)}`
      const response = await fetch(rawUrl, { signal: controller.signal, cache: 'no-store' })
      if (!response.ok) throw new Error(`读取文件 ${entry.path} 失败（HTTP ${response.status}）`)
      return { path: entry.path, content: await response.text() }
    }))
    source.value = contents.map(item => `===== ${item.path} =====\n${item.content}`).join('\n\n')
    githubFiles.value = contents.map(item => item.path)
    sourceName.value = `${repositoryRef.owner}/${repositoryRef.repository}@${branch}`
    language.value = 'text'
    analyzed.value = false
  } catch (error) {
    sourceError.value = error instanceof Error && error.name === 'AbortError'
      ? 'GitHub 请求超时（20 秒）'
      : `${error instanceof Error ? error.message : 'GitHub 仓库读取失败'}；请确认仓库公开且网络允许访问 GitHub`
  } finally {
    window.clearTimeout(timer)
    if (activeController === controller) activeController = null
    loadingGithub.value = false
  }
}

function analyze() {
  analyzed.value = true
}

function clear() {
  source.value = ''
  sourceName.value = '未命名源码'
  sourceError.value = ''
  githubFiles.value = []
  analyzed.value = false
}

function reset() {
  source.value = sampleCode()
  sourceName.value = '示例代码'
  sourceError.value = ''
  githubFiles.value = []
  analyzed.value = false
}

function copyReport() {
  if (!result.value.valid) return
  const report = [
    `结论：${result.value.label}`,
    `AI 风格倾向分数：${result.value.score}/100`,
    `代码行数：${result.value.metrics.codeLines}`,
    '',
    ...result.value.signals.map(signal => `- ${signal.label}：${signal.detail}`),
    `模型归因：${result.value.modelHint}`,
    '',
    result.value.caveat
  ].join('\n')
  copyToClipboard(report)
}
</script>

<template>
  <ToolLayout>
    <div class="space-y-4">
      <div class="flex flex-wrap items-center gap-2">
        <label class="text-sm font-medium" for="ai-code-language">语言</label>
        <select id="ai-code-language" v-model="language" class="px-2.5 py-1.5 border rounded-lg bg-white dark:bg-slate-900 text-sm">
          <option value="javascript">JavaScript / TypeScript</option>
          <option value="json">JSON</option>
          <option value="html">HTML</option>
          <option value="css">CSS</option>
          <option value="markdown">Markdown</option>
          <option value="sql">SQL</option>
          <option value="yaml">YAML</option>
          <option value="text">其他文本</option>
        </select>
        <span class="flex-1"></span>
        <button class="inline-flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-sm hover:bg-slate-50 dark:hover:bg-slate-800" @click="reset">
          <RotateCcw class="w-4 h-4" /> 示例
        </button>
        <button class="inline-flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-sm hover:bg-slate-50 dark:hover:bg-slate-800" @click="clear">
          <Trash2 class="w-4 h-4" /> 清空
        </button>
        <button class="inline-flex items-center gap-1.5 px-4 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm" @click="analyze">
          <Bot class="w-4 h-4" /> 开始检测
        </button>
      </div>

      <div class="flex flex-wrap items-center gap-2 border-b pb-3" role="tablist" aria-label="输入来源">
        <button role="tab" :aria-selected="sourceMode === 'code'" class="px-3 py-1.5 rounded-lg text-sm" :class="sourceMode === 'code' ? 'bg-slate-100 font-medium dark:bg-slate-800' : 'text-muted-foreground hover:bg-slate-50 dark:hover:bg-slate-800'" @click="sourceMode = 'code'">代码 / 网页源码</button>
        <button role="tab" :aria-selected="sourceMode === 'web'" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm" :class="sourceMode === 'web' ? 'bg-slate-100 font-medium dark:bg-slate-800' : 'text-muted-foreground hover:bg-slate-50 dark:hover:bg-slate-800'" @click="sourceMode = 'web'"><Globe class="h-4 w-4" />网页 URL</button>
        <button role="tab" :aria-selected="sourceMode === 'github'" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm" :class="sourceMode === 'github' ? 'bg-slate-100 font-medium dark:bg-slate-800' : 'text-muted-foreground hover:bg-slate-50 dark:hover:bg-slate-800'" @click="sourceMode = 'github'"><GitBranch class="h-4 w-4" />GitHub 仓库</button>
        <button class="ml-auto inline-flex items-center gap-1.5 border rounded-lg px-3 py-1.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-800" @click="selectFile"><Upload class="h-4 w-4" />导入网页/代码文件</button>
        <input ref="fileInput" type="file" class="hidden" accept=".html,.htm,.css,.js,.mjs,.ts,.vue,.jsx,.tsx,.json,.md,.sql,.yaml,.yml,.xml,.txt" @change="onFileChange" />
      </div>

      <div v-if="sourceMode === 'web'" class="rounded-lg border bg-slate-50/70 p-3 dark:bg-slate-900/60">
        <div class="flex flex-col gap-2 sm:flex-row">
          <input v-model="webUrl" class="min-w-0 flex-1 rounded-lg border bg-white px-3 py-2 font-mono text-sm dark:bg-slate-900" placeholder="https://example.com" @keydown.enter="fetchWebPage" />
          <button class="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-50" :disabled="loadingWeb" @click="fetchWebPage"><Globe class="h-4 w-4" />{{ loadingWeb ? '读取中...' : '读取网页源码' }}</button>
        </div>
        <p class="mt-2 text-xs text-muted-foreground">仅能读取目标站点允许跨域访问的 HTML，最多 2 MB；不会执行网页脚本，也不会抓取外链 CSS/JS。</p>
      </div>

      <div v-else-if="sourceMode === 'github'" class="rounded-lg border bg-slate-50/70 p-3 dark:bg-slate-900/60">
        <div class="flex flex-col gap-2 sm:flex-row">
          <input v-model="githubRepo" class="min-w-0 flex-1 rounded-lg border bg-white px-3 py-2 font-mono text-sm dark:bg-slate-900" placeholder="https://github.com/owner/repository" @keydown.enter="fetchGithubRepository" />
          <input v-model="githubBranch" class="w-full rounded-lg border bg-white px-3 py-2 font-mono text-sm sm:w-32 dark:bg-slate-900" placeholder="分支（可选）" @keydown.enter="fetchGithubRepository" />
          <button class="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-50" :disabled="loadingGithub" @click="fetchGithubRepository"><GitBranch class="h-4 w-4" />{{ loadingGithub ? '读取中...' : '读取仓库' }}</button>
        </div>
        <p class="mt-2 text-xs text-muted-foreground">仅支持公开仓库；默认读取仓库默认分支，最多 24 个源码文件/800 KB。不会执行代码，私有仓库需要授权功能。</p>
        <p v-if="githubFiles.length" class="mt-2 text-xs text-green-700 dark:text-green-300">已读取 {{ githubFiles.length }} 个文件：{{ githubFiles.slice(0, 5).join('、') }}{{ githubFiles.length > 5 ? ' 等' : '' }}</p>
      </div>

      <div v-if="sourceError" class="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-900/20 dark:text-red-300">{{ sourceError }}</div>

      <div class="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-900/60 dark:bg-amber-900/20 dark:text-amber-200">
        <div class="flex items-start gap-2">
          <ShieldCheck class="mt-0.5 h-4 w-4 shrink-0" />
          <p>代码只在当前浏览器分析，不会上传。检测结果是可解释的风格启发式评分，不能证明代码是否由 AI 编写。</p>
        </div>
      </div>

      <div class="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <div>
          <div class="flex items-center justify-between gap-2">
            <label class="text-sm font-medium">待检测代码 / 网页源码</label>
            <span class="max-w-[55%] truncate text-xs text-muted-foreground" :title="sourceName">{{ sourceName }}</span>
          </div>
          <CodeEditor v-model="source" :language="language" aria-label="待检测代码" placeholder="粘贴代码..." />
          <div class="mt-2 text-xs text-muted-foreground">建议输入至少 20 个字符；样本越短，结果越不稳定。</div>
        </div>

        <section class="rounded-lg border bg-slate-50/70 p-4 dark:bg-slate-900/60" aria-live="polite">
          <div class="flex items-center justify-between gap-3">
            <h2 class="font-medium">检测结果</h2>
            <button v-if="analyzed && result.valid" class="inline-flex items-center gap-1 border rounded px-2 py-1 text-xs hover:bg-white dark:hover:bg-slate-800" @click="copyReport">
              <ClipboardCopy class="w-3.5 h-3.5" /> 复制报告
            </button>
          </div>

          <div v-if="!analyzed" class="py-12 text-center text-sm text-muted-foreground">
            点击“开始检测”查看风格分析
          </div>
          <div v-else-if="!result.valid" class="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-900/20 dark:text-red-300">
            {{ result.error }}
          </div>
          <div v-else class="mt-4 space-y-4">
            <div class="flex items-center gap-4">
              <div class="relative h-20 w-20 shrink-0 rounded-full" :class="result.level === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' : result.level === 'medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' : 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'">
                <div class="flex h-full items-center justify-center text-2xl font-bold">{{ result.score }}</div>
              </div>
              <div>
                <div class="font-medium">{{ result.label }}</div>
                <p class="mt-1 text-xs text-muted-foreground">分数越高，代表样本中可观察到的 AI 风格特征越多。</p>
              </div>
            </div>
            <p class="rounded border border-blue-200 bg-blue-50 p-2 text-xs text-blue-800 dark:border-blue-900/60 dark:bg-blue-900/20 dark:text-blue-200">{{ result.sampleNote }}</p>

            <dl class="grid grid-cols-2 gap-2 text-xs sm:grid-cols-3">
              <div class="rounded border bg-white p-2 dark:bg-slate-900"><dt class="text-muted-foreground">代码行</dt><dd class="mt-1 font-mono font-medium">{{ result.metrics.codeLines }}</dd></div>
              <div class="rounded border bg-white p-2 dark:bg-slate-900"><dt class="text-muted-foreground">注释行</dt><dd class="mt-1 font-mono font-medium">{{ result.metrics.commentLines }}</dd></div>
              <div class="rounded border bg-white p-2 dark:bg-slate-900"><dt class="text-muted-foreground">函数/类</dt><dd class="mt-1 font-mono font-medium">{{ result.metrics.functionCount }}</dd></div>
              <div class="rounded border bg-white p-2 dark:bg-slate-900"><dt class="text-muted-foreground">平均行长</dt><dd class="mt-1 font-mono font-medium">{{ result.metrics.averageLineLength }}</dd></div>
              <div class="rounded border bg-white p-2 dark:bg-slate-900"><dt class="text-muted-foreground">最长行</dt><dd class="mt-1 font-mono font-medium">{{ result.metrics.maxLineLength }}</dd></div>
              <div class="rounded border bg-white p-2 dark:bg-slate-900"><dt class="text-muted-foreground">TODO/FIXME</dt><dd class="mt-1 font-mono font-medium">{{ result.metrics.todoCount }}</dd></div>
            </dl>

            <div>
              <h3 class="text-sm font-medium">依据</h3>
              <ul class="mt-2 space-y-2">
                <li v-for="signal in result.signals" :key="`${signal.label}-${signal.detail}`" class="flex gap-2 text-xs">
                  <span class="mt-1 h-1.5 w-1.5 shrink-0 rounded-full" :class="signal.impact === 'positive' ? 'bg-amber-500' : signal.impact === 'negative' ? 'bg-green-500' : 'bg-slate-400'"></span>
                  <span><strong>{{ signal.label }}</strong>：{{ signal.detail }}</span>
                </li>
              </ul>
            </div>

            <div class="rounded-lg border bg-white p-3 dark:bg-slate-900">
              <h3 class="text-sm font-medium">具体模型归因</h3>
              <p class="mt-1 text-xs leading-5 text-muted-foreground">{{ result.modelHint }}</p>
            </div>

            <p class="border-t pt-3 text-xs leading-5 text-muted-foreground">{{ result.caveat }}</p>
          </div>
        </section>
      </div>
    </div>
  </ToolLayout>
</template>
