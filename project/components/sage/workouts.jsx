// Workouts (Treinos) tab — daily plan with check-in / check-out tick system
// Plans come from AI trainer agent or human coach. User ticks exercises as they go.

function SageWorkouts({ state, onOpen }) {
  const { todayWorkout, weeklyWorkouts, workoutStats, toggleExerciseDone, startWorkout, finishWorkout } = state;

  // No active plan → onboarding state
  if (!todayWorkout) {
    return <WorkoutsEmpty onGenerate={() => onOpen({ type: 'generate-plan' })} />;
  }

  const completedCount = todayWorkout.exercises.filter(e => e.done).length;
  const totalCount = todayWorkout.exercises.length;
  const pct = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);
  const isComplete = completedCount === totalCount;
  const isStarted = todayWorkout.startedAt != null;

  return (
    <div style={{ padding: '62px 20px 24px' }}>
      {/* Header */}
      <div style={{ fontSize: 11, color: sageColors.inkSoft, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 4, fontWeight: 500 }}>Treinos · Hoje</div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 18 }}>
        <div style={{ fontSize: 28, fontWeight: 500, letterSpacing: -0.6 }}>{todayWorkout.title}</div>
        <button onClick={() => onOpen({ type: 'workout-history' })} style={{
          background: sageColors.surface, border: 'none', borderRadius: 999, padding: '6px 12px',
          fontSize: 11, color: sageColors.inkSoft, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
        }}>Histórico</button>
      </div>

      {/* Hero — today's plan */}
      <TodayPlanHero
        workout={todayWorkout}
        pct={pct}
        completedCount={completedCount}
        totalCount={totalCount}
        isStarted={isStarted}
        isComplete={isComplete}
        onStart={startWorkout}
        onFinish={() => onOpen({ type: 'workout-complete' })}
      />

      {/* Week strip */}
      <SageSectionHeader>Esta semana</SageSectionHeader>
      <WeekStrip workouts={weeklyWorkouts} />

      {/* Exercises checklist */}
      <SageSectionHeader right={<span style={{ fontSize: 12, color: sageColors.inkSoft, fontVariantNumeric: 'tabular-nums' }}>{completedCount}/{totalCount}</span>}>
        Exercícios
      </SageSectionHeader>

      <SageCard style={{ padding: 0, overflow: 'hidden' }}>
        {todayWorkout.exercises.map((ex, i) => (
          <ExerciseRow
            key={ex.id}
            exercise={ex}
            isLast={i === todayWorkout.exercises.length - 1}
            onToggle={() => toggleExerciseDone(ex.id)}
            onOpen={() => onOpen({ type: 'exercise', exercise: ex })}
            disabled={!isStarted}
          />
        ))}
      </SageCard>

      {/* Stats footer */}
      <SageSectionHeader>Sua jornada</SageSectionHeader>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
        <StatTile label="Streak" value={`${workoutStats.streak}`} unit="dias" accent />
        <StatTile label="Esta sem." value={`${workoutStats.weekDone}/${workoutStats.weekTarget}`} unit="treinos" />
        <StatTile label="Calorias" value={`${workoutStats.kcalWeek}`} unit="kcal" />
      </div>

      {/* Plan source — AI / coach */}
      <PlanSourceCard source={todayWorkout.source} onOpen={() => onOpen({ type: 'generate-plan' })} />
    </div>
  );
}

// ─────────── Hero card with progress ring + CTA ───────────
function TodayPlanHero({ workout, pct, completedCount, totalCount, isStarted, isComplete, onStart, onFinish }) {
  return (
    <div style={{
      borderRadius: 28, marginBottom: 6, padding: '20px 20px 18px', position: 'relative', overflow: 'hidden',
      background: isComplete
        ? `linear-gradient(135deg, ${sageColors.gradientFrom}, ${sageColors.gradientTo})`
        : sageColors.surface,
      border: isComplete ? 'none' : `1px solid ${sageColors.divider}`,
    }}>
      {/* Decorative blobs when complete */}
      {isComplete && (
        <>
          <div style={{ position: 'absolute', right: -30, top: -30, width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
          <div style={{ position: 'absolute', right: 50, bottom: -40, width: 90, height: 90, borderRadius: '50%', background: 'rgba(212,184,114,0.22)' }} />
        </>
      )}

      <div style={{ position: 'relative', display: 'flex', gap: 16, alignItems: 'center' }}>
        {/* Ring */}
        <Ring
          pct={pct}
          size={92}
          stroke={7}
          color={isComplete ? '#fff' : sageColors.sage}
          bg={isComplete ? 'rgba(255,255,255,0.18)' : sageColors.divider}
        >
          <div style={{ fontSize: 22, fontWeight: 500, color: isComplete ? '#fff' : sageColors.ink, letterSpacing: -0.4, lineHeight: 1 }}>{pct}%</div>
          <div style={{ fontSize: 9, color: isComplete ? 'rgba(255,255,255,0.75)' : sageColors.inkSoft, letterSpacing: 0.4, marginTop: 3, textTransform: 'uppercase' }}>{completedCount}/{totalCount}</div>
        </Ring>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <div style={{
              padding: '3px 8px', borderRadius: 999, fontSize: 10, fontWeight: 500, letterSpacing: 0.3,
              background: isComplete ? 'rgba(255,255,255,0.18)' : sageColors.sageLight,
              color: isComplete ? '#fff' : sageColors.sageDeep,
            }}>{workout.tag}</div>
            <div style={{ fontSize: 11, color: isComplete ? 'rgba(255,255,255,0.7)' : sageColors.inkSoft }}>{workout.duration} min · {workout.kcalEst} kcal</div>
          </div>
          <div style={{ fontSize: 17, fontWeight: 500, letterSpacing: -0.3, color: isComplete ? '#fff' : sageColors.ink, lineHeight: 1.2, marginBottom: 4 }}>
            {workout.subtitle}
          </div>
          <div style={{ fontSize: 12, color: isComplete ? 'rgba(255,255,255,0.75)' : sageColors.inkSoft, lineHeight: 1.4 }}>
            {workout.focus.join(' · ')}
          </div>
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={isComplete ? onFinish : (isStarted ? null : onStart)}
        style={{
          marginTop: 16, width: '100%', border: 'none', borderRadius: 16, padding: '13px 0',
          fontSize: 14, fontWeight: 500, cursor: isStarted && !isComplete ? 'default' : 'pointer', fontFamily: 'inherit',
          background: isComplete
            ? sageColors.accent
            : (isStarted ? 'rgba(61,188,181,0.18)' : `linear-gradient(135deg, ${sageColors.gradientFrom}, ${sageColors.gradientTo})`),
          color: '#fff',
          boxShadow: isComplete || !isStarted ? '0 4px 14px rgba(61,188,181,0.25)' : 'none',
        }}>
        {isComplete ? '✓ Finalizar treino' : (isStarted ? `Em andamento · ${completedCount}/${totalCount} feito` : '▶ Iniciar sessão')}
      </button>
    </div>
  );
}

// ─────────── Week strip ───────────
function WeekStrip({ workouts }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6,
      background: sageColors.surface, borderRadius: 20, padding: 10,
    }}>
      {workouts.map((d) => {
        const isToday = d.isToday;
        const status = d.status; // 'done' | 'partial' | 'today' | 'rest' | 'planned' | 'missed'
        const bg = status === 'done' ? sageColors.sage
          : status === 'today' ? sageColors.accent
          : status === 'partial' ? sageColors.sageLight
          : status === 'missed' ? sageColors.dangerSoft
          : 'transparent';
        const fg = status === 'done' || status === 'today' ? '#fff'
          : status === 'partial' ? sageColors.sageDeep
          : status === 'missed' ? sageColors.danger
          : sageColors.inkSoft;
        const border = status === 'planned' ? `1px dashed ${sageColors.divider}` : 'none';
        return (
          <div key={d.day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{ fontSize: 10, color: isToday ? sageColors.accent : sageColors.inkSoft, fontWeight: isToday ? 600 : 500, letterSpacing: 0.3, textTransform: 'uppercase' }}>{d.day}</div>
            <div style={{
              width: 32, height: 32, borderRadius: 11, background: bg, border,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 500, color: fg,
            }}>
              {status === 'done' ? '✓'
                : status === 'rest' ? '·'
                : status === 'missed' ? '×'
                : d.dayNum}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─────────── Exercise row with tick ───────────
function ExerciseRow({ exercise, isLast, onToggle, onOpen, disabled }) {
  const ex = exercise;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
      borderBottom: isLast ? 'none' : `1px solid ${sageColors.divider}`,
      opacity: disabled ? 0.55 : 1,
    }}>
      {/* Check tick */}
      <button
        onClick={(e) => { e.stopPropagation(); if (!disabled) onToggle(); }}
        disabled={disabled}
        aria-label={ex.done ? 'Desmarcar' : 'Concluir'}
        style={{
          width: 28, height: 28, borderRadius: 14, flexShrink: 0,
          border: ex.done ? 'none' : `2px solid ${disabled ? sageColors.divider : sageColors.inkFaint}`,
          background: ex.done ? sageColors.sage : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: disabled ? 'default' : 'pointer', padding: 0, transition: 'all 0.18s',
          boxShadow: ex.done ? '0 2px 8px rgba(61,188,181,0.4)' : 'none',
        }}>
        {ex.done && (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2.5 7.2L5.5 10l6-6.5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>

      {/* Body — clickable to open detail */}
      <button onClick={onOpen} style={{
        flex: 1, background: 'transparent', border: 'none', display: 'flex', alignItems: 'center', gap: 12,
        cursor: 'pointer', textAlign: 'left', padding: 0, fontFamily: 'inherit', minWidth: 0,
      }}>
        <ExercisePlaceholder size={48} icon={ex.icon} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 14, fontWeight: 500, color: sageColors.ink,
            textDecoration: ex.done ? 'line-through' : 'none',
            textDecorationColor: 'rgba(240,245,250,0.4)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>{ex.name}</div>
          <div style={{ fontSize: 11, color: sageColors.inkSoft, marginTop: 2, fontVariantNumeric: 'tabular-nums' }}>
            {ex.meta}
          </div>
        </div>
        {SageIcon.chevron(sageColors.inkFaint)}
      </button>
    </div>
  );
}

// Exercise photo placeholder — simple striped tile with monospace label
function ExercisePlaceholder({ size = 48, icon }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: 12, flexShrink: 0,
      background: 'repeating-linear-gradient(135deg, rgba(61,188,181,0.10), rgba(61,188,181,0.10) 5px, rgba(61,188,181,0.04) 5px, rgba(61,188,181,0.04) 10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 18,
    }}>{icon || '◐'}</div>
  );
}

// ─────────── Stat tile ───────────
function StatTile({ label, value, unit, accent }) {
  return (
    <div style={{
      background: accent ? sageColors.accentSoft : sageColors.surface,
      borderRadius: 16, padding: '12px 10px', textAlign: 'center',
    }}>
      <div style={{ fontSize: 10, color: sageColors.inkSoft, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 4, fontWeight: 500 }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 500, letterSpacing: -0.3, color: accent ? sageColors.accent : sageColors.ink, fontVariantNumeric: 'tabular-nums', lineHeight: 1.05 }}>{value}</div>
      <div style={{ fontSize: 10, color: sageColors.inkFaint, marginTop: 2 }}>{unit}</div>
    </div>
  );
}

// ─────────── Plan source card (AI or human coach) ───────────
function PlanSourceCard({ source, onOpen }) {
  const isAI = source.type === 'ai';
  return (
    <button onClick={onOpen} style={{
      width: '100%', marginTop: 16, padding: '14px 16px', borderRadius: 20,
      background: sageColors.bgSoft, border: `1px solid ${sageColors.divider}`,
      display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
    }}>
      <div style={{
        width: 38, height: 38, borderRadius: 12, flexShrink: 0,
        background: isAI ? sageColors.sageLight : sageColors.accentSoft,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {isAI ? (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 2v3M9 13v3M2 9h3M13 9h3M4 4l2 2M12 12l2 2M14 4l-2 2M4 14l2-2" stroke={sageColors.sageDeep} strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="9" cy="9" r="3" stroke={sageColors.sageDeep} strokeWidth="1.5"/>
          </svg>
        ) : (
          <div style={{ fontSize: 12, fontWeight: 500, color: sageColors.accent }}>{source.initials}</div>
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: sageColors.ink }}>{source.label}</div>
        <div style={{ fontSize: 11, color: sageColors.inkSoft, marginTop: 1 }}>{source.sublabel}</div>
      </div>
      <div style={{
        padding: '4px 10px', borderRadius: 999, fontSize: 11, fontWeight: 500,
        background: sageColors.sageLight, color: sageColors.sageDeep,
      }}>Ajustar</div>
    </button>
  );
}

// ─────────── Empty state — no plan yet ───────────
function WorkoutsEmpty({ onGenerate }) {
  return (
    <div style={{ padding: '62px 24px 24px', textAlign: 'center' }}>
      <div style={{
        width: 96, height: 96, margin: '40px auto 24px', borderRadius: '50%',
        background: `linear-gradient(135deg, ${sageColors.sageLight}, ${sageColors.accentSoft})`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
          <path d="M14 18v8M30 18v8M10 22h4M30 22h4M14 18h16M14 26h16" stroke={sageColors.sage} strokeWidth="2.4" strokeLinecap="round"/>
        </svg>
      </div>
      <div style={{ fontFamily: '"Fraunces", serif', fontSize: 28, letterSpacing: -0.8, color: sageColors.ink, marginBottom: 10, lineHeight: 1.1, fontWeight: 400 }}>
        Vamos montar seu <span style={{ fontStyle: 'italic', color: sageColors.sage }}>plano</span>.
      </div>
      <div style={{ fontSize: 14, color: sageColors.inkSoft, lineHeight: 1.5, marginBottom: 28, maxWidth: 300, margin: '0 auto 28px' }}>
        Seu agente de treino AI cria um programa semanal — ou conecte um coach humano através do vytal.com.
      </div>
      <SageButton onClick={onGenerate} style={{ marginBottom: 10 }}>Gerar plano com AI</SageButton>
      <SageButton variant="secondary" onClick={() => {}}>Conectar coach humano</SageButton>
    </div>
  );
}

// ─────────── Exercise detail overlay ───────────
function SageExerciseDetail({ exercise, state, onClose }) {
  const [setsLogged, setSetsLogged] = React.useState(exercise.setsLogged || Array(exercise.sets).fill(false));
  const allDone = setsLogged.every(Boolean);

  const toggleSet = (i) => {
    const next = [...setsLogged]; next[i] = !next[i]; setSetsLogged(next);
  };

  const finish = () => {
    state.toggleExerciseDone(exercise.id, true);
    onClose();
  };

  return (
    <SageFullScreen onClose={onClose} title={exercise.name}>
      <div style={{ padding: '0 20px 32px' }}>
        {/* Hero photo placeholder */}
        <div style={{
          height: 200, borderRadius: 24, marginBottom: 16, position: 'relative', overflow: 'hidden',
          background: 'repeating-linear-gradient(135deg, rgba(61,188,181,0.14), rgba(61,188,181,0.14) 8px, rgba(61,188,181,0.06) 8px, rgba(61,188,181,0.06) 16px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ fontSize: 72 }}>{exercise.icon || '◐'}</div>
          <div style={{
            position: 'absolute', top: 12, right: 12, padding: '6px 10px',
            background: 'rgba(10,27,46,0.7)', borderRadius: 999, fontSize: 11, color: sageColors.ink, fontWeight: 500,
          }}>vídeo · 0:42</div>
        </div>

        {/* Meta chips */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          {[
            { label: 'Séries', value: exercise.sets },
            { label: 'Reps', value: exercise.reps },
            { label: 'Descanso', value: exercise.rest },
            { label: 'Carga', value: exercise.load || '—' },
          ].map(c => (
            <div key={c.label} style={{
              background: sageColors.surface, borderRadius: 14, padding: '10px 12px', minWidth: 76,
            }}>
              <div style={{ fontSize: 10, color: sageColors.inkSoft, letterSpacing: 0.3, textTransform: 'uppercase', marginBottom: 2 }}>{c.label}</div>
              <div style={{ fontSize: 15, fontWeight: 500, color: sageColors.ink, fontVariantNumeric: 'tabular-nums' }}>{c.value}</div>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 13, color: sageColors.inkSoft, lineHeight: 1.5, marginBottom: 18 }}>
          {exercise.notes}
        </div>

        {/* Set checklist */}
        <SageSectionHeader>Marque cada série</SageSectionHeader>
        <SageCard style={{ padding: 0, overflow: 'hidden', marginBottom: 18 }}>
          {Array.from({ length: exercise.sets }).map((_, i) => (
            <button key={i} onClick={() => toggleSet(i)} style={{
              width: '100%', padding: '14px 16px', background: 'transparent', border: 'none',
              display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
              borderBottom: i === exercise.sets - 1 ? 'none' : `1px solid ${sageColors.divider}`,
            }}>
              <div style={{
                width: 26, height: 26, borderRadius: 13, flexShrink: 0,
                border: setsLogged[i] ? 'none' : `2px solid ${sageColors.inkFaint}`,
                background: setsLogged[i] ? sageColors.sage : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {setsLogged[i] && (
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                    <path d="M2.5 7.2L5.5 10l6-6.5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <div style={{ flex: 1, fontSize: 14, fontWeight: 500, color: sageColors.ink }}>Série {i + 1}</div>
              <div style={{ fontSize: 12, color: sageColors.inkSoft, fontVariantNumeric: 'tabular-nums' }}>
                {exercise.reps} reps · {exercise.load || 'corpo'}
              </div>
            </button>
          ))}
        </SageCard>

        <SageButton onClick={finish} disabled={!allDone}>
          {allDone ? 'Concluir exercício' : `Marque ${setsLogged.filter(s => !s).length} série${setsLogged.filter(s => !s).length > 1 ? 's' : ''}`}
        </SageButton>
      </div>
    </SageFullScreen>
  );
}

// ─────────── Generate plan overlay (AI trainer brief) ───────────
function SageGeneratePlan({ state, onClose }) {
  const [step, setStep] = React.useState('brief'); // brief | generating | done
  const [goal, setGoal] = React.useState('Tonificar e ganhar força');
  const [days, setDays] = React.useState(4);
  const [time, setTime] = React.useState(45);

  const generate = async () => {
    setStep('generating');
    setTimeout(() => setStep('done'), 1800);
  };

  if (step === 'generating') {
    return (
      <SageFullScreen onClose={onClose} title="Gerando plano">
        <div style={{ padding: '60px 24px', textAlign: 'center' }}>
          <div style={{
            width: 64, height: 64, margin: '0 auto 24px', borderRadius: '50%',
            border: `3px solid ${sageColors.divider}`, borderTopColor: sageColors.sage,
            animation: 'spin 1s linear infinite',
          }}/>
          <div style={{ fontSize: 18, fontWeight: 500, marginBottom: 8 }}>Trainer AI está montando…</div>
          <div style={{ fontSize: 13, color: sageColors.inkSoft, lineHeight: 1.5 }}>
            Considerando seu peso atual ({state.weight.toFixed(1)} kg), uso de Wegovy e energia disponível.
          </div>
        </div>
      </SageFullScreen>
    );
  }

  if (step === 'done') {
    return (
      <SageFullScreen onClose={onClose} title="Plano pronto">
        <div style={{ padding: '20px 20px 40px' }}>
          <div style={{
            background: `linear-gradient(135deg, ${sageColors.gradientFrom}, ${sageColors.gradientTo})`,
            borderRadius: 24, padding: 20, color: '#fff', marginBottom: 20,
          }}>
            <div style={{ fontSize: 11, letterSpacing: 0.4, opacity: 0.8, textTransform: 'uppercase', marginBottom: 6 }}>Plano semanal · 4 semanas</div>
            <div style={{ fontSize: 22, fontWeight: 500, letterSpacing: -0.4, marginBottom: 6 }}>Força progressiva · {days}× / sem</div>
            <div style={{ fontSize: 13, opacity: 0.85, lineHeight: 1.5 }}>
              Foco em força funcional com séries curtas e descansos generosos — adaptado para sua fase com GLP-1.
            </div>
          </div>

          <SageSectionHeader>O que vem por aí</SageSectionHeader>
          {[
            { d: 'Seg', t: 'Membros inferiores · força', m: '6 exercícios · 45 min' },
            { d: 'Ter', t: 'Mobilidade & core', m: '5 exercícios · 30 min' },
            { d: 'Qui', t: 'Membros superiores · força', m: '6 exercícios · 45 min' },
            { d: 'Sáb', t: 'Cardio leve + alongamento', m: '4 exercícios · 35 min' },
          ].slice(0, days).map((p, i) => (
            <div key={i} style={{
              padding: '12px 14px', background: sageColors.surface, borderRadius: 16, marginBottom: 8,
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <div style={{ width: 36, height: 36, borderRadius: 18, background: sageColors.sageLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: sageColors.sageDeep, fontWeight: 600 }}>{p.d}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{p.t}</div>
                <div style={{ fontSize: 11, color: sageColors.inkSoft, marginTop: 2 }}>{p.m}</div>
              </div>
            </div>
          ))}

          <SageButton onClick={onClose} style={{ marginTop: 16 }}>Aceitar plano</SageButton>
          <SageButton variant="ghost" onClick={() => setStep('brief')} style={{ marginTop: 4 }}>Refazer</SageButton>
        </div>
      </SageFullScreen>
    );
  }

  return (
    <SageFullScreen onClose={onClose} title="Novo plano de treino">
      <div style={{ padding: '8px 20px 40px' }}>
        <div style={{ fontSize: 13, color: sageColors.inkSoft, lineHeight: 1.5, marginBottom: 20 }}>
          Conte ao trainer AI o que você quer alcançar — ele vai montar um plano semanal adaptado à sua jornada GLP-1.
        </div>

        <SageSectionHeader>Meu objetivo</SageSectionHeader>
        {['Tonificar e ganhar força', 'Perder gordura sem perder músculo', 'Mobilidade e bem-estar', 'Voltar a se mover'].map(g => (
          <button key={g} onClick={() => setGoal(g)} style={{
            width: '100%', padding: '14px 16px', borderRadius: 16, marginBottom: 8,
            background: goal === g ? sageColors.sageLight : sageColors.surface,
            border: goal === g ? `1px solid ${sageColors.sage}` : `1px solid ${sageColors.divider}`,
            color: sageColors.ink, fontSize: 14, fontWeight: 500, textAlign: 'left',
            cursor: 'pointer', fontFamily: 'inherit',
          }}>{g}</button>
        ))}

        <SageSectionHeader>Frequência semanal</SageSectionHeader>
        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          {[2, 3, 4, 5, 6].map(n => (
            <button key={n} onClick={() => setDays(n)} style={{
              flex: 1, padding: '14px 0', borderRadius: 14,
              background: days === n ? sageColors.sage : sageColors.surface,
              color: days === n ? '#fff' : sageColors.ink, border: 'none',
              fontSize: 15, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
            }}>{n}×</button>
          ))}
        </div>

        <SageSectionHeader>Duração da sessão</SageSectionHeader>
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {[20, 30, 45, 60].map(n => (
            <button key={n} onClick={() => setTime(n)} style={{
              flex: 1, padding: '14px 0', borderRadius: 14,
              background: time === n ? sageColors.sage : sageColors.surface,
              color: time === n ? '#fff' : sageColors.ink, border: 'none',
              fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
            }}>{n}min</button>
          ))}
        </div>

        <SageButton onClick={generate}>Gerar plano com AI</SageButton>
      </div>
    </SageFullScreen>
  );
}

// ─────────── Workout complete celebration ───────────
function SageWorkoutComplete({ state, onClose }) {
  const w = state.todayWorkout;
  return (
    <SageFullScreen onClose={onClose} title="Treino concluído">
      <div style={{ padding: '20px 20px 40px', textAlign: 'center' }}>
        <div style={{
          width: 120, height: 120, margin: '24px auto 24px', borderRadius: '50%',
          background: `linear-gradient(135deg, ${sageColors.gradientFrom}, ${sageColors.gradientTo})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 12px 40px rgba(61,188,181,0.4)',
        }}>
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
            <path d="M14 30l12 12 22-24" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div style={{ fontFamily: '"Fraunces", serif', fontSize: 32, letterSpacing: -0.8, color: sageColors.ink, marginBottom: 8, lineHeight: 1.1, fontWeight: 400 }}>
          Mais um dia <span style={{ fontStyle: 'italic', color: sageColors.sage }}>completo</span>.
        </div>
        <div style={{ fontSize: 14, color: sageColors.inkSoft, lineHeight: 1.5, marginBottom: 28, maxWidth: 280, margin: '0 auto 28px' }}>
          {w.exercises.length} exercícios · {w.duration} min · ~{w.kcalEst} kcal queimadas.
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 24 }}>
          <StatTile label="Exercícios" value={w.exercises.length} unit="todos" accent />
          <StatTile label="Tempo" value={w.duration} unit="min" />
          <StatTile label="Streak" value={state.workoutStats.streak + 1} unit="dias" />
        </div>

        <SageButton onClick={onClose}>Voltar</SageButton>
      </div>
    </SageFullScreen>
  );
}

Object.assign(window, { SageWorkouts, SageExerciseDetail, SageGeneratePlan, SageWorkoutComplete });
