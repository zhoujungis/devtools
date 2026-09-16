export interface CharStats {
  chars: number
  charsNoSpaces: number
  words: number
  lines: number
  sentences: number
  paragraphs: number
  cjkChars: number
  asciiChars: number
  digits: number
  readingMinutes: number
  topChars: { char: string; count: number }[]
}

export function charStats(text: string): CharStats {
  const trimmed = text
  const cjk = (trimmed.match(/[\u4e00-\u9fff\u3400-\u4dbf]/g) || []).length
  const asciiWords = (trimmed.match(/[A-Za-z0-9'’-]+/g) || []).length
  const lines = trimmed ? trimmed.split(/\r\n|\r|\n/).length : 0
  const sentences = (trimmed.match(/[.!?。！？]+/g) || []).length
  const paragraphs = trimmed.split(/\n\s*\n/).filter(p => p.trim()).length
  const freq = new Map<string, number>()
  for (const ch of Array.from(trimmed)) {
    if (/\s/.test(ch)) continue
    freq.set(ch, (freq.get(ch) || 0) + 1)
  }
  const topChars = Array.from(freq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([char, count]) => ({ char, count }))
  const charsNoSpaces = Array.from(trimmed).filter(c => !/\s/.test(c)).length
  const readUnits = cjk + asciiWords
  return {
    chars: Array.from(trimmed).length,
    charsNoSpaces,
    words: readUnits,
    lines,
    sentences,
    paragraphs,
    cjkChars: cjk,
    asciiChars: (trimmed.match(/[A-Za-z]/g) || []).length,
    digits: (trimmed.match(/\d/g) || []).length,
    // 中文约 300 字/分钟，英文约 200 词/分钟 → 简化折算
    readingMinutes: Math.max(readUnits ? 1 : 0, Math.round(readUnits / 300)),
    topChars
  }
}
