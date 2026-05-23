import { mkdir } from 'node:fs/promises'
import { basename, extname, resolve } from 'node:path'
import sharp from 'sharp'

const heroAssets = [
  'src/assets/photos/hero-luxury-necklace-v2.png',
  'src/assets/photos/hero-luxury-rings-v2.png',
  'src/assets/photos/hero-luxury-earrings-v2.png',
  'src/assets/photos/hero-luxury-bangles-v2.png',
]

const outputDir = resolve('src/assets/optimized')
const publicDir = resolve('public')

await mkdir(outputDir, { recursive: true })
await mkdir(publicDir, { recursive: true })

await Promise.all(
  heroAssets.map(async (assetPath) => {
    const inputPath = resolve(assetPath)
    const outputName = `${basename(assetPath, extname(assetPath))}.webp`
    const outputPath = resolve(outputDir, outputName)

    await sharp(inputPath)
      .resize({
        width: 1600,
        withoutEnlargement: true,
      })
      .webp({
        quality: 82,
        effort: 6,
      })
      .toFile(outputPath)
  }),
)

await sharp(resolve('src/assets/photos/hero-luxury-necklace-v2.png'))
  .resize({
    width: 1200,
    height: 630,
    fit: 'cover',
    position: 'center',
  })
  .jpeg({
    quality: 82,
    progressive: true,
  })
  .toFile(resolve(publicDir, 'og-elura-jewels.jpg'))
