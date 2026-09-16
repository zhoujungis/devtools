export function charToCodepoints(text: string, format: 'U+' | 'html' | 'unicode' | 'decimal' | 'hex' = 'U+'): string {
  return Array.from(text).map(ch => {
    const cp = ch.codePointAt(0)!
    switch (format) {
      case 'U+': return `U+${cp.toString(16).toUpperCase().padStart(4, '0')}`
      case 'html': return cp > 127 ? `&#${cp};` : ch
      case 'unicode': return `\\u{${cp.toString(16)}}`
      case 'decimal': return String(cp)
      case 'hex': return cp.toString(16).padStart(4, '0')
    }
  }).join(format === 'html' || format === 'decimal' ? '' : ' ')
}

export function decodeEscape(input: string): string {
  let out = input
  // \u{1F600} or \uXXXX
  out = out.replace(/\\u\{([0-9a-fA-F]+)\}/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
  out = out.replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
  // &#123; / &#x1F600;
  out = out.replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
  out = out.replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
  // \U0001F600 (C# style) and %uXXXX
  out = out.replace(/%u([0-9a-fA-F]{4})/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
  return out
}

export function codepointInfo(ch: string): { cp: string; decimal: number; utf8: string; utf16: string; block: string } {
  const cp = ch.codePointAt(0)!
  const bytes: number[] = []
  if (cp < 0x80) bytes.push(cp)
  else if (cp < 0x800) bytes.push(0xc0 | (cp >> 6), 0x80 | (cp & 0x3f))
  else if (cp < 0x10000) bytes.push(0xe0 | (cp >> 12), 0x80 | ((cp >> 6) & 0x3f), 0x80 | (cp & 0x3f))
  else bytes.push(0xf0 | (cp >> 18), 0x80 | ((cp >> 12) & 0x3f), 0x80 | ((cp >> 6) & 0x3f), 0x80 | (cp & 0x3f))
  const utf16Len = ch.length
  return {
    cp: `U+${cp.toString(16).toUpperCase().padStart(4, '0')}`,
    decimal: cp,
    utf8: bytes.map(b => b.toString(16).toUpperCase().padStart(2, '0')).join(' '),
    utf16: utf16Len > 1 ? `代理对 (2 个 UTF-16 码元)` : '1 个 UTF-16 码元',
    block: codeBlockName(cp)
  }
}

function codeBlockName(cp: number): string {
  const ranges: [number, number, string][] = [
    [0x0000, 0x007f, '基本拉丁'], [0x0080, 0x00ff, '拉丁文补充'], [0x0370, 0x03ff, '希腊文'],
    [0x0400, 0x04ff, '西里尔文'], [0x2000, 0x206f, '常用标点'], [0x3000, 0x303f, 'CJK 符号和标点'],
    [0x3040, 0x309f, '平假名'], [0x30a0, 0x30ff, '片假名'], [0x4e00, 0x9fff, 'CJK 统一表意文字'],
    [0xac00, 0xd7af, '韩文音节'], [0x1f300, 0x1f5ff, '杂项符号和图形'], [0x1f600, 0x1f64f, '表情符号'],
    [0xff00, 0xffef, '半角及全角形式']
  ]
  for (const [lo, hi, name] of ranges) if (cp >= lo && cp <= hi) return name
  return '其他区块'
}
