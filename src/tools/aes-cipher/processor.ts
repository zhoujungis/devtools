export async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder()
  const base = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveKey'])
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: salt as BufferSource, iterations: 150000, hash: 'SHA-256' },
    base,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  )
}

function toBase64(bytes: Uint8Array): string {
  let bin = ''
  bytes.forEach(b => { bin += String.fromCharCode(b) })
  return btoa(bin)
}

function fromBase64(str: string): Uint8Array {
  const bin = atob(str)
  return Uint8Array.from(bin, c => c.charCodeAt(0))
}

export async function encryptText(plaintext: string, password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const key = await deriveKey(password, salt)
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv as BufferSource }, key, new TextEncoder().encode(plaintext)))
  const payload = new Uint8Array(salt.length + iv.length + ct.length)
  payload.set(salt, 0)
  payload.set(iv, salt.length)
  payload.set(ct, salt.length + iv.length)
  return toBase64(payload)
}

export async function decryptText(payloadB64: string, password: string): Promise<string> {
  const payload = fromBase64(payloadB64.trim())
  if (payload.length < 29) throw new Error('payload too short')
  const salt = payload.slice(0, 16)
  const iv = payload.slice(16, 28)
  const ct = payload.slice(28)
  const key = await deriveKey(password, salt)
  const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: iv as BufferSource }, key, ct as BufferSource)
  return new TextDecoder().decode(pt)
}

export function sha256Hex(input: string): Promise<string> {
  return crypto.subtle.digest('SHA-256', new TextEncoder().encode(input)).then(buf =>
    Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
  )
}
