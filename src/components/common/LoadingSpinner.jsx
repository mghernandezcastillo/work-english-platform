export function LoadingSpinner({ size = 'md', fullPage = false }) {
  const spinner = (
    <div className={size === 'lg' ? 'spinner spinner-lg' : 'spinner'} />
  )

  if (fullPage) {
    return (
      <div className="page-center">
        <div className="flex flex-col items-center gap-3">
          {spinner}
          <p className="text-sm text-muted">Cargando...</p>
        </div>
      </div>
    )
  }

  return spinner
}

export function SkeletonCard() {
  return (
    <div className="card" style={{ padding: 'var(--space-5)' }}>
      <div className="animate-pulse flex flex-col gap-3">
        <div style={{ height: 16, background: 'var(--color-surface-alt)', borderRadius: 'var(--radius-sm)', width: '60%' }} />
        <div style={{ height: 12, background: 'var(--color-surface-alt)', borderRadius: 'var(--radius-sm)', width: '80%' }} />
        <div style={{ height: 8, background: 'var(--color-surface-alt)', borderRadius: 'var(--radius-full)' }} />
      </div>
    </div>
  )
}
