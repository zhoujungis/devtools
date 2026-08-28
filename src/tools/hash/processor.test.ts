
import { describe,it,expect } from 'vitest'
import { hashMD5, hashSHA } from './processor'
describe('hash',()=>{
  it('md5 known',()=>{
    expect(hashMD5('hello')).toBe('5d41402abc4b2a76b9719d911017c592')
  })
  it('sha256', async ()=>{
    const h=await hashSHA('hello','SHA-256')
    expect(h).toBe('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824')
  })
})
