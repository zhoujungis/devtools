function b64urlDecode(str:string): string {
  const pad = str.length % 4
  const base64 = str.replace(/-/g,'+').replace(/_/g,'/') + (pad ? '='.repeat(4-pad) : '')
  const binary = atob(base64)
  const bytes = Uint8Array.from(binary, char => char.charCodeAt(0))
  return new TextDecoder('utf-8', { fatal: true }).decode(bytes)
}

export interface JwtResult {
  valid: boolean
  error?: string
  header?: any
  payload?: any
  signature?: string
  headerJson?: string
  payloadJson?: string
  issuedAt?: string
  expiration?: string
}

export function decodeJwt(input:string): JwtResult {
  const token = input.trim()
  if(!token) return { valid:false, error:'请输入 JWT' }
  const parts = token.split('.')
  if(parts.length!==3) return { valid:false, error:'JWT 格式错误，应为 header.payload.signature 三段' }
  try{
    const headerStr = b64urlDecode(parts[0])
    const payloadStr = b64urlDecode(parts[1])
    const header = JSON.parse(headerStr)
    const payload = JSON.parse(payloadStr)
    const issuedAt = typeof payload.iat === 'number' && Number.isFinite(payload.iat) ? new Date(payload.iat*1000).toLocaleString() : undefined
    const expiration = typeof payload.exp === 'number' && Number.isFinite(payload.exp) ? new Date(payload.exp*1000).toLocaleString() : undefined
    return { valid:true, header, payload, signature:parts[2], headerJson: JSON.stringify(header,null,2), payloadJson: JSON.stringify(payload,null,2), issuedAt, expiration }
  } catch(e:any){
    return { valid:false, error: e.message }
  }
}

function b64urlEncode(bytes: Uint8Array): string {
  let bin = ''
  bytes.forEach(b => { bin += String.fromCharCode(b) })
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

const HS_ALGOS: Record<string, 'SHA-256' | 'SHA-384' | 'SHA-512'> = {
  HS256: 'SHA-256', HS384: 'SHA-384', HS512: 'SHA-512'
}

export async function verifyJwtHs(token: string, secret: string): Promise<{ verified: boolean; error?: string }> {
  const parts = token.trim().split('.')
  if (parts.length !== 3) return { verified: false, error: 'JWT 格式错误' }
  let header: any
  try {
    header = JSON.parse(b64urlDecode(parts[0]))
  } catch (e: any) {
    return { verified: false, error: e.message }
  }
  const algo = HS_ALGOS[header?.alg]
  if (!algo) return { verified: false, error: `不支持的算法: ${header?.alg}（此处仅支持 HS256/HS384/HS512 对称密钥验证）` }
  if (!secret) return { verified: false, error: '请输入密钥' }
  try {
    const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: algo }, false, ['sign'])
    const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${parts[0]}.${parts[1]}`))
    const computed = b64urlEncode(new Uint8Array(sig))
    if (computed.length !== parts[2].length) return { verified: false }
    let diff = 0
    for (let i = 0; i < computed.length; i++) diff |= computed.charCodeAt(i) ^ parts[2].charCodeAt(i)
    return diff === 0 ? { verified: true } : { verified: false }
  } catch (e: any) {
    return { verified: false, error: e.message }
  }
}
