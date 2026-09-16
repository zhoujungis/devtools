
import { describe,it,expect } from 'vitest'
import { decodeJwt, verifyJwtHs } from './processor'
describe('jwt',()=>{
  const token='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjMiLCJuYW1lIjoiVGVzdCIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxOTI2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
  it('decodes valid',()=>{
    const r=decodeJwt(token)
    expect(r.valid).toBe(true)
    expect(r.header.alg).toBe('HS256')
    expect(r.payload.sub).toBe('123')
  })
  it('invalid format',()=>{
    expect(decodeJwt('invalid').valid).toBe(false)
  })
  const signed = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
  it('HS256 verify with correct secret', async ()=>{
    const r = await verifyJwtHs(signed, 'your-256-bit-secret')
    expect(r.verified).toBe(true)
  })
  it('HS256 verify with wrong secret', async ()=>{
    const r = await verifyJwtHs(signed, 'nope')
    expect(r.verified).toBe(false)
  })
  it('verify rejects unsupported alg', async ()=>{
    const r = await verifyJwtHs('eyJhbGciOiJSUzI1NiJ9.e30.Zm9v', 'k')
    expect(r.error).toContain('不支持的算法')
  })
})
