import { load as loadYaml, dump as dumpYaml } from 'js-yaml'
import { parse as parseToml, stringify as stringifyToml } from 'smol-toml'

export type ConfigFormat = 'json' | 'yaml' | 'toml'

function parseToObj(input: string, from: ConfigFormat): unknown {
  if (!input.trim()) throw new Error('输入为空')
  switch (from) {
    case 'json': return JSON.parse(input)
    case 'yaml': return loadYaml(input)
    case 'toml': return parseToml(input)
  }
}

function serialize(obj: unknown, to: ConfigFormat): string {
  switch (to) {
    case 'json': return JSON.stringify(obj, null, 2)
    case 'yaml': return dumpYaml(obj, { indent: 2, lineWidth: 100 })
    case 'toml': return stringifyToml(obj as any)
  }
}

export function convertConfig(input: string, from: ConfigFormat, to: ConfigFormat): { ok: boolean; output?: string; error?: string } {
  if (from === to) return { ok: false, error: '源格式与目标格式相同' }
  try {
    const obj = parseToObj(input, from)
    return { ok: true, output: serialize(obj, to) }
  } catch (e: any) {
    return { ok: false, error: e.message }
  }
}
