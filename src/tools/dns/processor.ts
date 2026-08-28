export type DnsRecordType = 'A' | 'AAAA' | 'CNAME' | 'MX' | 'NS' | 'TXT' | 'CAA'

export interface DnsAnswer {
  name: string
  type: number
  TTL?: number
  data: string
}

export interface DnsResult {
  valid: boolean
  error?: string
  status?: number
  answers: DnsAnswer[]
  canonicalName?: string
  queriedAt?: number
}

const TYPE_CODES: Record<DnsRecordType, number> = {
  A: 1,
  AAAA: 28,
  CNAME: 5,
  MX: 15,
  NS: 2,
  TXT: 16,
  CAA: 257
}

export function normalizeDomain(input: string): string {
  return input.trim().replace(/^https?:\/\//i, '').split('/')[0].split('?')[0].replace(/\.$/, '')
}

export function isValidDomain(input: string): boolean {
  const domain = normalizeDomain(input)
  return domain.length > 0 && domain.length <= 253 &&
    !domain.includes('..') &&
    domain.split('.').every(label => label.length > 0 && label.length <= 63 && /^[a-z0-9-]+$/i.test(label) && !label.startsWith('-') && !label.endsWith('-'))
}

export async function queryDns(domainInput: string, recordType: DnsRecordType, signal?: AbortSignal): Promise<DnsResult> {
  const domain = normalizeDomain(domainInput)
  if (!isValidDomain(domain)) return { valid: false, error: '请输入有效的域名，例如 example.com', answers: [] }
  const url = `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=${TYPE_CODES[recordType]}`
  try {
    const response = await fetch(url, {
      headers: { accept: 'application/dns-json' },
      signal,
      cache: 'no-store'
    })
    if (!response.ok) return { valid: false, error: `DNS 服务返回 HTTP ${response.status}`, answers: [] }
    const data = await response.json() as { Status?: number; Answer?: DnsAnswer[]; Authority?: DnsAnswer[] }
    return {
      valid: true,
      status: data.Status,
      answers: data.Answer || data.Authority || [],
      canonicalName: data.Answer?.find(answer => answer.type === TYPE_CODES.CNAME)?.data,
      queriedAt: Date.now()
    }
  } catch (error) {
    return { valid: false, error: error instanceof Error ? error.message : 'DNS 查询失败', answers: [] }
  }
}
