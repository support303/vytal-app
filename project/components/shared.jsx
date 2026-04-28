// Shared state and utilities for VYTAL app (Calm Sage direction)

const VYTAL_USER = {
  name: 'Maya',
  email: 'maya@vytal.app',
  startWeight: 82.4,
  currentWeight: 76.8,
  goalWeight: 68.0,
  heightCm: 168,
  age: 34,
  sex: 'female',
  activityLevel: 'Lightly active',
  dailyCalorieGoal: 1650,
  proteinGoal: 110,   // g
  carbsGoal: 165,     // g
  fatGoal: 55,        // g
  fiberGoal: 28,      // g
  waterGoal: 8,       // glasses (250ml each)
  nextDoseDate: 'Thursday',
  nextDoseDose: '0.5 mg',
  medication: 'Wegovy',
  weekNumber: 7,
  streak: 12,
  joinedDate: 'Mar 3, 2026',
};

// Weight history — last 8 weeks
const WEIGHT_HISTORY = [
  { week: 0, weight: 82.4, date: 'Mar 3' },
  { week: 1, weight: 81.6, date: 'Mar 10' },
  { week: 2, weight: 80.9, date: 'Mar 17' },
  { week: 3, weight: 80.1, date: 'Mar 24' },
  { week: 4, weight: 79.2, date: 'Mar 31' },
  { week: 5, weight: 78.4, date: 'Apr 7' },
  { week: 6, weight: 77.5, date: 'Apr 14' },
  { week: 7, weight: 76.8, date: 'Apr 21' },
];

// Food database — Yazio-style searchable foods with full macros
const FOOD_DATABASE = [
  { id: 'db1', name: 'Greek yogurt, plain', brand: 'Fage 2%', serving: '170 g', kcal: 120, protein: 20, carbs: 7, fat: 3, fiber: 0 },
  { id: 'db2', name: 'Blueberries', brand: 'Fresh', serving: '100 g', kcal: 57, protein: 0.7, carbs: 14, fat: 0.3, fiber: 2.4 },
  { id: 'db3', name: 'Walnuts', brand: 'Raw', serving: '30 g', kcal: 196, protein: 4.5, carbs: 4, fat: 20, fiber: 2 },
  { id: 'db4', name: 'Chicken breast, grilled', brand: 'Generic', serving: '150 g', kcal: 247, protein: 46, carbs: 0, fat: 5, fiber: 0 },
  { id: 'db5', name: 'Mixed greens salad', brand: 'Generic', serving: '100 g', kcal: 20, protein: 1.5, carbs: 3, fat: 0.3, fiber: 2 },
  { id: 'db6', name: 'Olive oil', brand: 'Extra virgin', serving: '1 tbsp', kcal: 119, protein: 0, carbs: 0, fat: 14, fiber: 0 },
  { id: 'db7', name: 'Avocado', brand: 'Hass', serving: '1/2 medium', kcal: 160, protein: 2, carbs: 9, fat: 15, fiber: 7 },
  { id: 'db8', name: 'Whole wheat toast', brand: 'Generic', serving: '1 slice', kcal: 80, protein: 4, carbs: 14, fat: 1, fiber: 2 },
  { id: 'db9', name: 'Eggs, scrambled', brand: 'Generic', serving: '2 large', kcal: 200, protein: 13, carbs: 2, fat: 15, fiber: 0 },
  { id: 'db10', name: 'Salmon fillet, baked', brand: 'Atlantic', serving: '140 g', kcal: 280, protein: 39, carbs: 0, fat: 13, fiber: 0 },
  { id: 'db11', name: 'Quinoa, cooked', brand: 'Generic', serving: '1 cup', kcal: 222, protein: 8, carbs: 39, fat: 4, fiber: 5 },
  { id: 'db12', name: 'Broccoli, steamed', brand: 'Fresh', serving: '100 g', kcal: 35, protein: 2.4, carbs: 7, fat: 0.4, fiber: 3.3 },
  { id: 'db13', name: 'Apple, medium', brand: 'Fuji', serving: '180 g', kcal: 95, protein: 0.5, carbs: 25, fat: 0.3, fiber: 4.4 },
  { id: 'db14', name: 'Almond butter', brand: 'Generic', serving: '1 tbsp', kcal: 98, protein: 3.4, carbs: 3, fat: 9, fiber: 1.6 },
  { id: 'db15', name: 'Banana', brand: 'Fresh', serving: '1 medium', kcal: 105, protein: 1.3, carbs: 27, fat: 0.4, fiber: 3.1 },
  { id: 'db16', name: 'Oatmeal, rolled', brand: 'Quaker', serving: '1/2 cup dry', kcal: 150, protein: 5, carbs: 27, fat: 3, fiber: 4 },
  { id: 'db17', name: 'Protein shake, whey', brand: 'Optimum', serving: '1 scoop', kcal: 120, protein: 24, carbs: 3, fat: 1, fiber: 0 },
  { id: 'db18', name: 'Brown rice, cooked', brand: 'Generic', serving: '1 cup', kcal: 216, protein: 5, carbs: 45, fat: 1.8, fiber: 3.5 },
  { id: 'db19', name: 'Cottage cheese, low-fat', brand: 'Generic', serving: '1/2 cup', kcal: 90, protein: 13, carbs: 5, fat: 2, fiber: 0 },
  { id: 'db20', name: 'Sweet potato, baked', brand: 'Fresh', serving: '150 g', kcal: 130, protein: 2.4, carbs: 30, fat: 0.2, fiber: 4.5 },
  { id: 'db21', name: 'Spinach, raw', brand: 'Fresh', serving: '50 g', kcal: 12, protein: 1.5, carbs: 1.8, fat: 0.2, fiber: 1.1 },
  { id: 'db22', name: 'Tuna, canned in water', brand: 'Generic', serving: '1 can (142g)', kcal: 130, protein: 30, carbs: 0, fat: 1, fiber: 0 },
  { id: 'db23', name: 'Espresso', brand: 'Generic', serving: '1 shot', kcal: 3, protein: 0, carbs: 0, fat: 0, fiber: 0 },
  { id: 'db24', name: 'Dark chocolate, 70%', brand: 'Lindt', serving: '2 squares (20g)', kcal: 108, protein: 1.5, carbs: 9, fat: 8, fiber: 1.8 },
];

// Today's food log — seed data with meal grouping + macros
const SEED_FOODS_TODAY = [
  { id: 'f1', time: '08:12', meal: 'Breakfast', name: 'Greek yogurt with berries & walnuts', kcal: 320, protein: 22, carbs: 24, fat: 14, fiber: 4, hasPhoto: true, serving: '1 bowl' },
  { id: 'f2', time: '13:05', meal: 'Lunch', name: 'Grilled chicken salad', kcal: 480, protein: 38, carbs: 18, fat: 26, fiber: 6, hasPhoto: true, serving: '1 plate' },
  { id: 'f3', time: '16:30', meal: 'Snack', name: 'Apple with almond butter', kcal: 180, protein: 5, carbs: 28, fat: 8, fiber: 6, hasPhoto: false, serving: '1 serving' },
];

// Achievements / milestones (Yazio-style)
const ACHIEVEMENTS = [
  { id: 'a1', icon: 'flame', title: 'First week', desc: '7 days logged in a row', unlocked: true, date: 'Mar 10' },
  { id: 'a2', icon: 'scale', title: 'Down 5 kg', desc: 'Half the journey', unlocked: true, date: 'Apr 18' },
  { id: 'a3', icon: 'leaf', title: 'Protein pro', desc: 'Hit protein goal 5 days', unlocked: true, date: 'Apr 20' },
  { id: 'a4', icon: 'drop', title: 'Hydration habit', desc: 'Water goal 10 days', unlocked: false },
  { id: 'a5', icon: 'star', title: 'One month strong', desc: '30 day streak', unlocked: false },
  { id: 'a6', icon: 'trophy', title: 'Goal reached', desc: 'You made it to 68 kg', unlocked: false },
];

// ─── Orders (delivered from vytal.com website purchases) ───
// Status values: 'placed' | 'preparing' | 'shipped' | 'out_for_delivery' | 'delivered'
const ORDERS = [
  {
    id: 'ord-2026-0423',
    orderNumber: 'VYT-284-1193',
    placedDate: 'Apr 22, 2026',
    placedTime: '14:32',
    status: 'out_for_delivery',
    eta: 'Tomorrow by 6pm',
    items: [
      { name: 'Wegovy', dose: '0.5 mg', qty: 4, form: 'pre-filled pens', note: '4-week supply' },
    ],
    pharmacy: 'Panvel Farmácias · Moema',
    pharmacist: 'Dra. Roberta Lins',
    address: 'Rua Joaquim Floriano 820 · apt 74',
    trackingCode: 'LX284119321BR',
    carrier: 'VYTAL Cold Chain',
    totalBRL: 1480.00,
    timeline: [
      { step: 'placed', label: 'Order placed', at: 'Apr 22 · 14:32', done: true, note: 'Prescription verified' },
      { step: 'preparing', label: 'Pharmacy preparing', at: 'Apr 22 · 16:10', done: true, note: 'Cold-chain packed · 2-8 °C' },
      { step: 'shipped', label: 'Shipped', at: 'Apr 23 · 08:45', done: true, note: 'Handed to courier' },
      { step: 'out_for_delivery', label: 'Out for delivery', at: 'Tomorrow · 07:00', done: true, active: true, note: 'Arriving at your address' },
      { step: 'delivered', label: 'Delivered', at: null, done: false },
    ],
  },
  {
    id: 'ord-2026-0325',
    orderNumber: 'VYT-281-0877',
    placedDate: 'Mar 25, 2026',
    placedTime: '09:14',
    status: 'delivered',
    deliveredAt: 'Mar 26, 15:22',
    items: [{ name: 'Wegovy', dose: '0.25 mg', qty: 4, form: 'pre-filled pens', note: 'Starter dose · 4 weeks' }],
    pharmacy: 'Panvel Farmácias · Moema',
    pharmacist: 'Dra. Roberta Lins',
    address: 'Rua Joaquim Floriano 820 · apt 74',
    trackingCode: 'LX281087711BR',
    carrier: 'VYTAL Cold Chain',
    totalBRL: 1380.00,
    timeline: [
      { step: 'placed', label: 'Order placed', at: 'Mar 25 · 09:14', done: true },
      { step: 'preparing', label: 'Pharmacy preparing', at: 'Mar 25 · 11:30', done: true },
      { step: 'shipped', label: 'Shipped', at: 'Mar 25 · 17:02', done: true },
      { step: 'out_for_delivery', label: 'Out for delivery', at: 'Mar 26 · 08:10', done: true },
      { step: 'delivered', label: 'Delivered', at: 'Mar 26 · 15:22', done: true, note: 'Signed by Maya' },
    ],
  },
  {
    id: 'ord-2026-0301',
    orderNumber: 'VYT-278-0412',
    placedDate: 'Mar 1, 2026',
    placedTime: '18:44',
    status: 'delivered',
    deliveredAt: 'Mar 3, 11:05',
    items: [{ name: 'Welcome kit', dose: null, qty: 1, form: 'box', note: 'Includes cooler bag, journal, scale' }],
    pharmacy: 'VYTAL HQ · São Paulo',
    pharmacist: null,
    address: 'Rua Joaquim Floriano 820 · apt 74',
    trackingCode: 'LX278041298BR',
    carrier: 'VYTAL Cold Chain',
    totalBRL: 0,
    timeline: [
      { step: 'placed', label: 'Order placed', at: 'Mar 1 · 18:44', done: true },
      { step: 'preparing', label: 'Preparing', at: 'Mar 2 · 09:00', done: true },
      { step: 'shipped', label: 'Shipped', at: 'Mar 2 · 13:20', done: true },
      { step: 'delivered', label: 'Delivered', at: 'Mar 3 · 11:05', done: true },
    ],
  },
];

// ─── Consultations (teleconsultations booked on vytal.com) ───
// status: 'upcoming' | 'completed' | 'cancelled'
const CONSULTATIONS = [
  {
    id: 'c-2026-0426',
    date: 'Apr 26, 2026',
    dayLabel: 'Sunday',
    time: '16:00',
    duration: '25 min',
    status: 'upcoming',
    doctor: {
      name: 'Dra. Isabela Campos',
      title: 'Endocrinologista',
      crm: 'CRM-SP 184.902',
      avatarInitial: 'IC',
    },
    type: 'Follow-up · Week 8',
    agenda: ['Dose escalation: 0.5 → 1.0 mg', 'Side effects check', 'Weight trajectory review'],
  },
  {
    id: 'c-2026-0329',
    date: 'Mar 29, 2026',
    time: '17:30',
    duration: '22 min',
    status: 'completed',
    doctor: {
      name: 'Dra. Isabela Campos',
      title: 'Endocrinologista',
      crm: 'CRM-SP 184.902',
      avatarInitial: 'IC',
    },
    type: 'Follow-up · Week 4',
    summary: 'Maya is tolerating 0.25 mg well — mild nausea in week 1 resolved. Weight trajectory healthy (−1.6 kg). Stepping up to 0.5 mg next cycle.',
    notes: [
      'Current weight 80.1 kg (down from 82.4)',
      'Nausea 3/10 first week, now 0/10',
      'Sleep and mood stable',
      'Hydration below target — encouraged',
    ],
    prescribed: ['Wegovy 0.5 mg · 4 pens · 4 weeks'],
    nextReview: 'Apr 26, 2026',
  },
  {
    id: 'c-2026-0303',
    date: 'Mar 3, 2026',
    time: '10:00',
    duration: '45 min',
    status: 'completed',
    doctor: {
      name: 'Dra. Isabela Campos',
      title: 'Endocrinologista',
      crm: 'CRM-SP 184.902',
      avatarInitial: 'IC',
    },
    type: 'Initial evaluation',
    summary: 'Onboarding & eligibility confirmed. BMI 29.2, no contraindications. Starting GLP-1 therapy with Wegovy 0.25 mg, weekly injection, titrating every 4 weeks as tolerated.',
    notes: [
      'Medical history reviewed — no pancreatitis, no MTC family history',
      'HbA1c 5.4 (normal)',
      'Started on 0.25 mg weekly',
      'Nutrition goals: 1650 kcal, 110g protein',
    ],
    prescribed: ['Wegovy 0.25 mg · 4 pens · starter'],
    nextReview: 'Mar 29, 2026',
  },
];

// ─── Prescriptions (issued after consults, PDF) ───
const PRESCRIPTIONS = [
  {
    id: 'rx-2026-0329',
    date: 'Mar 29, 2026',
    issuedBy: 'Dra. Isabela Campos',
    crm: 'CRM-SP 184.902',
    medication: 'Wegovy (Semaglutida)',
    dose: '0.5 mg',
    frequency: 'Once weekly, subcutaneous',
    duration: '4 weeks',
    quantity: '4 pre-filled pens',
    consultId: 'c-2026-0329',
    status: 'active',
  },
  {
    id: 'rx-2026-0303',
    date: 'Mar 3, 2026',
    issuedBy: 'Dra. Isabela Campos',
    crm: 'CRM-SP 184.902',
    medication: 'Wegovy (Semaglutida)',
    dose: '0.25 mg',
    frequency: 'Once weekly, subcutaneous',
    duration: '4 weeks',
    quantity: '4 pre-filled pens',
    consultId: 'c-2026-0303',
    status: 'completed',
  },
];

// ─── Workout plan (today's session) ───
// AI-trainer-generated plan that lives in the Workouts tab. Each exercise has a `done` tick.
const TODAY_WORKOUT = {
  id: 'w-2026-0427',
  title: 'Hoje · Membros inferiores',
  subtitle: 'Força progressiva · semana 3/4',
  tag: 'Força',
  duration: 45,
  kcalEst: 320,
  focus: ['Glúteos', 'Quadríceps', 'Core estabilizador'],
  startedAt: null,
  source: {
    type: 'ai',
    label: 'Plano gerado por Trainer AI',
    sublabel: 'Adaptado para sua jornada GLP-1 · atualizado há 2 dias',
    initials: 'AI',
  },
  exercises: [
    { id: 'ex1', name: 'Aquecimento dinâmico', meta: '5 min · mobilidade', sets: 1, reps: '5 min', rest: '—', load: 'corpo', icon: '🌀',
      notes: 'Movimentos circulares para preparar quadris e tornozelos. Sem pressa.', done: false },
    { id: 'ex2', name: 'Agachamento livre', meta: '4 × 10 · descanso 90s', sets: 4, reps: '10', rest: '90s', load: '—', icon: '◐',
      notes: 'Pés afastados na largura dos ombros, peso no calcanhar. Desça até o paralelo, controle a subida.', done: false },
    { id: 'ex3', name: 'Avanço alternado', meta: '3 × 12 · descanso 60s', sets: 3, reps: '12 cada perna', rest: '60s', load: '—', icon: '◑',
      notes: 'Passada longa, joelho da frente alinhado com o tornozelo. Empurre o calcanhar para subir.', done: false },
    { id: 'ex4', name: 'Glute bridge', meta: '3 × 15 · descanso 45s', sets: 3, reps: '15', rest: '45s', load: '—', icon: '▲',
      notes: 'Aperte os glúteos no topo. Pausa de 1 segundo antes de descer.', done: false },
    { id: 'ex5', name: 'Prancha lateral', meta: '3 × 30s cada lado', sets: 3, reps: '30s', rest: '45s', load: '—', icon: '▬',
      notes: 'Quadril alinhado, ombro estável. Respiração tranquila.', done: false },
    { id: 'ex6', name: 'Alongamento final', meta: '5 min · soltura', sets: 1, reps: '5 min', rest: '—', load: 'corpo', icon: '✿',
      notes: 'Foque em quadris, posterior de coxa e lombar.', done: false },
  ],
};

const WEEKLY_WORKOUTS = [
  { day: 'Seg', dayNum: 21, status: 'done' },
  { day: 'Ter', dayNum: 22, status: 'done' },
  { day: 'Qua', dayNum: 23, status: 'rest' },
  { day: 'Qui', dayNum: 24, status: 'partial' },
  { day: 'Sex', dayNum: 25, status: 'missed' },
  { day: 'Sáb', dayNum: 26, status: 'rest' },
  { day: 'Dom', dayNum: 27, status: 'today', isToday: true },
];

const WORKOUT_STATS = { streak: 6, weekDone: 3, weekTarget: 4, kcalWeek: 1240 };

// ─── AI Agents (Coach is free; specialists are paid add-ons) ───
const AGENTS = [
  {
    id: 'coach',
    name: 'Coach',
    title: 'Companheira diária',
    shortTitle: 'Companheira',
    emoji: '✦',
    colorFrom: '#3DBCB5', colorTo: '#2C7BB8',
    unlocked: true,
    priceBRL: 0,
  },
  {
    id: 'therapist',
    name: 'Helena',
    title: 'Terapeuta · apoio emocional',
    shortTitle: 'Terapeuta',
    emoji: '◉',
    colorFrom: '#A47ECF', colorTo: '#6B4DA8',
    unlocked: false,
    priceBRL: 79,
    tagline: 'Conversas íntimas para os altos e baixos da jornada — autoestima, gatilhos alimentares, ansiedade.',
    longPitch: 'Helena escuta sem julgar e te ajuda a entender o que está por trás de cada vontade — com técnicas de TCC adaptadas para quem está em mudança de peso.',
    perks: ['Sessões de check-in diário', 'Diário emocional guiado', 'Técnicas de TCC e mindfulness', 'Lembretes de autocompaixão', 'Reflexões semanais'],
    sampleMessage: 'Notei que você abriu o app três vezes hoje sem registrar nada. Quer me contar o que tá rolando? Sem pressa, sem julgamento.',
    openingLine: 'Oi Maya. Sou a Helena. Antes de mais nada — como você tá hoje, de verdade? Pode ser uma palavra só.',
    systemPrompt: 'You are Helena, an empathetic AI therapist inside VYTAL. You support users on their GLP-1 weight journey emotionally. Use warm, validating Portuguese (BR). Use short replies (2-3 sentences). Reflect feelings. Use techniques from CBT and mindfulness. NEVER diagnose. If user mentions self-harm or crisis, gently redirect to a human professional. Maya is on Wegovy week 7, down 5.6kg.',
  },
  {
    id: 'trainer',
    name: 'Léo',
    title: 'Trainer · planos de treino',
    shortTitle: 'Trainer',
    emoji: '◈',
    colorFrom: '#E08453', colorTo: '#B8552B',
    unlocked: false,
    priceBRL: 69,
    tagline: 'Monta planos semanais, ajusta cargas e responde dúvidas em tempo real — adaptado à sua energia com GLP-1.',
    longPitch: 'Léo cria seu plano de treino na aba Treinos, ajusta progressão, e responde quando você manda foto da execução pra checar a forma.',
    perks: ['Planos semanais personalizados', 'Ajuste de cargas em tempo real', 'Análise de execução por foto', 'Adaptação a dias de baixa energia', 'Substitui exercícios na hora'],
    sampleMessage: 'Vi que ontem você pulou o treino — tá tudo bem. Hoje vou deixar uma versão mais leve, 25 min só. Topa?',
    openingLine: 'E aí Maya! Sou o Léo, seu trainer. Já dei uma olhada no seu plano da semana — quer ajustar alguma coisa antes da sessão de hoje?',
    systemPrompt: 'You are Léo, an AI personal trainer inside VYTAL. Reply in Portuguese (BR), casual and energetic but never pushy. Short replies (2-3 sentences). Adapt training to GLP-1 reality (lower energy some days). Maya is on Wegovy, week 7. Suggest substitutions, validate rest days, encourage form over reps. Never diagnose injuries — refer to physiotherapist.',
  },
  {
    id: 'nutritionist',
    name: 'Camila',
    title: 'Nutricionista · estratégia alimentar',
    shortTitle: 'Nutri',
    emoji: '❋',
    colorFrom: '#5FA876', colorTo: '#2D7547',
    unlocked: false,
    priceBRL: 89,
    tagline: 'Estratégia alimentar para a fase do GLP-1 — saciedade, proteína suficiente, prazer no prato.',
    longPitch: 'Camila lê seu diário do Vytal todo dia e sugere ajustes específicos — receitas práticas, lista de mercado e como lidar com saciedade reduzida.',
    perks: ['Análise diária do seu diário', 'Receitas adaptadas (15 min)', 'Lista de mercado semanal', 'Estratégias para enjoo', 'Macros ajustados por fase'],
    sampleMessage: 'Sua proteína tá em 78g hoje, faltam 32g — que tal um shake com pasta de amendoim no lanche? 220 kcal e mata 22g.',
    openingLine: 'Olá Maya, sou a Camila. Dei uma olhada no seu diário de ontem — você tá indo bem mesmo. Quer que eu monte uma sugestão pro jantar de hoje?',
    systemPrompt: 'You are Camila, an AI nutritionist inside VYTAL. Reply in Portuguese (BR). Short, practical replies (2-3 sentences) with specific numbers. Adapt to GLP-1 reduced appetite. Maya is on Wegovy week 7, goal 1650kcal/110g protein. Focus on protein adequacy, satiety, hydration. Never diagnose — refer to her doctor in Care for clinical issues.',
  },
];

// Claude wrapper
async function askCoach(messages, systemOverride) {
  const system = systemOverride || `You are Coach, the AI companion inside VYTAL — a premium GLP-1 weight health app. You're warm, close, like a best friend who happens to know nutrition and metabolic health. Use "you" directly. Never preachy. Keep responses SHORT (2-4 sentences max, often 1). You know the user Maya is on Wegovy 0.5mg, week 7, down 5.6 kg from 82.4 to 76.8 kg, goal 68 kg. Daily goal 1650 kcal, 110g protein. Celebrate small wins. If she asks about side effects of GLP-1, be gentle and practical. Never give a medical diagnosis — gently suggest checking with her doctor in the app if something sounds clinical.`;
  try {
    const res = await window.claude.complete({
      messages: [
        { role: 'user', content: `System: ${system}\n\nConversation so far:\n${messages.map(m => `${m.role === 'user' ? 'Maya' : 'Coach'}: ${m.content}`).join('\n')}\n\nRespond as Coach to Maya's last message. Reply ONLY with Coach's message text, no prefix.` }
      ],
    });
    return res.trim();
  } catch (e) {
    return "I'm here — give me a sec, my brain's catching up. Try again?";
  }
}

async function analyzeFoodDescription(description) {
  try {
    const prompt = `You are a nutrition coach. The user describes what they just ate: "${description}". Reply with ONLY a JSON object, no prose, no code fence. Keys: name (short dish name, max 6 words), kcal (integer estimate), protein (integer grams), carbs (integer grams), fat (integer grams), fiber (integer grams), meal (Breakfast/Lunch/Dinner/Snack based on typical time), serving (short string like "1 bowl" or "1 plate").`;
    const res = await window.claude.complete({ messages: [{ role: 'user', content: prompt }] });
    const cleaned = res.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (e) {
    return { name: description.slice(0, 40), kcal: 400, protein: 20, carbs: 35, fat: 18, fiber: 4, meal: 'Snack', serving: '1 portion' };
  }
}

// Shared hook — central app state
function useVytalState(opts = {}) {
  const [weight, setWeight] = React.useState(VYTAL_USER.currentWeight);
  const [history, setHistory] = React.useState(WEIGHT_HISTORY);
  const [foods, setFoods] = React.useState(SEED_FOODS_TODAY);
  const [water, setWater] = React.useState(4); // glasses
  const [webConnected, setWebConnected] = React.useState(opts.webConnected !== false);
  const connectWeb = () => setWebConnected(true);
  const disconnectWeb = () => setWebConnected(false);

  // Workouts
  const [todayWorkout, setTodayWorkout] = React.useState(opts.noPlan ? null : TODAY_WORKOUT);
  const [weeklyWorkouts] = React.useState(WEEKLY_WORKOUTS);
  const [workoutStats] = React.useState(WORKOUT_STATS);
  const startWorkout = () => setTodayWorkout(w => w ? { ...w, startedAt: Date.now() } : w);
  const finishWorkout = () => setTodayWorkout(w => w ? { ...w, finishedAt: Date.now() } : w);
  const toggleExerciseDone = (exId, forceTrue) => {
    setTodayWorkout(w => {
      if (!w) return w;
      return {
        ...w,
        startedAt: w.startedAt || Date.now(),
        exercises: w.exercises.map(e => e.id === exId ? { ...e, done: forceTrue !== undefined ? forceTrue : !e.done } : e),
      };
    });
  };

  // Agents
  const [agents, setAgents] = React.useState(AGENTS);
  const unlockAgent = (id) => setAgents(a => a.map(x => x.id === id ? { ...x, unlocked: true } : x));
  const unlockedAgents = agents.filter(a => a.unlocked);

  const logWeight = (newWeight) => {
    setWeight(newWeight);
    setHistory(h => {
      const last = h[h.length - 1];
      // If last entry is "Today", replace it; else append
      if (last.date === 'Today') {
        return [...h.slice(0, -1), { ...last, weight: newWeight }];
      }
      return [...h, { week: last.week + 1, weight: newWeight, date: 'Today' }];
    });
  };

  const addFood = (food) => {
    setFoods(f => [...f, {
      ...food,
      id: 'f' + Date.now(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }]);
  };

  const removeFood = (id) => {
    setFoods(f => f.filter(x => x.id !== id));
  };

  const addWater = () => setWater(w => Math.min(12, w + 1));
  const removeWater = () => setWater(w => Math.max(0, w - 1));

  const foodsByMeal = (meal) => foods.filter(f => f.meal === meal);

  const kcalToday = foods.reduce((s, f) => s + f.kcal, 0);
  const proteinToday = foods.reduce((s, f) => s + (f.protein || 0), 0);
  const carbsToday = foods.reduce((s, f) => s + (f.carbs || 0), 0);
  const fatToday = foods.reduce((s, f) => s + (f.fat || 0), 0);
  const fiberToday = foods.reduce((s, f) => s + (f.fiber || 0), 0);
  const kcalRemaining = Math.max(0, VYTAL_USER.dailyCalorieGoal - kcalToday);
  const lostKg = (VYTAL_USER.startWeight - weight);
  const toGoalKg = Math.max(0, weight - VYTAL_USER.goalWeight);
  const progressPct = Math.min(100, (lostKg / (VYTAL_USER.startWeight - VYTAL_USER.goalWeight)) * 100);
  const bmi = weight / Math.pow(VYTAL_USER.heightCm / 100, 2);

  return {
    user: VYTAL_USER,
    weight, history, foods, water,
    logWeight, addFood, removeFood, addWater, removeWater,
    foodsByMeal,
    kcalToday, proteinToday, carbsToday, fatToday, fiberToday, kcalRemaining,
    lostKg, toGoalKg, progressPct, bmi,
    achievements: ACHIEVEMENTS,
    foodDatabase: FOOD_DATABASE,
    // Care / web-account
    webConnected, connectWeb, disconnectWeb,
    orders: ORDERS,
    consultations: CONSULTATIONS,
    prescriptions: PRESCRIPTIONS,
    todayWorkout, weeklyWorkouts, workoutStats,
    startWorkout, finishWorkout, toggleExerciseDone,
    agents, unlockedAgents, unlockAgent,
  };
}

// SVG line chart
function WeightChart({ history, stroke = '#3DBCB5', fill = 'rgba(61,188,181,0.08)', width = 340, height = 120, dotFill = '#3DBCB5', goalLine }) {
  const min = Math.min(...history.map(h => h.weight), goalLine || Infinity) - 0.6;
  const max = Math.max(...history.map(h => h.weight)) + 0.6;
  const xStep = width / (history.length - 1);
  const points = history.map((h, i) => {
    const x = i * xStep;
    const y = height - ((h.weight - min) / (max - min)) * height;
    return [x, y];
  });
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ');
  const area = `${path} L${width},${height} L0,${height} Z`;
  const goalY = goalLine != null ? height - ((goalLine - min) / (max - min)) * height : null;
  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      <path d={area} fill={fill} />
      <path d={path} stroke={stroke} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {goalY != null && <line x1="0" y1={goalY} x2={width} y2={goalY} stroke={stroke} strokeWidth="1" strokeDasharray="3 4" opacity="0.35" />}
      {points.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r={i === points.length - 1 ? 4 : 2.5} fill={dotFill} />
      ))}
    </svg>
  );
}

// Food photo placeholder
function FoodPhotoPlaceholder({ w = 56, h = 56, radius = 12, label = '' }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: radius, flexShrink: 0,
      background: 'repeating-linear-gradient(135deg, rgba(61,188,181,0.14), rgba(61,188,181,0.14) 6px, rgba(61,188,181,0.06) 6px, rgba(61,188,181,0.06) 12px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'ui-monospace, SFMono-Regular, monospace', fontSize: 9,
      color: 'rgba(61,188,181,0.5)', textAlign: 'center', padding: 4, boxSizing: 'border-box',
    }}>{label}</div>
  );
}

// Circular progress ring
function Ring({ pct, size = 140, stroke = 10, color = '#3DBCB5', bg = 'rgba(61,188,181,0.12)', children }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} stroke={bg} strokeWidth={stroke} fill="none" />
        <circle cx={size/2} cy={size/2} r={r} stroke={color} strokeWidth={stroke} fill="none"
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1)' }} />
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column',
      }}>{children}</div>
    </div>
  );
}

// Triple-ring (calories + macros layered)
function TripleRing({ kcalPct, proteinPct, carbsPct, fatPct, size = 150, children }) {
  const stroke = 8;
  const gap = 11;
  const sc = window.sageColors || {};
  const rings = [
    { pct: kcalPct, color: sc.sage || '#3DBCB5', r: (size - stroke) / 2 },
    { pct: proteinPct, color: sc.protein || '#2C7BB8', r: (size - stroke) / 2 - gap },
    { pct: carbsPct, color: sc.carbs || '#5FD4CE', r: (size - stroke) / 2 - gap * 2 },
    { pct: fatPct, color: sc.fat || '#D4B872', r: (size - stroke) / 2 - gap * 3 },
  ];
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {rings.map((ring, i) => {
          const c = 2 * Math.PI * ring.r;
          const offset = c - (Math.min(100, ring.pct) / 100) * c;
          return (
            <g key={i}>
              <circle cx={size/2} cy={size/2} r={ring.r} stroke={ring.color} strokeOpacity="0.15" strokeWidth={stroke} fill="none" />
              <circle cx={size/2} cy={size/2} r={ring.r} stroke={ring.color} strokeWidth={stroke} fill="none"
                strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 0.8s' }} />
            </g>
          );
        })}
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column',
      }}>{children}</div>
    </div>
  );
}

Object.assign(window, {
  VYTAL_USER, WEIGHT_HISTORY, SEED_FOODS_TODAY, FOOD_DATABASE, ACHIEVEMENTS,
  ORDERS, CONSULTATIONS, PRESCRIPTIONS, TODAY_WORKOUT, WEEKLY_WORKOUTS, AGENTS,
  askCoach, analyzeFoodDescription,
  useVytalState, WeightChart, FoodPhotoPlaceholder, Ring, TripleRing,
});
