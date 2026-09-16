
import { describe,it,expect } from 'vitest'
import { csvToJson, jsonToCsv } from './processor'

const CSV = 'name,age,active\nAlice,30,true\nBob,,"false"'
const JSON_EXPECTED = [
  { name: 'Alice', age: 30, active: true },
  { name: 'Bob', age: '', active: false }
]

describe('csv-json', () => {
  it('csv to json with header and coercion', () => {
    const r = csvToJson(CSV)
    expect(r.ok).toBe(true)
    expect(r.data).toEqual(JSON_EXPECTED)
  })
  it('csv to json without header', () => {
    const r = csvToJson('a,b\n1,2', { header: false })
    expect(r.data).toEqual([['a','b'],[1,2]])
  })
  it('semicolon delimiter', () => {
    const r = csvToJson('a;b\n1;2', { header: true, delimiter: ';' })
    expect(r.data).toEqual([{ a: 1, b: 2 }])
  })
  it('json to csv roundtrip', () => {
    const r = jsonToCsv(JSON.stringify(JSON_EXPECTED))
    expect(r.ok).toBe(true)
    const back = csvToJson(r.data as string)
    expect(back.data).toEqual(JSON_EXPECTED)
  })
  it('handles empty cells and nested objects', () => {
    const r = jsonToCsv('[{"a":1,"b":{"x":2}},{"a":null}]')
    const lines = (r.data as string).split(/\r?\n/)
    expect(lines[0]).toBe('a,b')
    expect(lines[1]).toContain('"{""x"":2}"')
  })
  it('rejects bad json', () => {
    expect(jsonToCsv('{oops').ok).toBe(false)
  })
})
