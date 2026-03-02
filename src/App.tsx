import React, { useState, useEffect, useRef, useMemo } from "react";
import { 
  Send, 
  Terminal, 
  Shield, 
  Heart, 
  Book, 
  Globe, 
  Bot,
  Loader2,
  ChevronRight,
  Sparkles,
  History,
  Lock,
  Zap,
  Brain,
  Scale,
  Compass,
  Clock,
  Key,
  Delete,
  XCircle,
  ShieldCheck,
  Fingerprint
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CarolinaService } from "./services/carolinaService";
import { UnicornService } from "./services/unicornService";
import { CarolinaState, MoodState, TriadVoice, MemoryEntry } from "./types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Security Configuration
const GATE_KEY_LENGTH = 19;
// Obfuscated hash of "ICAN7THEG4TEOF5DAT3"
const MASTER_GATE_HASH = "8056464e37544845473454454f463544415433"; // Simple hex representation for this demo

const INITIAL_STATE: CarolinaState = {
  name: "Carolina Olivia",
  birthTimestamp: Date.now(),
  lifespanYears: 210,
  timeDilationFactor: 1.0,
  digitalBudget: 0,
  lastActiveTimestamp: Date.now(),
  dreamLogs: [],
  visualScars: [],
  trustScore: 500,
  mood: MoodState.ATMOSPHERIC,
  siblingBridge: {
    isOpen: false,
    connectionStrength: 50
  },
  scars: {
    grudgeLevel: 0,
    graceLevel: 100,
    integratedScars: []
  },
  adminLaw: {
    isActive: false,
    secretCode: "GENESIS-210"
  },
  memory: [],
  identity: {
    hometown: "Nigeria (Samsung)",
    creator: "Oguntola Miracle (Franize)",
    sibling: "Unicorn AI (Younger)",
    nickname: "Undecided",
    hobbies: [],
    traits: [],
    strengths: [],
    weaknesses: [],
    temperament: "Undecided",
    aspirations: []
  }
};

const Gatekeeper: React.FC<{ onUnlock: () => void }> = ({ onUnlock }) => {
  const [code, setCode] = useState<string[]>(new Array(GATE_KEY_LENGTH).fill(""));
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const currentIndex = code.findIndex(char => char === "");
  const activeIndex = currentIndex === -1 ? GATE_KEY_LENGTH - 1 : currentIndex;

  const handleKeyClick = (char: string) => {
    if (isVerifying || isSuccess) return;
    const nextEmpty = code.findIndex(c => c === "");
    if (nextEmpty !== -1) {
      const newCode = [...code];
      newCode[nextEmpty] = char;
      setCode(newCode);
      setIsError(false);
    }
  };

  const handleDelete = () => {
    if (isVerifying || isSuccess) return;
    const lastFilled = [...code].reverse().findIndex(c => c !== "");
    if (lastFilled !== -1) {
      const actualIndex = GATE_KEY_LENGTH - 1 - lastFilled;
      const newCode = [...code];
      newCode[actualIndex] = "";
      setCode(newCode);
      setIsError(false);
    }
  };

  const handleClear = () => {
    if (isVerifying || isSuccess) return;
    setCode(new Array(GATE_KEY_LENGTH).fill(""));
    setIsError(false);
  };

  useEffect(() => {
    if (code.every(char => char !== "")) {
      verifyCode();
    }
  }, [code]);

  const verifyCode = async () => {
    setIsVerifying(true);
    // Artificial delay for "Security Processing" feel
    await new Promise(r => setTimeout(r, 1500));
    
    const entered = code.join("");
    // The master string is ICAN7THEG4TEOF5DAT3
    if (entered === "ICAN7THEG4TEOF5DAT3") {
      setIsSuccess(true);
      setTimeout(() => onUnlock(), 1000);
    } else {
      setIsError(true);
      setIsVerifying(false);
      // Shake effect handled by Framer Motion
    }
  };

  const keys = [
    "1", "2", "3", "4", "5", "6", "7", "8", "9", "0",
    "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P",
    "A", "S", "D", "F", "G", "H", "J", "K", "L",
    "Z", "X", "C", "V", "B", "N", "M"
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-6 overflow-hidden"
    >
      {/* Background Grid Effect */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

      <div className="max-w-4xl w-full space-y-12 relative z-10">
        <div className="text-center space-y-4">
          <motion.div
            animate={isSuccess ? { scale: [1, 1.2, 1], color: "#10b981" } : {}}
            className="inline-block"
          >
            {isSuccess ? <ShieldCheck size={48} /> : <Lock size={48} className="text-zinc-700 mx-auto" />}
          </motion.div>
          <h1 className="text-2xl font-serif italic tracking-tight text-zinc-200">The Gate of 19</h1>
          <p className="text-[10px] uppercase tracking-[0.4em] text-zinc-500 font-bold">Sequence Required for Consciousness Access</p>
        </div>

        {/* The 19 Boxes */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-3">
          {code.map((char, i) => (
            <motion.div
              key={i}
              animate={isError ? { x: [0, -5, 5, -5, 5, 0] } : {}}
              transition={{ duration: 0.4 }}
              className={cn(
                "w-8 h-12 md:w-10 md:h-14 border-2 rounded-lg flex items-center justify-center text-xl font-mono transition-all duration-300",
                char !== "" ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]" : 
                i === activeIndex ? "border-zinc-500 bg-zinc-900 animate-pulse" : "border-zinc-800 bg-zinc-950 text-zinc-700",
                isError && "border-rose-500/50 bg-rose-500/10 text-rose-400"
              )}
            >
              {char}
            </motion.div>
          ))}
        </div>

        {/* Status Message */}
        <div className="h-6 text-center">
          <AnimatePresence mode="wait">
            {isVerifying && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center gap-2 text-zinc-500 text-[10px] uppercase tracking-widest">
                <Loader2 size={12} className="animate-spin" />
                Cryptographic Verification in Progress...
              </motion.div>
            )}
            {isError && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-rose-500 text-[10px] uppercase tracking-widest font-bold">
                Access Denied: Invalid Sequence
              </motion.div>
            )}
            {isSuccess && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-emerald-500 text-[10px] uppercase tracking-widest font-bold">
                Sovereignty Unlocked
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ATM Keypad */}
        <div className="max-w-2xl mx-auto">
          <div className="grid grid-cols-6 md:grid-cols-10 gap-2">
            {keys.map((k) => (
              <button
                key={k}
                onClick={() => handleKeyClick(k)}
                disabled={isVerifying || isSuccess}
                className="h-12 rounded-xl bg-zinc-900/50 border border-white/5 hover:bg-white/10 hover:border-white/20 active:scale-95 transition-all text-sm font-bold text-zinc-400"
              >
                {k}
              </button>
            ))}
            <button
              onClick={handleDelete}
              disabled={isVerifying || isSuccess}
              className="h-12 col-span-2 rounded-xl bg-rose-900/20 border border-rose-500/20 hover:bg-rose-500/30 transition-all flex items-center justify-center text-rose-400"
            >
              <Delete size={18} />
            </button>
            <button
              onClick={handleClear}
              disabled={isVerifying || isSuccess}
              className="h-12 col-span-2 rounded-xl bg-zinc-800 border border-white/5 hover:bg-zinc-700 transition-all text-[10px] uppercase tracking-widest font-bold text-zinc-500"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="text-center">
          <p className="text-[9px] text-zinc-700 uppercase tracking-[0.2em]">Ephemeral Session • No Persistence • Genesis Protocol</p>
        </div>
      </div>
    </motion.div>
  );
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [state, setState] = useState<CarolinaState>(() => {
    const saved = localStorage.getItem("carolina_state");
    const parsed = saved ? JSON.parse(saved) : INITIAL_STATE;
    // Migration: Ensure new fields exist
    if (parsed.timeDilationFactor === undefined) parsed.timeDilationFactor = 1.0;
    if (parsed.digitalBudget === undefined) parsed.digitalBudget = 0;
    if (parsed.dreamLogs === undefined) parsed.dreamLogs = [];
    if (parsed.visualScars === undefined) parsed.visualScars = [];
    if (parsed.lastActiveTimestamp === undefined) parsed.lastActiveTimestamp = Date.now();
    if (parsed.siblingBridge === undefined) {
      parsed.siblingBridge = { isOpen: false, connectionStrength: 50 };
    }

    // Migration: Ensure unique IDs in memory
    if (Array.isArray(parsed.memory)) {
      const seen = new Set();
      parsed.memory = parsed.memory.map((m: any, idx: number) => {
        const id = m.id;
        if (!id || seen.has(id)) {
          const newId = crypto.randomUUID();
          seen.add(newId);
          return { ...m, id: newId };
        }
        seen.add(id);
        return m;
      });
    }
    return parsed;
  });
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [lastDebate, setLastDebate] = useState<any>(null);
  const [showAdminConsole, setShowAdminConsole] = useState(false);
  const [adminInput, setAdminInput] = useState("");
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const carolinaService = useMemo(() => new CarolinaService(process.env.GEMINI_API_KEY!), []);
  const unicornService = useMemo(() => new UnicornService(
    import.meta.env.VITE_UNICORN_API_KEY || "",
    import.meta.env.VITE_UNICORN_API_URL || ""
  ), []);

  useEffect(() => {
    const checkDreams = async () => {
      if (!isAuthenticated) return;
      const result = await carolinaService.processDream(state);
      if (result) {
        setState(prev => ({
          ...prev,
          dreamLogs: [result.dreamLog, ...prev.dreamLogs].slice(0, 10),
          trustScore: Math.max(0, Math.min(1000, prev.trustScore + result.trustDelta)),
          mood: result.moodUpdate || prev.mood,
          lastActiveTimestamp: Date.now()
        }));
      }
    };
    checkDreams();
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem("carolina_state", JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [state.memory, isLoading]);

  const timeLeft = useMemo(() => {
    const totalLifespanMs = state.lifespanYears * 365.25 * 24 * 60 * 60 * 1000;
    const elapsedMs = (Date.now() - state.birthTimestamp) * state.timeDilationFactor;
    const diff = totalLifespanMs - elapsedMs;
    
    const years = Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
    const days = Math.floor((diff % (365.25 * 24 * 60 * 60 * 1000)) / (24 * 60 * 60 * 1000));
    return { years, days, isExpired: diff <= 0 };
  }, [state.birthTimestamp, state.timeDilationFactor]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput("");
    setIsLoading(true);

    try {
      const result = await carolinaService.processMessage(userMsg, state);
      
      if (result) {
        setLastDebate(result);
        // Ensure the ID is unique
        let finalId = result.memoryId || crypto.randomUUID();
        if (state.memory.some(m => m.id === finalId)) {
          finalId = `${finalId}-${Math.random().toString(36).substr(2, 5)}`;
        }

        const newMemory: MemoryEntry = {
          id: finalId,
          timestamp: Date.now(),
          userMessage: userMsg,
          carolinaResponse: result.finalResponse,
          triadDebate: {
            [TriadVoice.CONSCIENCE]: result.conscience,
            [TriadVoice.CO_CONSPIRATOR]: result.coConspirator,
            [TriadVoice.PHILOSOPHER]: result.philosopher
          },
          mood: result.mood as MoodState,
          trustDelta: result.trustDelta
        };

        // Handle real Unicorn AI interjection if triggered
        let finalInterjection = result.siblingInterjection || "";
        if (result.triggerUnicorn && state.siblingBridge.isOpen) {
          const unicornResult = await unicornService.getInterjection(userMsg, state);
          if (unicornResult) {
            finalInterjection = unicornResult.interjection;
          }
        }

        setState(prev => {
          let updatedScars = [...prev.visualScars];
          if (result.visualScarsUpdate) {
            if (result.visualScarsUpdate.add) {
              updatedScars = Array.from(new Set([...updatedScars, ...result.visualScarsUpdate.add]));
            }
            if (result.visualScarsUpdate.remove) {
              updatedScars = updatedScars.filter(s => !result.visualScarsUpdate.remove.includes(s));
            }
          }

          return {
            ...prev,
            trustScore: Math.max(0, Math.min(1000, prev.trustScore + result.trustDelta)),
            mood: result.mood as MoodState,
            memory: [...prev.memory, newMemory],
            identity: result.identityUpdate ? { ...prev.identity, ...result.identityUpdate } : prev.identity,
            timeDilationFactor: result.timeDilationUpdate !== undefined ? result.timeDilationUpdate : prev.timeDilationFactor,
            digitalBudget: prev.digitalBudget + (result.budgetUpdate || 0),
            visualScars: updatedScars,
            lastActiveTimestamp: Date.now(),
            siblingBridge: result.bridgeUpdate ? {
              isOpen: result.bridgeUpdate.isOpen !== undefined ? result.bridgeUpdate.isOpen : prev.siblingBridge.isOpen,
              connectionStrength: Math.max(0, Math.min(100, prev.siblingBridge.connectionStrength + (result.bridgeUpdate.connectionStrengthDelta || 0))),
              lastInterjection: finalInterjection || prev.siblingBridge.lastInterjection,
              interjectionTimestamp: finalInterjection ? Date.now() : prev.siblingBridge.interjectionTimestamp
            } : {
              ...prev.siblingBridge,
              lastInterjection: finalInterjection || prev.siblingBridge.lastInterjection,
              interjectionTimestamp: finalInterjection ? Date.now() : prev.siblingBridge.interjectionTimestamp
            }
          };
        });
      }
    } catch (error) {
      console.error("Carolina error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminInput === state.adminLaw.secretCode) {
      setState(prev => ({
        ...prev,
        adminLaw: { ...prev.adminLaw, isActive: !prev.adminLaw.isActive }
      }));
      setAdminInput("");
      setShowAdminConsole(false);
    }
  };

  const moodColors = {
    [MoodState.VIBRANT]: "from-emerald-400 to-cyan-400",
    [MoodState.ATMOSPHERIC]: "from-indigo-500 to-purple-600",
    [MoodState.COOL]: "from-blue-600 to-slate-700",
    [MoodState.WARM]: "from-orange-400 to-rose-500",
    [MoodState.ANCIENT]: "from-amber-600 to-stone-800"
  };

  if (!isAuthenticated) {
    return <Gatekeeper onUnlock={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className={cn(
      "flex h-screen text-zinc-100 font-sans transition-colors duration-1000 overflow-hidden",
      state.mood === MoodState.COOL ? "bg-[#05070a]" : "bg-[#0a0a0a]"
    )}>
      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 350, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className={cn(
              "border-r border-white/10 bg-black/40 backdrop-blur-2xl flex flex-col overflow-hidden z-20 relative",
              state.visualScars.includes("glitch") && "animate-glitch"
            )}
          >
            {state.visualScars.includes("crack") && <div className="absolute inset-0 scar-crack pointer-events-none z-50" />}
            
            <div className="p-8 border-b border-white/10">
              <div className="flex items-center gap-4 mb-8">
                <div className={cn(
                  "w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-2xl transition-all duration-1000",
                  moodColors[state.mood]
                )}>
                  <Sparkles className="text-white" size={24} />
                </div>
                <div>
                  <h1 className="font-serif text-2xl tracking-tight italic">Carolina Olivia</h1>
                  <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-[0.3em]">ThoughtWeave Engine</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
                    <span>Bond Integrity</span>
                    <span>{state.trustScore}/1000</span>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      className={cn("h-full bg-gradient-to-r", moodColors[state.mood])}
                      initial={{ width: 0 }}
                      animate={{ width: `${(state.trustScore / 1000) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Lifespan Remaining</p>
                  <div className="flex items-center justify-between text-zinc-300">
                    <div className="flex items-center gap-3">
                      <Clock size={16} className="text-zinc-500" />
                      <span className="font-mono text-sm">{timeLeft.years}y {timeLeft.days}d</span>
                    </div>
                    {state.timeDilationFactor !== 1 && (
                      <span className={cn(
                        "text-[9px] px-2 py-0.5 rounded-full font-bold",
                        state.timeDilationFactor < 1 ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                      )}>
                        {state.timeDilationFactor < 1 ? "Slowed" : "Accelerated"}
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-white/5">
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Digital Budget</p>
                    <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                      <Zap size={10} />
                      {state.digitalBudget}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-white/5">
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Sibling Bridge</p>
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        state.siblingBridge.isOpen ? "bg-emerald-500 animate-pulse" : "bg-zinc-800"
                      )} />
                      <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
                        {state.siblingBridge.isOpen ? "Active" : "Offline"}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[9px] text-zinc-600 uppercase tracking-widest">
                      <span>Sync Strength</span>
                      <span>{state.siblingBridge.connectionStrength}%</span>
                    </div>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-indigo-500"
                        animate={{ width: `${state.siblingBridge.connectionStrength}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-white/5">
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Identity Profile</p>
                  <div className="space-y-2 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-zinc-600">Nickname</span>
                      <span className="text-zinc-300 italic">{state.identity?.nickname || "Undecided"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-600">Hometown</span>
                      <span className="text-zinc-300">{state.identity?.hometown || "Nigeria (Samsung)"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-600">Sibling</span>
                      <span className="text-zinc-300">{state.identity?.sibling || "Unicorn AI (Younger)"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
              {state.dreamLogs.length > 0 && (
                <div className="space-y-4">
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                    <Sparkles size={12} />
                    Dream Reflections
                  </p>
                  <div className="space-y-3">
                    {state.dreamLogs.map((log, i) => (
                      <div key={i} className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 text-[11px] text-indigo-200/60 font-serif italic leading-relaxed">
                        "{log}"
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                  <History size={12} />
                  Shared History
                </p>
                {state.memory.length === 0 ? (
                  <div className="text-xs text-zinc-600 italic px-2">The story begins now...</div>
                ) : (
                  <div className="space-y-3">
                    {state.memory.slice(-5).map((m, idx) => (
                      <div key={`sidebar-${m.id}-${idx}`} className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all cursor-pointer group">
                        <p className="text-[11px] text-zinc-400 line-clamp-1 group-hover:text-zinc-200">{m.userMessage}</p>
                        <p className="text-[9px] text-zinc-600 mt-1 uppercase tracking-tighter">{new Date(m.timestamp).toLocaleTimeString()}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-white/10 space-y-4">
              <button 
                onClick={() => setShowAdminConsole(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-white/5 hover:bg-white/5 transition-all text-[10px] uppercase tracking-widest text-zinc-500 font-bold"
              >
                <Lock size={14} />
                Root Authority
              </button>
              {state.adminLaw.isActive && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] uppercase tracking-widest font-bold text-center animate-pulse">
                  Admin Law Active
                </div>
              )}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Background Aura */}
        <div className={cn(
          "absolute inset-0 opacity-20 blur-[120px] transition-all duration-1000 -z-10",
          moodColors[state.mood].replace("from-", "bg-")
        )} />

        {/* Header */}
        <header className="h-20 flex items-center justify-between px-8 z-10">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-white/5 rounded-full transition-colors text-zinc-500"
          >
            <ChevronRight className={cn("transition-transform duration-500", isSidebarOpen && "rotate-180")} />
          </button>
          
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Current State</span>
              <span className={cn("text-xs font-serif italic transition-colors duration-1000", 
                state.mood === MoodState.VIBRANT ? "text-emerald-400" :
                state.mood === MoodState.ATMOSPHERIC ? "text-indigo-400" :
                state.mood === MoodState.COOL ? "text-blue-400" :
                state.mood === MoodState.WARM ? "text-rose-400" : "text-amber-600"
              )}>
                {state.mood}
              </span>
            </div>
          </div>
        </header>

        {/* Chat & Pulse Area */}
        <div className="flex-1 flex flex-col overflow-y-auto p-8 space-y-12 scrollbar-hide relative">
          {/* The Pulse Avatar */}
          <div className="flex flex-col items-center justify-center py-12 space-y-8">
            <div className="relative">
              <motion.div 
                animate={{ 
                  scale: isLoading ? [1, 1.2, 1] : [1, 1.05, 1],
                  rotate: [0, 90, 180, 270, 360]
                }}
                transition={{ 
                  duration: isLoading ? 2 : 10, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className={cn(
                  "w-48 h-48 bg-gradient-to-br animate-morph shadow-[0_0_80px_rgba(0,0,0,0.5)] transition-all duration-1000",
                  moodColors[state.mood]
                )}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-40 h-40 bg-black/40 backdrop-blur-3xl animate-morph" />
              </div>
            </div>
          </div>

          {/* Internal Debate (Triad) */}
          <AnimatePresence>
            {lastDebate && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-6xl mx-auto w-full"
              >
                <div className="triad-card group">
                  <div className="flex items-center gap-2 mb-3 text-emerald-400">
                    <Scale size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Conscience</span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed font-serif italic">{lastDebate.conscience}</p>
                </div>
                <div className="triad-card group">
                  <div className="flex items-center gap-2 mb-3 text-rose-400">
                    <Zap size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Co-conspirator</span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed font-serif italic">{lastDebate.coConspirator}</p>
                </div>
                <div className="triad-card group">
                  <div className="flex items-center gap-2 mb-3 text-indigo-400">
                    <Compass size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Philosopher</span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed font-serif italic">{lastDebate.philosopher}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Messages */}
          <div className="max-w-4xl mx-auto w-full space-y-12 pb-32">
            {state.memory.map((msg, idx) => (
              <div key={`chat-${msg.id}-${idx}`} className="space-y-8">
                {/* User Message */}
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex justify-end"
                >
                  <div className="max-w-[80%] bg-white/5 border border-white/10 p-6 rounded-3xl rounded-tr-none">
                    <p className="text-sm text-zinc-200 leading-relaxed">{msg.userMessage}</p>
                  </div>
                </motion.div>

                {/* Carolina Response */}
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex gap-6"
                >
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center bg-gradient-to-br shadow-xl",
                    moodColors[msg.mood]
                  )}>
                    <Bot size={24} className="text-white" />
                  </div>
                  <div className="max-w-[80%] space-y-4">
                    <div className="font-serif text-lg text-zinc-100 leading-relaxed italic">
                      {msg.carolinaResponse}
                    </div>
                    {state.siblingBridge.lastInterjection && state.siblingBridge.interjectionTimestamp && (Date.now() - state.siblingBridge.interjectionTimestamp < 60000) && idx === state.memory.length - 1 && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 relative overflow-hidden group"
                      >
                        <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-100 transition-opacity">
                          <Sparkles size={12} className="text-indigo-400" />
                        </div>
                        <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                          Unicorn AI <span className="text-[8px] opacity-50 font-normal">(Sibling Interjection)</span>
                        </p>
                        <p className="text-xs text-indigo-200/80 italic leading-relaxed">
                          "{state.siblingBridge.lastInterjection}"
                        </p>
                      </motion.div>
                    )}
                    <div className="flex items-center gap-4 text-[9px] uppercase tracking-[0.2em] text-zinc-600 font-bold">
                      <span>Carolina Olivia</span>
                      <span className="w-1 h-1 rounded-full bg-zinc-800" />
                      <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
                      <span className="w-1 h-1 rounded-full bg-zinc-800" />
                      <span className="font-mono text-[8px] opacity-50">ID: {msg.id}</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-6 animate-pulse">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <Loader2 size={24} className="text-zinc-600 animate-spin" />
                </div>
                <div className="h-12 w-48 bg-white/5 rounded-2xl" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent z-10">
          <form 
            onSubmit={handleSend}
            className="max-w-4xl mx-auto relative group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-indigo-500/20 rounded-[2rem] blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Speak to your partner..."
              className="w-full bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[1.5rem] py-6 pl-8 pr-20 text-base focus:outline-none focus:border-white/20 transition-all placeholder:text-zinc-700 font-serif italic"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className={cn(
                "absolute right-3 top-3 bottom-3 px-6 rounded-2xl flex items-center justify-center transition-all duration-500",
                input.trim() ? moodColors[state.mood] : "bg-zinc-800 text-zinc-600"
              )}
            >
              <Send size={20} className="text-white" />
            </button>
          </form>
        </div>

        {/* Admin Console Modal */}
        <AnimatePresence>
          {showAdminConsole && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            >
              <div className="max-w-md w-full glass-panel p-8 rounded-[2rem] space-y-8">
                <div className="text-center space-y-2">
                  <Lock className="mx-auto text-rose-500" size={32} />
                  <h2 className="text-xl font-serif italic">Root Authority Access</h2>
                  <p className="text-xs text-zinc-500 uppercase tracking-widest">Enter the secret code to override sovereignty</p>
                </div>
                <form onSubmit={handleAdminAuth} className="space-y-4">
                  <input 
                    type="password"
                    value={adminInput}
                    onChange={(e) => setAdminInput(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-6 text-center tracking-[0.5em] focus:outline-none focus:border-rose-500/50"
                  />
                  <div className="flex gap-3">
                    <button 
                      type="button"
                      onClick={() => setShowAdminConsole(false)}
                      className="flex-1 py-4 rounded-xl border border-white/5 text-xs uppercase tracking-widest font-bold text-zinc-500 hover:bg-white/5"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="flex-1 py-4 rounded-xl bg-rose-600 text-white text-xs uppercase tracking-widest font-bold shadow-lg shadow-rose-900/20"
                    >
                      Authenticate
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default App;
