import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
dayjs.extend(utc)
dayjs.extend(timezone)

export function nowTimestamp(): { seconds:number; ms:number; iso:string; local:string } {
  const now = Date.now()
  return { seconds: Math.floor(now/1000), ms: now, iso: new Date().toISOString(), local: dayjs().format('YYYY-MM-DD HH:mm:ss') }
}

export function timestampToDate(ts: number, unit:'s'|'ms'|'us' = 's'): string {
  if(!Number.isFinite(ts)) return '无效时间戳'
  let ms = ts
  if(unit==='s') ms = ts*1000
  if(unit==='us') ms = ts/1000
  const date = dayjs(ms)
  return date.isValid() ? date.format('YYYY-MM-DD HH:mm:ss') : '无效时间戳'
}

export function dateToTimestamp(dateStr:string, unit:'s'|'ms'='s'): number | null {
  const d = dayjs(dateStr)
  if(!d.isValid()) return null
  const ms = d.valueOf()
  return unit==='s' ? Math.floor(ms/1000) : ms
}
