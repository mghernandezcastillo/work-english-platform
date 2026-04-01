import brand from '../../config/brand.json'

// Apply brand CSS variables to document root.
// IMPORTANT: Only brand/accent colors are set here as inline styles.
// Background, surface, text & border colors are controlled by
// [data-theme="light"|"dark"] in CSS — inline styles would override those
// and prevent the dark mode toggle from working.
export function applyBrandTheme() {
  const root = document.documentElement
  const { colors, fonts } = brand

  root.style.setProperty('--color-primary', colors.primary)
  root.style.setProperty('--color-primary-hover', colors.primaryHover)
  root.style.setProperty('--color-secondary', colors.secondary)
  root.style.setProperty('--color-secondary-hover', colors.secondaryHover)
  root.style.setProperty('--color-accent', colors.accent)
  root.style.setProperty('--color-accent-hover', colors.accentHover)
  root.style.setProperty('--color-success', colors.success)
  root.style.setProperty('--color-error', colors.error)
  root.style.setProperty('--color-warning', colors.warning)
  // Note: background/surface/text/border NOT set here so [data-theme] works
  root.style.setProperty('--font-primary', fonts.primary)
  root.style.setProperty('--font-heading', fonts.heading)
}

export { brand }
export const checkoutUrl = brand.hotmart.checkoutUrl
export const guaranteeDays = brand.hotmart.guaranteeDays
