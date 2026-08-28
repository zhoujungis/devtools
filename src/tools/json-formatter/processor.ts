export interface JsonFormatResult {
  formatted: string
  minified: string
  valid: boolean
  error?: string
  line?: number
  column?: number
}

export function formatJson(input: string, indent: number = 2): JsonFormatResult {
  if (!input.trim()) return { formatted: '', minified: '', valid: true }
  try {
    const parsed = JSON.parse(input)
    const formatted = JSON.stringify(parsed, null, indent)
    const minified = JSON.stringify(parsed)
    return { formatted, minified, valid: true }
  } catch (e: any) {
    const msg = e?.message || 'Unknown error'
    // try to extract line/col from message like "Unexpected token } in JSON at position 15"
    let line: number | undefined
    let col: number | undefined
    const posMatch = msg.match(/position (\d+)/)
    if (posMatch) {
      const pos = parseInt(posMatch[1], 10)
      const before = input.slice(0, pos)
      line = before.split('\n').length
      col = before.split('\n').pop()!.length + 1
    }
    return { formatted: '', minified: '', valid: false, error: msg, line, column: col }
  }
}

export function validateJson(input: string): { valid: boolean; error?: string } {
  if (!input.trim()) return { valid: true }
  try { JSON.parse(input); return { valid: true } } catch (e:any) { return { valid:false, error: e.message } }
}
