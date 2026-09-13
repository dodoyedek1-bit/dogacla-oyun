import React, { useState, useEffect, useRef } from 'react';
import { 
  Dices, Trophy, User, Clock, Star, ShieldAlert, Sparkles, Skull, Theater, 
  AlertTriangle, CheckCircle, XCircle, ScrollText, Plus, Minus, Gavel, 
  Menu, X, Volume2, VolumeX, RefreshCw, LayoutGrid, History, Mic2, Lightbulb,
  Bot, Zap, Monitor, Share2, MessageSquare, MousePointer2, Smile, Heart, ThumbsUp,
  PenTool, Music, Keyboard, Dice5, Repeat, Image as ImageIcon, Upload, Palette, Link as LinkIcon, Wand2, Layers, Loader2, Maximize, Minimize,
  Flame, Crown, PartyPopper, Tv, Target, Hand, Drama, Megaphone, Clapperboard, Video, Frown, Laugh, Ticket, Move, Ghost, Smartphone, Bird, Thermometer, Apple, HelpCircle, Play, Music4, Settings, Sliders
} from 'lucide-react';

// --- ASSET VE MEDYA BAĞLANTILARI ---
const GAME_ASSETS = {
    bg: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/arkplan.png",
    logo: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/dogacla_logsu.png",
    music_bg: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/The_Clockwork_Caper.mp3", 
    ibis: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/ibi%C5%9F.png", 
    karagoz: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/karagoz.png",
    shakespeare: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/sheashper.png",
    aristophanes: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/aristopahnes.png",
    moderator: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/Moderator.mp4",
    team0_idle: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/ibis_orta.mp4", 
    team0_happy: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/ibis_kolay.mp4",
    team0_thinking: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/ibis_orta.mp4",
    team0_scared: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/ibis_zor.mp4",
    team1_idle: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/karagoz_orta.mp4",
    team1_happy: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/karagoz_kolay.mp4",
    team1_thinking: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/karagoz_orta.mp4",
    team1_scared: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/karagoz_zor.mp4",
    team2_idle: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/shakespeare_orta.mp4",
    team2_happy: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/shakespeare_kolay.mp4",
    team2_thinking: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/shakespeare_orta.mp4",
    team2_scared: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/shakespeare_zor.mp4",
    team3_idle: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/artisto_bekleme.mp4",
    team3_happy: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/aristo_kolay.mp4",
    team3_thinking: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/artisto_bekleme.mp4",
    team3_scared: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/artisto_zor.mp4",
    madox: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/madox_karti.mp4",
    diputiyat: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/dputiyat_karti.mp4",
    gulec: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/Gulec_karti.mp4",
    kubi: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/kubi_karti.mp4",
    kubo: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/kubo_karti.mp4",
    mali: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/Mali_karti.mp4",
    sadic: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/sadic_karti.mp4",
    tubi: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/tubi_karti.mp4",
    cicu: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/%C3%A7i-%C3%A7u.png",
};

const DEFAULT_UI_CONFIG = {
    cardWidth: 420,
    cardHeight: 82,
    videoHeightPercent: 44,
    cardPadding: 24,
    titleSize: 30,
    missionTextSize: 18,
    buttonPaddingY: 16
};

const INITIAL_TEAMS = [
  { id: 0, color: 'bg-orange-500', border: 'border-orange-500', text: 'text-orange-500', icon: '🤡', score: 0, pos: 0, bonuses: [], activeObstacles: [] },
  { id: 1, color: 'bg-red-600', border: 'border-red-600', text: 'text-red-600', icon: '👺', score: 0, pos: 0, bonuses: [], activeObstacles: [] },
  { id: 2, color: 'bg-purple-600', border: 'border-purple-600', text: 'text-purple-600', icon: '✒️', score: 0, pos: 0, bonuses: [], activeObstacles: [] },
  { id: 3, color: 'bg-blue-600', border: 'border-blue-600', text: 'text-blue-600', icon: '🏛️', score: 0, pos: 0, bonuses: [], activeObstacles: [] },
];

const TEAM_INFO = {
    0: { name: 'İBİŞ', style: 'Mizahi' },
    1: { name: 'KARAGÖZ', style: 'Fiziksel' },
    2: { name: 'SHAKESPEARE', style: 'Trajik' },
    3: { name: 'ARİSTOFANES', style: 'İronik' }
};

const CARDS_DATA = {
  EASY: [ 
    { title: "BOZUK ASANSÖR", mission: "Dar bir alanda sıkıştın. Bedeninle boğulma ve paniği göster.", quote: "Efendim bu teneke kutuda piştik!" }, 
    { title: "KUTUP SOĞUĞU", mission: "Donuyorsun. Dişlerin birbirine çarpıyor. Isınmaya çalış.", quote: "Aman efendim burnum buza döndü!" }, 
    { title: "TAVUK TAKLİDİ", mission: "Bir tavuk gibi davran. Gıdakla, yem eşele.", quote: "Gıt gıdak efendim!" }
  ],
  MEDIUM: [ 
    { title: "UNUTKANLIK", mission: "Tam o an ne söyleyeceğini unuttun.", quote: "Eee... Efendim dilimin ucundaydı!" }, 
    { title: "GÖRÜNMEZ ELMA", mission: "Elinde bir elma varmış gibi ye ve tadını anlat.", quote: "Bu elma değil elmas! Kırt!" }
  ],
  HARD: [ 
    { title: "SAHTE KRAL", mission: "Her şeyin kontrol altında olduğu yalanını söyleyen paniklemiş lider.", quote: "Kral benim! Titremiyorum!" }, 
    { title: "AĞLARKEN GÜLMEK", mission: "Çok üzücü bir hikaye anlatırken kahkaha krizine gir.", quote: "Hahaha! Vah zavallı başım!" }
  ],
  OBSTACLE: [ 
    { id: 'o1', text: "Sadece tek kelimelerle konuş.", type: 'marked' }, 
    { id: 'o2', text: "Her cümleni şarkı söyleyerek bitir.", type: 'unmarked' }, 
    { id: 'o3', text: "Kimseyle göz teması kurma.", type: 'marked' }
  ],
  BONUS: [ 
    { id: 'tubi', name: 'Tubi', desc: 'Annen gibi düşün... Tavsiye vereceğim!', benefit: 'FİKİR AL' }, 
    { id: 'kubi', name: 'Kubi', desc: 'Kalem elimde! Bu sahneye bir kişi daha yazıyorum.', benefit: 'EKSTRA KARAKTER' }, 
    { id: 'mali', name: 'Mali', desc: 'Hesapladım, kârlı çıkarız.', benefit: '+2 PUAN' }, 
    { id: 'kubo', name: 'Kubo', desc: 'Kestik! Baştan alıyoruz ama süreyi uzatıyorum.', benefit: '+30 SANİYE' },
    { id: 'madox', name: 'Madox', desc: 'Bu sahnenin türü beni sıktı. Değiştirildi!', benefit: 'TÜRÜ DEĞİŞTİR' }
  ],
  MODERATOR: [
    { 
      id: 'mod_1', 
      name: 'MODERATÖR REJİSİ', 
      title: 'DÜDÜK VE KLAKET', 
      desc: 'Süreyi başlatmayan takıma "-2 Kural İhlali" puanı kesilir veya 15 saniye çalınır!', 
      benefit: 'DİSİPLİN VE KONTROL', 
      customVideo: GAME_ASSETS.moderator 
    }
  ]
};

const BOARD_MAP = Array(36).fill(null).map((_, i) => {
    if (i === 0) return { type: 'start', label: 'BAŞLANGIÇ' };
    if (i === 35) return { type: 'final', label: 'FİNAL' };
    if (i % 5 === 0) return { type: 'bonus', label: 'BONUS' };
    if (i % 6 === 0) return { type: 'obstacle', label: 'ENGEL' };
    if (i < 10) return { type: 'easy', label: 'KOLAY' };
    if (i < 22) return { type: 'medium', label: 'ORTA' };
    return { type: 'hard', label: 'ZOR' };
});

export default function DogaclaCompleteGame() {
  const [teams, setTeams] = useState(INITIAL_TEAMS);
  const [currentTurn, setCurrentTurn] = useState(0);
  const [gameState, setGameState] = useState('ROLL'); // ROLL, MOVING, CARD, PERFORM, JURY
  const [diceValue, setDiceValue] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const [cardType, setCardType] = useState(null);
  const [timer, setTimer] = useState(45);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [juryVote, setJuryVote] = useState({ role: false, obstacle: false, fail: false });
  const [logs, setLogs] = useState(["Doğaçla Sahnesi Açıldı!"]);

  // Canlı UI Editörü
  const [showEditor, setShowEditor] = useState(false);
  const [uiConfig, setUiConfig] = useState(() => {
    const saved = localStorage.getItem('dogacla_ui_config');
    return saved ? JSON.parse(saved) : DEFAULT_UI_CONFIG;
  });

  const timerRef = useRef(null);
  const currentTeam = teams[currentTurn];

  const handleConfigChange = (key, value) => {
    const updated = { ...uiConfig, [key]: value };
    setUiConfig(updated);
    localStorage.setItem('dogacla_ui_config', JSON.stringify(updated));
  };

  // SÜRE YÖNETİMİ
  useEffect(() => {
    if (isTimerRunning && timer > 0) {
      timerRef.current = setInterval(() => setTimer(t => t - 1), 1000);
    } else if (timer === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      clearInterval(timerRef.current);
      setGameState('JURY');
    }
    return () => clearInterval(timerRef.current);
  }, [isTimerRunning, timer]);

  // ZAR ATMA & HAREKET
  const rollDice = () => {
    if (isRolling) return;
    setIsRolling(true);
    let rolls = 0;
    const interval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
      rolls++;
      if (rolls > 8) {
        clearInterval(interval);
        const finalDice = Math.floor(Math.random() * 6) + 1;
        setDiceValue(finalDice);
        setIsRolling(false);
        movePlayer(finalDice);
      }
    }, 80);
  };

  const movePlayer = (steps) => {
    setGameState('MOVING');
    setTimeout(() => {
      setTeams(prevTeams => {
        const nextTeams = [...prevTeams];
        const team = nextTeams[currentTurn];
        const nextPos = Math.min(35, team.pos + steps);
        team.pos = nextPos;
        return nextTeams;
      });

      // Durulan kareye göre kart çek
      const currentPos = Math.min(35, teams[currentTurn].pos + steps);
      const tile = BOARD_MAP[currentPos];
      openCard(tile.type);
    }, 600);
  };

  const openCard = (type) => {
    setCardType(type);
    let card = null;
    if (type === 'bonus') card = CARDS_DATA.BONUS[Math.floor(Math.random() * CARDS_DATA.BONUS.length)];
    else if (type === 'obstacle') card = CARDS_DATA.OBSTACLE[Math.floor(Math.random() * CARDS_DATA.OBSTACLE.length)];
    else if (type === 'easy') card = CARDS_DATA.EASY[Math.floor(Math.random() * CARDS_DATA.EASY.length)];
    else if (type === 'medium') card = CARDS_DATA.MEDIUM[Math.floor(Math.random() * CARDS_DATA.MEDIUM.length)];
    else card = CARDS_DATA.HARD[Math.floor(Math.random() * CARDS_DATA.HARD.length)];

    setActiveCard(card);
    setGameState('CARD');
  };

  const startPerformance = () => {
    setGameState('PERFORM');
    setTimer(45);
    setIsTimerRunning(true);
  };

  const submitJuryScore = () => {
    let earned = 0;
    if (juryVote.role) earned += 2;
    if (juryVote.obstacle) earned += 2;
    if (juryVote.fail) earned -= 2;

    setTeams(prev => {
      const next = [...prev];
      next[currentTurn].score += earned;
      return next;
    });

    setLogs(l => [`${TEAM_INFO[currentTurn].name}: ${earned >= 0 ? '+' + earned : earned} Puan Aldı.`, ...l.slice(0, 4)]);
    setJuryVote({ role: false, obstacle: false, fail: false });
    
    // Sıradaki tura geç
    setCurrentTurn((currentTurn + 1) % 4);
    setGameState('ROLL');
  };

  const triggerModeratorTest = () => {
    setCardType('moderator');
    setActiveCard(CARDS_DATA.MODERATOR[0]);
    setGameState('CARD');
  };

  return (
    <div className="h-screen w-screen bg-[#0d0d0d] text-white flex flex-col overflow-hidden font-sans select-none relative">
      
      {/* ÜST REJİ BAR */}
      <header className="h-16 bg-black/80 border-b border-white/10 px-4 flex items-center justify-between z-30 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Drama className="text-[#D4AF37]" size={28} />
          <span className="font-black tracking-widest text-lg bg-gradient-to-r from-[#D4AF37] to-amber-200 bg-clip-text text-transparent">DOĞAÇLA</span>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={triggerModeratorTest} className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-xs font-bold flex items-center gap-1">
            <Clapperboard size={14} /> Moderatör Kartı
          </button>
          <button onClick={() => setShowEditor(!showEditor)} className="p-2 bg-purple-600/30 border border-purple-500 rounded-lg text-purple-200">
            <Palette size={18} />
          </button>
        </div>
      </header>

      {/* SKOR VE OYUNCU BAR */}
      <div className="grid grid-cols-4 gap-1 p-2 bg-black/40 border-b border-white/5">
        {teams.map((t, idx) => (
          <div key={t.id} className={`p-2 rounded-xl flex items-center justify-between transition-all ${idx === currentTurn ? 'bg-white/15 border-2 border-[#D4AF37] scale-102' : 'bg-white/5 opacity-70'}`}>
            <div className="flex items-center gap-2">
              <span className="text-xl">{t.icon}</span>
              <div>
                <p className="text-[10px] font-bold text-gray-400">{TEAM_INFO[t.id].name}</p>
                <p className="text-xs font-black text-white">{t.score} P</p>
              </div>
            </div>
            <span className="text-[10px] bg-black/60 px-1.5 py-0.5 rounded font-mono text-[#D4AF37]">K:{t.pos}</span>
          </div>
        ))}
      </div>

      {/* OYUN ALANI / HARİTA */}
      <div className="flex-1 flex flex-col justify-between p-4 relative overflow-hidden">
        {/* Tahta İlerleme Hattı */}
        <div className="flex-1 flex items-center justify-center">
          <div className="grid grid-cols-6 gap-2 max-w-sm w-full">
            {BOARD_MAP.slice(0, 24).map((tile, i) => {
              const occupants = teams.filter(t => t.pos === i);
              return (
                <div key={i} className={`h-12 rounded-lg border border-white/10 flex flex-col items-center justify-center relative text-[9px] font-bold ${tile.type === 'bonus' ? 'bg-amber-900/40 text-amber-300' : tile.type === 'obstacle' ? 'bg-red-900/40 text-red-300' : 'bg-white/5 text-gray-400'}`}>
                  <span>{i}</span>
                  <div className="flex gap-0.5 absolute -bottom-1">
                    {occupants.map(occ => <span key={occ.id} className="text-xs">{occ.icon}</span>)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ALT KONTROL PANELİ */}
        <div className="bg-black/70 border border-white/10 p-4 rounded-3xl backdrop-blur-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-3xl font-black text-[#D4AF37]">
              {diceValue}
            </div>
            <div>
              <p className="text-xs text-gray-400">Sıradaki Takım</p>
              <p className="text-sm font-black text-white">{TEAM_INFO[currentTurn].name}</p>
            </div>
          </div>

          {gameState === 'ROLL' && (
            <button onClick={rollDice} disabled={isRolling} className="px-8 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-black rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition">
              {isRolling ? "ZAR DÖNÜYOR..." : "ZAR AT"}
            </button>
          )}

          {gameState === 'PERFORM' && (
            <div className="flex items-center gap-4">
              <div className={`text-2xl font-mono font-black ${timer < 10 ? 'text-red-500 animate-ping' : 'text-white'}`}>
                {timer}s
              </div>
              <button onClick={() => { setIsTimerRunning(false); setGameState('JURY'); }} className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xs">
                Performansı Bitir
              </button>
            </div>
          )}
        </div>
      </div>

      {/* JÜRİ OYLAMA PANELİ */}
      {gameState === 'JURY' && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-white/10 rounded-3xl p-6 w-full max-w-sm text-center space-y-4">
            <Gavel size={36} className="mx-auto text-[#D4AF37]" />
            <h3 className="text-xl font-black text-white">JÜRİ OYLAMASI</h3>
            <p className="text-xs text-gray-400">Takımın performansını değerlendirin</p>

            <div className="space-y-2">
              <button onClick={() => setJuryVote(v => ({ ...v, role: !v.role }))} className={`w-full py-3 rounded-xl font-bold text-xs flex justify-between px-4 items-center border ${juryVote.role ? 'bg-emerald-600 border-emerald-400' : 'bg-white/5 border-white/10'}`}>
                <span>Role Sadık Kaldı mı?</span>
                <span>+2 Puan</span>
              </button>
              <button onClick={() => setJuryVote(v => ({ ...v, obstacle: !v.obstacle }))} className={`w-full py-3 rounded-xl font-bold text-xs flex justify-between px-4 items-center border ${juryVote.obstacle ? 'bg-blue-600 border-blue-400' : 'bg-white/5 border-white/10'}`}>
                <span>Engeli Başarıyla Aştı mı?</span>
                <span>+2 Puan</span>
              </button>
              <button onClick={() => setJuryVote(v => ({ ...v, fail: !v.fail }))} className={`w-full py-3 rounded-xl font-bold text-xs flex justify-between px-4 items-center border ${juryVote.fail ? 'bg-red-600 border-red-400' : 'bg-white/5 border-white/10'}`}>
                <span>Kural İhlali / Tıkanma</span>
                <span>-2 Puan</span>
              </button>
            </div>

            <button onClick={submitJuryScore} className="w-full py-3.5 bg-white text-black font-black rounded-xl hover:bg-gray-200 transition">
              PUANI ONAYLA
            </button>
          </div>
        </div>
      )}

      {/* KART MODAL EKRANI */}
      {gameState === 'CARD' && activeCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
          <div 
            className="relative rounded-[2.5rem] overflow-hidden bg-neutral-900 border border-white/10 flex flex-col shadow-2xl"
            style={{ 
              width: `${uiConfig.cardWidth}px`, 
              maxWidth: '92vw', 
              height: `${uiConfig.cardHeight}vh` 
            }}
          >
            {/* VİDEO ALANI */}
            <div className="relative w-full bg-black flex items-center justify-center overflow-hidden" style={{ height: `${uiConfig.videoHeightPercent}%` }}>
              <video 
                src={cardType === 'moderator' ? activeCard.customVideo : (cardType === 'bonus' ? GAME_ASSETS[activeCard.id] || GAME_ASSETS.team0_idle : GAME_ASSETS[`team${currentTurn}_happy`])} 
                className="w-full h-full object-cover object-top" 
                autoPlay loop muted playsInline 
              />
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-neutral-900 to-transparent"></div>
            </div>

            {/* METİN ALANI */}
            <div className="flex-1 flex flex-col justify-between text-center" style={{ padding: `${uiConfig.cardPadding}px` }}>
              <div>
                <h2 className="text-[#D4AF37] font-black uppercase tracking-wider mb-2" style={{ fontSize: `${uiConfig.titleSize}px` }}>
                  {activeCard.title || activeCard.name}
                </h2>
                <div className="bg-black/40 border border-white/10 p-3 rounded-2xl mb-2">
                  <p className="text-gray-200 font-bold" style={{ fontSize: `${uiConfig.missionTextSize}px` }}>
                    "{activeCard.mission || activeCard.desc || activeCard.text}"
                  </p>
                </div>
                {activeCard.benefit && (
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-950/60 px-2 py-1 rounded-full border border-emerald-500/30">
                    ✦ {activeCard.benefit}
                  </span>
                )}
              </div>

              <button 
                onClick={() => {
                  if (cardType === 'moderator' || cardType === 'bonus') {
                    setActiveCard(null);
                    setGameState('ROLL');
                  } else {
                    startPerformance();
                  }
                }} 
                className="w-full bg-white text-black font-black uppercase rounded-2xl hover:bg-gray-200 transition tracking-wider"
                style={{ padding: `${uiConfig.buttonPaddingY}px 0` }}
              >
                {cardType === 'moderator' ? "ANLADIM / GERİ DÖN" : "SAHNEYE ÇIK"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CANLI UI EDİTÖR ÇEKMECESİ */}
      {showEditor && (
        <div className="fixed inset-y-0 right-0 w-80 bg-black/95 border-l border-white/20 z-[100] p-6 text-xs flex flex-col shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
            <span className="font-black text-sm text-purple-400 flex items-center gap-2">
              <Sliders size={18} /> Canlı UI Editörü
            </span>
            <button onClick={() => setShowEditor(false)} className="text-gray-400 hover:text-white"><X size={20} /></button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4">
            <div>
              <div className="flex justify-between mb-1 text-gray-300"><span>Kart Genişliği</span><b>{uiConfig.cardWidth}px</b></div>
              <input type="range" min="300" max="500" value={uiConfig.cardWidth} onChange={e => handleConfigChange('cardWidth', Number(e.target.value))} className="w-full accent-purple-500" />
            </div>
            <div>
              <div className="flex justify-between mb-1 text-gray-300"><span>Kart Boyu (%)</span><b>{uiConfig.cardHeight}vh</b></div>
              <input type="range" min="65" max="95" value={uiConfig.cardHeight} onChange={e => handleConfigChange('cardHeight', Number(e.target.value))} className="w-full accent-purple-500" />
            </div>
            <div>
              <div className="flex justify-between mb-1 text-gray-300"><span>Video Alanı (%)</span><b>{uiConfig.videoHeightPercent}%</b></div>
              <input type="range" min="30" max="60" value={uiConfig.videoHeightPercent} onChange={e => handleConfigChange('videoHeightPercent', Number(e.target.value))} className="w-full accent-purple-500" />
            </div>
            <div>
              <div className="flex justify-between mb-1 text-gray-300"><span>Başlık Puntosu</span><b>{uiConfig.titleSize}px</b></div>
              <input type="range" min="20" max="44" value={uiConfig.titleSize} onChange={e => handleConfigChange('titleSize', Number(e.target.value))} className="w-full accent-purple-500" />
            </div>
            <div>
              <div className="flex justify-between mb-1 text-gray-300"><span>Metin Puntosu</span><b>{uiConfig.missionTextSize}px</b></div>
              <input type="range" min="14" max="26" value={uiConfig.missionTextSize} onChange={e => handleConfigChange('missionTextSize', Number(e.target.value))} className="w-full accent-purple-500" />
            </div>
            <div>
              <div className="flex justify-between mb-1 text-gray-300"><span>İç Kenar Boşluğu</span><b>{uiConfig.cardPadding}px</b></div>
              <input type="range" min="10" max="36" value={uiConfig.cardPadding} onChange={e => handleConfigChange('cardPadding', Number(e.target.value))} className="w-full accent-purple-500" />
            </div>
          </div>

          <div className="border-t border-white/10 pt-4 mt-auto">
            <button onClick={() => navigator.clipboard.writeText(JSON.stringify(uiConfig, null, 2))} className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg transition">
              Ayarları Kopyala (JSON)
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
