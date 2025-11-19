import { useState, useRef, useEffect, useId } from 'react';

export default function InlinePopover({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement | null>(null);
  const popoverId = useId();

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  return (
    <span ref={ref} style={{ position: 'relative' }}>
      <button
        type="button"
        aria-label="מידע נוסף"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={popoverId}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        style={{
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          padding: 0,
          marginInlineStart: 6,
        }}
      >
        ℹ️
      </button>

      {open && (
        <div
          id={popoverId}
          role="dialog"
          aria-modal={false}
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'absolute',
            zIndex: 9999,
            insetInlineStart: 0,
            top: '1.5rem',
            minWidth: 220,
            maxWidth: 380,
            maxHeight: 260,
            overflow: 'auto',
            background: 'var(--card-background, #fff)',
            color: 'var(--text-color, #111)',
            border: '1px solid var(--border-color, #ddd)',
            borderRadius: 8,
            padding: 10,
            boxShadow: '0 6px 20px rgba(0,0,0,.15)',
            direction: 'rtl',
            whiteSpace: 'normal',
            overflowWrap: 'anywhere',
          }}
        >
          {text}
        </div>
      )}
    </span>
  );
}
