
import { describe,it,expect } from 'vitest'
import { generateUUIDv4, formatUuid, generateMany } from './processor'
describe('uuid',()=>{
  it('generates v4 format',()=>{
    const u=generateUUIDv4()
    expect(u).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
  })
  it('format',()=>{
    const u='550e8400-e29b-41d4-a716-446655440000'
    expect(formatUuid(u,{uppercase:true,hyphens:false})).toBe('550E8400E29B41D4A716446655440000')
  })
  it('clamps bulk generation',()=>{
    expect(generateMany(5000,{uppercase:false,hyphens:true})).toHaveLength(1000)
    expect(generateMany(-2,{uppercase:false,hyphens:true})).toHaveLength(0)
  })
})
