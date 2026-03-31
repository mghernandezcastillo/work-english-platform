import './Steps.css'

export default function ObjectiveStep({ data }) {
  return (
    <div className="step-container animate-fadeIn">
      <div className="step-badge">🎯 Objetivo</div>
      <h2 className="step-title">{data?.title || 'Objetivo de la lección'}</h2>
      <p className="step-description">{data?.description || ''}</p>
      
      {data?.whatYouWillLearn && (
        <div className="step-checklist">
          <h4 className="step-subtitle">Lo que aprenderás:</h4>
          <ul>
            {data.whatYouWillLearn.map((item, i) => (
              <li key={i} className="step-checklist-item">
                <span className="step-check">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
