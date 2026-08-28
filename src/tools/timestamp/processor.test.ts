
import { describe,it,expect } from 'vitest'
import { timestampToDate, dateToTimestamp } from './processor'
describe('timestamp',()=>{
  it('ts to date',()=>{
    const s=timestampToDate(0,'s')
    expect(typeof s).toBe('string')
  })
  it('date to ts',()=>{
    const ts=dateToTimestamp('2026-01-01 00:00:00','s')
    expect(typeof ts).toBe('number')
  })
  it('rejects non-finite timestamps',()=>{
    expect(timestampToDate(Number.NaN,'s')).toContain('无效')
  })
})
