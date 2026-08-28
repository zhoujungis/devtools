
import { describe,it,expect } from 'vitest'
import { formatSql } from './processor'
describe('sql',()=>{
  it('formats',()=>{
    const r=formatSql('select * from users where id=1','mysql')
    expect(r.formatted).toContain('SELECT')
  })
})
