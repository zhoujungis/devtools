export type BatchOp =
  | 'trim' | 'lower' | 'upper' | 'capitalize'
  | 'dedupe' | 'sortAsc' | 'sortDesc' | 'sortLength'
  | 'removeEmpty' | 'numbering' | 'reverse'

export const OP_LABELS: Record<BatchOp, string> = {
  trim: '去除首尾空格',
  lower: '全部小写',
  upper: '全部大写',
  capitalize: '首字母大写',
  dedupe: '去除重复行',
  sortAsc: '按字母升序',
  sortDesc: '按字母降序',
  sortLength: '按长度排序',
  removeEmpty: '删除空行',
  numbering: '添加行号',
  reverse: '反转行序'
}

export function applyOps(input: string, ops: BatchOp[]): string {
  let lines = input.split(/\r\n|\r|\n/)
  for (const op of ops) {
    switch (op) {
      case 'trim': lines = lines.map(l => l.trim()); break
      case 'lower': lines = lines.map(l => l.toLowerCase()); break
      case 'upper': lines = lines.map(l => l.toUpperCase()); break
      case 'capitalize': lines = lines.map(l => l ? l[0].toUpperCase() + l.slice(1) : l); break
      case 'dedupe': lines = Array.from(new Set(lines)); break
      case 'sortAsc': lines = [...lines].sort((a, b) => a.localeCompare(b, 'zh-Hans-CN')); break
      case 'sortDesc': lines = [...lines].sort((a, b) => b.localeCompare(a, 'zh-Hans-CN')); break
      case 'sortLength': lines = [...lines].sort((a, b) => a.length - b.length); break
      case 'removeEmpty': lines = lines.filter(l => l.trim() !== ''); break
      case 'numbering': lines = lines.map((l, i) => `${i + 1}. ${l}`); break
      case 'reverse': lines = [...lines].reverse(); break
    }
  }
  return lines.join('\n')
}

export interface ReplaceOptions {
  find: string
  replace: string
  regex: boolean
  caseSensitive: boolean
}

export function findReplace(input: string, opts: ReplaceOptions): { output: string; matches: number } {
  if (!opts.find) return { output: input, matches: 0 }
  if (opts.regex) {
    try {
      const re = new RegExp(opts.find, opts.caseSensitive ? 'g' : 'gi')
      const matches = input.match(re)?.length ?? 0
      return { output: input.replace(re, opts.replace), matches }
    } catch {
      return { output: input, matches: 0 }
    }
  }
  const escaped = opts.find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const re = new RegExp(escaped, opts.caseSensitive ? 'g' : 'gi')
  const matches = input.match(re)?.length ?? 0
  return { output: input.replace(re, opts.replace), matches }
}
