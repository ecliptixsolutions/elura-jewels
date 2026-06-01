/* global process */
import {
  ApiError,
  applyRateLimit,
  hashValue,
  isValidEmail,
  requireAuthenticated,
  requireAdmin,
  sendSafeError,
  verifyTurnstileToken,
} from './security.js'

let cachedAdminAccessToken = null
let cachedAdminAccessTokenExpiresAt = 0
const shopifyGraphqlCostEvents = []

const getShopifyStoreDomain = () =>
  process.env.SHOPIFY_SHOP ||
  process.env.SHOPIFY_STORE_DOMAIN ||
  process.env.VITE_SHOPIFY_STORE_DOMAIN ||
  'elura-jewels-2.myshopify.com'

const getShopifyAdminApiVersion = () =>
  process.env.SHOPIFY_ADMIN_API_VERSION ||
  process.env.VITE_SHOPIFY_API_VERSION ||
  '2024-04'

const getShopifyAdminEndpoint = () =>
  `https://${getShopifyStoreDomain()}/admin/api/${getShopifyAdminApiVersion()}/graphql.json`

const getShopifyTokenEndpoint = () =>
  `https://${getShopifyStoreDomain()}/admin/oauth/access_token`

const getShopifyAdminUrls = () => {
  const shopDomain = getShopifyStoreDomain()

  return {
    customers: `https://${shopDomain}/admin/customers`,
    discounts: `https://${shopDomain}/admin/discounts`,
    email: `https://${shopDomain}/admin/apps/shopify-email`,
  }
}

const activeDiscountsQuery = `
  query ActiveDiscounts {
    codeDiscountNodes(first: 50, query: "status:active") {
      nodes {
        id
        codeDiscount {
          __typename
          ... on DiscountCodeBasic {
            title
            summary
            status
            startsAt
            endsAt
            codes(first: 10) {
              nodes {
                code
              }
            }
          }
          ... on DiscountCodeBxgy {
            title
            summary
            status
            startsAt
            endsAt
            codes(first: 10) {
              nodes {
                code
              }
            }
          }
          ... on DiscountCodeFreeShipping {
            title
            summary
            status
            startsAt
            endsAt
            codes(first: 10) {
              nodes {
                code
              }
            }
          }
        }
      }
    }
  }
`

const customersQuery = `
  query Customers($first: Int!, $query: String) {
    customers(first: $first, query: $query, sortKey: CREATED_AT, reverse: true) {
      nodes {
        id
        displayName
        firstName
        lastName
        email
        phone
        createdAt
        numberOfOrders
        amountSpent {
          amount
          currencyCode
        }
        tags
        emailMarketingConsent {
          marketingState
          marketingOptInLevel
          consentUpdatedAt
        }
      }
    }
  }
`

const customerOrdersQuery = `
  query CustomerOrders($first: Int!, $query: String!, $after: String) {
    orders(first: $first, after: $after, query: $query, sortKey: PROCESSED_AT, reverse: true) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        id
        name
        legacyResourceId
        processedAt
        displayFinancialStatus
        displayFulfillmentStatus
        currentTotalPriceSet {
          shopMoney {
            amount
            currencyCode
          }
        }
        lineItems(first: 20) {
          nodes {
            title
            quantity
            variantTitle
            image {
              url
              altText
            }
            discountedTotalSet {
              shopMoney {
                amount
                currencyCode
              }
            }
          }
        }
        shippingAddress {
          name
          address1
          address2
          city
          province
          country
          zip
          phone
        }
        fulfillments(first: 10) {
          status
          trackingInfo {
            company
            number
            url
          }
        }
      }
    }
  }
`

const orderDetailsQuery = `
  query OrderDetails($id: ID!) {
    order(id: $id) {
      id
      name
      legacyResourceId
      processedAt
      createdAt
      updatedAt
      email
      displayFinancialStatus
      displayFulfillmentStatus
      currentSubtotalPriceSet {
        shopMoney {
          amount
          currencyCode
        }
      }
      currentTotalTaxSet {
        shopMoney {
          amount
          currencyCode
        }
      }
      currentTotalPriceSet {
        shopMoney {
          amount
          currencyCode
        }
      }
        lineItems(first: 50) {
        nodes {
          title
          quantity
          sku
          variantTitle
          image {
            url
            altText
          }
          discountedTotalSet {
            shopMoney {
              amount
              currencyCode
            }
          }
        }
      }
      shippingAddress {
        name
        address1
        address2
        city
        province
        country
        zip
        phone
      }
      billingAddress {
        name
        address1
        address2
        city
        province
        country
        zip
        phone
      }
      fulfillments(first: 10) {
        id
        status
        createdAt
        updatedAt
        trackingInfo {
          company
          number
          url
        }
      }
      refunds(first: 10) {
        id
        createdAt
        totalRefundedSet {
          shopMoney {
            amount
            currencyCode
          }
        }
      }
    }
  }
`

const findCustomerByEmailQuery = `
  query FindCustomerByEmail($query: String!) {
    customers(first: 1, query: $query) {
      nodes {
        id
        tags
      }
    }
  }
`

const customerCreateMutation = `
  mutation CreateNewsletterCustomer($input: CustomerInput!) {
    customerCreate(input: $input) {
      customer {
        id
        displayName
        email
        emailMarketingConsent {
          marketingState
          consentUpdatedAt
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`

const customerUpdateMutation = `
  mutation UpdateNewsletterCustomer($input: CustomerInput!) {
    customerUpdate(input: $input) {
      customer {
        id
        displayName
        email
        emailMarketingConsent {
          marketingState
          consentUpdatedAt
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`

const customerEmailMarketingConsentUpdateMutation = `
  mutation UpdateCustomerEmailMarketingConsent($input: CustomerEmailMarketingConsentUpdateInput!) {
    customerEmailMarketingConsentUpdate(input: $input) {
      customer {
        id
        displayName
        email
        emailMarketingConsent {
          marketingState
          consentUpdatedAt
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`

const isSubscribed = (customer) =>
  customer?.emailMarketingConsent?.marketingState === 'SUBSCRIBED'

const normalizeEmail = (email) => String(email || '').trim().toLowerCase()

const assertAdminConfigured = () => {
  if (!process.env.SHOPIFY_CLIENT_ID || !process.env.SHOPIFY_CLIENT_SECRET) {
    throw new ApiError(503, 'Shopify is temporarily unavailable.', 'Missing SHOPIFY_CLIENT_ID or SHOPIFY_CLIENT_SECRET.')
  }
}

const wait = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms)
  })

const getRetryDelay = (attempt) => Math.min(500 * 2 ** attempt, 4000)

async function getShopifyAdminAccessToken(attempt = 0) {
  assertAdminConfigured()

  if (
    cachedAdminAccessToken &&
    Date.now() < cachedAdminAccessTokenExpiresAt - 60_000
  ) {
    return cachedAdminAccessToken
  }

  let response

  try {
    response = await fetch(getShopifyTokenEndpoint(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'client_credentials',
        client_id: process.env.SHOPIFY_CLIENT_ID,
        client_secret: process.env.SHOPIFY_CLIENT_SECRET,
      }),
    })
  } catch (error) {
    if (attempt < 2) {
      await wait(getRetryDelay(attempt))
      return getShopifyAdminAccessToken(attempt + 1)
    }

    throw new ApiError(503, 'Shopify is temporarily unavailable.', `Shopify token network failure: ${error.message}`)
  }

  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new ApiError(
      503,
      'Shopify is temporarily unavailable.',
      payload.error_description ||
        payload.error ||
        `Shopify token request failed with status ${response.status}`,
    )
  }

  if (!payload.access_token || !payload.expires_in) {
    throw new ApiError(502, 'Shopify is temporarily unavailable.', 'Shopify token response did not include access_token and expires_in.')
  }

  cachedAdminAccessToken = payload.access_token
  cachedAdminAccessTokenExpiresAt = Date.now() + Number(payload.expires_in) * 1000

  return cachedAdminAccessToken
}

const shouldRetryShopifyResponse = (response, payload) =>
  response.status === 429 ||
  response.status >= 500 ||
  payload?.errors?.some((error) => error.extensions?.code === 'THROTTLED')

const recordGraphqlCost = (payload) => {
  const throttleStatus = payload?.extensions?.cost?.throttleStatus

  if (!throttleStatus) {
    return
  }

  shopifyGraphqlCostEvents.push({
    requestedQueryCost: payload.extensions.cost.requestedQueryCost,
    actualQueryCost: payload.extensions.cost.actualQueryCost,
    currentlyAvailable: throttleStatus.currentlyAvailable,
    maximumAvailable: throttleStatus.maximumAvailable,
    restoreRate: throttleStatus.restoreRate,
    recordedAt: new Date().toISOString(),
  })

  while (shopifyGraphqlCostEvents.length > 50) {
    shopifyGraphqlCostEvents.shift()
  }
}

async function shopifyAdminRequest(query, variables = {}, attempt = 0) {
  const adminAccessToken = await getShopifyAdminAccessToken()

  let response

  try {
    response = await fetch(getShopifyAdminEndpoint(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': adminAccessToken,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    })
  } catch (error) {
    if (attempt < 2) {
      await wait(getRetryDelay(attempt))
      return shopifyAdminRequest(query, variables, attempt + 1)
    }

    throw new ApiError(503, 'Shopify is temporarily unavailable.', `Shopify Admin API network failure: ${error.message}`)
  }

  const payload = await response.json().catch(() => ({}))
  recordGraphqlCost(payload)

  if (shouldRetryShopifyResponse(response, payload) && attempt < 3) {
    const retryAfter = Number(response.headers.get('retry-after') || 0)
    await wait(retryAfter ? retryAfter * 1000 : getRetryDelay(attempt))
    return shopifyAdminRequest(query, variables, attempt + 1)
  }

  if (!response.ok) {
    throw new ApiError(502, 'Shopify is temporarily unavailable.', `Shopify Admin API failed with status ${response.status}`)
  }

  if (payload.errors?.length) {
    throw new ApiError(502, 'Shopify is temporarily unavailable.', payload.errors.map((error) => error.message).join(', '))
  }

  return payload.data
}

const mapDiscount = (node) => {
  const discount = node.codeDiscount
  const code = discount?.codes?.nodes?.[0]?.code

  if (!code) {
    return null
  }

  return {
    id: node.id,
    code,
    title: discount.title || code,
    summary: discount.summary || discount.title || code,
    type: discount.__typename,
    startsAt: discount.startsAt,
    endsAt: discount.endsAt,
  }
}

const mapCustomer = (customer) => ({
  id: customer.id,
  name: customer.displayName || [customer.firstName, customer.lastName].filter(Boolean).join(' '),
  email: customer.email || '',
  phone: customer.phone || '',
  customerSince: customer.createdAt,
  ordersCount: Number(customer.numberOfOrders || 0),
  totalSpend: Number(customer.amountSpent?.amount || 0),
  currencyCode: customer.amountSpent?.currencyCode || 'GBP',
  marketingConsentStatus: customer.emailMarketingConsent?.marketingState || 'NOT_SUBSCRIBED',
  marketingOptInLevel: customer.emailMarketingConsent?.marketingOptInLevel || '',
  subscriptionDate: customer.emailMarketingConsent?.consentUpdatedAt || customer.createdAt,
  tags: customer.tags || [],
})

const mapMoney = (money) => ({
  amount: Number(money?.amount || 0),
  currencyCode: money?.currencyCode || 'GBP',
})

const mapAddress = (address) =>
  address
    ? {
        name: address.name || '',
        address1: address.address1 || '',
        address2: address.address2 || '',
        city: address.city || '',
        province: address.province || '',
        country: address.country || '',
        zip: address.zip || '',
        phone: address.phone || '',
      }
    : null

const mapOrderLineItem = (lineItem) => ({
  title: lineItem.title || '',
  quantity: Number(lineItem.quantity || 0),
  sku: lineItem.sku || '',
  variantTitle: lineItem.variantTitle || '',
  image: lineItem.image?.url || '',
  imageAlt: lineItem.image?.altText || lineItem.title || 'ELURA order item',
  total: mapMoney(lineItem.discountedTotalSet?.shopMoney),
})

const mapFulfillment = (fulfillment) => ({
  id: fulfillment.id || '',
  status: fulfillment.status || '',
  createdAt: fulfillment.createdAt || '',
  updatedAt: fulfillment.updatedAt || '',
  trackingInfo:
    fulfillment.trackingInfo?.map((tracking) => ({
      company: tracking.company || '',
      number: tracking.number || '',
      url: tracking.url || '',
    })) ?? [],
})

const mapOrderSummary = (order) => ({
  id: order.id,
  orderId: String(order.legacyResourceId || '').trim(),
  name: order.name,
  processedAt: order.processedAt,
  financialStatus: order.displayFinancialStatus || '',
  fulfillmentStatus: order.displayFulfillmentStatus || '',
  total: mapMoney(order.currentTotalPriceSet?.shopMoney),
  lineItems: order.lineItems?.nodes?.map(mapOrderLineItem) ?? [],
  shippingAddress: mapAddress(order.shippingAddress),
  fulfillments: order.fulfillments?.map(mapFulfillment) ?? [],
})

const mapOrderDetails = (order) => ({
  ...mapOrderSummary(order),
  createdAt: order.createdAt,
  updatedAt: order.updatedAt,
  subtotal: mapMoney(order.currentSubtotalPriceSet?.shopMoney),
  tax: mapMoney(order.currentTotalTaxSet?.shopMoney),
  billingAddress: mapAddress(order.billingAddress),
  refunds:
    order.refunds?.map((refund) => ({
      id: refund.id,
      createdAt: refund.createdAt,
      totalRefunded: mapMoney(refund.totalRefundedSet?.shopMoney),
    })) ?? [],
  timeline: [
    { label: 'Order created', at: order.createdAt },
    { label: `Payment ${order.displayFinancialStatus || 'status pending'}`, at: order.processedAt },
    { label: `Fulfillment ${order.displayFulfillmentStatus || 'status pending'}`, at: order.updatedAt },
  ].filter((event) => event.at),
})

async function getDiscounts() {
  const data = await shopifyAdminRequest(activeDiscountsQuery)

  return {
    discounts:
      data?.codeDiscountNodes?.nodes
        ?.map(mapDiscount)
        .filter(Boolean) ?? [],
  }
}

async function getCustomers({ search = '', filter = '' } = {}) {
  const queryParts = []

  if (search) {
    queryParts.push(search.includes('@') ? `email:${search}` : search)
  }

  const data = await shopifyAdminRequest(customersQuery, {
    first: 100,
    query: queryParts.join(' ') || null,
  })
  let customers = data?.customers?.nodes?.map(mapCustomer) ?? []

  if (filter === 'subscribed') {
    customers = customers.filter((customer) => customer.marketingConsentStatus === 'SUBSCRIBED')
  }

  if (filter === 'unsubscribed') {
    customers = customers.filter((customer) => customer.marketingConsentStatus !== 'SUBSCRIBED')
  }

  return { customers }
}

async function getCustomerOrders(email, { after = '' } = {}) {
  if (!isValidEmail(email)) {
    throw new ApiError(400, 'Customer email is invalid.', `Invalid customer order email hash ${hashValue(email)}.`)
  }

  const data = await shopifyAdminRequest(customerOrdersQuery, {
    first: 20,
    query: `email:${email}`,
    after: after || null,
  })

  return {
    orders: data?.orders?.nodes?.map(mapOrderSummary) ?? [],
    pageInfo: data?.orders?.pageInfo ?? {
      hasNextPage: false,
      endCursor: null,
    },
  }
}

async function getCustomerOrderDetails(email, orderId) {
  if (!isValidEmail(email)) {
    throw new ApiError(400, 'Customer email is invalid.', `Invalid customer order detail email hash ${hashValue(email)}.`)
  }

  if (!/^\d+$/.test(String(orderId || ''))) {
    throw new ApiError(400, 'Order not found.', `Invalid order id requested by ${hashValue(email)}.`)
  }

  const data = await shopifyAdminRequest(orderDetailsQuery, {
    id: `gid://shopify/Order/${orderId}`,
  })
  const order = data?.order

  if (!order || String(order.email || '').toLowerCase() !== String(email).toLowerCase()) {
    throw new ApiError(404, 'Order not found.', `Order ${orderId} not found for customer ${hashValue(email)}.`)
  }

  return {
    order: mapOrderDetails(order),
  }
}

async function getSubscribers(params = {}) {
  const { customers } = await getCustomers(params)

  return {
    subscribers: customers
      .filter((customer) => customer.email && customer.marketingConsentStatus === 'SUBSCRIBED')
      .map((customer) => ({
        id: customer.id,
        email: customer.email,
        subscriptionDate: customer.subscriptionDate,
        marketingConsentStatus: 'Subscribed',
      })),
  }
}

async function findCustomerByEmail(email, attempts = 0) {
  const existingData = await shopifyAdminRequest(findCustomerByEmailQuery, {
    query: `email:${email}`,
  })
  const customer = existingData?.customers?.nodes?.[0]

  if (customer || attempts >= 3) {
    return customer
  }

  await wait(getRetryDelay(attempts))
  return findCustomerByEmail(email, attempts + 1)
}

async function saveNewsletterCustomer(input, isUpdate) {
  if (isUpdate) {
    const tagInput = {
      id: input.id,
      email: input.email,
      tags: input.tags,
    }
    const updateData = await shopifyAdminRequest(customerUpdateMutation, {
      input: tagInput,
    })
    const updateResult = updateData?.customerUpdate
    const updateErrors = updateResult?.userErrors ?? []

    if (updateErrors.length) {
      return {
        result: updateResult,
        errors: updateErrors,
      }
    }

    const consentData = await shopifyAdminRequest(customerEmailMarketingConsentUpdateMutation, {
      input: {
        customerId: input.id,
        emailMarketingConsent: input.emailMarketingConsent,
      },
    })
    const consentResult = consentData?.customerEmailMarketingConsentUpdate

    return {
      result: consentResult,
      errors: consentResult?.userErrors ?? [],
    }
  }

  const data = await shopifyAdminRequest(customerCreateMutation, { input })
  const result = data?.customerCreate
  const errors = result?.userErrors ?? []

  return {
    result,
    errors,
  }
}

async function createNewsletterCustomer(email) {
  const normalizedEmail = normalizeEmail(email)

  if (!isValidEmail(normalizedEmail)) {
    throw new ApiError(400, 'Please enter a valid email address.', `Invalid newsletter email hash ${hashValue(normalizedEmail)}.`)
  }

  let existingCustomer = await findCustomerByEmail(normalizedEmail)
  const existingTags = existingCustomer?.tags ?? []
  const tags = Array.from(new Set([...existingTags, 'newsletter']))
  const input = {
    email: normalizedEmail,
    tags,
    emailMarketingConsent: {
      marketingState: 'SUBSCRIBED',
      marketingOptInLevel: 'SINGLE_OPT_IN',
    },
  }

  if (existingCustomer?.id) {
    input.id = existingCustomer.id
  }

  let { result, errors } = await saveNewsletterCustomer(input, Boolean(existingCustomer?.id))

  if (
    errors.some((item) => /email has already been taken/i.test(item.message)) &&
    !existingCustomer?.id
  ) {
    existingCustomer = await findCustomerByEmail(normalizedEmail, 1)

    if (existingCustomer?.id) {
      const retryInput = {
        ...input,
        id: existingCustomer.id,
        tags: Array.from(new Set([...(existingCustomer.tags ?? []), 'newsletter'])),
      }
      const retryResult = await saveNewsletterCustomer(retryInput, true)

      result = retryResult.result
      errors = retryResult.errors
    }
  }

  if (errors.length) {
    if (errors.some((item) => /email has already been taken/i.test(item.message))) {
      return {
        customer: {
          id: '',
          name: '',
          email: normalizedEmail,
          marketingConsentStatus: 'SUBSCRIBED',
          tags: ['newsletter'],
        },
        duplicate: true,
      }
    }

    throw new ApiError(400, 'Please try again.', errors.map((item) => item.message).join(', '))
  }

  return {
    customer: mapCustomer(result.customer),
    duplicate: Boolean(existingCustomer?.id),
  }
}

async function createBackInStockCustomer({
  email,
  productHandle = '',
  productTitle = '',
  variantId = '',
}) {
  const normalizedEmail = normalizeEmail(email)

  if (!isValidEmail(normalizedEmail)) {
    throw new ApiError(400, 'Please enter a valid email address.', `Invalid back-in-stock email hash ${hashValue(normalizedEmail)}.`)
  }

  const normalizedHandle = String(productHandle || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .slice(0, 80)
  let existingCustomer = await findCustomerByEmail(normalizedEmail)
  const existingTags = existingCustomer?.tags ?? []
  const tags = Array.from(new Set([
    ...existingTags,
    'back-in-stock',
    normalizedHandle ? `back-in-stock:${normalizedHandle}` : '',
  ].filter(Boolean)))
  const input = {
    email: normalizedEmail,
    tags,
    note: [
      'Back in stock notification requested from ELURA storefront.',
      productTitle ? `Product: ${String(productTitle).slice(0, 180)}` : '',
      normalizedHandle ? `Handle: ${normalizedHandle}` : '',
      variantId ? `Variant: ${String(variantId).slice(0, 120)}` : '',
    ].filter(Boolean).join('\n'),
    emailMarketingConsent: {
      marketingState: 'SUBSCRIBED',
      marketingOptInLevel: 'SINGLE_OPT_IN',
    },
  }

  if (existingCustomer?.id) {
    input.id = existingCustomer.id
  }

  let { result, errors } = await saveNewsletterCustomer(input, Boolean(existingCustomer?.id))

  if (
    errors.some((item) => /email has already been taken/i.test(item.message)) &&
    !existingCustomer?.id
  ) {
    existingCustomer = await findCustomerByEmail(normalizedEmail, 1)

    if (existingCustomer?.id) {
      const retryResult = await saveNewsletterCustomer({
        ...input,
        id: existingCustomer.id,
        tags: Array.from(new Set([...(existingCustomer.tags ?? []), ...tags])),
      }, true)

      result = retryResult.result
      errors = retryResult.errors
    }
  }

  if (errors.length) {
    throw new ApiError(400, 'Please try again.', errors.map((item) => item.message).join(', '))
  }

  return {
    customer: result?.customer ? mapCustomer(result.customer) : {
      id: '',
      email: normalizedEmail,
      tags,
    },
  }
}

async function getMarketingOverview() {
  const { customers } = await getCustomers()
  const subscribers = customers.filter(isSubscribed)

  return {
    totals: {
      customers: customers.length,
      subscribers: subscribers.length,
      marketingConsent: subscribers.length,
    },
    recentSubscribers: subscribers.slice(0, 5),
    latestCustomerSignups: customers.slice(0, 5),
    shopifyAdminUrls: getShopifyAdminUrls(),
  }
}

const getResource = (req) => {
  const fromQuery = req.query?.resource

  if (fromQuery) {
    return fromQuery
  }

  const url = new URL(req.url, 'http://localhost')

  return url.searchParams.get('resource') || ''
}

const isProtectedResource = (resource) =>
  ['customers', 'subscribers', 'marketing-overview'].includes(resource)

const isCustomerProtectedResource = (resource) =>
  ['customer-orders', 'customer-order'].includes(resource)

const getRequestQuery = (req) => {
  if (req.query) {
    return req.query
  }

  const url = new URL(req.url, 'http://localhost')

  return Object.fromEntries(url.searchParams.entries())
}

const getBody = (req) => {
  if (!req.body) {
    return {}
  }

  if (typeof req.body === 'string') {
    return JSON.parse(req.body)
  }

  return req.body
}

async function handleShopifyApi(req, res) {
  try {
    const resource = getResource(req)
    applyRateLimit(req, {
      keyPrefix: `shopify:${resource || 'unknown'}`,
      limit: ['newsletter', 'back-in-stock'].includes(resource) ? 5 : 60,
      windowMs: ['newsletter', 'back-in-stock'].includes(resource) ? 10 * 60_000 : 60_000,
    })

    if (isProtectedResource(resource)) {
      await requireAdmin(req)
    }

    if (isCustomerProtectedResource(resource)) {
      await requireAuthenticated(req)
    }

    if (req.method === 'GET' && resource === 'discounts') {
      res.json(await getDiscounts())
      return
    }

    if (req.method === 'GET' && resource === 'customers') {
      res.json(await getCustomers(getRequestQuery(req)))
      return
    }

    if (req.method === 'GET' && resource === 'subscribers') {
      res.json(await getSubscribers(getRequestQuery(req)))
      return
    }

    if (req.method === 'GET' && resource === 'marketing-overview') {
      res.json(await getMarketingOverview())
      return
    }

    if (req.method === 'GET' && resource === 'customer-orders') {
      res.json(await getCustomerOrders(req.authenticatedUser?.email, getRequestQuery(req)))
      return
    }

    if (req.method === 'GET' && resource === 'customer-order') {
      const query = getRequestQuery(req)
      res.json(await getCustomerOrderDetails(req.authenticatedUser?.email, query.id))
      return
    }

    if (req.method === 'POST' && resource === 'newsletter') {
      const body = getBody(req)

      if (body.website) {
        throw new ApiError(400, 'Please try again.', `Newsletter honeypot triggered from email hash ${hashValue(body.email)}.`)
      }

      await verifyTurnstileToken(body.turnstileToken, req)
      res.json(await createNewsletterCustomer(body.email))
      return
    }

    if (req.method === 'POST' && resource === 'back-in-stock') {
      const body = getBody(req)

      if (body.website) {
        throw new ApiError(400, 'Please try again.', `Back-in-stock honeypot triggered from email hash ${hashValue(body.email)}.`)
      }

      await verifyTurnstileToken(body.turnstileToken, req)
      res.json(await createBackInStockCustomer(body))
      return
    }

    res.status(404).json({ error: 'Shopify API resource not found.' })
  } catch (error) {
    sendSafeError(res, error)
  }
}

export {
  handleShopifyApi,
}
