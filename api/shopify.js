import { handleShopifyApi } from '../backend/shopifyAdmin.js'

export default function handler(req, res) {
  return handleShopifyApi(req, res)
}
