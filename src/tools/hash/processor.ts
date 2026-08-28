import md5 from 'md5'
export async function hashSHA(input:string, algo: 'SHA-1'|'SHA-256'|'SHA-384'|'SHA-512'): Promise<string> {
  const enc = new TextEncoder().encode(input)
  const buf = await crypto.subtle.digest(algo, enc)
  return Array.from(new Uint8Array(buf)).map(b=> b.toString(16).padStart(2,'0')).join('')
}

export function hashMD5(input:string): string { return md5(input) }

export type HashAlgo = 'MD5'|'SHA-1'|'SHA-256'|'SHA-384'|'SHA-512'
