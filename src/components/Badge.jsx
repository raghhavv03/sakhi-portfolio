// Neutral hairline outline pill used as a section label / tag. Never blue.
export default function Badge({ children, className = '', dark = false }) {
  const tone = dark
    ? 'border-dark-border text-dark-muted'
    : 'border-border text-text-muted'
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-normal ${tone} ${className}`}
    >
      {children}
    </span>
  )
}
