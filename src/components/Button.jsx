import { Link } from 'react-router-dom'

// Shared button/link. Rests neutral; hover shifts to a pastel-blue fill/wash.
// Never rests pastel. `cursorLabel` sets the custom-cursor pill text.
//
// variant: 'primary' (off-black fill) | 'secondary' (hairline outline)
// Renders as <Link> (to), <a> (href), or <button> depending on props.

const base =
  'inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 ' +
  'text-sm font-semibold transition-colors duration-200 min-h-[44px] ' +
  'whitespace-nowrap'

const variants = {
  primary:
    'bg-text text-bg hover:bg-accent hover:text-text',
  secondary:
    'border border-border text-text bg-transparent hover:bg-accent hover:border-accent hover:text-text',
  // For use on the dark band.
  dark:
    'border border-dark-border text-dark-text bg-transparent hover:bg-accent hover:border-accent hover:text-text',
}

export default function Button({
  children,
  variant = 'primary',
  to,
  href,
  cursorLabel,
  className = '',
  ...rest
}) {
  const classes = `${base} ${variants[variant] || variants.primary} ${className}`
  const cursorProps = cursorLabel ? { 'data-cursor': cursorLabel } : {}

  if (to) {
    return (
      <Link to={to} className={classes} {...cursorProps} {...rest}>
        {children}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} className={classes} {...cursorProps} {...rest}>
        {children}
      </a>
    )
  }

  return (
    <button className={classes} {...cursorProps} {...rest}>
      {children}
    </button>
  )
}
