// Food search overlay (Yazio-style database search) + photo + barcode + custom

function SageFoodSearch({ state, meal, onClose }) {
  const [mode, setMode] = React.useState('search'); // search | photo | barcode | custom | analyzing | confirm
  const [query, setQuery] = React.useState('');
  const [selectedFood, setSelectedFood] = React.useState(null);
  const [desc, setDesc] = React.useState('');
  const [analyzed, setAnalyzed] = React.useState(null);

  const results = query.trim()
    ? state.foodDatabase.filter(f => f.name.toLowerCase().includes(query.toLowerCase()) || f.brand.toLowerCase().includes(query.toLowerCase()))
    : state.foodDatabase.slice(0, 8);

  const pickFood = (f) => setSelectedFood({ ...f, quantity: 1, meal });

  const saveSelected = () => {
    const f = selectedFood;
    state.addFood({
      name: f.name, meal: f.meal || meal,
      kcal: Math.round(f.kcal * f.quantity),
      protein: Math.round(f.protein * f.quantity),
      carbs: Math.round(f.carbs * f.quantity),
      fat: Math.round(f.fat * f.quantity),
      fiber: Math.round((f.fiber || 0) * f.quantity),
      serving: `${f.quantity}× ${f.serving}`,
      hasPhoto: false,
    });
    onClose();
  };

  // Photo mode
  const takePhoto = () => {
    setMode('analyzing');
    setTimeout(() => {
      setAnalyzed({ name: 'Salmon bowl with quinoa', kcal: 520, protein: 34, carbs: 42, fat: 18, fiber: 6, meal, serving: '1 bowl', hasPhoto: true });
      setMode('confirm');
    }, 1500);
  };

  const submitDesc = async () => {
    if (!desc.trim()) return;
    setMode('analyzing');
    const result = await analyzeFoodDescription(desc);
    setAnalyzed({ ...result, meal, hasPhoto: false });
    setMode('confirm');
  };

  const saveAnalyzed = () => {
    state.addFood(analyzed);
    onClose();
  };

  // Header changes by mode
  if (selectedFood) return <FoodDetail food={selectedFood} onChange={setSelectedFood} onBack={() => setSelectedFood(null)} onSave={saveSelected} onClose={onClose} />;

  return (
    <SageFullScreen onClose={onClose} title={`Add to ${meal.toLowerCase()}`}>
      <div style={{ padding: '0 16px 20px' }}>
        {/* Mode tabs */}
        <div style={{ display: 'flex', gap: 6, background: sageColors.surface, borderRadius: 14, padding: 4, marginBottom: 14 }}>
          {[
            { k: 'search', label: 'Search', icon: SageIcon.search },
            { k: 'barcode', label: 'Scan', icon: SageIcon.barcode },
            { k: 'photo', label: 'Photo', icon: SageIcon.camera },
            { k: 'custom', label: 'Describe', icon: null },
          ].map(t => (
            <button key={t.k} onClick={() => setMode(t.k)} style={{
              flex: 1, background: mode === t.k ? sageColors.sage : 'transparent', color: mode === t.k ? '#fff' : sageColors.inkSoft,
              border: 'none', borderRadius: 10, padding: '10px 4px', fontSize: 12, fontWeight: 500, cursor: 'pointer',
              fontFamily: 'inherit', transition: 'all 0.15s',
            }}>{t.label}</button>
          ))}
        </div>

        {mode === 'search' && (
          <>
            <div style={{
              background: sageColors.surface, borderRadius: 16, padding: '12px 16px',
              display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12,
            }}>
              {SageIcon.search(sageColors.inkFaint)}
              <input value={query} onChange={e => setQuery(e.target.value)} autoFocus placeholder="Search foods, brands…"
                style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 15, color: sageColors.ink, fontFamily: 'inherit' }}/>
              {query && <button onClick={() => setQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>{SageIcon.close(sageColors.inkFaint)}</button>}
            </div>
            <div style={{ fontSize: 11, color: sageColors.inkSoft, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 8, paddingLeft: 4, fontWeight: 500 }}>
              {query ? `${results.length} results` : 'Popular foods'}
            </div>
            <div style={{ background: sageColors.surface, borderRadius: 20, overflow: 'hidden' }}>
              {results.map((f, i) => (
                <button key={f.id} onClick={() => pickFood(f)} style={{
                  width: '100%', padding: '13px 16px', display: 'flex', alignItems: 'center', gap: 12,
                  background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
                  borderBottom: i < results.length - 1 ? `1px solid ${sageColors.divider}` : 'none',
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: sageColors.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</div>
                    <div style={{ fontSize: 11, color: sageColors.inkSoft, marginTop: 2 }}>{f.brand} · {f.serving}</div>
                  </div>
                  <div style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                    <div style={{ fontSize: 15, fontWeight: 500, letterSpacing: -0.3 }}>{f.kcal}</div>
                    <div style={{ fontSize: 10, color: sageColors.inkFaint }}>kcal</div>
                  </div>
                  {SageIcon.chevron(sageColors.inkFaint)}
                </button>
              ))}
              {results.length === 0 && (
                <div style={{ padding: '32px 20px', textAlign: 'center', color: sageColors.inkSoft, fontSize: 13 }}>
                  No matches. Try "Describe" to log something custom.
                </div>
              )}
            </div>
          </>
        )}

        {mode === 'barcode' && (
          <div style={{ marginTop: 20, textAlign: 'center' }}>
            <div style={{
              aspectRatio: '1/1', maxWidth: 280, margin: '0 auto 20px',
              background: sageColors.surface, borderRadius: 24, padding: 20,
              display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
            }}>
              <div style={{
                position: 'absolute', inset: 20, border: `2px dashed ${sageColors.sageLight}`, borderRadius: 16,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{ textAlign: 'center', color: sageColors.inkSoft }}>
                  {SageIcon.barcode(sageColors.sageDeep, 48)}
                  <div style={{ fontSize: 13, marginTop: 12 }}>Point at a barcode</div>
                  <div style={{ fontSize: 11, marginTop: 4, color: sageColors.inkFaint }}>Camera preview</div>
                </div>
              </div>
              <div style={{
                position: 'absolute', left: '15%', right: '15%', top: '50%', height: 2,
                background: sageColors.sage, opacity: 0.5,
                animation: 'scanLine 2s ease-in-out infinite',
              }} />
            </div>
            <SageButton onClick={() => { setQuery('greek'); setMode('search'); }} style={{ marginBottom: 8 }}>Simulate scan</SageButton>
            <div style={{ fontSize: 12, color: sageColors.inkSoft, lineHeight: 1.5, maxWidth: 260, margin: '0 auto' }}>
              Hold your camera steady — we'll match it to the database.
            </div>
            <style>{`@keyframes scanLine { 0%, 100% { top: 20%; } 50% { top: 80%; } }`}</style>
          </div>
        )}

        {mode === 'photo' && (
          <div style={{ marginTop: 8 }}>
            <div style={{
              background: sageColors.surface, borderRadius: 24, padding: 20, textAlign: 'center',
            }}>
              <div style={{
                aspectRatio: '1/1', maxWidth: 220, margin: '0 auto 16px',
                borderRadius: 20,
                background: 'repeating-linear-gradient(135deg, #e8ebe5, #e8ebe5 8px, #dde2d8 8px, #dde2d8 16px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{ color: sageColors.sageDeep, textAlign: 'center' }}>
                  {SageIcon.camera(sageColors.sageDeep, 36)}
                  <div style={{ fontSize: 11, marginTop: 8, fontFamily: 'ui-monospace, monospace', color: 'rgba(31,58,46,0.5)' }}>your plate</div>
                </div>
              </div>
              <SageButton onClick={takePhoto}>Snap a photo</SageButton>
              <div style={{ fontSize: 12, color: sageColors.inkSoft, marginTop: 12, lineHeight: 1.5 }}>
                AI estimates calories, macros<br/>and suggests a name.
              </div>
            </div>
          </div>
        )}

        {mode === 'custom' && (
          <div style={{ marginTop: 8 }}>
            <div style={{ fontSize: 13, color: sageColors.inkSoft, marginBottom: 10, paddingLeft: 4 }}>
              Tell Coach what you had — "two eggs, avocado toast, black coffee" — and we'll do the math.
            </div>
            <textarea value={desc} onChange={e => setDesc(e.target.value)} autoFocus placeholder="e.g. Salmon, rice, salad with olive oil"
              style={{
                width: '100%', minHeight: 110, background: sageColors.surface, border: 'none',
                borderRadius: 20, padding: 18, fontSize: 15, lineHeight: 1.4, color: sageColors.ink,
                fontFamily: 'inherit', resize: 'none', outline: 'none', marginBottom: 12, boxSizing: 'border-box',
              }}/>
            <SageButton onClick={submitDesc} disabled={!desc.trim()}>Estimate with Coach</SageButton>
          </div>
        )}

        {mode === 'analyzing' && (
          <div style={{ padding: '60px 20px', textAlign: 'center' }}>
            <div style={{
              width: 60, height: 60, borderRadius: 30, border: `3px solid ${sageColors.sageLight}`,
              borderTopColor: sageColors.sageDeep, margin: '0 auto 20px',
              animation: 'spin 0.8s linear infinite',
            }} />
            <div style={{ fontSize: 15, color: sageColors.inkSoft }}>Reading your plate…</div>
          </div>
        )}

        {mode === 'confirm' && analyzed && (
          <div style={{ marginTop: 8 }}>
            <SageCard>
              <div style={{ fontSize: 11, color: sageColors.inkSoft, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 4 }}>{analyzed.meal}</div>
              <div style={{ fontSize: 18, fontWeight: 500, letterSpacing: -0.3, marginBottom: 16 }}>{analyzed.name}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <MacroTile label="Calories" value={analyzed.kcal} unit="" color={sageColors.ink} bg={sageColors.sageLight} />
                <MacroTile label="Protein" value={analyzed.protein} unit="g" color={sageColors.ink} bg={sageColors.sageLight} />
                <MacroTile label="Carbs" value={analyzed.carbs} unit="g" color={sageColors.ink} bg={sageColors.sageLight} />
                <MacroTile label="Fat" value={analyzed.fat} unit="g" color={sageColors.ink} bg={sageColors.sageLight} />
              </div>
            </SageCard>
            <div style={{ marginTop: 12 }}>
              <SageButton onClick={saveAnalyzed} style={{ marginBottom: 8 }}>Save to {analyzed.meal.toLowerCase()}</SageButton>
              <SageButton variant="ghost" onClick={() => setMode('custom')}>Not quite right — edit</SageButton>
            </div>
          </div>
        )}
      </div>
    </SageFullScreen>
  );
}

function MacroTile({ label, value, unit, color, bg }) {
  return (
    <div style={{ background: bg, borderRadius: 14, padding: '12px 14px' }}>
      <div style={{ fontSize: 11, color: sageColors.inkSoft, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 500, letterSpacing: -0.4, color, fontVariantNumeric: 'tabular-nums' }}>
        {value}<span style={{ fontSize: 12, color: sageColors.inkSoft, fontWeight: 400 }}>{unit}</span>
      </div>
    </div>
  );
}

function FoodDetail({ food, onChange, onBack, onSave, onClose }) {
  const setQty = (n) => onChange({ ...food, quantity: Math.max(0.25, Math.round(n * 4) / 4) });
  const q = food.quantity;
  return (
    <SageFullScreen onClose={onBack} title={food.name}>
      <div style={{ padding: '0 16px 20px' }}>
        <SageCard style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: sageColors.inkSoft, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 4 }}>{food.brand}</div>
          <div style={{ fontSize: 18, fontWeight: 500, letterSpacing: -0.3, marginBottom: 16 }}>{food.name}</div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
            <button onClick={() => setQty(q - 0.25)} style={{
              width: 40, height: 40, borderRadius: 20, background: sageColors.bg, border: 'none',
              fontSize: 22, cursor: 'pointer', color: sageColors.ink, fontFamily: 'inherit',
            }}>−</button>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 500, letterSpacing: -0.8, fontVariantNumeric: 'tabular-nums' }}>{q}×</div>
              <div style={{ fontSize: 12, color: sageColors.inkSoft, marginTop: 2 }}>{food.serving}</div>
            </div>
            <button onClick={() => setQty(q + 0.25)} style={{
              width: 40, height: 40, borderRadius: 20, background: sageColors.sage, border: 'none',
              fontSize: 22, cursor: 'pointer', color: '#fff', fontFamily: 'inherit',
            }}>+</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <MacroTile label="Calories" value={Math.round(food.kcal * q)} unit="" color={sageColors.ink} bg={sageColors.sageLight} />
            <MacroTile label="Protein" value={Math.round(food.protein * q)} unit="g" color={sageColors.ink} bg={sageColors.sageLight} />
            <MacroTile label="Carbs" value={Math.round(food.carbs * q)} unit="g" color={sageColors.ink} bg={sageColors.sageLight} />
            <MacroTile label="Fat" value={Math.round(food.fat * q)} unit="g" color={sageColors.ink} bg={sageColors.sageLight} />
          </div>
        </SageCard>

        <div style={{ fontSize: 11, color: sageColors.inkSoft, letterSpacing: 0.4, textTransform: 'uppercase', margin: '16px 4px 8px', fontWeight: 500 }}>Which meal</div>
        <SageCard style={{ padding: 0, overflow: 'hidden', marginBottom: 18 }}>
          {['Breakfast', 'Lunch', 'Dinner', 'Snack'].map((m, i) => (
            <button key={m} onClick={() => onChange({ ...food, meal: m })} style={{
              width: '100%', padding: '14px 16px', background: (food.meal || '') === m ? sageColors.sageLight : 'transparent',
              border: 'none', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit',
              fontSize: 14, fontWeight: 500, color: sageColors.ink,
              borderBottom: i < 3 ? `1px solid ${sageColors.divider}` : 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              {m}
              {(food.meal || '') === m && <svg width="16" height="16" viewBox="0 0 16 16"><path d="M3 8l3 3 7-7" stroke={sageColors.sageDeep} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            </button>
          ))}
        </SageCard>

        <SageButton onClick={onSave}>Add to diary</SageButton>
      </div>
    </SageFullScreen>
  );
}

// Weight log sheet
function SageLogWeight({ state, onClose }) {
  const [val, setVal] = React.useState(state.weight.toFixed(1));
  const save = () => {
    const n = parseFloat(val);
    if (!isNaN(n) && n > 30 && n < 250) { state.logWeight(n); onClose(); }
  };
  return (
    <SageSheet onClose={onClose} title="Log weight">
      <div style={{ fontSize: 13, color: sageColors.inkSoft, marginBottom: 14 }}>Morning, after the bathroom, before eating.</div>
      <div style={{
        background: sageColors.surface, borderRadius: 20, padding: '28px 20px',
        display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 8, marginBottom: 16,
      }}>
        <input type="number" step="0.1" value={val} onChange={e => setVal(e.target.value)} style={{
          fontSize: 56, fontWeight: 300, letterSpacing: -2, color: sageColors.ink,
          border: 'none', outline: 'none', background: 'transparent',
          width: 160, textAlign: 'right', fontFamily: 'inherit',
        }} />
        <div style={{ fontSize: 18, color: sageColors.inkSoft }}>kg</div>
      </div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        {[-0.5, -0.1, +0.1, +0.5].map(d => (
          <button key={d} onClick={() => setVal((parseFloat(val) + d).toFixed(1))} style={{
            flex: 1, background: sageColors.surface, border: 'none', borderRadius: 14,
            padding: '12px 0', fontSize: 14, fontWeight: 500, color: sageColors.ink,
            cursor: 'pointer', fontFamily: 'inherit',
          }}>{d > 0 ? '+' : ''}{d}</button>
        ))}
      </div>
      <SageButton onClick={save}>Save weight</SageButton>
    </SageSheet>
  );
}

Object.assign(window, { SageFoodSearch, SageLogWeight, MacroTile });
