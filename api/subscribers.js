import { handleShopifyApi } from '../backend/shopifyAdmin.js'

export default function handler(req, res) {
  req.query = {
    ...(req.query || {}),
    resource: 'subscribers',
  }

  return handleShopifyApi(req, res)
}
