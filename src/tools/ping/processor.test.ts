import { describe, expect, it } from 'vitest'
import { normalizeHttpUrl } from './processor'

describe('http ping processor', () => {
  it('normalizes hostnames to HTTPS URLs', () => {
    expect(normalizeHttpUrl('example.com')).toBe('https://example.com/')
    expect(normalizeHttpUrl('http://example.com/health')).toBe('http://example.com/health')
  })

  it('rejects empty and unsupported protocols', () => {
    expect(normalizeHttpUrl('')).toBeNull()
    expect(normalizeHttpUrl('ftp://example.com')).toBeNull()
  })
})
