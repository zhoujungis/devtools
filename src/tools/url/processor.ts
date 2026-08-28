export function urlEncode(str:string){ return encodeURIComponent(str) }
export function urlDecodeResult(str:string): { text: string; error?: string } {
  try { return { text: decodeURIComponent(str) } }
  catch (error) { return { text: str, error: error instanceof Error ? error.message : 'URL 解码失败' } }
}
export function urlDecode(str:string){ return urlDecodeResult(str).text }
export function urlEncodeFull(str:string){ return encodeURI(str) }
export interface UrlParts {
  href:string; protocol:string; host:string; hostname:string; port:string; pathname:string; search:string; hash:string; username:string; password:string;
  query: Record<string,string|string[]>
}
export function parseUrl(input:string): UrlParts | { error:string }{
  try{
    const u = new URL(input)
    const query: Record<string,string|string[]> = {}
    u.searchParams.forEach((v,k)=> {
      const current = query[k]
      query[k] = current === undefined ? v : Array.isArray(current) ? [...current, v] : [current, v]
    })
    return { href:u.href, protocol:u.protocol, host:u.host, hostname:u.hostname, port:u.port, pathname:u.pathname, search:u.search, hash:u.hash, username:u.username, password:u.password, query }
  } catch(e:any){ return { error: e.message } }
}
