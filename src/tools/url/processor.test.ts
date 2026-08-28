
import { describe,it,expect } from 'vitest'
import { urlEncode, urlDecode, urlDecodeResult, parseUrl } from './processor'
describe('url',()=>{
  it('encode decode',()=>{
    const s='hello world & test'
    expect(urlDecode(urlEncode(s))).toBe(s)
  })
  it('parse valid',()=>{
    const r=parseUrl('https://example.com:8080/path?q=1&name=test#hash') as any
    expect(r.hostname).toBe('example.com')
    expect(r.port).toBe('8080')
    expect(r.query.q).toBe('1')
  })
  it('preserves repeated query keys',()=>{
    const r=parseUrl('https://example.com/?tag=a&tag=b') as any
    expect(r.query.tag).toEqual(['a','b'])
  })
  it('parse invalid',()=>{
    const r=parseUrl('not a url') as any
    expect(r.error).toBeDefined()
  })
  it('reports malformed encoded input',()=>{
    expect(urlDecodeResult('%E0%A4%A').error).toBeDefined()
    expect(urlDecode('%E0%A4%A')).toBe('%E0%A4%A')
  })
})
