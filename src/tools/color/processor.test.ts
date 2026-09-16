
import { describe,it,expect } from 'vitest'
import { normalizeHex, hexToRgb, rgbToHex, rgbToHsl, hslToRgb, contrastRatio, shades, harmonies } from './processor'

describe('color', () => {
  it('normalize hex', () => {
    expect(normalizeHex('abc')).toBe('#aabbcc')
    expect(normalizeHex('#ABC')).toBe('#aabbcc')
    expect(normalizeHex('zzzzzz')).toBeNull()
  })
  it('hex/rgb roundtrip', () => {
    expect(hexToRgb('#ff8000')).toEqual({ r: 255, g: 128, b: 0 })
    expect(rgbToHex({ r: 255, g: 128, b: 0 })).toBe('#ff8000')
  })
  it('rgb/hsl roundtrip', () => {
    expect(rgbToHsl({ r: 255, g: 128, b: 0 })).toEqual({ h: 30, s: 100, l: 50 })
    const back = hslToRgb({ h: 30, s: 100, l: 50 })
    expect(back.r).toBeGreaterThanOrEqual(253)
    expect(back.g).toBeGreaterThanOrEqual(127)
  })
  it('contrast ratio', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBe(21)
    expect(contrastRatio('#777777', '#888888')).toBeLessThan(2)
  })
  it('shades count and monotonic lightness', () => {
    const s = shades('#3b82f6')
    expect(s).toHaveLength(9)
    expect(s[0]).not.toBe(s[8])
  })
  it('harmonies', () => {
    const h = harmonies('#3b82f6')
    expect(h).toHaveLength(5)
    expect(h[0].colors[0]).toBe('#3b82f6')
  })
})
