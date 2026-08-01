// Neutral hairline outline pill used as a section label / tag. Never blue.
export default function Badge({ children, className = '' }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-border px-3 py-1 text-caption font-normal text-text-muted ${className}`}
    >
      {children}
    </span>
  )
}
