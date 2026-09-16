
import { describe, it, expect } from 'vitest'
import { base32Decode, totpAt, remainingSeconds, otpauthUri } from './processor'

const RFC_SECRET = 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ'

describe('totp', () => {
  it('base32 decode', () => {
    expect(Array.from(base32Decode('GEZDGNBV'))).toEqual([0x31, 0x32, 0x33, 0x34, 0x35])
    expect(Array.from(base32Decode('gezd gnbv-'))).toEqual([0x31, 0x32, 0x33, 0x34, 0x35])
  })
  it('RFC 6238 SHA-1 vectors (8 digits)', async () => {
    expect(await totpAt(RFC_SECRET, 59 * 1000, { digits: 8 })).toBe('94287082')
    expect(await totpAt(RFC_SECRET, 1111111109 * 1000, { digits: 8 })).toBe('07081804')
    expect(await totpAt(RFC_SECRET, 1234567890 * 1000, { digits: 8 })).toBe('89005924')
  })
  it('6 digits default', async () => {
    const code = await totpAt(RFC_SECRET, 59 * 1000)
    expect(code).toMatch(/^\d{6}$/)
    expect(code).toBe('287082')
  })
  it('remaining seconds', () => {
    expect(remainingSeconds(59 * 1000, 30)).toBe(1)
    expect(remainingSeconds(60 * 1000, 30)).toBe(30)
  })
  it('otpauth uri', () => {
    const uri = otpauthUri({ issuer: 'DevBox', account: 'me@example.com', secret: RFC_SECRET })
    expect(uri).toContain('otpauth://totp/DevBox%3Ame%40example.com')
    expect(uri).toContain('secret=' + RFC_SECRET)
  })
})
