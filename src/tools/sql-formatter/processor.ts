import { format } from 'sql-formatter'

export type SqlDialect = 'mysql'|'postgresql'|'sqlite'|'sql'|'oracle'|'tsql'

export function formatSql(input:string, dialect:SqlDialect='sql'): { formatted:string; error?:string } {
  if(!input.trim()) return { formatted:'' }
  try{
    const formatted = format(input, { language: dialect as any, tabWidth:2, keywordCase:'upper' })
    return { formatted }
  } catch(e:any){
    return { formatted:'', error:e.message }
  }
}
