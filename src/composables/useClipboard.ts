import { useToastStore } from '@/stores/toast'

export async function copyToClipboard(text: string) {
  const toast = useToastStore()
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard API unavailable')
    await navigator.clipboard.writeText(text)
    toast.show('✓ 已复制', 'success')
    return true
  } catch {
    try {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      const copied = document.execCommand('copy')
      ta.remove()
      if (!copied) throw new Error('Copy command failed')
      toast.show('✓ 已复制', 'success')
      return true
    } catch {
      toast.show('复制失败，请手动复制', 'error')
      return false
    }
  }
}
