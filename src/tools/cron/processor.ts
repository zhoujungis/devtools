import { parseExpression } from 'cron-parser'

export function parseCron(expr:string): { valid:boolean; error?:string; next:string[]; desc?:string } {
  try{
    const interval = parseExpression(expr, { currentDate: new Date() })
    const next:string[]=[]
    for(let i=0;i<5;i++) next.push(interval.next().toString())
    // simple desc
    const desc = describeCron(expr)
    return { valid:true, next, desc }
  }catch(e:any){ return { valid:false, error:e.message, next:[] } }
}
function describeCron(expr:string): string {
  const parts = expr.trim().split(/\s+/)
  if(parts.length!==5) return 'Cron 需 5 段'
  if(expr==='* * * * *') return '每分钟执行一次'
  if(expr==='*/5 * * * *') return '每 5 分钟执行一次'
  if(expr==='0 * * * *') return '每小时执行一次'
  if(expr==='0 0 * * *') return '每天 00:00 执行'
  return `表达式: ${expr}`
}
