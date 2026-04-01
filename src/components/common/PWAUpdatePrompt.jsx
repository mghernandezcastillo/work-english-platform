/**
 * PWAUpdatePrompt — Disabled.
 *
 * The VitePWA service worker has been removed because it caused
 * stale cache issues (infinite loading on F5 after deploys).
 * 
 * This component is now a no-op kept for backwards compatibility
 * so existing imports don't break.
 */
export default function PWAUpdatePrompt() {
  return null
}
