export function encodeBase64(input: string): string {
  const bytes = new TextEncoder().encode(input)
  let binary = ''
  bytes.forEach(byte => { binary += String.fromCharCode(byte) })
  return btoa(binary)
}
export function decodeBase64(input: string): { text:string; error?:string } {
  const s = input.trim().replace(/\s+/g,'')
  try {
    if(!s || s.length % 4 === 1 || !/^[A-Za-z0-9+/]*={0,2}$/.test(s)) throw new Error('Base64 格式错误')
    const bin = atob(s)
    const bytes = Uint8Array.from(bin, char => char.charCodeAt(0))
    return { text: new TextDecoder('utf-8', { fatal: true }).decode(bytes) }
  } catch(e:any){ return { text:'', error:'Base64 格式错误: '+e.message } }
}
export function isValidBase64(s:string): boolean {
  if(!s.trim()) return false
  const normalized = s.trim().replace(/\s+/g,'')
  if(normalized.length % 4 === 1 || !/^[A-Za-z0-9+/]*={0,2}$/.test(normalized)) return false
  try { atob(normalized); return true } catch { return false }
}
