export function setPageMeta(title: string, description: string, keywords?: string) {
  if (typeof document === 'undefined') return
  document.title = title
  const set = (sel: string, content: string, attr = 'name') => {
    let el = document.querySelector(`meta[${attr}="${sel}"]`) as HTMLMetaElement | null
    if (!el) { el = document.createElement('meta'); el.setAttribute(attr, sel); document.head.appendChild(el) }
    el.content = content
  }
  set('description', description)
  if (keywords) set('keywords', keywords)
  set('og:title', title, 'property')
  set('og:description', description, 'property')
  set('og:url', window.location.href, 'property')
}
