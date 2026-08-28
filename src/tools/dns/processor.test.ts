import { describe, expect, it } from 'vitest'
import { isValidDomain, normalizeDomain } from './processor'

describe('dns processor', () => {
  it('normalizes protocol, path and trailing dot', () => {
    expect(normalizeDomain('https://Example.com/path?x=1.')).toBe('Example.com')
  })

  it('validates ordinary DNS names and rejects malformed labels', () => {
    expect(isValidDomain('example.com')).toBe(true)
    expect(isValidDomain('a..example.com')).toBe(false)
    expect(isValidDomain('-example.com')).toBe(false)
  })
})
