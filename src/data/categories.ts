import type { CategoryDefinition } from '@/types/tool'

export const categories: CategoryDefinition[] = [
  { id: 'developer', name: 'Developer', nameZh: '开发工具', description: 'JSON、SQL、Markdown 等', icon: 'Code2', color: 'bg-blue-500' },
  { id: 'encoding', name: 'Encoding', nameZh: '编码/解码', description: 'Base64、URL、HTML 实体', icon: 'Binary', color: 'bg-emerald-500' },
  { id: 'security', name: 'Security', nameZh: '加密/安全', description: 'Hash、JWT、密码生成', icon: 'Shield', color: 'bg-amber-500' },
  { id: 'network', name: 'Network', nameZh: '网络工具', description: 'Ping、DNS、IP、CIDR 等网络诊断', icon: 'Globe', color: 'bg-cyan-500' },
  { id: 'time', name: 'Time', nameZh: '时间工具', description: '时间戳、时区、Cron', icon: 'Clock', color: 'bg-purple-500' },
  { id: 'text', name: 'Text', nameZh: '文本工具', description: 'Diff、正则、字符统计', icon: 'FileText', color: 'bg-orange-500' },
  { id: 'generator', name: 'Generator', nameZh: '生成器', description: 'UUID、QR、Lorem', icon: 'Sparkles', color: 'bg-indigo-500' },
  { id: 'cheatsheet', name: 'Cheatsheet', nameZh: '速查表', description: 'Git、Docker、Linux', icon: 'BookOpen', color: 'bg-slate-500' }
]
