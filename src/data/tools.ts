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
    icon: 'ListTree',
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
    description: 'SHA-1/256/384/512 本地生成',
    category: 'security',
    icon: 'Fingerprint',
    keywords: ['hash', 'sha', 'sha256', '加密', '摘要'],
    path: '/tools/hash',
    component: () => import('@/tools/hash/Hash.vue'),
    featured: true
  },
  {
    id: 'md5',
    name: 'MD5 Generator',
    nameZh: 'MD5 生成',
    description: '文本与文件的 MD5 摘要本地计算，支持拖拽文件',
    category: 'security',
    icon: 'FileDigit',
    keywords: ['md5', 'hash', '摘要', '校验', 'checksum', '文件校验'],
    path: '/tools/md5',
    component: () => import('@/tools/md5/Md5.vue'),
    featured: true
  },
  {
    id: 'password-generator',
    name: 'Password Generator',
    nameZh: '密码生成器',
    description: '高强度随机密码与记忆短语，可调长度与字符集',
    category: 'security',
    icon: 'KeyRound',
    keywords: ['password', '密码', '随机', '生成器', '安全'],
    path: '/tools/password-generator',
    component: () => import('@/tools/password-generator/PasswordGenerator.vue'),
    featured: true
  },
  {
    id: 'aes-cipher',
    name: 'AES Encrypt/Decrypt',
    nameZh: 'AES 加解密',
    description: 'AES-256-GCM 文本加解密，PBKDF2 派生密钥，本地完成',
    category: 'security',
    icon: 'Lock',
    keywords: ['aes', '加密', '解密', 'gcm', 'encrypt', 'decrypt'],
    path: '/tools/aes-cipher',
    component: () => import('@/tools/aes-cipher/AesCipher.vue')
  },
  {
    id: 'totp',
    name: 'TOTP Generator',
    nameZh: 'TOTP 验证码',
    description: '两步验证动态码生成，支持 otpauth URI 与多算法',
    category: 'security',
    icon: 'Smartphone',
    keywords: ['totp', 'otp', '2fa', '两步验证', '验证码', 'otpauth'],
    path: '/tools/totp',
    component: () => import('@/tools/totp/Totp.vue')
  },
  {
    id: 'radix',
    name: 'Radix Converter',
    nameZh: '进制转换',
    description: '2–36 进制互转，支持大整数与前缀自动识别',
    category: 'encoding',
    icon: 'Calculator',
    keywords: ['进制', 'radix', 'hex', 'binary', 'octal', 'base'],
    path: '/tools/radix',
    component: () => import('@/tools/radix/RadixConverter.vue')
  },
  {
    id: 'unicode',
    name: 'Unicode Converter',
    nameZh: 'Unicode 转换',
    description: '字符与码点互转，查看 UTF-8 编码与所属区块',
    category: 'text',
    icon: 'Type',
    keywords: ['unicode', '码点', 'utf-8', '转义', 'emoji'],
    path: '/tools/unicode',
    component: () => import('@/tools/unicode/UnicodeTool.vue')
  },
  {
    id: 'html-entity',
    name: 'HTML Entity',
    nameZh: 'HTML 实体',
    description: 'HTML 实体编码与解码，支持命名与数字实体',
    category: 'encoding',
    icon: 'CodeXml',
    keywords: ['html', 'entity', '实体', '转义', 'escape'],
    path: '/tools/html-entity',
    component: () => import('@/tools/html-entity/HtmlEntity.vue')
  },
  {
    id: 'image-base64',
    name: 'Image to Base64',
    nameZh: '图片 Base64',
    description: '图片与 Base64 Data URL 互转，拖拽即用',
    category: 'encoding',
    icon: 'Image',
    keywords: ['base64', '图片', 'data url', '编码'],
    path: '/tools/image-base64',
    component: () => import('@/tools/image-base64/ImageBase64.vue')
  },
  {
    id: 'csv-json',
    name: 'CSV ↔ JSON',
    nameZh: 'CSV ↔ JSON',
    description: 'CSV 与 JSON 互转，支持自定义分隔符与类型推断',
    category: 'developer',
    icon: 'Table',
    keywords: ['csv', 'json', '表格', '转换'],
    path: '/tools/csv-json',
    component: () => import('@/tools/csv-json/CsvJson.vue')
  },
  {
    id: 'config-converter',
    name: 'YAML/TOML Converter',
    nameZh: '配置格式互转',
    description: 'JSON、YAML、TOML 三种配置格式互相转换',
    category: 'developer',
    icon: 'FileCode',
    keywords: ['yaml', 'toml', 'json', '配置', '转换'],
    path: '/tools/config-converter',
    component: () => import('@/tools/config-converter/ConfigConverter.vue')
  },
  {
    id: 'xml-formatter',
    name: 'XML Formatter',
    nameZh: 'XML 格式化',
    description: 'XML 格式化、校验与转 JSON',
    category: 'developer',
    icon: 'SquareCode',
    keywords: ['xml', '格式化', '格式', '转换'],
    path: '/tools/xml-formatter',
    component: () => import('@/tools/xml-formatter/XmlFormatter.vue')
  },
  {
    id: 'svg-viewer',
    name: 'SVG Viewer',
    nameZh: 'SVG 预览',
    description: 'SVG 实时预览、清理优化与下载',
    category: 'developer',
    icon: 'Shapes',
    keywords: ['svg', '预览', '矢量图', '优化'],
    path: '/tools/svg-viewer',
    component: () => import('@/tools/svg-viewer/SvgViewer.vue')
  },
  {
    id: 'mock-data',
    name: 'Mock Data Generator',
    nameZh: '测试数据生成',
    description: '随机中文用户资料与合法测试卡号，导出 JSON',
    category: 'generator',
    icon: 'Shuffle',
    keywords: ['mock', '测试数据', '假数据', '用户', 'luhn'],
    path: '/tools/mock-data',
    component: () => import('@/tools/mock-data/MockData.vue')
  },
  {
    id: 'color',
    name: 'Color Tools',
    nameZh: '颜色工具',
    description: 'HEX/RGB/HSL 转换、色阶、配色方案与对比度检查',
    category: 'generator',
    icon: 'Palette',
    keywords: ['颜色', 'color', 'hsl', 'rgb', '调色板', '对比度'],
    path: '/tools/color',
    component: () => import('@/tools/color/ColorTool.vue'),
    featured: true
  },
  {
    id: 'css-gradient',
    name: 'CSS Gradient',
    nameZh: 'CSS 渐变',
    description: '可视化生成线性/径向渐变 CSS，多色标与预设',
    category: 'generator',
    icon: 'Blend',
    keywords: ['css', 'gradient', '渐变', '背景'],
    path: '/tools/css-gradient',
    component: () => import('@/tools/css-gradient/CssGradient.vue')
  },
  {
    id: 'css-shadow',
    name: 'CSS Shadow',
    nameZh: 'CSS 阴影',
    description: 'box-shadow 可视化调参，输出 CSS 与 Tailwind 任意值',
    category: 'generator',
    icon: 'Box',
    keywords: ['css', 'shadow', '阴影', 'box-shadow', 'tailwind'],
    path: '/tools/css-shadow',
    component: () => import('@/tools/css-shadow/CssShadow.vue')
  },
  {
    id: 'favicon-generator',
    name: 'Favicon Generator',
    nameZh: 'Favicon 生成',
    description: '字母图标绘制，导出 favicon/PWA 全套 PNG',
    category: 'generator',
    icon: 'Hexagon',
    keywords: ['favicon', '图标', 'icon', 'pwa'],
    path: '/tools/favicon-generator',
    component: () => import('@/tools/favicon-generator/FaviconGenerator.vue')
  },
  {
    id: 'image-compress',
    name: 'Image Compressor',
    nameZh: '图片压缩',
    description: '本地压缩为 WebP/JPEG，可调质量与尺寸',
    category: 'generator',
    icon: 'FileImage',
    keywords: ['图片压缩', 'webp', 'jpeg', 'compress'],
    path: '/tools/image-compress',
    component: () => import('@/tools/image-compress/ImageCompress.vue')
  },
  {
    id: 'exif-viewer',
    name: 'EXIF Viewer',
    nameZh: 'EXIF 查看',
    description: '读取照片 EXIF 元数据，检查 GPS 等隐私信息',
    category: 'generator',
    icon: 'Camera',
    keywords: ['exif', '照片信息', '元数据', 'gps'],
    path: '/tools/exif-viewer',
    component: () => import('@/tools/exif-viewer/ExifViewer.vue')
  },
  {
    id: 'char-stats',
    name: 'Character Counter',
    nameZh: '字符统计',
    description: '字数、行数、段落与字符频率分析，中英文混合支持',
    category: 'text',
    icon: 'WholeWord',
    keywords: ['字数统计', '字符', 'counter', '字数'],
    path: '/tools/char-stats',
    component: () => import('@/tools/char-stats/CharStats.vue')
  },
  {
    id: 'text-batch',
    name: 'Text Batch Ops',
    nameZh: '文本批处理',
    description: '去重、排序、大小写、查找替换等一行一操作',
    category: 'text',
    icon: 'ListFilter',
    keywords: ['文本处理', '去重', '排序', '查找替换', '批量'],
    path: '/tools/text-batch',
    component: () => import('@/tools/text-batch/TextBatch.vue')
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
