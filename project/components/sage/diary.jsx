// Diary tab — Yazio-inspired food log with meals, macros, water

function SageDiary({ state, onOpen }) {
  const { user, kcalToday, kcalRemaining, proteinToday, carbsToday, fatToday, water, foodsByMeal } = state;
  const kcalPct = Math.min(100, (kcalToday / user.dailyCalorieGoal) * 100);
  const proteinPct = Math.min(100, (proteinToday / user.proteinGoal) * 100);
  const carbsPct = Math.min(100, (carbsToday / user.carbsGoal) * 100);
  const fatPct = Math.min(100, (fatToday / user.fatGoal) * 100);

  const [dateOffset, setDateOffset] = React.useState(0);
  const dateLabel = dateOffset === 0 ? 'Today' : dateOffset === -1 ? 'Yesterday' : `${Math.abs(dateOffset)} days ago`;

  return (
    <div style={{ padding: '56px 20px 24px' }}>
      {/* Date nav */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <button onClick={() => setDateOffset(d => d - 1)} style={{
          width: 36, height: 36, borderRadius: 18, background: sageColors.surface, border: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        }}>{SageIcon.back(sageColors.ink)}</button>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: sageColors.inkSoft, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 2 }}>Thursday · Apr 23</div>
          <div style={{ fontSize: 22, fontWeight: 500, letterSpacing: -0.5 }}>{dateLabel}</div>
        </div>
        <button onClick={() => dateOffset < 0 && setDateOffset(d => d + 1)} style={{
          width: 36, height: 36, borderRadius: 18, background: dateOffset < 0 ? sageColors.surface : 'transparent', border: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: dateOffset < 0 ? 'pointer' : 'default',
          opacity: dateOffset < 0 ? 1 : 0.3,
        }}>{SageIcon.arrow(sageColors.ink)}</button>
      </div>

      {/* Calorie hero card */}
      <div style={{
        background: sageColors.surface, borderRadius: 28, padding: '22px 20px',
        marginBottom: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <TripleRing
            kcalPct={kcalPct} proteinPct={proteinPct} carbsPct={carbsPct} fatPct={fatPct}
            size={140}
          >
            <div style={{ fontSize: 28, fontWeight: 500, letterSpacing: -0.8, color: sageColors.ink }}>{kcalRemaining}</div>
            <div style={{ fontSize: 10, color: sageColors.inkSoft, letterSpacing: 0.4, textTransform: 'uppercase' }}>kcal left</div>
          </TripleRing>
          <div style={{ flex: 1, fontSize: 12 }}>
            <KcalRow label="Goal" value={user.dailyCalorieGoal} color={sageColors.inkSoft} />
            <KcalRow label="Food" value={kcalToday} color={sageColors.sageDeep} />
            <KcalRow label="Left" value={kcalRemaining} color={sageColors.accent} bold />
          </div>
        </div>

        {/* Macros bars */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginTop: 18, paddingTop: 16, borderTop: `1px solid ${sageColors.divider}` }}>
          <MacroBar label="Protein" val={proteinToday} goal={user.proteinGoal} color={sageColors.protein} />
          <MacroBar label="Carbs" val={carbsToday} goal={user.carbsGoal} color={sageColors.carbs} />
          <MacroBar label="Fat" val={fatToday} goal={user.fatGoal} color={sageColors.fat} />
        </div>
      </div>

      {/* Water tracker */}
      <SageCard style={{ marginBottom: 12, padding: '16px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 12, background: sageColors.waterSoft,
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 12,
          }}>{SageIcon.water(sageColors.water, 18)}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 500 }}>Water</div>
            <div style={{ fontSize: 12, color: sageColors.inkSoft }}>{water} of {user.waterGoal} glasses</div>
          </div>
          <button onClick={state.removeWater} style={{
            width: 32, height: 32, borderRadius: 16, background: sageColors.bg, border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            fontSize: 18, color: sageColors.ink, fontFamily: 'inherit',
          }}>−</button>
          <button onClick={state.addWater} style={{
            width: 32, height: 32, borderRadius: 16, background: sageColors.water, border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginLeft: 6,
            fontSize: 18, color: '#fff', fontFamily: 'inherit',
          }}>+</button>
        </div>
        <div style={{ display: 'flex', gap: 5 }}>
          {[...Array(user.waterGoal)].map((_, i) => (
            <div key={i} style={{
              flex: 1, height: 28, borderRadius: 6,
              background: i < water ? sageColors.water : sageColors.waterSoft,
              transition: 'background 0.3s',
            }} />
          ))}
        </div>
      </SageCard>

      {/* Meals */}
      {['Breakfast', 'Lunch', 'Dinner', 'Snack'].map(meal => (
        <MealSection key={meal} meal={meal} foods={foodsByMeal(meal)} onAdd={() => onOpen({ type: 'search', meal })} onRemove={state.removeFood} />
      ))}

      {/* Quick add row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 16 }}>
        <QuickAction label="Scan barcode" icon={SageIcon.barcode(sageColors.sageDeep)} onClick={() => onOpen({ type: 'barcode' })} />
        <QuickAction label="Photo meal" icon={SageIcon.camera(sageColors.sageDeep)} onClick={() => onOpen({ type: 'photo' })} />
      </div>
    </div>
  );
}

function KcalRow({ label, value, color, bold }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
      <span style={{ color: sageColors.inkSoft }}>{label}</span>
      <span style={{ color, fontWeight: bold ? 600 : 500, fontVariantNumeric: 'tabular-nums' }}>{value}</span>
    </div>
  );
}

function MacroBar({ label, val, goal, color }) {
  const pct = Math.min(100, (val / goal) * 100);
  return (
    <div>
      <div style={{ fontSize: 11, color: sageColors.inkSoft, marginBottom: 6, letterSpacing: 0.3 }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 6, letterSpacing: -0.2 }}>
        <span>{Math.round(val)}</span>
        <span style={{ color: sageColors.inkFaint, fontSize: 11, fontWeight: 400 }}> / {goal}g</span>
      </div>
      <div style={{ height: 4, background: sageColors.divider, borderRadius: 999, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 999, transition: 'width 0.5s' }} />
      </div>
    </div>
  );
}

function MealSection({ meal, foods, onAdd, onRemove }) {
  const mealIcons = {
    Breakfast: '🌅', Lunch: '🥗', Dinner: '🍽', Snack: '🍎',
  };
  const mealTime = {
    Breakfast: '6am – 10am', Lunch: '12pm – 2pm', Dinner: '6pm – 9pm', Snack: 'Anytime',
  };
  const total = foods.reduce((s, f) => s + f.kcal, 0);

  return (
    <div style={{ marginTop: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', margin: '4px 4px 8px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 500, color: sageColors.ink }}>{meal}</div>
          <div style={{ fontSize: 11, color: sageColors.inkFaint, marginTop: 1 }}>{mealTime[meal]}</div>
        </div>
        <div style={{ fontSize: 13, color: sageColors.inkSoft, fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>{total} <span style={{ fontSize: 11, color: sageColors.inkFaint, fontWeight: 400 }}>kcal</span></div>
      </div>

      <div style={{ background: sageColors.surface, borderRadius: 20, overflow: 'hidden' }}>
        {foods.map((f, i) => (
          <FoodRow key={f.id} food={f} onRemove={() => onRemove(f.id)} isLast={i === foods.length - 1 && foods.length > 0} />
        ))}
        <button onClick={onAdd} style={{
          width: '100%', padding: '14px 16px', background: 'transparent', border: 'none',
          display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', fontFamily: 'inherit',
          borderTop: foods.length > 0 ? `1px solid ${sageColors.divider}` : 'none',
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 12, background: sageColors.sageLight,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{SageIcon.plus(sageColors.sageDeep, 14)}</div>
          <div style={{ fontSize: 14, color: sageColors.sageDeep, fontWeight: 500 }}>Add {meal.toLowerCase()}</div>
        </button>
      </div>
    </div>
  );
}

function FoodRow({ food, onRemove, isLast }) {
  const [swiped, setSwiped] = React.useState(false);
  return (
    <div style={{ position: 'relative', overflow: 'hidden', borderBottom: !isLast ? `1px solid ${sageColors.divider}` : 'none' }}>
      <div style={{
        padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12,
        transition: 'transform 0.2s', transform: swiped ? 'translateX(-68px)' : 'translateX(0)',
      }} onClick={() => setSwiped(s => !s)}>
        {food.hasPhoto
          ? <FoodPhotoPlaceholder w={44} h={44} radius={12} label="photo" />
          : <div style={{
              width: 44, height: 44, borderRadius: 12, background: sageColors.sageLight,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="20" height="20" viewBox="0 0 22 22" fill="none"><path d="M11 2v18M4 6c0 4 3 7 7 7M18 6c0 4-3 7-7 7" stroke={sageColors.sageDeep} strokeWidth="1.5" strokeLinecap="round"/></svg>
            </div>}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{food.name}</div>
          <div style={{ fontSize: 11, color: sageColors.inkSoft, marginTop: 2, display: 'flex', gap: 6 }}>
            <span>{food.serving || food.time}</span>
            <span style={{ color: sageColors.inkFaint }}>·</span>
            <span>P {food.protein || 0}g</span>
            <span style={{ color: sageColors.inkFaint }}>·</span>
            <span>C {food.carbs || 0}g</span>
            <span style={{ color: sageColors.inkFaint }}>·</span>
            <span>F {food.fat || 0}g</span>
          </div>
        </div>
        <div style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
          <div style={{ fontSize: 16, fontWeight: 500, letterSpacing: -0.3 }}>{food.kcal}</div>
          <div style={{ fontSize: 10, color: sageColors.inkFaint }}>kcal</div>
        </div>
      </div>
      <button onClick={(e) => { e.stopPropagation(); onRemove(); }} style={{
        position: 'absolute', top: 0, right: 0, bottom: 0, width: 60,
        background: sageColors.danger, color: '#fff', border: 'none', cursor: 'pointer',
        fontSize: 12, fontWeight: 500, fontFamily: 'inherit',
        transform: swiped ? 'translateX(0)' : 'translateX(100%)', transition: 'transform 0.2s',
      }}>Remove</button>
    </div>
  );
}

function QuickAction({ label, icon, onClick }) {
  return (
    <button onClick={onClick} style={{
      background: sageColors.surface, border: 'none', borderRadius: 18,
      padding: '16px 14px', display: 'flex', alignItems: 'center', gap: 10,
      cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10, background: sageColors.sageLight,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>{icon}</div>
      <div style={{ fontSize: 13, fontWeight: 500, color: sageColors.ink }}>{label}</div>
    </button>
  );
}

Object.assign(window, { SageDiary });
