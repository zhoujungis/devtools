
import { describe,it,expect } from 'vitest'
import { renderMarkdown } from './processor'
describe('markdown',()=>{
  it('renders',()=>{
    const html=renderMarkdown('# hello')
    expect(html).toContain('hello')
  })
  it('xss sanitized',()=>{
    const html=renderMarkdown('<script>alert(1)</script>')
    expect(html).not.toContain('<script')
  })
})
