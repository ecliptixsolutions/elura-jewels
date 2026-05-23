const SHOPIFY_STORE_DOMAIN = 'elura-jewels-2.myshopify.com'
const SHOPIFY_STOREFRONT_TOKEN = '4db151753e5ed1ed40fd2f2faa0c3e0c'
const SHOPIFY_API_ENDPOINT = `https://${SHOPIFY_STORE_DOMAIN}/api/2024-04/graphql.json`

const SHOPIFY_PRODUCTS_QUERY = `
  {
    products(first: 12) {
      edges {
        node {
          id
          title
          handle
          description
          productType
          availableForSale
          images(first: 3) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 1) {
            edges {
              node {
                sku
                availableForSale
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

async function getShopifyProducts() {
  const response = await fetch(SHOPIFY_API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({
      query: SHOPIFY_PRODUCTS_QUERY,
    }),
  })

  if (!response.ok) {
    throw new Error(`Shopify request failed with status ${response.status}`)
  }

  const payload = await response.json()

  if (payload.errors?.length) {
    throw new Error(payload.errors.map((error) => error.message).join(', '))
  }

  return payload.data?.products?.edges?.map((edge) => edge.node) ?? []
}

export { getShopifyProducts, SHOPIFY_STORE_DOMAIN }
