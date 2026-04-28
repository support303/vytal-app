// Welcome / Login / Signup screens — Calm Sage

function SageAuth({ onAuthed }) {
  const [screen, setScreen] = React.useState('welcome'); // welcome | login | signup
  if (screen === 'welcome') return <SageWelcome onLogin={() => setScreen('login')} onSignup={() => setScreen('signup')} />;
  if (screen === 'login') return <SageLogin onBack={() => setScreen('welcome')} onAuthed={onAuthed} onSignup={() => setScreen('signup')} />;
  if (screen === 'signup') return <SageSignup onBack={() => setScreen('welcome')} onAuthed={onAuthed} onLogin={() => setScreen('login')} />;
}

function SageWelcome({ onLogin, onSignup }) {
  return (
    <div style={{
      height: '100%', background: sageColors.bg, position: 'relative',
      display: 'flex', flexDirection: 'column', padding: '56px 24px 36px',
      overflow: 'hidden', color: "rgb(0, 0, 0)"
    }}>
      {/* Ambient glows */}
      <div style={{ position: 'absolute', top: -120, right: -80, width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(61,188,181,0.35), transparent 70%)' }} />
      <div style={{ position: 'absolute', top: 80, left: -80, width: 220, height: 220, borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(44,123,184,0.25), transparent 70%)' }} />
      <div style={{ position: 'absolute', bottom: -60, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(212,184,114,0.12), transparent 70%)' }} />

      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
        {/* Logo lockup */}
        <div style={{ marginTop: 24, alignSelf: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <VytalMark size={32} />
            <div style={{ fontSize: 20, fontWeight: 300, letterSpacing: 4, color: '#fff' }}>VYTAL</div>
          </div>
          <div style={{ fontSize: 10, letterSpacing: 3, color: sageColors.accent, marginTop: 6, paddingLeft: 2, fontWeight: 500 }}>HEALTH &amp; WELLNESS</div>
        </div>

        <div style={{ flex: 1 }} />

        {/* Hero */}
        <div>
          <div style={{
            fontFamily: '"Fraunces", serif', fontSize: 46, lineHeight: 1.02, letterSpacing: -1.8,
            color: '#fff', marginBottom: 14, fontWeight: 300
          }}>
            Emagreça com<br />
            <span style={{ fontStyle: 'italic', fontWeight: 400, background: `linear-gradient(135deg, ${sageColors.gradientFrom}, ${sageColors.gradientTo})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>método.</span><br />
            Saia com saúde.
          </div>
          <div style={{ fontSize: 14, color: sageColors.inkSoft, lineHeight: 1.55, marginBottom: 36, maxWidth: 300 }}>
            Your companion for the GLP-1 journey — diary, deliveries, teleconsultations, all in one place.
          </div>

          <SageButton onClick={onSignup} style={{ marginBottom: 10, padding: '18px 0' }}>Create account</SageButton>
          <SageButton onClick={onLogin} variant="secondary" style={{ padding: '18px 0' }}>I already have one</SageButton>

          <div style={{ textAlign: 'center', marginTop: 20, fontSize: 11, color: sageColors.inkFaint, lineHeight: 1.5 }}>
            By continuing you agree to our<br />
            <span style={{ textDecoration: 'underline', color: sageColors.inkSoft }}>Terms</span> &amp; <span style={{ textDecoration: 'underline', color: sageColors.inkSoft }}>Privacy Policy</span>
          </div>
        </div>
      </div>
    </div>);

}

function SageLogin({ onBack, onAuthed, onSignup }) {
  const [email, setEmail] = React.useState('maya@vytal.app');
  const [pw, setPw] = React.useState('••••••••');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const submit = (e) => {
    e?.preventDefault?.();
    if (!email.trim() || !pw.trim()) {setError('Fill in both fields.');return;}
    setError(null);
    setLoading(true);
    setTimeout(() => {setLoading(false);onAuthed();}, 800);
  };

  return (
    <div style={{ height: '100%', background: sageColors.bg, padding: '56px 24px 36px', display: 'flex', flexDirection: 'column' }}>
      <button onClick={onBack} style={{
        width: 36, height: 36, borderRadius: 18, background: sageColors.surface, border: 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginBottom: 28
      }}>{SageIcon.back(sageColors.ink)}</button>

      <div style={{ fontFamily: '"Fraunces", serif', fontSize: 34, letterSpacing: -1, color: sageColors.ink, marginBottom: 6, fontWeight: 400 }}>Welcome back.</div>
      <div style={{ fontSize: 14, color: sageColors.inkSoft, marginBottom: 28 }}>Glad to see you again.</div>

      <form onSubmit={submit}>
        <SageField label="Email" value={email} onChange={setEmail} type="email" />
        <SageField label="Password" value={pw} onChange={setPw} type="password" />

        <div style={{ textAlign: 'right', marginTop: -4, marginBottom: 20 }}>
          <button type="button" style={{ background: 'none', border: 'none', fontSize: 13, color: sageColors.sage, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
            Forgot password?
          </button>
        </div>

        {error && <div style={{ background: sageColors.dangerSoft, color: sageColors.danger, padding: '10px 14px', borderRadius: 12, fontSize: 13, marginBottom: 12 }}>{error}</div>}

        <SageButton onClick={submit} disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </SageButton>
      </form>

      <SageDivider label="or" />

      <SageOAuth label="Continue with Apple" icon="apple" onClick={() => {setLoading(true);setTimeout(onAuthed, 600);}} />
      <SageOAuth label="Continue with Google" icon="google" onClick={() => {setLoading(true);setTimeout(onAuthed, 600);}} />

      <div style={{ flex: 1 }} />
      <div style={{ textAlign: 'center', fontSize: 13, color: sageColors.inkSoft, marginTop: 24 }}>
        New here? <button onClick={onSignup} style={{ background: 'none', border: 'none', color: sageColors.sage, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', fontSize: 13 }}>Create account</button>
      </div>
    </div>);

}

function SageSignup({ onBack, onAuthed, onLogin }) {
  const [email, setEmail] = React.useState('');
  const [pw, setPw] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const submit = () => {setLoading(true);setTimeout(onAuthed, 800);};

  return (
    <div style={{ height: '100%', background: sageColors.bg, padding: '56px 24px 36px', display: 'flex', flexDirection: 'column' }}>
      <button onClick={onBack} style={{
        width: 36, height: 36, borderRadius: 18, background: sageColors.surface, border: 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginBottom: 28
      }}>{SageIcon.back(sageColors.ink)}</button>

      <div style={{ fontFamily: '"Fraunces", serif', fontSize: 34, letterSpacing: -1, color: sageColors.ink, marginBottom: 6, fontWeight: 400 }}>Let's begin.</div>
      <div style={{ fontSize: 14, color: sageColors.inkSoft, marginBottom: 28 }}>Set up your VYTAL companion.</div>

      <SageField label="Email" value={email} onChange={setEmail} type="email" placeholder="you@email.com" />
      <SageField label="Password" value={pw} onChange={setPw} type="password" placeholder="At least 8 characters" />

      <div style={{ marginTop: 12 }}>
        <SageButton onClick={submit} disabled={loading || !email.trim() || pw.length < 1}>
          {loading ? 'Creating…' : 'Continue'}
        </SageButton>
      </div>

      <SageDivider label="or" />
      <SageOAuth label="Continue with Apple" icon="apple" onClick={onAuthed} />
      <SageOAuth label="Continue with Google" icon="google" onClick={onAuthed} />

      <div style={{ flex: 1 }} />
      <div style={{ textAlign: 'center', fontSize: 13, color: sageColors.inkSoft, marginTop: 24 }}>
        Have an account? <button onClick={onLogin} style={{ background: 'none', border: 'none', color: sageColors.sage, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', fontSize: 13 }}>Sign in</button>
      </div>
    </div>);

}

function SageField({ label, value, onChange, type = 'text', placeholder }) {
  const [focused, setFocused] = React.useState(false);
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 12, color: sageColors.inkSoft, letterSpacing: 0.3, textTransform: 'uppercase', marginBottom: 8, paddingLeft: 4, fontWeight: 500 }}>{label}</div>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      placeholder={placeholder}
      style={{
        width: '100%', boxSizing: 'border-box',
        background: sageColors.surface, border: focused ? `2px solid ${sageColors.sage}` : '2px solid transparent',
        borderRadius: 16, padding: '14px 16px', fontSize: 15, color: sageColors.ink,
        fontFamily: 'inherit', outline: 'none',
        transition: 'border-color 0.15s'
      }} />
    </div>);

}

function SageDivider({ label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '22px 0' }}>
      <div style={{ flex: 1, height: 1, background: sageColors.divider }} />
      <div style={{ fontSize: 12, color: sageColors.inkFaint }}>{label}</div>
      <div style={{ flex: 1, height: 1, background: sageColors.divider }} />
    </div>);

}

function SageOAuth({ label, icon, onClick }) {
  return (
    <button onClick={onClick} style={{
      width: '100%', background: sageColors.surface, border: `1px solid ${sageColors.divider}`, borderRadius: 20,
      padding: '15px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
      marginBottom: 10, cursor: 'pointer', fontFamily: 'inherit', fontSize: 14, fontWeight: 500, color: sageColors.ink
    }}>
      {icon === 'apple' && <svg width="18" height="18" viewBox="0 0 18 18" fill={sageColors.ink}><path d="M13.5 9.6c0-1.9 1.5-2.8 1.6-2.9-.9-1.3-2.2-1.5-2.7-1.5-1.1-.1-2.2.7-2.8.7-.6 0-1.5-.7-2.5-.6-1.3 0-2.5.7-3.1 1.9-1.3 2.3-.3 5.7 1 7.6.6.9 1.4 2 2.4 2 1 0 1.3-.6 2.5-.6s1.5.6 2.5.6c1 0 1.7-.9 2.3-1.9.7-1 1-2.1 1-2.1s-2.1-.8-2.2-3.2zM11.7 4c.5-.6.9-1.4.8-2.3-.8 0-1.7.5-2.2 1.1-.5.5-.9 1.4-.8 2.2.9.1 1.7-.4 2.2-1z" /></svg>}
      {icon === 'google' && <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M17 9.2c0-.6-.1-1.1-.2-1.7H9v3.2h4.5c-.2 1-.8 1.9-1.7 2.5v2.1h2.7c1.6-1.5 2.5-3.6 2.5-6.1z" fill="#4285F4" /><path d="M9 17.5c2.3 0 4.2-.8 5.5-2.1l-2.7-2.1c-.8.5-1.7.8-2.8.8-2.2 0-4-1.5-4.7-3.5H1.6v2.2C2.9 15.6 5.7 17.5 9 17.5z" fill="#34A853" /><path d="M4.3 10.6c-.2-.5-.3-1-.3-1.6s.1-1.1.3-1.6V5.2H1.6C.9 6.4.5 7.9.5 9s.4 2.6 1.1 3.8l2.7-2.2z" fill="#FBBC04" /><path d="M9 3.9c1.2 0 2.3.4 3.2 1.2l2.4-2.4C13.2 1.3 11.3.5 9 .5 5.7.5 2.9 2.4 1.6 5.2l2.7 2.2C5 5.4 6.8 3.9 9 3.9z" fill="#EA4335" /></svg>}
      {label}
    </button>);

}

Object.assign(window, { SageAuth });