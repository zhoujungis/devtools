import sharp from 'sharp'
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const svg = readFileSync(resolve(root, 'public/favicon.svg'))

async function renderPng(size, file) {
  await sharp(svg, { density: Math.round((72 * size) / 48) })
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(resolve(root, file))
  console.log(`wrote ${file}`)
}

function buildIco(entries) {
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0)
  header.writeUInt16LE(1, 2)
  header.writeUInt16LE(entries.length, 4)
  const dirSize = 16 * entries.length
  let offset = 6 + dirSize
  const dirs = []
  const datas = []
  for (const { size, png } of entries) {
    const dir = Buffer.alloc(16)
    dir.writeUInt8(size === 256 ? 0 : size, 0)
    dir.writeUInt8(size === 256 ? 0 : size, 1)
    dir.writeUInt8(0, 2)
    dir.writeUInt8(0, 3)
    dir.writeUInt16LE(1, 4)
    dir.writeUInt16LE(32, 6)
    dir.writeUInt32LE(png.length, 8)
    dir.writeUInt32LE(offset, 12)
    offset += png.length
    dirs.push(dir)
    datas.push(png)
  }
  return Buffer.concat([header, ...dirs, ...datas])
}

mkdirSync(resolve(root, 'public/icons'), { recursive: true })
await renderPng(192, 'public/icons/icon-192x192.png')
await renderPng(512, 'public/icons/icon-512x512.png')

const icoEntries = []
for (const size of [16, 32, 48]) {
  const png = await sharp(svg, { density: Math.round((72 * size) / 48) })
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer()
  icoEntries.push({ size, png })
}
writeFileSync(resolve(root, 'public/favicon.ico'), buildIco(icoEntries))
console.log('wrote public/favicon.ico')
