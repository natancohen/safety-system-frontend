import { Link, useLocation } from 'react-router-dom';

export default function HeaderNav() {
  const loc = useLocation();

  const linkStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 36,
    borderRadius: 8,
    border: '1px solid var(--border-color, #ddd)',
    background: 'var(--card-background, #fff)',
    color: 'var(--text-color, #111)',
    textDecoration: 'none',
    fontSize: 18,
    marginInlineStart: 8,
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    transition: 'transform .1s ease',
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 8,
    padding: '8px 8px 0 8px',
  };

  const activeStyle: React.CSSProperties = {
    outline: '2px solid var(--primary-color, #4f46e5)',
  };

  return (
    <nav style={containerStyle} aria-label="ניווט עליון">
      <Link
        to="/"
        aria-label="דף הבית"
        title="דף הבית"
        style={{ ...linkStyle, ...(loc.pathname === '/' ? activeStyle : {}) }}
      >
        🏠
      </Link>
      <Link
        to="/form"
        aria-label="יצירת דיווח"
        title="יצירת דיווח"
        style={{ ...linkStyle, ...(loc.pathname === '/form' ? activeStyle : {}) }}
      >
        ✍️
      </Link>
      <Link
        to="/events"
        aria-label="ניהול אירועים"
        title="ניהול אירועים"
        style={{ ...linkStyle, ...(loc.pathname === '/events' ? activeStyle : {}) }}
      >
        🧾
      </Link>
    </nav>
  );
}
