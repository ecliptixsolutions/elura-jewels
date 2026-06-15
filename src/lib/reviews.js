import { SHOPIFY_STORE_DOMAIN } from './shopify.js'

const JUDGEME_SCRIPT_ID = 'elura-judgeme-widget-script'

const getReviewsProvider = () =>
  (import.meta.env.VITE_REVIEWS_PROVIDER || '').trim().toLowerCase()

const isJudgeMeEnabled = () => {
  const provider = getReviewsProvider()

  return provider === 'judgeme' || provider === 'judge.me'
}

const getJudgeMeShopDomain = () =>
  import.meta.env.VITE_JUDGEME_SHOP_DOMAIN || SHOPIFY_STORE_DOMAIN

const loadJudgeMeScript = () => {
  if (typeof document === 'undefined' || !isJudgeMeEnabled()) {
    return
  }

  if (document.getElementById(JUDGEME_SCRIPT_ID)) {
    return
  }

  const script = document.createElement('script')

  script.id = JUDGEME_SCRIPT_ID
  script.async = true
  script.dataset.cfasync = 'false'
  script.src = 'https://cdn.judge.me/widget_preloader.js'
  script.onerror = () => {
    console.error('Failed to load Judge.me widgets.')
  }

  document.head.appendChild(script)
}

export {
  getJudgeMeShopDomain,
  getReviewsProvider,
  isJudgeMeEnabled,
  loadJudgeMeScript,
}
