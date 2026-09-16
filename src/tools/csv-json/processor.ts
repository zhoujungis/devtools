import Papa from 'papaparse'

export interface CsvJsonResult {
  ok: boolean
  error?: string
  data?: unknown
}

export function csvToJson(csv: string, opts: { header: boolean; delimiter?: string } = { header: true }): CsvJsonResult {
  if (!csv.trim()) return { ok: false, error: '输入为空' }
  const res = Papa.parse<string[]>(csv, {
    skipEmptyLines: 'greedy',
    delimiter: opts.delimiter || '',
    header: false
  })
  if (res.errors.length) return { ok: false, error: res.errors[0].message }
  const rows = res.data as string[][]
  if (!rows.length) return { ok: false, error: '没有数据行' }
  if (!opts.header) {
    return { ok: true, data: rows.map(row => row.map(cell => coerceCell(cell))) }
  }
  const [head, ...body] = rows
  return { ok: true, data: body.map(row => {
    const obj: Record<string, unknown> = {}
    head.forEach((key, i) => { obj[key?.trim() || `col${i}`] = coerceCell(row[i]) })
    return obj
  }) }
}

function coerceCell(cell: string | undefined): unknown {
  const v = (cell ?? '').trim()
  if (v === '') return ''
  if (v === 'true') return true
  if (v === 'false') return false
  if (v === 'null') return null
  if (/^-?\d+(\.\d+)?$/.test(v)) return Number(v)
  return v
}

export function jsonToCsv(json: string, opts: { header: boolean; delimiter?: string } = { header: true }): CsvJsonResult {
  if (!json.trim()) return { ok: false, error: '输入为空' }
  let data: unknown
  try { data = JSON.parse(json) } catch (e: any) { return { ok: false, error: 'JSON 解析失败: ' + e.message } }
  let rows: unknown[]
  if (Array.isArray(data)) rows = data
  else if (typeof data === 'object' && data) rows = [data]
  else return { ok: false, error: '需要对象或对象数组' }
  if (!rows.length) return { ok: false, error: '数组为空' }
  const normalized = rows.map(r => (typeof r === 'object' && r && !Array.isArray(r) ? r as Record<string, unknown> : { value: r }))
  const keys = Array.from(new Set(normalized.flatMap(o => Object.keys(o))))
  const flat = normalized.map(o => keys.map(k => {
    const v = (o as Record<string, unknown>)[k]
    return v === null || v === undefined ? '' : typeof v === 'object' ? JSON.stringify(v) : String(v)
  }))
  if (!opts.header) return { ok: true, data: Papa.unparse(flat, { delimiter: opts.delimiter || ',' }) }
  return { ok: true, data: Papa.unparse([keys, ...flat], { delimiter: opts.delimiter || ',' }) }
}
