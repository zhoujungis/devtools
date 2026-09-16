
import { describe,it,expect } from 'vitest'
import { generateUsers, generateCreditCard, luhnValid } from './processor'

describe('mock-data', () => {
  it('generates requested count with shape', () => {
    const users = generateUsers(5)
    expect(users).toHaveLength(5)
    users.forEach(u => {
      expect(u.name.length).toBeGreaterThanOrEqual(2)
      expect(u.email).toMatch(/^user\d+@/)
      expect(u.phone).toMatch(/^1[35789]\d{9}$/)
      expect(u.address).toContain('号')
    })
  })
  it('clamps count', () => {
    expect(generateUsers(0)).toHaveLength(1)
    expect(generateUsers(500)).toHaveLength(100)
  })
  it('credit card passes luhn', () => {
    for (let i = 0; i < 10; i++) {
      const card = generateCreditCard()
      expect(luhnValid(card.number)).toBe(true)
      expect(card.cvv).toMatch(/^\d{3}$/)
    }
  })
  it('luhn rejects bad numbers', () => {
    expect(luhnValid('4111111111111112')).toBe(false)
    expect(luhnValid('4111111111111111')).toBe(true)
  })
})
