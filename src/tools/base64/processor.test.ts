
import { describe,it,expect } from 'vitest'
import { encodeBase64, decodeBase64 } from './processor'
describe('base64',()=>{
  it('encode decode roundtrip',()=>{
    const txt='Hello AAA'
    const enc=encodeBase64(txt)
    const dec=decodeBase64(enc)
    expect(dec.text).toBe(txt)
    expect(dec.error).toBeUndefined()
  })
  it('empty',()=>{ expect(encodeBase64('')).toBe('') })
  it('unicode roundtrip',()=>{ expect(decodeBase64(encodeBase64('你好，DevBox')).text).toBe('你好，DevBox') })
  it('invalid decode',()=>{
    const r=decodeBase64('!!!')
    expect(r.error).toBeDefined()
  })
})
