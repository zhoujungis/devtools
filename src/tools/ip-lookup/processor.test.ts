import { describe, expect, it } from 'vitest'
import { isValidIpOrEmpty } from './processor'

describe('ip lookup processor', () => {
  it('accepts IPv4, compressed IPv6 and an empty value', () => {
    expect(isValidIpOrEmpty('8.8.8.8')).toBe(true)
    expect(isValidIpOrEmpty('2001:db8::1')).toBe(true)
    expect(isValidIpOrEmpty('')).toBe(true)
  })

  it('rejects malformed addresses', () => {
    expect(isValidIpOrEmpty('256.1.1.1')).toBe(false)
    expect(isValidIpOrEmpty('::::')).toBe(false)
    expect(isValidIpOrEmpty('2001:db8:0:0:0:0:0:0:1')).toBe(false)
  })
})
