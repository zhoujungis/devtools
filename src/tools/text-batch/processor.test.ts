
import { describe,it,expect } from 'vitest'
import { applyOps, findReplace, OP_LABELS } from './processor'

describe('text-batch', () => {
  const input = 'banana\napple\nbanana\n\nCherry'

  it('dedupe + remove empty', () => {
    expect(applyOps(input, ['dedupe', 'removeEmpty'])).toBe('banana\napple\nCherry')
  })
  it('sort asc with locale', () => {
    expect(applyOps(input, ['removeEmpty', 'sortAsc'])).toBe('apple\nbanana\nbanana\nCherry')
  })
  it('upper/capitalize/trim', () => {
    expect(applyOps('  hi  ', ['trim', 'upper'])).toBe('HI')
    expect(applyOps('hello\nworld', ['capitalize'])).toBe('Hello\nWorld')
  })
  it('numbering and reverse', () => {
    expect(applyOps('a\nb', ['numbering'])).toBe('1. a\n2. b')
    expect(applyOps('a\nb\nc', ['reverse'])).toBe('c\nb\na')
  })
  it('sort by length', () => {
    expect(applyOps('cccc\na\nbb', ['sortLength'])).toBe('a\nbb\ncccc')
  })
  it('all ops have labels', () => {
    const ops = ['trim','lower','upper','capitalize','dedupe','sortAsc','sortDesc','sortLength','removeEmpty','numbering','reverse'] as const
    ops.forEach(o => expect(OP_LABELS[o]).toBeTruthy())
  })
  it('find replace literal case-insensitive', () => {
    expect(findReplace('Hello hello HELLO', { find: 'hello', replace: 'hi', regex: false, caseSensitive: false })).toEqual({ output: 'hi hi hi', matches: 3 })
  })
  it('find replace regex', () => {
    expect(findReplace('a1b2c3', { find: '\\d', replace: '#', regex: true, caseSensitive: true })).toEqual({ output: 'a#b#c#', matches: 3 })
  })
  it('invalid regex keeps input', () => {
    expect(findReplace('abc', { find: '([', replace: 'x', regex: true, caseSensitive: true }).output).toBe('abc')
  })
})
