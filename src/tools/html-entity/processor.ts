const NAMED: Record<string, string> = {
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '`': '&#96;',
  '©': '&copy;', '®': '&reg;', '™': '&trade;', '—': '&mdash;', '–': '&ndash;',
  '«': '&laquo;', '»': '&raquo;', '…': '&hellip;', '←': '&larr;', '→': '&rarr;', '°': '&deg;', '±': '&plusmn;'
}

export function encodeHtmlEntities(input: string, mode: 'basic' | 'all' = 'basic'): string {
  let out = ''
  for (const ch of input) {
    if (NAMED[ch]) { out += NAMED[ch]; continue }
    if (mode === 'all' && ch.codePointAt(0)! > 127) { out += `&#${ch.codePointAt(0)};`; continue }
    out += ch
  }
  return out
}

export function decodeHtmlEntities(input: string): string {
  // decode named via a temporary element is DOM-dependent; keep pure with a subset + numeric
  let out = input
    .replace(/&nbsp;/g, ' ')
    .replace(/&(amp|lt|gt|quot|apos|nbsp|copy|reg|trade|mdash|ndash|laquo|raquo|hellip|larr|rarr|deg|plusmn|hellip);/g, (m, name) => {
      const found = Object.entries(NAMED).find(([, v]) => v === m)
      return found ? found[0] : m
    })
  out = out.replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
  out = out.replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
  return out
}
