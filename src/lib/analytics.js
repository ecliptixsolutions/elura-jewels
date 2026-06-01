const analyticsQueueKey = 'elura-analytics-events'

const getEventPayload = (eventName, payload = {}) => ({
  event: eventName,
  payload,
  createdAt: new Date().toISOString(),
})

const saveQueuedEvent = (event) => {
  try {
    const current = JSON.parse(window.localStorage.getItem(analyticsQueueKey) || '[]')
    const next = [event, ...current].slice(0, 50)

    window.localStorage.setItem(analyticsQueueKey, JSON.stringify(next))
  } catch {
    // Analytics should never interrupt shopping.
  }
}

const pushDataLayerEvent = (event) => {
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push(event)
}

const trackConversionEvent = (eventName, payload = {}) => {
  if (typeof window === 'undefined') {
    return
  }

  const event = getEventPayload(eventName, payload)

  saveQueuedEvent(event)
  pushDataLayerEvent(event)

  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, payload)
  }

  if (typeof window.fbq === 'function') {
    window.fbq('trackCustom', eventName, payload)
  }
}

export {
  trackConversionEvent,
}
