// Care tab — orders (deliveries) + teleconsultations + prescriptions
// All data comes from the vytal.com website account. Read-only in the app.

// ────────────────── Main tab ──────────────────
function SageCare({ state, onOpen }) {
  if (!state.webConnected) return <SageCareDisconnected onConnect={state.connectWeb} />;

  const { orders, consultations, prescriptions } = state;
  const activeOrder = orders.find(o => o.status !== 'delivered' && o.status !== 'cancelled');
  const pastOrders = orders.filter(o => o.status === 'delivered' || o.status === 'cancelled');
  const nextConsult = consultations.find(c => c.status === 'upcoming');
  const pastConsults = consultations.filter(c => c.status === 'completed');

  return (
    <div style={{ padding: '62px 20px 24px' }}>
      {/* Header */}
      <div style={{ fontSize: 11, color: sageColors.inkSoft, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 4, fontWeight: 500 }}>From vytal.com</div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 18 }}>
        <div style={{ fontSize: 28, fontWeight: 500, letterSpacing: -0.6 }}>Care</div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '5px 10px', background: sageColors.sageLight, borderRadius: 999,
          fontSize: 11, color: sageColors.sageDeep, fontWeight: 500,
        }}>
          <div style={{ width: 6, height: 6, borderRadius: 3, background: sageColors.sageDeep }} />
          Synced
        </div>
      </div>

      {/* Next consultation — hero */}
      {nextConsult && <NextConsultCard consult={nextConsult} onOpen={onOpen} />}

      {/* Delivery in-flight */}
      {activeOrder && (
        <>
          <SageSectionHeader>Incoming delivery</SageSectionHeader>
          <ActiveOrderCard order={activeOrder} onOpen={() => onOpen({ type: 'order', order: activeOrder })} />
        </>
      )}

      {/* Deliveries history */}
      <SageSectionHeader right={<span style={{ fontSize: 12, color: sageColors.inkSoft }}>{orders.length} total</span>}>Deliveries</SageSectionHeader>
      <SageCard style={{ padding: 0, overflow: 'hidden' }}>
        {pastOrders.map((o, i) => (
          <OrderRow key={o.id} order={o} isLast={i === pastOrders.length - 1} onClick={() => onOpen({ type: 'order', order: o })} />
        ))}
        {pastOrders.length === 0 && (
          <div style={{ padding: '20px', textAlign: 'center', fontSize: 13, color: sageColors.inkSoft }}>No past deliveries yet.</div>
        )}
      </SageCard>

      {/* Consultations history */}
      <SageSectionHeader right={<span style={{ fontSize: 12, color: sageColors.inkSoft }}>{consultations.length} total</span>}>Consultations</SageSectionHeader>
      <SageCard style={{ padding: 0, overflow: 'hidden' }}>
        {pastConsults.map((c, i) => (
          <ConsultRow key={c.id} consult={c} isLast={i === pastConsults.length - 1} onClick={() => onOpen({ type: 'consult', consult: c })} />
        ))}
        {pastConsults.length === 0 && (
          <div style={{ padding: '20px', textAlign: 'center', fontSize: 13, color: sageColors.inkSoft }}>No past consultations yet.</div>
        )}
      </SageCard>

      {/* Prescriptions */}
      <SageSectionHeader right={<span style={{ fontSize: 12, color: sageColors.inkSoft }}>{prescriptions.length}</span>}>Prescriptions</SageSectionHeader>
      <SageCard style={{ padding: 0, overflow: 'hidden' }}>
        {prescriptions.map((rx, i) => (
          <PrescriptionRow key={rx.id} rx={rx} isLast={i === prescriptions.length - 1} onClick={() => onOpen({ type: 'prescription', rx })} />
        ))}
      </SageCard>

      {/* Footer — link back to vytal.com */}
      <div style={{
        marginTop: 20, padding: '16px 18px', background: sageColors.surface, borderRadius: 20,
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 18, background: sageColors.sageLight,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 2h4v4M14 2l-6 6M7 3H4a2 2 0 00-2 2v7a2 2 0 002 2h7a2 2 0 002-2V9" stroke={sageColors.sageDeep} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: sageColors.ink }}>Need a new consultation?</div>
          <div style={{ fontSize: 11, color: sageColors.inkSoft, marginTop: 2 }}>Book on vytal.com · syncs here automatically</div>
        </div>
        {SageIcon.chevron(sageColors.inkFaint)}
      </div>
    </div>
  );
}

// ────────────────── Next consultation hero ──────────────────
function NextConsultCard({ consult, onOpen }) {
  // days-until countdown (demo: treat Apr 23 as "today")
  const today = new Date('2026-04-23');
  const cd = new Date(consult.date.replace(/,/g, ''));
  const days = Math.max(0, Math.ceil((cd - today) / (1000 * 60 * 60 * 24)));
  const dayLabel = days === 0 ? 'Today' : days === 1 ? 'Tomorrow' : `In ${days} days`;
  const isToday = days === 0;

  return (
    <div style={{
      background: sageColors.sage, color: '#fff', borderRadius: 28,
      padding: '20px 20px 18px', marginBottom: 14, position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', right: -30, top: -30, width: 140, height: 140, borderRadius: '50%',
        background: 'rgba(255,255,255,0.06)',
      }} />
      <div style={{
        position: 'absolute', right: 40, bottom: -40, width: 90, height: 90, borderRadius: '50%',
        background: 'rgba(196,165,116,0.25)',
      }} />

      <div style={{ position: 'relative' }}>
        <div style={{ fontSize: 11, letterSpacing: 0.4, textTransform: 'uppercase', opacity: 0.7, marginBottom: 6, fontWeight: 500 }}>Next teleconsultation</div>
        <div style={{ fontSize: 26, fontWeight: 500, letterSpacing: -0.6, lineHeight: 1.1, marginBottom: 14 }}>{dayLabel}<span style={{ opacity: 0.6, fontWeight: 400 }}> · {consult.time}</span></div>

        {/* Doctor strip */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{
            width: 42, height: 42, borderRadius: 21, background: sageColors.accent,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 500, fontSize: 15,
          }}>{consult.doctor.avatarInitial}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 500 }}>{consult.doctor.name}</div>
            <div style={{ fontSize: 12, opacity: 0.75 }}>{consult.doctor.title}</div>
          </div>
          <div style={{
            padding: '4px 10px', background: 'rgba(255,255,255,0.15)', borderRadius: 999,
            fontSize: 11, fontWeight: 500,
          }}>{consult.duration}</div>
        </div>

        {/* Agenda */}
        <div style={{ fontSize: 11, letterSpacing: 0.4, textTransform: 'uppercase', opacity: 0.55, marginBottom: 6, fontWeight: 500 }}>Agenda</div>
        <div style={{ marginBottom: 16 }}>
          {consult.agenda.slice(0, 3).map((a, i) => (
            <div key={i} style={{ fontSize: 13, lineHeight: 1.5, opacity: 0.9, display: 'flex', gap: 8 }}>
              <span style={{ opacity: 0.5 }}>·</span><span>{a}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => onOpen({ type: 'consult', consult })} style={{
            flex: 1, background: 'rgba(255,255,255,0.14)', border: 'none', color: '#fff',
            borderRadius: 14, padding: '12px 0', fontSize: 13, fontWeight: 500,
            cursor: 'pointer', fontFamily: 'inherit',
          }}>Details</button>
          <button disabled={!isToday} onClick={() => onOpen({ type: 'consult', consult, startCall: true })} style={{
            flex: 1.3, background: isToday ? sageColors.accent : 'rgba(255,255,255,0.14)', border: 'none', color: '#fff',
            borderRadius: 14, padding: '12px 0', fontSize: 13, fontWeight: 500,
            cursor: isToday ? 'pointer' : 'default', fontFamily: 'inherit',
            opacity: isToday ? 1 : 0.6,
          }}>{isToday ? 'Join call' : 'Join opens 15 min before'}</button>
        </div>
      </div>
    </div>
  );
}

// ────────────────── Active order card with mini timeline ──────────────────
function ActiveOrderCard({ order, onOpen }) {
  const statusLabel = {
    placed: 'Order placed',
    preparing: 'Pharmacy preparing',
    shipped: 'On the way',
    out_for_delivery: 'Out for delivery',
  }[order.status];
  const statusIdx = order.timeline.findIndex(t => t.active);
  const pct = ((statusIdx + 1) / order.timeline.length) * 100;

  return (
    <button onClick={onOpen} style={{
      width: '100%', background: sageColors.surface, border: 'none', borderRadius: 24,
      padding: 0, overflow: 'hidden', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
    }}>
      <div style={{ padding: '18px 18px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 54, height: 54, borderRadius: 14, background: sageColors.accentSoft,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {/* Pen icon */}
            <svg width="24" height="32" viewBox="0 0 24 32" fill="none">
              <rect x="8" y="3" width="8" height="5" rx="1.5" fill={sageColors.accent}/>
              <rect x="6" y="8" width="12" height="14" rx="2" fill="#fff" stroke={sageColors.accent} strokeWidth="1.5"/>
              <rect x="9" y="11" width="6" height="8" rx="1" fill={sageColors.accent} opacity="0.3"/>
              <rect x="7" y="22" width="10" height="7" rx="1.5" fill={sageColors.accent}/>
              <rect x="10" y="27" width="4" height="3" rx="0.5" fill={sageColors.sageDeep}/>
            </svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 500, letterSpacing: -0.2, color: sageColors.ink }}>
              {order.items[0].name} {order.items[0].dose}
            </div>
            <div style={{ fontSize: 12, color: sageColors.inkSoft, marginTop: 2 }}>
              {order.items[0].qty} {order.items[0].form} · order #{order.orderNumber.slice(-7)}
            </div>
          </div>
          {SageIcon.chevron(sageColors.inkFaint)}
        </div>

        <div style={{ marginTop: 16, marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: sageColors.sageDeep }}>{statusLabel}</div>
            <div style={{ fontSize: 12, color: sageColors.inkSoft }}>ETA {order.eta.toLowerCase()}</div>
          </div>
          {/* Mini progress stepper */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {order.timeline.map((t, i) => {
              const active = i <= statusIdx;
              return (
                <React.Fragment key={i}>
                  <div style={{
                    width: 10, height: 10, borderRadius: 5, flexShrink: 0,
                    background: active ? sageColors.sage : sageColors.divider,
                    border: t.active ? `2px solid ${sageColors.accent}` : 'none',
                    boxSizing: 'content-box',
                  }} />
                  {i < order.timeline.length - 1 && (
                    <div style={{
                      flex: 1, height: 2, background: i < statusIdx ? sageColors.sage : sageColors.divider,
                    }} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
      <div style={{
        padding: '12px 18px', background: sageColors.bgSoft,
        borderTop: `1px solid ${sageColors.divider}`,
        fontSize: 12, color: sageColors.inkSoft, display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v3M7 10v3M1 7h3M10 7h3M3 3l2 2M9 9l2 2M11 3L9 5M5 9l-2 2" stroke={sageColors.water} strokeWidth="1.5" strokeLinecap="round"/></svg>
        Cold-chain · 2–8 °C · {order.carrier}
      </div>
    </button>
  );
}

// ────────────────── Past order row ──────────────────
function OrderRow({ order, isLast, onClick }) {
  const isDelivered = order.status === 'delivered';
  const item = order.items[0];
  return (
    <button onClick={onClick} style={{
      width: '100%', padding: '14px 16px', background: 'transparent', border: 'none',
      display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
      borderBottom: isLast ? 'none' : `1px solid ${sageColors.divider}`,
    }}>
      <div style={{
        width: 38, height: 38, borderRadius: 12, background: sageColors.sageLight,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <svg width="16" height="18" viewBox="0 0 16 18" fill="none">
          <path d="M2 5h12v11a1 1 0 01-1 1H3a1 1 0 01-1-1V5zM1 3h14v2H1z" stroke={sageColors.sageDeep} strokeWidth="1.3" strokeLinejoin="round"/>
          <path d="M6 8h4" stroke={sageColors.sageDeep} strokeWidth="1.3" strokeLinecap="round"/>
        </svg>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: sageColors.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {item.name}{item.dose ? ` ${item.dose}` : ''}
        </div>
        <div style={{ fontSize: 11, color: sageColors.inkSoft, marginTop: 2 }}>
          {isDelivered ? `Delivered ${order.deliveredAt}` : order.placedDate} · #{order.orderNumber.slice(-7)}
        </div>
      </div>
      <div style={{
        padding: '4px 10px', borderRadius: 999, fontSize: 11, fontWeight: 500,
        background: sageColors.sageLight, color: sageColors.sageDeep,
      }}>{isDelivered ? 'Delivered' : order.status}</div>
      {SageIcon.chevron(sageColors.inkFaint)}
    </button>
  );
}

// ────────────────── Past consultation row ──────────────────
function ConsultRow({ consult, isLast, onClick }) {
  return (
    <button onClick={onClick} style={{
      width: '100%', padding: '14px 16px', background: 'transparent', border: 'none',
      display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
      borderBottom: isLast ? 'none' : `1px solid ${sageColors.divider}`,
    }}>
      <div style={{
        width: 38, height: 38, borderRadius: 19, background: sageColors.accentSoft,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        fontSize: 12, fontWeight: 500, color: sageColors.accent,
      }}>{consult.doctor.avatarInitial}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: sageColors.ink }}>{consult.type}</div>
        <div style={{ fontSize: 11, color: sageColors.inkSoft, marginTop: 2 }}>
          {consult.doctor.name} · {consult.date} · {consult.duration}
        </div>
      </div>
      {SageIcon.chevron(sageColors.inkFaint)}
    </button>
  );
}

// ────────────────── Prescription row ──────────────────
function PrescriptionRow({ rx, isLast, onClick }) {
  const active = rx.status === 'active';
  return (
    <button onClick={onClick} style={{
      width: '100%', padding: '14px 16px', background: 'transparent', border: 'none',
      display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
      borderBottom: isLast ? 'none' : `1px solid ${sageColors.divider}`,
    }}>
      <div style={{
        width: 38, height: 38, borderRadius: 12, background: active ? sageColors.sage : sageColors.bgSoft,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        {SageIcon.pill(active ? '#fff' : sageColors.inkSoft, 18)}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: sageColors.ink }}>
          {rx.medication.split(' ')[0]} {rx.dose}
        </div>
        <div style={{ fontSize: 11, color: sageColors.inkSoft, marginTop: 2 }}>{rx.date} · {rx.issuedBy}</div>
      </div>
      {active && (
        <div style={{ padding: '4px 10px', borderRadius: 999, fontSize: 11, fontWeight: 500,
          background: sageColors.sageLight, color: sageColors.sageDeep }}>Active</div>
      )}
      {SageIcon.chevron(sageColors.inkFaint)}
    </button>
  );
}

// ────────────────── Empty / disconnected state ──────────────────
function SageCareDisconnected({ onConnect }) {
  return (
    <div style={{ padding: '62px 24px 24px', textAlign: 'center' }}>
      <div style={{ marginTop: 24 }}>
        {/* Decorative illustration */}
        <div style={{ position: 'relative', width: 200, height: 200, margin: '0 auto 24px' }}>
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '50%', background: sageColors.sageLight, opacity: 0.6,
          }} />
          <div style={{
            position: 'absolute', left: 30, top: 30, width: 140, height: 140, borderRadius: '50%',
            background: sageColors.accentSoft, opacity: 0.7,
          }} />
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
              <path d="M14 26c8-4 12-4 22 0 10 4 14 4 22 0v24c-8 4-12 4-22 0-10-4-14-4-22 0V26z" fill={sageColors.sage}/>
              <circle cx="36" cy="38" r="6" fill={sageColors.accent}/>
              <path d="M36 34v8M32 38h8" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
        </div>

        <div style={{
          fontFamily: '"Fraunces", serif', fontSize: 28, letterSpacing: -0.8, color: sageColors.ink,
          marginBottom: 10, lineHeight: 1.1, fontWeight: 400,
        }}>Your <span style={{ fontStyle: 'italic', color: sageColors.sage }}>care</span> lives here.</div>
        <div style={{ fontSize: 14, color: sageColors.inkSoft, lineHeight: 1.5, marginBottom: 28, maxWidth: 300, margin: '0 auto 28px' }}>
          If you bought your plan at <span style={{ color: sageColors.ink, fontWeight: 500 }}>vytal.com</span>, connect your account to see your deliveries, consultations, and prescriptions.
        </div>

        <SageButton onClick={onConnect} style={{ marginBottom: 10 }}>Connect vytal.com account</SageButton>
        <SageButton variant="secondary" onClick={() => {}}>Learn about our plans</SageButton>

        {/* Perks preview */}
        <div style={{ marginTop: 32, textAlign: 'left' }}>
          <div style={{ fontSize: 11, color: sageColors.inkSoft, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 10, textAlign: 'center', fontWeight: 500 }}>What you'll get</div>
          {[
            { icon: SageIcon.pill, title: 'Your prescriptions', desc: 'PDFs from every consultation' },
            { icon: SageIcon.scale, title: 'Delivery tracking', desc: 'Cold-chain status, step by step' },
            { icon: SageIcon.coach, title: 'Teleconsultations', desc: 'Join video calls · read past notes' },
          ].map((p, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px',
              background: sageColors.surface, borderRadius: 16, marginBottom: 8,
            }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: sageColors.sageLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {p.icon(sageColors.sageDeep, 18)}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{p.title}</div>
                <div style={{ fontSize: 11, color: sageColors.inkSoft, marginTop: 1 }}>{p.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { SageCare });
