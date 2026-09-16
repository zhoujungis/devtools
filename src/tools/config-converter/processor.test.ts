
import { describe,it,expect } from 'vitest'
import { convertConfig } from './processor'

const YAML_INPUT = `server:\n  host: 0.0.0.0\n  port: 8080\ntags:\n  - web\n  - api\ndebug: true\n`
const JSON_INPUT = JSON.stringify({ server: { host: '0.0.0.0', port: 8080 }, tags: ['web', 'api'], debug: true }, null, 2)
const TOML_INPUT = `tags = ["web", "api"]\ndebug = true\n\n[server]\nhost = "0.0.0.0"\nport = 8080\n`

function norm(s: string) { return s.replace(/\s+/g, '') }

describe('config-converter', () => {
  it('yaml to json', () => {
    const r = convertConfig(YAML_INPUT, 'yaml', 'json')
    expect(r.ok).toBe(true)
    expect(JSON.parse(r.output!)).toEqual(JSON.parse(JSON_INPUT))
  })
  it('json to yaml', () => {
    const r = convertConfig(JSON_INPUT, 'json', 'yaml')
    expect(r.ok).toBe(true)
    expect(norm(r.output!)).toBe(norm(YAML_INPUT))
  })
  it('toml to json', () => {
    const r = convertConfig(TOML_INPUT, 'toml', 'json')
    expect(r.ok).toBe(true)
    expect(JSON.parse(r.output!)).toEqual(JSON.parse(JSON_INPUT))
  })
  it('json to toml', () => {
    const r = convertConfig(JSON_INPUT, 'json', 'toml')
    expect(r.ok).toBe(true)
    expect(norm(r.output!)).toBe(norm(TOML_INPUT))
  })
  it('yaml to toml', () => {
    const r = convertConfig(YAML_INPUT, 'yaml', 'toml')
    expect(r.ok).toBe(true)
    expect(norm(r.output!)).toBe(norm(TOML_INPUT))
  })
  it('same format rejected', () => {
    expect(convertConfig('{}', 'json', 'json').error).toContain('相同')
  })
  it('invalid input', () => {
    expect(convertConfig('{oops', 'json', 'yaml').ok).toBe(false)
    expect(convertConfig('a: [oops', 'yaml', 'json').ok).toBe(false)
  })
})
