export interface Rgb { r: number; g: number; b: number }
export interface Hsl { h: number; s: number; l: number }

export function normalizeHex(input: string): string | null {
  let h = input.trim().replace(/^#/, '')
  if (/^[0-9a-fA-F]{3}$/.test(h)) h = h.split('').map(c => c + c).join('')
  return /^[0-9a-fA-F]{6}$/.test(h) ? '#' + h.toLowerCase() : null
}

export function hexToRgb(hex: string): Rgb | null {
  const n = normalizeHex(hex)
  if (!n) return null
  return { r: parseInt(n.slice(1, 3), 16), g: parseInt(n.slice(3, 5), 16), b: parseInt(n.slice(5, 7), 16) }
}

export function rgbToHex({ r, g, b }: Rgb): string {
  const c = (v: number) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')
  return `#${c(r)}${c(g)}${c(b)}`
}

export function rgbToHsl({ r, g, b }: Rgb): Hsl {
  const rn = r / 255, gn = g / 255, bn = b / 255
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn)
  const l = (max + min) / 2
  let h = 0, s = 0
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0))
    else if (max === gn) h = (bn - rn) / d + 2
    else h = (rn - gn) / d + 4
    h *= 60
  }
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) }
}

export function hslToRgb({ h, s, l }: Hsl): Rgb {
  const sn = s / 100, ln = l / 100
  const k = (n: number) => (n + h / 30) % 12
  const a = sn * Math.min(ln, 1 - ln)
  const f = (n: number) => ln - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
  return { r: Math.round(f(0) * 255), g: Math.round(f(8) * 255), b: Math.round(f(4) * 255) }
}

function luminance({ r, g, b }: Rgb): number {
  const f = (v: number) => {
    const s = v / 255
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  }
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
}

export function contrastRatio(a: string, b: string): number | null {
  const rgbA = hexToRgb(a), rgbB = hexToRgb(b)
  if (!rgbA || !rgbB) return null
  const l1 = luminance(rgbA), l2 = luminance(rgbB)
  return Math.round(((Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)) * 100) / 100
}

export function shades(hex: string, steps = 9): string[] {
  const rgb = hexToRgb(hex)
  if (!rgb) return []
  const hsl = rgbToHsl(rgb)
  return Array.from({ length: steps }, (_, i) => {
    const l = Math.round(95 - i * (80 / (steps - 1)))
    return rgbToHex(hslToRgb({ ...hsl, l }))
  })
}

export function harmonies(hex: string): { name: string; colors: string[] }[] {
  const rgb = hexToRgb(hex)
  if (!rgb) return []
  const { h, s, l } = rgbToHsl(rgb)
  const at = (dh: number) => rgbToHex(hslToRgb({ h: (h + dh + 360) % 360, s, l }))
  const lighter = (dh: number, dl: number) => rgbToHex(hslToRgb({ h: (h + dh + 360) % 360, s, l: Math.min(95, l + dl) }))
  const darker = (dh: number, dl: number) => rgbToHex(hslToRgb({ h: (h + dh + 360) % 360, s, l: Math.max(5, l - dl) }))
  return [
    { name: '互补', colors: [hex, at(180), lighter(180, 20)] },
    { name: '三角', colors: [hex, at(120), at(240)] },
    { name: '分裂互补', colors: [hex, at(150), at(210)] },
    { name: '同类色', colors: [hex, at(30), at(-30)] },
    { name: '明暗阶', colors: [darker(0, 25), hex, lighter(0, 25)] }
  ]
}
