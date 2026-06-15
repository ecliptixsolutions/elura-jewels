const normalizeShopifyDomain = (domain = '') =>
  domain
    .replace(/^https?:\/\//i, '')
    .replace(/\/.*$/, '')
    .trim()

const SHOPIFY_STORE_DOMAIN = normalizeShopifyDomain(
  import.meta.env.VITE_SHOPIFY_STORE_DOMAIN || 'elura-jewels-2.myshopify.com',
)
const SHOPIFY_STOREFRONT_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN || ''
const SHOPIFY_API_VERSION = import.meta.env.VITE_SHOPIFY_API_VERSION || '2026-04'
const SHOPIFY_API_ENDPOINT = `https://${SHOPIFY_STORE_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`
const hasShopifyStorefrontConfig = Boolean(SHOPIFY_STORE_DOMAIN && SHOPIFY_STOREFRONT_TOKEN)
let hasLoggedMissingConfig = false

const logShopifyConfigError = (operation) => {
  if (hasLoggedMissingConfig) {
    return
  }

  hasLoggedMissingConfig = true
  console.error(
    `Shopify Storefront API is not configured for ${operation}. Add VITE_SHOPIFY_STORE_DOMAIN and VITE_SHOPIFY_STOREFRONT_TOKEN in local and Vercel environments.`,
  )
}

const SHOPIFY_PRODUCTS_QUERY = `
  query Products($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          productType
          availableForSale
          featuredImage {
            url
            altText
          }
          images(first: 5) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                sku
                availableForSale
                quantityAvailable
                selectedOptions {
                  name
                  value
                }
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
  }
`

const SHOPIFY_COLLECTIONS_QUERY = `
  query Collections($first: Int!) {
    collections(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          image {
            url
            altText
          }
          products(first: 1) {
            edges {
              node {
                featuredImage {
                  url
                  altText
                }
              }
            }
          }
        }
      }
    }
  }
`

const SHOPIFY_CART_CREATE_MUTATION = `
  mutation CartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
      }
      userErrors {
        field
        message
      }
      warnings {
        code
        message
      }
    }
  }
`

const SHOPIFY_COLLECTION_BY_HANDLE_QUERY = `
  query CollectionByHandle($handle: String!, $first: Int!) {
    collection(handle: $handle) {
      id
      title
      handle
      description
      image {
        url
        altText
      }
      products(first: $first) {
        edges {
          node {
            id
            title
            handle
            description
            productType
            availableForSale
            featuredImage {
              url
              altText
            }
            images(first: 5) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            variants(first: 10) {
              edges {
                node {
                  id
                  title
                  sku
                  availableForSale
                  selectedOptions {
                    name
                    value
                  }
                  price {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`

const SHOPIFY_PRODUCT_RECOMMENDATIONS_QUERY = `
  query ProductRecommendations($productId: ID!) {
    productRecommendations(productId: $productId) {
      id
      title
      handle
      description
      productType
      availableForSale
      featuredImage {
        url
        altText
      }
      images(first: 5) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 10) {
        edges {
          node {
            id
            title
            sku
            availableForSale
            quantityAvailable
            selectedOptions {
              name
              value
            }
            price {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`

async function shopifyStorefrontRequest(query, variables = {}) {
  if (!hasShopifyStorefrontConfig) {
    logShopifyConfigError('storefront request')
    throw new Error('Shopify Storefront API configuration is missing.')
  }

  const response = await fetch(SHOPIFY_API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  })

  if (!response.ok) {
    throw new Error(`Shopify request failed with status ${response.status}`)
  }

  const payload = await response.json()

  if (payload.errors?.length) {
    throw new Error(payload.errors.map((error) => error.message).join(', '))
  }

  return payload.data
}

const stripInventoryFields = (query) =>
  query.replace(/\n\s*quantityAvailable/g, '')

const isInventoryScopeError = (error) =>
  /quantityAvailable|unauthenticated_read_product_inventory/i.test(error?.message || '')

async function shopifyStorefrontRequestWithInventoryFallback(query, variables = {}) {
  try {
    return await shopifyStorefrontRequest(query, variables)
  } catch (error) {
    if (!isInventoryScopeError(error)) {
      throw error
    }

    return shopifyStorefrontRequest(stripInventoryFields(query), variables)
  }
}

async function getShopifyProducts(first = 50) {
  if (!hasShopifyStorefrontConfig) {
    logShopifyConfigError('product loading')
    return []
  }

  const data = await shopifyStorefrontRequestWithInventoryFallback(SHOPIFY_PRODUCTS_QUERY, { first })

  return data?.products?.edges?.map((edge) => edge.node) ?? []
}

async function getShopifyCollections(first = 20) {
  if (!hasShopifyStorefrontConfig) {
    logShopifyConfigError('collection loading')
    return []
  }

  const data = await shopifyStorefrontRequest(SHOPIFY_COLLECTIONS_QUERY, { first })

  return (
    data?.collections?.edges?.map(({ node }) => ({
      ...node,
      image:
        node.image?.url ||
        node.products?.edges?.[0]?.node?.featuredImage?.url ||
        '',
      altText:
        node.image?.altText ||
        node.products?.edges?.[0]?.node?.featuredImage?.altText ||
        node.title,
    })) ?? []
  )
}

async function getShopifyCollectionByHandle(handle, first = 50) {
  if (!hasShopifyStorefrontConfig) {
    logShopifyConfigError('collection detail loading')
    return null
  }

  const data = await shopifyStorefrontRequestWithInventoryFallback(SHOPIFY_COLLECTION_BY_HANDLE_QUERY, {
    handle,
    first,
  })

  return data?.collection ?? null
}

async function getShopifyProductRecommendations(productId) {
  if (!productId || !hasShopifyStorefrontConfig) {
    if (!hasShopifyStorefrontConfig) {
      logShopifyConfigError('recommendation loading')
    }

    return []
  }

  const data = await shopifyStorefrontRequestWithInventoryFallback(SHOPIFY_PRODUCT_RECOMMENDATIONS_QUERY, {
    productId,
  })

  return data?.productRecommendations ?? []
}

async function createShopifyCart({
  items,
  email,
  discountCodes = [],
  prefillBuyerEmail = false,
  attributes = [],
  note = '',
}) {
  if (!hasShopifyStorefrontConfig) {
    logShopifyConfigError('checkout')
    throw new Error('Shopify checkout is temporarily unavailable. Please try again later.')
  }

  const lines = items
    .filter((item) => (item.variantId || item.merchandiseId) && item.quantity > 0)
    .map((item) => ({
      merchandiseId: item.variantId || item.merchandiseId,
      quantity: item.quantity,
      attributes: item.attributes?.filter((attribute) => attribute.key && attribute.value) || undefined,
    }))

  if (!lines.length) {
    throw new Error('Your cart does not contain Shopify variants that can be checked out.')
  }

  const data = await shopifyStorefrontRequest(SHOPIFY_CART_CREATE_MUTATION, {
    input: {
      lines,
      discountCodes: discountCodes.filter(Boolean),
      buyerIdentity: prefillBuyerEmail && email ? { email } : undefined,
      attributes: [
        {
          key: 'source',
          value: 'elura-headless-storefront',
        },
        ...attributes.filter((attribute) => attribute.key && attribute.value),
      ],
      note: note || undefined,
    },
  })

  const result = data?.cartCreate
  const errors = result?.userErrors ?? []

  if (errors.length) {
    throw new Error(errors.map((error) => error.message).join(', '))
  }

  if (!result?.cart?.checkoutUrl) {
    throw new Error('Shopify did not return a checkout URL.')
  }

  return result.cart
}

export {
  createShopifyCart,
  getShopifyCollections,
  getShopifyCollectionByHandle,
  getShopifyProductRecommendations,
  getShopifyProducts,
  hasShopifyStorefrontConfig,
  SHOPIFY_STORE_DOMAIN,
}
