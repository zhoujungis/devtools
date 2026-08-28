export function jsonDiff(a: string, b: string): { equal: boolean; error?: string; diffText?: string; aFormatted?: string; bFormatted?: string } {
  if(!a.trim() || !b.trim()) return { equal:false, error:'两边都不能为空' }
  try{
    const pa = JSON.parse(a)
    const pb = JSON.parse(b)
    const af = JSON.stringify(pa, null, 2)
    const bf = JSON.stringify(pb, null, 2)
    const stable = (value: unknown): unknown => {
      if (Array.isArray(value)) return value.map(stable)
      if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).sort(([ka], [kb]) => ka.localeCompare(kb)).map(([key, item]) => [key, stable(item)]))
      return value
    }
    if(JSON.stringify(stable(pa))===JSON.stringify(stable(pb))) return { equal:true, aFormatted:af, bFormatted:bf }
    // simple line diff
    return { equal:false, aFormatted:af, bFormatted:bf, diffText: `A:\n${af}\n\nB:\n${bf}` }
  } catch(e:any){ return { equal:false, error:e.message } }
}
