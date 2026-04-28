// VYTAL brand — deep navy canvas, teal→blue gradient mark, gold highlight.
// Premium-clinical: telemedicine, GLP-1, subscription care. Kept the `sageColors`
// token names so the rest of the app cascades without a rewrite.

const sageColors = {
  bg: '#0A1B2E',            // deep navy
  bgSoft: '#0F2238',        // slightly lifted
  surface: '#15304B',       // card
  surfaceHi: '#1D3D5C',     // hovered / raised
  ink: '#F0F5FA',           // near-white primary text
  inkSoft: 'rgba(240,245,250,0.64)',
  inkFaint: 'rgba(240,245,250,0.36)',
  sage: '#3DBCB5',          // primary teal
  sageDeep: '#2B9BA8',      // deeper teal
  sageLight: 'rgba(61,188,181,0.16)', // tinted chip bg on dark
  sageMid: '#5FD4CE',
  accent: '#D4B872',        // champagne gold
  accentSoft: 'rgba(212,184,114,0.18)',
  gradientFrom: '#3DBCB5',  // teal
  gradientTo: '#2C7BB8',    // blue
  water: '#4DA3E0',
  waterSoft: 'rgba(77,163,224,0.18)',
  carbs: '#5FD4CE',
  fat: '#D4B872',
  protein: '#2C7BB8',
  divider: 'rgba(240,245,250,0.08)',
  danger: '#E85A6B',
  dangerSoft: 'rgba(232,90,107,0.16)',
};

// VYTAL brand mark — two overlapping leaves forming a V, teal→blue gradient
function VytalMark({ size = 40 }) {
  const id = React.useId();
  return (
    <svg width={size} height={size * 1.08} viewBox="0 0 40 44" fill="none">
      <defs>
        <linearGradient id={`vm-l-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5FD4CE"/><stop offset="1" stopColor="#2B9BA8"/>
        </linearGradient>
        <linearGradient id={`vm-r-${id}`} x1="1" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2C7BB8"/><stop offset="1" stopColor="#3DBCB5"/>
        </linearGradient>
      </defs>
      {/* Left leaf */}
      <path d="M8 6 C8 22, 14 34, 20 42 C18 32, 12 20, 8 6 Z" fill={`url(#vm-l-${id})`}/>
      {/* Right leaf */}
      <path d="M32 6 C32 22, 26 34, 20 42 C22 32, 28 20, 32 6 Z" fill={`url(#vm-r-${id})`}/>
    </svg>
  );
}

// Full VYTAL lockup (mark + wordmark)
function VytalLockup({ size = 'md' }) {
  const sizes = {
    sm: { mark: 28, word: 16, gap: 8, letter: 3 },
    md: { mark: 40, word: 22, gap: 10, letter: 4 },
    lg: { mark: 64, word: 36, gap: 14, letter: 7 },
  }[size] || { mark: 40, word: 22, gap: 10, letter: 4 };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: sizes.gap }}>
      <VytalMark size={sizes.mark}/>
      <div style={{
        fontSize: sizes.word, fontWeight: 300, letterSpacing: sizes.letter,
        color: '#fff', fontFamily: '"Inter", system-ui',
      }}>VYTAL</div>
    </div>
  );
}

// Shared bottom sheet
function SageSheet({ onClose, children, title, full }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 100,
      background: 'rgba(4,12,24,0.55)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'flex-end',
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', background: sageColors.bgSoft, borderRadius: '28px 28px 0 0',
        padding: '16px 20px 40px',
        maxHeight: full ? '92%' : '85%', minHeight: full ? '80%' : undefined,
        overflow: 'auto',
        animation: 'slideUp 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
        borderTop: `1px solid ${sageColors.divider}`,
      }}>
        <div style={{ width: 40, height: 4, background: sageColors.inkFaint, borderRadius: 2, margin: '0 auto 16px' }} />
        {title && <div style={{ fontSize: 22, fontWeight: 500, letterSpacing: -0.5, marginBottom: 16, color: sageColors.ink }}>{title}</div>}
        {children}
      </div>
      <style>{`@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } } @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } @keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// Full-screen modal (for chat, food search, etc.)
function SageFullScreen({ onClose, title, children, rightAction }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 100, background: sageColors.bg,
      display: 'flex', flexDirection: 'column',
      animation: 'slideUp 0.28s cubic-bezier(0.2, 0.8, 0.2, 1)',
    }}>
      <div style={{
        padding: '56px 16px 12px', display: 'flex', alignItems: 'center', gap: 12,
        background: sageColors.bg, position: 'sticky', top: 0, zIndex: 1,
      }}>
        <button onClick={onClose} style={{
          width: 36, height: 36, borderRadius: 18, background: sageColors.surface, border: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14"><path d="M10 2L4 7l6 5" stroke={sageColors.ink} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <div style={{ flex: 1, fontSize: 17, fontWeight: 500, letterSpacing: -0.2 }}>{title}</div>
        {rightAction}
      </div>
      <div style={{ flex: 1, overflow: 'auto' }}>
        {children}
      </div>
    </div>
  );
}

// Section header
function SageSectionHeader({ children, right }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '20px 4px 10px' }}>
      <div style={{ fontSize: 12, color: sageColors.inkSoft, letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: 500 }}>{children}</div>
      {right}
    </div>
  );
}

// Card
function SageCard({ children, style, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: sageColors.surface, borderRadius: 24, padding: 18,
      cursor: onClick ? 'pointer' : 'default',
      ...style,
    }}>{children}</div>
  );
}

// Primary button
function SageButton({ children, onClick, disabled, variant = 'primary', style }) {
  const styles = {
    primary: {
      background: disabled
        ? 'rgba(61,188,181,0.3)'
        : `linear-gradient(135deg, ${sageColors.gradientFrom}, ${sageColors.gradientTo})`,
      color: '#fff',
      boxShadow: disabled ? 'none' : '0 4px 16px rgba(61,188,181,0.25)',
    },
    secondary: { background: sageColors.surface, color: sageColors.ink, border: `1px solid ${sageColors.divider}` },
    ghost: { background: 'transparent', color: sageColors.inkSoft },
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width: '100%', border: 'none', borderRadius: 20, padding: '16px 0',
      fontSize: 15, fontWeight: 500, cursor: disabled ? 'default' : 'pointer',
      fontFamily: 'inherit', letterSpacing: 0.2, ...styles[variant], ...style,
    }}>{children}</button>
  );
}

// Icons (consistent stroke style)
const SageIcon = {
  home: (c, size = 22) => <svg width={size} height={size} viewBox="0 0 22 22" fill="none"><path d="M3 10l8-7 8 7v9a1 1 0 01-1 1h-4v-6h-6v6H4a1 1 0 01-1-1v-9z" stroke={c} strokeWidth="1.6" strokeLinejoin="round"/></svg>,
  food: (c, size = 22) => <svg width={size} height={size} viewBox="0 0 22 22" fill="none"><path d="M6 2v8a3 3 0 106 0V2M9 2v8M16 2s3 2 3 7-3 5-3 5v6" stroke={c} strokeWidth="1.6" strokeLinecap="round"/></svg>,
  chart: (c, size = 22) => <svg width={size} height={size} viewBox="0 0 22 22" fill="none"><path d="M4 18V8M11 18V3M18 18v-7" stroke={c} strokeWidth="1.6" strokeLinecap="round"/></svg>,
  coach: (c, size = 22) => <svg width={size} height={size} viewBox="0 0 22 22" fill="none"><path d="M3 11a8 8 0 1116 0c0 4.5-3.5 8-8 8-1.5 0-3-.4-4-1l-3 1 1-3c-1-1.5-2-3.2-2-5z" stroke={c} strokeWidth="1.6" strokeLinejoin="round"/></svg>,
  profile: (c, size = 22) => <svg width={size} height={size} viewBox="0 0 22 22" fill="none"><circle cx="11" cy="8" r="4" stroke={c} strokeWidth="1.6"/><path d="M3 20c0-4 4-6 8-6s8 2 8 6" stroke={c} strokeWidth="1.6" strokeLinecap="round"/></svg>,
  plus: (c, size = 16) => <svg width={size} height={size} viewBox="0 0 16 16"><path d="M8 2v12M2 8h12" stroke={c} strokeWidth="2" strokeLinecap="round"/></svg>,
  chevron: (c, size = 14) => <svg width={size / 2} height={size} viewBox="0 0 8 14"><path d="M1 1l6 6-6 6" stroke={c} strokeWidth="2" fill="none" strokeLinecap="round"/></svg>,
  back: (c, size = 14) => <svg width={size} height={size} viewBox="0 0 14 14"><path d="M10 2L4 7l6 5" stroke={c} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  search: (c, size = 18) => <svg width={size} height={size} viewBox="0 0 18 18" fill="none"><circle cx="8" cy="8" r="5.5" stroke={c} strokeWidth="1.6"/><path d="M13 13l3 3" stroke={c} strokeWidth="1.6" strokeLinecap="round"/></svg>,
  barcode: (c, size = 20) => <svg width={size} height={size} viewBox="0 0 20 20" fill="none"><path d="M3 5v10M5.5 5v10M8 5v10M10.5 5v10M13 5v10M15.5 5v10M18 5v10" stroke={c} strokeWidth="1.4" strokeLinecap="round"/></svg>,
  camera: (c, size = 22) => <svg width={size} height={size} viewBox="0 0 22 22" fill="none"><rect x="2" y="6" width="18" height="13" rx="2" stroke={c} strokeWidth="1.6"/><circle cx="11" cy="12.5" r="3.5" stroke={c} strokeWidth="1.6"/><path d="M7 6l2-2h4l2 2" stroke={c} strokeWidth="1.6" strokeLinejoin="round"/></svg>,
  close: (c, size = 14) => <svg width={size} height={size} viewBox="0 0 14 14"><path d="M2 2l10 10M12 2L2 12" stroke={c} strokeWidth="2" strokeLinecap="round"/></svg>,
  water: (c, size = 18) => <svg width={size} height={size} viewBox="0 0 18 18" fill="none"><path d="M9 2s5 5 5 9a5 5 0 01-10 0c0-4 5-9 5-9z" stroke={c} strokeWidth="1.6" strokeLinejoin="round"/></svg>,
  scale: (c, size = 22) => <svg width={size} height={size} viewBox="0 0 22 22" fill="none"><rect x="3" y="5" width="16" height="13" rx="2" stroke={c} strokeWidth="1.6"/><path d="M11 9l-2 4h4l-2-4z" fill={c}/></svg>,
  flame: (c, size = 18) => <svg width={size} height={size} viewBox="0 0 18 18" fill="none"><path d="M9 2s-4 4-4 8a4 4 0 108 0c0-2-2-3-2-5 0 0 2 1 2 3s-1 2-1 2M9 2c0 2 2 3 2 5" stroke={c} strokeWidth="1.4" strokeLinejoin="round"/></svg>,
  leaf: (c, size = 18) => <svg width={size} height={size} viewBox="0 0 18 18" fill="none"><path d="M3 15s0-10 12-12c0 12-10 12-12 12z" stroke={c} strokeWidth="1.4" strokeLinejoin="round"/><path d="M3 15l8-8" stroke={c} strokeWidth="1.4" strokeLinecap="round"/></svg>,
  drop: (c, size = 18) => <svg width={size} height={size} viewBox="0 0 18 18" fill="none"><path d="M9 2s5 5 5 9a5 5 0 01-10 0c0-4 5-9 5-9z" stroke={c} strokeWidth="1.4" strokeLinejoin="round"/></svg>,
  star: (c, size = 18) => <svg width={size} height={size} viewBox="0 0 18 18" fill="none"><path d="M9 2l2 4.5 5 .7-3.5 3.4.8 5-4.3-2.4-4.3 2.4.8-5L2 7.2l5-.7L9 2z" stroke={c} strokeWidth="1.4" strokeLinejoin="round"/></svg>,
  trophy: (c, size = 18) => <svg width={size} height={size} viewBox="0 0 18 18" fill="none"><path d="M5 3h8v3a4 4 0 01-8 0V3zM3 3h2v2a2 2 0 01-2 0V3zM13 3h2v2a2 2 0 01-2 0V3zM7 11v2M11 11v2M5 15h8" stroke={c} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  send: (c, size = 16) => <svg width={size} height={size} viewBox="0 0 16 16"><path d="M8 13V3M3 8l5-5 5 5" stroke={c} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  pill: (c, size = 20) => <svg width={size} height={size} viewBox="0 0 20 20" fill="none"><rect x="2" y="7" width="16" height="6" rx="3" stroke={c} strokeWidth="1.6"/><path d="M10 7v6" stroke={c} strokeWidth="1.6"/></svg>,
  settings: (c, size = 20) => <svg width={size} height={size} viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="2.5" stroke={c} strokeWidth="1.6"/><path d="M10 2v2M10 16v2M2 10h2M16 10h2M4 4l1.5 1.5M14.5 14.5L16 16M4 16l1.5-1.5M14.5 5.5L16 4" stroke={c} strokeWidth="1.6" strokeLinecap="round"/></svg>,
  bell: (c, size = 20) => <svg width={size} height={size} viewBox="0 0 20 20" fill="none"><path d="M5 8a5 5 0 0110 0v4l2 3H3l2-3V8zM8 17a2 2 0 004 0" stroke={c} strokeWidth="1.6" strokeLinejoin="round"/></svg>,
  arrow: (c, size = 14) => <svg width={size} height={size} viewBox="0 0 14 14"><path d="M4 2l6 5-6 5" stroke={c} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>,
};

Object.assign(window, {
  sageColors,
  VytalMark, VytalLockup,
  SageSheet, SageFullScreen, SageSectionHeader, SageCard, SageButton, SageIcon,
});
