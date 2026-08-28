export interface IpLookupResult {
  success: boolean
  error?: string
  data?: Record<string, any>
}

function isValidIpv6(value: string): boolean {
  if (!/^[0-9a-f:]+$/i.test(value) || value.includes(':::')) return false
  const compressionCount = (value.match(/::/g) || []).length
  if (compressionCount > 1) return false
  const groups = value.split(':')
  const count = groups.filter(Boolean).length
  if (compressionCount === 0 && groups.length !== 8) return false
  if (compressionCount === 1 && count >= 8) return false
  return groups.filter(Boolean).every(group => group.length >= 1 && group.length <= 4)
}

export function isValidIpOrEmpty(input: string): boolean {
  const value = input.trim()
  if (!value) return true
  if (value.includes(':')) return isValidIpv6(value)
  const parts = value.split('.')
  return parts.length === 4 && parts.every(part => /^\d{1,3}$/.test(part) && Number(part) <= 255)
}

export async function lookupIp(input: string, signal?: AbortSignal): Promise<IpLookupResult> {
  const value = input.trim()
  if (!isValidIpOrEmpty(value)) return { success: false, error: '请输入有效的 IPv4 或 IPv6 地址' }
  const endpoint = value ? `https://ipwho.is/${encodeURIComponent(value)}` : 'https://ipwho.is/'
  try {
    const response = await fetch(endpoint, { signal, cache: 'no-store' })
    const data = await response.json() as { success?: boolean; message?: string; [key: string]: any }
    if (!response.ok || data.success === false) return { success: false, error: data.message || `IP 服务返回 HTTP ${response.status}` }
    return { success: true, data }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'IP 查询失败' }
  }
}
