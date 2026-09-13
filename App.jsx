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
    titleSize: 32,
    missionTextSize: 18,
    buttonPaddingY: 16
};

const INITIAL_TEAMS = [
  { id: 0, color: 'bg-orange-500', border: 'border-orange-500', text: 'text-orange-500', icon: '🤡', score: 0, pos: 0, bonuses: [], activeObstacles: [] },
  { id: 1, color: 'bg-red-600', border: 'border-red-600', text: 'text-red-600', icon: '👺', score: 0, pos: 0, bonuses: [], activeObstacles: [] },
  { id: 2, color: 'bg-purple-600', border: 'border-purple-600', text: 'text-purple-600', icon: '✒️', score: 0, pos: 0, bonuses: [], activeObstacles: [] },
  { id: 3, color: 'bg-blue-600', border: 'border-blue-600', text: 'text-blue-600', icon: '🏛️', score: 0, pos: 0, bonuses: [], activeObstacles: [] },
];

const UI = {
    tr: {
        start: "BAŞLA", rollDice: "ZAR AT", rollingDice: "ZAR ATILIYOR...",
        onStageNow: "ŞU AN SAHNEDE", time: "Süre", finishPerf: "Performansı Bitir",
        juryScoring: "JÜRİ OYLAMASI", role: "+2 ROL", obstacleBtn: "+2 ENGEL", fail: "-2 KURAL İHLALİ",
        confirmScore: "PUANI ONAYLA", stageYours: "SAHNE SENİN", accept: "KABUL ET", unleashPower: "GÜCÜ KULLAN"
    }
};

const TEAM_INFO = {
    0: { name: 'İBİŞ', desc: 'Kurnaz & Esprili', style: 'Mizahi' },
    1: { name: 'KARAGÖZ', desc: 'Fiziksel & Dobra', style: 'Fiziksel' },
    2: { name: 'SHAKESPEARE', desc: 'Dramatik & Şiirsel', style: 'Trajik' },
    3: { name: 'ARİSTOFANES', desc: 'Hicivli & Zeki', style: 'İronik' }
};

const CARDS_DATA = {
  EASY: [ 
    { title: "BOZUK ASANSÖR", mission: "Dar bir alanda sıkıştın. Bedeninle boğulma ve paniği göster.", quote: "Efendim bu teneke kutuda piştik!" }, 
    { title: "KUTUP SOĞUĞU", mission: "Donuyorsun. Dişlerin birbirine çarpıyor. Isınmaya çalış.", quote: "Aman efendim burnum buza döndü!" }, 
    { title: "TAVUK TAKLİDİ", mission: "Bir tavuk gibi davran. Gıdakla, yem eşele.", quote: "Gıt gıdak efendim!" },
    { title: "SİNYAL YOK", mission: "Çok önemli bir arama yapıyorsun ama hat kesiliyor.", quote: "Alooo! Duyamıyorum seni!" }
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
      id: 'mod_start', 
      name: 'MODERATÖR', 
      title: 'REJİSÖR DÜDÜĞÜ', 
      desc: 'Gözüm üzerinizde! Sahneye çıkan süreyi başlatmayı unutursa klaketi patlatırım!', 
      benefit: 'SAHNE KONTROLÜ', 
      customVideo: GAME_ASSETS.moderator 
    }
  ]
};

// --- ORİJİNAL KART BİLEŞENİ (AYARLANABİLİR BOYUTLARLA) ---
const CardDisplay = ({ card, type, mode = 'draw', onAction, assets, currentTeamId, uiConfig }) => {
    const isBonus = type === 'bonus';
    const isObstacle = type === 'obstacle';
    const isModerator = type === 'moderator';
    const isPlaying = mode === 'play';
    
    const baseKey = `team${currentTeamId}`;
    let characterVideoSrc = assets[`${baseKey}_idle`];
    if (type === 'easy') characterVideoSrc = assets[`${baseKey}_happy`];
    else if (type === 'medium') characterVideoSrc = assets[`${baseKey}_thinking`];
    else if (type === 'hard' || type === 'obstacle') characterVideoSrc = assets[`${baseKey}_scared`];

    let videoToRender = isModerator 
        ? (card.customVideo || assets.moderator)
        : (isBonus && assets[`bonus_${card.id}`] ? assets[`bonus_${card.id}`] : characterVideoSrc);

    let titleText = (isBonus || isModerator) ? card.name : (card.title || "GÖREV");
    let missionText = (isBonus || isModerator) ? card.desc : card.mission;
    let flavorText = (isBonus || isModerator)
        ? `FIRSAT KARTI ✦ ${card.benefit}`
        : (card.quote || card.desc || "Sahne seni bekliyor!");

    let icon = isModerator 
        ? <Clapperboard size={32} className="text-[#D4AF37] animate-pulse"/> 
        : (isBonus ? <Sparkles size={32} className="text-[#D4AF37]"/> : <Drama size={32} className="text-[#D4AF37]"/>);

    let bgStyle = isModerator 
        ? "bg-gradient-to-b from-emerald-950 via-neutral-900 to-black" 
        : (isBonus ? (isPlaying ? "bg-gradient-to-b from-yellow-700 via-neutral-900 to-black" : "bg-gradient-to-b from-indigo-950 via-neutral-900 to-black") : "bg-neutral-950");

    let glowColor = isModerator 
        ? "rgba(16, 185, 129, 0.4)" 
        : (isBonus ? "rgba(212, 175, 55, 0.4)" : "rgba(212, 175, 55, 0.2)");

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fadeIn">
            <div 
                className="relative rounded-[2.5rem] overflow-hidden border border-[#D4AF37]/40 flex flex-col transition-all duration-300 shadow-2xl"
                style={{ 
                    width: `${uiConfig.cardWidth}px`,
                    maxWidth: '94vw',
                    height: `${uiConfig.cardHeight}vh`,
                    boxShadow: `0 25px 60px -15px ${glowColor}` 
                }}
            >
                <div className={`absolute inset-0 ${bgStyle} z-0`}></div>
                
                {/* VIDEO BÖLÜMÜ */}
                <div 
                    className="relative w-full shrink-0 z-10 overflow-hidden flex items-center justify-center bg-black"
                    style={{ height: `${uiConfig.videoHeightPercent}%` }}
                >
                    <video 
                        src={videoToRender} 
                        className="w-full h-full object-cover object-top" 
                        autoPlay loop muted playsInline 
                    />
                    <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-transparent"></div>
                </div>

                {/* METİN VE AKSİYON BÖLÜMÜ */}
                <div 
                    className="relative z-20 flex-1 flex flex-col items-center justify-between text-center overflow-y-auto no-scrollbar -mt-6"
                    style={{ padding: `${uiConfig.cardPadding}px` }}
                >
                     <div className="flex flex-col items-center w-full">
                         <div className="p-3 rounded-full bg-black/80 border border-[#D4AF37]/50 mb-2 shadow-xl backdrop-blur-md inline-flex justify-center">
                             {icon}
                         </div>
                         
                         <h1 
                            className="text-[#D4AF37] font-black italic mb-2 leading-tight uppercase drop-shadow-md"
                            style={{ fontSize: `${uiConfig.titleSize}px` }}
                         >
                             {titleText}
                         </h1>
                         
                         <div className="w-full mb-3 bg-black/60 border border-[#D4AF37]/30 p-4 rounded-2xl shadow-inner min-h-[4.5rem] flex items-center justify-center">
                            <p 
                                className="font-bold leading-tight text-white/95"
                                style={{ fontSize: `${uiConfig.missionTextSize}px` }}
                            >
                                "{missionText}"
                            </p>
                         </div>
                         
                         <p className="italic px-2 text-xs md:text-sm text-yellow-500/90 font-medium">
                            {flavorText}
                         </p>
                     </div>
                     
                     <button 
                        onClick={onAction} 
                        className="w-full rounded-2xl font-black text-lg tracking-widest uppercase shadow-2xl transition-all transform hover:scale-[1.02] active:scale-95 bg-gradient-to-r from-[#D4AF37] via-amber-300 to-[#D4AF37] text-black hover:brightness-110"
                        style={{ padding: `${uiConfig.buttonPaddingY}px 0` }}
                     >
                        {isModerator ? "KULİSE DÖN" : (isBonus ? "KABUL ET" : "SAHNEYE ÇIK")}
                     </button>
                </div>
            </div>
        </div>
    );
};

// --- ANA OYUN BİLEŞENİ ---
export default function DogaclaCompleteGame() {
  const [teams, setTeams] = useState(INITIAL_TEAMS);
  const [currentTurn, setCurrentTurn] = useState(0);
  const [gameState, setGameState] = useState('ROLL');
  const [diceValue, setDiceValue] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const [cardType, setCardType] = useState(null);
  const [timer, setTimer] = useState(45);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [juryVote, setJuryVote] = useState({ role: false, obstacle: false, fail: false });

  // Canlı UI Düzenleyici
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

  const rollDice = () => {
    if (isRolling) return;
    setIsRolling(true);
    let count = 0;
    const interval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
      count++;
      if (count > 8) {
        clearInterval(interval);
        const finalDice = Math.floor(Math.random() * 6) + 1;
        setDiceValue(finalDice);
        setIsRolling(false);
        
        // Hareketi başlat ve kartı aç
        setTimeout(() => {
            const types = ['easy', 'medium', 'hard', 'bonus', 'obstacle'];
            const pickedType = types[Math.floor(Math.random() * types.length)];
            setCardType(pickedType);
            if (pickedType === 'bonus') setActiveCard(CARDS_DATA.BONUS[Math.floor(Math.random() * CARDS_DATA.BONUS.length)]);
            else if (pickedType === 'obstacle') setActiveCard(CARDS_DATA.OBSTACLE[Math.floor(Math.random() * CARDS_DATA.OBSTACLE.length)]);
            else setActiveCard(CARDS_DATA[pickedType.toUpperCase()][0]);
            setGameState('CARD');
        }, 400);
      }
    }, 80);
  };

  const handleCardDone = () => {
    if (cardType === 'moderator' || cardType === 'bonus') {
      setActiveCard(null);
      setGameState('ROLL');
      setCurrentTurn((currentTurn + 1) % 4);
    } else {
      setActiveCard(null);
      setGameState('PERFORM');
      setTimer(45);
      setIsTimerRunning(true);
    }
  };

  const submitJury = () => {
    let earned = 0;
    if (juryVote.role) earned += 2;
    if (juryVote.obstacle) earned += 2;
    if (juryVote.fail) earned -= 2;

    setTeams(prev => {
      const next = [...prev];
      next[currentTurn].score += earned;
      return next;
    });

    setJuryVote({ role: false, obstacle: false, fail: false });
    setCurrentTurn((currentTurn + 1) % 4);
    setGameState('ROLL');
  };

  return (
    <div 
        className="h-screen w-screen text-white flex flex-col overflow-hidden font-sans select-none relative bg-cover bg-center"
        style={{ backgroundImage: `url(${GAME_ASSETS.bg})` }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs"></div>

      {/* REJİ ÜST BAR */}
      <header className="h-16 bg-black/70 border-b border-white/10 px-4 flex items-center justify-between z-30 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <img src={GAME_ASSETS.logo} alt="Doğaçla" className="h-8 w-auto object-contain" />
          <span className="font-black tracking-widest text-lg text-[#D4AF37]">DOĞAÇLA 9.8</span>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => { setCardType('moderator'); setActiveCard(CARDS_DATA.MODERATOR[0]); setGameState('CARD'); }}
            className="px-3 py-1.5 bg-emerald-600/80 hover:bg-emerald-600 border border-emerald-400/50 rounded-xl text-xs font-black flex items-center gap-1.5 transition"
          >
            <Clapperboard size={14} /> Moderatör Kartı
          </button>
          
          <button 
            onClick={() => setShowEditor(!showEditor)} 
            className="p-2 bg-purple-600/40 border border-purple-500/60 rounded-xl text-purple-200 hover:bg-purple-600 transition"
          >
            <Palette size={18} />
          </button>
        </div>
      </header>

      {/* ORİJİNAL 4 TAKIM SKOR TABLOSU */}
      <div className="grid grid-cols-4 gap-2 p-3 z-20">
        {teams.map((t, idx) => (
          <div 
            key={t.id} 
            className={`p-2.5 rounded-2xl flex items-center justify-between border transition-all ${idx === currentTurn ? 'bg-black/80 border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.4)] scale-102' : 'bg-black/50 border-white/10 opacity-70'}`}
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">{t.icon}</span>
              <div>
                <p className="text-[11px] font-black text-gray-300">{TEAM_INFO[t.id].name}</p>
                <p className="text-xs font-black text-[#D4AF37]">{t.score} P</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* SAHNE MERKEZ ALANI */}
      <div className="flex-1 flex flex-col items-center justify-center z-20 p-4 text-center">
        {gameState === 'ROLL' && (
          <div className="space-y-6">
            <div className="w-24 h-24 mx-auto rounded-3xl bg-black/60 border-2 border-[#D4AF37] flex items-center justify-center text-5xl font-black text-[#D4AF37] shadow-[0_0_30px_rgba(212,175,55,0.3)]">
              {diceValue}
            </div>
            <div>
              <p className="text-sm font-bold text-gray-300">Sahnede Sıra</p>
              <h2 className="text-3xl font-black text-white">{TEAM_INFO[currentTurn].name} Takımı</h2>
            </div>
            <button 
              onClick={rollDice} 
              disabled={isRolling} 
              className="px-10 py-4 bg-gradient-to-r from-[#D4AF37] via-amber-400 to-[#D4AF37] text-black font-black text-xl rounded-2xl shadow-2xl hover:scale-105 active:scale-95 transition"
            >
              {isRolling ? "ZAR ATILIYOR..." : "ZAR AT"}
            </button>
          </div>
        )}

        {gameState === 'PERFORM' && (
          <div className="space-y-6">
            <div className="text-7xl font-black font-mono text-[#D4AF37] drop-shadow-[0_0_20px_rgba(212,175,55,0.8)] animate-pulse">
              {timer}s
            </div>
            <p className="text-gray-300 font-bold">Sahne senin, doğaçlamanı sergile!</p>
            <button 
              onClick={() => { setIsTimerRunning(false); setGameState('JURY'); }} 
              className="px-8 py-3.5 bg-red-600 hover:bg-red-500 text-white font-black rounded-2xl shadow-xl transition"
            >
              Performansı Bitir
            </button>
          </div>
        )}

        {gameState === 'JURY' && (
          <div className="bg-black/85 border border-[#D4AF37]/50 rounded-3xl p-6 w-full max-w-sm space-y-4 shadow-2xl backdrop-blur-xl">
            <Gavel size={36} className="mx-auto text-[#D4AF37]" />
            <h3 className="text-xl font-black text-[#D4AF37]">JÜRİ DEĞERLENDİRMESİ</h3>
            
            <div className="space-y-2">
              <button onClick={() => setJuryVote(v => ({ ...v, role: !v.role }))} className={`w-full py-3 rounded-xl font-bold text-xs flex justify-between px-4 border transition ${juryVote.role ? 'bg-emerald-600 border-emerald-400' : 'bg-white/5 border-white/10'}`}>
                <span>Role Sadık Kaldı mı?</span>
                <span>+2 Puan</span>
              </button>
              <button onClick={() => setJuryVote(v => ({ ...v, obstacle: !v.obstacle }))} className={`w-full py-3 rounded-xl font-bold text-xs flex justify-between px-4 border transition ${juryVote.obstacle ? 'bg-blue-600 border-blue-400' : 'bg-white/5 border-white/10'}`}>
                <span>Engeli Başarıyla Aştı mı?</span>
                <span>+2 Puan</span>
              </button>
              <button onClick={() => setJuryVote(v => ({ ...v, fail: !v.fail }))} className={`w-full py-3 rounded-xl font-bold text-xs flex justify-between px-4 border transition ${juryVote.fail ? 'bg-red-600 border-red-400' : 'bg-white/5 border-white/10'}`}>
                <span>Kural İhlali / Tıkanma</span>
                <span>-2 Puan</span>
              </button>
            </div>

            <button onClick={submitJury} className="w-full py-3.5 bg-white text-black font-black rounded-xl hover:bg-gray-200 transition">
              PUANI KAYDET
            </button>
          </div>
        )}
      </div>

      {/* KART MODALI */}
      {gameState === 'CARD' && activeCard && (
        <CardDisplay 
            card={activeCard} 
            type={cardType} 
            mode="draw" 
            onAction={handleCardDone} 
            assets={GAME_ASSETS} 
            currentTeamId={currentTurn} 
            uiConfig={uiConfig}
        />
      )}

      {/* CANLI UI EDİTÖR PANELİ */}
      {showEditor && (
        <div className="fixed inset-y-0 right-0 w-80 bg-black/95 border-l border-[#D4AF37]/30 z-[150] p-6 text-xs flex flex-col shadow-2xl backdrop-blur-2xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
            <span className="font-black text-sm text-purple-400 flex items-center gap-2">
              <Sliders size={18} /> Arayüz Editörü
            </span>
            <button onClick={() => setShowEditor(false)} className="text-gray-400 hover:text-white"><X size={20} /></button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4">
            <div>
              <div className="flex justify-between mb-1 text-gray-300"><span>Kart Genişliği</span><b>{uiConfig.cardWidth}px</b></div>
              <input type="range" min="300" max="500" value={uiConfig.cardWidth} onChange={e => handleConfigChange('cardWidth', Number(e.target.value))} className="w-full accent-purple-500" />
            </div>
            <div>
              <div className="flex justify-between mb-1 text-gray-300"><span>Kart Yüksekliği (%)</span><b>{uiConfig.cardHeight}vh</b></div>
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
            <button onClick={() => navigator.clipboard.writeText(JSON.stringify(uiConfig, null, 2))} className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition">
              Ayarları Kopyala (JSON)
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
