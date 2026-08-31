import { writeFileSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { tools } from '../src/data/tools.ts'
import { categories } from '../src/data/categories.ts'

const SITE_URL = process.env.SITE_URL
if (!SITE_URL) {
  console.error('Please set SITE_URL, e.g.: SITE_URL=https://your-domain.com npm run sitemap')
  process.exit(1)
}

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const base = SITE_URL.replace(/\/+$/, '')
const paths = [
  '/',
  '/favorites',
  '/cheatsheet',
  ...categories.map(c => `/category/${c.id}`),
  ...tools.map(t => t.path)
]

const today = new Date().toISOString().slice(0, 10)
const xml =
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  paths
    .map(p => `  <url><loc>${base}${p}</loc><lastmod>${today}</lastmod></url>`)
    .join('\n') +
  '\n</urlset>\n'

mkdirSync(resolve(root, 'dist'), { recursive: true })
writeFileSync(resolve(root, 'dist/sitemap.xml'), xml)
console.log(`wrote dist/sitemap.xml (${paths.length} urls)`)
