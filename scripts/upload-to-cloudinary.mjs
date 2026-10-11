import { readFileSync, writeFileSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

const CLOUD_NAME = 'dbb5nj0ht'
const UPLOAD_PRESET = 'ml_default'

const ASSETS = [
  { localPath: 'public/pics/bg1.jpg', folder: 'site/backgrounds', publicId: 'bg1', resourceType: 'image' },
  { localPath: 'public/pics/bg2.jpg', folder: 'site/backgrounds', publicId: 'bg2', resourceType: 'image' },
  { localPath: 'public/pics/bg3.png', folder: 'site/backgrounds', publicId: 'bg3', resourceType: 'image' },
  { localPath: 'public/pics/bg4.png', folder: 'site/backgrounds', publicId: 'bg4', resourceType: 'image' },
  { localPath: 'public/pics/bg5.png', folder: 'site/backgrounds', publicId: 'bg5', resourceType: 'image' },
  { localPath: 'public/pics/bg6.png', folder: 'site/backgrounds', publicId: 'bg6', resourceType: 'image' },
  { localPath: 'scripts/tmp-rishikesh.jpg', folder: 'site/backgrounds', publicId: 'rishikesh', resourceType: 'image' },
  { localPath: 'public/pics/image.png', folder: 'site/misc', publicId: 'image', resourceType: 'image' },
  { localPath: 'public/pics/image2.png', folder: 'site/misc', publicId: 'image2', resourceType: 'image' },
  { localPath: 'public/pics/image3.png', folder: 'site/misc', publicId: 'image3', resourceType: 'image' },
  { localPath: 'public/pics/about sharan.jpg', folder: 'site/about', publicId: 'sharan', resourceType: 'image' },
  { localPath: 'public/pics/cover for book section.jpg', folder: 'site/books', publicId: 'cover-banner', resourceType: 'image' },
  { localPath: 'public/pics/BOOK 1 copy.jpg', folder: 'site/books', publicId: 'book-1', resourceType: 'image' },
  { localPath: 'public/pics/BOOK 2 copy.jpg', folder: 'site/books', publicId: 'book-2', resourceType: 'image' },
  { localPath: 'public/pics/BOOK 3 copy.jpg', folder: 'site/books', publicId: 'book-3', resourceType: 'image' },
  { localPath: 'public/pics/BOOK 4 copy.jpg', folder: 'site/books', publicId: 'book-4', resourceType: 'image' },
  { localPath: 'public/pics/BOOK 5 copy.jpg', folder: 'site/books', publicId: 'book-5', resourceType: 'image' },
  { localPath: 'public/pics/BOOK 6 copy.jpg', folder: 'site/books', publicId: 'book-6', resourceType: 'image' },
  { localPath: 'public/pics/BOOK 7 copy.jpg', folder: 'site/books', publicId: 'book-7', resourceType: 'image' },
  { localPath: 'public/pics/BOOK 8 copy.jpg', folder: 'site/books', publicId: 'book-8', resourceType: 'image' },
  { localPath: 'public/pics/BOOK 9 copy.jpg', folder: 'site/books', publicId: 'book-9', resourceType: 'image' },
  { localPath: 'public/pics/sharan wiztec.JPG', folder: 'site/team', publicId: 'sharan', resourceType: 'image' },
  { localPath: 'public/pics/tanvi wiztec.jpg', folder: 'site/team', publicId: 'tanvi', resourceType: 'image' },
  { localPath: 'public/pics/tushar wiztec.JPG', folder: 'site/team', publicId: 'tushar', resourceType: 'image' },
  { localPath: 'public/pics/vidit wiztec.png', folder: 'site/team', publicId: 'vidit', resourceType: 'image' },
  { localPath: 'public/pics/sourav wiztec.JPG', folder: 'site/team', publicId: 'sourav', resourceType: 'image' },
  { localPath: 'public/pics/nikita wiztec.JPG', folder: 'site/team', publicId: 'nikita', resourceType: 'image' },
  { localPath: 'public/pics/badal.png', folder: 'site/brand', publicId: 'badal', resourceType: 'image' },
  { localPath: 'src/assets/logo.png', folder: 'site/brand', publicId: 'logo', resourceType: 'image' },
  { localPath: 'src/assets/main-l.png', folder: 'site/brand', publicId: 'main-l', resourceType: 'image' },
]
// Retreat.pdf (13.7MB) intentionally not migrated: it's a click-through download
// link, not loaded on page render, and exceeds the unsigned preset's 10MB cap.

const mapPath = resolve(__dirname, 'cloudinary-map.json')
const map = existsSync(mapPath) ? JSON.parse(readFileSync(mapPath, 'utf-8')) : {}

async function uploadAsset(asset) {
  const absPath = resolve(root, asset.localPath)
  const fileBuffer = readFileSync(absPath)
  const fd = new FormData()
  fd.append('file', new Blob([fileBuffer]), asset.publicId)
  fd.append('upload_preset', UPLOAD_PRESET)
  fd.append('folder', asset.folder)
  fd.append('public_id', asset.publicId)
  const endpoint = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${asset.resourceType}/upload`
  const res = await fetch(endpoint, { method: 'POST', body: fd })
  const data = await res.json()
  if (!data.secure_url) throw new Error(data.error?.message || `Upload failed for ${asset.localPath}`)
  return data.secure_url
}

async function main() {
  const force = process.argv.includes('--force')
  let okCount = 0
  let failCount = 0
  let skipCount = 0

  for (const asset of ASSETS) {
    if (!force && map[asset.localPath]) {
      console.log(`SKIP  (cached) ${asset.localPath}`)
      skipCount++
      continue
    }
    try {
      const url = await uploadAsset(asset)
      map[asset.localPath] = url
      writeFileSync(mapPath, JSON.stringify(map, null, 2))
      console.log(`OK    ${asset.localPath} -> ${url}`)
      okCount++
    } catch (err) {
      console.error(`FAIL  ${asset.localPath}: ${err.message}`)
      failCount++
    }
  }

  console.log(`\nDone. uploaded=${okCount} skipped=${skipCount} failed=${failCount} total_in_map=${Object.keys(map).length}/${ASSETS.length}`)
  if (failCount > 0) process.exitCode = 1
}

main()
