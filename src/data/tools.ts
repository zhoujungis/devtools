import type { ToolDefinition } from '@/types/tool'

export const tools: ToolDefinition[] = [
  {
    id: 'json-formatter',
    name: 'JSON Formatter',
    nameZh: 'JSON 格式化',
    description: '格式化、压缩和校验 JSON 数据',
    category: 'developer',
    icon: 'Braces',
    keywords: ['json', 'format', 'beautify', 'pretty', '格式化', '压缩', '校验'],
    path: '/tools/json-formatter',
    component: () => import('@/tools/json-formatter/JsonFormatter.vue'),
    featured: true
  },
  {
    id: 'json-viewer',
    name: 'JSON Viewer',
    nameZh: 'JSON 查看器',
    description: '树形查看 JSON，可折叠展开',
    category: 'developer',
    icon: 'TreePines',
    keywords: ['json', 'viewer', 'tree', '查看', '树形'],
    path: '/tools/json-viewer',
    component: () => import('@/tools/json-viewer/JsonViewer.vue'),
    featured: true
  },
  {
    id: 'json-diff',
    name: 'JSON Diff',
    nameZh: 'JSON 对比',
    description: '比较两个 JSON 的差异',
    category: 'developer',
    icon: 'GitCompare',
    keywords: ['json', 'diff', 'compare', '对比', '差异'],
    path: '/tools/json-diff',
    component: () => import('@/tools/json-diff/JsonDiff.vue'),
    featured: false
  },
  {
    id: 'base64',
    name: 'Base64',
    nameZh: 'Base64 编码/解码',
    description: '文本、文件与图片的 Base64 互转',
    category: 'encoding',
    icon: 'Binary',
    keywords: ['base64', 'encode', 'decode', '编码', '解码'],
    path: '/tools/base64',
    component: () => import('@/tools/base64/Base64.vue'),
    featured: true
  },
  {
    id: 'url',
    name: 'URL Encoder',
    nameZh: 'URL 编码/解析',
    description: 'URL 编码、解码与结构解析',
    category: 'encoding',
    icon: 'Link',
    keywords: ['url', 'encode', 'decode', 'parser', '查询', '解析'],
    path: '/tools/url',
    component: () => import('@/tools/url/UrlTool.vue'),
    featured: true
  },
  {
    id: 'jwt-decoder',
    name: 'JWT Decoder',
    nameZh: 'JWT 解码',
    description: '解码 JWT Header 与 Payload，本地处理',
    category: 'security',
    icon: 'Key',
    keywords: ['jwt', 'token', 'decode', 'header', 'payload', '验证'],
    path: '/tools/jwt-decoder',
    component: () => import('@/tools/jwt-decoder/JwtDecoder.vue'),
    featured: true
  },
  {
    id: 'hash',
    name: 'Hash Generator',
    nameZh: 'Hash 生成',
    description: 'MD5、SHA-1/256/384/512 本地生成',
    category: 'security',
    icon: 'Fingerprint',
    keywords: ['hash', 'md5', 'sha', 'sha256', '加密', '摘要'],
    path: '/tools/hash',
    component: () => import('@/tools/hash/Hash.vue'),
    featured: true
  },
  {
    id: 'uuid',
    name: 'UUID Generator',
    nameZh: 'UUID 生成器',
    description: '批量生成 UUID v4，支持大小写与连字符',
    category: 'generator',
    icon: 'Fingerprint',
    keywords: ['uuid', 'guid', 'generate', 'v4', '随机'],
    path: '/tools/uuid',
    component: () => import('@/tools/uuid/Uuid.vue'),
    featured: true
  },
  {
    id: 'timestamp',
    name: 'Timestamp Converter',
    nameZh: '时间戳转换',
    description: 'Unix 时间戳与日期互转，支持秒/毫秒',
    category: 'time',
    icon: 'Clock',
    keywords: ['timestamp', 'unix', 'date', 'time', '时间戳', '转换'],
    path: '/tools/timestamp',
    component: () => import('@/tools/timestamp/Timestamp.vue'),
    featured: true
  },
  {
    id: 'regex',
    name: 'Regex Tester',
    nameZh: '正则测试',
    description: '正则表达式测试、匹配高亮与替换',
    category: 'text',
    icon: 'Regex',
    keywords: ['regex', 'regexp', 'test', 'match', '正则', '匹配'],
    path: '/tools/regex',
    component: () => import('@/tools/regex/Regex.vue'),
    featured: true
  },
  {
    id: 'text-diff',
    name: 'Text Diff',
    nameZh: '文本对比',
    description: '行级/字符级文本差异对比',
    category: 'text',
    icon: 'FileDiff',
    keywords: ['diff', 'compare', 'text', '对比', '差异'],
    path: '/tools/text-diff',
    component: () => import('@/tools/text-diff/TextDiff.vue'),
    featured: false
  },
  {
    id: 'sql-formatter',
    name: 'SQL Formatter',
    nameZh: 'SQL 格式化',
    description: '支持 MySQL、PostgreSQL 等 SQL 美化',
    category: 'developer',
    icon: 'Database',
    keywords: ['sql', 'format', 'mysql', 'postgres', '格式化'],
    path: '/tools/sql-formatter',
    component: () => import('@/tools/sql-formatter/SqlFormatter.vue'),
    featured: false
  },
  {
    id: 'markdown',
    name: 'Markdown Preview',
    nameZh: 'Markdown 预览',
    description: 'Markdown 编辑与实时预览',
    category: 'developer',
    icon: 'FileText',
    keywords: ['markdown', 'md', 'preview', 'html', '预览'],
    path: '/tools/markdown',
    component: () => import('@/tools/markdown/Markdown.vue'),
    featured: false
  },
  {
    id: 'ai-code-detector',
    name: 'AI Code Detector',
    nameZh: 'AI 代码检测',
    description: '基于代码风格特征评估 AI 生成倾向，不上传代码',
    category: 'developer',
    icon: 'Bot',
    keywords: ['ai', 'code', 'detector', 'llm', 'generated', '代码检测', '人工智能'],
    path: '/tools/ai-code-detector',
    component: () => import('@/tools/ai-code-detector/AiCodeDetector.vue'),
    featured: true,
    processing: 'mixed'
  },
  {
    id: 'qrcode',
    name: 'QR Code Generator',
    nameZh: '二维码生成',
    description: '文本/链接转二维码，支持 PNG/SVG',
    category: 'generator',
    icon: 'QrCode',
    keywords: ['qrcode', 'qr', 'code', '二维码', '生成'],
    path: '/tools/qrcode',
    component: () => import('@/tools/qrcode/QrCode.vue'),
    featured: false
  },
  {
    id: 'cron',
    name: 'Cron Parser',
    nameZh: 'Cron 解析',
    description: 'Cron 表达式解析与未来执行时间',
    category: 'time',
    icon: 'Timer',
    keywords: ['cron', 'schedule', '定时', '解析', '任务'],
    path: '/tools/cron',
    component: () => import('@/tools/cron/Cron.vue'),
    featured: false
  },
  {
    id: 'cidr',
    name: 'CIDR Calculator',
    nameZh: 'CIDR 计算器',
    description: 'IPv4 CIDR 网络计算',
    category: 'network',
    icon: 'Network',
    keywords: ['cidr', 'ip', 'network', '子网', '计算'],
    path: '/tools/cidr',
    component: () => import('@/tools/cidr/Cidr.vue'),
    featured: false
  },
  {
    id: 'dns',
    name: 'DNS Lookup',
    nameZh: 'DNS 查询',
    description: '通过 DNS over HTTPS 查询 A、AAAA、MX、TXT 等记录',
    category: 'network',
    icon: 'Globe',
    keywords: ['dns', 'lookup', 'doh', 'a', 'aaaa', 'mx', 'txt', '域名', '解析'],
    path: '/tools/dns',
    component: () => import('@/tools/dns/Dns.vue'),
    featured: true,
    processing: 'external'
  },
  {
    id: 'ip-lookup',
    name: 'IP Lookup',
    nameZh: 'IP 地址查询',
    description: '查询 IP 的地理位置、运营商、ASN 和安全信息',
    category: 'network',
    icon: 'MapPin',
    keywords: ['ip', 'lookup', 'geo', 'whois', 'asn', 'isp', '地址', '归属地'],
    path: '/tools/ip-lookup',
    component: () => import('@/tools/ip-lookup/IpLookup.vue'),
    featured: true,
    processing: 'external'
  },
  {
    id: 'ping',
    name: 'HTTP Ping',
    nameZh: 'Ping 延迟检测',
    description: '通过浏览器 HTTP 请求测量目标地址的网络延迟',
    category: 'network',
    icon: 'Activity',
    keywords: ['ping', 'http', 'latency', '延迟', '连通性', '网络'],
    path: '/tools/ping',
    component: () => import('@/tools/ping/Ping.vue'),
    featured: true,
    processing: 'external'
  },
  {
    id: 'icmp',
    name: 'ICMP Ping',
    nameZh: 'ICMP Ping',
    description: '了解 ICMP Ping 的浏览器限制，并获取本地命令示例',
    category: 'network',
    icon: 'RadioTower',
    keywords: ['icmp', 'ping', 'echo', '网络诊断', '连通性'],
    path: '/tools/icmp',
    component: () => import('@/tools/icmp/Icmp.vue'),
    featured: false
  }
]

export function getToolById(id: string) {
  return tools.find(t => t.id === id)
}
export function getToolByPath(path: string) {
  return tools.find(t => t.path === path)
}
export function getToolsByCategory(cat: string) {
  return tools.filter(t => t.category === cat)
}
export function searchTools(query: string) {
  const q = query.toLowerCase().trim()
  if (!q) return tools
  return tools.filter(t =>
    t.name.toLowerCase().includes(q) ||
    t.nameZh.includes(q) ||
    t.description.toLowerCase().includes(q) ||
    t.keywords.some(k => k.toLowerCase().includes(q)) ||
    t.category.toLowerCase().includes(q)
  )
}
