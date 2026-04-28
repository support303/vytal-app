// Calm Sage — app shell. Tabs: Diary / Progress / Care / Coach. Profile opens from top-right avatar.

function SageApp({ webConnected = true, initialTab = 'diary', noPlan = false, preTicks = 0, preUnlocked = [], initialOverlay = null }) {
  const [authed, setAuthed] = React.useState(true);
  const state = useVytalState({ webConnected, noPlan });
  const [tab, setTab] = React.useState(initialTab);
  const [overlay, setOverlay] = React.useState(null);
  const [profileOpen, setProfileOpen] = React.useState(false);

  // Apply pre-state ticks + unlocked agents on mount (for design canvas variants)
  const initRef = React.useRef(false);
  React.useEffect(() => {
    if (initRef.current) return; initRef.current = true;
    if (preTicks > 0 && state.todayWorkout) {
      state.todayWorkout.exercises.slice(0, preTicks).forEach(ex => state.toggleExerciseDone(ex.id, true));
      state.startWorkout();
    }
    preUnlocked.forEach(id => state.unlockAgent(id));
    if (initialOverlay === 'agent-paywall-therapist') {
      const a = state.agents.find(x => x.id === 'therapist');
      if (a) setOverlay({ type: 'agent-paywall', agent: a });
    } else if (initialOverlay === 'agent-bundle') {
      setOverlay({ type: 'agent-bundle' });
    }
  }, []);

  if (!authed) return <SageAuth onAuthed={() => setAuthed(true)} />;

  return (
    <div style={{
      height: '100%', background: sageColors.bg, position: 'relative',
      fontFamily: '"Inter", -apple-system, system-ui', color: sageColors.ink, overflow: 'hidden',
    }}>
      {/* Persistent profile avatar (top-right) */}
      <ProfileAvatarButton onClick={() => setProfileOpen(true)} />

      <div style={{ height: '100%', overflow: 'auto', paddingBottom: 96 }}>
        {tab === 'diary' && <SageDiary state={state} onOpen={setOverlay} />}
        {tab === 'progress' && <SageProgress state={state} onOpen={setOverlay} />}
        {tab === 'workouts' && <SageWorkouts state={state} onOpen={setOverlay} />}
        {tab === 'care' && <SageCare state={state} onOpen={setOverlay} />}
        {tab === 'coach' && <SageAgents state={state} onOpen={setOverlay} />}
      </div>

      <SageTabBar tab={tab} onTab={setTab} onPlus={() => setOverlay({ type: 'add-menu' })} />

      {/* Overlays */}
      {overlay?.type === 'add-menu' && <SageAddMenu onClose={() => setOverlay(null)} onPick={(t) => setOverlay(t)} />}
      {overlay?.type === 'weight' && <SageLogWeight state={state} onClose={() => setOverlay(null)} />}
      {overlay?.type === 'search' && <SageFoodSearch state={state} meal={overlay.meal || 'Snack'} onClose={() => setOverlay(null)} />}
      {overlay?.type === 'photo' && <SageFoodSearch state={state} meal={overlay.meal || 'Snack'} initialMode="photo" onClose={() => setOverlay(null)} />}
      {overlay?.type === 'barcode' && <SageFoodSearch state={state} meal={overlay.meal || 'Snack'} initialMode="barcode" onClose={() => setOverlay(null)} />}
      {overlay?.type === 'coach' && <SageCoachFull state={state} onClose={() => setOverlay(null)} />}
      {overlay?.type === 'exercise' && <SageExerciseDetail exercise={overlay.exercise} state={state} onClose={() => setOverlay(null)} />}
      {overlay?.type === 'generate-plan' && <SageGeneratePlan state={state} onClose={() => setOverlay(null)} />}
      {overlay?.type === 'workout-complete' && <SageWorkoutComplete state={state} onClose={() => setOverlay(null)} />}
      {overlay?.type === 'agent-paywall' && <SageAgentPaywall agent={overlay.agent} state={state} onClose={() => setOverlay(null)} />}
      {overlay?.type === 'agent-bundle' && <SageAgentBundle state={state} onClose={() => setOverlay(null)} />}
      {overlay?.type === 'agent-chat' && <SageAgentChat agent={overlay.agent} state={state} onClose={() => setOverlay(null)} />}
      {overlay?.type === 'order' && <SageOrderDetail order={overlay.order} onClose={() => setOverlay(null)} />}
      {overlay?.type === 'consult' && (
        <SageConsultDetail
          consult={overlay.consult}
          startCall={overlay.startCall}
          onJoinCall={() => setOverlay({ ...overlay, startCall: true })}
          onClose={() => setOverlay(null)}
        />
      )}
      {overlay?.type === 'prescription' && <SagePrescriptionDetail rx={overlay.rx} onClose={() => setOverlay(null)} />}

      {profileOpen && <SageProfile state={state} onClose={() => setProfileOpen(false)} onLogout={() => { setProfileOpen(false); setAuthed(false); }} />}
    </div>
  );
}

// ───── Profile avatar (floating, top-right) ─────
function ProfileAvatarButton({ onClick }) {
  return (
    <button onClick={onClick} style={{
      position: 'absolute', top: 58, right: 16, zIndex: 30,
      width: 36, height: 36, borderRadius: 18,
      background: `linear-gradient(135deg, ${sageColors.gradientFrom}, ${sageColors.gradientTo})`,
      border: '2px solid rgba(240,245,250,0.18)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontWeight: 500, fontSize: 14, cursor: 'pointer',
      fontFamily: 'inherit', boxShadow: '0 4px 14px rgba(61,188,181,0.35)',
    }}>M</button>
  );
}

// ───── Tab bar (Diary / Progress / + / Care / Coach) ─────
function SageTabBar({ tab, onTab, onPlus }) {
  const dumbbellIcon = (c, size = 22) => <svg width={size} height={size} viewBox="0 0 22 22" fill="none"><path d="M3 8v6M5 6v10M17 6v10M19 8v6M5 11h12" stroke={c} strokeWidth="1.6" strokeLinecap="round"/></svg>;
  const tabs = [
    { k: 'diary', label: 'Diary', icon: SageIcon.food },
    { k: 'workouts', label: 'Treinos', icon: dumbbellIcon },
  ];
  const right = [
    { k: 'care', label: 'Care', icon: SageIcon.pill },
    { k: 'coach', label: 'Equipe', icon: SageIcon.coach },
  ];
  const Btn = ({ t }) => {
    const active = tab === t.k;
    const c = active ? sageColors.sageDeep : sageColors.inkFaint;
    return (
      <button onClick={() => onTab(t.k)} style={{
        flex: 1, background: 'none', border: 'none', cursor: 'pointer',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '8px 0', fontFamily: 'inherit',
      }}>
        {t.icon(c, 22)}
        <div style={{ fontSize: 10, color: c, fontWeight: active ? 600 : 500, letterSpacing: 0.2 }}>{t.label}</div>
      </button>
    );
  };
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      background: 'rgba(10,27,46,0.85)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      borderTop: `1px solid ${sageColors.divider}`, paddingBottom: 28, paddingTop: 6,
      display: 'flex', alignItems: 'center', zIndex: 40,
    }}>
      {tabs.map(t => <Btn key={t.k} t={t} />)}
      <div style={{ width: 60, display: 'flex', justifyContent: 'center' }}>
        <button onClick={onPlus} style={{
          width: 52, height: 52, borderRadius: 26, border: 'none',
          background: `linear-gradient(135deg, ${sageColors.gradientFrom}, ${sageColors.gradientTo})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          boxShadow: '0 6px 20px rgba(61,188,181,0.45), 0 0 0 4px rgba(10,27,46,0.8)',
          transform: 'translateY(-8px)',
        }}>
          <svg width="18" height="18" viewBox="0 0 18 18"><path d="M9 2v14M2 9h14" stroke="#fff" strokeWidth="2.4" strokeLinecap="round"/></svg>
        </button>
      </div>
      {right.map(t => <Btn key={t.k} t={t} />)}
    </div>
  );
}

// ───── Quick-add menu (sheet) ─────
function SageAddMenu({ onClose, onPick }) {
  const items = [
    { k: { type: 'search' }, label: 'Search foods', desc: 'Browse the database', icon: SageIcon.search },
    { k: { type: 'barcode' }, label: 'Scan barcode', desc: 'Point at a label', icon: SageIcon.barcode },
    { k: { type: 'photo' }, label: 'Snap a photo', desc: "We'll read your plate", icon: SageIcon.camera },
    { k: { type: 'weight' }, label: 'Log weight', desc: 'Quick morning check-in', icon: SageIcon.scale },
    { k: { type: 'coach' }, label: 'Ask Coach', desc: 'Question or need a boost', icon: SageIcon.coach },
  ];
  return (
    <SageSheet onClose={onClose} title="Quick log">
      {items.map((it, i) => (
        <button key={i} onClick={() => onPick(it.k)} style={{
          width: '100%', background: sageColors.surface, border: 'none', borderRadius: 20,
          padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14,
          marginBottom: 8, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 14, background: sageColors.sageLight,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{it.icon(sageColors.sageDeep, 20)}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 500 }}>{it.label}</div>
            <div style={{ fontSize: 12, color: sageColors.inkSoft, marginTop: 1 }}>{it.desc}</div>
          </div>
        </button>
      ))}
    </SageSheet>
  );
}

// ───── Coach tab (preview card) + full coach overlay ─────
function SageCoachTab({ state, onOpen }) {
  const { user, lostKg } = state;
  return (
    <div style={{ padding: '62px 20px 24px' }}>
      <div style={{ fontSize: 11, color: sageColors.inkSoft, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 4, fontWeight: 500 }}>Your team</div>
      <div style={{ fontSize: 28, fontWeight: 500, letterSpacing: -0.6, marginBottom: 20 }}>Coach</div>

      <button onClick={() => onOpen({ type: 'coach' })} style={{
        width: '100%', borderRadius: 28, padding: '22px',
        background: `linear-gradient(135deg, ${sageColors.gradientFrom}, ${sageColors.gradientTo})`,
        border: 'none', textAlign: 'left', cursor: 'pointer', color: '#fff', marginBottom: 14,
        boxShadow: '0 8px 24px rgba(61,188,181,0.25)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 20, background: sageColors.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {SageIcon.coach('#fff', 20)}
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 500 }}>Coach</div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>Always here</div>
          </div>
        </div>
        <div style={{ fontSize: 15, lineHeight: 1.45, opacity: 0.95 }}>
          "Week {user.weekNumber} and {lostKg.toFixed(1)} kg down — that's the sustainable zone, exactly where we want you. How's the morning routine feeling?"
        </div>
        <div style={{ marginTop: 14, fontSize: 12, opacity: 0.7 }}>Tap to reply →</div>
      </button>

      <SageSectionHeader>Quick asks</SageSectionHeader>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {['Nausea is back', "What to eat tonight?", 'Why did I stall?', 'Low energy today'].map(q => (
          <button key={q} onClick={() => onOpen({ type: 'coach' })} style={{
            background: sageColors.surface, borderRadius: 18, padding: '14px 14px',
            border: 'none', textAlign: 'left', fontSize: 13, color: sageColors.ink, cursor: 'pointer',
            fontFamily: 'inherit', minHeight: 64,
          }}>{q}</button>
        ))}
      </div>
    </div>
  );
}

function SageCoachFull({ state, onClose }) {
  const [messages, setMessages] = React.useState([
    { role: 'assistant', content: `Hey — how's week ${state.user.weekNumber} treating you? Saw you're down another 0.7 today. Quiet wins are still wins.` },
  ]);
  const [input, setInput] = React.useState('');
  const [thinking, setThinking] = React.useState(false);
  const scrollRef = React.useRef(null);
  React.useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [messages, thinking]);
  const send = async () => {
    const t = input.trim(); if (!t || thinking) return;
    const next = [...messages, { role: 'user', content: t }];
    setMessages(next); setInput(''); setThinking(true);
    const r = await askCoach(next);
    setMessages([...next, { role: 'assistant', content: r }]); setThinking(false);
  };
  return (
    <SageFullScreen onClose={onClose} title="Coach">
      <div ref={scrollRef} style={{ padding: '8px 16px' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: 10 }}>
            <div style={{
              maxWidth: '82%', background: m.role === 'user' ? sageColors.sage : sageColors.surface,
              color: m.role === 'user' ? '#fff' : sageColors.ink,
              padding: '11px 15px', borderRadius: m.role === 'user' ? '20px 20px 6px 20px' : '20px 20px 20px 6px',
              fontSize: 14, lineHeight: 1.45,
            }}>{m.content}</div>
          </div>
        ))}
        {thinking && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 10 }}>
            <div style={{ background: sageColors.surface, padding: '14px 16px', borderRadius: '20px 20px 20px 6px', display: 'flex', gap: 4 }}>
              {[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: 3, background: sageColors.inkFaint, animation: `pulse 1.2s ${i*0.15}s infinite` }}/>)}
              <style>{`@keyframes pulse { 0%,60%,100%{opacity:0.3} 30%{opacity:1} }`}</style>
            </div>
          </div>
        )}
      </div>
      <div style={{ padding: '10px 12px 28px', borderTop: `1px solid ${sageColors.divider}`, display: 'flex', gap: 8, alignItems: 'center', background: sageColors.bg }}>
        <div style={{ flex: 1, background: sageColors.surface, borderRadius: 22, padding: '10px 16px', display: 'flex' }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') send(); }}
            placeholder="Tell Coach what's up…"
            style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 14, color: sageColors.ink, fontFamily: 'inherit' }}/>
        </div>
        <button onClick={send} disabled={!input.trim() || thinking} style={{
          width: 44, height: 44, borderRadius: 22, background: input.trim() ? sageColors.sage : sageColors.sageLight,
          border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: input.trim() ? 'pointer' : 'default', flexShrink: 0,
        }}>{SageIcon.send('#fff', 16)}</button>
      </div>
    </SageFullScreen>
  );
}

// ───── Profile (opened from avatar, fullscreen) ─────
function SageProfile({ state, onClose, onLogout }) {
  const { user, weight, lostKg, bmi, webConnected, disconnectWeb, connectWeb } = state;
  const Row = ({ icon, label, value, danger, onClick, right }) => (
    <button onClick={onClick} style={{
      width: '100%', padding: '14px 16px', background: 'transparent', border: 'none',
      display: 'flex', alignItems: 'center', gap: 12, cursor: onClick ? 'pointer' : 'default',
      fontFamily: 'inherit', textAlign: 'left',
      borderBottom: `1px solid ${sageColors.divider}`,
    }}>
      <div style={{ width: 32, height: 32, borderRadius: 10, background: danger ? sageColors.dangerSoft : sageColors.sageLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {icon(danger ? sageColors.danger : sageColors.sageDeep, 16)}
      </div>
      <div style={{ flex: 1, fontSize: 14, fontWeight: 500, color: danger ? sageColors.danger : sageColors.ink }}>{label}</div>
      {right}
      {value && <div style={{ fontSize: 13, color: sageColors.inkSoft }}>{value}</div>}
      {onClick && !right && SageIcon.chevron(sageColors.inkFaint)}
    </button>
  );
  return (
    <SageFullScreen onClose={onClose} title="Profile">
      <div style={{ padding: '0 20px 40px' }}>
        {/* Hero */}
        <SageCard style={{ padding: '20px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 60, height: 60, borderRadius: 30, background: sageColors.sageLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 500, color: sageColors.sageDeep }}>M</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 500, letterSpacing: -0.3 }}>{user.name}</div>
            <div style={{ fontSize: 13, color: sageColors.inkSoft, marginTop: 2 }}>{user.email}</div>
            <div style={{ fontSize: 11, color: sageColors.inkFaint, marginTop: 4 }}>Joined {user.joinedDate}</div>
          </div>
        </SageCard>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 16 }}>
          {[['Weight', `${weight.toFixed(1)}kg`], ['Lost', `${lostKg.toFixed(1)}kg`], ['BMI', bmi.toFixed(1)]].map(([l, v]) => (
            <div key={l} style={{ background: sageColors.surface, borderRadius: 16, padding: '12px 10px', textAlign: 'center' }}>
              <div style={{ fontSize: 10, color: sageColors.inkSoft, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 4, fontWeight: 500 }}>{l}</div>
              <div style={{ fontSize: 16, fontWeight: 500, letterSpacing: -0.3, fontVariantNumeric: 'tabular-nums' }}>{v}</div>
            </div>
          ))}
        </div>

        <SageSectionHeader>vytal.com account</SageSectionHeader>
        <SageCard style={{ padding: 0, overflow: 'hidden', marginBottom: 16 }}>
          <Row
            icon={SageIcon.leaf}
            label={webConnected ? 'Connected' : 'Not connected'}
            right={
              webConnected
                ? <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', background: sageColors.sageLight, borderRadius: 999, fontSize: 11, color: sageColors.sageDeep, fontWeight: 500 }}><div style={{ width: 6, height: 6, borderRadius: 3, background: sageColors.sageDeep }}/>Synced</div>
                : <div style={{ padding: '4px 10px', background: sageColors.bgSoft, borderRadius: 999, fontSize: 11, color: sageColors.inkSoft, fontWeight: 500 }}>Offline</div>
            }
            onClick={webConnected ? disconnectWeb : connectWeb}
          />
        </SageCard>

        <SageSectionHeader>Goals & plan</SageSectionHeader>
        <SageCard style={{ padding: 0, overflow: 'hidden', marginBottom: 16 }}>
          <Row icon={SageIcon.scale} label="Goal weight" value={`${user.goalWeight} kg`} onClick={() => {}} />
          <Row icon={SageIcon.flame} label="Daily calories" value={`${user.dailyCalorieGoal} kcal`} onClick={() => {}} />
          <Row icon={SageIcon.leaf} label="Macro split" value={`${user.proteinGoal}/${user.carbsGoal}/${user.fatGoal}g`} onClick={() => {}} />
          <Row icon={SageIcon.drop} label="Water goal" value={`${user.waterGoal} glasses`} onClick={() => {}} />
        </SageCard>

        <SageSectionHeader>App</SageSectionHeader>
        <SageCard style={{ padding: 0, overflow: 'hidden', marginBottom: 16 }}>
          <Row icon={SageIcon.bell} label="Notifications" onClick={() => {}} />
          <Row icon={SageIcon.settings} label="Units & preferences" onClick={() => {}} />
          <Row icon={SageIcon.profile} label="Privacy" onClick={() => {}} />
        </SageCard>

        <button onClick={onLogout} style={{
          width: '100%', padding: '15px 0', background: 'transparent', border: 'none',
          fontSize: 14, fontWeight: 500, color: sageColors.danger, cursor: 'pointer', fontFamily: 'inherit',
        }}>Sign out</button>

        <div style={{ textAlign: 'center', fontSize: 11, color: sageColors.inkFaint, marginTop: 16 }}>VYTAL · v1.0.0</div>
      </div>
    </SageFullScreen>
  );
}

Object.assign(window, { SageApp });
