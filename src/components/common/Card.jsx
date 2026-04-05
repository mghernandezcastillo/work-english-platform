import { forwardRef } from 'react'

export const Card = forwardRef(function Card({ children, className = '', hover = false, onClick, style }, ref) {
  return (
    <div
      ref={ref}
      className={['card', hover ? 'card-hover' : '', className].filter(Boolean).join(' ')}
      onClick={onClick}
      style={style}
    >
      {children}
    </div>
  )
})

export function CardBody({ children, className = '' }) {
  return <div className={`card-body ${className}`}>{children}</div>
}
