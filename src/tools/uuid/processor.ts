export function generateUUIDv4(): string {
  // use crypto.randomUUID if available
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return (crypto as any).randomUUID()
  // fallback
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random()*16|0, v = c==='x'? r: (r&0x3|0x8)
    return v.toString(16)
  })
}

export function formatUuid(uuid: string, opts:{ uppercase:boolean; hyphens:boolean }): string {
  let s = uuid
  if(!opts.hyphens) s = s.replace(/-/g,'')
  if(opts.uppercase) s = s.toUpperCase()
  else s = s.toLowerCase()
  return s
}

export function generateMany(count:number, opts:{ uppercase:boolean; hyphens:boolean }): string[] {
  const arr:string[]=[]
  const safeCount = Number.isFinite(count) ? Math.min(1000, Math.max(0, Math.floor(count))) : 0
  for(let i=0;i<safeCount;i++) arr.push(formatUuid(generateUUIDv4(), opts))
  return arr
}
