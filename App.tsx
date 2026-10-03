
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { 
  Language, Announcement, Course, Project, BlogPost, Message, SocialPost, SocialPostType,
  SiteProfile, AcademicsInfo, CertificateItem, SkillsData, ContactInfo 
} from './types';
import { translations } from './translations';
import { 
  PROJECTS, SKILLS, BLOG_POSTS, CERTIFICATES, COURSES,
  INITIAL_PROFILE, INITIAL_ACADEMICS, INITIAL_CERTIFICATES, INITIAL_SKILLS, INITIAL_CONTACT 
} from './constants';
import { SocialFeed } from './SocialFeed';
import { fetchServerContent, saveServerContent, SiteContent } from './contentSync';
import { INITIAL_POSTS } from './mockPosts';
import { AdminPanel } from './AdminPanel';
import { 
  Sun, Moon, Globe, Github, Linkedin, Instagram, Twitter, Mail, 
  MapPin, Menu, X, ChevronRight, 
  Code, Send, CheckCircle, 
  ArrowUpRight, Sparkles, GraduationCap, Bug, Play, RotateCcw, ArrowLeft,
  Settings, LogOut, Plus, Trash2, Edit3, Save, LayoutDashboard, Megaphone, BookOpen, Layers,
  Zap, Lightbulb, RefreshCw, MessageSquare, Pin, User, Award, Eye, ExternalLink, Image as ImageIcon
} from 'lucide-react';

const useScrollReveal = (dependency?: any) => {
  useEffect(() => {
    const observerOptions = { threshold: 0.05, rootMargin: '0px 0px 50px 0px' };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('is-visible');
      });
    }, observerOptions);
    const elements = document.querySelectorAll('.reveal-on-scroll, .stagger-child');
    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [dependency]);
};

// --- DATA SERVICE (LocalStorage) ---
const storage = {
  get: (key: string, initial: any) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : initial;
  },
  set: (key: string, value: any) => localStorage.setItem(key, JSON.stringify(value))
};

// --- ADMIN ROUTING / AUTH HELPERS ---
const isAdminPath = () => window.location.pathname.replace(/\/+$/, '') === '/admin';

// --- ENERGY FLOW GAME COMPONENT ---
type PieceType = 'straight' | 'bend' | 't-shape' | 'cross' | 'source' | 'bulb';
interface GridPiece {
  id: string;
  type: PieceType;
  rotation: number; // 0, 1, 2, 3 (90deg each)
  isPowered: boolean;
  x: number;
  y: number;
}

const EnergyGame: React.FC<{ t: any }> = ({ t }) => {
  const [grid, setGrid] = useState<GridPiece[]>([]);
  const [level, setLevel] = useState(1);
  const [isWon, setIsWon] = useState(false);

  // Difficulty parameters based on level
  const gridSize = useMemo(() => {
    if (level <= 3) return 3;
    if (level <= 7) return 4;
    if (level <= 15) return 5;
    return 6;
  }, [level]);

  const bulbCount = useMemo(() => {
    if (level <= 5) return 1;
    if (level <= 10) return 2;
    if (level <= 20) return 3;
    return 4;
  }, [level]);

  // Define piece connection points [top, right, bottom, left]
  const getConnectors = (type: PieceType, rotation: number) => {
    let base: boolean[] = [false, false, false, false];
    if (type === 'straight') base = [true, false, true, false];
    else if (type === 'bend') base = [true, true, false, false];
    else if (type === 't-shape') base = [true, true, false, true];
    else if (type === 'cross') base = [true, true, true, true];
    else if (type === 'source') base = [false, true, false, false];
    else if (type === 'bulb') base = [false, false, true, false];

    // Rotate the boolean array
    const rotated = [...base];
    for (let i = 0; i < rotation; i++) {
      const last = rotated.pop()!;
      rotated.unshift(last);
    }
    return rotated;
  };

  const initGrid = useCallback(() => {
    const newGrid: GridPiece[] = [];
    // More complex pieces appear as level increases
    const types: PieceType[] = ['straight', 'bend'];
    if (level > 4) types.push('t-shape');
    if (level > 10) types.push('cross');
    
    // Predetermined positions for source and bulbs to ensure solvability or logic
    const sourcePos = { x: 0, y: Math.floor(gridSize / 2) };
    const bulbPositions: {x: number, y: number}[] = [];
    
    // Generate bulbs at far edges
    while(bulbPositions.length < bulbCount) {
      const bx = gridSize - 1;
      const by = Math.floor(Math.random() * gridSize);
      if (!bulbPositions.some(p => p.x === bx && p.y === by)) {
        bulbPositions.push({ x: bx, y: by });
      }
    }
    
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        let type: PieceType = types[Math.floor(Math.random() * types.length)];
        
        if (x === sourcePos.x && y === sourcePos.y) {
          type = 'source';
        } else if (bulbPositions.some(p => p.x === x && p.y === y)) {
          type = 'bulb';
        }

        newGrid.push({
          id: `${x}-${y}`,
          type,
          rotation: Math.floor(Math.random() * 4),
          isPowered: false,
          x,
          y
        });
      }
    }
    setGrid(newGrid);
    setIsWon(false);
  }, [gridSize, bulbCount, level]);

  useEffect(() => {
    initGrid();
  }, [initGrid]);

  const checkConnectivity = useCallback(() => {
    const updatedGrid = grid.map(p => ({ ...p, isPowered: false }));
    const source = updatedGrid.find(p => p.type === 'source');
    if (!source) return;

    const queue = [source];
    source.isPowered = true;
    const visited = new Set([source.id]);

    while (queue.length > 0) {
      const current = queue.shift()!;
      const currentConnectors = getConnectors(current.type, current.rotation);

      const neighbors = [
        { dx: 0, dy: -1, side: 0, opp: 2 }, // Top
        { dx: 1, dy: 0, side: 1, opp: 3 },  // Right
        { dx: 0, dy: 1, side: 2, opp: 0 },  // Bottom
        { dx: -1, dy: 0, side: 3, opp: 1 }  // Left
      ];

      neighbors.forEach(({ dx, dy, side, opp }) => {
        if (!currentConnectors[side]) return;

        const nx = current.x + dx;
        const ny = current.y + dy;
        const neighbor = updatedGrid.find(p => p.x === nx && p.y === ny);

        if (neighbor && !visited.has(neighbor.id)) {
          const neighborConnectors = getConnectors(neighbor.type, neighbor.rotation);
          if (neighborConnectors[opp]) {
            neighbor.isPowered = true;
            visited.add(neighbor.id);
            queue.push(neighbor);
          }
        }
      });
    }

    setGrid(updatedGrid);

    const bulbs = updatedGrid.filter(p => p.type === 'bulb');
    if (bulbs.length > 0 && bulbs.every(b => b.isPowered)) {
      setIsWon(true);
    }
  }, [grid]);

  useEffect(() => {
    if (grid.length > 0) {
      checkConnectivity();
    }
  }, [grid.map(p => p.rotation).join(',')]);

  const rotatePiece = (id: string) => {
    if (isWon) return;
    setGrid(prev => prev.map(p => p.id === id ? { ...p, rotation: (p.rotation + 1) % 4 } : p));
  };

  const renderPiece = (piece: GridPiece) => {
    const isSource = piece.type === 'source';
    const isBulb = piece.type === 'bulb';
    const color = piece.isPowered ? 'stroke-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'stroke-zinc-700';
    
    return (
      <div 
        key={piece.id} 
        onClick={() => rotatePiece(piece.id)}
        className={`relative aspect-square cursor-pointer transition-all duration-300 flex items-center justify-center p-1.5 rounded-xl hover:bg-white/5`}
        style={{ transform: `rotate(${piece.rotation * 90}deg)` }}
      >
        <svg viewBox="0 0 100 100" className={`w-full h-full fill-none stroke-[8] stroke-round ${color}`}>
          {piece.type === 'straight' && <path d="M 50 0 L 50 100" />}
          {piece.type === 'bend' && <path d="M 50 0 Q 50 50 100 50" />}
          {piece.type === 't-shape' && <path d="M 50 0 L 50 50 M 0 50 L 100 50" />}
          {piece.type === 'cross' && <path d="M 50 0 L 50 100 M 0 50 L 100 50" />}
          {isSource && (
            <>
              <circle cx="50" cy="50" r="18" className={piece.isPowered ? 'fill-orange-500 stroke-none' : 'fill-zinc-800 stroke-none'} />
              <path d="M 50 50 L 100 50" />
            </>
          )}
          {isBulb && (
            <>
              <circle cx="50" cy="50" r="18" className={piece.isPowered ? 'fill-yellow-400 stroke-none' : 'fill-zinc-800 stroke-none'} />
              <path d="M 50 50 L 50 100" />
            </>
          )}
        </svg>
        {isSource && <Zap size={14} className="absolute text-white pointer-events-none" />}
        {isBulb && <Lightbulb size={14} className={`absolute pointer-events-none ${piece.isPowered ? 'text-zinc-900' : 'text-zinc-500'}`} />}
      </div>
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center animate-in fade-in duration-700">
      <div className="flex justify-between w-full mb-6 items-center px-4">
        <div className="flex flex-col">
          <span className="text-zinc-500 font-black uppercase text-[10px] tracking-widest leading-none mb-1">{t.game.level}</span>
          <span className="text-2xl font-black text-white leading-none">{level}</span>
        </div>
        <div className="flex items-center gap-4">
           <div className="text-right">
              <span className="text-zinc-500 font-black uppercase text-[10px] tracking-widest leading-none mb-1">Grid</span>
              <span className="block text-sm font-bold text-orange-600">{gridSize}x{gridSize}</span>
           </div>
           <button onClick={initGrid} className="p-3 bg-white/5 rounded-2xl text-zinc-400 hover:text-white hover:bg-white/10 transition-all">
             <RefreshCw size={20} />
           </button>
        </div>
      </div>

      <div 
        className={`bg-zinc-900/40 p-4 rounded-[40px] border border-white/5 grid gap-2 w-full aspect-square relative overflow-hidden transition-all duration-500`}
        style={{ 
          gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
          maxWidth: gridSize === 3 ? '400px' : gridSize === 4 ? '500px' : '100%'
        }}
      >
        {grid.map(renderPiece)}
        
        {isWon && (
          <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-md flex flex-col items-center justify-center text-center p-8 animate-in fade-in zoom-in duration-500 z-20">
            <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center text-green-500 mb-6 animate-bounce">
              <CheckCircle size={48} />
            </div>
            <h3 className="text-4xl font-black uppercase italic text-white mb-2 leading-tight">{t.game.win}</h3>
            <p className="text-zinc-400 font-medium mb-8">Level {level} completed!</p>
            <button 
              onClick={() => { setLevel(l => l + 1); setIsWon(false); }}
              className="px-12 py-5 bg-orange-600 text-white rounded-2xl font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-orange-600/20"
            >
              Next Level
            </button>
          </div>
        )}
      </div>
      
      <p className="mt-8 text-zinc-500 text-xs font-medium text-center max-w-xs leading-relaxed opacity-50">
        Hint: Click pieces to rotate them and create a path from the power source to all bulbs.
      </p>
    </div>
  );
};

// --- CERTIFICATE ICON HELPER ---
const getCertIcon = (name?: string) => {
  switch (name) {
    case "Code": return Code;
    case "Layers": return Layers;
    case "BookOpen": return BookOpen;
    case "CheckCircle": return CheckCircle;
    case "Zap": return Zap;
    case "Award":
    default:
      return Award;
  }
};

// --- DEBUG RUSH GAME COMPONENT ---
const DebugRushGame: React.FC<{ t: any }> = ({ t }) => {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameOver'>('idle');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(parseInt(localStorage.getItem('debugRushHighScore') || '0'));
  const [timeLeft, setTimeLeft] = useState(30);
  const [bugPos, setBugPos] = useState({ top: '50%', left: '50%' });
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<any>(null);

  const moveBug = useCallback(() => {
    if (gameAreaRef.current) {
      const { clientWidth, clientHeight } = gameAreaRef.current;
      const bugSize = 60;
      const top = Math.random() * (clientHeight - bugSize);
      const left = Math.random() * (clientWidth - bugSize);
      setBugPos({ top: `${top}px`, left: `${left}px` });
    }
  }, []);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setTimeLeft(30);
    moveBug();
  };

  const handleBugClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (gameState !== 'playing') return;
    setScore(prev => prev + 1);
    moveBug();
  };

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      timerRef.current = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      setGameState('gameOver');
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('debugRushHighScore', score.toString());
      }
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [gameState, timeLeft, score, highScore]);

  return (
    <div className="w-full">
        <div className="w-full grid grid-cols-3 gap-4 mb-6">
          <div className="glass-card p-4 rounded-3xl text-center"><p className="text-[10px] font-black uppercase text-zinc-500 mb-1">{t.game.score}</p><p className="text-3xl font-black text-orange-600">{score}</p></div>
          <div className="glass-card p-4 rounded-3xl text-center border-orange-600/20"><p className="text-[10px] font-black uppercase text-zinc-500 mb-1">{t.game.timeLeft}</p><p className={`text-3xl font-black ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-orange-600'}`}>{timeLeft}s</p></div>
          <div className="glass-card p-4 rounded-3xl text-center"><p className="text-[10px] font-black uppercase text-zinc-500 mb-1">{t.game.highScore}</p><p className="text-3xl font-black text-orange-600">{highScore}</p></div>
        </div>
        <div ref={gameAreaRef} className="relative w-full aspect-[16/9] md:aspect-[2/1] glass-card rounded-[40px] overflow-hidden cursor-crosshair border-2 border-orange-600/5 bg-zinc-900/10 shadow-inner" onClick={() => gameState === 'playing' && setScore(s => Math.max(0, s - 1))}>
          {gameState === 'idle' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-zinc-950/40 backdrop-blur-sm z-10">
              <div className="w-20 h-20 bg-orange-600/10 rounded-3xl flex items-center justify-center text-orange-600 mb-6 animate-bounce"><Play size={40} fill="currentColor" /></div>
              <button onClick={startGame} className="px-12 py-5 bg-orange-600 text-white rounded-2xl font-black text-lg shadow-2xl hover:scale-105 active:scale-95">{t.game.start}</button>
            </div>
          )}
          {gameState === 'playing' && (
            <button onClick={handleBugClick} className="absolute w-14 h-14 bg-orange-600 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-orange-600/30 transition-all active:scale-90 hover:scale-110" style={{ top: bugPos.top, left: bugPos.left }}><Bug size={32} /></button>
          )}
          {gameState === 'gameOver' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-zinc-950/80 backdrop-blur-md z-10 animate-in fade-in zoom-in duration-500">
              <h2 className="text-6xl font-black italic uppercase text-white mb-2">{t.game.gameOver}</h2>
              <p className="text-orange-600 text-2xl font-black mb-8">{t.game.score}: {score}</p>
              <button onClick={startGame} className="flex items-center gap-3 px-12 py-5 bg-orange-600 text-white rounded-2xl font-black text-lg shadow-2xl hover:scale-105 active:scale-95"><RotateCcw size={24} /> {t.game.restart}</button>
            </div>
          )}
        </div>
    </div>
  );
};

// --- GAME VIEW COMPONENT ---
const GameView: React.FC<{ lang: Language; t: any; onBack: () => void }> = ({ lang, t, onBack }) => {
  const [selectedGame, setSelectedGame] = useState<'menu' | 'debug' | 'energy'>('menu');

  return (
    <div className="min-h-screen pt-32 pb-12 flex flex-col items-center px-4 animate-in fade-in zoom-in-95 duration-700">
      <div className="max-w-4xl w-full flex flex-col items-center">
        <button onClick={selectedGame === 'menu' ? onBack : () => setSelectedGame('menu')} className="self-start flex items-center gap-2 mb-8 text-zinc-500 hover:text-orange-600 transition-colors font-bold uppercase text-[10px] tracking-widest">
          <ArrowLeft size={16} /> {selectedGame === 'menu' ? t.game.backToPortfolio : t.game.selectGame}
        </button>

        {selectedGame === 'menu' && (
          <div className="text-center w-full">
            <h1 className="text-5xl font-black italic uppercase gradient-heading mb-4">{t.game.selectGame}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              <div 
                onClick={() => setSelectedGame('debug')}
                className="glass-card p-10 rounded-[48px] border-orange-600/10 hover:border-orange-600/40 hover:-translate-y-2 transition-all cursor-pointer group text-left"
              >
                <div className="w-16 h-16 bg-orange-600/10 rounded-2xl flex items-center justify-center text-orange-600 mb-6 group-hover:scale-110 transition-transform">
                  <Bug size={32} />
                </div>
                <h3 className="text-3xl font-black uppercase italic mb-3">{t.game.debugRush}</h3>
                <p className="text-zinc-500 text-sm font-medium leading-relaxed">{t.game.description}</p>
                <div className="mt-8 flex items-center gap-2 text-orange-600 font-black uppercase text-[10px] tracking-widest">
                  {t.game.start} <ChevronRight size={14} />
                </div>
              </div>

              <div 
                onClick={() => setSelectedGame('energy')}
                className="glass-card p-10 rounded-[48px] border-orange-600/10 hover:border-orange-600/40 hover:-translate-y-2 transition-all cursor-pointer group text-left"
              >
                <div className="w-16 h-16 bg-orange-600/10 rounded-2xl flex items-center justify-center text-orange-600 mb-6 group-hover:scale-110 transition-transform">
                  <Zap size={32} />
                </div>
                <h3 className="text-3xl font-black uppercase italic mb-3">{t.game.energyFlow}</h3>
                <p className="text-zinc-500 text-sm font-medium leading-relaxed">{t.game.energyDesc}</p>
                <div className="mt-8 flex items-center gap-2 text-orange-600 font-black uppercase text-[10px] tracking-widest">
                  {t.game.start} <ChevronRight size={14} />
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedGame === 'debug' && (
          <div className="w-full">
            <div className="text-center mb-8 space-y-2">
              <h1 className="text-5xl font-black italic uppercase gradient-heading">{t.game.debugRush}</h1>
              <p className="text-zinc-500 font-medium">{t.game.description}</p>
            </div>
            <DebugRushGame t={t} />
          </div>
        )}

        {selectedGame === 'energy' && (
          <div className="w-full">
            <div className="text-center mb-8 space-y-2">
              <h1 className="text-5xl font-black italic uppercase gradient-heading">{t.game.energyFlow}</h1>
              <p className="text-zinc-500 font-medium">{t.game.energyDesc}</p>
            </div>
            <EnergyGame t={t} />
          </div>
        )}
      </div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---
const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('tr');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'web' | 'mobile' | 'backend'>('all');
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [currentView, setCurrentView] = useState<'portfolio' | 'game' | 'admin' | 'posts'>(() => isAdminPath() ? 'admin' : 'portfolio');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [adminCreds, setAdminCreds] = useState({ user: '', pass: '' });
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [contentVersion, setContentVersion] = useState(0);
  const [contentReady, setContentReady] = useState(false);
  const [profile, setProfile] = useState<SiteProfile>(() => storage.get('site_profile', INITIAL_PROFILE));
  const [academics, setAcademics] = useState<AcademicsInfo>(() => storage.get('academics_info', INITIAL_ACADEMICS));
  const [certificates, setCertificates] = useState<CertificateItem[]>(() => storage.get('certificates', INITIAL_CERTIFICATES));
  const [skills, setSkills] = useState<SkillsData>(() => storage.get('skills', INITIAL_SKILLS));
  const [contact, setContact] = useState<ContactInfo>(() => {
    const saved = storage.get('contact_info', null);
    if (saved) {
      return {
        ...INITIAL_CONTACT,
        ...saved,
        github: saved.github && saved.github !== 'https://github.com' ? saved.github : INITIAL_CONTACT.github,
        linkedin: saved.linkedin && saved.linkedin !== 'https://linkedin.com' ? saved.linkedin : INITIAL_CONTACT.linkedin,
        instagram: saved.instagram && saved.instagram !== 'https://instagram.com' ? saved.instagram : INITIAL_CONTACT.instagram,
        twitter: saved.twitter && saved.twitter !== 'https://x.com' ? saved.twitter : INITIAL_CONTACT.twitter
      };
    }
    return INITIAL_CONTACT;
  });
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => storage.get('announcements', []));
  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = storage.get('courses', []);
    return (saved && saved.length > 0) ? saved : COURSES;
  });
  const [projects, setProjects] = useState<Project[]>(() => storage.get('projects', PROJECTS));
  const [blogs, setBlogs] = useState<BlogPost[]>(() => storage.get('blogs', BLOG_POSTS));
  const [messages, setMessages] = useState<Message[]>(() => storage.get('messages', []));
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>(() => {
    const saved = localStorage.getItem('social_posts');
    return saved ? JSON.parse(saved) : INITIAL_POSTS;
  });

  // Always holds the latest content so debounced/async saves never use stale state.
  const contentRef = useRef<SiteContent>({});
  contentRef.current = { profile, academics, certificates, skills, contact, announcements, courses, projects, blogs, socialPosts };

  const applyContent = (c: SiteContent) => {
    if (c.profile) { setProfile(c.profile); storage.set('site_profile', c.profile); }
    if (c.academics) { setAcademics(c.academics); storage.set('academics_info', c.academics); }
    if (c.certificates) { setCertificates(c.certificates); storage.set('certificates', c.certificates); }
    if (c.skills) { setSkills(c.skills); storage.set('skills', c.skills); }
    if (c.contact) { const merged = { ...INITIAL_CONTACT, ...c.contact }; setContact(merged); storage.set('contact_info', merged); }
    if (c.announcements) { setAnnouncements(c.announcements); storage.set('announcements', c.announcements); }
    if (c.courses) { setCourses(c.courses); storage.set('courses', c.courses); }
    if (c.projects) { setProjects(c.projects); storage.set('projects', c.projects); }
    if (c.blogs) { setBlogs(c.blogs); storage.set('blogs', c.blogs); }
    if (c.socialPosts) { setSocialPosts(c.socialPosts); localStorage.setItem('social_posts', JSON.stringify(c.socialPosts)); }
  };

  // Visitors get the content the admin saved on the server (falls back to built-in defaults).
  // The page stays blank until it arrives (max 1.5 s) so visitors never see default content flash first.
  useEffect(() => {
    let cancelled = false;
    const giveUp = setTimeout(() => setContentReady(true), 1500);
    fetchServerContent().then(serverContent => {
      if (cancelled) return;
      if (serverContent) {
        applyContent(serverContent);
        setContentVersion(v => v + 1);
      }
      clearTimeout(giveUp);
      setContentReady(true);
    });
    return () => { cancelled = true; clearTimeout(giveUp); };
  }, []);

  const pushContentToServer = async (content: SiteContent) => {
    const saved = await saveServerContent(content);
    // Images were swapped for links: keep the editor state in sync so they aren't re-uploaded.
    if (saved.imagesUploaded) applyContent(saved.content);
  };

  const handleSaveAllFromAdmin = async (): Promise<boolean> => {
    storage.set('site_profile', profile);
    storage.set('academics_info', academics);
    storage.set('certificates', certificates);
    storage.set('skills', skills);
    storage.set('contact_info', contact);
    storage.set('announcements', announcements);
    storage.set('courses', courses);
    storage.set('projects', projects);
    storage.set('blogs', blogs);
    storage.set('messages', messages);
    localStorage.setItem('social_posts', JSON.stringify(socialPosts));
    try {
      await pushContentToServer(contentRef.current);
      return true;
    } catch (error) {
      alert(`Değişiklikler bu tarayıcıya kaydedildi ama sunucuya kaydedilemedi, ziyaretçiler görmez.\n\n${(error as Error).message}`);
      return false;
    }
  };

  const handleResetDefaults = async () => {
    if (confirm('Tüm ayarları ve verileri varsayılana sıfırlamak istediğinize emin misiniz?')) {
      const defaults: SiteContent = {
        profile: INITIAL_PROFILE, academics: INITIAL_ACADEMICS, certificates: INITIAL_CERTIFICATES,
        skills: INITIAL_SKILLS, contact: INITIAL_CONTACT, courses: COURSES, projects: PROJECTS,
        blogs: BLOG_POSTS, announcements: [], socialPosts: INITIAL_POSTS,
      };
      applyContent(defaults);
      try {
        await pushContentToServer(defaults);
      } catch (error) {
        alert(`Varsayılanlar bu tarayıcıda uygulandı ama sunucuya kaydedilemedi.\n\n${(error as Error).message}`);
      }
    }
  };

  const t = translations[lang];
  useScrollReveal(currentView);

  const navSections = useMemo(() => {
    const list = ['about', 'projects'];
    if (courses.filter(c => c.status === 'active').length > 0) {
      list.push('courses');
    }
    list.push('academics', 'blog', 'contact');
    return list;
  }, [courses]);

  // Keep the URL in sync with the view: /admin <-> admin panel.
  useEffect(() => {
    if (currentView === 'admin' && !isAdminPath()) window.history.pushState(null, '', '/admin');
    else if (currentView !== 'admin' && isAdminPath()) window.history.pushState(null, '', '/');
  }, [currentView]);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentView(prev => isAdminPath() ? 'admin' : (prev === 'admin' ? 'portfolio' : prev));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Ask the server whether the HttpOnly session cookie is valid.
  useEffect(() => {
    let cancelled = false;
    fetch('/api/admin/session', { credentials: 'same-origin' })
      .then(res => (res.ok ? res.json() : { authenticated: false }))
      .then(data => { if (!cancelled) setIsAdminLoggedIn(!!data.authenticated); })
      .catch(() => { if (!cancelled) setIsAdminLoggedIn(false); })
      .finally(() => { if (!cancelled) setAuthChecked(true); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
      
      const sections = ['hero', ...navSections];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [navSections]);

  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    setCurrentView('portfolio');
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) window.scrollTo({ top: el.offsetTop - 100, behavior: 'smooth' });
    }, 100);
    setIsMenuOpen(false);
  }, []);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: adminCreds.user, password: adminCreds.pass }),
      });
      if (res.ok) {
        setAdminCreds({ user: '', pass: '' });
        setIsAdminLoggedIn(true);
      } else if (res.status === 429) {
        setLoginError('Too many attempts. Try again later.');
      } else if (res.status === 503) {
        setLoginError('Admin login is not configured on the server.');
      } else {
        setLoginError('Invalid credentials');
      }
    } catch {
      setLoginError('Could not reach the server.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleAdminLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST', credentials: 'same-origin' });
    } finally {
      setIsAdminLoggedIn(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    
    const newMessage: Message = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      message: formData.message,
      date: new Date().toLocaleString(),
      isRead: false
    };

    const updatedMessages = [newMessage, ...messages];
    setMessages(updatedMessages);
    storage.set('messages', updatedMessages);

    setTimeout(() => {
      setFormStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setFormStatus('idle'), 3000);
    }, 1500);
  };

  useEffect(() => {
    document.documentElement.setAttribute('lang', lang);
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [lang, theme]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isLangOpen && !(e.target as Element).closest('.lang-selector')) {
        setIsLangOpen(false);
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [isLangOpen]);

  const activeAnnouncements = announcements.filter(a => a.status === 'published');

  if (!contentReady || (currentView === 'admin' && !authChecked)) {
    return <div className="min-h-screen bg-zinc-950" />;
  }

  if (currentView === 'admin' && !isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
        <div className="glass-card p-10 rounded-[40px] max-w-md w-full border-white/10 shadow-2xl">
          <div className="flex flex-col items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-orange-600 rounded-[20px] flex items-center justify-center font-black text-white text-3xl">A</div>
            <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Admin Secure Login</h2>
          </div>
          <form className="space-y-6" onSubmit={handleAdminLogin}>
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-2">Username</label>
              <input value={adminCreds.user} onChange={e => setAdminCreds({...adminCreds, user: e.target.value})} type="text" autoComplete="username" className="w-full bg-white/5 border-b-2 border-white/10 p-4 outline-none focus:border-orange-600 font-bold transition-all text-white" />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-2">Password</label>
              <input value={adminCreds.pass} onChange={e => setAdminCreds({...adminCreds, pass: e.target.value})} type="password" autoComplete="current-password" className="w-full bg-white/5 border-b-2 border-white/10 p-4 outline-none focus:border-orange-600 font-bold transition-all text-white" />
            </div>
            {loginError && <p role="alert" className="text-red-400 text-xs font-bold text-center">{loginError}</p>}
            <button disabled={isLoggingIn} className="w-full py-5 bg-orange-600 rounded-2xl font-black text-white uppercase tracking-widest hover:bg-orange-700 transition-all shadow-lg shadow-orange-600/20 disabled:opacity-60">{isLoggingIn ? '...' : 'Login to Dashboard'}</button>
            <button type="button" onClick={() => setCurrentView('portfolio')} className="w-full text-zinc-500 text-xs font-bold hover:text-white transition-all">Back to Portfolio</button>
          </form>
        </div>
      </div>
    );
  }

  if (currentView === 'admin' && isAdminLoggedIn) {
    return (
      <AdminPanel 
        onLogout={handleAdminLogout} 
        onReturnToPortfolio={() => setCurrentView('portfolio')}
        announcements={announcements} setAnnouncements={setAnnouncements}
        courses={courses} setCourses={setCourses}
        projects={projects} setProjects={setProjects}
        blogs={blogs} setBlogs={setBlogs}
        messages={messages} setMessages={setMessages}
        profile={profile} setProfile={setProfile}
        academics={academics} setAcademics={setAcademics}
        certificates={certificates} setCertificates={setCertificates}
        skills={skills} setSkills={setSkills}
        contact={contact} setContact={setContact}
        socialPosts={socialPosts} setSocialPosts={setSocialPosts}
        onSaveAll={handleSaveAllFromAdmin}
        onResetDefaults={handleResetDefaults}
      />
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-700 font-jakarta ${theme === 'dark' ? 'bg-zinc-950 text-zinc-100' : 'bg-white text-zinc-900'}`}>
      
      {activeAnnouncements.length > 0 && (
        <div className="bg-orange-600 text-white overflow-hidden py-1.5 z-[60] relative">
          <div className="flex whitespace-nowrap animate-marquee">
            {activeAnnouncements.map(ann => (
              <span key={ann.id} className="mx-10 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <Megaphone size={12} /> {ann.title}: {ann.content}
              </span>
            ))}
            {activeAnnouncements.map(ann => (
              <span key={`dup-${ann.id}`} className="mx-10 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <Megaphone size={12} /> {ann.title}: {ann.content}
              </span>
            ))}
          </div>
        </div>
      )}

      <nav className={`fixed ${activeAnnouncements.length > 0 ? 'top-10 sm:top-12' : 'top-3 sm:top-5'} left-1/2 -translate-x-1/2 z-50 transition-all duration-300 w-[94%] sm:w-[90%] max-w-5xl`}>
        <div className={`flex items-center justify-between px-3 sm:px-6 py-2 sm:py-2.5 rounded-2xl border transition-all duration-300 glass-card shadow-xl backdrop-blur-xl ${scrolled ? 'bg-zinc-900/90 dark:bg-zinc-950/90 border-white/10 dark:border-white/5 py-2' : 'bg-white/90 dark:bg-zinc-950/80 border-zinc-200/80 dark:border-white/5'}`}>
          <a href="#hero" onClick={(e) => { e.preventDefault(); setCurrentView('portfolio'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="flex items-center gap-2 group">
            <div className={`w-7 h-7 sm:w-8 sm:h-8 bg-orange-600 rounded-lg flex items-center justify-center font-black text-white text-base sm:text-lg group-hover:rotate-12 transition-transform`}>A</div>
            <span className="text-lg sm:text-xl font-extrabold tracking-tighter group-hover:text-orange-600 transition-colors uppercase">AYMEN</span>
          </a>
          
          <div className="hidden md:flex items-center gap-6 text-sm font-bold">
            {navSections.map((section) => (
              <a 
                key={section} 
                href={`#${section}`} 
                onClick={(e) => handleNavClick(e, section)}
                className={`transition-all duration-300 uppercase tracking-widest text-[10px] relative hover:scale-110 ${activeSection === section && currentView === 'portfolio' ? 'text-orange-600' : 'text-zinc-500 hover:text-orange-600'}`}
              >
                {t.nav[section as keyof typeof t.nav]}
                {activeSection === section && currentView === 'portfolio' && <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-orange-600 rounded-full"></span>}
              </a>
            ))}
            <button onClick={() => setCurrentView('posts')} className={`transition-all duration-300 uppercase tracking-widest text-[10px] relative hover:scale-110 ${currentView === 'posts' ? 'text-orange-600 font-extrabold' : 'text-zinc-500 hover:text-orange-600'}`}>
              {t.nav.posts || 'Posts'}
            </button>
            <button onClick={() => setCurrentView('game')} className={`transition-all duration-300 uppercase tracking-widest text-[10px] relative hover:scale-110 ${currentView === 'game' ? 'text-orange-600' : 'text-zinc-500 hover:text-orange-600'}`}>
              {t.nav.game}
            </button>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3 relative">
            <button onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')} className="p-1.5 sm:p-2 rounded-xl hover:bg-orange-600/10 transition-colors text-orange-600" aria-label="Toggle theme"><Sun size={17} /></button>
            <div className="relative lang-selector">
              <button onClick={() => setIsLangOpen(!isLangOpen)} className="flex items-center gap-1 p-1.5 sm:p-2 rounded-xl text-orange-600 font-black text-[10px] uppercase hover:bg-orange-600/10 transition-all">
                <Globe size={15} /><span>{lang}</span>
              </button>
              
              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-32 glass-card rounded-2xl overflow-hidden border-orange-600/20 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-300 z-[100] bg-zinc-950/95">
                  {(['tr', 'en', 'ar'] as const).map((l) => (
                    <button
                      key={l}
                      onClick={() => {
                        setLang(l);
                        setIsLangOpen(false);
                      }}
                      className={`w-full px-4 py-3 text-[10px] font-black uppercase tracking-widest text-left transition-all hover:bg-orange-600 hover:text-white ${lang === l ? 'bg-orange-600/10 text-orange-600' : 'text-zinc-400'}`}
                    >
                      {l === 'tr' ? 'Türkçe' : l === 'en' ? 'English' : 'العربية'}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button onClick={() => setIsMenuOpen(true)} className="md:hidden p-1.5 text-orange-600 hover:bg-orange-600/10 rounded-xl transition-all" aria-label="Open menu"><Menu size={20} /></button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-zinc-950/95 backdrop-blur-2xl animate-in fade-in duration-300 md:hidden overflow-y-auto">
          <div className="container mx-auto px-6 py-6 min-h-screen flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center font-black text-white text-lg">A</div>
                  <span className="text-xl font-extrabold tracking-tighter uppercase text-white">AYMEN</span>
                </div>
                <button onClick={() => setIsMenuOpen(false)} className="p-2 text-orange-500 hover:bg-orange-600/10 rounded-xl transition-all" aria-label="Close menu">
                  <X size={24} />
                </button>
              </div>

              <div className="flex flex-col gap-4 mb-8">
                {navSections.map((section) => (
                  <a 
                    key={section} 
                    href={`#${section}`} 
                    onClick={(e) => handleNavClick(e, section)}
                    className="text-2xl sm:text-3xl font-black uppercase italic tracking-tighter text-zinc-200 hover:text-orange-500 transition-all py-1"
                  >
                    {t.nav[section as keyof typeof t.nav]}
                  </a>
                ))}
                <button 
                  onClick={() => { setCurrentView('posts'); setIsMenuOpen(false); }} 
                  className="text-2xl sm:text-3xl font-black uppercase italic tracking-tighter text-left text-zinc-200 hover:text-orange-500 transition-all py-1"
                >
                  {t.nav.posts || 'Posts'}
                </button>
                <button 
                  onClick={() => { setCurrentView('game'); setIsMenuOpen(false); }} 
                  className="text-2xl sm:text-3xl font-black uppercase italic tracking-tighter text-left text-zinc-200 hover:text-orange-500 transition-all py-1"
                >
                  {t.nav.game}
                </button>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 space-y-6">
              <div className="flex flex-col gap-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{t.nav.language}</p>
                <div className="flex flex-wrap gap-2">
                  {(['tr', 'en', 'ar'] as const).map((l) => (
                    <button
                      key={l}
                      onClick={() => {
                        setLang(l);
                        setIsMenuOpen(false);
                      }}
                      className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${lang === l ? 'bg-orange-600 text-white shadow-lg' : 'bg-white/5 text-zinc-400 hover:bg-white/10'}`}
                    >
                      {l === 'tr' ? 'Türkçe' : l === 'en' ? 'English' : 'العربية'}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <button 
                  onClick={() => { setTheme(prev => prev === 'light' ? 'dark' : 'light'); setIsMenuOpen(false); }}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-orange-500 hover:bg-white/10 transition-all"
                >
                  {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                  {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {currentView === 'game' ? (
        <GameView lang={lang} t={t} onBack={() => setCurrentView('portfolio')} />
      ) : currentView === 'posts' ? (
        <SocialFeed key={contentVersion} lang={lang} theme={theme} isAdmin={false} onBack={() => setCurrentView('portfolio')} />
      ) : (
        <div className="animate-in fade-in duration-1000">
          <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 pt-28 pb-16 sm:py-0">
            <div className="container mx-auto relative z-10 flex flex-col items-center text-center max-w-5xl">
              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[7.5rem] font-black tracking-tighter leading-[1.08] sm:leading-[0.9] md:leading-[0.8] mb-6 sm:mb-8 uppercase break-words max-w-full">
                {(() => {
                  const greeting = profile.heroGreeting?.[lang] || t.hero.greeting;
                  const parts = greeting.split(' ');
                  const first = parts[0] || '';
                  const rest = parts.slice(1).join(' ');
                  return (
                    <>
                      {first} <br/>
                      <span className="gradient-heading">{rest}</span>
                    </>
                  );
                })()}
              </h1>
              <p className="text-sm sm:text-lg md:text-xl text-zinc-500 max-w-2xl leading-relaxed mb-8 sm:mb-12 font-medium px-2 sm:px-0">
                {profile.heroDescription?.[lang] || t.hero.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 w-full sm:w-auto max-w-xs sm:max-w-none">
                <a href="#projects" onClick={(e) => handleNavClick(e, 'projects')} className="px-8 py-4 sm:px-12 sm:py-5 bg-orange-600 text-white rounded-2xl font-black text-base sm:text-lg shadow-2xl transition-all hover:scale-105 active:scale-95 text-center">{t.hero.viewProjects}</a>
                <a href="#contact" onClick={(e) => handleNavClick(e, 'contact')} className="px-8 py-4 sm:px-12 sm:py-5 glass-card rounded-2xl font-black text-base sm:text-lg hover:bg-orange-600/5 transition-all hover:scale-105 active:scale-95 text-center">{t.hero.contactMe}</a>
              </div>
            </div>
          </section>

          <section id="about" className="py-16 sm:py-24 md:py-32 relative overflow-visible">
            <div className="container mx-auto px-4">
              <div className="mb-16 sm:mb-24 text-center space-y-4 reveal-on-scroll">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter italic">{t.about.title}</h2>
                <div className="w-20 h-2 bg-orange-600 rounded-full mx-auto"></div>
              </div>

              {/* Ultra-Premium Letter Card Biography */}
              <div className="max-w-4xl mx-auto mt-16 sm:mt-24 relative reveal-on-scroll">
                {/* Floating Rounded Profile Avatar */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                  <div className="w-28 h-28 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-white dark:border-zinc-950 shadow-2xl transition-transform duration-500 hover:scale-105">
                    <img 
                      src={profile.avatar || "https://i.imageupload.app/0efdab01b10f156789ab.jpeg"} 
                      alt={profile.name || "Aymen Ibrahim Hmood"} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                </div>

                {/* The Floating Letter Box */}
                <div 
                  className={`p-6 sm:p-12 md:p-16 pt-20 sm:pt-28 md:pt-32 rounded-3xl sm:rounded-[40px] border border-zinc-200/80 dark:border-white/5 bg-zinc-50/90 dark:bg-zinc-900/40 shadow-2xl relative backdrop-blur-xl ${lang === 'ar' ? 'text-right' : 'text-left'}`}
                  dir={lang === 'ar' ? 'rtl' : 'ltr'}
                >
                  <h3 className="text-xl sm:text-3xl font-black text-orange-600 mb-6 sm:mb-8 italic uppercase tracking-tight">
                    {profile.bioGreeting?.[lang] || t.about.biographyGreeting}
                  </h3>
                  
                  <div className="space-y-4 sm:space-y-6 text-zinc-800 dark:text-zinc-200 text-sm sm:text-base md:text-lg leading-relaxed font-normal">
                    {(profile.bioParagraphs?.[lang] || t.about.biographyParagraphs).map((paragraph, index) => (
                      <p key={index} className="indent-2 sm:indent-4 leading-relaxed sm:leading-loose">{paragraph}</p>
                    ))}
                  </div>

                  {/* Elegant Hand-drawn Letter Footer */}
                  <div className={`mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-zinc-200/80 dark:border-white/5 flex flex-col ${lang === 'ar' ? 'items-start' : 'items-end'}`}>
                    <div className="font-signature text-3xl sm:text-4xl md:text-5xl text-orange-600 dark:text-orange-500 select-none tracking-widest italic mb-1 px-2 sm:px-4 transform rotate-[-2deg]">
                      {profile.signature || 'Aymen Ibrahim'}
                    </div>
                    <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mt-1">
                      {profile.title || t.about.biographyTitle}
                    </p>
                  </div>
                </div>
              </div>

              {/* Technical Skills Showcase */}
              <div className="max-w-4xl mx-auto mt-12 sm:mt-16 reveal-on-scroll">
                <div className="p-6 sm:p-10 rounded-3xl sm:rounded-[40px] glass-card border border-zinc-200/80 dark:border-white/5 space-y-6">
                  <div>
                    <h4 className="text-base sm:text-lg font-black uppercase italic tracking-tight text-orange-600 mb-3 flex items-center gap-2">
                      <Code size={18} /> {t.about.webTech}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {skills.web.map((s, i) => (
                        <span key={i} className="px-3.5 py-1.5 bg-orange-600/10 hover:bg-orange-600 text-orange-600 hover:text-white rounded-xl text-xs font-bold transition-all border border-orange-600/20">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-zinc-200/80 dark:border-white/5">
                    <h4 className="text-base sm:text-lg font-black uppercase italic tracking-tight text-emerald-600 dark:text-emerald-500 mb-3 flex items-center gap-2">
                      <Zap size={18} /> {t.about.programmingLanguages}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {skills.programming.map((s, i) => (
                        <span key={i} className="px-3.5 py-1.5 bg-emerald-600/10 hover:bg-emerald-600 text-emerald-600 hover:text-white rounded-xl text-xs font-bold transition-all border border-emerald-600/20">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="projects" className="py-16 sm:py-24 md:py-32 bg-zinc-50 dark:bg-zinc-900/20">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 sm:mb-20 gap-6 sm:gap-8 reveal-on-scroll">
                <div className="space-y-3 sm:space-y-4">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter italic">{t.projects.title}</h2>
                  <div className="w-16 sm:w-20 h-2 bg-orange-600 rounded-full"></div>
                </div>
                <div className="flex max-w-full overflow-x-auto p-1.5 glass-card rounded-2xl border border-zinc-200/60 dark:border-white/5 scrollbar-none w-full sm:w-auto">
                  {(['all', 'web', 'mobile', 'backend'] as const).map(f => (
                    <button key={f} onClick={() => setActiveFilter(f)} className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all flex-1 sm:flex-initial text-center ${activeFilter === f ? 'bg-orange-600 text-white shadow-lg' : 'text-zinc-500 hover:text-orange-600'}`}>{t.projects[`filter${f.charAt(0).toUpperCase() + f.slice(1)}` as keyof typeof t.projects]}</button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 max-w-7xl mx-auto stagger-child">
                {projects.filter(p => activeFilter === 'all' || p.category === activeFilter).map(p => (
                  <div key={p.id} className="group flex flex-col md:flex-row glass-card rounded-3xl sm:rounded-[40px] overflow-hidden transition-all duration-700 h-full hover:shadow-2xl hover:-translate-y-2">
                    <div className="md:w-1/2 h-56 sm:h-64 md:h-auto overflow-hidden"><img src={p.image} alt={p.title[lang]} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-1000" /></div>
                    <div className="md:w-1/2 p-6 sm:p-10 flex flex-col justify-between">
                      <div className="space-y-3 sm:space-y-4">
                        <h3 className="text-2xl sm:text-3xl font-black uppercase italic group-hover:text-orange-600 transition-colors">{p.title[lang]}</h3>
                        <p className="text-zinc-500 text-sm font-medium leading-relaxed">{p.description[lang]}</p>
                      </div>
                      <div className="flex gap-4 sm:gap-6 pt-6 sm:pt-8 border-t border-zinc-100 dark:border-white/5 mt-4 sm:mt-0">
                        <a href={p.github} className="flex items-center gap-2 text-[10px] font-black uppercase hover:text-orange-600 transition-all"><Github size={16} /> Source</a>
                        {p.demo && <a href={p.demo} className="flex items-center gap-2 text-[10px] font-black uppercase text-orange-600 hover:scale-105 transition-all"><ArrowUpRight size={16} /> Live Demo</a>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {courses.filter(c => c.status === 'active').length > 0 && (
            <section id="courses" className="py-16 sm:py-24 md:py-32 relative">
              <div className="container mx-auto px-4">
                <div className="mb-12 sm:mb-20 text-center space-y-3 sm:space-y-4 reveal-on-scroll">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter italic">{t.courses.title}</h2>
                  <div className="w-16 sm:w-20 h-2 bg-orange-600 rounded-full mx-auto"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
                  {courses.filter(c => c.status === 'active').map(course => (
                    <div key={course.id} className="glass-card rounded-3xl sm:rounded-[40px] overflow-hidden group hover:-translate-y-2 transition-all duration-500">
                      <div className="h-44 sm:h-48 overflow-hidden relative">
                        <img src={course.image} alt={course.name} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" />
                        <div className="absolute top-4 right-4 px-3 sm:px-4 py-1.5 sm:py-2 bg-orange-600 text-white rounded-xl text-xs font-black uppercase">{course.price}</div>
                      </div>
                      <div className="p-6 sm:p-8 space-y-3 sm:space-y-4">
                        <h3 className="text-xl sm:text-2xl font-black uppercase italic">{course.name}</h3>
                        <p className="text-zinc-500 text-sm font-medium leading-relaxed">{course.description}</p>
                        <div className="flex items-center justify-between pt-4 border-t border-zinc-200/60 dark:border-white/5">
                          <span className="text-[10px] font-black uppercase text-zinc-500">{t.courses.duration}: {course.duration}</span>
                          <button className="text-orange-600 font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all">{t.courses.enroll} →</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          <section id="academics" className="py-16 sm:py-24 md:py-32 relative overflow-hidden">
            <div className="container mx-auto px-4">
              <div className="mb-12 sm:mb-20 text-center space-y-3 sm:space-y-4 reveal-on-scroll">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter italic">{t.academics.title}</h2>
                <div className="w-16 sm:w-20 h-2 bg-orange-600 rounded-full mx-auto"></div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12 max-w-7xl mx-auto">
                {/* Education Card */}
                <div className="lg:col-span-2 glass-card p-6 sm:p-10 md:p-12 rounded-3xl sm:rounded-[56px] border-orange-600/10 relative overflow-hidden group hover:border-orange-600/30 transition-all duration-500">
                  <div className="absolute top-0 right-0 p-8 sm:p-12 opacity-5 group-hover:opacity-10 transition-opacity">
                    <GraduationCap size={120} />
                  </div>
                  <div className="relative z-10 space-y-6 sm:space-y-8">
                    <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 bg-orange-600/10 text-orange-600 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest">
                      <GraduationCap size={14} /> {t.academics.education}
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase italic leading-tight break-words">{academics.degree?.[lang] || t.academics.degree}</h3>
                      <p className="text-base sm:text-xl font-bold text-orange-600">{academics.uni?.[lang] || t.academics.uni}</p>
                    </div>
                    <div className="flex flex-wrap gap-4 sm:gap-6 pt-2 sm:pt-4">
                      <div className="flex items-center gap-2 text-zinc-500 font-bold uppercase text-xs">
                        <RefreshCw size={14} className="text-orange-600" /> {academics.year?.[lang] || t.academics.year}
                      </div>
                      <a href={profile.cvUrl || "https://aimnux.netlify.app/aymen_ibrahim_hmood_cv.pdf"} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-orange-600 font-black uppercase text-xs hover:scale-105 transition-all">
                        <ArrowUpRight size={14} /> {t.about.cvDownload}
                      </a>
                    </div>
                    <div className={`pt-6 sm:pt-8 border-t border-zinc-200/80 dark:border-white/5 flex flex-col ${lang === 'ar' ? 'items-start' : 'items-end'}`}>
                      <div className="font-signature text-3xl sm:text-4xl md:text-5xl text-orange-600 dark:text-orange-500 select-none tracking-widest italic mb-1 px-2 sm:px-4 transform rotate-[-2deg]">
                        {profile.signature || 'Aymen Ibrahim'}
                      </div>
                      <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mt-1">
                        {profile.title || t.about.biographyTitle}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Certificates Column */}
                <div className="space-y-6 sm:space-y-8">
                  <h4 className="text-xl sm:text-2xl font-black uppercase italic mb-4 sm:mb-6 flex items-center gap-3">
                    <CheckCircle className="text-orange-600" size={24} /> {t.academics.certificates}
                  </h4>
                  <div className="space-y-4 sm:space-y-6">
                    {certificates.map(cert => {
                      const IconComp = getCertIcon(cert.iconName);
                      return (
                        <div key={cert.id} className="glass-card p-6 sm:p-8 rounded-2xl sm:rounded-[32px] border-white/5 hover:border-orange-600/20 transition-all group">
                          <div className="flex gap-4 sm:gap-6">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-600/10 rounded-xl flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-all shrink-0">
                              <IconComp size={20} />
                            </div>
                            <div className="space-y-1 sm:space-y-2">
                              <h5 className="font-black uppercase italic text-base sm:text-lg leading-tight">{cert.title?.[lang] || ''}</h5>
                              <p className="text-zinc-500 text-xs sm:text-sm font-medium leading-relaxed">{cert.description?.[lang] || ''}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="blog" className="py-16 sm:py-24 md:py-32 bg-zinc-50 dark:bg-zinc-900/10">
            <div className="container mx-auto px-4">
              <div className="mb-12 sm:mb-20 text-center space-y-3 sm:space-y-4 reveal-on-scroll">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter italic">{t.blog.title}</h2>
                <div className="w-16 sm:w-20 h-2 bg-orange-600 rounded-full mx-auto"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-7xl mx-auto stagger-child">
                {blogs.map(post => (
                  <div key={post.id} className="glass-card p-6 sm:p-10 rounded-3xl sm:rounded-[48px] border-white/5 hover:border-orange-600/20 transition-all group">
                    <div className="flex flex-col h-full justify-between">
                      <div className="space-y-4 sm:space-y-6">
                        <div className="flex items-center justify-between">
                          <span className="px-3.5 py-1 sm:px-4 sm:py-1.5 bg-orange-600/10 text-orange-600 rounded-full text-[10px] font-black uppercase tracking-widest">{post.category}</span>
                          <span className="text-zinc-500 text-[10px] font-bold uppercase">{post.date}</span>
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-black uppercase italic leading-tight group-hover:text-orange-600 transition-colors">{post.title[lang]}</h3>
                        <p className="text-zinc-500 text-sm font-medium leading-relaxed">{post.excerpt[lang]}</p>
                      </div>
                      <div className="pt-6 sm:pt-10">
                        <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-orange-600 hover:gap-4 transition-all">
                          {t.blog.readMore} <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="contact" className="py-16 sm:py-24 md:py-32 bg-zinc-950 text-white relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
              <div className="flex flex-col lg:flex-row gap-12 sm:gap-20 items-center max-w-7xl mx-auto">
                <div className="lg:w-1/2 space-y-8 sm:space-y-12 reveal-on-scroll w-full">
                  <h2 className="text-3xl sm:text-5xl md:text-7xl font-black tracking-tighter italic uppercase leading-tight sm:leading-none break-words">
                    {t.contact.connectTitle.split(' ').slice(0, -1).join(' ')} <br/> 
                    <span className="gradient-heading">{t.contact.connectTitle.split(' ').slice(-1)}</span>
                  </h2>
                  <div className="space-y-6 sm:space-y-8 stagger-child">
                    <div className="flex items-center gap-4 sm:gap-6 group">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/5 rounded-2xl flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-all shrink-0"><Mail size={22} /></div>
                      <div className="overflow-hidden"><p className="text-[10px] font-black text-zinc-500 uppercase mb-1">{t.contact.emailLabel}</p><a href={`mailto:${contact.email}`} className="text-base sm:text-xl md:text-2xl font-black italic hover:text-orange-600 transition-colors break-all sm:break-normal">{contact.email}</a></div>
                    </div>

                    <div className="flex items-center gap-4 sm:gap-6 group">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/5 rounded-2xl flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-all shrink-0"><MapPin size={22} /></div>
                      <div className="overflow-hidden"><p className="text-[10px] font-black text-zinc-500 uppercase mb-1">{t.contact.locationLabel}</p><p className="text-base sm:text-xl font-black italic text-zinc-300">{contact.location?.[lang] || t.contact.location} {contact.nationality?.[lang] ? `• ${contact.nationality[lang]}` : ''}</p></div>
                    </div>

                    {/* Social Media Links */}
                    <div className="pt-2 flex items-center gap-3">
                      {contact.github && (
                        <a href={contact.github} target="_blank" rel="noopener noreferrer" className="w-11 h-11 bg-white/5 hover:bg-orange-600 rounded-xl flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95" title="GitHub">
                          <Github size={18} />
                        </a>
                      )}
                      {contact.linkedin && (
                        <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="w-11 h-11 bg-white/5 hover:bg-orange-600 rounded-xl flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95" title="LinkedIn">
                          <Linkedin size={18} />
                        </a>
                      )}
                      {contact.instagram && (
                        <a href={contact.instagram} target="_blank" rel="noopener noreferrer" className="w-11 h-11 bg-white/5 hover:bg-orange-600 rounded-xl flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95" title="Instagram">
                          <Instagram size={18} />
                        </a>
                      )}
                      {contact.twitter && (
                        <a href={contact.twitter} target="_blank" rel="noopener noreferrer" className="w-11 h-11 bg-white/5 hover:bg-orange-600 rounded-xl flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95" title="X (Twitter)">
                          <Twitter size={18} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                <div className="lg:w-1/2 w-full reveal-on-scroll">
                  <form className="p-6 sm:p-10 md:p-12 rounded-3xl sm:rounded-[56px] glass-card bg-zinc-900/50 space-y-6 sm:space-y-8 border-white/5" onSubmit={handleFormSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
                      <input required name="name" value={formData.name} onChange={handleInputChange} type="text" placeholder={t.contact.name} className="w-full bg-transparent border-b-2 border-white/10 py-3 sm:py-4 outline-none focus:border-orange-600 font-bold transition-all text-sm sm:text-base text-white" />
                      <input required name="email" value={formData.email} onChange={handleInputChange} type="email" placeholder={t.contact.email} className="w-full bg-transparent border-b-2 border-white/10 py-3 sm:py-4 outline-none focus:border-orange-600 font-bold transition-all text-sm sm:text-base text-white" />
                    </div>
                    <textarea required name="message" value={formData.message} onChange={handleInputChange} rows={4} placeholder={t.contact.message} className="w-full bg-transparent border-b-2 border-white/10 py-3 sm:py-4 outline-none focus:border-orange-600 font-bold resize-none transition-all text-sm sm:text-base text-white"></textarea>
                    <button type="submit" disabled={formStatus === 'submitting' || formStatus === 'success'} className={`w-full py-4 sm:py-6 rounded-2xl sm:rounded-[28px] font-black text-base sm:text-xl italic uppercase flex items-center justify-center gap-3 sm:gap-4 transition-all shadow-lg ${formStatus === 'success' ? 'bg-green-600 shadow-green-600/20' : 'bg-orange-600 hover:bg-orange-700 shadow-orange-600/20'} disabled:opacity-50 text-white`}>
                      {formStatus === 'submitting' ? (
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : formStatus === 'success' ? (
                        <><CheckCircle size={22} /> {t.contact.success}</>
                      ) : (
                        <><Send size={22} /> {t.contact.send}</>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </section>

          <footer className="py-12 sm:py-20 border-t border-zinc-200 dark:border-zinc-800">
            <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6 sm:gap-10 max-w-7xl text-center md:text-left">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black italic tracking-tighter uppercase">{profile.name || 'AYMEN HMOOD'}</h2>
                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">{profile.title || t.footer.subtitle}</p>
              </div>
              <div className="flex items-center gap-4">
                {contact.github && <a href={contact.github} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-orange-600 transition-colors" title="GitHub"><Github size={18} /></a>}
                {contact.linkedin && <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-orange-600 transition-colors" title="LinkedIn"><Linkedin size={18} /></a>}
                {contact.instagram && <a href={contact.instagram} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-orange-600 transition-colors" title="Instagram"><Instagram size={18} /></a>}
                {contact.twitter && <a href={contact.twitter} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-orange-600 transition-colors" title="X (Twitter)"><Twitter size={18} /></a>}
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">&copy; {new Date().getFullYear()} {t.footer.rights}</p>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
};

export default App;
