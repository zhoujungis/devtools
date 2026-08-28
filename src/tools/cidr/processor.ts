export interface CidrResult {
  valid:boolean; error?:string
  network?:string; broadcast?:string; first?:string; last?:string; total?:number; usable?:number; mask?:string; cidr?:string
}
function ipToInt(ip:string): number { return ip.split('.').reduce((acc,oct)=> (acc<<8)+parseInt(oct,10),0)>>>0 }
function intToIp(n:number): string { return [(n>>>24)&255,(n>>>16)&255,(n>>>8)&255,n&255].join('.') }

export function calcCidr(input:string): CidrResult {
  const m = input.trim().match(/^(\d+\.\d+\.\d+\.\d+)\/(\d{1,2})$/)
  if(!m) return { valid:false, error:'格式应为 192.168.1.0/24' }
  const ip = m[1], prefix = parseInt(m[2],10)
  if(prefix<0||prefix>32) return { valid:false, error:'前缀长度 0-32' }
  const octs = ip.split('.').map(Number)
  if(octs.some(o=>o<0||o>255||isNaN(o))) return { valid:false, error:'IP 非法' }
  const ipInt = ipToInt(ip)
  const maskInt = prefix===0?0:(0xFFFFFFFF << (32-prefix))>>>0
  const networkInt = ipInt & maskInt
  const broadcastInt = networkInt | (~maskInt>>>0)
  const total = Math.pow(2, 32-prefix)
  const usable = prefix>=31 ? total : total-2
  return {
    valid:true,
    network: intToIp(networkInt),
    broadcast: intToIp(broadcastInt),
    first: total>2? intToIp(networkInt+1): intToIp(networkInt),
    last: total>2? intToIp(broadcastInt-1): intToIp(broadcastInt),
    total, usable, mask:intToIp(maskInt), cidr: `${intToIp(networkInt)}/${prefix}`
  }
}
