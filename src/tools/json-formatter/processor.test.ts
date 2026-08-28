import { describe, it, expect } from 'vitest'
import { formatJson, validateJson } from './processor'

describe('json-formatter', () => {
  it('formats json with 2 spaces', () => {
    const res = formatJson('{"a":1,"b":2}', 2)
    expect(res.valid).toBe(true)
    expect(res.formatted).toBe('{\n  "a": 1,\n  "b": 2\n}')
    expect(res.minified).toBe('{"a":1,"b":2}')
  })
  it('handles empty', () => {
    expect(formatJson('').valid).toBe(true)
  })
  it('detects error', () => {
    const res = formatJson('{a:1}')
    expect(res.valid).toBe(false)
    expect(res.error).toBeDefined()
  })
  it('unicode', () => {
    const res = formatJson('{"name":"中文"}')
    expect(res.valid).toBe(true)
    expect(res.formatted).toContain('中文')
  })
  it('large json', () => {
    const obj:any={}; for(let i=0;i<100;i++) obj['k'+i]=i
    const input = JSON.stringify(obj)
    const res = formatJson(input)
    expect(res.valid).toBe(true)
  })
  it('validate', () => {
    expect(validateJson('{"a":1}').valid).toBe(true)
    expect(validateJson('{').valid).toBe(false)
  })
})
