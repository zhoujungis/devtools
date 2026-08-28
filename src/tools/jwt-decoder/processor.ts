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
