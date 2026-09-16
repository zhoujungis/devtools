
import { describe,it,expect } from 'vitest'
import { charStats } from './processor'

describe('char-stats', () => {
  const sample = 'Hello World.\n\n这是中文测试，第二段。'

  it('counts basics', () => {
    const s = charStats(sample)
    expect(s.lines).toBe(3)
    expect(s.paragraphs).toBe(2)
    expect(s.sentences).toBe(2)
    expect(s.cjkChars).toBe(9)
    expect(s.chars).toBe(Array.from(sample).length)
  })
  it('words = english words + cjk chars', () => {
    expect(charStats('hello world 你好').words).toBe(4)
  })
  it('empty text', () => {
    const s = charStats('')
    expect(s.chars).toBe(0)
    expect(s.lines).toBe(0)
    expect(s.readingMinutes).toBe(0)
  })
  it('top chars excludes whitespace', () => {
    const s = charStats('aaa bb')
    expect(s.topChars[0]).toEqual({ char: 'a', count: 3 })
    expect(s.topChars.some(t => /\s/.test(t.char))).toBe(false)
  })
  it('digits counted', () => {
    expect(charStats('abc 12345').digits).toBe(5)
  })
})
