import './Steps.css'

export default function ExplanationStep({ data }) {
  const points = data?.points || []

  // Don't show tip if it duplicates a point
  const tipIsDuplicate = points.some(p => p.text === data?.tip)

  return (
    <div className="step-container animate-fadeIn">
      <div className="step-badge">💡 Explicación</div>
      <h3 className="step-title">{data?.title || '¿Por qué se dice así?'}</h3>

      <div className="explanation-list">
        {points.map((point, i) => (
          <div key={i} className="explanation-point">
            <div className="explanation-icon">📌</div>
            <div>
              <p className="explanation-text">{point.text}</p>
              {point.example && (
                <div className="explanation-example">
                  <span style={{ color: 'var(--color-primary)', fontWeight: 'var(--font-semibold)' }}>Ejemplo: </span>
                  {point.example}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {data?.tip && !tipIsDuplicate && (
        <div className="step-tip">
          <span>💡</span>
          <p>{data.tip}</p>
        </div>
      )}
    </div>
  )
}
