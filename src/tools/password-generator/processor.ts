const UPPER = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
const LOWER = 'abcdefghijkmnopqrstuvwxyz'
const DIGITS = '23456789'
const AMBIGUOUS_UPPER = 'IO'
const AMBIGUOUS_LOWER = 'l'
const AMBIGUOUS_DIGITS = '01'
const SYMBOLS = '!@#$%^&*()-_=+[]{};:,.<>?'

export interface PasswordOptions {
  length: number
  uppercase: boolean
  lowercase: boolean
  numbers: boolean
  symbols: boolean
  excludeAmbiguous: boolean
}

function poolFor(opts: PasswordOptions): string {
  let pool = ''
  if (opts.uppercase) pool += opts.excludeAmbiguous ? UPPER : UPPER + AMBIGUOUS_UPPER
  if (opts.lowercase) pool += opts.excludeAmbiguous ? LOWER : LOWER + AMBIGUOUS_LOWER
  if (opts.numbers) pool += opts.excludeAmbiguous ? DIGITS : DIGITS + AMBIGUOUS_DIGITS
  if (opts.symbols) pool += SYMBOLS
  return pool
}

export function generatePassword(opts: PasswordOptions): string {
  const pool = poolFor(opts)
  if (!pool || opts.length < 4) return ''
  const bytes = new Uint32Array(opts.length)
  crypto.getRandomValues(bytes)
  let out = ''
  for (let i = 0; i < opts.length; i++) out += pool[bytes[i] % pool.length]
  return out
}

export function generatePassphrase(words: string[], count: number, separator = '-'): string {
  if (!words.length || count < 1) return ''
  const bytes = new Uint32Array(count)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, b => words[b % words.length]).join(separator)
}

export function entropyBits(poolSize: number, length: number): number {
  if (poolSize <= 1 || length <= 0) return 0
  return Math.round(length * Math.log2(poolSize))
}

export function strengthLabel(bits: number): { label: string; color: string } {
  if (bits < 40) return { label: '弱', color: 'text-red-500' }
  if (bits < 60) return { label: '一般', color: 'text-amber-500' }
  if (bits < 80) return { label: '强', color: 'text-green-600' }
  return { label: '极强', color: 'text-emerald-600' }
}

export const DEMO_WORDS = [
  'apple','bridge','canyon','delta','ember','falcon','globe','harbor','island','jungle',
  'kite','lunar','meadow','nimbus','orbit','pixel','quartz','river','summit','tundra',
  'umbra','valley','willow','xenon','yonder','zephyr','cloud','drift','flint','grove'
]
