import { md5 } from 'js-md5'

export function md5Text(input: string): string {
  return md5(input)
}

export async function md5File(file: File): Promise<string> {
  const buffer = await file.arrayBuffer()
  const hasher = md5.create()
  hasher.update(new Uint8Array(buffer))
  return hasher.hex()
}

export function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`
}
