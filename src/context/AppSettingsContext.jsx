import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { brand } from '../lib/brand'

const AppSettingsContext = createContext({})

// Fallback values from brand.json
const DEFAULTS = {
  whatsapp_number: brand.contact?.whatsapp || '',
  support_email: brand.contact?.email || '',
  support_message: brand.contact?.supportMessage || '',
  hotmart_checkout_url: brand.hotmart?.checkoutUrl || '',
  guarantee_days: String(brand.hotmart?.guaranteeDays || 7),
  whatsapp_enabled: 'true',
}

export function AppSettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULTS)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  async function loadSettings() {
    try {
      const { data } = await supabase.from('app_settings').select('key, value')
      if (data && data.length > 0) {
        const map = { ...DEFAULTS }
        data.forEach(row => { map[row.key] = row.value })
        setSettings(map)
      }
    } catch (err) {
      console.warn('Failed to load app settings, using defaults', err)
    } finally {
      setLoaded(true)
    }
  }

  async function updateSetting(key, value) {
    const { error } = await supabase
      .from('app_settings')
      .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' })
    if (!error) {
      setSettings(prev => ({ ...prev, [key]: value }))
    }
    return { error }
  }

  return (
    <AppSettingsContext.Provider value={{ settings, updateSetting, loaded }}>
      {children}
    </AppSettingsContext.Provider>
  )
}

export function useAppSettings() {
  return useContext(AppSettingsContext)
}
