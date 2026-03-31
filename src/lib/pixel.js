/**
 * Facebook Meta Pixel helper
 * Pixel ID: 1789279795363607
 *
 * Usage:
 *   pixel.viewContent('English for Work Landing')
 *   pixel.initiateCheckout()
 *   pixel.lead()
 *   pixel.purchase({ value: 37, currency: 'USD' })
 */

const PIXEL_ID = '1789279795363607'

function fbq(...args) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq(...args)
  }
}

export const pixel = {
  /** Fire when user views a landing page */
  viewContent(contentName = 'English for Work') {
    fbq('track', 'ViewContent', {
      content_name: contentName,
      content_type: 'product',
      currency: 'USD',
    })
  },

  /** Fire when user clicks any checkout/CTA button */
  initiateCheckout(value, currency = 'USD') {
    fbq('track', 'InitiateCheckout', {
      content_name: 'English for Work',
      currency,
      ...(value ? { value } : {}),
    })
  },

  /** Fire when a lead is captured (e.g. registration) */
  lead() {
    fbq('track', 'Lead', {
      content_name: 'English for Work',
    })
  },

  /** Fire after confirmed purchase (called from webhook response) */
  purchase(value, currency = 'USD') {
    fbq('track', 'Purchase', {
      content_name: 'English for Work',
      currency,
      value,
    })
  },

  /** Fire custom event */
  custom(eventName, params = {}) {
    fbq('trackCustom', eventName, params)
  },
}
