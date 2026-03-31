import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Card, CardBody } from '../../components/common/Card'
import { Badge } from '../../components/common/Badge'
import { Button } from '../../components/common/Button'
import { useToast } from '../../components/common/Toast'
import './AdminTestimonials.css'

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('pending')
  const { toast, showToast, Toast: ToastComponent } = useToast()

  useEffect(() => { loadTestimonials() }, [filter])

  async function loadTestimonials() {
    setLoading(true)
    const { data } = await supabase
      .from('testimonials')
      .select('*, profiles:user_id(full_name, email)')
      .eq('status', filter)
      .order('created_at', { ascending: false })
    setTestimonials(data || [])
    setLoading(false)
  }

  async function updateStatus(id, status, showOnLanding = false) {
    const { error } = await supabase
      .from('testimonials')
      .update({ status, show_on_landing: showOnLanding })
      .eq('id', id)
    if (!error) {
      showToast(status === 'approved' ? '✅ Aprobado' : '❌ Rechazado', status === 'approved' ? 'success' : 'error')
      loadTestimonials()
    }
  }

  async function toggleLanding(id, current) {
    await supabase.from('testimonials').update({ show_on_landing: !current }).eq('id', id)
    showToast(!current ? 'Mostrado en landing' : 'Oculto del landing', 'success')
    loadTestimonials()
  }

  const stars = (n) => '⭐'.repeat(n) + '☆'.repeat(5 - n)

  return (
    <div className="admin-testimonials">
      <h1 style={{ marginBottom: 'var(--space-5)' }}>⭐ Testimonios</h1>

      <div className="admin-filter-tabs" style={{ marginBottom: 'var(--space-4)' }}>
        {['pending', 'approved', 'rejected'].map(f => (
          <button
            key={f}
            className={`admin-filter-tab ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'pending' ? '⏳ Pendientes' : f === 'approved' ? '✅ Aprobados' : '❌ Rechazados'}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-muted">Cargando...</p>
      ) : testimonials.length === 0 ? (
        <Card>
          <CardBody>
            <p className="text-muted text-center">No hay testimonios {filter === 'pending' ? 'pendientes' : filter}.</p>
          </CardBody>
        </Card>
      ) : (
        <div className="testimonials-list">
          {testimonials.map(t => (
            <Card key={t.id}>
              <CardBody>
                <div className="testimonial-header">
                  <div>
                    <span className="font-semibold">{t.display_name || t.profiles?.full_name || 'Anónimo'}</span>
                    {t.city && <span className="text-sm text-muted"> · {t.city}</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <span>{stars(t.rating)}</span>
                    {t.show_on_landing && <Badge variant="green">En landing</Badge>}
                  </div>
                </div>
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-actions">
                  {filter === 'pending' && (
                    <>
                      <Button variant="primary" size="sm" onClick={() => updateStatus(t.id, 'approved', true)}>
                        ✅ Aprobar + Landing
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => updateStatus(t.id, 'approved', false)}>
                        ✅ Aprobar
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => updateStatus(t.id, 'rejected')}
                        style={{ color: 'var(--color-error)' }}>
                        ❌ Rechazar
                      </Button>
                    </>
                  )}
                  {filter === 'approved' && (
                    <Button variant="outline" size="sm" onClick={() => toggleLanding(t.id, t.show_on_landing)}>
                      {t.show_on_landing ? '🔇 Ocultar del landing' : '📢 Mostrar en landing'}
                    </Button>
                  )}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {toast && <ToastComponent message={toast.message} type={toast.type} />}
    </div>
  )
}
