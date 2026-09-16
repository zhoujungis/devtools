
import { describe, it, expect } from 'vitest'
import { encryptText, decryptText } from './processor'

describe('aes-cipher', () => {
  it('roundtrips text', async () => {
    const ct = await encryptText('Hello DevBox 你好', 's3cret-pass')
    expect(ct).toMatch(/^[A-Za-z0-9+/=]+$/)
    expect(await decryptText(ct, 's3cret-pass')).toBe('Hello DevBox 你好')
  })
  it('different ciphertext each time (random salt+iv)', async () => {
    const a = await encryptText('same', 'pw')
    const b = await encryptText('same', 'pw')
    expect(a).not.toBe(b)
  })
  it('rejects wrong password', async () => {
    const ct = await encryptText('secret', 'right')
    await expect(decryptText(ct, 'wrong')).rejects.toThrow()
  })
  it('rejects truncated payload', async () => {
    await expect(decryptText('AAAA', 'pw')).rejects.toThrow('payload too short')
  })
})
