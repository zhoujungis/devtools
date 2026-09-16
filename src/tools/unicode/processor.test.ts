
import { describe,it,expect } from 'vitest'
import { charToCodepoints, decodeEscape, codepointInfo } from './processor'

describe('unicode', () => {
  it('encode formats', () => {
    expect(charToCodepoints('AB', 'U+')).toBe('U+0041 U+0042')
    expect(charToCodepoints('A中', 'html')).toBe('A&#20013;')
    expect(charToCodepoints('中', 'unicode')).toBe('\\u{4e2d}')
    expect(charToCodepoints('中', 'decimal')).toBe('20013')
    expect(charToCodepoints('中', 'hex')).toBe('4e2d')
  })
  it('decode escapes roundtrip', () => {
    expect(decodeEscape('\\u{4e2d}')).toBe('中')
    expect(decodeEscape('\\u4e2d')).toBe('中')
    expect(decodeEscape('&#20013;')).toBe('中')
    expect(decodeEscape('&#x4E2D;')).toBe('中')
    expect(decodeEscape('%u4e2d')).toBe('中')
    expect(decodeEscape('Hello')).toBe('Hello')
  })
  it('emoji surrogate pair info', () => {
    const info = codepointInfo('😀')
    expect(info.cp).toBe('U+1F600')
    expect(info.decimal).toBe(128512)
    expect(info.utf8).toBe('F0 9F 98 80')
    expect(info.utf16).toContain('代理对')
  })
  it('cjk block', () => {
    expect(codepointInfo('中').block).toBe('CJK 统一表意文字')
  })
})
