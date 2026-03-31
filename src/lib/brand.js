import brand from '../../config/brand.json'

// Apply brand CSS variables to document root
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
  root.style.setProperty('--color-background', colors.background)
  root.style.setProperty('--color-surface', colors.surface)
  root.style.setProperty('--color-surface-alt', colors.surfaceAlt)
  root.style.setProperty('--color-text', colors.text)
  root.style.setProperty('--color-text-muted', colors.textMuted)
  root.style.setProperty('--color-text-inverse', colors.textInverse)
  root.style.setProperty('--color-border', colors.border)
  root.style.setProperty('--font-primary', fonts.primary)
  root.style.setProperty('--font-heading', fonts.heading)
}

export { brand }
export const checkoutUrl = brand.hotmart.checkoutUrl
export const guaranteeDays = brand.hotmart.guaranteeDays
