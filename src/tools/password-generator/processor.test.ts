
import { describe, it, expect } from 'vitest'
import { generatePassword, entropyBits, strengthLabel, generatePassphrase, DEMO_WORDS } from './processor'

describe('password-generator', () => {
  it('generates with requested length and charset', () => {
    const p = generatePassword({ length: 24, uppercase: true, lowercase: true, numbers: true, symbols: true, excludeAmbiguous: true })
    expect(p).toHaveLength(24)
    expect(p).toMatch(/^[A-Za-z0-9!@#$%^&*()\-_=+[\]{};:,.<>?]+$/)
  })
  it('respects charset restriction', () => {
    const p = generatePassword({ length: 32, uppercase: false, lowercase: true, numbers: false, symbols: false, excludeAmbiguous: false })
    expect(p).toMatch(/^[a-z]+$/)
  })
  it('excludes ambiguous chars when asked', () => {
    for (let i = 0; i < 20; i++) {
      const p = generatePassword({ length: 32, uppercase: true, lowercase: true, numbers: true, symbols: false, excludeAmbiguous: true })
      expect(p).not.toMatch(/[IOl01]/)
    }
  })
  it('returns empty for no charset', () => {
    expect(generatePassword({ length: 16, uppercase: false, lowercase: false, numbers: false, symbols: false, excludeAmbiguous: false })).toBe('')
  })
  it('entropy math', () => {
    expect(entropyBits(62, 16)).toBe(95)
    expect(strengthLabel(entropyBits(62, 16)).label).toBe('极强')
    expect(strengthLabel(entropyBits(62, 8)).label).toBe('一般')
  })
  it('passphrase joins words', () => {
    const p = generatePassphrase(DEMO_WORDS, 4, '-')
    expect(p.split('-')).toHaveLength(4)
  })
})
