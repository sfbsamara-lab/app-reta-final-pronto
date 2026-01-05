import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  Flame, Droplets, Utensils, AlertTriangle, CheckCircle2, Lock,
  ChefHat, Zap, ArrowRight, UserCircle, LogOut, Timer,
  PartyPopper, Coffee, CalendarDays, MessageSquareQuote,
  HeartPulse, ShieldAlert, Trophy 
} from 'lucide-react';

import { ViewState, Tasks, UserState, UserPlan, DailyProgress } from './types';
import { Button } from './components/Button';
import { Card } from './components/Card';
import { LockedFeature } from './components/LockedFeature';
import { UpgradeModal } from './components/UpgradeModal';
import { WorkoutModal } from './components/WorkoutModal';
import { RecipeModal } from './components/RecipeModal';
import { TutorialModal } from './components/TutorialModal';
import { ChristmasModal } from './components/ChristmasModal';
import { AuthModal } from './components/AuthModal';
import { SetPasswordModal } from './components/SetPasswordModal';
import { PixModal } from './components/PixModal';
import { RewardsModal } from './components/RewardsModal';
import { Notification } from './components/Notification';
import NotificationsSettingsModal from './components/NotificationsSettingsModal';
import ProgressHistoryModal from './components/ProgressHistoryModal';
import { Settings } from 'lucide-react';
import { ContentLibraryModal } from './components/ContentLibraryModal';
import { SetGoalsModal } from './components/SetGoalsModal';
import { SetFastingGoalModal } from './components/SetFastingGoalModal';
import { auth, db, subscribeToUserData, logoutUser, completeTutorial, saveDailyProgress, getAllDailyProgress, updateUserWaterGoal, updateUserFastingGoal, touchUserActiveDay } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

// --- DADOS ESTÁTICOS ---
// Observação: campos opcionais `allergens?: string[]` e `substitutions?: string[]`
// podem ser adicionados a receitas para indicar alergênicos e opções veganas/substituições.

const DETOX_TEAS = [
  { name: "Hibisco com Gengibre", desc: "Ação diurética e anti-inflamatória; ideal para reduzir retenção.", recipe: "Ingredientes: 1 colher de sopa de hibisco seco, 2 rodelas de gengibre, 500ml água. Preparo: ferva 500ml, desligue, adicione hibisco e gengibre, abafe 8–10min. Tomar 1 xícara após as refeições para reduzir inchaço." },
  { name: "Cavalinha com Limão", desc: "Diurético suave e remineralizante; auxilia eliminação de excesso de sódio.", recipe: "Ingredientes: 1 colher de sopa de cavalinha, suco de 1/2 limão, 500ml água. Preparo: infundir 10min e coar. Tomar 1 copo pela manhã para melhor efeito diurético." },
  { name: "Chá Verde Turbo", desc: "Termogênico e estimulante leve; ajuda na queima de gordura.", recipe: "Ingredientes: 1 saquinho de chá verde, 1 pau de canela. Preparo: infundir 3–4min em água quente (não ferver). Tomar pela manhã ou antes do treino para energia e foco." },
  { name: "Dente de Leão", desc: "Suporte hepático e depurador; indicado após refeições muito gordurosas.", recipe: "Ingredientes: 1 colher de sopa de dente de leão, 500ml água. Preparo: infundir 10min, coar. Tomar 1 xícara após refeição pesada ou no day after." },
  { name: "Matcha Revitalizante", desc: "Matcha concentrado para energia sem pico de glicemia; ótimo no pré-treino.", recipe: "Ingredientes: 1/2 colher de chá matcha, 200ml água quente (não fervente). Preparo: dissolver o matcha com água quente e bater até espumar. Tomar 30–40min antes do treino." },
  { name: "Chá de Gengibre e Limão", desc: "Apoia digestão e imunidade; alívio rápido para náuseas leves.", recipe: "Ingredientes: 3–4 rodelas de gengibre, suco de 1 limão, 500ml água. Preparo: ferver o gengibre por 5–7min, adicionar limão e beber morno." },
  { name: "Shot Anti-Inflamatório Turbo", desc: "Reduz inflamação sistêmica e retenção líquida.", recipe: "Ingredientes: 1 limão espremido, 1 colher de café de cúrcuma, 1 pitada de pimenta preta, 50ml de água morna. Preparo: Misture tudo vigorosamente e beba em jejum." },
  { name: "Chá Seca-Barriga de Hibisco", desc: "Diurético potente; elimina o inchaço do excesso de sódio.", recipe: "Ingredientes: 500ml de água, 2 colheres de sopa de hibisco, 1 pau de canela, gengibre em rodelas. Preparo: Ferva a água com gengibre e canela. Desligue, adicione hibisco e abafe por 10min. Tomar 1 xícara após as refeições." },
  { name: "Suco Verde Detoxificante", desc: "Limpeza hepática e reposição de minerais essenciais.", recipe: "Ingredientes: 1 folha de couve, 1 maçã verde, 1 pedaço de gengibre, 200ml de água de coco, hortelã a gosto. Preparo: Bata tudo no liquidificador com gelo. Não coe para manter as fibras. Tomar de manhã para melhor efeito." }
];

const SOS_RECIPES = [
  {
    name: "Omelete Proteico",
    ingredients: ["2 ovos", "50g espinafre", "30g queijo cottage", "Sal e pimenta a gosto"],
    prep: "Bata os ovos, misture com espinafre e queijo. Cozinhe em frigideira antiaderente.",
    benefits: "Rico em proteínas, sustenta e ajuda na recuperação muscular.",
    tags: ["Recovery"],
    allergens: ["ovos", "laticínios"],
    substitutions: ["Substituir ovos: 2 colheres de sopa de farinha de grão-de-bico + água (ovo vegano) ou 150g tofu amassado", "Substituir queijo cottage: 30g tofu amassado/queijo vegano"]
  },
  {
    name: "Salada de Quinoa e Legumes",
    ingredients: ["100g quinoa cozida", "Tomate cereja", "Pepino", "Cebola roxa", "Azeite, limão, sal"],
    prep: "Misture todos os ingredientes. Tempere com azeite, limão e sal.",
    benefits: "Fonte de fibras e proteínas vegetais, ideal para saciedade e digestão.",
    tags: [],
    allergens: [],
    substitutions: []
  },
  {
    name: "Peito de Frango Grelhado com Purê de Batata Doce",
    ingredients: ["150g peito de frango", "200g batata doce", "Azeite", "Sal e pimenta"],
    prep: "Tempere o frango com sal e pimenta e grelhe. Cozinhe a batata doce, amasse com um fio de azeite e sirva junto.",
    benefits: "Proteína magra e carboidrato de baixo índice glicêmico para recuperação e saciedade.",
    tags: [],
    allergens: ["frango"],
    substitutions: ["Substituir frango por 150g tofu grelhado ou 150g grão-de-bico assado para versão vegana"]
  },
  {
    name: "Salada Morna de Quinoa com Grão-de-Bico",
    ingredients: ["100g quinoa", "80g grão-de-bico cozido", "Tomate", "Pepino", "Ervas frescas"],
    prep: "Cozinhe a quinoa, misture com grão-de-bico e vegetais. Tempere com azeite e limão.",
    benefits: "Fibras, proteína vegetal e gorduras saudáveis para saciedade e digestão.",
    tags: [],
    allergens: [],
    substitutions: []
  },
  {
    name: "Bowl de Salmão e Legumes Assados",
    ingredients: ["120g salmão", "Legumes variados (abobrinha, pimentão)", "Quinoa ou arroz integral"],
    prep: "Asse os legumes e o salmão; monte o bowl com a base de grãos.",
    benefits: "Rico em ômega-3, ótimo para recuperação e controle inflamatório.",
    tags: [],
    allergens: ["peixe"],
    substitutions: ["Substituir salmão por 120g tofu marinado ou 120g grão-de-bico assado para versão sem peixe"]
  },
  {
    name: "Mousse de Chocolate Fit",
    ingredients: ["1 abacate maduro", "2 colheres de cacau em pó", "Mel ou adoçante a gosto", "Essência de baunilha"],
    prep: "Bata todos os ingredientes até obter textura cremosa. Leve à geladeira 30 minutos antes de servir.",
    benefits: "Sobremesa com gorduras saudáveis e sem açúcar refinado.",
    tags: ["Dessert"],
    allergens: [],
    substitutions: ["Caso seja vegano: substituir mel por xarope de agave ou maple syrup"]
  },
  {
    name: "Pudim de Chia e Coco",
    ingredients: ["3 colheres de chia", "200ml leite de coco", "Frutas vermelhas para cobertura"],
    prep: "Misture a chia com o leite de coco e deixe gelar por 2-4 horas. Sirva com frutas por cima.",
    benefits: "Fonte de fibras e gorduras boas; ótimo para saciedade.",
    tags: ["Dessert"],
    allergens: [],
    substitutions: []
  },
];

const SOS_CARDIO = [
  {
    title: "Caminhada em Jejum (AEJ)",
    duration: "30 a 45 minutos",
    intensity: "Leve/Moderada",
    tags: ["Cardio"],
    desc: "Mantenha um passo firme onde você consiga falar, mas sinta que falta um pouco de ar.",
    steps: ["Beba 500ml de água antes.", "Não consuma nada calórico.", "Se sentir tontura, pare imediatamente."],
    youtubeLink: "" // Removido o link conforme solicitado
  },

  {
    title: "HIIT Queima-Glicogênio",
    duration: "15 minutos",
    intensity: "Altíssima",
    tags: ["HIIT","Metabólico"],
    desc: "O objetivo é esvaziar os estoques de açúcar do sangue rapidamente.",
    steps: ["3 min aquecimento leve.", "30 segundos correndo no MÁXIMO.", "30 segundos andando bem devagar.", "Repita 15 vezes."],
    youtubeLink: "https://www.youtube.com/watch?v=D8nuuuUQUT0"
  },
  {
    title: "Alongamento Dinâmico",
    duration: "10 minutos",
    intensity: "Leve",
    tags: ["Metabólico"],
    desc: "Melhora a flexibilidade e prepara o corpo para o movimento.",
    steps: ["Comece com rotações de braço.", "Continue com alongamentos de perna e tronco.", "Respire profundamente em cada movimento."],
    youtubeLink: "https://www.youtube.com/watch?v=oa6qBacNZPE"
  },
  {
    title: "Yoga para Iniciantes",
    duration: "20 minutos",
    intensity: "Leve/Moderada",
    tags: [],
    desc: "Fortalece o corpo e acalma a mente.",
    steps: ["Comece com posturas básicas como Tadasana.", "Prossiga para Vrikshasana (Postura da Árvore) e Adho Mukha Svanasana (Cachorro Olhando Para Baixo).", "Finalize com Savasana (Postura do Cadáver) para relaxamento."],
    youtubeLink: "https://www.youtube.com/watch?v=v7AYKMP6rOE" // Yoga para iniciantes (alternativo)
  }
];

// --- COMPONENTE DO TIMER ---
const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    // Contador Carnaval 2026 — alvo: 13/02/2026 18:00
    const targetDate = new Date('2026-02-13T18:00:00');
    const interval = setInterval(() => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          mins: Math.floor((diff / 1000 / 60) % 60),
          secs: Math.floor((diff / 1000) % 60),
        });
      } else {
        // quando passar a data, zera o contador
        setTimeLeft({ days: 0, hours: 0, mins: 0, secs: 0 });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div className="mb-2 text-sm font-bold text-slate-300">O ano já começou. Você tem <span className="text-white">{timeLeft.days}</span> dias para o seu melhor shape.</div>
      <div className="bg-slate-900/60 backdrop-blur border border-slate-700/50 rounded-lg p-4 flex justify-between items-center text-slate-200 font-mono">
        <div className="text-center"><span className="block text-2xl font-bold">{timeLeft.days}</span><span className="text-[10px] uppercase">Dias</span></div>
        <span className="pb-4">:</span>
        <div className="text-center"><span className="block text-2xl font-bold">{timeLeft.hours}</span><span className="text-[10px] uppercase">Hr</span></div>
        <span className="pb-4">:</span>
        <div className="text-center"><span className="block text-2xl font-bold">{timeLeft.mins}</span><span className="text-[10px] uppercase">Min</span></div>
        <span className="pb-4">:</span>
        <div className="text-center"><span className="block text-2xl font-bold text-carnival-primary">{timeLeft.secs}</span><span className="text-[10px] uppercase">Seg</span></div>
      </div>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState<UserState | null>(null);
  const [, setLoadingUser] = useState(true);

  const prevUserRef = useRef<UserState | null>(null);

  const [view, setView] = useState<ViewState>('onboarding');
  const [tasks, setTasks] = useState<Tasks>({ water: 0, fasting: false, workout: false });

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [showChristmasModal, setShowChristmasModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authInitialTab, setAuthInitialTab] = useState<'login' | 'register' | undefined>(undefined);

  // Abre automaticamente o modal de cadastro se a rota/param secreta for usada
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isVipRoute = window.location.pathname === '/cadastro-vip';
    if (isVipRoute && !user) {
      setAuthInitialTab('register');
      setShowAuthModal(true);
    }
  }, [user]);
  const [showRewardsModal, setShowRewardsModal] = useState(false);
  const [showPixModal, setShowPixModal] = useState<{show: boolean, title: string, price: string}>({show: false, title: '', price: ''});
  const [showCelebration, setShowCelebration] = useState(false);
  const [dailyProgressHistory, setDailyProgressHistory] = useState<DailyProgress[]>([]);
  const [notification, setNotification] = useState<{ message: string; type?: 'success' | 'error' | 'info' | 'warning' } | null>(null);
  const [showNotificationsSettings, setShowNotificationsSettings] = useState(false);
  const [showProgressHistoryModal, setShowProgressHistoryModal] = useState(false);
  const [showContentLibraryModal, setShowContentLibraryModal] = useState(false);
  const [showSetGoalsModal, setShowSetGoalsModal] = useState(false);
  const [showSetFastingGoalsModal, setShowSetFastingGoalsModal] = useState(false);
  // Removidos showGeneralChatModal e showSabotageScannerModal

  // --- EFEITOS ---

  // Auth & Sync
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // NÃO marcar o dia ativo automaticamente ao detectar o auth; exigimos interação do usuário
        const unsubscribeData = subscribeToUserData(firebaseUser.uid, (data) => {
          const today = new Date().toISOString().split('T')[0];
          let loadedTasks = { water: 0, fasting: false, workout: false };
          const localTasks = localStorage.getItem(`tasks_${firebaseUser.uid}_${today}`);
          if (localTasks) loadedTasks = JSON.parse(localTasks);

          const newUserState: UserState = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            tipo_plano: data?.tipo_plano || 'basic',
            streak: data?.streak || 1,
            lastActiveDate: data?.lastActiveDate,
            hasSeenTutorial: data?.hasSeenTutorial || false,
            hasChristmasAddon: data?.hasChristmasAddon || false,
            requiresNewPassword: data?.requiresNewPassword || false
          };

          if (prevUserRef.current && prevUserRef.current.tipo_plano === 'basic' && newUserState.tipo_plano !== 'basic') {
            setShowCelebration(true);
            setTimeout(() => setShowCelebration(false), 5000);
            setShowPixModal({ show: false, title: '', price: '' });
            setShowUpgradeModal(false);
          }
          if (prevUserRef.current && !prevUserRef.current.hasChristmasAddon && newUserState.hasChristmasAddon) {
             setShowCelebration(true);
             setTimeout(() => setShowCelebration(false), 5000);
             setShowPixModal({ show: false, title: '', price: '' });
          }

          // Se o streak aumentou em relação ao estado anterior, celebra!
          if (prevUserRef.current && newUserState.streak > prevUserRef.current.streak) {
            setShowCelebration(true);
            setTimeout(() => setShowCelebration(false), 5000);
          }

          setUser(newUserState);
          prevUserRef.current = newUserState;

          setTasks(loadedTasks);
          setView('dashboard');
          setLoadingUser(false);
        });
        return () => unsubscribeData();
      } else {
        setUser(null);
        prevUserRef.current = null;
        setView('onboarding');
        setLoadingUser(false);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  // Se a rota for /entrar (ex.: PWA start_url), abre o modal de login automaticamente
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const path = window.location.pathname;
    const search = window.location.search;
    if (path === '/entrar' || search.includes('entry=install') || search.includes('source=install')) {
      setAuthInitialTab('login');
      setShowAuthModal(true);
    }
  }, []);

  // Marca o usuário como ativo (touchUserActiveDay) na primeira interação do dia (click/tecla/toque)
  useEffect(() => {
    if (!user) return;
    const today = new Date().toISOString().split('T')[0];
    const key = `activeMarked_${user.uid}_${today}`;
    if (localStorage.getItem(key)) return; // já marcado hoje

    const markActive = async () => {
      try {
        const res = await touchUserActiveDay(user.uid);
        if (res?.updated) localStorage.setItem(key, '1');
      } catch (e) {
        console.warn('[Activity] touchUserActiveDay falhou:', e);
      }
    };

    const handler = () => { markActive(); };
    window.addEventListener('click', handler);
    window.addEventListener('keydown', handler);
    window.addEventListener('touchstart', handler);

    return () => {
      window.removeEventListener('click', handler);
      window.removeEventListener('keydown', handler);
      window.removeEventListener('touchstart', handler);
    };
  }, [user]);

  // Persist Tasks: gravar local + salvar progresso diário. Também contabiliza atividade do usuário (touch)
  useEffect(() => {
    if (user) {
      const today = new Date().toISOString().split('T')[0];
      localStorage.setItem(`tasks_${user.uid}_${today}`, JSON.stringify(tasks));
      saveDailyProgress(user.uid, tasks.water, tasks.fasting, tasks.workout);
      touchUserActiveDay(user.uid).catch((e) => console.warn('[Tasks] touchUserActiveDay falhou:', e));
    }
  }, [tasks, user]);

  // Persist Tasks
  useEffect(() => {
    if (user) {
      const today = new Date().toISOString().split('T')[0];
      localStorage.setItem(`tasks_${user.uid}_${today}`, JSON.stringify(tasks));
      saveDailyProgress(user.uid, tasks.water, tasks.fasting, tasks.workout);
    }
  }, [tasks, user]);

  // Load Daily Progress History
  useEffect(() => {
    if (user) {
      const fetchHistory = async () => {
        const result = await getAllDailyProgress(user.uid);
        if (result.success && result.data) {
          setDailyProgressHistory(result.data);
          if (import.meta.env.DEV) console.log("Histórico de Progresso Diário: ", result.data);
        }
      };
      fetchHistory();
    }
  }, [user]);

  // Progress logic
  const waterGoal = user?.waterGoal || 3000;
  const progress = useMemo(() => {
      return Math.round(((tasks.water / waterGoal) * 0.33 + (tasks.fasting ? 0.33 : 0) + (tasks.workout ? 0.33 : 0)) * 100);
  }, [tasks, waterGoal]);

  useEffect(() => {
    if (progress >= 99 && !showCelebration) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 5000);
    }
  }, [progress, showCelebration]);

  // Notificação de Hidratação (Exemplo)
  useEffect(() => {
    if (user && tasks.water < waterGoal && new Date().getHours() >= 18) {
      const timer = setTimeout(() => {
        setNotification({ message: 'Lembre-se de beber mais água para atingir sua meta!', type: 'info' });
      }, 30000); // Tenta notificar após 30 segundos se a condição for verdadeira
      return () => clearTimeout(timer);
    }
  }, [user, tasks.water, waterGoal]);

  // --- LEMBRETES IN-APP (água, treino, manter a chama) ---
  // Horários em HH:MM (24h)
  const REMINDER_SCHEDULE: Record<string, string[]> = {
    water: ['10:00', '14:00', '18:00'],
    workout: ['07:00'],
    flame: ['20:30']
  };

  // Mensagens motivacionais atualizadas para Carnaval
  const getDaysUntilCarnaval = () => {
    const target = new Date('2026-02-13T18:00:00');
    const now = new Date();
    const diffDays = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const MOTIVATIONAL_MESSAGES = [
    "SARGENTO: 15 minutos — sem desculpas. Execute o treino agora!",
    "SARGENTO: Treino feito hoje = abadá pronto. Sem chororô, mãos no trabalho.",
    "SARGENTO: Rápido, intenso e eficiente. Você consegue — agora!",
  ];

  // Garante índice correto ao escolher mensagem aleatória
  const randomMotivational = () => MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)];

  const todayKey = () => {
    const d = new Date();
    return d.toISOString().split('T')[0]; // YYYY-MM-DD
  };

  const getSentRemindersForToday = (): Record<string, boolean> => {
    try {
      const raw = localStorage.getItem(`sentReminders_${todayKey()}`);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  };

  const markReminderSent = async (type: string) => {
    const today = todayKey();
    const key = `sentReminders_${today}`;
    const current = getSentRemindersForToday();
    current[type] = true;
    localStorage.setItem(key, JSON.stringify(current));

    // Se o usuário estiver logado, grava no Firestore para consistência entre aparelhos
    try {
      if (user && user.uid) {
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, { lastReminders: { [type]: today } }, { merge: true });
      }
    } catch (e) {
      console.warn('[Reminders] Falha ao gravar lastReminders no Firestore:', e);
    }
  };

  const isReminderEnabled = (type: 'water' | 'workout' | 'flame') => {
    // Prefer settings saved on user doc
    if (user && (user as any).notificationSettings) {
      const s = (user as any).notificationSettings as Record<string, boolean>;
      if (s[type] !== undefined) return !!s[type];
    }

    // Fallback to localStorage
    try {
      const raw = localStorage.getItem('notificationSettings');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed[type] !== undefined) return !!parsed[type];
      }
    } catch (e) {}

    return true; // default on
  };

  const sendReminder = async (type: 'water' | 'workout' | 'flame') => {
    if (!isReminderEnabled(type)) return;

    if (type === 'water') {
      setNotification({ message: 'Lembre-se de beber água para alcançar sua meta de hoje.', type: 'info' });
    } else if (type === 'workout') {
        // usa mensagens motivacionais (aleatórias das principais)
      setNotification({ message: randomMotivational(), type: 'info' });
    } else if (type === 'flame') {
      const days = getDaysUntilCarnaval();
      setNotification({ message: `O ano já começou. Você tem ${days} dias para o seu melhor shape — bora treinar!`, type: 'success' });
    }
    await markReminderSent(type);
  };

  useEffect(() => {
    let interval: any = null;

    const checkReminders = async () => {
      const now = new Date();
      const hhmm = now.toTimeString().slice(0,5); // HH:MM
      const sent = getSentRemindersForToday();

      // Água: notifica se abaixo da meta
      if (REMINDER_SCHEDULE.water.includes(hhmm) && !sent.water) {
        if (tasks.water < (user?.waterGoal || 3000)) await sendReminder('water');
      }

      // Treino: notifica se ainda não realizou treino hoje
      if (REMINDER_SCHEDULE.workout.includes(hhmm) && !sent.workout) {
        if (!tasks.workout) await sendReminder('workout');
      }

      // Mantenha a chama: notifica ao final do dia se nem todos hábitos foram completados
      if (REMINDER_SCHEDULE.flame.includes(hhmm) && !sent.flame) {
        const completedAll = tasks.water >= (user?.waterGoal || 3000) && tasks.workout && tasks.fasting;
        if (!completedAll) await sendReminder('flame');
      }
    };

    // Checa a cada minuto
    interval = setInterval(checkReminders, 60 * 1000);
    // Primeira checagem imediata (no mount)
    checkReminders();

    return () => clearInterval(interval);
  }, [user, tasks]);

  // --- LÓGICA DE NEGÓCIO ---

  const todaysTea = useMemo(() => DETOX_TEAS[new Date().getDate() % DETOX_TEAS.length], []);
  const todaysSOSRecipe = useMemo(() => {
    const candidates = SOS_RECIPES.filter(r => Array.isArray(r.ingredients) && r.ingredients.length > 0 && r.prep && r.prep.trim().length > 0);
    if (candidates.length === 0) return SOS_RECIPES[0];
    return candidates[new Date().getDate() % candidates.length];
  }, []);
  const todaysSOSCardio = useMemo(() => SOS_CARDIO[new Date().getDate() % SOS_CARDIO.length], []);

  const handlePurchase = (plan: UserPlan) => {
    // Se não estiver logado, redireciona para a página de checkout (nova aba)
    if (!user) { window.open('https://pay.kiwify.com.br/Akrjt0G', '_blank'); return; }
    if (plan === 'basic') { setView('dashboard'); return; }
    if (plan === 'general') setShowUpgradeModal(true);
  };

  const startUpgradeFlow = () => {
    setShowUpgradeModal(false);
    setShowPixModal({
      show: true,
      title: "Upgrade Premium (Acesso Total)",
      price: "R$ 29,90"
    });
  };

  const startChristmasFlow = () => {
    setShowPixModal({
      show: true,
      title: "Kit Blindagem Carnaval",
      price: "R$ 14,90"
    });
  };


  const handleCloseWorkout = useCallback(() => {
    setShowWorkoutModal(false);
  }, []);

  const handleCompleteWorkout = useCallback(() => {
    setTasks(p => ({...p, workout: true}));
    setShowWorkoutModal(false);
  }, []);

  return (
    <>
      {user?.requiresNewPassword && <SetPasswordModal />}
{showAuthModal && <AuthModal onClose={() => { setShowAuthModal(false); setAuthInitialTab(undefined); }} onSuccess={() => { setShowAuthModal(false); setAuthInitialTab(undefined); }} initialTab={authInitialTab} /> }

      {showRewardsModal && user && <RewardsModal streak={user.streak} onClose={() => setShowRewardsModal(false)} />}

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}


      {/* Novos Modais de IA */} 

      {showPixModal.show && (
        <PixModal
          onClose={() => setShowPixModal({...showPixModal, show: false})}
          itemTitle={showPixModal.title}
          price={showPixModal.price}
        />
      )}

      {showContentLibraryModal && user?.tipo_plano !== 'basic' && (
        <ContentLibraryModal
          onClose={() => setShowContentLibraryModal(false)}
          detoxTeas={DETOX_TEAS}
          sosRecipes={SOS_RECIPES}
          sosCardio={SOS_CARDIO}
        />
      )}
      {showSetGoalsModal && user && (
        <SetGoalsModal
          onClose={() => setShowSetGoalsModal(false)}
          currentWaterGoal={user.waterGoal || 3000}
          onSave={async (newGoal) => {
            if (!user || !user.uid) {
              console.error("[App.tsx] Usuário ou UID não definidos ao tentar salvar a meta de água.");
              return false;
            }
            const result = await updateUserWaterGoal(user.uid, newGoal);
            if (result.success) {
              setUser(prev => prev ? { ...prev, waterGoal: newGoal } : null);
            }
            else {
              console.error("[App.tsx] Erro ao salvar meta de água: ", result.error);
            }
            return result.success;
          }}
        />
      )}
      {showSetFastingGoalsModal && user && (
        <SetFastingGoalModal
          onClose={() => setShowSetFastingGoalsModal(false)}
          currentFastingGoal={user.fastingGoal || 16}
          onSave={async (newGoal) => {
            if (!user || !user.uid) {
              console.error("[App.tsx] Usuário ou UID não definidos ao tentar salvar a meta de jejum.");
              return false;
            }
            const result = await updateUserFastingGoal(user.uid, newGoal);
            if (result.success) {
              setUser(prev => prev ? { ...prev, fastingGoal: newGoal } : null);
            }
            else {
              console.error("[App.tsx] Erro ao salvar meta de jejum:", result.error);
            }
            return result.success;
          }}
        />
      )}
      {/* --- VIEW: ONBOARDING --- */}
      {view === 'onboarding' && (
        <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop')] bg-cover bg-center flex flex-col items-center justify-between p-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/90 to-slate-900/70" />
          <div className="absolute top-4 right-4 z-20">
             <button onClick={() => { setAuthInitialTab('login'); setShowAuthModal(true); }} className="flex items-center gap-2 text-sm font-bold text-black bg-yellow-400 px-4 py-2 rounded-full border border-yellow-600 hover:brightness-95 transition-all shadow-lg">
               <UserCircle className="w-4 h-4" /> Entrar
             </button>
          </div>
          <div className="relative z-10 w-full max-w-md pt-10">
            <div className="flex justify-center mb-6">
              <div className="bg-orange-600/20 p-4 rounded-full border border-orange-500/50 animate-pulse-fast cursor-pointer">
                <Flame className="w-12 h-12 text-orange-500" />
              </div>
            </div>
            <h1 className="text-5xl font-black mb-2 text-white uppercase italic drop-shadow-lg">Reta Final <span className="text-orange-500">2025</span></h1>
            <p className="text-slate-300 text-lg font-medium">Rotina Reta Final. <span className="text-white font-bold border-b-2 border-orange-500">Resultados Reais com apenas 15 minutos por dia</span></p>
          </div>

          <div className="relative z-10 w-full max-w-md my-4">
             <div className="text-xs text-slate-400 mb-2 font-bold">Promoção Carnaval — tempo limitado</div>
             <CountdownTimer />
             <div className="flex justify-between items-end mb-1.5 px-1 mt-4">
               <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest flex items-center gap-1"><CalendarDays className="w-3 h-3"/> Alvo: Carnaval '26</span>
               <span className="text-[10px] uppercase font-black text-carnival-primary tracking-wide animate-pulse bg-carnival-primary/10 px-2 py-0.5 rounded border border-carnival-primary/20">Promoção por tempo limitado</span>
            </div>
          </div>

          <div className="relative z-10 w-full max-w-md space-y-4 pb-6">
            {/* Admin panel: só aparece com ?admin=true na URL (para gerar códigos de lançamento) */}

            <button onClick={() => handlePurchase('general')} className="relative w-full bg-slate-900 rounded-xl p-4 flex items-center justify-between border border-yellow-500/50 hover:bg-slate-800 transition-all active:scale-[0.98] group">
              <div className="absolute inset-0 bg-yellow-500/5 group-hover:bg-yellow-500/10 transition-colors rounded-xl"></div>
              <div className="text-left relative z-10">
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black text-[10px] font-black px-2 py-0.5 rounded uppercase shadow-lg shadow-orange-500/20 flex items-center gap-1">
                    OFERTA LIMITADA ⏳ <Flame className="w-3 h-3 fill-black"/>
                  </span>
                </div>
                <p className="text-white font-black text-xl italic uppercase">Modo General</p>
                <p className="text-slate-400 text-xs mt-0.5">ACESSO TOTAL + BÔNUS DESAFIO MUSA 2026</p>
              </div>
              <div className="text-right relative z-10">
                <p className="text-slate-500 text-xs line-through font-medium mb-0.5">De R$ 97,90</p>
                <p className="text-yellow-500 font-black text-2xl drop-shadow-sm">R$ 29,90</p>
              </div>
            </button>



            <p className="text-[10px] text-slate-500 uppercase tracking-widest pt-2">
              Compra Segura • Acesso Imediato
            </p>
            <p className="text-[10px] text-slate-700 font-mono">v2.1 - Stable</p>
          </div>
        </div>
      )}

      {/* --- VIEW: DASHBOARD --- */}
      {view === 'dashboard' && user && (
        <div className="min-h-screen bg-slate-950 text-slate-200 pb-32 relative">
          {!user.hasSeenTutorial && <TutorialModal onClose={async () => { await new Promise(resolve => setTimeout(resolve, 100)); await completeTutorial(user.uid); }} />}

          {showUpgradeModal && <UpgradeModal onClose={() => setShowUpgradeModal(false)} onRedeemClick={startUpgradeFlow} />}
          {showWorkoutModal && (
            <WorkoutModal
              onClose={handleCloseWorkout}
              onComplete={handleCompleteWorkout}
              userPlan={user.tipo_plano}
              onUpgradeRequest={startUpgradeFlow}
            />
          )}

          {showRecipeModal && <RecipeModal onClose={() => setShowRecipeModal(false)} dailyTea={todaysTea} />}
          {showChristmasModal && <ChristmasModal onClose={() => setShowChristmasModal(false)} />}

          <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-20 px-4 py-3 flex justify-between items-center shadow-lg">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-black tracking-tighter text-white text-lg italic">RETA FINAL</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${user.tipo_plano !== 'basic' ? 'bg-yellow-500 text-black' : 'bg-slate-700 text-slate-300'}`}>{user.tipo_plano === 'basic' ? 'Soldado' : 'General'}</span>
              </div>
              <div className="mt-1">
                <button
                  onClick={() => setShowRewardsModal(true)}
                  className="flex items-center gap-2 px-2 py-1 bg-slate-900/50 hover:bg-slate-800 rounded-lg border border-slate-700 transition-all active:scale-95 group"
                >
                  <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-orange-500">{user.streak} dias</span>
                  <div className="w-px h-3 bg-slate-700 mx-1"></div>
                  <Trophy className="w-3 h-3 text-yellow-500 group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowNotificationsSettings(true)} className="text-slate-500 hover:text-white p-2"><Settings className="w-5 h-5"/></button>
              <button onClick={() => { logoutUser(); setView('onboarding'); }} className="text-slate-500 hover:text-white p-2"><LogOut className="w-5 h-5"/></button>
            </div>
          </header>

          <main className="p-4 space-y-6 max-w-md mx-auto mt-2">
            {showCelebration && (
              <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
                <div className="absolute inset-0 bg-black/20" />
                <div className="animate-in zoom-in duration-500 text-center">
                  <PartyPopper className="w-32 h-32 text-yellow-500 animate-bounce mx-auto" /><h2 className="text-4xl font-black text-white uppercase italic drop-shadow-[0_0_20px_rgba(234,179,8,0.8)]">MISSÃO CUMPRIDA!</h2>
                </div>
              </div>
            )}
            {showNotificationsSettings && <NotificationsSettingsModal onClose={() => setShowNotificationsSettings(false)} />}
              {showProgressHistoryModal && <ProgressHistoryModal history={dailyProgressHistory} waterGoal={user?.waterGoal} onClose={() => setShowProgressHistoryModal(false)} />}
            <div className="animate-in fade-in slide-in-from-top-4 duration-700 relative">
               <button onClick={user.hasChristmasAddon ? () => setShowChristmasModal(true) : startChristmasFlow} className={`w-full bg-gradient-to-r from-red-900 to-slate-900 border ${!user.hasChristmasAddon ? 'border-yellow-500/50' : 'border-red-500/30'} p-4 rounded-xl flex items-center justify-between shadow-lg shadow-red-900/20 group hover:border-red-500/50 transition-all relative overflow-hidden`}>
                  <div className="flex items-center gap-3">
                      <div className="relative"><PartyPopper className="w-6 h-6 text-carnival-primary" />{!user.hasChristmasAddon && (<div className="absolute -top-2 -right-2 bg-yellow-500 rounded-full p-1 border border-black shadow"><Lock className="w-2 h-2 text-black" /></div>)}</div>
                      <div className="text-left"><span className="text-white font-bold uppercase text-sm block">Desafio Musa 2026</span>{!user.hasChristmasAddon ? (<span className="text-[10px] text-yellow-500 font-bold uppercase">Comprar: R$ 14,90</span>) : (<span className="text-[10px] text-green-400 font-bold uppercase">Liberado</span>)}</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-carnival-primary" />
                </button>
            </div>

            <Card className="relative overflow-visible">
              <div className="flex justify-between items-end mb-2 relative z-10"><h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Consistência</h2><span className="text-3xl font-black text-white italic">{progress}%</span></div>
              <div className="h-4 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700 relative z-10"><div className={`h-full transition-all duration-700 ease-out bg-gradient-to-r from-orange-500 via-red-500 to-orange-600`} style={{ width: `${progress}%` }} /></div>
              <div className="flex items-center gap-2 mt-2"><Timer className="w-4 h-4 text-slate-500" /><p className="text-[10px] text-slate-500">Reseta à meia-noite</p></div>
            </Card>

            {/* Histórico de Progresso Diário (resumido) */}
            <div className="space-y-4 pt-4 border-t border-slate-800/50">
              <div className="flex items-center justify-between">
                <h3 className="text-yellow-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-yellow-500" /> Histórico de Progresso
                </h3>
                <button onClick={() => setShowProgressHistoryModal(true)} className="bg-yellow-500 text-black font-bold px-3 py-2 rounded-lg shadow">Ver histórico</button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-4"><div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 border border-blue-500/20"><Droplets className="w-6 h-6"/></div><div><p className="font-bold text-sm text-slate-200">Hidratação</p><p className="text-xs text-slate-500 mt-0.5">{tasks.water} / {waterGoal}ml</p></div></div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setTasks(p => ({...p, water: Math.min(p.water + 500, waterGoal)}))} className="text-xs font-bold bg-blue-600 text-white px-4 py-2 rounded-lg">+500ml</button>
                    <button onClick={() => {
                      setShowSetGoalsModal(true);
                    }} className="text-xs font-bold text-blue-400 border border-blue-600/50 px-3 py-2 rounded-lg hover:bg-blue-600/20 transition-colors">Definir Meta</button>
                  </div>
              </div>

              <div onClick={() => setTasks(p => ({...p, fasting: !p.fasting}))} className={`p-4 rounded-xl border cursor-pointer flex items-center justify-between transition-colors ${tasks.fasting ? 'bg-emerald-950/30 border-emerald-500/50' : 'bg-slate-900 border-slate-800'}`}>
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-slate-800 rounded-lg shrink-0"><Utensils className={`w-6 h-6 ${tasks.fasting ? 'text-emerald-400' : 'text-slate-500'}`}/></div>
                    <div>
                      <p className={`font-bold text-sm ${tasks.fasting ? 'text-emerald-400' : 'text-slate-200'}`}>Jejum {user?.fastingGoal || 16}h</p>
                    <p className="text-[10px] text-slate-500 mt-1 leading-tight"><span className="text-emerald-500/80 font-bold">Liberado:</span> Água, Café e Chás (naturais).<br/><span className="text-red-500/70 font-bold">Proibido:</span> Açúcar, Adoçante ou Leite.</p>
                    <button onClick={(e) => { e.stopPropagation(); setShowSetFastingGoalsModal(true); }} className="text-xs font-bold text-emerald-400 border border-emerald-600/50 px-3 py-2 rounded-lg hover:bg-emerald-600/20 transition-colors mt-2">Definir Meta</button>
                    </div>
                  </div>
                  <CheckCircle2 className={`w-6 h-6 ${tasks.fasting ? 'text-emerald-500' : 'text-slate-700'}`} />
              </div>

              <div className={`p-4 rounded-xl border flex items-center justify-between ${tasks.workout ? 'bg-emerald-950/30 border-emerald-500/50' : 'bg-slate-900 border-slate-800'}`}>
                  <div className="flex items-center gap-4 cursor-pointer flex-1" onClick={() => setShowWorkoutModal(true)}>
                    <div className="p-2 bg-slate-800 rounded-lg"><Flame className={`w-6 h-6 ${tasks.workout ? 'text-emerald-400' : 'text-slate-500'}`}/></div>
                    <div><p className={`font-bold text-sm ${tasks.workout ? 'text-emerald-400' : 'text-slate-200'} underline decoration-dotted`}>Treino Metabólico</p><p className="text-xs text-slate-500">Clique para ver execução</p></div>
                  </div>
                  <CheckCircle2 className={`w-6 h-6 ${tasks.workout ? 'text-emerald-500' : 'text-slate-700'}`} />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-800/50">
              <div className="flex justify-between items-center"><div className="flex items-center gap-2"><Zap className="w-4 h-4 text-yellow-500" /><h3 className="text-yellow-500 text-xs font-bold uppercase tracking-widest">Aceleradores (Premium)</h3></div>{user.tipo_plano === 'basic' && <Lock className="w-3 h-3 text-yellow-600" />}</div>
              {user.tipo_plano !== 'basic' ? (
                  <div className="space-y-3">
                    <Card onClick={() => setShowRecipeModal(true)} className="cursor-pointer border-yellow-500/30"><div className="flex items-start gap-4"><ChefHat className="w-6 h-6 text-yellow-500"/><div><h4 className="font-bold text-white text-sm">Almoço Metabólico</h4><p className="text-xs text-slate-400">Ver receita do dia</p></div></div></Card>
                    
                    {/* Removidos Cards para Sala de Guerra e Scanner de Sabotagem */}

                    <Card onClick={() => setShowContentLibraryModal(true)} className="cursor-pointer bg-gradient-to-br from-slate-900 to-slate-800 border-yellow-500/30">
                      <div className="flex items-start gap-4">
                        <MessageSquareQuote className="w-6 h-6 text-yellow-500"/>
                        <div>
                          <h4 className="font-bold text-white text-sm">Biblioteca de Conteúdo</h4>
                          <p className="text-xs text-slate-400">Chás, receitas e treinos completos</p>
                        </div>
                      </div>
                    </Card>

                    <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-yellow-500/30"><div className="flex items-start gap-4"><div className="p-2 rounded bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"><MessageSquareQuote className="w-6 h-6"/></div><div><h4 className="font-bold text-white text-sm mb-1">Mentalidade de Aço</h4><p className="text-sm text-slate-300 italic leading-relaxed">"A dor da disciplina é temporária. A dor do arrependimento é eterna."</p></div></div></Card>
                  </div>
              ) : (
                  <div className="space-y-3">
                    <LockedFeature title="Cardápio do Dia" subtitle="Liberar dieta" onClick={() => setShowUpgradeModal(true)} />
                    <LockedFeature title="Biblioteca de Conteúdo" subtitle="Liberar acesso total" onClick={() => setShowUpgradeModal(true)} />
                    {/* Removidos LockedFeatures para Sala de Guerra e Scanner de Sabotagem */}
                  </div>
              )}
            </div>
          </main>

          <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-950 via-slate-950 to-transparent z-30">
            <div className="max-w-md mx-auto relative">
              <Button
                variant="danger"
                fullWidth
                onClick={() => {
                  if (user.tipo_plano === 'basic') {
                    startUpgradeFlow();
                  } else {
                    setView('panic');
                  }
                }}
                className="text-sm shadow-xl relative"
              >
                {user.tipo_plano === 'basic' && <Lock className="w-4 h-4 absolute left-4 text-white/50" />}
                <AlertTriangle className="w-5 h-5" /> SOS: FUREI A DIETA
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* --- VIEW: PANIC (SOS) --- */}
      {view === 'panic' && (
        <div className="min-h-screen bg-red-950 text-white overflow-y-auto pb-8">
           <div className="p-6 text-center border-b border-red-900/50 bg-red-950/90 backdrop-blur sticky top-0 z-20">
              <div className="flex justify-center mb-2">
                 <div className="p-3 bg-red-900/50 rounded-full animate-bounce">
                    <ShieldAlert className="w-12 h-12 text-red-500" />
                 </div>
              </div>
              <h2 className="text-3xl font-black uppercase italic drop-shadow-lg">Protocolo SOS</h2>
              <p className="text-red-200 text-sm mt-1">Sua rota de fuga para voltar ao jogo.</p>
           </div>

           <div className="p-4 space-y-6 max-w-md mx-auto">
              <div className="bg-red-900/30 border border-red-800 rounded-xl overflow-hidden shadow-lg">
                 <div className="bg-red-900/50 p-3 flex items-center gap-2 border-b border-red-800">
                    <Coffee className="w-5 h-5 text-red-300" />
                    <h3 className="font-bold uppercase text-sm tracking-wide text-red-100">O Antídoto de Hoje</h3>
                 </div>
                 <div className="p-4">
                    <h4 className="text-xl font-bold text-white mb-2">{todaysSOSRecipe.name}</h4>
                    <p className="text-xs text-red-300 italic mb-4">{todaysSOSRecipe.benefits}</p>

                    <div className="space-y-2 mb-4">
                       {todaysSOSRecipe.ingredients.map((ing, i) => (
                          <div key={i} className="flex gap-2 text-sm text-red-100 items-start">
                             <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                             {ing}
                          </div>
                       ))}
                    </div>

                    <div className="bg-red-950/50 p-3 rounded-lg border border-red-900">
                       <p className="text-xs text-red-200 font-bold mb-1">PREPARO:</p>
                       <p className="text-sm text-red-100 leading-relaxed">{todaysSOSRecipe.prep}</p>
                    </div>
                 </div>
              </div>

              <div className="bg-red-900/30 border border-red-800 rounded-xl overflow-hidden shadow-lg">
                 <div className="bg-red-900/50 p-3 flex items-center gap-2 border-b border-red-800">
                    <HeartPulse className="w-5 h-5 text-red-300" />
                    <h3 className="font-bold uppercase text-sm tracking-wide text-red-100">Movimento Obrigatório</h3>
                 </div>
                 <div className="p-4">
                    <h4 className="text-xl font-bold text-white mb-1">{todaysSOSCardio.title}</h4>
                    <div className="flex gap-2 mb-3">
                       <span className="text-[10px] bg-red-950 border border-red-800 px-2 py-0.5 rounded text-red-300 uppercase">{todaysSOSCardio.duration}</span>
                       <span className="text-[10px] bg-red-950 border border-red-800 px-2 py-0.5 rounded text-red-300 uppercase">{todaysSOSCardio.intensity}</span>
                    </div>

                    <p className="text-sm text-red-200 mb-4 italic">"{todaysSOSCardio.desc}"</p>

                    <div className="space-y-2 mb-4">
                       {todaysSOSCardio.steps.map((step, i) => (
                          <div key={i} className="flex gap-3 bg-red-950/30 p-2 rounded items-center">
                             <span className="font-bold text-red-500 text-xs">{i+1}</span>
                             <p className="text-sm text-red-100">{step}</p>
                          </div>
                       ))}
                    </div>
                    {todaysSOSCardio.youtubeLink && (
                      <button
                        onClick={() => window.open(todaysSOSCardio.youtubeLink, '_blank')}
                        className="w-full text-xs font-bold bg-red-700 text-white px-4 py-2 rounded-lg mt-4 hover:bg-red-800 transition-colors"
                      >
                        VER EXECUÇÃO
                      </button>
                    )}
                 </div>
              </div>

              <div className="space-y-3">
                 <Button variant="outline-danger" fullWidth onClick={() => setView('dashboard')}>
                   VOLTAR AO FOCO
                 </Button>
              </div>
           </div>
        </div>
      )}
    </>
  );
}