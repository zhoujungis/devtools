
import { describe,it,expect } from 'vitest'
import { hashSHA } from './processor'
describe('hash',()=>{
  it('sha256', async ()=>{
    const h=await hashSHA('hello','SHA-256')
    expect(h).toBe('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824')
  })
})
