
import { describe,it,expect } from 'vitest'
import { encodeHtmlEntities, decodeHtmlEntities } from './processor'

describe('html-entity', () => {
  it('encode basic', () => {
    expect(encodeHtmlEntities('<div class="a">')).toBe('&lt;div class=&quot;a&quot;&gt;')
    expect(encodeHtmlEntities('a & b')).toBe('a &amp; b')
  })
  it('encode all non-ascii', () => {
    expect(encodeHtmlEntities('中', 'all')).toBe('&#20013;')
    expect(encodeHtmlEntities('中', 'basic')).toBe('中')
  })
  it('named entities', () => {
    expect(encodeHtmlEntities('© —→')).toBe('&copy; &mdash;&rarr;')
  })
  it('decode roundtrip', () => {
    expect(decodeHtmlEntities('&lt;div&gt; &amp; &#20013; &#x1F600;')).toBe('<div> & 中 😀')
    expect(decodeHtmlEntities('&copy;')).toBe('©')
  })
})
