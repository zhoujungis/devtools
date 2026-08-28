export interface PingSample { ok: boolean; ms: number; status?: number; error?: string }

export function normalizeHttpUrl(input: string): string | null {
  const value = input.trim()
  if (!value) return null
  if (/^[a-z][a-z\d+.-]*:/i.test(value) && !/^https?:\/\//i.test(value)) return null
  try {
    const url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`)
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : null
  } catch { return null }
}

export async function pingHttp(input: string, count = 4, timeoutMs = 8000, onSample?: (sample: PingSample) => void): Promise<{ url?: string; samples: PingSample[]; error?: string }> {
  const url = normalizeHttpUrl(input)
  if (!url) return { samples: [], error: '请输入有效的 HTTP 或 HTTPS 地址' }
  const samples: PingSample[] = []
  for (let i = 0; i < count; i++) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)
    const started = performance.now()
    try {
      const response = await fetch(url, { method: 'HEAD', mode: 'no-cors', cache: 'no-store', credentials: 'omit', signal: controller.signal })
      const sample = { ok: true, ms: Math.round(performance.now() - started), status: response.type === 'opaque' ? undefined : response.status }
      samples.push(sample)
      onSample?.(sample)
    } catch (error) {
      const sample = { ok: false, ms: Math.round(performance.now() - started), error: error instanceof Error && error.name === 'AbortError' ? '请求超时' : '请求失败' }
      samples.push(sample)
      onSample?.(sample)
    } finally {
      clearTimeout(timer)
    }
  }
  return { url, samples }
}
