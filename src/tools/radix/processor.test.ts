
import { describe,it,expect } from 'vitest'
import { convertBase, parseToDecimal, parseAuto } from './processor'

describe('radix', () => {
  it('hex/dec/bin roundtrip', () => {
    expect(convertBase('ff', 16, 10)).toBe('255')
    expect(convertBase('255', 10, 2)).toBe('11111111')
    expect(convertBase('11111111', 2, 16)).toBe('ff')
  })
  it('big numbers beyond Number.MAX_SAFE_INTEGER', () => {
    expect(convertBase('ffffffffffffffff', 16, 10)).toBe('18446744073709551615')
  })
  it('negative values', () => {
    expect(convertBase('-ff', 16, 10)).toBe('-255')
  })
  it('rejects invalid digits for base', () => {
    expect(parseToDecimal('129', 2)).toBeNull()
    expect(parseToDecimal('zz', 16)).toBeNull()
  })
  it('auto prefix detection', () => {
    expect(parseAuto('0xff')?.value).toBe(255n)
    expect(parseAuto('0b101')?.base).toBe(2)
    expect(parseAuto('0o17')?.value).toBe(15n)
    expect(parseAuto('123')?.base).toBe(10)
  })
})
