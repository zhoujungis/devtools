import { describe, expect, it } from 'vitest'
import { jsonDiff } from './processor'

describe('json diff', () => {
  it('treats object key order as equivalent', () => {
    const result = jsonDiff('{"a":1,"b":{"x":2,"y":3}}', '{"b":{"y":3,"x":2},"a":1}')
    expect(result.equal).toBe(true)
  })

  it('keeps array order meaningful', () => {
    expect(jsonDiff('[1,2]', '[2,1]').equal).toBe(false)
  })
})
