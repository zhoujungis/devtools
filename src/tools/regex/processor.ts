export interface RegexResult {
  isValid: boolean
  error?: string
  matches: Array<{ match:string; index:number; groups:string[] }>
  groups?: string[]
}

export const MAX_PATTERN_LENGTH = 1000
export const MAX_TEXT_LENGTH = 200_000
const NESTED_QUANTIFIER_PATTERN = /\([^)]*(?:[+*]|\{\d+,[^}]*\})[^)]*\)(?:[+*]|\{\d+,[^}]*\})/

export function testRegex(pattern:string, flags:string, text:string, replaceWith?:string): RegexResult & { replaced?:string } {
  if(!pattern) return { isValid:false, error:'请输入正则表达式', matches:[] }
  if(pattern.length > MAX_PATTERN_LENGTH) return { isValid:false, error:`正则表达式不能超过 ${MAX_PATTERN_LENGTH} 个字符`, matches:[] }
  if(text.length > MAX_TEXT_LENGTH) return { isValid:false, error:`测试文本不能超过 ${MAX_TEXT_LENGTH} 个字符`, matches:[] }
  if(NESTED_QUANTIFIER_PATTERN.test(pattern)) return { isValid:false, error:'检测到可能造成大量回溯的嵌套量词，请简化表达式', matches:[] }
  try{
    const re = new RegExp(pattern, flags)
    const matches: any[] = []
    if(flags.includes('g')){
      let m: RegExpExecArray | null
      const re2 = new RegExp(pattern, flags)
      while((m = re2.exec(text))!==null){
        matches.push({ match: m[0], index: m.index, groups: m.slice(1) })
        if(m[0].length===0) re2.lastIndex++
        if(matches.length>1000) break
      }
    } else {
      const m = re.exec(text)
      if(m) matches.push({ match:m[0], index:m.index, groups:m.slice(1)})
    }
    const replaced = replaceWith !== undefined ? text.replace(new RegExp(pattern, flags), replaceWith) : undefined
    return { isValid:true, matches, replaced }
  } catch(e:any){
    return { isValid:false, error:e.message, matches:[] }
  }
}

export const presets: Record<string,{ pattern:string; flags:string; text:string }> = {
  email: { pattern:'^[\\w.-]+@[\\w.-]+\\.\\w+$', flags:'', text:'test@example.com' },
  phone: { pattern:'^1[3-9]\\d{9}$', flags:'', text:'13800138000' },
  url: { pattern:'https?:\\/\\/[^\\s]+', flags:'g', text:'Visit https://example.com and http://test.org' },
  ipv4: { pattern:'\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b', flags:'g', text:'192.168.1.1 10.0.0.1 999.999.999.999' },
  date: { pattern:'\\d{4}-\\d{2}-\\d{2}', flags:'g', text:'2026-08-28' },
}
