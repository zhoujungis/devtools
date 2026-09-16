import { XMLParser, XMLBuilder, XMLValidator } from 'fast-xml-parser'

export interface XmlFormatResult {
  ok: boolean
  output?: string
  error?: string
}

export function formatXml(input: string, opts: { indentSize?: number; removeAttributes?: boolean } = {}): XmlFormatResult {
  if (!input.trim()) return { ok: false, error: '输入为空' }
  const check = XMLValidator.validate(input, { allowBooleanAttributes: true })
  if (check !== true) return { ok: false, error: `XML 校验失败: ${check.err.msg} (行 ${check.err.line})` }
  try {
    const parser = new XMLParser({
      ignoreAttributes: !!opts.removeAttributes,
      attributeNamePrefix: '@_',
      parseTagValue: false,
      parseAttributeValue: false,
      trimValues: true
    })
    const obj = parser.parse(input)
    const builder = new XMLBuilder({
      ignoreAttributes: !!opts.removeAttributes,
      attributeNamePrefix: '@_',
      format: true,
      indentBy: ' '.repeat(opts.indentSize ?? 2),
      suppressEmptyNode: true
    })
    return { ok: true, output: builder.build(obj) }
  } catch (e: any) {
    return { ok: false, error: e.message }
  }
}

export function xmlToJson(input: string): XmlFormatResult {
  if (!input.trim()) return { ok: false, error: '输入为空' }
  try {
    const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_', parseTagValue: true, parseAttributeValue: true })
    const obj = parser.parse(input)
    return { ok: true, output: JSON.stringify(obj, null, 2) }
  } catch (e: any) {
    return { ok: false, error: e.message }
  }
}
