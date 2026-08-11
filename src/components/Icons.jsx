const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export function ArrowUpRight(props) {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" {...base} {...props}>
      <path d="M7 17L17 7M9 7h8v8" />
    </svg>
  )
}

export function ArrowDown(props) {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" {...base} {...props}>
      <path d="M12 4v16m0 0l-6-6m6 6l6-6" />
    </svg>
  )
}

export function Mail(props) {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" {...base} {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  )
}

export function Github(props) {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" {...base} {...props}>
      <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 00-1.3-3.2 4.2 4.2 0 00-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 00-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 00-.1 3.2A4.6 4.6 0 004 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />
    </svg>
  )
}

export function Linkedin(props) {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" {...base} {...props}>
      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4V8h4v2a6 6 0 012-2zM6 9H2v12h4z" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

export function Behance(props) {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" {...base} {...props}>
      <path d="M2 7h6a2 2 0 010 4H2zm0 6h7a2 2 0 010 4H2zM20.5 10.5H15a3 3 0 015.5-1.5M15 13.5h5.5a3.5 3.5 0 01-6.9 1" />
    </svg>
  )
}

export function Whatsapp(props) {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" {...base} {...props}>
      <path d="M21 11.5a8.5 8.5 0 01-12.3 7.6L3 21l1.9-5.7A8.5 8.5 0 1121 11.5z" />
      <path d="M9 9.5c.5 3 2.5 5 5 5.5l1-1.6 2.5 1c-.8 1.8-2.9 2.2-4.6 1.1A8 8 0 018.7 10c-.9-1.7-.4-3.8 1.5-4.5l.8 2.6L9 9.5z" />
    </svg>
  )
}

const icons = {
  react: (
    <svg viewBox="0 0 24 24" {...base}>
      <circle cx="12" cy="12" r="2.2" />
      <ellipse cx="12" cy="12" rx="10" ry="4" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(-60 12 12)" />
    </svg>
  ),
  js: (
    <svg viewBox="0 0 24 24" {...base}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9.5 10v7M9.5 10c0-1 1-1.4 1.5-.4l.5 1M14.5 8c-1.5 0-2 1-2 2s1 1.2 2 2 1.8 1.2 1.8 2.4c0 1.3-1.2 2-2.3 1.6" />
    </svg>
  ),
  node: (
    <svg viewBox="0 0 24 24" {...base}>
      <path d="M12 2.8L21 8v8l-9 5.2L3 16V8z" />
      <path d="M12 21.2V12" />
      <circle cx="12" cy="8.5" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  ),
  python: (
    <svg viewBox="0 0 24 24" {...base}>
      <path d="M12 3c-4 0-4.5 1.5-4.5 3.5v2.5h6v1.5H5.5A3 3 0 003.5 13v2.5c0 2.5 1 3.5 3.5 3.5h3c2 0 2.5-.5 2.5-2.5" transform="rotate(0)" />
      <path d="M12 21c4 0 4.5-1.5 4.5-3.5V15h-6v-1.5h7.5c2 0 2.5-1 2.5-3.5v-2.5c0-2-1-3.5-3.5-3.5h-3c-2 0-2.5.5-2.5 2.5" />
      <circle cx="9" cy="9.2" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="15" cy="14.8" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  ),
  html: (
    <svg viewBox="0 0 24 24" {...base}>
      <path d="M5 3l1.5 16 5.5 2 5.5-2L19 3z" />
      <path d="M9 8.5h6.5M15 12H9.5m.8 4.6l1.7.6 1.7-.6.3-2.6" />
    </svg>
  ),
  css: (
    <svg viewBox="0 0 24 24" {...base}>
      <path d="M5 3l1.5 16 5.5 2 5.5-2L19 3z" />
      <path d="M9 8.5h6.5M8.5 12h7l-.6 5.4-2.9 1-2.9-1L9 12" />
    </svg>
  ),
  excel: (
    <svg viewBox="0 0 24 24" {...base}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
    </svg>
  ),
  pen: (
    <svg viewBox="0 0 24 24" {...base}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z" />
    </svg>
  ),
  ux: (
    <svg viewBox="0 0 24 24" {...base}>
      <path d="M12 3L21 8l-9 5-9-5z" />
      <path d="M5.3 11.4L3 12.6l9 5 9-5-2.3-1.2" />
      <path d="M5.3 15.8L3 17l9 5 9-5-2.3-1.2" />
    </svg>
  ),
  web: (
    <svg viewBox="0 0 24 24" {...base}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.7 2.6 4 5.7 4 9s-1.3 6.4-4 9c-2.7-2.6-4-5.7-4-9s1.3-6.4 4-9z" />
    </svg>
  ),
}

export function SkillIcon({ name, ...props }) {
  return <span className="skill-icon" {...props}>{icons[name] || icons.web}</span>
}
