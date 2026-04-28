// Progress tab — weight chart, stats, measurements, achievements

function SageProgress({ state, onOpen }) {
  const { weight, history, lostKg, toGoalKg, progressPct, user, bmi, achievements } = state;
  const weekChange = history.length >= 2 ? (history[history.length - 1].weight - history[history.length - 2].weight) : 0;
  const bmiLabel = bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Healthy' : bmi < 30 ? 'Overweight' : 'High';
  const weeksToGoal = toGoalKg > 0 && lostKg > 0 ? Math.ceil(toGoalKg / (lostKg / user.weekNumber)) : 0;

  return (
    <div style={{ padding: '62px 20px 24px' }}>
      <div style={{ fontSize: 11, color: sageColors.inkSoft, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 4, fontWeight: 500 }}>Your journey</div>
      <div style={{ fontSize: 28, fontWeight: 500, letterSpacing: -0.6, marginBottom: 20 }}>Progress</div>

      {/* Big weight card */}
      <SageCard style={{ marginBottom: 12, padding: '22px 20px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, marginBottom: 4 }}>
          <div style={{ fontSize: 56, fontWeight: 300, letterSpacing: -2, lineHeight: 1 }}>{weight.toFixed(1)}</div>
          <div style={{ fontSize: 16, color: sageColors.inkSoft, paddingBottom: 8 }}>kg</div>
          <div style={{ flex: 1 }} />
          <div style={{
            padding: '5px 10px',
            background: weekChange <= 0 ? sageColors.sageLight : sageColors.dangerSoft, borderRadius: 999,
            fontSize: 11, fontWeight: 500,
            color: weekChange <= 0 ? sageColors.sageDeep : sageColors.danger,
            marginBottom: 6,
          }}>{weekChange <= 0 ? '−' : '+'}{Math.abs(weekChange).toFixed(1)} kg / wk</div>
        </div>
        <div style={{ fontSize: 13, color: sageColors.inkSoft, marginBottom: 16 }}>Week {user.weekNumber} of your plan</div>
        <WeightChart history={history} stroke={sageColors.sageDeep} fill="rgba(61,188,181,0.08)" dotFill={sageColors.sageDeep} goalLine={user.goalWeight} width={320} height={140} />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontSize: 11, color: sageColors.inkFaint }}>
          {history.filter((_, i) => i % 2 === 0).map((h, i) => <span key={i}>W{h.week}</span>)}
        </div>
      </SageCard>

      {/* Stat tiles */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 12 }}>
        <MetricTile label="Start" value={user.startWeight} unit="kg" />
        <MetricTile label="Lost" value={lostKg.toFixed(1)} unit="kg" highlight />
        <MetricTile label="To go" value={toGoalKg.toFixed(1)} unit="kg" />
      </div>

      <SageButton onClick={() => onOpen({ type: 'weight' })} style={{ marginBottom: 20 }}>Log today's weight</SageButton>

      {/* Projection */}
      <SageCard style={{ marginBottom: 12, padding: '18px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 12, background: sageColors.accentSoft,
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 12,
          }}>{SageIcon.flame(sageColors.accent, 18)}</div>
          <div>
            <div style={{ fontSize: 13, color: sageColors.inkSoft }}>At your current pace</div>
            <div style={{ fontSize: 16, fontWeight: 500 }}>You'll hit {user.goalWeight} kg in ~{weeksToGoal} weeks</div>
          </div>
        </div>
      </SageCard>

      {/* BMI */}
      <SageCard style={{ marginBottom: 12, padding: '18px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 11, color: sageColors.inkSoft, letterSpacing: 0.4, textTransform: 'uppercase', fontWeight: 500 }}>BMI</div>
            <div style={{ fontSize: 24, fontWeight: 500, letterSpacing: -0.5, marginTop: 4, fontVariantNumeric: 'tabular-nums' }}>{bmi.toFixed(1)}</div>
          </div>
          <div style={{
            padding: '5px 12px', background: bmiLabel === 'Healthy' ? sageColors.sageLight : sageColors.accentSoft,
            borderRadius: 999, fontSize: 12, fontWeight: 500,
            color: bmiLabel === 'Healthy' ? sageColors.sageDeep : sageColors.accent,
          }}>{bmiLabel}</div>
        </div>
        <BmiScale bmi={bmi} />
      </SageCard>

      {/* History */}
      <SageSectionHeader>History</SageSectionHeader>
      <SageCard style={{ padding: 0, overflow: 'hidden' }}>
        {[...history].reverse().slice(0, 6).map((h, i, arr) => {
          const prev = history[history.length - 2 - i];
          const delta = prev ? h.weight - prev.weight : 0;
          return (
            <div key={h.week} style={{
              padding: '14px 18px', display: 'flex', alignItems: 'center',
              borderBottom: i < arr.length - 1 ? `1px solid ${sageColors.divider}` : 'none',
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{h.date}</div>
                <div style={{ fontSize: 11, color: sageColors.inkSoft }}>Week {h.week}</div>
              </div>
              <div style={{ fontSize: 16, fontWeight: 500, letterSpacing: -0.3, marginRight: 10, fontVariantNumeric: 'tabular-nums' }}>{h.weight.toFixed(1)} kg</div>
              {prev && <div style={{
                fontSize: 11, padding: '3px 8px', borderRadius: 999,
                background: delta <= 0 ? sageColors.sageLight : sageColors.dangerSoft,
                color: delta <= 0 ? sageColors.sageDeep : sageColors.danger, fontWeight: 500,
              }}>{delta <= 0 ? '−' : '+'}{Math.abs(delta).toFixed(1)}</div>}
            </div>
          );
        })}
      </SageCard>

      {/* Achievements */}
      <SageSectionHeader right={<span style={{ fontSize: 12, color: sageColors.sage, fontWeight: 500 }}>{achievements.filter(a => a.unlocked).length}/{achievements.length}</span>}>Milestones</SageSectionHeader>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {achievements.map(a => (
          <div key={a.id} style={{
            background: a.unlocked ? sageColors.surface : 'transparent',
            border: a.unlocked ? 'none' : `1.5px dashed ${sageColors.divider}`,
            borderRadius: 18, padding: '14px 14px', opacity: a.unlocked ? 1 : 0.55,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: a.unlocked ? sageColors.accentSoft : sageColors.bg,
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8,
            }}>
              {SageIcon[a.icon]?.(a.unlocked ? sageColors.accent : sageColors.inkFaint, 18)}
            </div>
            <div style={{ fontSize: 13, fontWeight: 500, color: sageColors.ink, lineHeight: 1.2 }}>{a.title}</div>
            <div style={{ fontSize: 11, color: sageColors.inkSoft, marginTop: 4, lineHeight: 1.3 }}>{a.desc}</div>
            {a.unlocked && a.date && <div style={{ fontSize: 10, color: sageColors.sage, marginTop: 6, fontWeight: 500 }}>Unlocked {a.date}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

function MetricTile({ label, value, unit, highlight }) {
  return (
    <div style={{
      background: highlight ? sageColors.sage : sageColors.surface,
      color: highlight ? '#fff' : sageColors.ink,
      borderRadius: 18, padding: '14px 14px 16px',
    }}>
      <div style={{ fontSize: 11, opacity: highlight ? 0.7 : 0.6, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 6, fontWeight: 500 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
        <div style={{ fontSize: 22, fontWeight: 500, letterSpacing: -0.5, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
        <div style={{ fontSize: 11, opacity: highlight ? 0.7 : 0.5 }}>{unit}</div>
      </div>
    </div>
  );
}

function BmiScale({ bmi }) {
  const min = 15, max = 40;
  const pct = Math.max(0, Math.min(100, ((bmi - min) / (max - min)) * 100));
  return (
    <div>
      <div style={{ position: 'relative', height: 10, borderRadius: 6, overflow: 'hidden', display: 'flex' }}>
        <div style={{ flex: (18.5 - min) / (max - min), background: '#B3C4D1' }} />
        <div style={{ flex: (25 - 18.5) / (max - min), background: sageColors.sageMid }} />
        <div style={{ flex: (30 - 25) / (max - min), background: sageColors.accent }} />
        <div style={{ flex: (max - 30) / (max - min), background: sageColors.danger }} />
        <div style={{
          position: 'absolute', left: `calc(${pct}% - 5px)`, top: -3, width: 10, height: 16,
          background: '#fff', border: `2px solid ${sageColors.ink}`, borderRadius: 5,
        }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: sageColors.inkFaint, marginTop: 6 }}>
        <span>15</span><span>18.5</span><span>25</span><span>30</span><span>40</span>
      </div>
    </div>
  );
}

Object.assign(window, { SageProgress });
