
import { describe,it,expect } from 'vitest'
import { calcCidr } from './processor'
describe('cidr',()=>{
  it('calc /24',()=>{
    const r=calcCidr('192.168.1.0/24')
    expect(r.valid).toBe(true)
    expect(r.network).toBe('192.168.1.0')
    expect(r.broadcast).toBe('192.168.1.255')
  })
})
