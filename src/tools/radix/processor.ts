const DIGITS = '0123456789abcdefghijklmnopqrstuvwxyz'

export function parseToDecimal(input: string, fromBase: number): bigint | null {
  const clean = input.trim().replace(/[\s_]/g, '').toLowerCase()
  if (!clean) return null
  if (fromBase < 2 || fromBase > 36) return null
  let negative = false
  let body = clean
  if (body.startsWith('-')) { negative = true; body = body.slice(1) }
  let result = 0n
  const base = BigInt(fromBase)
  for (const ch of body) {
    const d = DIGITS.indexOf(ch)
    if (d === -1 || d >= fromBase) return null
    result = result * base + BigInt(d)
  }
  return negative ? -result : result
}

export function fromDecimal(value: bigint, toBase: number): string {
  if (toBase < 2 || toBase > 36) return ''
  if (value === 0n) return '0'
  const negative = value < 0n
  let v = negative ? -value : value
  const base = BigInt(toBase)
  let out = ''
  while (v > 0n) {
    out = DIGITS[Number(v % base)] + out
    v /= base
  }
  return (negative ? '-' : '') + out
}

export function convertBase(input: string, fromBase: number, toBase: number): string {
  const dec = parseToDecimal(input, fromBase)
  if (dec === null) return ''
  return fromDecimal(dec, toBase)
}

export function parseAuto(input: string): { value: bigint; base: number } | null {
  const clean = input.trim()
  if (/^0x[0-9a-f]+$/i.test(clean)) return { value: parseToDecimal(clean.slice(2), 16)!, base: 16 }
  if (/^0o[0-7]+$/i.test(clean)) return { value: parseToDecimal(clean.slice(2), 8)!, base: 8 }
  if (/^0b[01]+$/i.test(clean)) return { value: parseToDecimal(clean.slice(2), 2)!, base: 2 }
  if (/^-?\d+$/.test(clean)) return { value: BigInt(clean), base: 10 }
  return null
}
