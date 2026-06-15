import {
  products as fallbackProducts,
} from '../data/siteData.js'

const normalizeValue = (value) => value?.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') ?? ''

const inferCategory = (fallbackProduct, handle, title) => {
  if (fallbackProduct?.category) {
    return fallbackProduct.category
  }

  const subject = `${handle} ${title}`.toLowerCase()

  if (subject.includes('bangle')) return 'Bangles'
  if (subject.includes('bracelet')) return 'Bracelets'
  if (subject.includes('earring') || subject.includes('stud')) return 'Earrings'
  if (subject.includes('ring')) return 'Rings'

  return 'Necklaces'
}

const buildImages = (shopifyImages = [], fallbackImages = []) => {
  const images = [...shopifyImages, ...fallbackImages].filter(Boolean)

  while (images.length < 3) {
    images.push(images[images.length - 1] ?? '')
  }

  return images.slice(0, 3)
}

const mapShopifyProduct = (node) => {
  const fallbackProduct = fallbackProducts.find(
    (item) =>
      item.slug === node.handle ||
      normalizeValue(item.name) === normalizeValue(node.title),
  )
  const shopifyImages =
    node.images?.edges?.map((edge) => edge.node?.url).filter(Boolean) ?? []
  const variants = node.variants?.edges?.map((edge) => edge.node).filter(Boolean) ?? []
  const variant = variants.find((item) => item.availableForSale) ?? variants[0]
  const amount = variant?.price?.amount
  const price = Number.parseFloat(amount ?? fallbackProduct?.price ?? 0)
  const quantityAvailable = variants
    .map((item) => item.quantityAvailable)
    .find((value) => Number.isFinite(Number(value)))

  return {
    id: fallbackProduct?.id ?? node.id,
    shopifyProductId: node.id,
    slug: node.handle ?? fallbackProduct?.slug ?? normalizeValue(node.title),
    name: node.title ?? fallbackProduct?.name ?? 'ELURA Product',
    category: node.productType || inferCategory(fallbackProduct, node.handle ?? '', node.title ?? ''),
    price: Number.isNaN(price) ? 0 : price,
    currencyCode: variant?.price?.currencyCode ?? 'GBP',
    variantId: variant?.id ?? '',
    variants,
    sku: variant?.sku || fallbackProduct?.sku || '',
    quantityAvailable: Number.isFinite(Number(quantityAvailable)) ? Number(quantityAvailable) : null,
    availableForSale: node.availableForSale ?? variant?.availableForSale ?? true,
    description:
      node.description ||
      fallbackProduct?.description ||
      'Selected from the ELURA collection with premium finishing and refined detail.',
    materials: fallbackProduct?.materials ?? ['Material details available on request'],
    details: fallbackProduct?.details ?? ['Presented in ELURA packaging'],
    images: buildImages(shopifyImages, fallbackProduct?.images),
    reviews: [],
  }
}

export {
  mapShopifyProduct,
  normalizeValue,
}
