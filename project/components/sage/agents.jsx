// Agents tab — your AI team. Coach is free; Therapist, Trainer, Nutritionist locked.
// Tapping a locked agent opens a paywall sheet. Active agents have full chat access.

function SageAgents({ state, onOpen }) {
  const { user, lostKg, agents, unlockedAgents } = state;

  return (
    <div style={{ padding: '62px 20px 24px' }}>
      {/* Header */}
      <div style={{ fontSize: 11, color: sageColors.inkSoft, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 4, fontWeight: 500 }}>Sua equipe</div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 18 }}>
        <div style={{ fontSize: 28, fontWeight: 500, letterSpacing: -0.6 }}>Agentes</div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '5px 10px',
          background: sageColors.sageLight, borderRadius: 999,
          fontSize: 11, color: sageColors.sageDeep, fontWeight: 500,
        }}>
          <div style={{ width: 6, height: 6, borderRadius: 3, background: sageColors.sageDeep }} />
          {unlockedAgents.length} ativo{unlockedAgents.length === 1 ? '' : 's'}
        </div>
      </div>

      {/* Coach hero (always free) */}
      <CoachHero state={state} onOpen={onOpen} />

      {/* Active extra agents (if any) */}
      {agents.filter(a => a.unlocked && a.id !== 'coach').length > 0 && (
        <>
          <SageSectionHeader>Seus especialistas</SageSectionHeader>
          {agents.filter(a => a.unlocked && a.id !== 'coach').map(a => (
            <AgentRow key={a.id} agent={a} onOpen={() => onOpen({ type: 'agent-chat', agent: a })} />
          ))}
        </>
      )}

      {/* Locked agents */}
      {agents.filter(a => !a.unlocked).length > 0 && (
        <>
          <SageSectionHeader right={<span style={{ fontSize: 11, color: sageColors.accent, fontWeight: 500 }}>+R$ por mês</span>}>
            Adicione ao seu plano
          </SageSectionHeader>
          {agents.filter(a => !a.unlocked).map(a => (
            <LockedAgentCard key={a.id} agent={a} onOpen={() => onOpen({ type: 'agent-paywall', agent: a })} />
          ))}
        </>
      )}

      {/* Bundle deal */}
      {agents.filter(a => !a.unlocked).length >= 2 && (
        <BundleCard
          agents={agents.filter(a => !a.unlocked)}
          onOpen={() => onOpen({ type: 'agent-bundle' })}
        />
      )}
    </div>
  );
}

// ─────────── Coach hero (free, always available) ───────────
function CoachHero({ state, onOpen }) {
  const { user, lostKg } = state;
  return (
    <button onClick={() => onOpen({ type: 'coach' })} style={{
      width: '100%', borderRadius: 28, padding: 22, border: 'none', textAlign: 'left',
      background: `linear-gradient(135deg, ${sageColors.gradientFrom}, ${sageColors.gradientTo})`,
      color: '#fff', cursor: 'pointer', marginBottom: 10,
      boxShadow: '0 8px 24px rgba(61,188,181,0.25)', fontFamily: 'inherit',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 22, background: sageColors.accent,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>{SageIcon.coach('#fff', 22)}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 16, fontWeight: 500 }}>Coach</div>
          <div style={{ fontSize: 11, opacity: 0.75 }}>Sempre por perto · incluído no plano</div>
        </div>
        <div style={{
          padding: '4px 10px', background: 'rgba(255,255,255,0.18)', borderRadius: 999,
          fontSize: 10, fontWeight: 500, letterSpacing: 0.3, textTransform: 'uppercase',
        }}>Grátis</div>
      </div>
      <div style={{ fontSize: 14, lineHeight: 1.45, opacity: 0.95, marginBottom: 12 }}>
        "Semana {user.weekNumber} e {lostKg.toFixed(1)} kg a menos — tá no ritmo certinho. Como tá a manhã hoje?"
      </div>
      <div style={{ fontSize: 12, opacity: 0.75 }}>Toque para conversar →</div>
    </button>
  );
}

// ─────────── Active agent row ───────────
function AgentRow({ agent, onOpen }) {
  return (
    <button onClick={onOpen} style={{
      width: '100%', padding: '14px 16px', background: sageColors.surface, border: 'none',
      borderRadius: 18, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12,
      cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 14, flexShrink: 0,
        background: `linear-gradient(135deg, ${agent.colorFrom}, ${agent.colorTo})`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
      }}>{agent.emoji}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: sageColors.ink }}>{agent.name}</div>
          <div style={{ width: 6, height: 6, borderRadius: 3, background: sageColors.sage }}/>
        </div>
        <div style={{ fontSize: 11, color: sageColors.inkSoft, marginTop: 2 }}>{agent.title}</div>
      </div>
      {SageIcon.chevron(sageColors.inkFaint)}
    </button>
  );
}

// ─────────── Locked agent card ───────────
function LockedAgentCard({ agent, onOpen }) {
  return (
    <button onClick={onOpen} style={{
      width: '100%', padding: 16, background: sageColors.surface, border: `1px solid ${sageColors.divider}`,
      borderRadius: 22, marginBottom: 8, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
      display: 'block',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
        <div style={{
          width: 48, height: 48, borderRadius: 16, flexShrink: 0,
          background: `linear-gradient(135deg, ${agent.colorFrom}, ${agent.colorTo})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
          opacity: 0.85,
          position: 'relative',
        }}>
          {agent.emoji}
          {/* Lock badge */}
          <div style={{
            position: 'absolute', bottom: -4, right: -4, width: 20, height: 20, borderRadius: 10,
            background: sageColors.bg, border: `2px solid ${sageColors.surface}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <rect x="2" y="4.5" width="6" height="4.5" rx="1" stroke={sageColors.accent} strokeWidth="1.2"/>
              <path d="M3.5 4.5V3a1.5 1.5 0 013 0v1.5" stroke={sageColors.accent} strokeWidth="1.2"/>
            </svg>
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 500, color: sageColors.ink }}>{agent.name}</div>
          <div style={{ fontSize: 11, color: sageColors.inkSoft, marginTop: 2 }}>{agent.title}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 16, fontWeight: 500, color: sageColors.accent, fontVariantNumeric: 'tabular-nums', letterSpacing: -0.2 }}>
            R$ {agent.priceBRL}
          </div>
          <div style={{ fontSize: 10, color: sageColors.inkFaint, marginTop: 1 }}>/mês</div>
        </div>
      </div>
      <div style={{ fontSize: 12, color: sageColors.inkSoft, lineHeight: 1.45, marginBottom: 12 }}>
        {agent.tagline}
      </div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {agent.perks.slice(0, 3).map((p, i) => (
          <div key={i} style={{
            padding: '4px 8px', background: sageColors.bgSoft, borderRadius: 8,
            fontSize: 10, color: sageColors.inkSoft, fontWeight: 500,
          }}>{p}</div>
        ))}
      </div>
    </button>
  );
}

// ─────────── Bundle deal card ───────────
function BundleCard({ agents, onOpen }) {
  const total = agents.reduce((s, a) => s + a.priceBRL, 0);
  const bundlePrice = Math.round(total * 0.7); // 30% off
  return (
    <button onClick={onOpen} style={{
      width: '100%', marginTop: 14, padding: 18, borderRadius: 22, border: 'none',
      background: `linear-gradient(135deg, rgba(212,184,114,0.18), rgba(212,184,114,0.06))`,
      borderLeft: `3px solid ${sageColors.accent}`,
      cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <div style={{ fontSize: 11, color: sageColors.accent, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase' }}>Pacote completo</div>
        <div style={{
          padding: '2px 8px', background: sageColors.accent, borderRadius: 999,
          fontSize: 10, color: sageColors.bg, fontWeight: 600, letterSpacing: 0.3,
        }}>−30%</div>
      </div>
      <div style={{ fontSize: 16, fontWeight: 500, color: sageColors.ink, marginBottom: 4 }}>
        Toda sua equipe por R$ {bundlePrice}<span style={{ fontSize: 12, color: sageColors.inkSoft, fontWeight: 400 }}>/mês</span>
      </div>
      <div style={{ fontSize: 12, color: sageColors.inkSoft, lineHeight: 1.4 }}>
        Terapeuta, Trainer e Nutricionista juntos · cancele quando quiser · <span style={{ textDecoration: 'line-through', color: sageColors.inkFaint }}>R$ {total}</span>
      </div>
    </button>
  );
}

// ─────────── Paywall sheet (single agent) ───────────
function SageAgentPaywall({ agent, state, onClose }) {
  const [subscribing, setSubscribing] = React.useState(false);
  const subscribe = () => {
    setSubscribing(true);
    setTimeout(() => {
      state.unlockAgent(agent.id);
      setSubscribing(false);
      onClose();
    }, 1200);
  };
  return (
    <SageFullScreen onClose={onClose} title=" ">
      <div style={{ padding: '0 20px 40px' }}>
        {/* Hero */}
        <div style={{
          background: `linear-gradient(160deg, ${agent.colorFrom}, ${agent.colorTo})`,
          borderRadius: 28, padding: '28px 22px', color: '#fff', marginBottom: 20, position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', right: -40, top: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
          <div style={{ position: 'relative' }}>
            <div style={{
              width: 64, height: 64, borderRadius: 20, background: 'rgba(255,255,255,0.18)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, marginBottom: 14,
            }}>{agent.emoji}</div>
            <div style={{ fontSize: 11, opacity: 0.8, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 4, fontWeight: 500 }}>{agent.title}</div>
            <div style={{ fontFamily: '"Fraunces", serif', fontSize: 30, fontWeight: 400, letterSpacing: -0.6, lineHeight: 1.1, marginBottom: 10 }}>{agent.name}</div>
            <div style={{ fontSize: 14, opacity: 0.9, lineHeight: 1.5 }}>{agent.longPitch}</div>
          </div>
        </div>

        {/* What you get */}
        <SageSectionHeader>O que está incluído</SageSectionHeader>
        <SageCard style={{ padding: 0, overflow: 'hidden' }}>
          {agent.perks.map((p, i) => (
            <div key={i} style={{
              padding: '13px 16px', display: 'flex', alignItems: 'center', gap: 12,
              borderBottom: i === agent.perks.length - 1 ? 'none' : `1px solid ${sageColors.divider}`,
            }}>
              <div style={{
                width: 26, height: 26, borderRadius: 13, background: sageColors.sageLight,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                  <path d="M2.5 7.2L5.5 10l6-6.5" stroke={sageColors.sage} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div style={{ fontSize: 13, color: sageColors.ink, lineHeight: 1.4 }}>{p}</div>
            </div>
          ))}
        </SageCard>

        {/* Sample message */}
        <SageSectionHeader>Como ele fala</SageSectionHeader>
        <div style={{
          padding: '14px 16px', background: sageColors.surface, borderRadius: '20px 20px 20px 6px',
          fontSize: 13, color: sageColors.ink, lineHeight: 1.5, marginBottom: 6,
        }}>
          {agent.sampleMessage}
        </div>
        <div style={{ fontSize: 11, color: sageColors.inkFaint, marginLeft: 4 }}>{agent.name} · agora há pouco</div>

        {/* Pricing card */}
        <div style={{
          marginTop: 24, padding: 18, background: sageColors.surface, borderRadius: 22,
          border: `1px solid ${sageColors.divider}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
            <span style={{ fontSize: 14, color: sageColors.inkSoft }}>R$</span>
            <span style={{ fontSize: 32, fontWeight: 500, color: sageColors.ink, letterSpacing: -1, fontVariantNumeric: 'tabular-nums' }}>{agent.priceBRL}</span>
            <span style={{ fontSize: 13, color: sageColors.inkSoft, marginLeft: 2 }}>/mês</span>
          </div>
          <div style={{ fontSize: 12, color: sageColors.inkSoft, lineHeight: 1.4, marginBottom: 14 }}>
            Cancele quando quiser. Cobrado junto com seu plano vytal.com.
          </div>
          <SageButton onClick={subscribe} disabled={subscribing}>
            {subscribing ? 'Adicionando…' : `Adicionar ${agent.name}`}
          </SageButton>
        </div>

        <div style={{ fontSize: 11, color: sageColors.inkFaint, textAlign: 'center', marginTop: 14, lineHeight: 1.5 }}>
          Os agentes são suporte de IA, não substituem profissionais licenciados. Para questões clínicas, consulte sua médica em <span style={{ color: sageColors.inkSoft }}>Care</span>.
        </div>
      </div>
    </SageFullScreen>
  );
}

// ─────────── Bundle paywall ───────────
function SageAgentBundle({ state, onClose }) {
  const [subscribing, setSubscribing] = React.useState(false);
  const lockedAgents = state.agents.filter(a => !a.unlocked);
  const total = lockedAgents.reduce((s, a) => s + a.priceBRL, 0);
  const bundlePrice = Math.round(total * 0.7);

  const subscribe = () => {
    setSubscribing(true);
    setTimeout(() => {
      lockedAgents.forEach(a => state.unlockAgent(a.id));
      setSubscribing(false);
      onClose();
    }, 1200);
  };

  return (
    <SageFullScreen onClose={onClose} title=" ">
      <div style={{ padding: '0 20px 40px' }}>
        <div style={{
          background: `linear-gradient(160deg, ${sageColors.gradientFrom}, ${sageColors.gradientTo})`,
          borderRadius: 28, padding: '28px 22px', color: '#fff', marginBottom: 20, position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', right: -40, top: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(212,184,114,0.22)' }} />
          <div style={{ position: 'relative' }}>
            <div style={{
              padding: '4px 10px', background: sageColors.accent, borderRadius: 999, display: 'inline-block',
              fontSize: 10, color: sageColors.bg, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 14,
            }}>Pacote · economize 30%</div>
            <div style={{ fontFamily: '"Fraunces", serif', fontSize: 32, fontWeight: 400, letterSpacing: -0.7, lineHeight: 1.05, marginBottom: 10 }}>
              Toda sua equipe<br/><span style={{ fontStyle: 'italic' }}>em um só lugar</span>
            </div>
            <div style={{ fontSize: 14, opacity: 0.9, lineHeight: 1.5 }}>
              Terapeuta, Trainer e Nutricionista — todos disponíveis 24/7, conversando entre si para te apoiar de forma integrada.
            </div>
          </div>
        </div>

        {/* Avatars row */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
          {lockedAgents.map(a => (
            <div key={a.id} style={{ flex: 1, padding: 14, background: sageColors.surface, borderRadius: 18, textAlign: 'center' }}>
              <div style={{
                width: 44, height: 44, margin: '0 auto 10px', borderRadius: 14,
                background: `linear-gradient(135deg, ${a.colorFrom}, ${a.colorTo})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
              }}>{a.emoji}</div>
              <div style={{ fontSize: 12, fontWeight: 500, color: sageColors.ink }}>{a.name.split(' ')[0]}</div>
              <div style={{ fontSize: 10, color: sageColors.inkSoft, marginTop: 1 }}>{a.shortTitle}</div>
            </div>
          ))}
        </div>

        {/* Pricing */}
        <div style={{
          padding: 20, background: sageColors.surface, borderRadius: 22,
          border: `1px solid ${sageColors.accent}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
            <span style={{ fontSize: 14, color: sageColors.inkSoft }}>R$</span>
            <span style={{ fontSize: 36, fontWeight: 500, color: sageColors.ink, letterSpacing: -1, fontVariantNumeric: 'tabular-nums' }}>{bundlePrice}</span>
            <span style={{ fontSize: 13, color: sageColors.inkSoft, marginLeft: 2 }}>/mês</span>
            <span style={{ fontSize: 12, color: sageColors.inkFaint, textDecoration: 'line-through', marginLeft: 8, fontVariantNumeric: 'tabular-nums' }}>R$ {total}</span>
          </div>
          <div style={{ fontSize: 12, color: sageColors.inkSoft, lineHeight: 1.4, marginBottom: 14 }}>
            Equivale a R$ {Math.round(bundlePrice / lockedAgents.length)}/mês por agente. Cancele quando quiser.
          </div>
          <SageButton onClick={subscribe} disabled={subscribing}>
            {subscribing ? 'Ativando equipe…' : 'Ativar pacote completo'}
          </SageButton>
        </div>
      </div>
    </SageFullScreen>
  );
}

// ─────────── Specialist agent chat overlay ───────────
function SageAgentChat({ agent, state, onClose }) {
  const [messages, setMessages] = React.useState([
    { role: 'assistant', content: agent.openingLine },
  ]);
  const [input, setInput] = React.useState('');
  const [thinking, setThinking] = React.useState(false);
  const scrollRef = React.useRef(null);
  React.useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [messages, thinking]);

  const send = async () => {
    const t = input.trim(); if (!t || thinking) return;
    const next = [...messages, { role: 'user', content: t }];
    setMessages(next); setInput(''); setThinking(true);
    const r = await askCoach(next, agent.systemPrompt);
    setMessages([...next, { role: 'assistant', content: r }]); setThinking(false);
  };

  return (
    <SageFullScreen onClose={onClose} title={
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 9, background: `linear-gradient(135deg, ${agent.colorFrom}, ${agent.colorTo})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
        }}>{agent.emoji}</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.1 }}>{agent.name}</div>
          <div style={{ fontSize: 10, color: sageColors.inkSoft }}>{agent.shortTitle}</div>
        </div>
      </div>
    }>
      <div ref={scrollRef} style={{ padding: '8px 16px' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: 10 }}>
            <div style={{
              maxWidth: '82%',
              background: m.role === 'user' ? sageColors.sage : sageColors.surface,
              color: m.role === 'user' ? '#fff' : sageColors.ink,
              padding: '11px 15px',
              borderRadius: m.role === 'user' ? '20px 20px 6px 20px' : '20px 20px 20px 6px',
              fontSize: 14, lineHeight: 1.45,
            }}>{m.content}</div>
          </div>
        ))}
        {thinking && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 10 }}>
            <div style={{ background: sageColors.surface, padding: '14px 16px', borderRadius: '20px 20px 20px 6px', display: 'flex', gap: 4 }}>
              {[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: 3, background: sageColors.inkFaint, animation: `pulse 1.2s ${i*0.15}s infinite` }}/>)}
            </div>
          </div>
        )}
      </div>
      <div style={{ padding: '10px 12px 28px', borderTop: `1px solid ${sageColors.divider}`, display: 'flex', gap: 8, alignItems: 'center', background: sageColors.bg }}>
        <div style={{ flex: 1, background: sageColors.surface, borderRadius: 22, padding: '10px 16px', display: 'flex' }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') send(); }}
            placeholder={`Pergunte ao ${agent.name.split(' ')[0]}…`}
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

Object.assign(window, { SageAgents, SageAgentPaywall, SageAgentBundle, SageAgentChat });
