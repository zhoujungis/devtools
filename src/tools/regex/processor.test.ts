
import { describe,it,expect } from 'vitest'
import { testRegex, MAX_PATTERN_LENGTH, MAX_TEXT_LENGTH } from './processor'
describe('regex',()=>{
  it('matches global',()=>{
    const r=testRegex('a','g','aaa')
    expect(r.matches.length).toBe(3)
  })
  it('invalid',()=>{
    const r=testRegex('[','g','test')
    expect(r.isValid).toBe(false)
  })
  it('limits input sizes',()=>{
    expect(testRegex('a'.repeat(MAX_PATTERN_LENGTH + 1), 'g', 'x').isValid).toBe(false)
    expect(testRegex('a', 'g', 'x'.repeat(MAX_TEXT_LENGTH + 1)).isValid).toBe(false)
  })
  it('rejects common nested-quantifier backtracking patterns',()=>{
    expect(testRegex('(a+)+$', '', 'a'.repeat(100)).isValid).toBe(false)
  })
})
