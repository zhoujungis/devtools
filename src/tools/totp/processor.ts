const B32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'

export function base32Decode(input: string): Uint8Array {
  const clean = input.toUpperCase().replace(/[\s=-]/g, '')
  let bits = 0
  let value = 0
  const out: number[] = []
  for (const ch of clean) {
    const idx = B32_ALPHABET.indexOf(ch)
    if (idx === -1) throw new Error(`无效的 Base32 字符: ${ch}`)
    value = (value << 5) | idx
    bits += 5
    if (bits >= 8) {
      out.push((value >>> (bits - 8)) & 0xff)
      bits -= 8
    }
  }
  return Uint8Array.from(out)
}

export type TotpAlgo = 'SHA-1' | 'SHA-256' | 'SHA-512'

export async function totpAt(secretB32: string, timestampMs: number, opts: { digits?: number; period?: number; algo?: TotpAlgo } = {}): Promise<string> {
  const { digits = 6, period = 30, algo = 'SHA-1' } = opts
  const keyBytes = base32Decode(secretB32)
  const counter = Math.floor(timestampMs / 1000 / period)
  const buf = new ArrayBuffer(8)
  const view = new DataView(buf)
  view.setUint32(4, counter)
  const key = await crypto.subtle.importKey('raw', keyBytes as BufferSource, { name: 'HMAC', hash: algo }, false, ['sign'])
  const sig = new Uint8Array(await crypto.subtle.sign('HMAC', key, buf))
  const offset = sig[sig.length - 1] & 0x0f
  const code = ((sig[offset] & 0x7f) << 24) | (sig[offset + 1] << 16) | (sig[offset + 2] << 8) | sig[offset + 3]
  return (code % 10 ** digits).toString().padStart(digits, '0')
}

export function remainingSeconds(timestampMs: number, period = 30): number {
  return period - Math.floor(timestampMs / 1000) % period
}

export function otpauthUri(opts: { issuer: string; account: string; secret: string; digits?: number; period?: number; algo?: TotpAlgo }): string {
  const label = encodeURIComponent(`${opts.issuer}:${opts.account}`)
  const params = new URLSearchParams({ secret: opts.secret, issuer: opts.issuer, algorithm: opts.algo || 'SHA-1', digits: String(opts.digits || 6), period: String(opts.period || 30) })
  return `otpauth://totp/${label}?${params.toString()}`
}
