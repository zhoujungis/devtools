export interface CodeMetrics {
  lines: number
  codeLines: number
  commentLines: number
  blankLines: number
  characters: number
  averageLineLength: number
  maxLineLength: number
  functionCount: number
  todoCount: number
}

export interface DetectionSignal {
  label: string
  detail: string
  impact: 'positive' | 'neutral' | 'negative'
}

export interface AiDetectionResult {
  valid: boolean
  error?: string
  score: number
  level: 'low' | 'medium' | 'high'
  label: string
  caveat: string
  modelHint: string
  sampleNote: string
  metrics: CodeMetrics
  signals: DetectionSignal[]
}

export interface GithubRepositoryRef {
  owner: string
  repository: string
}

export const MAX_SOURCE_LENGTH = 1_000_000

export function parseGithubRepository(input: string): GithubRepositoryRef | null {
  const value = input.trim().replace(/\.git$/, '').replace(/\/+$/, '')
  if (!value) return null
  try {
    const url = new URL(/^https?:\/\//i.test(value) ? value : `https://github.com/${value}`)
    if (url.hostname.toLowerCase() !== 'github.com') return null
    const parts = url.pathname.split('/').filter(Boolean)
    if (parts.length < 2 || !/^[a-z\d-]+$/i.test(parts[0]) || !/^[a-z\d_.-]+$/i.test(parts[1])) return null
    return { owner: parts[0], repository: parts[1] }
  } catch {
    return null
  }
}

const COMMENT_PATTERN = /^\s*(\/\/|#|\/\*|\*|<!--)/
const FUNCTION_PATTERN = /\b(?:function|class|def|fn)\b|=>\s*[{(]/g
const GENERIC_COMMENT_PATTERN = /\b(?:todo|fixme|generated|auto-generated|implementation|initialize|returns?|parameters?|根据|实现|初始化|返回|参数)\b/i
const AI_BOILERPLATE_PATTERN = /\b(?:here(?:'|’)s|note that|please note|as an ai|certainly|in conclusion|overall)\b|下面是|以下代码|希望这能帮助/i

function round(value: number): number {
  return Math.round(value * 10) / 10
}

export function analyzeCode(source: string): AiDetectionResult {
  if (source.length > MAX_SOURCE_LENGTH) {
    const metrics: CodeMetrics = { lines: 0, codeLines: 0, commentLines: 0, blankLines: 0, characters: source.length, averageLineLength: 0, maxLineLength: 0, functionCount: 0, todoCount: 0 }
    return { valid: false, error: `源码不能超过 ${MAX_SOURCE_LENGTH} 个字符`, score: 0, level: 'low', label: '源码过大', caveat: '请分批分析较小的文件或模块。', modelHint: '源码过大，未进行模型来源标记分析', sampleNote: '样本超过安全处理上限。', metrics, signals: [] }
  }
  const code = source.replace(/\r\n?/g, '\n')
  const lines = code ? code.split('\n') : []
  const blankLines = lines.filter(line => line.trim() === '').length
  const commentLines = lines.filter(line => COMMENT_PATTERN.test(line)).length
  const codeLines = Math.max(0, lines.length - blankLines - commentLines)
  const lengths = lines.filter(line => line.trim()).map(line => line.trimEnd().length)
  const characters = code.length
  const averageLineLength = lengths.length ? round(lengths.reduce((sum, length) => sum + length, 0) / lengths.length) : 0
  const maxLineLength = lengths.length ? Math.max(...lengths) : 0
  const functionCount = (code.match(FUNCTION_PATTERN) || []).length
  const todoCount = (code.match(/\b(?:todo|fixme)\b/gi) || []).length
  const metrics: CodeMetrics = {
    lines: lines.length,
    codeLines,
    commentLines,
    blankLines,
    characters,
    averageLineLength,
    maxLineLength,
    functionCount,
    todoCount
  }

  const modelMarkers: Array<{ name: string; pattern: RegExp }> = [
    { name: 'ChatGPT / OpenAI', pattern: /chatgpt|openai|gpt-[234o]/i },
    { name: 'GitHub Copilot', pattern: /github\s+copilot|copilot/i },
    { name: 'Claude / Anthropic', pattern: /claude|anthropic/i },
    { name: 'Gemini / Google AI', pattern: /google\s+gemini|gemini/i },
    { name: 'Cursor', pattern: /cursor\s+(?:ai|editor)|generated\s+by\s+cursor/i },
    { name: 'Codeium / Windsurf', pattern: /codeium|windsurf/i }
  ]
  const modelMarker = modelMarkers.find(marker => marker.pattern.test(code))
  const modelHint = modelMarker
    ? `发现“${modelMarker.name}”相关文字，仅代表源码中有来源标记，不能证明由该工具生成`
    : '未发现可验证的模型来源标记，无法判断具体是哪一个 AI'
  const sampleNote = codeLines >= 40
    ? '样本达到 40 行以上，更适合观察代码风格；仍不代表作者身份结论。'
    : `当前只有 ${codeLines} 行代码，样本偏短，结果可靠性有限；建议结合更完整的提交记录。`

  if (code.trim().length < 20) {
    return {
      valid: false,
      error: '请至少输入 20 个字符的代码，再进行分析',
      score: 0,
      level: 'low',
      label: '代码太短',
      caveat: '样本过短时，任何风格判断都没有统计意义。',
      modelHint,
      sampleNote,
      metrics,
      signals: []
    }
  }

  let score = 18
  const signals: DetectionSignal[] = []
  const nonBlank = lines.filter(line => line.trim())
  const commentRatio = nonBlank.length ? commentLines / nonBlank.length : 0
  const lineLengthVariance = lengths.length > 1
    ? lengths.reduce((sum, length) => sum + Math.abs(length - averageLineLength), 0) / lengths.length
    : 0
  const punctuationComments = lines.filter(line => COMMENT_PATTERN.test(line) && /[.!。！？]$/.test(line.trim())).length

  if (commentRatio >= 0.35 && punctuationComments >= 2) {
    score += 18
    signals.push({ label: '解释性注释偏多', detail: `注释占非空行 ${Math.round(commentRatio * 100)}%，且多为完整句子`, impact: 'positive' })
  } else if (commentRatio >= 0.2) {
    score += 7
    signals.push({ label: '包含较多注释', detail: `注释占非空行 ${Math.round(commentRatio * 100)}%`, impact: 'positive' })
  }

  const genericComments = lines.filter(line => COMMENT_PATTERN.test(line) && GENERIC_COMMENT_PATTERN.test(line)).length
  if (genericComments >= 2) {
    score += Math.min(16, genericComments * 4)
    signals.push({ label: '模板化注释', detail: `发现 ${genericComments} 行常见说明式注释`, impact: 'positive' })
  }

  const boilerplateMatches = code.match(AI_BOILERPLATE_PATTERN) || []
  if (boilerplateMatches.length) {
    score += Math.min(15, boilerplateMatches.length * 5)
    signals.push({ label: '回答式文本混入代码', detail: '发现类似解释、总结或对话式措辞', impact: 'positive' })
  }

  if (lengths.length >= 8 && lineLengthVariance <= 8) {
    score += 12
    signals.push({ label: '行长度规律性较高', detail: '非空代码行长度变化较小，呈现较强格式规律', impact: 'positive' })
  }

  const repeatedLines = new Set<string>()
  const lineCounts = new Map<string, number>()
  nonBlank.forEach(line => {
    const normalized = line.trim().replace(/\s+/g, ' ')
    lineCounts.set(normalized, (lineCounts.get(normalized) || 0) + 1)
  })
  lineCounts.forEach((count, line) => {
    if (count >= 3 && line.length > 12) repeatedLines.add(line)
  })
  if (repeatedLines.size >= 2) {
    score += 8
    signals.push({ label: '重复模板片段', detail: `发现 ${repeatedLines.size} 组重复行，可能来自批量生成或复制模板`, impact: 'positive' })
  }

  if (todoCount > 0) {
    score -= 8
    signals.push({ label: '保留 TODO/FIXME', detail: `发现 ${todoCount} 个待办标记，更接近持续迭代中的代码`, impact: 'negative' })
  }

  if (commentRatio === 0 && functionCount > 0) {
    score -= 5
    signals.push({ label: '没有注释', detail: '样本中未发现注释；这不是人工编写的证明', impact: 'negative' })
  }

  score = Math.max(0, Math.min(100, Math.round(score)))
  const level: AiDetectionResult['level'] = score >= 65 ? 'high' : score >= 38 ? 'medium' : 'low'
  const label = level === 'high' ? 'AI 风格倾向较高' : level === 'medium' ? '存在部分 AI 风格特征' : 'AI 风格倾向较低'
  signals.push({ label: '仅供参考', detail: '风格特征会受到格式化工具、团队规范和个人习惯影响', impact: 'neutral' })

  return {
    valid: true,
    score,
    level,
    label,
    caveat: '这不是作者身份鉴定，也不能可靠证明代码是否由 AI 生成。请结合提交记录、运行测试和人工审查判断。',
    modelHint,
    sampleNote,
    metrics,
    signals
  }
}

export function sampleCode(): string {
  return `export function groupBy<T>(items: T[], key: keyof T) {\n  // Initialize an empty map for grouped values.\n  const groups: Record<string, T[]> = {}\n  items.forEach((item) => {\n    const value = String(item[key])\n    if (!groups[value]) groups[value] = []\n    groups[value].push(item)\n  })\n  return groups\n}`
}
