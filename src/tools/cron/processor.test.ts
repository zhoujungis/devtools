
import { describe,it,expect } from 'vitest'
import { parseCron } from './processor'
describe('cron',()=>{
  it('valid every 5 min',()=>{
    const r=parseCron('*/5 * * * *')
    expect(r.valid).toBe(true)
    expect(r.next.length).toBe(5)
  })
})
