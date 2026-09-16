
import { describe,it,expect } from 'vitest'
import { formatXml, xmlToJson } from './processor'

const XML = `<root><item id="1">A</item><item id="2"><inner>布</inner></item></root>`

describe('xml-formatter', () => {
  it('formats with indentation', () => {
    const r = formatXml(XML)
    expect(r.ok).toBe(true)
    expect(r.output).toContain('  <item id="1">A</item>')
    expect(r.output).toContain('    <inner>布</inner>')
  })
  it('custom indent', () => {
    const r = formatXml(XML, { indentSize: 4 })
    expect(r.output).toContain('    <item')
  })
  it('removes attributes when asked', () => {
    const r = formatXml(XML, { removeAttributes: true })
    expect(r.output).not.toContain('id=')
  })
  it('reports invalid xml', () => {
    const r = formatXml('<root><a></root>')
    expect(r.ok).toBe(false)
    expect(r.error).toContain('校验失败')
  })
  it('xml to json', () => {
    const r = xmlToJson(XML)
    expect(r.ok).toBe(true)
    const parsed = JSON.parse(r.output!)
    expect(parsed.root.item).toHaveLength(2)
    expect(parsed.root.item[0]['@_id']).toBe(1)
  })
  it('empty input', () => {
    expect(formatXml('  ').error).toBe('输入为空')
  })
})
