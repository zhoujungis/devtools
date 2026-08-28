# DevBox · 程序员工具箱

DevBox 是一个基于 Vue 3、TypeScript 和 Vite 的浏览器端开发者工具箱。它提供 JSON、编码、安全、网络、时间、文本和生成器等常用工具，默认不需要登录，能够在浏览器本地完成大多数处理。

## 项目特点

- **打开即用**：工具通过独立 URL 访问，不需要账号或后端数据库。
- **本地优先**：JSON、JWT、Hash、正则、Diff、AI 代码风格分析等默认在当前浏览器完成。
- **外部请求显式标注**：DNS、IP 查询、HTTP Ping 和 AI 检测的网页/GitHub 导入会在页面中提示数据流向。
- **统一工具注册表**：所有工具都通过 `ToolDefinition` 注册，路由、搜索、分类、收藏和最近使用记录自动复用同一份元数据。
- **响应式 UI**：支持桌面端和移动端，工具页面在窄屏下自动切换为单栏布局。
- **主题与无障碍**：支持 Light / Dark / System，搜索弹窗、Toast、编辑器和主要交互提供键盘与 ARIA 支持。
- **按需加载**：工具页面和 CodeMirror 语言包按路由/语言懒加载，避免首页加载全部编辑器依赖。
- **PWA**：生产构建会生成 manifest、Service Worker 和离线缓存资源。

## 工具清单

当前共 21 个工具。

| 分类   | 工具                                 | 处理方式                               |
| ------ | ------------------------------------ | -------------------------------------- |
| 开发   | JSON 格式化、JSON 查看器、JSON 对比  | 浏览器本地                             |
| 开发   | SQL 格式化、Markdown 预览            | 浏览器本地                             |
| 开发   | AI 代码检测                          | 本地分析；网页/GitHub 导入需要外部请求 |
| 编码   | Base64 编码/解码、URL 编码/解码/解析 | 浏览器本地                             |
| 安全   | Hash、HMAC-SHA256、JWT 解码          | 浏览器本地                             |
| 网络   | CIDR 计算器                          | 浏览器本地                             |
| 网络   | DNS 查询                             | Cloudflare DNS over HTTPS              |
| 网络   | IP 地址查询                          | IPWho 第三方接口                       |
| 网络   | Ping 延迟检测                        | HTTP HEAD 请求                         |
| 网络   | ICMP Ping 说明                       | 本地命令示例，不直接发送 ICMP          |
| 时间   | 时间戳转换、Cron 解析                | 浏览器本地                             |
| 文本   | 正则测试、行级/字符级 Text Diff      | 浏览器本地                             |
| 生成器 | UUID v4、二维码 PNG/SVG              | 浏览器本地                             |

另外提供 Git、Docker、Linux 和 Nginx 常用命令速查表。

## 网络工具说明

### DNS 查询

DNS 工具支持 `A`、`AAAA`、`CNAME`、`MX`、`NS`、`TXT` 和 `CAA` 记录。查询通过浏览器向 Cloudflare DNS over HTTPS 发起请求，不使用用户设备的本地 DNS 配置。输入的域名会发送给该第三方服务，不要提交内部域名或敏感信息。

### IP 地址查询

IP 工具支持 IPv4、IPv6 和留空查询当前出口 IP，返回地区、城市、时区、ISP、组织、ASN 以及部分代理/VPN 信息。地理位置和运营商数据仅供参考，输入的 IP 会发送到 IPWho 服务。

### Ping 延迟检测

浏览器不能像系统 `ping` 命令一样直接创建 ICMP socket，因此网页 Ping 使用 HTTP `HEAD` 请求测量往返时间。结果会受到目标站点的 CORS、CDN、缓存、防火墙和 HTTP 服务状态影响，不能等同于 ICMP 延迟。

### ICMP Ping

纯浏览器页面没有发送原始 ICMP 报文的权限。ICMP 工具页提供跨平台命令示例：

```bash
# Windows
ping example.com

# macOS / Linux
ping -c 4 example.com
```

如果需要网页中真正执行 ICMP，需要增加具有网络权限的后端代理、桌面端程序或原生浏览器扩展，并单独设计鉴权和 SSRF 防护。

## AI 代码检测

AI 代码检测支持四种输入来源：

1. 直接粘贴代码或网页源码。
2. 导入本地 `.js`、`.ts`、`.vue`、`.html`、`.css`、`.json`、`.md`、`.sql`、`.yaml` 等文件。
3. 输入网页 URL，读取目标站点允许跨域访问的 HTML 源码。
4. 输入 GitHub 公开仓库地址，例如 `https://github.com/vuejs/core` 或 `vuejs/core`，可选指定分支。

GitHub 导入只读取公开仓库，不执行仓库代码，并限制最多 24 个源码文件、单文件 120 KB、总大小 800 KB。网页导入限制为 2 MB，目标站点必须允许浏览器跨域请求。

检测结果包含：

- 代码行、注释行、空行、平均行长、最长行、函数/类数量和 TODO/FIXME 数量。
- 注释密度、模板化注释、回答式文本、行长度规律、重复片段等可解释信号。
- 可选的模型来源文字标记，例如 `Copilot`、`Claude` 或 `ChatGPT`。

该功能是风格启发式评估，不是作者身份鉴定。代码样本过短、经过格式化、遵循团队模板或人工模仿 AI 风格时都可能误判；源码中的模型名称也只能作为未验证标记，不能证明具体由哪个模型生成。参考：[Pangram：AI 代码检测器的工作方式与局限](https://www.pangram.com/zh/blog/ai-code-detector)。

## 隐私与安全

### 默认本地处理

以下工具的核心计算在浏览器内完成，不会自动上传输入内容：

- JSON Formatter / Viewer / Diff
- Base64、URL、JWT、Hash、HMAC
- UUID、二维码、时间戳、Cron、CIDR
- 正则测试、Text Diff、SQL 格式化、Markdown 预览
- AI 代码风格分析（不包含网页和 GitHub 源码获取过程）

### 会产生外部请求的功能

- DNS 查询：Cloudflare DNS over HTTPS。
- IP 查询：IPWho。
- HTTP Ping：目标地址本身。
- AI 网页检测：输入的网页地址。
- AI GitHub 检测：GitHub API 和 `raw.githubusercontent.com`。

工具页会显示本地/外部/混合处理状态。外部请求不应携带 Token、密码、内网地址、客户代码或其他敏感数据。

### 输入防护

- 正则测试限制表达式和文本长度，并拦截常见嵌套量词回溯模式。
- 正则高亮和 Markdown 预览均经过 HTML 转义或 DOMPurify 清理。
- URL、IP、域名、时间戳和 UUID 批量数量都进行格式或范围校验。
- 异步查询、Hash、二维码生成会丢弃过期结果，避免旧请求覆盖新输入。
- 生产部署通过 `public/_headers` 提供 CSP、`X-Frame-Options`、`X-Content-Type-Options`、Referrer-Policy 和 Permissions-Policy。

## 技术栈

- Vue 3.5 + `<script setup>`
- TypeScript 5.7 + `vue-tsc`
- Vite 6
- Vue Router 4
- Pinia 3
- Tailwind CSS 3
- CodeMirror 6
- Lucide Vue Next
- Vitest + Happy DOM
- Playwright（浏览器回归）
- vite-plugin-pwa

主要功能库：

- `DOMPurify`：HTML 清理
- `marked`：Markdown 解析
- `diff`：行级和字符级 Diff
- `sql-formatter`：SQL 格式化
- `qrcode`：二维码生成
- `dayjs`：日期与时间处理
- `cron-parser`：Cron 解析
- `md5`：MD5 摘要

## 目录结构

```text
src/
├── components/
│   ├── common/              Toast 等通用组件
│   ├── editor/              CodeMirror 编辑器封装
│   └── layout/              Header、Footer、搜索弹窗
├── data/
│   ├── categories.ts        分类定义
│   └── tools.ts             工具注册表
├── layouts/
│   ├── DefaultLayout.vue    全局页面布局
│   └── ToolLayout.vue       工具页面包屑、收藏、处理方式提示
├── router/index.ts          路由和工具自动注册
├── stores/                  设置、收藏、最近使用、Toast
├── tools/<tool-id>/         processor、Vue 页面和单测
├── types/tool.ts            ToolDefinition / CategoryDefinition
├── utils/                   storage、download、seo
└── views/                   Home、Category、Favorites、Cheatsheet
public/
├── _headers                  Cloudflare Pages 安全响应头
├── _redirects                SPA fallback
├── robots.txt
└── icons/                    PWA 图标
```

## 本地开发

环境要求：Node.js 18+，建议使用 npm 10+。

```bash
# 安装依赖
npm install

# 启动开发服务器，默认 http://localhost:5173
npm run dev

# 生产构建到 dist/
npm run build

# 本地预览生产构建
npm run preview
```

开发服务器默认监听所有网卡，若只需要本机访问，可使用：

```bash
npm run dev -- --host 127.0.0.1
```

## 质量检查

```bash
# TypeScript 检查 + Vite 生产构建
npm run build

# Vitest 单测
npm run test

# ESLint 检查 Vue、TypeScript 和 JavaScript
npm run lint

# Prettier 格式化 src/
npm run format
```

提交代码前建议至少执行：

```bash
npm run lint && npm run test && npm run build
```

## 新增工具规范

以 `yaml-formatter` 为例：

```text
1. 创建 src/tools/yaml-formatter/
2. 编写 processor.ts，优先使用无副作用纯函数
3. 编写 YamlFormatter.vue，复用 ToolLayout 和 CodeEditor
4. 添加 processor.test.ts，覆盖正常输入、空输入和非法输入
5. 在 src/data/tools.ts 添加 ToolDefinition
6. 使用 component: () => import('./YamlFormatter.vue') 实现懒加载
7. 标注 processing: 'local'、'external' 或 'mixed'
8. 执行 npm run lint、npm run test 和 npm run build
```

一个最小注册项示例：

```ts
{
  id: 'yaml-formatter',
  name: 'YAML Formatter',
  nameZh: 'YAML 格式化',
  description: '格式化和校验 YAML',
  category: 'developer',
  icon: 'FileCode2',
  keywords: ['yaml', 'format', '格式化'],
  path: '/tools/yaml-formatter',
  component: () => import('@/tools/yaml-formatter/YamlFormatter.vue'),
  processing: 'local'
}
```

工具页面应遵循以下约定：

- 输入和输出状态清晰，非法输入必须显示可理解的错误。
- 长文本、批量数量、文件大小和外部请求必须设置上限或超时。
- 复制、下载、清空、切换模式等按钮提供明确反馈。
- 图标按钮提供 `aria-label` 或 `title`，键盘操作不能依赖鼠标悬停。
- 外部服务不得默认上传敏感数据，页面必须说明请求目标。
- 需要 `v-html` 时必须先经过可信的转义或 DOMPurify 清洗。

## 部署到 Cloudflare Pages

1. 执行 `npm run build`。
2. 将 `dist/` 作为部署目录。
3. 构建命令使用 `npm run build`，输出目录使用 `dist`。
4. `public/_redirects` 会随构建输出，用于 Vue Router 的 SPA fallback。
5. `public/_headers` 会随构建输出，用于安全响应头。
6. PWA 的 `manifest.webmanifest`、`sw.js` 和 Workbox 文件由构建自动生成。

项目没有写死生产域名。正式域名确定后，应在部署平台配置 canonical/分享链接和 sitemap，避免把示例域名提交给搜索引擎。

## 已知限制

- ICMP 不能由普通浏览器页面直接发送，需要后端、桌面端或原生扩展。
- HTTP Ping 只代表 HTTP 请求链路，不代表 ICMP 或 TCP 端口探测结果。
- DNS、IP、网页和 GitHub 导入依赖第三方网络、CORS 和服务限流。
- GitHub 检测当前只支持公开仓库，不支持私有仓库 Token。
- AI 检测不能可靠证明代码是否由 AI 编写，也不能仅凭风格确认具体模型。
- CodeMirror 和 SQL Formatter 仍是体积较大的功能依赖，但已通过路由和语言动态加载降低首页压力。

## 当前验收结果

- `npm run lint`：通过，0 error、0 warning。
- `npm run test`：18 个测试文件，49 个测试通过。
- `npm run build`：TypeScript 检查、Vite 生产构建和 PWA 生成通过。
- 浏览器回归：核心网络工具、AI 检测、正则 XSS 防护、JSON 全展开、字符 Diff 和响应式页面检查通过。

## License

当前仓库未声明开源许可证。如需对外发布或被其他项目依赖，请先补充明确的 License 文件。
