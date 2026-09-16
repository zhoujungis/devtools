import type { CategoryDefinition } from '@/types/tool'

export const categories: CategoryDefinition[] = [
  {
    id: 'developer', name: 'Developer', nameZh: '开发工具', description: 'JSON、SQL、Markdown 等', icon: 'Code2',
    color: { solid: 'bg-blue-500', soft: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' }
  },
  {
    id: 'encoding', name: 'Encoding', nameZh: '编码/解码', description: 'Base64、URL、HTML 实体', icon: 'Binary',
    color: { solid: 'bg-emerald-500', soft: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' }
  },
  {
    id: 'security', name: 'Security', nameZh: '加密/安全', description: 'Hash、JWT、密码生成', icon: 'Shield',
    color: { solid: 'bg-amber-500', soft: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400' }
  },
  {
    id: 'network', name: 'Network', nameZh: '网络工具', description: 'Ping、DNS、IP、CIDR 等网络诊断', icon: 'Globe',
    color: { solid: 'bg-cyan-500', soft: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-900/20 dark:text-cyan-400' }
  },
  {
    id: 'time', name: 'Time', nameZh: '时间工具', description: '时间戳、时区、Cron', icon: 'Clock',
    color: { solid: 'bg-purple-500', soft: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400' }
  },
  {
    id: 'text', name: 'Text', nameZh: '文本工具', description: 'Diff、正则、字符统计', icon: 'FileText',
    color: { solid: 'bg-orange-500', soft: 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400' }
  },
  {
    id: 'generator', name: 'Generator', nameZh: '生成器', description: 'UUID、QR、Lorem', icon: 'Sparkles',
    color: { solid: 'bg-indigo-500', soft: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400' }
  },
  {
    id: 'cheatsheet', name: 'Cheatsheet', nameZh: '速查表', description: 'Git、Docker、Linux', icon: 'BookOpen',
    color: { solid: 'bg-slate-500', soft: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300' }
  }
]

export function getCategoryById(id: string): CategoryDefinition | undefined {
  return categories.find(c => c.id === id)
}
