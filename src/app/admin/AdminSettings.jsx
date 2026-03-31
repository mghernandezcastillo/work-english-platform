import { useState } from 'react'
import { useAppSettings } from '../../context/AppSettingsContext'
import { Card, CardBody } from '../../components/common/Card'
import { Button } from '../../components/common/Button'
import { Input } from '../../components/common/Input'
import { Toast, useToast } from '../../components/common/Toast'
import './AdminSettings.css'

const FIELDS = [
  { category: 'contact', title: '📞 Contacto y Soporte', fields: [
    { key: 'whatsapp_number', label: 'Número WhatsApp', placeholder: '+573001234567', hint: 'Incluye código de país. Ej: +573212455895' },
    { key: 'support_email', label: 'Email de soporte', placeholder: 'soporte@tu-dominio.com' },
    { key: 'support_message', label: 'Mensaje pre-escrito de WhatsApp', placeholder: 'Hola, tengo una pregunta...' },
  ]},
  { category: 'business', title: '💰 Negocio', fields: [
    { key: 'hotmart_checkout_url', label: 'URL de Checkout (Hotmart)', placeholder: 'https://pay.hotmart.com/...' },
    { key: 'guarantee_days', label: 'Días de garantía', placeholder: '7', type: 'number' },
  ]},
]

export default function AdminSettings() {
  const { settings, updateSetting } = useAppSettings()
  const { toast, showToast } = useToast()
  const [edits, setEdits] = useState({})
  const [savingKey, setSavingKey] = useState(null)

  function getValue(key) {
    return edits[key] !== undefined ? edits[key] : (settings[key] || '')
  }

  function handleChange(key, value) {
    setEdits(prev => ({ ...prev, [key]: value }))
  }

  async function handleSave(key) {
    const value = getValue(key)
    setSavingKey(key)
    const { error } = await updateSetting(key, value)
    if (!error) {
      showToast('✅ Guardado correctamente', 'success')
      setEdits(prev => { const n = { ...prev }; delete n[key]; return n })
    } else {
      showToast('Error al guardar', 'error')
    }
    setSavingKey(null)
  }

  function isChanged(key) {
    return edits[key] !== undefined && edits[key] !== (settings[key] || '')
  }

  return (
    <div className="admin-settings">
      <h1 style={{ marginBottom: 'var(--space-5)' }}>⚙️ Ajustes de la App</h1>
      <p className="text-sm text-muted" style={{ marginBottom: 'var(--space-6)', lineHeight: 1.6 }}>
        Estos valores se aplican en toda la plataforma. Los cambios son inmediatos — no necesitas hacer deploy.
      </p>

      {FIELDS.map(group => (
        <div key={group.category} className="settings-group">
          <h3 className="settings-group-title">{group.title}</h3>
          <Card>
            <CardBody>
              <div className="settings-fields">
                {group.fields.map(field => (
                  <div key={field.key} className="settings-field">
                    <div className="settings-field-header">
                      <label className="settings-label">{field.label}</label>
                      {isChanged(field.key) && (
                        <span className="settings-changed-badge">Sin guardar</span>
                      )}
                    </div>
                    <div className="settings-field-row">
                      <Input
                        value={getValue(field.key)}
                        onChange={e => handleChange(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        type={field.type || 'text'}
                      />
                      <Button
                        variant={isChanged(field.key) ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => handleSave(field.key)}
                        loading={savingKey === field.key}
                        disabled={!isChanged(field.key)}
                      >
                        Guardar
                      </Button>
                    </div>
                    {field.hint && (
                      <span className="settings-hint">{field.hint}</span>
                    )}
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      ))}

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  )
}
