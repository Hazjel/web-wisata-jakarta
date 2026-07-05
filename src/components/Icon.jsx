// Ikon garis (Lucide-style, stroke seragam) — pengganti emoji.
// currentColor supaya warna diatur CSS. 24px default, 1.75 stroke.

const PATHS = {
  landmark: <><line x1="3" y1="22" x2="21" y2="22" /><line x1="6" y1="18" x2="6" y2="11" /><line x1="10" y1="18" x2="10" y2="11" /><line x1="14" y1="18" x2="14" y2="11" /><line x1="18" y1="18" x2="18" y2="11" /><polygon points="12 2 20 7 4 7" /></>,
  landmark_fill: null,
  temple: <><path d="M12 2 3 7h18Z" /><path d="M5 7v11" /><path d="M19 7v11" /><path d="M9 7v11" /><path d="M15 7v11" /><line x1="3" y1="22" x2="21" y2="22" /></>,
  tree: <><path d="M12 22v-7" /><path d="M9 9a3 3 0 0 1 6 0" /><path d="M7 13a4 4 0 0 1 10 0" /><path d="M5 13h14l-2 4H7Z" /></>,
  ferris: <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="1.5" /><path d="M12 4v4M12 16v4M4 12h4M16 12h4" /></>,
  masks: <><path d="M4 4h6v7a3 3 0 0 1-6 0Z" /><path d="M14 9h6v7a3 3 0 0 1-6 0Z" /></>,
  pin: <><path d="M12 21s-6-5.5-6-10a6 6 0 0 1 12 0c0 4.5-6 10-6 10Z" /><circle cx="12" cy="11" r="2" /></>,
  search: <><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></>,
  plus: <><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>,
  check: <polyline points="20 6 9 17 4 12" />,
  close: <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>,
  star: <polygon points="12 2 15 8.5 22 9.3 17 14 18.3 21 12 17.5 5.7 21 7 14 2 9.3 9 8.5" />,
  clock: <><circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15 14" /></>,
  arrowRight: <><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></>,
  route: <><circle cx="6" cy="19" r="2" /><circle cx="18" cy="5" r="2" /><path d="M8 19h6a4 4 0 0 0 0-8H10a4 4 0 0 1 0-8h6" /></>,
  info: <><circle cx="12" cy="12" r="9" /><line x1="12" y1="11" x2="12" y2="16" /><line x1="12" y1="8" x2="12" y2="8" /></>,
  chevronDown: <polyline points="6 9 12 15 18 9" />,
}

export default function Icon({ name, size = 24, strokeWidth = 1.75, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={strokeWidth}
      strokeLinecap="round" strokeLinejoin="round"
      className={className} aria-hidden="true">
      {PATHS[name] || PATHS.pin}
    </svg>
  )
}
