import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Dices, Trophy, User, Clock, Star, ShieldAlert, Sparkles, Skull, Theater, 
  AlertTriangle, CheckCircle, XCircle, ScrollText, Plus, Minus, Gavel, 
  Menu, X, Volume2, VolumeX, RefreshCw, LayoutGrid, History, Mic2, Lightbulb,
  Bot, Zap, Monitor, Share2, MessageSquare, MousePointer2, Smile, Heart, ThumbsUp,
  PenTool, Music, Keyboard, Dice5, Repeat, Image as ImageIcon, Upload, Palette, Link as LinkIcon, Wand2, Layers, Loader2, Maximize, Minimize,
  Flame, Crown, PartyPopper, Tv, Target, Hand, Drama, Megaphone, Clapperboard, Video, Frown, Laugh, Ticket, Move, Ghost, Smartphone, Bird, Thermometer, Apple, HelpCircle, Play, Music4, List
} from 'lucide-react';

// --- 1. SOUND ENGINE ---
const playSynthSound = (type, enabled) => {
  if (!enabled) return;
  try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      const now = ctx.currentTime;

      if (type === 'roll') {
          osc.type = 'triangle'; osc.frequency.setValueAtTime(100, now); osc.frequency.linearRampToValueAtTime(800, now + 0.4);
          gain.gain.setValueAtTime(0.2, now); gain.gain.linearRampToValueAtTime(0, now + 0.4);
          osc.start(now); osc.stop(now + 0.4);
      } else if (type === 'curtain') {
          const bufferSize = ctx.sampleRate * 1.5;
          const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
          const data = buffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) { data[i] = Math.random() * 2 - 1; }
          const noise = ctx.createBufferSource();
          noise.buffer = buffer;
          const noiseGain = ctx.createGain();
          noise.connect(noiseGain);
          noiseGain.connect(ctx.destination);
          noiseGain.gain.setValueAtTime(0.05, now);
          noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
          noise.start(now);
      } else if (type === 'click') {
          osc.type = 'sine'; osc.frequency.setValueAtTime(800, now); gain.gain.setValueAtTime(0.05, now); osc.start(now); osc.stop(now + 0.05);
      } else if (type === 'success') {
          const playNote = (f, t, dur) => { const o=ctx.createOscillator(); const g=ctx.createGain(); o.type='square'; o.connect(g); g.connect(ctx.destination); o.frequency.value=f; g.gain.setValueAtTime(0.05, now+t); g.gain.exponentialRampToValueAtTime(0.001, now+t+dur); o.start(now+t); o.stop(now+t+dur); };
          playNote(523.25, 0, 0.2); playNote(659.25, 0.1, 0.2); playNote(783.99, 0.2, 0.4); playNote(1046.50, 0.4, 0.6);
      } else if (type === 'scared') {
           osc.type = 'sawtooth'; osc.frequency.setValueAtTime(100, now); osc.frequency.linearRampToValueAtTime(50, now + 0.5);
           gain.gain.setValueAtTime(0.1, now); gain.gain.linearRampToValueAtTime(0, now + 0.5);
           osc.start(now); osc.stop(now + 0.5);
      } else if (type === 'pop') {
           osc.type = 'triangle'; osc.frequency.setValueAtTime(400, now); gain.gain.setValueAtTime(0.1, now); osc.start(now); osc.stop(now + 0.1);
      } else if (type === 'thud') {
           osc.type = 'square'; osc.frequency.setValueAtTime(50, now); gain.gain.setValueAtTime(0.5, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1); osc.start(now); osc.stop(now + 0.1);
      } else if (type === 'powerup') {
           const o = ctx.createOscillator(); const g = ctx.createGain();
           o.type = 'sawtooth'; o.connect(g); g.connect(ctx.destination);
           o.frequency.setValueAtTime(200, now);
           o.frequency.exponentialRampToValueAtTime(1200, now + 0.8);
           g.gain.setValueAtTime(0.2, now);
           g.gain.linearRampToValueAtTime(0, now + 0.8);
           o.start(now); o.stop(now + 0.8);
      }
  } catch (e) { console.error(e); }
};

// --- AI MOCK GENERATOR FALLBACK ---
const getDynamicQuotesDual = (prompt, type) => {
    const p = prompt.toLowerCase();
    if (type === 'DRAMATIC') {
        return {
            "0": { tr: `Aman efendim! Bu '${p}' beni bitirecek. Sahnede ağlayıp sızlayacağım!`, en: `Oh my! This '${p}' will ruin me. I'll cry on stage!` },
            "1": { tr: `Bana dram deme ulan! '${p}' yüzünden sinir küpüne döndüm, bağıracağım!`, en: `Don't talk drama! '${p}' makes me angry, I'll yell!` },
            "2": { tr: `Ah, '${p}'... Acımı tüm salona şiirsel bir dille haykıracağım.`, en: `Ah, '${p}'... I will shout my pain poetically.` },
            "3": { tr: `Trajedi mi? '${p}' ile deliliğe sürükleniyormuş gibi yapacağım.`, en: `Tragedy? I'll pretend to go mad with '${p}'.` }
        };
    } else if (type === 'ABSURD') {
        return {
            "0": { tr: `Maskaralığım şahane! '${p}' için takla atacağım!`, en: `My foolishness is great! I'll somersault for '${p}'!` },
            "1": { tr: `Hay bin köfte! '${p}' diye diye kaşımı gözümü oynatacağım!`, en: `Blimey! I'll twitch my eyebrows over '${p}'!` },
            "2": { tr: `Ne yapsam boş! '${p}' için komik durumlara düşeceğim.`, en: `Useless! I'll act funny for '${p}'.` },
            "3": { tr: `Şu düştüğüm hale bak! Alaycı bir kahkaha atacağım.`, en: `Look at me! I'll let out a mocking laugh.` }
        };
    } else { // SILENT
        return {
            "0": { tr: `Sus pus oldum! '${p}' derdimi abartılı el kol hareketleriyle anlatacağım.`, en: `I'm mute! I'll use exaggerated gestures for '${p}'.` },
            "1": { tr: `Dilimi yuttum! '${p}' olayını görünmez duvara çarparak oynayacağım.`, en: `Swallowed my tongue! I'll act out '${p}' with pantomime.` },
            "2": { tr: `Kelimeler kifayetsiz... '${p}' acısını yere yığılarak göstereceğim.`, en: `Words fail... I'll collapse silently for '${p}'.` },
            "3": { tr: `En keskin hiciv... Hiç konuşmadan '${p}' konusunu aşağılayacağım.`, en: `Sharpest satire... I'll insult '${p}' silently.` }
        };
    }
};

const generateMockCardsDual = (prompt, draftMissionText) => {
    const p = prompt.toUpperCase();
    return [
        { 
            title: { tr: "DRAMATİK " + p, en: "DRAMATIC " + p }, 
            mission: { tr: draftMissionText.tr, en: draftMissionText.en }, 
            desc: { tr: "En inandırıcı dramı yapan kazanır.", en: "Most convincing drama wins." }, 
            quotes: getDynamicQuotesDual(prompt, 'DRAMATIC') 
        },
        { 
            title: { tr: "ABSÜRT " + p, en: "ABSURD " + p }, 
            mission: { tr: draftMissionText.tr, en: draftMissionText.en }, 
            desc: { tr: "Seyirciyi en çok güldüren kazanır.", en: "Funniest performance wins." }, 
            quotes: getDynamicQuotesDual(prompt, 'ABSURD') 
        },
        { 
            title: { tr: "SESSİZ " + p, en: "SILENT " + p }, 
            mission: { tr: draftMissionText.tr, en: draftMissionText.en }, 
            desc: { tr: "En iyi fiziksel performansı sergileyen kazanır.", en: "Best physical performance wins." }, 
            quotes: getDynamicQuotesDual(prompt, 'SILENT') 
        }
    ];
};

// --- DICTIONARY (TRANSLATIONS) ---
const UI = {
    en: {
        start: "START", rollDice: "ROLL", drawingLots: "DRAWING...", rollingDice: "ROLLING...",
        onStageNow: "ON STAGE", silence: "Silence", goldenMic: "GOLDEN MIC", x2Points: "X2 POINTS!",
        enteringStage: "ENTERING STAGE...", whoSabotage: "Who to sabotage?", time: "Time", finishPerf: "Finish",
        juryScoring: "JURY VOTE", role: "+2 ROLE", obstacleBtn: "+2 OBST.", fail: "-2 FAIL", aiComment: "AI",
        confirmScore: "CONFIRM", backstage: "BACKSTAGE", final: "FINAL", bonus: "BONUS", obstacle: "OBSTACLE",
        easy: "EASY", medium: "MEDIUM", hard: "HARD", oppCard: "OPPORTUNITY", obsCard: "OBSTACLE", improv: "IMPROV",
        easyLevel: "EASY LEVEL", medLevel: "MEDIUM LEVEL", hardLevel: "HARD LEVEL", finalScene: "FINAL SCENE",
        chooseTarget: "CHOOSE TARGET", accept: "ACCEPT", stageYours: "STAGE IS YOURS", applySelf: "Apply to Self",
        giveRival: "Give to Rival", perfReq: "Requires Stage Performance.", activeObstacle: "ACTIVE OBSTACLE",
        useBonusBtn: "USE BONUS", unleashPower: "UNLEASH POWER",
        grandFinale: "GRAND FINALE!", onlyTwoRemain: "Only two remain on stage.", champion: "CHAMPION!",
        finalScore: "Final Score:", playAgain: "PLAY AGAIN", vs: "VS",
        directorPromptTitle: "DIRECTOR'S CHAIR", directorPromptDesc: "Losing teams are now Directors! Enter the final scene theme:",
        generateDraft: "GENERATE DRAFT", regenerate: "RETRY", createAsIs: "CREATE OPTIONS", aiDrafted: "AI DRAFTED SCENE",
        generatingDraft: "Writing...", generatingOptions: "Generating Cards...", castWinner: "CAST WINNER",
        auditionComplete: "Auditions Done!", whoGetsRole: "Who gets the lead role?", transitionWait: "Next Finalist's Turn",
        startNext: "START NEXT", selectAICard: "CHOOSE A SCENE",
        rulesTitle: "STAGE RULES", logs: "HISTORY",
        rulesContent: [
            { title: "🎭 Take the Stage", text: "Roll the dice and move. Draw a card based on your tile." },
            { title: "⏱️ Perform", text: "Act out the scenario on the card within the time limit." },
            { title: "⚖️ Jury Scoring", text: "Other players judge you. Good roleplay grants extra points." },
            { title: "🌟 Golden Mic", text: "Keep the audience hyped! When full, your next score is doubled." },
            { title: "🎬 Grand Finale", text: "Reach tile 35. Top 2 teams face off. Losers direct the final scene!" }
        ],
        close: "CLOSE"
    },
    tr: {
        start: "BAŞLA", rollDice: "ZAR AT", drawingLots: "KURA ÇEKİLİYOR...", rollingDice: "ZAR ATILIYOR...",
        onStageNow: "SAHNEDE", silence: "Sessizlik", goldenMic: "ALTIN MİKROFON", x2Points: "X2 PUAN!",
        enteringStage: "SAHNEYE ÇIKIYOR...", whoSabotage: "Kimi sabote edeceksin?", time: "Süre", finishPerf: "Bitir",
        juryScoring: "JÜRİ OYLAMASI", role: "+2 ROL", obstacleBtn: "+2 ENGEL", fail: "-2 HATA", aiComment: "Y.ZEKA",
        confirmScore: "ONAYLA", backstage: "KULİS", final: "FİNAL", bonus: "BONUS", obstacle: "ENGEL",
        easy: "KOLAY", medium: "ORTA", hard: "ZOR", oppCard: "FIRSAT KARTI", obsCard: "ENGEL", improv: "DOĞAÇLAMA",
        easyLevel: "KOLAY SEVİYE", medLevel: "ORTA SEVİYE", hardLevel: "ZOR SEVİYE", finalScene: "FİNAL SAHNESİ",
        chooseTarget: "HEDEF SEÇ", accept: "KABUL ET", stageYours: "SAHNE SENİN", applySelf: "Kendine Uygula",
        giveRival: "Rakibe Ver", perfReq: "Sahne Performansı Gerektirir.", activeObstacle: "AKTİF ENGEL",
        useBonusBtn: "BONUS KULLAN", unleashPower: "GÜCÜ KULLAN",
        grandFinale: "BÜYÜK FİNAL!", onlyTwoRemain: "Sahnede sadece iki kişi kaldı.", champion: "ŞAMPİYON!",
        finalScore: "Final Puanı:", playAgain: "YENİDEN OYNA", vs: "VS",
        directorPromptTitle: "YÖNETMEN KOLTUĞU", directorPromptDesc: "Kaybedenler yönetmen oldu! Final sahnesinin temasını girin:",
        generateDraft: "TASLAK ÜRET", regenerate: "YENİLE", createAsIs: "SEÇENEKLERİ ÜRET", aiDrafted: "Y.ZEKA GÖREVİ YAZDI",
        generatingDraft: "Yazılıyor...", generatingOptions: "Kartlar Üretiliyor...", castWinner: "ROLÜ VER",
        auditionComplete: "Seçmeler Bitti!", whoGetsRole: "Başrolü kim kapıyor?", transitionWait: "Sıra Diğer Finalistte",
        startNext: "SIRADAKİ SEÇME", selectAICard: "SAHNE SEÇ",
        rulesTitle: "KURALLAR", logs: "GEÇMİŞ",
        rulesContent: [
            { title: "🎭 Sahneye Çık", text: "Zar at ve ilerle. Durduğun kareye göre kart çek." },
            { title: "⏱️ Performans", text: "Karttaki senaryoyu süre bitmeden canlandır." },
            { title: "⚖️ Jüri Oylaması", text: "Diğer oyuncular jüri olur. Role girmek ekstra puan kazandırır." },
            { title: "🌟 Altın Mikrofon", text: "Seyirciyi coştur! Bar dolduğunda alacağın puan ikiye katlanır." },
            { title: "🎬 Büyük Final", text: "35'e ulaşıldığında en iyi 2 takım finale çıkar. Kaybedenler finali yazar!" }
        ],
        close: "KAPAT"
    }
};

const TEAM_INFO = {
    0: { name: 'İBİŞ', desc: { en: 'Cunning & Witty', tr: 'Kurnaz & Esprili' }, longDesc: { en: 'A traditional jester. A word wizard.', tr: 'Geleneksel bir şakacı. Kelime sihirbazı.' }, style: { en: 'Humorous', tr: 'Mizahi' } },
    1: { name: 'KARAGÖZ', desc: { en: 'Physical & Blunt', tr: 'Fiziksel & Dobra' }, longDesc: { en: "Doesn't mince words, says it straight.", tr: 'Lafını esirgemez, dobra dobra konuşur.' }, style: { en: 'Physical', tr: 'Fiziksel' } },
    2: { name: 'SHAKESPEARE', desc: { en: 'Dramatic & Poetic', tr: 'Dramatik & Şiirsel' }, longDesc: { en: 'The most serious actor on stage.', tr: 'Sahnedeki en ciddi ve trajik aktör.' }, style: { en: 'Tragic', tr: 'Trajik' } },
    3: { name: 'ARİSTOFANES', desc: { en: 'Satirical & Clever', tr: 'Hicivli & Zeki' }, longDesc: { en: 'Always looks down on events.', tr: 'Olaylara her zaman yukarıdan bakar ve alay eder.' }, style: { en: 'Ironic', tr: 'İronik' } }
};

// --- SMART ASSET DISPLAY ---
const AssetDisplay = ({ src, className, style, alt }) => {
    if (!src) return <div className={className} style={{...style, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent'}}>{alt}</div>;
    if (typeof src !== 'string') return null;
    const isVideo = src.toLowerCase().endsWith('.mp4') || src.toLowerCase().endsWith('.webm');
    
    if (isVideo) {
        const hasBgClass = className.includes('bg-');
        return <video key={src} src={src} className={`${className} ${hasBgClass ? '' : 'bg-black'}`} style={{...style}} autoPlay loop muted playsInline />;
    }
    
    return <img src={src} className={`${className} object-cover`} style={{...style}} alt={alt} />;
};

// --- ICON HELPER ---
const getCardIcon = (text, defaultIcon) => {
    if (!text) return defaultIcon;
    const lowerText = text.toLowerCase();
    if (lowerText.includes("king") || lowerText.includes("kral") || lowerText.includes("crown")) return <Crown size={32} className="text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]" />;
    if (lowerText.includes("phone") || lowerText.includes("sinyal") || lowerText.includes("call")) return <Smartphone size={32} className="text-blue-400 drop-shadow-[0_0_10px_rgba(96,165,250,0.8)]" />;
    if (lowerText.includes("chicken") || lowerText.includes("tavuk")) return <Bird size={32} className="text-orange-400 drop-shadow-[0_0_10px_rgba(251,146,60,0.8)]" />;
    if (lowerText.includes("cold") || lowerText.includes("soğuk") || lowerText.includes("freeze")) return <Thermometer size={32} className="text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]" />;
    if (lowerText.includes("apple") || lowerText.includes("elma") || lowerText.includes("eat")) return <Apple size={32} className="text-red-400 drop-shadow-[0_0_10px_rgba(248,113,113,0.8)]" />;
    if (lowerText.includes("song") || lowerText.includes("şarkı") || lowerText.includes("music")) return <Music size={32} className="text-purple-400 drop-shadow-[0_0_10px_rgba(192,132,252,0.8)]" />;
    if (lowerText.includes("laugh") || lowerText.includes("gül")) return <Laugh size={32} className="text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.8)]" />;
    if (lowerText.includes("scared") || lowerText.includes("kork") || lowerText.includes("ghost")) return <Ghost size={32} className="text-gray-300 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />;
    return defaultIcon;
};

// --- 2. GAME ASSETS ---
const GAME_ASSETS = {
    bg: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/arkplan.png",
    logo: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/dogacla_logsu.png",
    music_bg: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/The_Clockwork_Caper.mp3", 
    ibis: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/ibi%C5%9F.png", 
    karagoz: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/karagoz.png",
    shakespeare: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/sheashper.png",
    aristophanes: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/aristopahnes.png",
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

const DEFAULT_ASSETS = {
    boardBg: GAME_ASSETS.bg, logo: GAME_ASSETS.logo, music_bg: GAME_ASSETS.music_bg,
    team0: GAME_ASSETS.ibis, team1: GAME_ASSETS.karagoz, team2: GAME_ASSETS.shakespeare, team3: GAME_ASSETS.aristophanes,
    bonus_tubi: GAME_ASSETS.tubi, bonus_kubi: GAME_ASSETS.kubi, bonus_mali: GAME_ASSETS.mali,
    bonus_kubo: GAME_ASSETS.kubo, bonus_madox: GAME_ASSETS.madox, bonus_dputiyat: GAME_ASSETS.diputiyat,
    bonus_gulec: GAME_ASSETS.gulec, bonus_sadic: GAME_ASSETS.sadic, bonus_cihad: GAME_ASSETS.cicu,
    team0_idle: GAME_ASSETS.team0_idle, team0_happy: GAME_ASSETS.team0_happy, team0_thinking: GAME_ASSETS.team0_thinking, team0_scared: GAME_ASSETS.team0_scared,
    team1_idle: GAME_ASSETS.team1_idle, team1_happy: GAME_ASSETS.team1_happy, team1_thinking: GAME_ASSETS.team1_thinking, team1_scared: GAME_ASSETS.team1_scared,
    team2_idle: GAME_ASSETS.team2_idle, team2_happy: GAME_ASSETS.team2_happy, team2_thinking: GAME_ASSETS.team2_thinking, team2_scared: GAME_ASSETS.team2_scared,
    team3_idle: GAME_ASSETS.team3_idle, team3_happy: GAME_ASSETS.team3_happy, team3_thinking: GAME_ASSETS.team3_thinking, team3_scared: GAME_ASSETS.team3_scared,
};

const INITIAL_TEAMS = [
  { id: 0, color: 'bg-orange-500', border: 'border-orange-500', text: 'text-orange-500', icon: '🤡', score: 0, pos: 0, bonuses: [], activeObstacles: [] },
  { id: 1, color: 'bg-red-600', border: 'border-red-600', text: 'text-red-600', icon: '👺', score: 0, pos: 0, bonuses: [], activeObstacles: [] },
  { id: 2, color: 'bg-purple-600', border: 'border-purple-600', text: 'text-purple-600', icon: '✒️', score: 0, pos: 0, bonuses: [], activeObstacles: [] },
  { id: 3, color: 'bg-blue-600', border: 'border-blue-600', text: 'text-blue-600', icon: '🏛️', score: 0, pos: 0, bonuses: [], activeObstacles: [] },
];

const CARDS = {
  EASY: [ 
    { title: { en: "BROKEN ELEVATOR", tr: "BOZUK ASANSÖR" }, mission: { en: "You are stuck in a tight space. Show suffocation and panic with your body.", tr: "Dar bir alanda sıkıştın. Bedeninle boğulma ve paniği göster." }, quotes: { 0: {en: "Sir, we are toasted in this tin can!", tr: "Efendim, bu teneke kutuda piştik!"}, 1: {en: "We are stuck! My ribs are crushed!", tr: "Sıkıştık! Kaburgalarım ezildi!"}, 2: {en: "Oh iron cage! Trapping two souls...", tr: "Ah demir kafes! İki ruhu hapseden..."}, 3: {en: "This mechanical box is the tragedy of modern man.", tr: "Bu mekanik kutu modern insanın trajedisidir."} } }, 
    { title: { en: "POLAR COLD", tr: "KUTUP SOĞUĞU" }, mission: { en: "You are freezing. Teeth chattering. Try to warm up.", tr: "Donuyorsun. Dişlerin birbirine çarpıyor. Isınmaya çalış." }, quotes: { 0: {en: "Oh sir, I'm freezing! My nose turned to ice!", tr: "Aman efendim, donuyorum! Burnum buza döndü!"}, 1: {en: "Frozen! Light the stove!", tr: "Donduk! Yakın sobayı!"}, 2: {en: "Ah, this cold wind pierces my bones.", tr: "Ah, bu soğuk rüzgar kemiklerimi delip geçiyor."}, 3: {en: "This cold extinguishes the fire of the soul.", tr: "Bu soğuk, ruhun ateşini bile söndürüyor."} } }, 
    { title: { en: "CHICKEN ACT", tr: "TAVUK TAKLİDİ" }, mission: { en: "Act like a chicken. Cluck, scratch for food.", tr: "Bir tavuk gibi davran. Gıdakla, yem eşele." }, quotes: { 0: {en: "Cluck cluck sir!", tr: "Gıt gıdak efendim!"}, 1: {en: "Cluck! Are we stuck in a coop?", tr: "Gıdak! Kümese mi tıkıldık?"}, 2: {en: "Like a bird, but flightless... Oh feathered fate!", tr: "Bir kuş gibi ama uçamayan... Ah tüylü kader!"}, 3: {en: "Why must I behave like a chicken? Absurd!", tr: "Neden bir tavuk gibi davranmalıyım? Ne absürt!"} } }, 
    { title: { en: "NO SIGNAL", tr: "SİNYAL YOK" }, mission: { en: "Making a very important call but the line cuts off.", tr: "Çok önemli bir arama yapıyorsun ama hat kesiliyor." }, quotes: { 0: {en: "Hellooo! Can't hear you!", tr: "Alooo! Duyamıyorum seni!"}, 1: {en: "What do you say! Don't shout!", tr: "Ne diyorsun! Bağırma!"}, 2: {en: "Ah, faint voice from afar! Why can't I reach you?", tr: "Ah, uzaklardan gelen cılız ses! Sana neden ulaşamıyorum?"}, 3: {en: "Miscommunication in the age of communication...", tr: "İletişim çağında iletişimsizlik..."} } } 
  ],
  MEDIUM: [ 
    { title: { en: "FORGETFULNESS", tr: "UNUTKANLIK" }, mission: { en: "You forgot what to say right at that moment.", tr: "Tam o an ne söyleyeceğini unuttun." }, quotes: { 0: {en: "Umm... Sir, it was on the tip of my tongue!", tr: "Eee... Efendim, dilimin ucundaydı!"}, 1: {en: "You stole the words from my mind!", tr: "Kelimeleri aklımdan çaldınız!"}, 2: {en: "Ah, my memory betrays me! Words are lost.", tr: "Ah, hafızam bana ihanet ediyor! Kelimeler kayıp."}, 3: {en: "Silence... The greatest line is the unspoken one.", tr: "Sessizlik... En büyük replik söylenmeyendir."} } }, 
    { title: { en: "INVISIBLE APPLE", tr: "GÖRÜNMEZ ELMA" }, mission: { en: "Eat as if you have an apple in hand.", tr: "Elinde bir elma varmış gibi ye." }, quotes: { 0: {en: "Oh sir, this isnt an apple, its a diamond! Crunch!", tr: "Aman efendim, bu elma değil elmas! Kırt!"}, 1: {en: "I have nothing but I am eating!", tr: "Elimde hiçbir şey yok ama yiyorum!"}, 2: {en: "I feel the taste of a non-existent fruit.", tr: "Var olmayan bir meyvenin tadını hissediyorum."}, 3: {en: "Creating an invisible object... That is art.", tr: "Görünmez bir obje yaratmak... İşte sanat budur."} } } 
  ],
  HARD: [ 
    { title: { en: "FAKE KING", tr: "SAHTE KRAL" }, mission: { en: "A panicked leader lying that everything is under control.", tr: "Her şeyin kontrol altında olduğu yalanını söyleyen paniklemiş bir lider." }, quotes: { 0: {en: "I am the king! (Trembles)", tr: "Kral benim! (Titrer)"}, 1: {en: "What I say goes! I am the King! I'm not scared...", tr: "Benim dediğim olur! Ben Kralım! Korkmuyorum..."}, 2: {en: "Oh my people! This crown is heavy...", tr: "Ah halkım! Bu taç çok ağır..."}, 3: {en: "This illusion I offer is for your peace.", tr: "Sunduğum bu illüzyon sizin huzurunuz içindir."} } }, 
    { title: { en: "LAUGHING CRYING", tr: "AĞLARKEN GÜLMEK" }, mission: { en: "Laugh while telling something very sad.", tr: "Çok üzücü bir şey anlatırken kahkaha at." }, quotes: { 0: {en: "Hahaha! Oh, it's so sad!", tr: "Hahaha! Ah, ne kadar üzücü!"}, 1: {en: "Hahaha! Oh my poor head!", tr: "Hahaha! Vah zavallı başım!"}, 2: {en: "My smile is a mask hiding my tears.", tr: "Gülümsemem, gözyaşlarımı saklayan bir maskedir."}, 3: {en: "Tragedy and comedy... Two faces of life.", tr: "Trajedi ve komedi... Hayatın iki yüzü."} } } 
  ],
  FINAL: [ 
    { title: { en: "FAREWELL SPEECH", tr: "VEDA KONUŞMASI" }, mission: { en: "The play is ending. Give a dramatic farewell.", tr: "Oyun bitiyor. Dramatik bir veda konuşması yap." }, quotes: { 0: {en: "Forgive us if we slipped up!", tr: "Sürçülisan ettiysek affola!"}, 1: {en: "I'm out of here!", tr: "Ben kaçar!"}, 2: {en: "As the curtain falls, our shadows remain.", tr: "Perde kapanırken, geriye gölgelerimiz kalır."}, 3: {en: "The play ends, real life begins.", tr: "Oyun biter, gerçek hayat başlar."} } } 
  ],
  OBSTACLE: [ 
    { id: 'o1', text: { en: "Speak only in single words.", tr: "Sadece tek kelimelerle konuş." }, type: 'marked' }, 
    { id: 'o2', text: { en: "Sing your explanation.", tr: "Açıklamanı şarkı söyleyerek yap." }, type: 'unmarked' }, 
    { id: 'o3', text: { en: "No eye contact.", tr: "Göz teması kurma." }, type: 'marked' }, 
    { id: 'o4', text: { en: "Hands in pockets.", tr: "Eller ceplerde." }, type: 'marked' }, 
    { id: 'o5', text: { en: "Play with your back turned.", tr: "Arkanı dönerek oyna." }, type: 'marked' }, 
    { id: 'o6', text: { en: "Jump constantly.", tr: "Sürekli zıpla." }, type: 'marked' }, 
    { id: 'o7', text: { en: "Whisper.", tr: "Fısılda." }, type: 'marked' }, 
    { id: 'o8', text: { en: "Move very slowly.", tr: "Çok yavaş hareket et." }, type: 'marked' }, 
    { id: 'o9', text: { en: "Start every sentence with 'Actually'.", tr: "Her cümleye 'Aslında' diye başla." }, type: 'marked' }, 
    { id: 'o10', text: { en: "Speak while laughing.", tr: "Gülerek konuş." }, type: 'marked' } 
  ],
  BONUS: [ 
    { id: 'tubi', name: 'Tubi', desc: { en: 'I am here dear! Think like your mother... I will give you 20 seconds advice!', tr: 'Buradayım canım! Annen gibi düşün... Sana 20 saniye tavsiye vereceğim!' }, benefit: { en: 'GET IDEA', tr: 'FİKİR AL' }, effect: 'idea' }, 
    { id: 'kubi', name: 'Kubi', desc: { en: 'Pen in hand! I am writing one more person into this scene. Let it be crowded!', tr: 'Kalem elimde! Bu sahneye bir kişi daha yazıyorum. Kalabalık olsun!' }, benefit: { en: 'EXTRA CHARACTER', tr: 'EKSTRA KARAKTER' }, effect: 'char' }, 
    { id: 'mali', name: 'Mali', desc: { en: 'Calculated, we profit from this.', tr: 'Hesapladım, bu işten kârlı çıkarız.' }, benefit: { en: '+2 POINTS', tr: '+2 PUAN' }, effect: 'score' }, 
    { id: 'kubo', name: 'Kubo', desc: { en: "Cut! Didn't work, taking it from the top but extending time.", tr: 'Kestik! Olmadı, baştan alıyoruz ama süreyi uzatıyorum.' }, benefit: { en: '+30 SECONDS', tr: '+30 SANİYE' }, effect: 'time' }, 
    { id: 'madox', name: 'Madox', desc: { en: "This scene's genre bored me. Changed!", tr: 'Bu sahnenin türü beni sıktı. Değiştirildi!' }, benefit: { en: 'CHANGE GENRE', tr: 'TÜRÜ DEĞİŞTİR' }, effect: 'genre' }, 
    { id: 'dputiyat', name: 'Dpütiyat', desc: { en: 'No being alone! Grab someone, throw them on stage.', tr: 'Yalnız olmak yok! Birini kap, sahneye fırlat.' }, benefit: { en: 'INVITE PLAYER', tr: 'OYUNCU DAVET ET' }, effect: 'add_player' }, 
    { id: 'gulec', name: 'Güleç', desc: { en: 'Wonderful! Creating a storm of applause!', tr: 'Harika! Bir alkış tufanı yaratıyorum!' }, benefit: { en: 'APPLAUSE BONUS', tr: 'ALKIŞ BONUSU' }, effect: 'applause' }, 
    { id: 'sadic', name: 'Sadıç', desc: { en: 'Life is a gamble brother! Rolling the dice!', tr: 'Hayat bir kumardır kardeşim! Zarları atıyorum!' }, benefit: { en: 'LUCKY DICE', tr: 'ŞANS ZARI' }, effect: 'gamble' }, 
    { id: 'cihad', name: 'Cihad', desc: { en: 'I have a surprise in my pocket... Use it!', tr: 'Cebimde bir sürpriz var... Kullan onu!' }, benefit: { en: 'SURPRISE OBJECT', tr: 'SÜRPRİZ OBJE' }, effect: 'double' } 
  ]
};

const getRandomCardText = (card, teamId, lang) => {
    if (!card?.quotes?.[teamId]) return "";
    return card.quotes[teamId][lang] || card.quotes[teamId];
};

const generateBoardMap = () => Array(36).fill(null).map((_, i) => {
  if (i === 0) return { type: 'start' };
  if (i === 35) return { type: 'final' };
  if (i % 5 === 0) return { type: 'bonus' }; 
  if (i % 6 === 0) return { type: 'obstacle' };
  if (i < 10) return { type: 'easy' };
  if (i < 20) return { type: 'medium' };
  return { type: 'hard' };
});
const BOARD_MAP = generateBoardMap();

// --- COMPONENTS ---
const FloatingReaction = ({ emoji, x, onComplete, id }) => {
  useEffect(() => { const timer = setTimeout(() => onComplete(id), 1200); return () => clearTimeout(timer); }, [id, onComplete]);
  return <div className="absolute bottom-1/4 text-5xl pointer-events-none select-none z-50 animate-float" style={{ left: `${x}%` }}>{emoji}</div>;
};

const ConfettiExplosion = () => (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
        {[...Array(50)].map((_, i) => <div key={i} className="absolute animate-confetti" style={{left: `${Math.random() * 100}%`, top: '-10px', backgroundColor: ['#ff0', '#f0f', '#0ff', '#0f0', '#d4af37'][Math.floor(Math.random() * 5)], width: '10px', height: '10px', animationDuration: `${Math.random() * 2 + 1}s`}} />)}
    </div>
);

// Mobile optimized Dice (smaller)
const Dice3D = ({ value, isRolling }) => {
    const [currentClass, setCurrentClass] = useState('');
    useEffect(() => { if (isRolling) setCurrentClass('rolling'); else if (value) setCurrentClass(`show-${value}`); }, [value, isRolling]);
    return <div className="scene w-24 h-24 mx-auto perspective-1000"><div className={`cube w-full h-full relative transform-style-3d transition-transform duration-1000 ${isRolling ? 'rolling' : currentClass}`}>{[1,2,3,4,5,6].map(n => <div key={n} className={`cube__face cube__face--${n} absolute w-24 h-24 border-2 border-neon-blue bg-black/90 flex items-center justify-center text-5xl text-neon-blue font-bold shadow-[inset_0_0_20px_rgba(0,255,255,0.5)]`}>{n}</div>)}</div></div>;
};

const TeamDice3D = ({ winnerId, isRolling, assets }) => {
    const [currentClass, setCurrentClass] = useState('');
    useEffect(() => { if (isRolling) setCurrentClass('kura-rolling'); else if (winnerId !== null) setCurrentClass(`show-${(winnerId % 4) + 1}`); }, [winnerId, isRolling]);
    const renderFace = (teamId) => {
        const assetSrc = assets[`team${teamId}_idle`] || assets[`team${teamId}`];
        return <div className="w-full h-full flex items-center justify-center bg-black border-2 border-[#D4AF37] rounded-lg overflow-hidden">{assetSrc ? <AssetDisplay src={assetSrc} className="w-full h-full object-cover" alt={`Team ${teamId}`} /> : <span className="text-[#D4AF37] text-2xl">T{teamId+1}</span>}</div>;
    };
    return <div className="scene w-24 h-24 mx-auto perspective-1000"><div className={`cube w-full h-full relative transform-style-3d transition-transform duration-1000 ${currentClass}`}>{[0,1,2,3,0,1].map((t, i) => <div key={i} className={`cube__face cube__face--${i+1}`}>{renderFace(t)}</div>)}</div></div>;
};

// --- CARD DESIGN (MOBILE OPTIMIZED) ---
const CardDisplay = ({ card, type, mode = 'draw', onAction, assets, currentTeamId, lang }) => {
    const cardRef = useRef(null);
    const [isEntered, setIsEntered] = useState(false);

    useEffect(() => {
        const loadAnime = async () => {
            if (!window.anime) {
                const script = document.createElement('script');
                script.src = "https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js";
                document.body.appendChild(script);
                await new Promise(res => script.onload = res);
            }
            runEntranceAnimation();
            setIsEntered(true);
        };
        loadAnime();
        
        if (mode === 'play') {
            playSynthSound('powerup', true);
        } else {
            playSynthSound('curtain', true);
        }
    }, [mode]);

    const runEntranceAnimation = () => {
        if (!window.anime) return;
        const tl = window.anime.timeline({ easing: 'easeOutExpo', duration: 1200 });
        
        if (mode === 'draw') {
            tl.add({ targets: '#curtain-left', translateX: ['0%', '-100%'], scaleX: [1, 0.2], duration: 1000 }, 0)
              .add({ targets: '#curtain-right', translateX: ['0%', '100%'], scaleX: [1, 0.2], duration: 1000 }, 0)
              .add({ targets: '.stagger-item', translateY: [30, 0], opacity: [0, 1], delay: window.anime.stagger(100), easing: 'spring(1, 80, 10, 0)' }, '-=600');
        } else if (mode === 'play') {
            tl.add({ 
                targets: cardRef.current, 
                scale: [1.2, 1], 
                opacity: [0, 1], 
                duration: 1000, 
                easing: 'easeOutElastic(1, .5)' 
            }, 0)
            .add({ targets: '.stagger-item', translateY: [20, 0], opacity: [0, 1], delay: window.anime.stagger(100) }, '-=800');
        }
    };

    const triggerAction = () => {
        if (mode === 'play' && window.anime && cardRef.current) {
            window.anime({
                targets: cardRef.current,
                scale: [1, 1.2],
                opacity: [1, 0],
                duration: 300,
                easing: 'easeInExpo',
                complete: onAction
            });
        } else {
            onAction();
        }
    };

    if (!card) return null;

    const isBonus = type === 'bonus';
    const isObstacle = type === 'obstacle';
    const isFinal = type === 'final';
    const isPlaying = mode === 'play';
    
    let titleText = "";
    let missionText = "";
    let flavorText = "";
    let icon = <Drama size={32} className="text-[#D4AF37]"/>;
    let characterVideoSrc = null;
    let bgStyle = "bg-neutral-900";
    let accentColor = "text-white";
    let glowColor = "rgba(255,255,255,0.1)";
    const baseKey = `team${currentTeamId}`;

    if (isBonus) {
        titleText = card.name || "BONUS";
        missionText = card.desc?.[lang] || card.desc || "";
        flavorText = `${UI[lang]?.oppCard || "FIRSAT KARTI"} ✦ ${card.benefit?.[lang] || card.benefit || ""}`;
        icon = <Sparkles size={32} className="text-blue-400 animate-pulse"/>;
        bgStyle = isPlaying ? "bg-gradient-to-b from-yellow-600 to-red-900" : "bg-gradient-to-b from-indigo-600 to-blue-900";
        accentColor = isPlaying ? "text-yellow-200" : "text-indigo-200";
        glowColor = isPlaying ? "rgba(255, 200, 0, 0.8)" : "rgba(99, 102, 241, 0.5)";
    } else if (isObstacle) {
        titleText = UI[lang].obsCard;
        missionText = card.text[lang] || card.text;
        flavorText = card.type === 'marked' ? UI[lang].applySelf : UI[lang].giveRival;
        icon = <Skull size={32} className="text-red-500 animate-bounce"/>;
        characterVideoSrc = assets[`${baseKey}_scared`];
        bgStyle = "bg-gradient-to-b from-red-600 to-rose-900";
        accentColor = "text-red-200";
        glowColor = "rgba(225, 29, 72, 0.5)";
    } else {
        titleText = isFinal ? (card.title?.tr ? card.title[lang] : card.title) : UI[lang].improv;
        missionText = card.mission[lang] || card.mission || "";
        
        let quoteStr = getRandomCardText(card, currentTeamId, lang);
        flavorText = quoteStr ? `"${quoteStr}"` : (card.desc?.[lang] || card.desc || "");
        
        icon = getCardIcon(missionText + " " + titleText, <Drama size={32} className="text-[#D4AF37]"/>);
        
        if(type === 'easy') {
            characterVideoSrc = assets[`${baseKey}_happy`];
            bgStyle = "bg-gradient-to-b from-emerald-500 to-teal-800";
            accentColor = "text-emerald-100";
            titleText = UI[lang].easyLevel;
        } else if(type === 'medium') {
            characterVideoSrc = assets[`${baseKey}_thinking`];
            bgStyle = "bg-gradient-to-b from-amber-500 to-orange-800";
            accentColor = "text-amber-100";
            titleText = UI[lang].medLevel;
        } else if(type === 'hard') {
            bgStyle = "bg-gradient-to-b from-rose-500 to-red-800";
            accentColor = "text-rose-100";
            characterVideoSrc = assets[`${baseKey}_scared`];
            titleText = UI[lang].hardLevel;
        } else if(type === 'final') {
            bgStyle = "bg-gradient-to-b from-yellow-600 via-orange-600 to-red-900";
            accentColor = "text-yellow-100";
            characterVideoSrc = assets[`${baseKey}_scared`];
        }
    }

    return (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/90 backdrop-blur-sm overflow-hidden px-4">
            <style>@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,700&display=swap');</style>
            
            {isPlaying && <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(255,200,0,0.3)_0%,transparent_70%)] animate-pulse"></div>}

            <div 
                ref={cardRef}
                className={`relative w-full max-w-sm h-[75vh] max-h-[600px] rounded-3xl overflow-hidden shadow-2xl flex flex-col opacity-100 border border-white/20`}
                style={{ boxShadow: `0 10px 40px -10px ${glowColor}` }}
            >
                <div className={`absolute inset-0 ${bgStyle} z-0`}></div>

                <div className="absolute inset-0 z-10 flex flex-col justify-start p-0">
                    <div className={`relative w-full ${isBonus ? 'h-[45%]' : 'h-[40%]'} shrink-0 z-0 overflow-hidden flex items-center justify-center bg-black`}>
                         {isBonus && assets[`bonus_${card.id}`] ? (
                            <AssetDisplay 
                                src={assets[`bonus_${card.id}`]} 
                                className={`w-full h-full object-cover object-top bg-transparent mix-blend-screen transition-transform duration-700 ${isPlaying ? 'scale-110 drop-shadow-[0_0_20px_rgba(255,200,0,1)]' : 'scale-100'}`} 
                                alt="Bonus" 
                            />
                        ) : (
                            characterVideoSrc && <AssetDisplay src={characterVideoSrc} className="w-full h-full object-contain object-top" alt="Character" />
                        )}
                        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
                    </div>

                    <div className={`relative z-30 flex-1 flex flex-col items-center justify-start text-center px-6 pb-6 ${isBonus ? '-mt-4 pt-4' : '-mt-6'}`}>
                         <div className={`p-4 rounded-full bg-black/60 border border-[#D4AF37]/50 mb-4 backdrop-blur-md inline-flex justify-center shadow-xl`}>
                             {isPlaying ? <Zap size={32} className="text-yellow-400 animate-pulse"/> : icon}
                         </div>
                         
                         <h1 className="text-3xl text-[#D4AF37] font-black italic mb-3 leading-none uppercase text-center w-full">
                             {titleText}
                         </h1>
                         
                         <div className="w-full mb-3 bg-black/40 border border-[#D4AF37]/30 p-3 rounded-xl shadow-inner flex-1 flex items-center justify-center">
                            <p className={`${isBonus ? 'text-base' : 'text-lg'} font-bold leading-tight ${accentColor}`}>
                                "{missionText}"
                            </p>
                         </div>
                         
                         <p className={`italic mb-4 px-1 leading-relaxed ${isBonus ? 'text-xs text-yellow-500 font-bold uppercase tracking-wider' : 'text-sm text-gray-300'}`}>
                            {flavorText}
                         </p>
                         
                         <button onClick={triggerAction} className={`stagger-item opacity-0 w-full mt-auto py-4 rounded-xl font-black text-lg tracking-widest uppercase shadow-[0_5px_20px_rgba(0,0,0,0.5)] transition-all active:scale-95 ${isPlaying || isFinal ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black border-2 border-white animate-pulse' : 'bg-white text-black'}`}>
                            {isPlaying ? (UI[lang]?.unleashPower || "GÜCÜ KULLAN") : (isBonus ? (UI[lang]?.accept || "KABUL ET") : (UI[lang]?.stageYours || "SAHNE SENİN"))}
                         </button>
                    </div>
                </div>

                {mode === 'draw' && (
                    <svg className="absolute inset-0 z-50 pointer-events-none w-full h-full" preserveAspectRatio="none">
                        <rect id="curtain-left" x="0" y="0" width="50%" height="100%" fill="#8B0000" />
                        <rect id="curtain-right" x="50%" y="0" width="50%" height="100%" fill="#8B0000" />
                    </svg>
                )}
            </div>
        </div>
    );
};

// --- 4. MAIN GAME ---

export default function DogaclaVisualsFinal() {
  const [lang, setLang] = useState('tr');
  const [teams, setTeams] = useState(() => JSON.parse(localStorage.getItem('dogacla_teams_v90')) || JSON.parse(JSON.stringify(INITIAL_TEAMS)));
  const [assets, setAssets] = useState(() => {
      const stored = localStorage.getItem('dogacla_assets_v103');
      return stored ? JSON.parse(stored) : DEFAULT_ASSETS;
  });
  const [currentTurn, setCurrentTurn] = useState(() => parseInt(localStorage.getItem('dogacla_turn_v90')) || 0);
  
  const [gameState, setGameState] = useState('INTRO');
  const [diceValue, setDiceValue] = useState(null);
  const [activeCard, setActiveCard] = useState(null);
  const [cardType, setCardType] = useState(null);
  const [playingBonus, setPlayingBonus] = useState(null);

  const [performanceTimer, setPerformanceTimer] = useState(0);
  const [juryScore, setJuryScore] = useState(0);
  const [voteData, setVoteData] = useState({ roleplay: false, obstacleOvercome: false, fail: false, bonusScore: 0 });
  const [hypeMeter, setHypeMeter] = useState(0); 
  
  const [characterMood, setCharacterMood] = useState('idle');

  const [isRollingDice, setIsRollingDice] = useState(false);
  const [showDiceModal, setShowDiceModal] = useState(false);
  const [kuraRolling, setKuraRolling] = useState(false); 

  const [finalists, setFinalists] = useState([]); 
  const [directors, setDirectors] = useState([]); 
  const [directorInput, setDirectorInput] = useState(''); 
  const [draftMission, setDraftMission] = useState(null);
  const [customFinalCard, setCustomFinalCard] = useState(null); 
  const [aiCards, setAiCards] = useState([]); 

  const [finalTurnIndex, setFinalTurnIndex] = useState(0); 
  const [winner, setWinner] = useState(null);
  const [logs, setLogs] = useState(["Doğaçla Mobile Act I!"]);
  const [reactions, setReactions] = useState([]);
  const [confetti, setConfetti] = useState(false); 
  const [randomEvent, setRandomEvent] = useState(null);

  const [showRules, setShowRules] = useState(false);
  const [showLogsMenu, setShowLogsMenu] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [timerKey, setTimerKey] = useState(0); 
  const [criticLoading, setCriticLoading] = useState(false);
  const [isMoving, setIsMoving] = useState(false); 

  // MOBİL SES KİLİDİ AÇICI (iOS ve Android için Audio Context izni)
  useEffect(() => {
      const unlockAudio = () => {
          playSynthSound('click', false);
          document.removeEventListener('touchstart', unlockAudio);
          document.removeEventListener('click', unlockAudio);
      };
      document.addEventListener('touchstart', unlockAudio);
      document.addEventListener('click', unlockAudio);
      return () => {
          document.removeEventListener('touchstart', unlockAudio);
          document.removeEventListener('click', unlockAudio);
      };
  }, []);

  const currentTeam = teams[currentTurn];
  const isGoldenMic = hypeMeter >= 100; 
  const bgMusicRef = useRef(new Audio());

  useEffect(() => {
      const audioEl = bgMusicRef.current;
      if (!soundEnabled) { audioEl.pause(); return; }
      const trackToPlay = assets.music_bg; 
      if (audioEl.src !== trackToPlay) {
          audioEl.src = trackToPlay;
          audioEl.loop = true;
          audioEl.volume = 0.15; 
      }
      if (audioEl.paused) {
          audioEl.play().catch(e => console.log("Auto-play blocked", e));
      }
  }, [soundEnabled, assets.music_bg]);

  useEffect(() => {
      localStorage.setItem('dogacla_teams_v90', JSON.stringify(teams));
      localStorage.setItem('dogacla_turn_v90', currentTurn.toString());
      localStorage.setItem('dogacla_assets_v103', JSON.stringify(assets));
  }, [teams, currentTurn, assets]);

  useEffect(() => { if (gameState === 'INTRO') setTimeout(() => setGameState('ROLL'), 3000); }, [gameState]);

  const addLog = (msg) => setLogs(prev => [`• ${msg}`, ...prev].slice(0, 15)); 
  const addReaction = (emoji) => { playSynthSound('click', soundEnabled); const id = Date.now() + Math.random(); const x = Math.random() * 80 + 10; setReactions(prev => [...prev, { id, emoji, x }]); setHypeMeter(Math.min(100, hypeMeter + 2)); };
  const removeReaction = useCallback((id) => setReactions(prev => prev.filter(r => r.id !== id)), []);
  
  const resetGame = () => { 
      playSynthSound('click', soundEnabled);
      localStorage.removeItem('dogacla_teams_v90');
      localStorage.removeItem('dogacla_turn_v90');
      setTeams(JSON.parse(JSON.stringify(INITIAL_TEAMS)));
      setCurrentTurn(0); setDiceValue(null); setActiveCard(null); setCardType(null); setPlayingBonus(null);
      setPerformanceTimer(0); setJuryScore(0); setVoteData({ roleplay: false, obstacleOvercome: false, fail: false, bonusScore: 0 });
      setHypeMeter(0); setCharacterMood('idle'); setIsRollingDice(false); setShowDiceModal(false); setKuraRolling(false);
      setFinalists([]); setDirectors([]); setDirectorInput(''); setDraftMission(null); setCustomFinalCard(null); setAiCards([]);
      setFinalTurnIndex(0); setWinner(null); setLogs(["Doğaçla Mobile Act I!"]); setReactions([]); setConfetti(false); setRandomEvent(null);
      setGameState('INTRO'); 
  };

  const triggerFinalTest = () => {
      setTeams(prev => prev.map((t, i) => {
          if (i === 0 || i === 1) return { ...t, pos: 35, score: 150 - i }; 
          return { ...t, pos: 10, score: 50 }; 
      }));
      setTimeout(checkFinals, 100);
  };

  const getCurrentCharacterAsset = () => {
      const baseKey = `team${currentTeam.id}`;
      return assets[`${baseKey}_${characterMood}`] || assets[`${baseKey}_idle`] || assets[baseKey];
  };

  const triggerAudienceEvent = () => {
      const chance = Math.random();
      if (chance < 0.15) { 
          const isGood = Math.random() > 0.5;
          const msg = isGood ? (lang === 'tr' ? "Gül yağmuru!" : "Roses raining!") : (lang === 'tr' ? "Domates yağmuru!" : "Tomato rain!");
          const color = isGood ? 'text-pink-400' : 'text-red-500';
          setRandomEvent({ msg, color, type: isGood ? 'flower' : 'tomato' });
          if(isGood) { setHypeMeter(h => Math.min(100, h + 15)); setConfetti(true); setTimeout(() => setConfetti(false), 2000); setCharacterMood('happy'); setTimeout(() => setCharacterMood('idle'), 3000); } 
          else { playSynthSound('pop', soundEnabled); setCharacterMood('scared'); setTimeout(() => setCharacterMood('idle'), 3000); }
          setTimeout(() => setRandomEvent(null), 2500);
      }
  };

  const startKura = () => { setGameState('KURA'); setKuraRolling(true); playSynthSound('roll', soundEnabled); setShowDiceModal(true); setTimeout(() => { const winnerId = Math.floor(Math.random() * 4); setCurrentTurn(winnerId); setKuraRolling(false); playSynthSound('success', soundEnabled); setTimeout(() => { setShowDiceModal(false); setGameState('ROLL'); addLog(lang === 'tr' ? `Sahne ışıkları ${TEAM_INFO[winnerId].name} üzerinde!` : `Spotlights on ${TEAM_INFO[winnerId].name}!`); }, 1500); }, 2500); };
  const askAICritic = async () => { if (!activeCard) return; setCriticLoading(true); setTimeout(() => { addLog(`🤖 ${UI[lang].aiComment}: "${TEAM_INFO[currentTeam.id].style[lang]}!"`); setCriticLoading(false); playSynthSound('click', soundEnabled); }, 1500); };
  
  const checkFinals = () => { 
      const finishers = teams.filter(t => t.pos >= 35); 
      if (finishers.length > 0) { 
          const sorted = [...teams].sort((a, b) => b.score - a.score); 
          setFinalists(sorted.slice(0, 2)); setDirectors(sorted.slice(2, 4)); setFinalTurnIndex(0); setCurrentTurn(sorted[0].id); setDraftMission(null); setGameState('FINALS_DIRECTOR_INPUT'); playSynthSound('success', soundEnabled);
      } else { nextTurn(); }
  };

  const generateDraftMission = async () => {
      if (!directorInput.trim()) return;
      playSynthSound('click', soundEnabled); setGameState('FINALS_GENERATING');
      
      const apiKey = ""; 
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
      const promptText = `Bir tiyatro yönetmeni olarak, oyuncuların sana verdiği şu fikri al: "${directorInput}". Sahnede oynanacak kısa, detaylı, komik ve absürt bir tiyatro görevine dönüştür. İngilizce çevirisini de yap.`;
      const schema = { type: "OBJECT", properties: { tr: { type: "STRING" }, en: { type: "STRING" } } };

      try {
          let resultData = null; let delay = 1000;
          for(let i=0; i<3; i++) {
              try {
                  const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: promptText }] }], generationConfig: { responseMimeType: "application/json", responseSchema: schema } }) });
                  const data = await response.json();
                  if(data.candidates) { resultData = JSON.parse(data.candidates[0].content.parts[0].text); break; }
              } catch(err) { if(i===2) throw err; await new Promise(r=>setTimeout(r,delay)); delay*=2; }
          }
          if(resultData && resultData.tr) { playSynthSound('success', soundEnabled); setDraftMission(resultData); setGameState('FINALS_DRAFT_REVIEW'); } else throw new Error("API failed");
      } catch(error) {
          playSynthSound('success', soundEnabled);
          const t = directorInput.trim();
          setDraftMission({ tr: `'${t}' temasını pandomim ve abartılı nidalarla seyirciye anlat.`, en: `Explain '${t}' using pantomime and loud noises.` });
          setGameState('FINALS_DRAFT_REVIEW');
      }
  };

  const approveAndGenerateOptions = async () => {
      playSynthSound('click', soundEnabled); setGameState('FINALS_GENERATING');
      const apiKey = "";
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
      const promptText = `Şu tiyatro görevini temel al: "${draftMission.tr}". Lütfen bu görevi 3 farklı sahne tarzına (DRAMATİK, ABSÜRT, SESSİZ) göre uyarla. Hem Türkçe (tr) hem İngilizce (en) üret. Replikler (quotes) kısmında 4 farklı karakter için 1. tekil şahıs ağzından kısa iç ses yaz: "0": İbiş, "1": Karagöz, "2": Shakespeare, "3": Aristofanes`;
      const schema = { type: "ARRAY", items: { type: "OBJECT", properties: { title: { type: "OBJECT", properties: { tr: {type:"STRING"}, en: {type:"STRING"} } }, mission: { type: "OBJECT", properties: { tr: {type:"STRING"}, en: {type:"STRING"} } }, desc: { type: "OBJECT", properties: { tr: {type:"STRING"}, en: {type:"STRING"} } }, quotes: { type: "OBJECT", properties: { "0": { type: "OBJECT", properties: { tr: {type:"STRING"}, en: {type:"STRING"} } }, "1": { type: "OBJECT", properties: { tr: {type:"STRING"}, en: {type:"STRING"} } }, "2": { type: "OBJECT", properties: { tr: {type:"STRING"}, en: {type:"STRING"} } }, "3": { type: "OBJECT", properties: { tr: {type:"STRING"}, en: {type:"STRING"} } } } } } } };

      try {
          let resultData = null; let delay = 1000;
          for(let i=0; i<3; i++) {
              try {
                  const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: promptText }] }], generationConfig: { responseMimeType: "application/json", responseSchema: schema } }) });
                  const data = await response.json();
                  if(data.candidates) { resultData = JSON.parse(data.candidates[0].content.parts[0].text); break; }
              } catch(err) { if(i===2) throw err; await new Promise(r=>setTimeout(r,delay)); delay*=2; }
          }
          if(resultData && resultData.length > 0) { playSynthSound('success', soundEnabled); setAiCards(resultData); setGameState('FINALS_SELECT_CARD'); } else throw new Error("API error");
      } catch(error) {
          playSynthSound('success', soundEnabled); setAiCards(generateMockCardsDual(directorInput.trim(), draftMission)); setGameState('FINALS_SELECT_CARD');
      }
  };

  const selectFinalCard = (selectedCard) => { playSynthSound('click', soundEnabled); setCustomFinalCard({ ...selectedCard, type: 'final' }); setGameState('FINALS_PREP'); };
  const castWinner = (team) => { playSynthSound('success', soundEnabled); setWinner(team); setGameState('END'); };

  const moveTokenStepByStep = async (teamId, startPos, targetPos) => { 
      setIsMoving(true); let current = startPos; 
      while (current < targetPos) { 
          current++; setTeams(prev => prev.map(t => t.id === teamId ? { ...t, pos: current } : t)); 
          playSynthSound('click', soundEnabled); await new Promise(resolve => setTimeout(resolve, 200)); 
      } 
      setIsMoving(false); 
      if (targetPos === 35) { checkFinals(); } else { 
          const type = BOARD_MAP[targetPos].type; 
          if(type === 'start') nextTurn(); else drawCard(type); 
      } 
  };
  
  const rollDice = () => {
    triggerAudienceEvent(); setShowDiceModal(true); setIsRollingDice(true); playSynthSound('roll', soundEnabled); setCharacterMood('idle');
    setTimeout(() => {
        const bonus = Math.floor(currentTeam.score / 5); const roll = Math.ceil(Math.random() * 6);
        setDiceValue(roll); setIsRollingDice(false); const totalMove = Math.min(roll + bonus, 12); 
        setTimeout(() => {
            setShowDiceModal(false); addLog(lang === 'tr' ? `${TEAM_INFO[currentTeam.id].name} ${roll} attı!` : `${TEAM_INFO[currentTeam.id].name} rolled ${roll}!`);
            let newPos = currentTeam.pos + totalMove; if (newPos >= 35) newPos = 35;
            moveTokenStepByStep(currentTeam.id, currentTeam.pos, newPos);
        }, 1000); 
    }, 1000);
  };

  const drawCard = (type) => { 
      setCardType(type); 
      if (type === 'easy' || type === 'bonus') setCharacterMood('happy'); 
      else if (type === 'medium') setCharacterMood('thinking'); 
      else if (type === 'hard' || type === 'final' || type === 'obstacle') { setCharacterMood('scared'); playSynthSound('scared', soundEnabled); } 
      else setCharacterMood('idle'); 
      
      let list = []; 
      if (type === 'easy') list = CARDS.EASY; else if (type === 'medium') list = CARDS.MEDIUM; else if (type === 'hard') list = CARDS.HARD; else if (type === 'final') list = CARDS.FINAL; else if (type === 'obstacle') list = CARDS.OBSTACLE; else if (type === 'bonus') list = CARDS.BONUS; 
      
      const cardData = list[Math.floor(Math.random() * list.length)]; 
      setActiveCard(cardData); setGameState('CARD'); 
  };
  
  const handleCardAction = () => { 
      playSynthSound('click', soundEnabled); 
      if (cardType === 'bonus') { 
          setTeams(prev => prev.map((t, i) => i === currentTurn ? { ...t, bonuses: [...t.bonuses, activeCard] } : t)); 
          addLog(lang === 'tr' ? `${TEAM_INFO[currentTeam.id].name} bonus kaptı!` : `${TEAM_INFO[currentTeam.id].name} got bonus!`); 
          setConfetti(true); setTimeout(() => setConfetti(false), 2000); setActiveCard(null); nextTurn(); 
      } else if (cardType === 'obstacle') { 
          if (activeCard.type === 'unmarked') setGameState('TARGET_OBSTACLE'); 
          else { setTeams(prev => prev.map((t, i) => i === currentTurn ? { ...t, activeObstacles: [...t.activeObstacles, activeCard] } : t)); setActiveCard(null); nextTurn(); } 
      } else { 
          setPerformanceTimer(cardType === 'easy' ? 60 : (cardType === 'final' ? 120 : 90)); 
          setGameState(cardType === 'final' ? 'FINALS_PLAY' : 'PERFORM'); setTimerKey(p => p + 1); 
      } 
  };
  
  const assignObstacleToRival = (targetId) => { setTeams(prev => prev.map(t => t.id === targetId ? { ...t, activeObstacles: [...t.activeObstacles, activeCard] } : t)); setActiveCard(null); nextTurn(); };
  const updateJuryScore = (delta) => { setJuryScore(p => Math.min(Math.max(p+delta, -5), 15)); playSynthSound('click', soundEnabled); };
  
  const submitManualVote = useCallback((score = juryScore) => { 
      playSynthSound('success', soundEnabled); 
      let finalScore = score; 
      if(voteData.roleplay) finalScore += 2; if(voteData.obstacleOvercome) finalScore += 2; if(voteData.fail) finalScore = -2; finalScore += (voteData.bonusScore || 0); 
      
      if (isGoldenMic) { 
          finalScore *= 2; addLog(UI[lang].goldenMic + "!"); setHypeMeter(0); playSynthSound('hype', soundEnabled); setConfetti(true); setTimeout(() => setConfetti(false), 3000); 
      } else { setHypeMeter(Math.min(100, hypeMeter + (finalScore > 5 ? 20 : 5))); } 
      
      if (finalScore > 3) setCharacterMood('happy'); else if (finalScore < 0) setCharacterMood('scared'); 
      
      const isFinal = gameState === 'FINALS_VOTE'; 
      const targetId = isFinal && finalists[finalTurnIndex] ? finalists[finalTurnIndex].id : currentTeam.id; 
      
      setTeams(prev => prev.map(t => t.id === targetId ? { ...t, score: t.score + finalScore, activeObstacles: [] } : t)); 
      setJuryScore(0); setVoteData({ roleplay: false, obstacleOvercome: false, fail: false, bonusScore: 0 }); 
      
      if (isFinal) { 
          if (finalTurnIndex === 0) { setFinalTurnIndex(1); setCurrentTurn(finalists[1].id); setGameState('FINALS_PREP'); } 
          else calculateWinner(); 
      } else { 
          setActiveCard(null); if (currentTeam.pos === 35) setTimeout(checkFinals, 100); else nextTurn(); 
      } 
  }, [gameState, juryScore, voteData, finalists, finalTurnIndex, currentTeam, soundEnabled, isGoldenMic, hypeMeter, lang]);
  
  const finishPerformance = () => {
      if (gameState === 'FINALS_PLAY') { if (finalTurnIndex === 0) setGameState('FINALS_TRANSITION'); else setGameState('FINALS_CASTING'); } 
      else setGameState('VOTE');
  };

  const startNextFinalist = () => { setFinalTurnIndex(1); setCurrentTurn(finalists[1].id); setGameState('FINALS_PREP'); playSynthSound('click', soundEnabled); };
  const nextTurn = () => { setGameState('ROLL'); setDiceValue(null); setCurrentTurn(prev => (prev + 1) % 4); setCharacterMood('idle'); };
  const prepareBonus = (bonusIndex) => setPlayingBonus(currentTeam.bonuses[bonusIndex]);
  const executeBonusPower = () => {
      setConfetti(true); setTimeout(() => setConfetti(false), 2000);
      if (playingBonus.effect === 'time') { setPerformanceTimer(p => p + 30); addLog(lang === 'tr' ? "+30 Saniye!" : "+30 Sec!"); } 
      else if (playingBonus.effect === 'score') { setVoteData(p => ({...p, bonusScore: (p.bonusScore || 0) + 2})); addLog(lang === 'tr' ? "Gizli +2 Puan!" : "Secret +2 Points!"); } 
      else { addLog(lang === 'tr' ? `${playingBonus.name} gücü!` : `${playingBonus.name} power!`); }
      setTeams(prev => prev.map(t => t.id === currentTeam.id ? { ...t, bonuses: t.bonuses.filter(b => b.id !== playingBonus.id) } : t));
      setPlayingBonus(null);
  };

  return (
    <div className="h-screen w-full font-sans flex flex-col overflow-hidden text-gray-100 bg-neutral-950 selection:bg-neon-pink selection:text-white relative">
      <style>{`
        /* MOBILE OPTIMIZATIONS */
        * { -webkit-tap-highlight-color: transparent; -webkit-touch-callout: none; -webkit-user-select: none; user-select: none; }
        textarea { -webkit-user-select: auto; user-select: auto; }
        body { overscroll-behavior-y: none; touch-action: pan-y; overflow: hidden; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        .text-neon-blue { color: #00f3ff; text-shadow: 0 0 10px rgba(0,243,255,0.7); }
        .border-neon-blue { border-color: #00f3ff; box-shadow: 0 0 10px rgba(0,243,255,0.3); }
        .bg-neon-blue { background-color: #00f3ff; box-shadow: 0 0 20px rgba(0,243,255,0.5); }
        .animate-pulse-fast { animation: pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-10px); } 100% { transform: translateY(0px); } }
        .animate-float { animation: float 6s ease-in-out infinite; }
        
        .scene { perspective: 600px; }
        .cube { position: relative; transform-style: preserve-3d; transition: transform 1s cubic-bezier(0.25, 1, 0.5, 1); }
        .cube__face { position: absolute; }
        .cube__face--1 { transform: rotateY(0deg) translateZ(48px); }
        .cube__face--2 { transform: rotateY(180deg) translateZ(48px); }
        .cube__face--3 { transform: rotateY(90deg) translateZ(48px); }
        .cube__face--4 { transform: rotateY(-90deg) translateZ(48px); }
        .cube__face--5 { transform: rotateX(90deg) translateZ(48px); }
        .cube__face--6 { transform: rotateX(-90deg) translateZ(48px); }
        .show-1 { transform: translateZ(-48px) rotateY(0deg); }
        .show-2 { transform: translateZ(-48px) rotateY(-180deg); }
        .show-3 { transform: translateZ(-48px) rotateY(-90deg); }
        .show-4 { transform: translateZ(-48px) rotateY(90deg); }
        .show-5 { transform: translateZ(-48px) rotateX(-90deg); }
        .show-6 { transform: translateZ(-48px) rotateX(90deg); }
        .rolling { animation: spinCube 0.5s infinite linear; }
        @keyframes spinCube { 0% { transform: translateZ(-48px) rotateX(0deg) rotateY(0deg); } 100% { transform: translateZ(-48px) rotateX(360deg) rotateY(360deg); } }
      `}</style>
      
      {confetti && <ConfettiExplosion />}
      {randomEvent && <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-[80] animate-bounce bg-black/80 px-6 py-2 rounded-full border border-white/20 backdrop-blur-md whitespace-nowrap"><span className={`text-lg font-black ${randomEvent.color} drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]`}>{randomEvent.msg}</span></div>}
      
      <div className="absolute inset-0 z-0 opacity-30 transition-opacity duration-1000" style={{backgroundImage: assets.boardBg ? `url(${assets.boardBg})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center'}}></div>
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-black via-transparent to-black/80 pointer-events-none"></div>

      {showDiceModal && <div className="fixed inset-0 bg-black/90 z-[80] flex items-center justify-center backdrop-blur-md"><div className="text-center scale-125">{gameState === 'KURA' ? <TeamDice3D winnerId={kuraRolling ? null : currentTurn} isRolling={kuraRolling} assets={assets} /> : <Dice3D value={isRollingDice ? null : (diceValue > 6 ? 6 : diceValue)} isRolling={isRollingDice} />}<div className="mt-8 text-xl font-black text-neon-blue animate-pulse tracking-widest">{kuraRolling ? UI[lang].drawingLots : UI[lang].rollingDice}</div></div></div>}
      
      {/* FLOATING HEADER (MOBILE) */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-black/50 border-b border-white/10 flex items-center justify-between px-3 z-40 backdrop-blur-lg">
          <div className="flex items-center gap-2">
              {assets.logo ? <img src={assets.logo} alt="Logo" className="h-8 w-auto object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"/> : <Theater size={24} className="text-yellow-500"/>}
              <span className="font-black text-lg tracking-[0.1em] text-white">IMPROV<span className="text-neon-blue text-[10px] align-top ml-1">9.8</span></span>
          </div>
          
          {/* COMPACT HYPE METER */}
          <div className="flex-1 max-w-[120px] mx-2 relative">
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden border border-gray-600 relative">
                  <div className={`h-full transition-all duration-700 ${isGoldenMic ? 'bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-300 animate-pulse-fast' : 'bg-gradient-to-r from-blue-900 to-blue-500'}`} style={{ width: `${hypeMeter}%` }}></div>
              </div>
              {isGoldenMic && <Flame size={16} className="absolute -right-2 -top-2 text-orange-500 animate-bounce drop-shadow-[0_0_5px_orange]" />}
          </div>
          
          <div className="flex items-center gap-2">
              <button onClick={triggerFinalTest} className="px-2 py-1 bg-red-600/80 text-white text-[10px] font-bold rounded">T</button>
              <button onClick={() => setSoundEnabled(!soundEnabled)} className="p-1.5 text-gray-300 hover:text-white transition bg-white/10 rounded-lg">
                  {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>
              <button onClick={() => setShowRules(true)} className="p-1.5 text-gray-300 hover:text-yellow-400 transition bg-white/10 rounded-lg"><HelpCircle size={16} /></button>
              <button onClick={() => setShowLogsMenu(true)} className="p-1.5 text-gray-300 hover:text-white transition bg-white/10 rounded-lg"><List size={16} /></button>
              <button onClick={() => setLang(l => l === 'tr' ? 'en' : 'tr')} className="p-1.5 text-[10px] font-bold text-white bg-white/10 rounded-lg">{lang === 'tr' ? 'EN' : 'TR'}</button>
          </div>
      </header>

      {/* HISTORY (LOGS) MODAL */}
      {showLogsMenu && (
         <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/80 backdrop-blur-sm" onClick={() => setShowLogsMenu(false)}>
             <div className="w-full h-[50vh] bg-gray-900 rounded-t-3xl border-t border-[#D4AF37]/30 p-4 shadow-2xl flex flex-col" onClick={e=>e.stopPropagation()}>
                 <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-2">
                     <h3 className="font-bold text-[#D4AF37] flex items-center gap-2"><History size={18}/> {UI[lang].logs}</h3>
                     <button onClick={() => setShowLogsMenu(false)} className="text-gray-400"><X size={20}/></button>
                 </div>
                 <div className="flex-1 overflow-y-auto text-xs font-mono space-y-2 no-scrollbar pb-safe">
                     {logs.map((l, i) => <div key={i} className="text-gray-300 border-l-2 border-neon-blue/50 pl-2 py-1">{l}</div>)}
                 </div>
             </div>
         </div>
      )}
      
      {/* MAIN SCROLLABLE BOARD AREA */}
      <main className="flex-1 overflow-y-auto no-scrollbar pt-20 pb-64 px-2 z-10 relative">
        {reactions.map(r => <FloatingReaction key={r.id} {...r} onComplete={removeReaction} />)}
        
        {gameState === 'INTRO' && (
            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/90 rounded-2xl h-full">
                <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-blue-400 to-purple-600 animate-pulse mb-2 text-center leading-none">IMPROV<br/><span className="text-3xl text-white">MOBILE</span></h1>
                <button onClick={startKura} className="mt-12 px-10 py-4 bg-white text-black font-black text-xl rounded-full shadow-[0_0_30px_rgba(255,255,255,0.4)] active:scale-95 transition">{UI[lang].start}</button>
            </div>
        )}
        
        {gameState !== 'INTRO' && (
            <div className="grid grid-cols-4 gap-2 max-w-lg mx-auto">
                {BOARD_MAP.map((sq, i) => { 
                    let baseStyle = "bg-gray-900/60 border-gray-700/50"; let glow = ""; let icon = null; 
                    if(sq.type==='easy') { baseStyle="bg-green-900/40 border-green-500/30"; glow="shadow-[0_0_10px_rgba(34,197,94,0.1)]"; } 
                    if(sq.type==='medium') { baseStyle="bg-yellow-900/40 border-yellow-500/30"; glow="shadow-[0_0_10px_rgba(234,179,8,0.1)]"; } 
                    if(sq.type==='hard') { baseStyle="bg-red-900/40 border-red-500/30"; glow="shadow-[0_0_10px_rgba(239,68,68,0.1)]"; } 
                    if(sq.type==='final') { baseStyle="bg-purple-900/60 border-purple-500"; glow="shadow-[0_0_20px_rgba(168,85,247,0.4)]"; icon=<Crown size={14} className="text-purple-300"/>; } 
                    if(sq.type==='obstacle') { baseStyle="bg-gray-800/80 border-gray-600"; icon=<Skull size={12} className="text-gray-400"/>; } 
                    if(sq.type==='bonus') { baseStyle="bg-blue-900/50 border-blue-400/50"; icon=<Sparkles size={12} className="text-blue-300"/>; } 
                    const playersHere = teams.filter(t => t.pos === i);
                    
                    return (
                        <div key={i} className={`aspect-square rounded-xl border ${baseStyle} relative flex flex-col items-center justify-center transition-all duration-300 ${glow} backdrop-blur-sm overflow-hidden`}>
                            <span className="absolute top-1 left-1 text-[8px] uppercase font-bold text-white/40">{UI[lang][sq.type] || sq.type}</span>
                            <span className="absolute top-1 right-1 text-[8px] font-mono opacity-30">{i}</span>
                            {icon && <div className="absolute bottom-1 right-1 opacity-40">{icon}</div>}
                            
                            <div className="absolute inset-0 flex items-center justify-center p-1 pointer-events-none z-20 mt-2">
                                <div className={`w-full h-full flex flex-wrap items-center justify-center gap-0.5`}>
                                    {playersHere.map((p) => (
                                        <div key={p.id} className={`relative w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-white shadow-lg ${p.color} flex items-center justify-center overflow-hidden bg-black transition-all duration-300 ${currentTeam.id === p.id ? 'scale-125 ring-2 ring-white/50 animate-pulse z-30' : 'z-10'}`}>
                                            {assets[`team${p.id}`] ? <AssetDisplay src={assets[`team${p.id}`]} className="w-full h-full object-cover object-top" alt={`P${p.id}`} /> : <span className="text-[8px]">{p.icon}</span>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        )}
      </main>

      {/* BOTTOM ACTION SHEET (MOBILE OPTIMIZED) */}
      {gameState !== 'END' && gameState !== 'INTRO' && gameState !== 'KURA' && !gameState.startsWith('FINALS_') && (
          <footer className="fixed bottom-0 left-0 w-full bg-black/90 backdrop-blur-xl border-t border-white/10 rounded-t-3xl z-40 p-4 pb-6 flex flex-col shadow-[0_-10px_30px_rgba(0,0,0,0.6)]">
              
              {/* CURRENT PLAYER INFO */}
              <div className="flex items-center gap-3 mb-4">
                  <div className={`w-14 h-14 rounded-full border-2 ${currentTeam.border} overflow-hidden bg-black shrink-0 relative shadow-[0_0_15px_rgba(0,0,0,0.8)]`}>
                      <AssetDisplay src={getCurrentCharacterAsset()} className="w-full h-full object-cover object-top" />
                      <div className="absolute top-0 right-0 text-sm animate-bounce drop-shadow-md">
                          {characterMood === 'happy' && '😂'}{characterMood === 'thinking' && '🤔'}{characterMood === 'scared' && '😱'}
                      </div>
                  </div>
                  <div className="flex flex-col flex-1">
                      <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">{UI[lang].onStageNow}</span>
                      <span className={`font-black text-xl leading-none ${currentTeam.text}`}>{TEAM_INFO[currentTeam.id].name}</span>
                  </div>
                  <div className="text-right">
                      <div className="text-[10px] text-gray-400 uppercase">Puan</div>
                      <div className="font-mono font-bold text-2xl text-yellow-500 leading-none">{currentTeam.score}</div>
                  </div>
              </div>

              {/* ACTIVE OBSTACLE WARNING */}
              {currentTeam.activeObstacles.length > 0 && (
                  <div className="w-full p-2 mb-3 bg-red-500/20 border border-red-500/50 rounded-lg flex gap-2 items-center animate-pulse">
                      <AlertTriangle className="text-red-500 shrink-0" size={16}/>
                      <div className="text-xs text-white line-clamp-1">{currentTeam.activeObstacles[0].text[lang]}</div>
                  </div>
              )}

              {/* CONTEXTUAL ACTION AREA */}
              <div className="w-full flex-1 flex flex-col justify-end">
                  {gameState === 'ROLL' && (
                      <button onClick={rollDice} className="w-full py-4 bg-gradient-to-r from-neon-blue to-blue-600 text-white text-2xl font-black rounded-2xl shadow-[0_0_20px_rgba(0,243,255,0.4)] flex items-center justify-center gap-2 active:scale-95 transition-all uppercase tracking-widest">
                          <Dices size={28} /> {UI[lang].rollDice}
                      </button>
                  )}
                  
                  {gameState === 'MOVING' && <div className="text-neon-blue font-black animate-pulse text-center text-xl tracking-[0.2em] py-4">{UI[lang].enteringStage}</div>}
                  
                  {gameState === 'TARGET_OBSTACLE' && (
                      <div className="w-full overflow-x-auto flex gap-2 no-scrollbar">
                          {teams.filter(t => t.id !== currentTeam.id).map(t => (
                              <button key={t.id} onClick={() => assignObstacleToRival(t.id)} className={`flex-1 min-w-[100px] p-3 rounded-xl border border-gray-700 bg-gray-800 flex flex-col items-center gap-1 active:bg-red-900/40 active:border-red-500 transition`}>
                                  <ShieldAlert size={16} className="text-red-500"/>
                                  <span className="text-xs font-bold whitespace-nowrap">{TEAM_INFO[t.id].name}</span>
                              </button>
                          ))}
                      </div>
                  )}
                  
                  {gameState === 'PERFORM' && (
                      <div className="w-full flex flex-col gap-3">
                          <div className="flex justify-between items-end px-2">
                              <div className="flex gap-2">
                                  <button onClick={() => addReaction('👏')} className="w-10 h-10 rounded-full bg-green-600/20 border border-green-500/50 flex items-center justify-center text-lg active:bg-green-500/40">👏</button>
                                  <button onClick={() => addReaction('😂')} className="w-10 h-10 rounded-full bg-yellow-600/20 border border-yellow-500/50 flex items-center justify-center text-lg active:bg-yellow-500/40">😂</button>
                              </div>
                              <Timer key={timerKey} duration={performanceTimer} onFinish={finishPerformance} soundEnabled={soundEnabled} />
                          </div>
                          
                          {currentTeam.bonuses.length > 0 && (
                              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                                  {currentTeam.bonuses.map((b, i) => (
                                      <button key={i} onClick={() => prepareBonus(i)} className="px-3 py-2 bg-purple-900 border border-purple-500/80 rounded-lg font-bold text-[10px] text-white whitespace-nowrap flex items-center gap-1 active:scale-95">
                                          <Sparkles size={12}/> {b.name}
                                      </button>
                                  ))}
                              </div>
                          )}
                          <button onClick={finishPerformance} className="w-full py-3 bg-white/10 text-white rounded-xl font-bold uppercase tracking-widest active:bg-white/20 transition">{UI[lang].finishPerf}</button>
                      </div>
                  )}
                  
                  {gameState === 'VOTE' && (
                      <div className="w-full flex flex-col gap-3">
                          <div className="flex gap-2 text-center">
                              <button onClick={() => setVoteData(p => ({...p, roleplay: !p.roleplay}))} className={`flex-1 py-2 rounded-lg text-[10px] font-bold border transition ${voteData.roleplay ? 'bg-blue-600 border-blue-400 text-white shadow-[0_0_10px_blue]' : 'border-gray-700 text-gray-400'}`}>{UI[lang].role}</button>
                              <button onClick={() => setVoteData(p => ({...p, obstacleOvercome: !p.obstacleOvercome}))} className={`flex-1 py-2 rounded-lg text-[10px] font-bold border transition ${voteData.obstacleOvercome ? 'bg-green-600 border-green-400 text-white shadow-[0_0_10px_green]' : 'border-gray-700 text-gray-400'}`}>{UI[lang].obstacleBtn}</button>
                              <button onClick={() => setVoteData(p => ({...p, fail: !p.fail}))} className={`flex-1 py-2 rounded-lg text-[10px] font-bold border transition ${voteData.fail ? 'bg-red-600 border-red-400 text-white shadow-[0_0_10px_red]' : 'border-gray-700 text-gray-400'}`}>{UI[lang].fail}</button>
                          </div>
                          <div className="flex justify-between items-center px-4">
                              <button onClick={() => updateJuryScore(-1)} className="w-10 h-10 rounded-full border border-red-500/50 text-red-500 flex items-center justify-center active:bg-red-500/20"><Minus size={20}/></button>
                              <span className="text-5xl font-mono font-bold text-white">{juryScore}</span>
                              <button onClick={() => updateJuryScore(1)} className="w-10 h-10 rounded-full border border-green-500/50 text-green-500 flex items-center justify-center active:bg-green-500/20"><Plus size={20}/></button>
                          </div>
                          <div className="flex gap-2">
                              <button onClick={askAICritic} className="w-12 bg-purple-900/50 border border-purple-500 text-purple-300 rounded-xl flex items-center justify-center active:bg-purple-800" disabled={criticLoading}><Bot size={20}/></button>
                              <button onClick={() => submitManualVote()} className="flex-1 py-3 bg-white text-black font-black text-sm rounded-xl shadow-[0_0_15px_rgba(255,255,255,0.4)] active:scale-95 transition uppercase tracking-widest">{UI[lang].confirmScore}</button>
                          </div>
                      </div>
                  )}
              </div>
          </footer>
      )}

      {/* FINALS PLAY PANEL (MOBILE OPTIMIZED) */}
      {gameState === 'FINALS_PLAY' && (
          <footer className="fixed bottom-0 left-0 w-full bg-black/95 backdrop-blur-xl border-t-2 border-yellow-500 rounded-t-3xl z-40 p-4 pb-6 flex flex-col shadow-[0_-10px_30px_rgba(250,204,21,0.3)]">
              <div className="flex items-center gap-3 mb-4">
                  <div className={`w-14 h-14 rounded-full border-2 border-yellow-400 overflow-hidden bg-black shrink-0 relative shadow-[0_0_15px_rgba(250,204,21,0.5)]`}>
                      <AssetDisplay src={assets[`team${currentTeam.id}_scared`]} className="w-full h-full object-cover object-top" />
                  </div>
                  <div className="flex flex-col flex-1">
                      <span className="text-[10px] text-yellow-400 uppercase font-bold tracking-wider">FİNAL PERFORMANSI</span>
                      <span className={`font-black text-xl leading-none text-white`}>{TEAM_INFO[currentTeam.id].name}</span>
                  </div>
              </div>
              <div className="flex justify-between items-center bg-gray-900/50 p-4 rounded-xl border border-yellow-500/30">
                  <div className="text-xs text-yellow-500 uppercase tracking-widest">{UI[lang].time}</div>
                  <Timer key={timerKey} duration={performanceTimer} onFinish={finishPerformance} soundEnabled={soundEnabled} />
              </div>
              <button onClick={finishPerformance} className="w-full mt-4 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-black rounded-xl font-black text-lg uppercase tracking-widest active:scale-95 shadow-[0_0_15px_rgba(250,204,21,0.4)]">{UI[lang].finishPerf}</button>
          </footer>
      )}

      {/* FULL SCREEN OVERLAYS (MODALS) */}
      
      {/* FINAL STAGE: DIRECTOR INPUT */}
      {gameState === 'FINALS_DIRECTOR_INPUT' && directors.length > 0 && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/95 backdrop-blur-md px-4 pb-10">
               <Clapperboard size={64} className="text-yellow-400 mb-4 animate-pulse" />
               <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 mb-2 tracking-widest text-center">{UI[lang].directorPromptTitle}</h2>
               <p className="text-sm text-gray-300 mb-6 text-center max-w-sm">{UI[lang].directorPromptDesc} <span className="text-yellow-400 font-bold block mt-1">{directors.map(d => TEAM_INFO[d.id].name).join(' & ')}</span></p>
               <textarea value={directorInput} onChange={e => setDirectorInput(e.target.value)} placeholder="Örn: Uzaylı İstilası..." className="w-full max-w-sm h-28 bg-gray-900 border-2 border-yellow-500/50 rounded-xl p-4 text-white text-base focus:outline-none focus:border-yellow-400 mb-6 resize-none" />
               <button onClick={generateDraftMission} disabled={!directorInput.trim()} className="w-full max-w-sm py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-black text-lg rounded-full active:scale-95 disabled:opacity-50 transition">{UI[lang].generateDraft}</button>
          </div>
      )}

      {/* FINAL STAGE: DRAFT REVIEW */}
      {gameState === 'FINALS_DRAFT_REVIEW' && draftMission && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/95 backdrop-blur-md px-4">
               <Lightbulb size={50} className="text-yellow-400 mb-4 animate-bounce" />
               <h2 className="text-2xl font-black text-yellow-400 mb-6 tracking-widest text-center">{UI[lang].aiDrafted}</h2>
               <div className="bg-gray-900 border border-yellow-400/50 p-4 rounded-xl w-full max-w-sm mb-6 max-h-[40vh] overflow-y-auto">
                   <p className="text-white text-sm leading-relaxed italic text-center">"{draftMission[lang]}"</p>
               </div>
               <div className="flex gap-3 w-full max-w-sm">
                   <button onClick={generateDraftMission} className="p-4 bg-gray-800 text-white rounded-xl active:bg-gray-700 flex items-center justify-center"><RefreshCw size={20}/></button>
                   <button onClick={approveAndGenerateOptions} className="flex-1 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-black text-sm rounded-xl active:scale-95">{UI[lang].createAsIs}</button>
               </div>
          </div>
      )}

      {/* FINAL STAGE: AI GENERATING */}
      {gameState === 'FINALS_GENERATING' && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/95 backdrop-blur-md">
               <Bot size={64} className="text-neon-blue mb-4 animate-bounce" />
               <h2 className="text-2xl font-black text-neon-blue tracking-widest animate-pulse">{draftMission ? UI[lang].generatingOptions : UI[lang].generatingDraft}</h2>
          </div>
      )}

      {/* FINAL STAGE: SELECT CARD */}
      {gameState === 'FINALS_SELECT_CARD' && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-start bg-black/95 backdrop-blur-md px-4 py-8 overflow-y-auto no-scrollbar">
               <h2 className="text-2xl font-black text-neon-blue mb-6 tracking-widest text-center sticky top-0 bg-black/95 py-2 w-full z-10">{UI[lang].selectAICard}</h2>
               <div className="flex flex-col gap-4 w-full max-w-sm pb-8">
                   {aiCards.map((c, idx) => (
                       <div key={idx} onClick={() => selectFinalCard(c)} className="bg-gray-900 border border-yellow-500/50 rounded-2xl p-5 active:scale-95 transition-all shadow-[0_0_10px_rgba(250,204,21,0.2)] flex flex-col items-center text-center">
                           <h3 className="text-lg font-bold text-yellow-400 mb-2">{c.title[lang]}</h3>
                           <p className="text-white text-sm mb-3 flex-1">"{c.mission[lang]}"</p>
                           <p className="text-[10px] text-gray-400 italic border-t border-gray-700 pt-2 w-full">{c.desc[lang]}</p>
                       </div>
                   ))}
               </div>
          </div>
      )}

      {/* FINAL STAGE: TRANSITION */}
      {gameState === 'FINALS_TRANSITION' && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/95 backdrop-blur-md px-4 text-center">
               <h2 className="text-3xl font-black text-white mb-6">{UI[lang].transitionWait}</h2>
               <div className="w-40 h-40 rounded-full border-4 border-yellow-400 mb-8 overflow-hidden bg-black shadow-[0_0_30px_yellow]">
                   <AssetDisplay src={assets[`team${finalists[1].id}_idle`]} className="w-full h-full object-cover object-top" />
               </div>
               <button onClick={startNextFinalist} className="w-full max-w-xs py-4 bg-white text-black font-black text-lg rounded-full active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.4)]">
                   {UI[lang].startNext} ({TEAM_INFO[finalists[1].id].name})
               </button>
          </div>
      )}

      {/* FINAL STAGE: CASTING */}
      {gameState === 'FINALS_CASTING' && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/95 backdrop-blur-md px-4 py-8 overflow-y-auto no-scrollbar">
               <Star size={60} className="text-yellow-400 mb-4 animate-spin-slow" />
               <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 mb-1 tracking-widest text-center">{UI[lang].auditionComplete}</h2>
               <p className="text-sm text-gray-300 mb-8">{UI[lang].whoGetsRole}</p>
               
               <div className="flex flex-col gap-6 w-full max-w-sm">
                    <button onClick={() => castWinner(finalists[0])} className="w-full p-4 rounded-2xl border-2 border-gray-600 active:border-yellow-400 bg-gray-900 flex items-center gap-4 transition-all">
                        <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 bg-black">
                            <AssetDisplay src={assets[`team${finalists[0].id}_happy`]} className="w-full h-full object-cover object-top" />
                        </div>
                        <div className="flex-1 text-left">
                            <h3 className="text-xl font-bold text-white">{TEAM_INFO[finalists[0].id].name}</h3>
                            <span className="text-xs text-yellow-500 font-bold">{UI[lang].castWinner}</span>
                        </div>
                    </button>
                    
                    <div className="text-2xl font-black text-red-500 italic text-center">VS</div>
                    
                    <button onClick={() => castWinner(finalists[1])} className="w-full p-4 rounded-2xl border-2 border-gray-600 active:border-yellow-400 bg-gray-900 flex items-center gap-4 transition-all">
                        <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 bg-black">
                            <AssetDisplay src={assets[`team${finalists[1].id}_happy`]} className="w-full h-full object-cover object-top" />
                        </div>
                        <div className="flex-1 text-left">
                            <h3 className="text-xl font-bold text-white">{TEAM_INFO[finalists[1].id].name}</h3>
                            <span className="text-xs text-yellow-500 font-bold">{UI[lang].castWinner}</span>
                        </div>
                    </button>
               </div>
          </div>
      )}

      {/* END SCREEN */}
      {gameState === 'END' && winner && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-yellow-900 to-black px-4">
               <ConfettiExplosion />
               <Trophy size={80} className="text-yellow-400 mb-4 drop-shadow-[0_0_20px_rgba(250,204,21,1)] animate-bounce" />
               <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600 mb-4 tracking-tighter text-center">{UI[lang].champion}</h1>
               
               <div className="relative mb-6">
                   <div className="w-48 h-48 rounded-full border-4 border-yellow-400 shadow-[0_0_30px_yellow] overflow-hidden bg-black">
                       <AssetDisplay src={assets[`team${winner.id}_happy`]} className="w-full h-full object-cover object-top" />
                   </div>
                   <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-6 py-1 rounded-full font-black text-xl whitespace-nowrap shadow-lg">
                       {TEAM_INFO[winner.id].name}
                   </div>
               </div>
               
               <p className="text-xl text-yellow-200 mb-10 font-bold">{UI[lang].finalScore} <span className="text-white text-3xl">{winner.score}</span></p>
               
               <button onClick={resetGame} className="px-8 py-4 w-full max-w-xs bg-white text-black font-black text-sm uppercase tracking-widest rounded-xl active:scale-95 transition flex items-center justify-center gap-2">
                   <RefreshCw size={20} /> {UI[lang].playAgain}
               </button>
          </div>
      )}

      {/* KART ÇEKME EKRANI */}
      {gameState === 'CARD' && activeCard && <CardDisplay card={activeCard} type={cardType} mode="draw" onAction={handleCardAction} assets={assets} currentTeamId={currentTeam.id} lang={lang} />}
      
      {/* FİNAL YZ KART EKRANI */}
      {gameState === 'FINALS_PREP' && customFinalCard && <CardDisplay card={customFinalCard} type="final" mode="draw" onAction={() => { playSynthSound('click', soundEnabled); setPerformanceTimer(120); setGameState('FINALS_PLAY'); setTimerKey(k=>k+1); }} assets={assets} currentTeamId={currentTeam.id} lang={lang} />}

      {/* BONUS OYNAMA EKRANI */}
      {playingBonus && <CardDisplay card={playingBonus} type="bonus" mode="play" onAction={executeBonusPower} assets={assets} currentTeamId={currentTeam.id} lang={lang} />}
      
      {/* KURALLAR MODALI */}
      {showRules && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/90 backdrop-blur-md" onClick={() => setShowRules(false)}>
              <div className="bg-gray-900 border-t-2 border-[#D4AF37] rounded-t-3xl w-full p-6 pb-safe shadow-[0_-10px_40px_rgba(212,175,55,0.2)] max-h-[85vh] flex flex-col" onClick={e=>e.stopPropagation()}>
                  <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-black text-[#D4AF37] font-serif tracking-widest">{UI[lang].rulesTitle}</h2>
                      <button onClick={() => setShowRules(false)} className="text-gray-400 p-2 bg-black/50 rounded-full"><X size={20}/></button>
                  </div>
                  
                  <div className="space-y-3 overflow-y-auto no-scrollbar flex-1 pb-4">
                      {UI[lang].rulesContent.map((rule, idx) => (
                          <div key={idx} className="bg-black/50 border border-white/10 p-4 rounded-xl">
                              <h3 className="text-base font-bold text-white mb-1">{rule.title}</h3>
                              <p className="text-gray-300 text-xs leading-relaxed">{rule.text}</p>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}

// Mobile optimized Timer
const Timer = ({ duration, onFinish, soundEnabled }) => {
    const [timeLeft, setTimeLeft] = useState(duration);
    useEffect(() => { setTimeLeft(duration); }, [duration]);
    useEffect(() => {
        if (timeLeft <= 0) { if (duration > 0) { playSynthSound('alarm', soundEnabled); onFinish(); } return; }
        const id = setInterval(() => setTimeLeft(t => t - 1), 1000); return () => clearInterval(id);
    }, [timeLeft, onFinish, duration, soundEnabled]);
    return <div className="text-4xl font-mono font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] tracking-wider">{Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</div>;
};
