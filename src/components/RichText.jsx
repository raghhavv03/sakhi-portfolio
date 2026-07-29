// Minimal inline emphasis for copy that lives in portfolio.js.
//
// Case-study prose needs the occasional bolded clause, but content must stay
// plain strings in the data file rather than JSX. `**double asterisks**` is the
// only markup understood — anything richer belongs in a component, not in copy.
export function Rich({ children }) {
  if (typeof children !== 'string') return children
  return children.split(/\*\*(.+?)\*\*/g).map((part, i) =>
    // Odd indices are the captured groups, i.e. the emphasised runs.
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold text-text">
        {part}
      </strong>
    ) : (
      part
    )
  )
}

// A block of paragraphs. `tone` picks the resting colour; emphasised runs
// always resolve to full-strength text, which is what creates the contrast.
export default function RichText({
  paragraphs,
  className = '',
  tone = 'muted',
  size = 'base',
}) {
  if (!paragraphs?.length) return null
  const colour = tone === 'muted' ? 'text-text-muted' : 'text-text'
  const scale = size === 'lg' ? 'text-lead' : 'text-body'
  return (
    <div className={`space-y-4 ${className}`}>
      {paragraphs.map((p, i) => (
        <p key={i} className={`font-normal ${scale} ${colour}`}>
          <Rich>{p}</Rich>
        </p>
      ))}
    </div>
  )
}
