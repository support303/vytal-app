// Care detail overlays — full-screen views for order / consult / prescription

// ────────────────── Order detail with full timeline ──────────────────
function SageOrderDetail({ order, onClose }) {
  const item = order.items[0];
  const isDelivered = order.status === 'delivered';

  return (
    <SageFullScreen onClose={onClose} title="Order detail">
      <div style={{ padding: '0 16px 40px' }}>
        {/* Hero */}
        <SageCard style={{ marginBottom: 12, padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
            <div style={{
              width: 60, height: 60, borderRadius: 16, background: sageColors.accentSoft,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="28" height="36" viewBox="0 0 24 32" fill="none">
                <rect x="8" y="3" width="8" height="5" rx="1.5" fill={sageColors.accent}/>
                <rect x="6" y="8" width="12" height="14" rx="2" fill="#fff" stroke={sageColors.accent} strokeWidth="1.5"/>
                <rect x="9" y="11" width="6" height="8" rx="1" fill={sageColors.accent} opacity="0.3"/>
                <rect x="7" y="22" width="10" height="7" rx="1.5" fill={sageColors.accent}/>
                <rect x="10" y="27" width="4" height="3" rx="0.5" fill={sageColors.sageDeep}/>
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 18, fontWeight: 500, letterSpacing: -0.3 }}>
                {item.name}{item.dose ? ` · ${item.dose}` : ''}
              </div>
              <div style={{ fontSize: 12, color: sageColors.inkSoft, marginTop: 2 }}>
                {item.qty} × {item.form}{item.note ? ` · ${item.note}` : ''}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 20, paddingTop: 14, borderTop: `1px solid ${sageColors.divider}` }}>
            <div><div style={{ fontSize: 10, color: sageColors.inkSoft, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 3 }}>Order</div><div style={{ fontSize: 13, fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>#{order.orderNumber.slice(-7)}</div></div>
            <div><div style={{ fontSize: 10, color: sageColors.inkSoft, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 3 }}>Placed</div><div style={{ fontSize: 13, fontWeight: 500 }}>{order.placedDate}</div></div>
            {order.totalBRL > 0 && <div><div style={{ fontSize: 10, color: sageColors.inkSoft, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 3 }}>Total</div><div style={{ fontSize: 13, fontWeight: 500 }}>R$ {order.totalBRL.toFixed(2).replace('.', ',')}</div></div>}
          </div>
        </SageCard>

        {/* Timeline */}
        <SageSectionHeader>{isDelivered ? 'Journey' : 'Tracking'}</SageSectionHeader>
        <SageCard style={{ padding: '18px 20px' }}>
          {order.timeline.map((t, i) => {
            const isLast = i === order.timeline.length - 1;
            return (
              <div key={i} style={{ display: 'flex', gap: 14, paddingBottom: isLast ? 0 : 18, position: 'relative' }}>
                {/* Line */}
                {!isLast && (
                  <div style={{
                    position: 'absolute', left: 11, top: 24, bottom: -6, width: 2,
                    background: t.done ? sageColors.sage : sageColors.divider,
                  }} />
                )}
                {/* Dot */}
                <div style={{
                  width: 24, height: 24, borderRadius: 12, flexShrink: 0,
                  background: t.done ? sageColors.sage : sageColors.surface,
                  border: t.done ? 'none' : `2px solid ${sageColors.divider}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: t.active ? `0 0 0 6px ${sageColors.sageLight}` : 'none',
                }}>
                  {t.done && !t.active && <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 5l2 2 4-4" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  {t.active && <div style={{ width: 8, height: 8, borderRadius: 4, background: '#fff' }} />}
                </div>
                <div style={{ flex: 1, paddingTop: 2 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: t.done ? sageColors.ink : sageColors.inkSoft }}>{t.label}</div>
                  {t.at && <div style={{ fontSize: 11, color: sageColors.inkSoft, marginTop: 2 }}>{t.at}</div>}
                  {t.note && <div style={{ fontSize: 12, color: t.active ? sageColors.sageDeep : sageColors.inkSoft, marginTop: 4, fontStyle: t.active ? 'italic' : 'normal' }}>{t.note}</div>}
                </div>
              </div>
            );
          })}
        </SageCard>

        {/* Pharmacy */}
        <SageSectionHeader>Pharmacy</SageSectionHeader>
        <SageCard style={{ padding: '16px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12, background: sageColors.sageLight,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{SageIcon.pill(sageColors.sageDeep, 18)}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{order.pharmacy}</div>
              {order.pharmacist && <div style={{ fontSize: 12, color: sageColors.inkSoft, marginTop: 2 }}>Dispensed by {order.pharmacist}</div>}
            </div>
          </div>
        </SageCard>

        {/* Shipping */}
        <SageSectionHeader>Shipping</SageSectionHeader>
        <SageCard style={{ padding: 0, overflow: 'hidden' }}>
          <DetailRow label="Carrier" value={order.carrier} />
          <DetailRow label="Tracking code" value={order.trackingCode} mono />
          <DetailRow label="Address" value={order.address} last />
        </SageCard>

        {!isDelivered && (
          <div style={{ marginTop: 20 }}>
            <SageButton variant="secondary" onClick={() => {}}>Need to change address?</SageButton>
          </div>
        )}
      </div>
    </SageFullScreen>
  );
}

function DetailRow({ label, value, mono, last }) {
  return (
    <div style={{
      padding: '12px 16px',
      borderBottom: last ? 'none' : `1px solid ${sageColors.divider}`,
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <div style={{ fontSize: 12, color: sageColors.inkSoft, flexShrink: 0, width: 100 }}>{label}</div>
      <div style={{
        flex: 1, fontSize: 13, color: sageColors.ink, fontWeight: 500, textAlign: 'right',
        fontFamily: mono ? 'ui-monospace, SFMono-Regular, monospace' : 'inherit',
        letterSpacing: mono ? 0.2 : 0,
      }}>{value}</div>
    </div>
  );
}

// ────────────────── Consultation detail ──────────────────
function SageConsultDetail({ consult, onClose, startCall, onJoinCall }) {
  if (startCall) return <SageVideoCall consult={consult} onEnd={onClose} />;
  const isUpcoming = consult.status === 'upcoming';

  return (
    <SageFullScreen onClose={onClose} title={isUpcoming ? 'Upcoming consultation' : 'Consultation recap'}>
      <div style={{ padding: '0 16px 40px' }}>
        {/* Doctor hero */}
        <SageCard style={{ padding: '20px', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 28, background: sageColors.accent,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 500, fontSize: 18,
          }}>{consult.doctor.avatarInitial}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 500, letterSpacing: -0.2 }}>{consult.doctor.name}</div>
            <div style={{ fontSize: 13, color: sageColors.inkSoft, marginTop: 2 }}>{consult.doctor.title}</div>
            <div style={{ fontSize: 11, color: sageColors.inkFaint, marginTop: 3, fontFamily: 'ui-monospace, monospace' }}>{consult.doctor.crm}</div>
          </div>
        </SageCard>

        {/* When */}
        <SageCard style={{ padding: 0, overflow: 'hidden', marginBottom: 12 }}>
          <DetailRow label="Type" value={consult.type} />
          <DetailRow label="Date" value={consult.date} />
          <DetailRow label="Time" value={consult.time} />
          <DetailRow label="Duration" value={consult.duration} last />
        </SageCard>

        {isUpcoming && (
          <>
            <SageSectionHeader>Agenda</SageSectionHeader>
            <SageCard style={{ padding: '8px 16px 14px' }}>
              {consult.agenda.map((a, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: i < consult.agenda.length - 1 ? `1px solid ${sageColors.divider}` : 'none' }}>
                  <div style={{ width: 6, height: 6, borderRadius: 3, background: sageColors.sage, marginTop: 8, flexShrink: 0 }}/>
                  <div style={{ fontSize: 14, lineHeight: 1.4 }}>{a}</div>
                </div>
              ))}
            </SageCard>

            <div style={{ marginTop: 20 }}>
              <SageButton onClick={onJoinCall}>Join video call</SageButton>
              <div style={{ textAlign: 'center', fontSize: 12, color: sageColors.inkFaint, marginTop: 10 }}>
                Tap to preview the call · this is a demo
              </div>
            </div>
          </>
        )}

        {!isUpcoming && (
          <>
            <SageSectionHeader>Doctor's summary</SageSectionHeader>
            <SageCard style={{ padding: '16px 18px' }}>
              <div style={{ fontFamily: '"Fraunces", serif', fontSize: 15, lineHeight: 1.5, color: sageColors.ink, fontStyle: 'italic' }}>
                "{consult.summary}"
              </div>
            </SageCard>

            {consult.notes && (
              <>
                <SageSectionHeader>Notes</SageSectionHeader>
                <SageCard style={{ padding: '8px 18px' }}>
                  {consult.notes.map((n, i) => (
                    <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: i < consult.notes.length - 1 ? `1px solid ${sageColors.divider}` : 'none' }}>
                      <div style={{ width: 6, height: 6, borderRadius: 3, background: sageColors.sageMid, marginTop: 7, flexShrink: 0 }}/>
                      <div style={{ fontSize: 13, lineHeight: 1.4, color: sageColors.ink }}>{n}</div>
                    </div>
                  ))}
                </SageCard>
              </>
            )}

            {consult.prescribed && (
              <>
                <SageSectionHeader>Prescribed</SageSectionHeader>
                {consult.prescribed.map((p, i) => (
                  <SageCard key={i} style={{ padding: '14px 18px', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: sageColors.sageLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {SageIcon.pill(sageColors.sageDeep, 16)}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 500, flex: 1 }}>{p}</div>
                  </SageCard>
                ))}
              </>
            )}

            {consult.nextReview && (
              <>
                <SageSectionHeader>Next review</SageSectionHeader>
                <SageCard style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: sageColors.accentSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {SageIcon.bell(sageColors.accent, 16)}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{consult.nextReview}</div>
                </SageCard>
              </>
            )}
          </>
        )}
      </div>
    </SageFullScreen>
  );
}

// ────────────────── Video call (demo) ──────────────────
function SageVideoCall({ consult, onEnd }) {
  const [seconds, setSeconds] = React.useState(0);
  const [muted, setMuted] = React.useState(false);
  const [videoOff, setVideoOff] = React.useState(false);
  React.useEffect(() => {
    const t = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(t);
  }, []);
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 200, background: '#0a0f0c',
      display: 'flex', flexDirection: 'column', color: '#fff',
      animation: 'fadeIn 0.3s ease',
    }}>
      {/* Doctor video (placeholder) */}
      <div style={{
        flex: 1, position: 'relative',
        background: `linear-gradient(135deg, ${sageColors.sageDeep}, #0a2016)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          width: 140, height: 140, borderRadius: 70, background: sageColors.accent,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 54, fontWeight: 500,
        }}>{consult.doctor.avatarInitial}</div>

        {/* Top bar */}
        <div style={{
          position: 'absolute', top: 56, left: 16, right: 16,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 500 }}>{consult.doctor.name}</div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>{consult.type}</div>
          </div>
          <div style={{
            padding: '6px 12px', background: 'rgba(255,255,255,0.15)', borderRadius: 999,
            fontSize: 12, fontVariantNumeric: 'tabular-nums', display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: 3, background: '#ff5a5a' }}/>
            <span>{mm}:{ss}</span>
          </div>
        </div>

        {/* Self-view (PiP) */}
        <div style={{
          position: 'absolute', right: 16, bottom: 24, width: 96, height: 128, borderRadius: 16,
          background: videoOff ? '#1a2a20' : 'repeating-linear-gradient(135deg, #243530, #243530 4px, #1a2a20 4px, #1a2a20 8px)',
          border: '2px solid rgba(255,255,255,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {videoOff
            ? <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M2 4l20 16M8 6h8a2 2 0 012 2v7M6 8v9a2 2 0 002 2h8l-4-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/></svg>
            : <div style={{ fontSize: 28, opacity: 0.8, fontWeight: 500 }}>M</div>}
        </div>
      </div>

      {/* Controls */}
      <div style={{
        padding: '24px 16px 44px', background: '#0a0f0c',
        display: 'flex', justifyContent: 'center', gap: 16,
      }}>
        <CallButton active={!muted} onClick={() => setMuted(m => !m)}>
          {muted
            ? <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M2 4l20 16M9 9v3a3 3 0 005 2.2M15 9V6a3 3 0 00-6 0v1M19 12a7 7 0 01-.6 2.8M12 19v3M8 22h8" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/></svg>
            : <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="9" y="3" width="6" height="13" rx="3" stroke="#fff" strokeWidth="1.5"/><path d="M5 12a7 7 0 0014 0M12 19v3M8 22h8" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/></svg>}
        </CallButton>
        <CallButton active={!videoOff} onClick={() => setVideoOff(v => !v)}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="2" y="6" width="14" height="12" rx="2" stroke="#fff" strokeWidth="1.5"/><path d="M16 10l6-3v10l-6-3" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round"/></svg>
        </CallButton>
        <CallButton danger onClick={onEnd}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M2 12c5-5 15-5 20 0l-3 3-3-2v-3c-2-1-6-1-8 0v3l-3 2-3-3z" fill="#fff"/></svg>
        </CallButton>
      </div>
    </div>
  );
}

function CallButton({ children, active = true, danger, onClick }) {
  return (
    <button onClick={onClick} style={{
      width: 58, height: 58, borderRadius: 29, border: 'none', cursor: 'pointer',
      background: danger ? '#E54B4B' : (active ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.5)'),
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transform: danger ? 'rotate(135deg)' : 'none',
    }}>{children}</button>
  );
}

// ────────────────── Prescription PDF view ──────────────────
function SagePrescriptionDetail({ rx, onClose }) {
  const active = rx.status === 'active';
  return (
    <SageFullScreen onClose={onClose} title="Prescription" rightAction={
      <button style={{
        padding: '8px 14px', background: sageColors.sage, border: 'none', borderRadius: 14,
        color: '#fff', fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
      }}>Download PDF</button>
    }>
      <div style={{ padding: '0 16px 40px' }}>
        {/* Paper sheet */}
        <div style={{
          background: '#fff', borderRadius: 16, padding: '28px 24px',
          boxShadow: '0 2px 20px rgba(26,42,34,0.08)', position: 'relative',
          fontFamily: '"Fraunces", serif',
        }}>
          {/* Letterhead */}
          <div style={{ textAlign: 'center', marginBottom: 22, paddingBottom: 16, borderBottom: `1px solid ${sageColors.divider}` }}>
            <div style={{ fontSize: 20, letterSpacing: 2, color: sageColors.sageDeep, fontWeight: 500 }}>VYTAL</div>
            <div style={{ fontSize: 10, letterSpacing: 1, color: sageColors.inkSoft, textTransform: 'uppercase', marginTop: 4, fontFamily: 'Inter' }}>Medical prescription · Rx</div>
          </div>

          {/* Doctor */}
          <div style={{ marginBottom: 18, fontFamily: 'Inter' }}>
            <div style={{ fontSize: 10, color: sageColors.inkSoft, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 3, fontWeight: 500 }}>Prescribing physician</div>
            <div style={{ fontSize: 14, fontWeight: 500, color: sageColors.ink }}>{rx.issuedBy}</div>
            <div style={{ fontSize: 11, color: sageColors.inkSoft, marginTop: 2, fontFamily: 'ui-monospace, monospace' }}>{rx.crm}</div>
          </div>

          {/* Patient */}
          <div style={{ marginBottom: 22, paddingBottom: 18, borderBottom: `1px dashed ${sageColors.divider}`, fontFamily: 'Inter' }}>
            <div style={{ fontSize: 10, color: sageColors.inkSoft, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 3, fontWeight: 500 }}>Patient</div>
            <div style={{ fontSize: 14, fontWeight: 500 }}>Maya Rocha</div>
          </div>

          {/* Rx body */}
          <div style={{ fontFamily: 'Inter' }}>
            <div style={{ fontSize: 28, fontFamily: '"Fraunces", serif', color: sageColors.sageDeep, marginBottom: 4 }}>℞</div>
            <div style={{ fontSize: 18, fontWeight: 500, letterSpacing: -0.3, color: sageColors.ink, marginBottom: 2 }}>{rx.medication}</div>
            <div style={{ fontSize: 15, color: sageColors.ink, marginBottom: 14 }}>{rx.dose}</div>

            <div style={{ fontSize: 13, lineHeight: 1.7, color: sageColors.ink }}>
              <div><span style={{ color: sageColors.inkSoft }}>Sig:</span> {rx.frequency}</div>
              <div><span style={{ color: sageColors.inkSoft }}>Duration:</span> {rx.duration}</div>
              <div><span style={{ color: sageColors.inkSoft }}>Dispense:</span> {rx.quantity}</div>
            </div>
          </div>

          {/* Status stamp */}
          <div style={{
            marginTop: 24, paddingTop: 16, borderTop: `1px solid ${sageColors.divider}`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: 'Inter',
          }}>
            <div style={{ fontSize: 11, color: sageColors.inkSoft }}>Issued {rx.date}</div>
            <div style={{
              padding: '4px 10px', borderRadius: 999, fontSize: 11, fontWeight: 500,
              background: active ? sageColors.sageLight : sageColors.bgSoft,
              color: active ? sageColors.sageDeep : sageColors.inkSoft,
              border: `1.5px solid ${active ? sageColors.sage : sageColors.divider}`,
            }}>{active ? 'Active' : 'Superseded'}</div>
          </div>
        </div>

        <div style={{ marginTop: 20 }}>
          <SageButton variant="secondary" onClick={() => {}}>Send to pharmacy</SageButton>
        </div>
        <div style={{ fontSize: 11, color: sageColors.inkFaint, textAlign: 'center', marginTop: 14, lineHeight: 1.5 }}>
          You can fill this prescription at any licensed pharmacy.<br/>VYTAL pharmacy partners deliver in cold-chain within 48 h.
        </div>
      </div>
    </SageFullScreen>
  );
}

Object.assign(window, { SageOrderDetail, SageConsultDetail, SagePrescriptionDetail });
