const { DesignCanvas, DCSection, DCArtboard } = window;

function Phone({ children }) {
  return <IOSDevice width={390} height={844}>{children}</IOSDevice>;
}

function LoggedOutSage() {
  return <div style={{ height: '100%', background: '#F5F1EA', fontFamily: '"Inter", sans-serif' }}>
    <SageAuth onAuthed={() => {}} />
  </div>;
}

function App() {
  return (
    <DesignCanvas title="VYTAL · Calm Sage" subtitle="Companion app for vytal.com customers — diary, progress, care (deliveries + consultations + prescriptions), coach.">
      <DCSection id="auth" title="Auth" subtitle="Welcome, sign in, and sign up.">
        <DCArtboard id="sage-auth" label="Welcome / Sign in / Sign up" width={390} height={844}>
          <Phone><LoggedOutSage /></Phone>
        </DCArtboard>
      </DCSection>

      <DCSection id="tracking" title="Yazio-style tracking" subtitle="Works for everyone — food diary, macros, water, progress, coach.">
        <DCArtboard id="sage-diary" label="Diary · food, macros, water" width={390} height={844}>
          <Phone><SageApp webConnected={true} initialTab="diary" /></Phone>
        </DCArtboard>
        <DCArtboard id="sage-progress" label="Progress · weight, BMI, milestones" width={390} height={844}>
          <Phone><SageApp webConnected={true} initialTab="progress" /></Phone>
        </DCArtboard>
      </DCSection>

      <DCSection id="workouts" title="Treinos · plano + check-in" subtitle="Plano semanal do Trainer AI ou coach humano. Tique cada exercício conforme você completa.">
        <DCArtboard id="sage-workouts-fresh" label="Treinos · plano de hoje (não iniciado)" width={390} height={844}>
          <Phone><SageApp webConnected={true} initialTab="workouts" /></Phone>
        </DCArtboard>
        <DCArtboard id="sage-workouts-progress" label="Treinos · em progresso (3/6 ticks)" width={390} height={844}>
          <Phone><SageApp webConnected={true} initialTab="workouts" preTicks={3} /></Phone>
        </DCArtboard>
        <DCArtboard id="sage-workouts-empty" label="Treinos · sem plano (gerar com AI)" width={390} height={844}>
          <Phone><SageApp webConnected={true} initialTab="workouts" noPlan={true} /></Phone>
        </DCArtboard>
      </DCSection>

      <DCSection id="agents" title="Equipe AI · agentes desbloqueáveis" subtitle="Coach é grátis. Terapeuta, Trainer e Nutricionista são add-ons mensais — ou pacote com 30% off.">
        <DCArtboard id="sage-agents-locked" label="Equipe · todos os especialistas bloqueados" width={390} height={844}>
          <Phone><SageApp webConnected={true} initialTab="coach" /></Phone>
        </DCArtboard>
        <DCArtboard id="sage-agents-paywall" label="Paywall · Helena (terapeuta)" width={390} height={844}>
          <Phone><SageApp webConnected={true} initialTab="coach" initialOverlay="agent-paywall-therapist" /></Phone>
        </DCArtboard>
        <DCArtboard id="sage-agents-bundle" label="Pacote · 3 agentes com 30% off" width={390} height={844}>
          <Phone><SageApp webConnected={true} initialTab="coach" initialOverlay="agent-bundle" /></Phone>
        </DCArtboard>
        <DCArtboard id="sage-agents-unlocked" label="Equipe · com Trainer ativo" width={390} height={844}>
          <Phone><SageApp webConnected={true} initialTab="coach" preUnlocked={['trainer']} /></Phone>
        </DCArtboard>
      </DCSection>

      <DCSection id="care" title="Care — for vytal.com customers" subtitle="Orders, cold-chain delivery tracking, teleconsultations and prescriptions. All read-only — bought and booked on the website.">
        <DCArtboard id="sage-care-connected" label="Care · next consult, delivery tracking, history" width={390} height={844}>
          <Phone><SageApp webConnected={true} initialTab="care" /></Phone>
        </DCArtboard>
        <DCArtboard id="sage-care-disconnected" label="Care · not connected to vytal.com" width={390} height={844}>
          <Phone><SageApp webConnected={false} initialTab="care" /></Phone>
        </DCArtboard>
      </DCSection>

      <DCSection id="coach" title="AI Coach" subtitle="Claude-powered — tap the card to start chatting.">
        <DCArtboard id="sage-coach" label="Coach · chat with Claude" width={390} height={844}>
          <Phone><SageApp webConnected={true} initialTab="coach" /></Phone>
        </DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
