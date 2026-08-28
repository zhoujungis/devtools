
import { describe,it,expect } from 'vitest'
import { decodeJwt } from './processor'
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
})
