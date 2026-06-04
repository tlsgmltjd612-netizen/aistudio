import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  User, 
  Users, 
  Percent, 
  RefreshCw, 
  Ticket, 
  CheckCircle2,
  ShoppingBag,
  Bell,
  MousePointer2,
  Volume2
} from 'lucide-react';

// --- Types & Constants ---
type PrizeRank = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'LastOne';

interface Prize {
  id: string;
  rank: PrizeRank;
  name: string;
  isHighPrize: boolean;
  isPulled: boolean;
}

interface PlayerStats {
  id: number;
  name: string;
  spent: number;
  drawCount: number;
  highPrizesCount: number;
  drawnPrizes: Prize[];
}

const PRIZE_POOL_CONFIG: Record<Exclude<PrizeRank, 'LastOne'>, { count: number; name: string; isHigh: boolean }> = {
  A: { count: 2, name: 'A상 옷코츠 유타 피규어 (MASTERLISE)', isHigh: true },
  B: { count: 2, name: 'B상 고죠 사토루 피규어 (MASTERLISE)', isHigh: true },
  C: { count: 2, name: 'C상 게토 스구루 피규어 (MASTERLISE)', isHigh: true },
  D: { count: 12, name: 'D상 유리컵 (글라스)', isHigh: false },
  E: { count: 15, name: 'E상 타월', isHigh: false },
  F: { count: 17, name: 'F상 아크릴 스탠드', isHigh: false },
  G: { count: 20, name: 'G상 러버 마스코트 (고무 스트랩)', isHigh: false },
};

const TICKET_PRICE = 13000;
const TOTAL_TICKETS = 70;

// --- Vector Illustrations for Prizes ---
function PrizeVectorArt({ rank, size = "md" }: { rank: PrizeRank | 'LastOne'; size?: 'sm' | 'md' }) {
  const containerClass = size === 'sm' 
    ? 'w-12 h-12 flex items-center justify-center rounded-xl overflow-hidden' 
    : 'w-full h-24 flex items-center justify-center rounded-2xl overflow-hidden';
  
  switch (rank) {
    case 'A':
      return (
        <div className={`${containerClass} bg-gradient-to-br from-rose-950 to-[#1a0c0e] border border-rose-500/30 relative shadow-inner shrink-0`}>
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <radialGradient id="grad-a" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="100" height="100" fill="url(#grad-a)" />
            {/* Swirling cursed sword flames */}
            <path d="M30 75 Q45 45 40 25 Q55 45 45 75 Z" fill="#f43f5e" opacity="0.6" />
            <path d="M50 80 Q65 50 60 30 Q75 50 65 80 Z" fill="#f43f5e" opacity="0.4" />
            {/* Katana */}
            <line x1="25" y1="75" x2="75" y2="25" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
            <line x1="25" y1="75" x2="75" y2="25" stroke="#f43f5e" strokeWidth="7" strokeLinecap="round" opacity="0.6" />
            {/* Guard */}
            <line x1="21" y1="79" x2="33" y2="67" stroke="#111" strokeWidth="5" strokeLinecap="round" />
          </svg>
        </div>
      );
    case 'B':
      return (
        <div className={`${containerClass} bg-gradient-to-br from-blue-950 to-[#0c101a] border border-blue-500/30 relative shadow-inner shrink-0`}>
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <radialGradient id="grad-b" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="100" height="100" fill="url(#grad-b)" />
            {/* Unlimited Void circles */}
            <circle cx="50" cy="50" r="25" fill="none" stroke="#60a5fa" strokeWidth="1" opacity="0.3" strokeDasharray="3 3" />
            <circle cx="50" cy="50" r="16" fill="none" stroke="#2563eb" strokeWidth="2" opacity="0.6" />
            <circle cx="50" cy="50" r="10" fill="#3b82f6" opacity="0.8" />
            <circle cx="50" cy="50" r="4" fill="#ffffff" />
            {/* Glass shards */}
            <polygon points="30,35 34,32 32,38" fill="#bfdbfe" opacity="0.6" />
            <polygon points="70,65 74,60 76,68" fill="#93c5fd" opacity="0.7" />
          </svg>
        </div>
      );
    case 'C':
      return (
        <div className={`${containerClass} bg-gradient-to-br from-purple-950 to-[#0e0c1a] border border-purple-500/30 relative shadow-inner shrink-0`}>
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <radialGradient id="grad-c" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#a855f7" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="100" height="100" fill="url(#grad-c)" />
            {/* Swirling wizard curses */}
            <path d="M50 50 Q40 25 25 35 Q45 45 50 50 Z" fill="#c084fc" opacity="0.4" />
            <path d="M50 50 Q60 75 75 65 Q55 55 50 50 Z" fill="#818cf8" opacity="0.4" />
            <circle cx="50" cy="50" r="12" fill="#581c87" opacity="0.7" />
            <circle cx="50" cy="50" r="6" fill="#1e1b4b" />
          </svg>
        </div>
      );
    case 'LastOne':
      return (
        <div className={`${containerClass} bg-gradient-to-br from-amber-950 to-[#1c120c] border border-amber-500/40 relative shadow-inner shrink-0`}>
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <radialGradient id="grad-last" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="100" height="100" fill="url(#grad-last)" />
            {/* Golden radiance background */}
            <polygon points="30,65 40,50 50,60 60,50 70,65" fill="#fbbf24" stroke="#d97706" strokeWidth="2" strokeLinejoin="round" />
            <circle cx="50" cy="53" r="14" fill="#fbbf24" opacity="0.3" />
            <circle cx="50" cy="53" r="6" fill="#ffffff" />
          </svg>
        </div>
      );
    default:
      return null;
  }
}

const getPulledCardStyle = (rank: PrizeRank) => {
  switch (rank) {
    case 'A': 
      return 'bg-gradient-to-br from-rose-950/80 to-red-900/60 border-rose-500 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.3)] font-black uppercase text-2xl';
    case 'B': 
      return 'bg-gradient-to-br from-blue-950/80 to-indigo-900/60 border-blue-400 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.3)] font-black uppercase text-2xl';
    case 'C': 
      return 'bg-gradient-to-br from-purple-950/80 to-fuchsia-900/60 border-purple-500 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.3)] font-black uppercase text-2xl';
    case 'D': 
      return 'bg-[#151a24] border-cyan-550 text-cyan-400 font-bold text-xl';
    case 'E': 
      return 'bg-[#1e1a18] border-orange-550 text-orange-400 font-bold text-xl';
    case 'F': 
      return 'bg-[#161a16] border-emerald-555 text-emerald-400 font-bold text-xl';
    case 'G': 
      return 'bg-[#1a151d] border-pink-550 text-pink-400 font-bold text-xl';
    default:
      return 'bg-black/40 border-white/5 text-slate-500 font-bold text-xl';
  }
};

const CLERK_REACTIONS = {
  START: ["어서오세요! 주술회전 5주년 FINAL, 총 70장의 운명이 기다립니다!", "피규어가 총 6개! 당신의 운은 어디에 있을까요?"],
  LOW_PRIZES: ["아쉽네요... 다음엔 좋은 게 나올 거예요.", "음, 하위상이 연속으로 나와도 포기하지 마세요!", "더 해보시겠어요? 이제 확률이 더 좋아졌습니다!"],
  HIGH_PRIZES: ["축하합니다! 피규어 당첨이에요!!!", "와우! 상위상을 뽑으셨군요! 축하드립니다!", "매장 내에 울려퍼지는 당첨 소식! 대단합니다!"],
  CLEAR_ALL: ["통털이!! 정말 대단한 결단력이십니다!", "남은 굿즈 전부와 라스트원상까지! 축하드려요!"],
  CROWD: ["우와 저 사람 피규어 하나 더 뽑았어... 부럽다.", "피규어가 벌써 빠지다니... 내 순서는?!", "저 사람 진짜 진심이네... 웅성웅성..."],
};

const ALL_CLEAR_REACTION_POOL = [
  { text: "부럽다... 진짜 다 털어가네", color: "text-amber-400" },
  { text: "와 진짜 대단하다... 광기다 광기", color: "text-white" },
  { text: "저건 상도덕에 어긋나는 거 아님?", color: "text-rose-400" },
  { text: "돈 진짜 많나봐. 카드 한도가 얼마야?", color: "text-emerald-400" },
  { text: "재력 보소... 갓물주인가?", color: "text-amber-500" },
  { text: "아!!! 내가 먼저 할걸!!!", color: "text-rose-500 font-black" },
  { text: "한 장만 더 할걸... 저거 내 건데!!", color: "text-indigo-500" },
];

export default function App() {
  // --- Core State ---
  const [board, setBoard] = useState<Prize[]>([]);
  const [players, setPlayers] = useState<PlayerStats[]>([
    { id: 1, name: '1번 호구 (나)', spent: 0, drawCount: 0, highPrizesCount: 0, drawnPrizes: [] },
    { id: 2, name: '2번 호구 (옆사람)', spent: 0, drawCount: 0, highPrizesCount: 0, drawnPrizes: [] },
    { id: 3, name: '3번 호구 (지나가던 사람)', spent: 0, drawCount: 0, highPrizesCount: 0, drawnPrizes: [] },
  ]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  // --- UI/Interaction State ---
  const [clerkMessage, setClerkMessage] = useState("");
  const [whisper, setWhisper] = useState("");
  const [drawMode, setDrawMode] = useState<0 | 1 | 5 | 10 | 'all'>(0);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showWinBanner, setShowWinBanner] = useState<PrizeRank | null>(null);
  const [winQueue, setWinQueue] = useState<PrizeRank[]>([]);
  const [isRinging, setIsRinging] = useState(false);

  // --- Surrender Logic State ---
  const [showEncouragement, setShowEncouragement] = useState(false);
  const [showSurrenderConfirm, setShowSurrenderConfirm] = useState(false);
  const [surrenderOffset, setSurrenderOffset] = useState({ x: 0, y: 0 });
  const [surrenderHoverCount, setSurrenderHoverCount] = useState(0);

  // --- All Clear Effects ---
  const [isAllClearAnimating, setIsAllClearAnimating] = useState(false);
  const [allClearComments, setAllClearComments] = useState<any[]>([]);

  // --- Derived State ---
  const currentPlayer = players[currentPlayerIndex];
  const totalRemaining = board.filter(p => !p.isPulled).length;
  const remainingHighPrizes = board.filter(p => !p.isPulled && p.isHighPrize).length;
  const currentProbability = totalRemaining > 0 ? (remainingHighPrizes / totalRemaining * 100).toFixed(1) : "0";

  // --- Handlers ---
  const initBoard = useCallback(() => {
    let pool: Prize[] = [];
    Object.entries(PRIZE_POOL_CONFIG).forEach(([rank, config]) => {
      for (let i = 0; i < config.count; i++) {
        pool.push({
          id: `${rank}-${i}-${Math.random()}`,
          rank: rank as PrizeRank,
          name: config.name,
          isHighPrize: config.isHigh,
          isPulled: false
        });
      }
    });
    
    setBoard(pool.sort(() => Math.random() - 0.5));
    setPlayers(prev => prev.map(p => ({ ...p, spent: 0, drawCount: 0, highPrizesCount: 0, drawnPrizes: [] })));
    setCurrentPlayerIndex(0);
    setClerkMessage(CLERK_REACTIONS.START[Math.floor(Math.random() * CLERK_REACTIONS.START.length)]);
    setWhisper("");
    setIsGameOver(false);
    resetInteractionState();
  }, []);

  const resetInteractionState = () => {
    setDrawMode(0);
    setSelectedIndices([]);
    setShowConfirm(false);
    setShowSurrenderConfirm(false);
    setShowEncouragement(false);
    setSurrenderOffset({ x: 0, y: 0 });
    setSurrenderHoverCount(0);
    setIsAllClearAnimating(false);
  };

  useEffect(() => {
    initBoard();
  }, [initBoard]);

  // Sequence win banners
  useEffect(() => {
    if (winQueue.length > 0 && !showWinBanner) {
      const nextPrize = winQueue[0];
      setShowWinBanner(nextPrize);
      setWinQueue(prev => prev.slice(1));
      setIsRinging(true);
      
      // Auto-dismiss after 2.5s if not clicked
      const timer = setTimeout(() => {
        setIsRinging(false);
        setShowWinBanner(null);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [winQueue, showWinBanner]);

  const triggerWinEffects = (drawnItems: Prize[]) => {
    const highPrizes = drawnItems.filter(p => ['A', 'B', 'C'].includes(p.rank)).map(p => p.rank);
    const hasAnyHigh = drawnItems.some(p => p.isHighPrize);

    if (hasAnyHigh) {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#00BFFF', '#9932CC', '#FF4500']
      });
      setWinQueue(prev => [...prev, ...highPrizes]);
    }
  };

  const handleTicketClick = (index: number) => {
    if (board[index].isPulled || isGameOver) return;
    
    if (drawMode === 0) {
      setWhisper("먼저 몇 장 뽑을지 선택해주세요!");
      return;
    }

    if (drawMode === 'all') {
      setShowConfirm(true);
      return;
    }
    
    // Toggle logic
    if (selectedIndices.includes(index)) {
      setSelectedIndices(prev => prev.filter(i => i !== index));
    } else {
      if (selectedIndices.length < (drawMode as number)) {
        const newIndices = [...selectedIndices, index];
        setSelectedIndices(newIndices);
        if (newIndices.length === (drawMode as number)) {
          setShowConfirm(true);
        }
      } else {
        setWhisper(`이미 ${(drawMode as number)}장을 모두 고르셨습니다!`);
      }
    }
  };

  const executeDraw = (indices: number[]) => {
    const cost = indices.length * TICKET_PRICE;
    const drawn = indices.map(i => board[i]);
    const highPrizesCount = drawn.filter(p => p.isHighPrize).length;
    const remainingBefore = totalRemaining;

    // 1. Update Board
    setBoard(prev => prev.map((p, idx) => indices.includes(idx) ? { ...p, isPulled: true } : p));

    // 2. Update Players
    setPlayers(prev => prev.map((p, idx) => {
      if (idx !== currentPlayerIndex) return p;
      const newDrawn = [...p.drawnPrizes, ...drawn.map(d => ({ ...d, isPulled: true }))];
      let newHighScore = p.highPrizesCount + highPrizesCount;

      if (remainingBefore === indices.length) {
        // Last One
        newDrawn.push({
          id: 'last-one-' + Date.now(),
          rank: 'LastOne',
          name: '라스트원상 고죠 사토루 피규어',
          isHighPrize: true,
          isPulled: true
        });
        newHighScore += 1;
      }

      return {
        ...p,
        spent: p.spent + cost,
        drawCount: p.drawCount + indices.length,
        highPrizesCount: newHighScore,
        drawnPrizes: newDrawn
      };
    }));

    // 3. UI Reaction
    triggerWinEffects(drawn);
    if (indices.length === remainingBefore) {
      setIsAllClearAnimating(true);
      setAllClearComments(Array.from({ length: 12 }).map((_, i) => ({
        id: i,
        ...ALL_CLEAR_REACTION_POOL[Math.floor(Math.random() * ALL_CLEAR_REACTION_POOL.length)],
        x: Math.random() * 80 + 10,
        y: Math.random() * 80 + 10,
        delay: Math.random() * 2
      })));
      setClerkMessage(CLERK_REACTIONS.CLEAR_ALL[0]);
      setIsGameOver(true);
    } else {
      setClerkMessage(highPrizesCount > 0 ? CLERK_REACTIONS.HIGH_PRIZES[0] : CLERK_REACTIONS.LOW_PRIZES[0]);
      setWhisper(highPrizesCount > 0 ? "대박... 부럽다..." : "에이... 설마 다음엔?");
    }

    // 4. Reset Interaction & Surrender Logic
    setSelectedIndices([]);
    setDrawMode(0); // Clear to prevent stuck selections
    setShowConfirm(false);
    setSurrenderOffset({ x: 0, y: 0 }); // RESET SURRENDER OFFSET
    setSurrenderHoverCount(0); // RESET HOVER COUNT
  };

  const handleSurrenderHover = () => {
    // Dodge logic
    if (currentPlayer.highPrizesCount === 0 && currentPlayer.spent > 0 && surrenderHoverCount < 4) {
      const angle = Math.random() * Math.PI * 2;
      const distance = 45 + Math.random() * 20; 
      setSurrenderOffset({
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance
      });
      setSurrenderHoverCount(prev => prev + 1);
    } else {
      setSurrenderOffset({ x: 0, y: 0 });
    }
  };

  const handleSurrenderAction = () => {
    if (isGameOver) return;

    // Won something -> Normal quit
    if (currentPlayer.highPrizesCount > 0) {
      setShowSurrenderConfirm(true);
      return;
    }

    // Spent money but nothing won -> Check if button settled
    if (currentPlayer.spent > 0) {
      if (surrenderHoverCount < 4) {
        handleSurrenderHover(); // Dodge if they try to click while dodging
        setWhisper("엇! 도망가려구요? 안됩니다!");
        return;
      } else {
        // Show Guilt Trip
        setShowEncouragement(true);
        return;
      }
    }

    // Just quit (no spent)
    confirmQuit();
  };

  const confirmQuit = () => {
    setCurrentPlayerIndex(prev => (prev + 1) % players.length);
    resetInteractionState();
  };

  const getRankColor = (rank: PrizeRank | 'LastOne') => {
    switch (rank) {
      case 'A': return 'text-rose-500 border-rose-500 shadow-rose-500/30';
      case 'B': return 'text-blue-500 border-blue-500 shadow-blue-500/30';
      case 'C': return 'text-purple-500 border-purple-500 shadow-purple-500/30';
      case 'LastOne': return 'text-amber-500 border-amber-500 shadow-amber-500/30';
      default: return 'text-slate-500 border-white/5';
    }
  };

  // --- Sub-components ---
  const MenuButton = ({ label, onClick, disabled, active, primary, className }: any) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        h-12 w-full rounded-2xl font-black uppercase tracking-tighter text-sm transition-all duration-300 border
        ${disabled ? 'opacity-20 grayscale cursor-not-allowed' : 'cursor-pointer'}
        ${active 
          ? 'bg-amber-500 border-amber-400 text-black shadow-[0_0_20px_rgba(245,158,11,0.3)]' 
          : primary
            ? 'bg-indigo-600 border-indigo-400 text-white hover:bg-indigo-500'
            : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
        }
        ${className || ''}
      `}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#050506] text-slate-100 flex flex-col overflow-hidden relative">
      
      {/* Header */}
      <header className="h-20 border-b border-white/5 bg-[#09090b]/80 backdrop-blur-xl flex items-center justify-between px-10 z-50">
        <div className="flex items-center space-x-12">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">CURRENT PLAYER</span>
            <div className="flex items-center gap-3">
               <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
               <span className="text-xl font-bold">{currentPlayer.name}</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">TOTAL SPENT</span>
            <span className="text-xl font-mono text-amber-500">₩{currentPlayer.spent.toLocaleString()}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">MY LUCK</span>
            <span className="text-xl font-mono text-emerald-400">
              {currentPlayer.drawCount > 0 
                ? (currentPlayer.highPrizesCount / currentPlayer.drawCount * 100).toFixed(1) 
                : "0.0"}%
            </span>
          </div>
        </div>
        <button onClick={initBoard} className="bg-white/5 p-3 rounded-2xl hover:bg-white/10 transition-all hover:rotate-90">
          <RefreshCw className="w-5 h-5 text-slate-400" />
        </button>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 border-r border-white/5 bg-[#070708] flex flex-col">
          <div className="p-8 space-y-8 flex-1 overflow-y-auto">
            {/* Clerk Bubble */}
            <div className="space-y-4">
              <div className="w-14 h-14 bg-indigo-500/10 rounded-full flex items-center justify-center text-3xl border border-indigo-500/20">🧔‍♂️</div>
              <div className="p-5 bg-white/5 border border-white/10 rounded-3xl rounded-tl-none relative">
                <p className="text-sm font-medium text-slate-300 leading-relaxed italic">"{clerkMessage}"</p>
              </div>
              <AnimatePresence mode="wait">
                {whisper && (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-3 text-xs font-black text-indigo-400 italic px-4 py-2 bg-indigo-500/5 rounded-full border border-indigo-500/10">
                    <Volume2 className="w-3 h-3" />
                    <span>{whisper}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Board Stats */}
            <div className="space-y-6 pt-8">
               <div className="bg-black/20 p-5 rounded-3xl border border-white/5">
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-4 text-center">피규어 확률</p>
                  <div className="text-4xl font-black text-center tracking-tighter">
                    <span className={Number(currentProbability) > 15 ? "text-emerald-400" : "text-rose-500"}>
                      {currentProbability}%
                    </span>
                  </div>
                  <div className="mt-4 w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div animate={{ width: `${currentProbability}%` }} className="h-full bg-emerald-500" />
                  </div>
                  <p className="text-[10px] text-slate-600 mt-2 text-center uppercase font-bold tracking-widest">{remainingHighPrizes} / 6 PEICES LEFT</p>
               </div>

               {/* Premium Figure Catalog Showcase */}
               <div className="space-y-3.5">
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-1">PREMIUM FIGURE SHOWCASE</p>
                  
                  {(['A', 'B', 'C'] as PrizeRank[]).map(rank => {
                    const count = board.filter(p => !p.isPulled && p.rank === rank).length;
                    const name = rank === 'A' 
                      ? '옷코츠 유타 (MASTERLISE)' 
                      : rank === 'B' 
                        ? '고죠 사토루 (MASTERLISE)' 
                        : '게토 스구루 (MASTERLISE)';
                    return (
                      <div 
                        key={rank} 
                        className={`bg-[#0d0d12]/90 p-3 rounded-2xl border border-white/5 hover:border-white/10 transition-all duration-300 relative overflow-hidden group flex gap-3.5 items-center ${count === 0 ? 'opacity-30 grayscale' : ''}`}
                      >
                         <div className="w-12 h-12 shrink-0 select-none">
                            <PrizeVectorArt rank={rank} size="sm" />
                         </div>

                         <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                               <span className={`px-1.5 py-0.2 text-[9px] font-black rounded ${getRankColor(rank)} bg-current/5 border border-current/20`}>
                                 {rank}상
                               </span>
                               {count === 0 && (
                                 <span className="text-[8px] font-black text-rose-500 bg-rose-500/10 border border-rose-500/20 px-1 rounded uppercase">SOLD OUT</span>
                               )}
                            </div>
                            <h4 className="text-[11px] font-bold text-slate-200 truncate leading-snug">{name}</h4>
                            <p className="text-[9px] text-slate-500 mt-0.5 uppercase font-black tracking-wider">
                              STOCK: <span className={count > 0 ? "text-amber-500" : "text-slate-600"}>{count}/2 LEFT</span>
                            </p>
                         </div>
                      </div>
                    );
                  })}

                  {board.length > 0 && (
                    <div className="bg-[#120d08]/90 p-3 rounded-2xl border border-amber-500/10 flex gap-3.5 items-center relative overflow-hidden group">
                       <div className="w-12 h-12 shrink-0 select-none">
                          <PrizeVectorArt rank="LastOne" size="sm" />
                       </div>
                       <div className="flex-1 min-w-0">
                          <span className="px-1.5 py-0.2 text-[8px] font-black rounded bg-amber-500/10 border border-amber-500/35 text-amber-500 uppercase">Special</span>
                          <h4 className="text-[11px] font-bold text-amber-200 truncate leading-snug mt-0.5">라스트원 고죠 사토루</h4>
                          <p className="text-[8px] text-slate-500 uppercase font-bold tracking-wider">마지막 남은 1장 싹쓸이 시 자동 지급</p>
                       </div>
                    </div>
                  )}
               </div>

               {/* Comparison Card */}
               {currentPlayer.spent > 0 && (
                 <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-rose-500/5 p-5 rounded-3xl border border-rose-500/10 space-y-4">
                    <p className="text-[9px] text-rose-500/60 font-black uppercase tracking-widest text-center">이 돈이면 할 수 있는 일</p>
                    <div className="space-y-3">
                       <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-500">삼각김밥</span>
                          <span className="text-xs font-black text-slate-300">{Math.floor(currentPlayer.spent / 1300)}개</span>
                       </div>
                       <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-500">지하철 왕복</span>
                          <span className="text-xs font-black text-slate-300">{Math.floor(currentPlayer.spent / 3000)}회</span>
                       </div>
                       <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-500">국밥 든든하게</span>
                          <span className="text-xs font-black text-slate-300">{Math.floor(currentPlayer.spent / 10000)}그릇</span>
                       </div>
                       <div className="flex items-center justify-between pt-2 border-t border-rose-500/10">
                          <span className="text-xs text-rose-400 font-bold">치킨</span>
                          <span className="text-xs font-black text-rose-400">{Math.floor(currentPlayer.spent / 25000)}마리</span>
                       </div>
                    </div>
                 </motion.div>
               )}
            </div>
          </div>
          
             <div className="p-8 bg-black/40 border-t border-white/5 space-y-4 text-center shrink-0">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none">PRICING POLICY</p>
                <div className="flex items-center justify-between px-2">
                   <span className="text-xs text-slate-400">한 장 당</span>
                   <span className="text-sm font-black text-white/80">₩{TICKET_PRICE.toLocaleString()}</span>
                </div>
                <div className="h-px w-full bg-white/5" />
                <p className="text-[9px] text-slate-500 font-medium italic">※ 본 시뮬레이션은 재미를 위한 것이며 <br/> 실제 재산상의 손해를 유발할 수 있습니다.</p>
             </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-[#0c0c0e] flex flex-col p-12 overflow-hidden relative">
          <div className="flex items-center justify-between mb-8">
             <h2 className="text-xs font-black uppercase tracking-[0.4em] text-slate-500 flex items-center gap-3">
               <Ticket className="w-4 h-4" /> BATTLE BOARD ({totalRemaining}/{TOTAL_TICKETS})
             </h2>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <div className="grid grid-cols-10 grid-rows-7 gap-2.5 w-full max-w-5xl h-[500px]">
              {board.map((p, i) => (
                <motion.button
                  key={p.id}
                  whileHover={!p.isPulled ? { scale: 1.05, y: -2, zIndex: 10 } : {}}
                  onClick={() => handleTicketClick(i)}
                  className={`
                    w-full h-full rounded-xl border transition-all duration-300 flex items-center justify-center relative overflow-hidden group/ticket
                    ${p.isPulled 
                      ? `cursor-default ${getPulledCardStyle(p.rank)}` 
                      : selectedIndices.includes(i)
                        ? 'bg-[#fbbf24] border-amber-400 text-black shadow-[0_0_15px_rgba(251,191,36,0.6)] scale-105 z-20'
                        : 'bg-linear-to-br from-[#121215] to-[#18181f] border-white/10 hover:border-amber-450/40 cursor-pointer shadow-lg'
                    }
                  `}
                >
                   {p.isPulled ? (
                     <div className="flex flex-col items-center justify-center">
                       <span className="text-xl font-black italic tracking-tighter leading-none">{p.rank}</span>
                     </div>
                   ) : (
                     <div className="relative w-full h-full flex flex-col justify-between p-1 select-none font-sans">
                        <div className="flex justify-between items-center text-[7px] text-slate-550 font-bold leading-none">
                          <span>JU-JUTSU</span>
                          <span className="font-mono text-[7px] bg-white/5 opacity-80 px-1 rounded text-slate-400">#{i + 1}</span>
                        </div>
                        
                        <div className="flex-1 flex flex-col items-center justify-center my-0.5">
                           <span className="text-xs filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] group-hover/ticket:scale-120 transition-transform duration-300">🎟️</span>
                        </div>
                        
                        <div className="w-full flex justify-between items-center gap-0.4 opacity-25">
                           <div className="h-px flex-1 border-t border-dashed border-slate-500" />
                           <span className="text-[5px] text-slate-500 font-mono">뜯기</span>
                           <div className="h-px flex-1 border-t border-dashed border-slate-500" />
                        </div>
                        
                        <div className="text-[7.5px] text-center font-black rounded-sm py-0.5 uppercase tracking-wide text-amber-500 bg-amber-500/5 group-hover/ticket:bg-amber-550 group-hover/ticket:text-black transition-all">
                           OPEN
                        </div>
                     </div>
                   )}
                   {selectedIndices.includes(i) && (
                     <div className="absolute -top-1 -right-1 bg-white text-amber-500 rounded-full p-0.5 shadow-lg z-30">
                       <CheckCircle2 className="w-3.5 h-3.5" />
                     </div>
                   )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Action Bar */}
          <div className="mt-8 flex items-center justify-between bg-black/50 p-4 rounded-[40px] border border-white/10 shadow-2xl backdrop-blur-md">
             <div className="flex items-center gap-6 pl-4">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl">
                   {currentPlayer.spent === 0 ? "😐" : currentPlayer.highPrizesCount > 0 ? "🤤" : "😰"}
                </div>
                <div className="text-left">
                   <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-none mb-1">STATUS</p>
                   <p className="text-xs font-black text-slate-200">
                     {currentPlayer.spent > 100000 ? "정신 혼미함" : currentPlayer.spent > 0 ? "침이 마르는 중" : "준비 운동 중"}
                   </p>
                </div>
             </div>

             <div className="flex items-center gap-4 pr-2">
                <motion.div
                  onMouseEnter={handleSurrenderHover}
                  animate={{ x: surrenderOffset.x, y: surrenderOffset.y }}
                  className="w-24 relative z-[100]"
                >
                  <MenuButton 
                    label="포기" 
                    onClick={handleSurrenderAction} 
                    className="bg-rose-500/10 border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white"
                  />
                </motion.div>

                <div className="grid grid-cols-4 gap-3 w-80">
                  <MenuButton label="1장" active={drawMode === 1} onClick={() => { setDrawMode(drawMode === 1 ? 0 : 1); setSelectedIndices([]); }} disabled={totalRemaining < 1} />
                  <MenuButton label="5장" active={drawMode === 5} onClick={() => { setDrawMode(drawMode === 5 ? 0 : 5); setSelectedIndices([]); }} disabled={totalRemaining < 5} />
                  <MenuButton label="10장" active={drawMode === 10} onClick={() => { setDrawMode(drawMode === 10 ? 0 : 10); setSelectedIndices([]); }} disabled={totalRemaining < 10} />
                  <MenuButton label="싹다" primary active={drawMode === 'all'} onClick={() => { setDrawMode('all'); setSelectedIndices([]); setShowConfirm(true); }} disabled={totalRemaining === 0} />
                </div>
             </div>
          </div>
        </div>
      </main>

      {/* --- Overlays --- */}

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={() => { setShowConfirm(false); setSelectedIndices([]); setDrawMode(0); }}
            className="fixed inset-0 z-[500] bg-black/90 backdrop-blur-md flex items-center justify-center p-8 cursor-pointer"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} 
              animate={{ scale: 1, y: 0 }} 
              onClick={(e) => e.stopPropagation()}
              className="bg-[#121215] border border-white/10 p-12 max-w-sm w-full rounded-[48px] text-center space-y-8 cursor-default"
            >
               <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto">
                 <ShoppingBag className="w-10 h-10 text-amber-500" />
               </div>
               <div className="space-y-2">
                 <h3 className="text-3xl font-black text-white italic">결제하시겠습니까?</h3>
                 <p className="text-slate-400 text-sm">
                   {drawMode === 'all' 
                     ? `남은 ${totalRemaining}장을 전부 가져갑니다. (₩${(totalRemaining * TICKET_PRICE).toLocaleString()})`
                     : `${selectedIndices.length}장을 뽑습니다. (₩${(selectedIndices.length * TICKET_PRICE).toLocaleString()})`}
                 </p>
               </div>
               <div className="flex flex-col gap-3">
                 <button 
                  onClick={() => executeDraw(drawMode === 'all' ? board.map((_, i) => i).filter(i => !board[i].isPulled) : selectedIndices)}
                  className="py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest text-xs rounded-2xl transition-all shadow-[0_10px_40px_rgba(79,70,229,0.4)]"
                 >
                   네, 결제합니다!
                 </button>
                 <button onClick={() => { setShowConfirm(false); setDrawMode(0); setSelectedIndices([]); }} className="py-4 text-slate-500 font-bold uppercase tracking-widest text-[10px] hover:text-white transition-colors">아뇨, 취소요.</button>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Win Banner */}
      <AnimatePresence>
        {showWinBanner && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={() => { setShowWinBanner(null); setIsRinging(false); }}
            className="fixed inset-0 z-[600] flex items-center justify-center bg-black/80 cursor-pointer"
          >
            <motion.div 
              initial={{ scale: 0.5, rotateY: 90 }} 
              animate={{ scale: 1, rotateY: 0 }} 
              exit={{ scale: 1.5, opacity: 0 }}
              className={`w-72 h-[420px] rounded-[32px] border-4 bg-[#1a1a20] flex flex-col items-center justify-center shadow-2xl relative ${getRankColor(showWinBanner)}`}
            >
              <div className="absolute top-6 text-[10px] font-black uppercase tracking-[0.4em] opacity-40">SUPER RARE FIND</div>
              <span className="text-[150px] font-black italic tracking-tighter leading-none">{showWinBanner}</span>
              <div className="h-px w-12 bg-current opacity-30 mt-4 mb-4" />
              <span className="text-sm font-black uppercase tracking-[0.3em]">WINNER!</span>
              <p className="absolute bottom-10 text-[10px] text-slate-500 font-bold animate-pulse uppercase tracking-widest">TAP TO CONTINUE</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Encouragement (Guilt Trip) */}
      <AnimatePresence>
        {showEncouragement && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[700] bg-black/95 flex items-center justify-center">
             <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-50">
               <motion.div animate={{ y: [0, -20, 0] }} transition={{ repeat: Infinity, duration: 5 }} className="absolute top-[10%] left-[15%] text-[140px] grayscale brightness-150">👴🏻</motion.div>
               <motion.div animate={{ y: [0, -30, 0] }} transition={{ repeat: Infinity, duration: 6, delay: 1 }} className="absolute top-[15%] right-[20%] text-[140px] grayscale brightness-125">👩🏻‍💼</motion.div>
             </div>
             
             <div className="text-center space-y-12 max-w-4xl px-8 relative z-10">
                <h3 className="text-7xl md:text-9xl font-black italic text-white tracking-tighter leading-none">
                   "지금 가버리면 <br/> <span className="text-rose-500">지옥</span>이란다..."
                </h3>
                <p className="text-xl md:text-3xl text-slate-400 font-medium leading-relaxed">
                   조상님은 눈을 감으셨고 <br/> 
                   여자친구는 이미 이별을 준비 중입니다. <br/>
                   <span className="text-amber-500 font-black mt-8 block bg-amber-500/10 py-6 rounded-3xl border border-amber-500/20">
                     다음 판에 무조건 나옵니다. 조상님 이름 겁니다.
                   </span>
                </p>
                <div className="flex flex-col gap-6 items-center">
                   <button onClick={() => setShowEncouragement(false)} className="px-12 py-6 bg-white text-black font-black uppercase tracking-widest rounded-3xl hover:scale-105 transition-transform text-lg">그래, 한 판 더 간다!</button>
                   <button onClick={confirmQuit} className="text-white/20 hover:text-white/50 font-black uppercase tracking-widest text-xs transition-colors">아뇨, 저 불효자 할래요 (포기하기)</button>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Surrender Confirm (When won) */}
      <AnimatePresence>
        {showSurrenderConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[500] bg-black/90 flex items-center justify-center p-8 backdrop-blur-md">
             <div className="bg-[#121215] border border-white/10 p-10 rounded-[48px] max-w-sm w-full text-center space-y-8">
                <div className="text-6xl">😱</div>
                <h3 className="text-2xl font-black text-white">진짜 그만둬요?</h3>
                <p className="text-slate-400 text-sm">상위상을 뽑으셨는데... 운이 들어왔을 때 더 털어야죠!</p>
                <div className="flex flex-col gap-3">
                   <button onClick={() => setShowSurrenderConfirm(false)} className="py-4 bg-indigo-600 text-white font-black rounded-2xl">아니요, 계속할게요!</button>
                   <button onClick={confirmQuit} className="py-4 text-rose-500 font-black rounded-2xl hover:bg-rose-500/10">네, 멈출게요.</button>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* All Clear Reactions */}
      <AnimatePresence>
        {isAllClearAnimating && (
          <div className="fixed inset-0 z-[800] pointer-events-none">
             {allClearComments.map(c => (
               <motion.div
                 key={c.id}
                 initial={{ opacity: 0, scale: 0.5, x: `${c.x}%`, y: '110%' }}
                 animate={{ opacity: 1, scale: 1, y: `${c.y}%` }}
                 transition={{ delay: c.delay, duration: 1.5, type: 'spring' }}
                 className={`absolute px-6 py-3 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full text-sm font-black whitespace-nowrap shadow-2xl ${c.color}`}
               >
                 {c.text}
               </motion.div>
             ))}
             <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 2 }} className="absolute inset-0 flex flex-col items-center justify-center pointer-events-auto bg-black/80">
                <h1 className="text-9xl font-black italic text-white tracking-widest animate-bounce">ALL CLEAR!</h1>
                <p className="text-xl text-amber-500 font-bold mb-12 uppercase tracking-[0.5em]">남은 모든 굿즈를 지배하셨습니다</p>
                <button onClick={initBoard} className="px-12 py-6 bg-amber-500 text-black font-black rounded-full hover:scale-110 transition-transform">새로운 운명 시작하기</button>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
