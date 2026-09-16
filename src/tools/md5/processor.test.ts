
import { describe,it,expect } from 'vitest'
import { md5Text, md5File, formatSize } from './processor'

describe('md5',()=>{
  it('text md5 known',()=>{
    expect(md5Text('hello')).toBe('5d41402abc4b2a76b9719d911017c592')
    expect(md5Text('')).toBe('d41d8cd98f00b204e9800998ecf8427e')
  })
  it('file md5 matches text md5', async ()=>{
    const file = new File([new TextEncoder().encode('hello')], 'hello.txt')
    expect(await md5File(file)).toBe('5d41402abc4b2a76b9719d911017c592')
  })
  it('empty file md5', async ()=>{
    const file = new File([], 'empty.txt')
    expect(await md5File(file)).toBe('d41d8cd98f00b204e9800998ecf8427e')
  })
  it('formatSize',()=>{
    expect(formatSize(0)).toBe('0 B')
    expect(formatSize(2048)).toBe('2.0 KB')
    expect(formatSize(5 * 1024 * 1024)).toBe('5.0 MB')
  })
})
