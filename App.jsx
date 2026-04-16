import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Dices, Trophy, Star, ShieldAlert, Sparkles, Skull, Theater, 
  AlertTriangle, X, Volume2, VolumeX, RefreshCw, History, Bot, Zap, Flame, Crown, 
  Ghost, Smartphone, Bird, Thermometer, Apple, HelpCircle, Music4, List, Plus, Minus, Clapperboard, Lightbulb, Drama, User, Users, Home, Share2, Copy
} from 'lucide-react';

// --- FIREBASE IMPORTS FOR MULTIPLAYER ---
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, updateDoc, onSnapshot } from 'firebase/firestore';

// --- FIREBASE SETUP ---
let app, auth, db, appId;
try {
    const hasCanvasConfig = typeof __firebase_config !== 'undefined' && __firebase_config && Object.keys(JSON.parse(__firebase_config)).length > 0;
    const firebaseConfig = hasCanvasConfig ? JSON.parse(__firebase_config) : {
        apiKey: "AIzaSy" + "BlQCUn6Uv1HXk1lrPQx92-vZtEA_KRehQ",
        authDomain: "dogacla-ca144.firebaseapp.com",
        projectId: "dogacla-ca144",
        storageBucket: "dogacla-ca144.firebasestorage.app",
        messagingSenderId: "29430014172",
        appId: "1:29430014172:web:15b8a5ef2f3df11e5b1419"
    };
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    appId = (typeof __app_id !== 'undefined' && __app_id) ? __app_id : "dogacla-ca144"; 
} catch(e) {
    console.error("Firebase Başlatılamadı:", e);
}

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
          osc.type = 'triangle'; 
          osc.frequency.setValueAtTime(100, now); 
          osc.frequency.linearRampToValueAtTime(700, now + 3.0); 
          gain.gain.setValueAtTime(0.2, now); 
          gain.gain.linearRampToValueAtTime(0, now + 3.0);
          osc.start(now); osc.stop(now + 3.0);
      } else if (type === 'curtain') {
          const bufferSize = ctx.sampleRate * 1.5;
          const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
          const data = buffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) { data[i] = Math.random() * 2 - 1; }
          const noise = ctx.createBufferSource(); noise.buffer = buffer; const noiseGain = ctx.createGain(); noise.connect(noiseGain); noiseGain.connect(ctx.destination);
          noiseGain.gain.setValueAtTime(0.05, now); noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 1.5); noise.start(now);
      } else if (type === 'click') {
          osc.type = 'sine'; osc.frequency.setValueAtTime(800, now); gain.gain.setValueAtTime(0.05, now); osc.start(now); osc.stop(now + 0.05);
      } else if (type === 'success') {
          const playNote = (f, t, dur) => { const o=ctx.createOscillator(); const g=ctx.createGain(); o.type='square'; o.connect(g); g.connect(ctx.destination); o.frequency.value=f; g.gain.setValueAtTime(0.05, now+t); g.gain.exponentialRampToValueAtTime(0.001, now+t+dur); o.start(now+t); o.stop(now+t+dur); };
          playNote(523.25, 0, 0.2); playNote(659.25, 0.1, 0.2); playNote(783.99, 0.2, 0.4); playNote(1046.50, 0.4, 0.6);
      } else if (type === 'scared') {
           osc.type = 'sawtooth'; osc.frequency.setValueAtTime(100, now); osc.frequency.linearRampToValueAtTime(50, now + 0.5); gain.gain.setValueAtTime(0.1, now); gain.gain.linearRampToValueAtTime(0, now + 0.5); osc.start(now); osc.stop(now + 0.5);
      } else if (type === 'pop') {
           osc.type = 'triangle'; osc.frequency.setValueAtTime(400, now); gain.gain.setValueAtTime(0.1, now); osc.start(now); osc.stop(now + 0.1);
      }
  } catch (e) { console.error(e); }
};

// --- HELPER FUNCTIONS ---
const getLocalizedText = (obj, lang) => {
    if (!obj) return "";
    if (typeof obj === 'string') return obj;
    return obj[lang] || obj.tr || obj.en || "";
};

// --- DICTIONARY & DATA ---
const getDynamicQuotesDual = (prompt, type) => {
    const p = prompt.toLowerCase();
    if (type === 'DRAMATIC') return { "0": { tr: `Aman efendim! Bu '${p}' beni bitirecek. Sahnede ağlayıp sızlayacağım!` }, "1": { tr: `Bana dram deme ulan! '${p}' yüzünden sinir küpüne döndüm, bağıracağım!` }, "2": { tr: `Ah, '${p}'... Acımı tüm salona şiirsel bir dille haykıracağım.` }, "3": { tr: `Trajedi mi? '${p}' ile deliliğe sürükleniyormuş gibi yapacağım.` } };
    else if (type === 'ABSURD') return { "0": { tr: `Maskaralığım şahane! '${p}' için takla atacağım!` }, "1": { tr: `Hay bin köfte! '${p}' diye diye kaşımı gözümü oynatacağım!` }, "2": { tr: `Ne yapsam boş! '${p}' için komik durumlara düşeceğim.` }, "3": { tr: `Şu düştüğüm hale bak! Alaycı bir kahkaha atacağım.` } };
    else return { "0": { tr: `Sus pus oldum! '${p}' derdimi abartılı el kol hareketleriyle anlatacağım.` }, "1": { tr: `Dilimi yuttum! '${p}' olayını görünmez duvara çarparak oynayacağım.` }, "2": { tr: `Kelimeler kifayetsiz... '${p}' acısını yere yığılarak göstereceğim.` }, "3": { tr: `En keskin hiciv... Hiç konuşmadan '${p}' konusunu aşağılayacağım.` } };
};

const generateMockCardsDual = (prompt, draftMissionText) => {
    const p = prompt.toUpperCase();
    return [
        { title: { tr: "DRAMATİK " + p }, mission: { tr: getLocalizedText(draftMissionText, 'tr') }, desc: { tr: "En inandırıcı dramı yapan kazanır." }, quotes: getDynamicQuotesDual(prompt, 'DRAMATIC') },
        { title: { tr: "ABSÜRT " + p }, mission: { tr: getLocalizedText(draftMissionText, 'tr') }, desc: { tr: "Seyirciyi en çok güldüren kazanır." }, quotes: getDynamicQuotesDual(prompt, 'ABSURD') },
        { title: { tr: "SESSİZ " + p }, mission: { tr: getLocalizedText(draftMissionText, 'tr') }, desc: { tr: "En iyi fiziksel performansı sergileyen kazanır." }, quotes: getDynamicQuotesDual(prompt, 'SILENT') }
    ];
};

const UI = {
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
            { title: "🎬 Büyük Final", text: "35'e ulaşıldığında en iyi 2 takım finale çıkar. Kaybedenler finali yazar!" },
            { title: "🌐 Çok Oyunculu", text: "Kurduğun oda kodunu arkadaşlarına ver, aynı oyuna aynı anda telefonlarından bağlansınlar!" }
        ],
        close: "KAPAT"
    }
};

const TEAM_INFO = {
    0: { name: 'İBİŞ', desc: { tr: 'Kurnaz & Esprili' }, longDesc: { tr: 'Geleneksel bir şakacı. Kelime sihirbazı.' }, style: { tr: 'Mizahi' } },
    1: { name: 'KARAGÖZ', desc: { tr: 'Fiziksel & Dobra' }, longDesc: { tr: 'Lafını esirgemez, dobra dobra konuşur.' }, style: { tr: 'Fiziksel' } },
    2: { name: 'SHAKESPEARE', desc: { tr: 'Dramatik & Şiirsel' }, longDesc: { tr: 'Sahnedeki en ciddi ve trajik aktör.' }, style: { tr: 'Trajik' } },
    3: { name: 'ARİSTOFANES', desc: { tr: 'Hicivli & Zeki' }, longDesc: { tr: 'Olaylara her zaman yukarıdan bakar ve alay eder.' }, style: { tr: 'İronik' } }
};

// --- MOBILE OPTIMIZED ASSET DISPLAY ---
const AssetDisplay = ({ src, className = '', style = {}, alt = '' }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    
    if (!src) return <div className={className} style={{...style, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent'}}>{alt}</div>;
    
    const isVideo = typeof src === 'string' && (src.toLowerCase().endsWith('.mp4') || src.toLowerCase().endsWith('.webm'));
    
    if (isVideo) {
        const hasBgClass = className && className.includes('bg-');
        return (
            <video 
                key={src} 
                src={src} 
                className={`${className} ${hasBgClass ? '' : 'bg-transparent'} transition-opacity duration-700 ease-in`} 
                style={{...style, pointerEvents: 'none', opacity: isLoaded ? 1 : 0}} 
                autoPlay loop muted playsInline webkit-playsinline="true" disablePictureInPicture preload="auto"
                onCanPlayThrough={() => setIsLoaded(true)}
                onLoadedData={() => setIsLoaded(true)}
            />
        );
    }
    return (
        <img 
            src={src} 
            className={`${className} object-cover transition-opacity duration-700 ease-in`} 
            style={{...style, opacity: isLoaded ? 1 : 0}} 
            alt={alt} 
            onLoad={() => setIsLoaded(true)} 
        />
    );
};

const getCardIcon = (text, defaultIcon) => {
    if (!text) return defaultIcon;
    const lowerText = text.toLowerCase();
    if (lowerText.includes("king") || lowerText.includes("kral") || lowerText.includes("crown")) return <Crown size={36} className="text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]" />;
    if (lowerText.includes("phone") || lowerText.includes("sinyal") || lowerText.includes("call")) return <Smartphone size={36} className="text-blue-400 drop-shadow-[0_0_10px_rgba(96,165,250,0.8)]" />;
    if (lowerText.includes("chicken") || lowerText.includes("tavuk")) return <Bird size={36} className="text-orange-400 drop-shadow-[0_0_10px_rgba(251,146,60,0.8)]" />;
    if (lowerText.includes("cold") || lowerText.includes("soğuk") || lowerText.includes("freeze")) return <Thermometer size={36} className="text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]" />;
    if (lowerText.includes("apple") || lowerText.includes("elma") || lowerText.includes("eat")) return <Apple size={36} className="text-red-400 drop-shadow-[0_0_10px_rgba(248,113,113,0.8)]" />;
    if (lowerText.includes("song") || lowerText.includes("şarkı") || lowerText.includes("music")) return <Music4 size={36} className="text-purple-400 drop-shadow-[0_0_10px_rgba(192,132,252,0.8)]" />;
    return defaultIcon;
};

// --- GAME ASSETS ---
const GAME_ASSETS = {
    bg: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/arkplan.png",
    logo: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/dogacla_logsu.png",
    music_bg: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/The_Clockwork_Caper.mp3", 
    team0: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/ibi%C5%9F.png", 
    team1: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/karagoz.png",
    team2: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/sheashper.png",
    team3: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/aristopahnes.png",
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
    bonus_madox: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/madox_karti.mp4",
    bonus_dputiyat: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/dputiyat_karti.mp4",
    bonus_gulec: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/Gulec_karti.mp4",
    bonus_kubi: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/kubi_karti.mp4",
    bonus_kubo: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/kubo_karti.mp4",
    bonus_mali: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/Mali_karti.mp4",
    bonus_sadic: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/sadic_karti.mp4",
    bonus_tubi: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/tubi_karti.mp4",
    bonus_cihad: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/cicu_karti.mp4", 
};

const INITIAL_TEAMS = [
  { id: 0, color: 'bg-orange-500', border: 'border-orange-500', text: 'text-orange-500', icon: '🤡', score: 0, pos: 0, bonuses: [], heldObstacles: [], activeObstacles: [] },
  { id: 1, color: 'bg-red-600', border: 'border-red-600', text: 'text-red-600', icon: '👺', score: 0, pos: 0, bonuses: [], heldObstacles: [], activeObstacles: [] },
  { id: 2, color: 'bg-purple-600', border: 'border-purple-600', text: 'text-purple-600', icon: '✒️', score: 0, pos: 0, bonuses: [], heldObstacles: [], activeObstacles: [] },
  { id: 3, color: 'bg-blue-600', border: 'border-blue-600', text: 'text-blue-600', icon: '🏛️', score: 0, pos: 0, bonuses: [], heldObstacles: [], activeObstacles: [] },
];

const CARDS = {
  EASY: [ 
    { title: { tr: "BOZUK ASANSÖR" }, mission: { tr: "Dar bir alanda sıkıştın. Bedeninle boğulma ve paniği göster." }, quotes: { 0: {tr: "Efendim, bu teneke kutuda piştik!"}, 1: {tr: "Sıkıştık! Kaburgalarım ezildi!"}, 2: {tr: "Ah demir kafes! İki ruhu hapseden..."}, 3: {tr: "Bu mekanik kutu modern insanın trajedisidir."} } }, 
    { title: { tr: "KUTUP SOĞUĞU" }, mission: { tr: "Donuyorsun. Dişlerin birbirine çarpıyor. Isınmaya çalış." }, quotes: { 0: {tr: "Aman efendim, donuyorum! Burnum buza döndü!"}, 1: {tr: "Donduk! Yakın sobayı!"}, 2: {tr: "Ah, bu soğuk rüzgar kemiklerimi delip geçiyor."}, 3: {tr: "Bu soğuk, ruhun ateşini bile söndürüyor."} } } 
  ],
  MEDIUM: [ 
    { title: { tr: "UNUTKANLIK" }, mission: { tr: "Tam o an ne söyleyeceğini unuttun." }, quotes: { 0: {tr: "Eee... Efendim, dilimin ucundaydı!"}, 1: {tr: "Kelimeleri aklımdan çaldınız!"}, 2: {tr: "Ah, hafızam bana ihanet ediyor! Kelimeler kayıp."}, 3: {tr: "Sessizlik... En büyük replik söylenmeyendir."} } }, 
    { title: { tr: "GÖRÜNMEZ ELMA" }, mission: { tr: "Elinde bir elma varmış gibi ye." }, quotes: { 0: {tr: "Aman efendim, bu elma değil elmas! Kırt!"}, 1: {tr: "Elimde hiçbir şey yok ama yiyorum!"}, 2: {tr: "Var olmayan bir meyvenin tadını hissediyorum."}, 3: {tr: "Görünmez bir obje yaratmak... İşte sanat budur."} } } 
  ],
  HARD: [ 
    { title: { tr: "SAHTE KRAL" }, mission: { tr: "Her şeyin kontrol altında olduğu yalanını söyleyen paniklemiş bir lider." }, quotes: { 0: {tr: "Kral benim! (Titrer)"}, 1: {tr: "Benim dediğim olur! Ben Kralım! Korkmuyorum..."}, 2: {tr: "Ah halkım! Bu taç çok ağır..."}, 3: {tr: "Sunduğum bu illüzyon sizin huzurunuz içindir."} } }, 
    { title: { tr: "AĞLARKEN GÜLMEK" }, mission: { tr: "Çok üzücü bir şey anlatırken kahkaha at." }, quotes: { 0: {tr: "Hahaha! Ah, ne kadar üzücü!"}, 1: {tr: "Hahaha! Vah zavallı başım!"}, 2: {tr: "Gülümsemem, gözyaşlarımı saklayan bir maskedir."}, 3: {tr: "Trajedi ve komedi... Hayatın iki yüzü."} } } 
  ],
  FINAL: [ 
    { title: { tr: "VEDA KONUŞMASI" }, mission: { tr: "Oyun bitiyor. Dramatik bir veda konuşması yap." }, quotes: { 0: {tr: "Sürçülisan ettiysek affola!"}, 1: {tr: "Ben kaçar!"}, 2: {tr: "Perde kapanırken, geriye gölgelerimiz kalır."}, 3: {tr: "Oyun biter, gerçek hayat başlar."} } } 
  ],
  OBSTACLE: [ 
    { id: 'o1', text: { tr: "Sadece tek kelimelerle konuş." } }, 
    { id: 'o2', text: { tr: "Açıklamanı şarkı söyleyerek yap." } }, 
    { id: 'o3', text: { tr: "Göz teması kurma." } } 
  ],
  BONUS: [ 
    { id: 'tubi', name: 'Tubi', desc: { tr: 'Buradayım canım! Annen gibi düşün... Sana 20 saniye tavsiye vereceğim!' }, benefit: { tr: 'FİKİR AL' }, effect: 'idea' }, 
    { id: 'kubi', name: 'Kubi', desc: { tr: 'Kalem elimde! Bu sahneye bir kişi daha yazıyorum. Kalabalık olsun!' }, benefit: { tr: 'EKSTRA KARAKTER' }, effect: 'char' }, 
    { id: 'mali', name: 'Mali', desc: { tr: 'Hesapladım, bu işten kârlı çıkarız.' }, benefit: { tr: '+2 PUAN' }, effect: 'score' }, 
    { id: 'kubo', name: 'Kubo', desc: { tr: 'Kestik! Olmadı, baştan alıyoruz ama süreyi uzatıyorum.' }, benefit: { tr: '+30 SANİYE' }, effect: 'time' }, 
    { id: 'madox', name: 'Madox', desc: { tr: 'Bu sahnenin türü beni sıktı. Değiştirildi!' }, benefit: { tr: 'TÜRÜ DEĞİŞTİR' }, effect: 'genre' }, 
    { id: 'dputiyat', name: 'Dpütiyat', desc: { tr: 'Yalnız olmak yok! Birini kap, sahneye fırlat.' }, benefit: { tr: 'OYUNCU DAVET ET' }, effect: 'add_player' }, 
    { id: 'gulec', name: 'Güleç', desc: { tr: 'Harika! Bir alkış tufanı yaratıyorum!' }, benefit: { tr: 'ALKIŞ BONUSU' }, effect: 'applause' }, 
    { id: 'sadic', name: 'Sadıç', desc: { tr: 'Hayat bir kumardır kardeşim! Zarları atıyorum!' }, benefit: { tr: 'ŞANS ZARI' }, effect: 'gamble' }, 
    { id: 'cihad', name: 'Cihad', desc: { tr: 'Cebimde bir sürpriz var... Kullan onu!' }, benefit: { tr: 'SÜRPRİZ OBJE' }, effect: 'double' } 
  ]
};

const getRandomCardText = (card, teamId, lang) => {
    if (!card?.quotes?.[teamId]) return "";
    return getLocalizedText(card.quotes[teamId], lang);
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

// ZAR ZIPLAMA VE DÖNME ANİMASYONLARI (Normal Sayı Zarı)
const Dice3D = ({ value, isRolling }) => {
    const [currentClass, setCurrentClass] = useState('');
    useEffect(() => { if (isRolling) setCurrentClass('rolling'); else if (value) setCurrentClass(`show-${value}`); }, [value, isRolling]);
    return (
        <div className={`scene w-32 h-32 mx-auto perspective-1000 ${isRolling ? 'animate-bounce' : ''}`}>
            <div className={`cube w-full h-full relative ${isRolling ? 'rolling' : currentClass}`}>
                {[1,2,3,4,5,6].map(n => <div key={n} className={`cube__face cube__face--${n} absolute w-32 h-32 border-2 border-neon-blue bg-black/90 flex items-center justify-center text-6xl text-neon-blue font-black shadow-[inset_0_0_30px_rgba(0,255,255,0.5)]`}>{n}</div>)}
            </div>
        </div>
    );
};

// ZAR ZIPLAMA VE DÖNME ANİMASYONLARI (Karakter Kura Zarı)
const TeamDice3D = ({ winnerId, isRolling, assets, teams }) => {
    const [currentClass, setCurrentClass] = useState('');
    useEffect(() => { 
        if (isRolling) setCurrentClass('kura-rolling'); 
        else if (winnerId !== null) setCurrentClass(`show-${winnerId + 1}`); 
    }, [winnerId, isRolling]);

    const renderFace = (teamIndex) => {
        const team = teams[teamIndex % teams.length];
        const assetSrc = assets[`team${team.id}_idle`] || assets[`team${team.id}`];
        return <div className="w-full h-full flex items-center justify-center bg-black border-2 border-[#D4AF37] rounded-lg overflow-hidden shadow-[inset_0_0_20px_rgba(212,175,55,0.5)]">{assetSrc ? <AssetDisplay src={assetSrc} className="w-full h-full object-cover object-top" alt={`Team ${team.id}`} /> : <span className="text-[#D4AF37] text-3xl">T{team.id+1}</span>}</div>;
    };

    return (
        <div className={`scene w-32 h-32 mx-auto perspective-1000 ${isRolling ? 'animate-bounce' : ''}`}>
            <div className={`cube w-full h-full relative ${isRolling ? 'kura-rolling' : currentClass}`}>
                {[0,1,2,3,4,5].map((idx) => <div key={idx} className={`cube__face cube__face--${idx+1} absolute w-32 h-32`}>{renderFace(idx)}</div>)}
            </div>
        </div>
    );
};

// --- CARD DESIGN ---
const CardDisplay = ({ card, type, mode = 'draw', onAction, assets, currentTeamId, lang, isMyTurn = true }) => {
    const cardRef = useRef(null);
    useEffect(() => {
        if (!window.anime) {
            const script = document.createElement('script');
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js";
            document.body.appendChild(script);
            script.onload = runEntranceAnimation;
        } else { runEntranceAnimation(); }
        if (mode === 'play') playSynthSound('powerup', true); else playSynthSound('curtain', true);
    }, [mode]);

    const runEntranceAnimation = () => {
        if (!window.anime) return;
        const tl = window.anime.timeline({ easing: 'easeOutExpo', duration: 1200 });
        if (mode === 'draw') {
            tl.add({ targets: '#curtain-left', translateX: ['0%', '-100%'], scaleX: [1, 0.2], duration: 1000 }, 0)
              .add({ targets: '#curtain-right', translateX: ['0%', '100%'], scaleX: [1, 0.2], duration: 1000 }, 0)
              .add({ targets: '.stagger-item', translateY: [30, 0], opacity: [0, 1], delay: window.anime.stagger(100), easing: 'spring(1, 80, 10, 0)' }, '-=600');
        } else if (mode === 'play') {
            tl.add({ targets: cardRef.current, scale: [1.2, 1], opacity: [0, 1], duration: 1000, easing: 'easeOutElastic(1, .5)' }, 0)
              .add({ targets: '.stagger-item', translateY: [20, 0], opacity: [0, 1], delay: window.anime.stagger(100) }, '-=800');
        }
    };

    const triggerAction = () => {
        if (!isMyTurn) return; // Sadece sırası gelen tıklayabilir
        if (mode === 'play' && window.anime && cardRef.current) {
            window.anime({ targets: cardRef.current, scale: [1, 1.2], opacity: [1, 0], duration: 300, easing: 'easeInExpo', complete: onAction });
        } else onAction();
    };

    if (!card) return null;
    const isBonus = type === 'bonus'; const isObstacle = type === 'obstacle'; const isFinal = type === 'final'; const isPlaying = mode === 'play';
    let titleText = "", missionText = "", flavorText = "", icon = <Drama size={32} className="text-[#D4AF37]"/>, characterVideoSrc = null, bgStyle = "bg-neutral-900", accentColor = "text-white", glowColor = "rgba(255,255,255,0.1)";
    const baseKey = `team${currentTeamId}`;

    if (isBonus) {
        titleText = getLocalizedText(card.name, lang) || "BONUS"; 
        missionText = getLocalizedText(card.desc, lang); 
        flavorText = `${UI[lang]?.oppCard || "FIRSAT KARTI"} ✦ ${getLocalizedText(card.benefit, lang)}`;
        icon = <Sparkles size={32} className="text-blue-400 animate-pulse"/>; bgStyle = isPlaying ? "bg-gradient-to-b from-yellow-600 to-red-900" : "bg-gradient-to-b from-indigo-600 to-blue-900"; accentColor = isPlaying ? "text-yellow-200" : "text-indigo-200"; glowColor = isPlaying ? "rgba(255, 200, 0, 0.8)" : "rgba(99, 102, 241, 0.5)";
    } else if (isObstacle) {
        titleText = UI[lang].obsCard; 
        missionText = getLocalizedText(card.text, lang); 
        // Engel kartı mantığı değişti, artık ele alınıp saklanıyor.
        flavorText = "ENVANTERE EKLENDİ! Başkasının sırasında fırlat.";
        icon = <Skull size={32} className="text-red-500 animate-bounce"/>; characterVideoSrc = assets[`${baseKey}_scared`]; bgStyle = "bg-gradient-to-b from-red-600 to-rose-900"; accentColor = "text-red-200"; glowColor = "rgba(225, 29, 72, 0.5)";
    } else {
        titleText = isFinal ? getLocalizedText(card.title, lang) : UI[lang].improv; 
        missionText = getLocalizedText(card.mission, lang);
        const quoteStr = getRandomCardText(card, currentTeamId, lang);
        flavorText = quoteStr ? `"${quoteStr}"` : getLocalizedText(card.desc, lang);
        icon = getCardIcon(missionText + " " + titleText, <Drama size={32} className="text-[#D4AF37]"/>);
        if(type === 'easy') { characterVideoSrc = assets[`${baseKey}_happy`]; bgStyle = "bg-gradient-to-b from-emerald-500 to-teal-800"; accentColor = "text-emerald-100"; titleText = UI[lang].easyLevel; } 
        else if(type === 'medium') { characterVideoSrc = assets[`${baseKey}_thinking`]; bgStyle = "bg-gradient-to-b from-amber-500 to-orange-800"; accentColor = "text-amber-100"; titleText = UI[lang].medLevel; } 
        else if(type === 'hard') { bgStyle = "bg-gradient-to-b from-rose-500 to-red-800"; accentColor = "text-rose-100"; characterVideoSrc = assets[`${baseKey}_scared`]; titleText = UI[lang].hardLevel; } 
        else if(type === 'final') { bgStyle = "bg-gradient-to-b from-yellow-600 via-orange-600 to-red-900"; accentColor = "text-yellow-100"; characterVideoSrc = assets[`${baseKey}_scared`]; }
    }

    return (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/90 backdrop-blur-sm overflow-hidden px-4">
            {isPlaying && <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(255,200,0,0.3)_0%,transparent_70%)] animate-pulse"></div>}
            <div ref={cardRef} className={`relative w-full max-w-[90vw] sm:max-w-sm h-[75vh] max-h-[600px] rounded-3xl overflow-hidden shadow-2xl flex flex-col opacity-100 border border-white/20`} style={{ boxShadow: `0 10px 40px -10px ${glowColor}` }}>
                <div className={`absolute inset-0 ${bgStyle} z-0`}></div>
                <div className="absolute inset-0 z-10 flex flex-col justify-start p-0">
                    <div className={`relative w-full ${isBonus ? 'h-[50%]' : 'h-[40%]'} shrink-0 z-0 overflow-hidden flex items-center justify-center bg-black`}>
                         
                         {/* ARKA PLAN BLUR (MIX BLEND SCREEN İPTAL EDİLDİ) */}
                         {isBonus && assets[`bonus_${card.id}`] ? (
                             <AssetDisplay src={assets[`bonus_${card.id}`]} className="absolute inset-0 w-full h-full object-cover scale-[1.5] blur-2xl opacity-50 bg-transparent" alt="Blur Bg" />
                         ) : (
                             characterVideoSrc && <AssetDisplay src={characterVideoSrc} className="absolute inset-0 w-full h-full object-cover scale-[1.5] blur-2xl opacity-40 bg-transparent" alt="Blur Bg" />
                         )}

                         {/* ANA VİDEO (MIX BLEND İPTAL EDİLDİ - ORİJİNAL RENGİNDE GÖRÜNÜR) */}
                         {isBonus && assets[`bonus_${card.id}`] ? (
                             <AssetDisplay src={assets[`bonus_${card.id}`]} className={`relative z-10 w-full h-full object-contain object-center bg-transparent transition-transform duration-700 ${isPlaying ? 'scale-110 drop-shadow-[0_0_30px_rgba(255,200,0,0.8)]' : 'scale-100 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]'}`} alt="Bonus" />
                         ) : (
                             characterVideoSrc && <AssetDisplay src={characterVideoSrc} className="relative z-10 w-full h-full object-contain object-top bg-transparent transition-transform duration-700 drop-shadow-[0_0_20px_rgba(0,0,0,0.5)]" alt="Character" />
                         )}

                        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black via-black/80 to-transparent z-20"></div>
                    </div>
                    <div className={`relative z-30 flex-1 flex flex-col items-center justify-start text-center px-6 pb-6 ${isBonus ? '-mt-4 pt-4' : '-mt-6'}`}>
                         <div className={`p-4 rounded-full bg-black/60 border border-[#D4AF37]/50 mb-4 backdrop-blur-md inline-flex justify-center shadow-xl`}>
                             {isPlaying ? <Zap size={32} className="text-yellow-400 animate-pulse"/> : icon}
                         </div>
                         <h1 className="text-2xl sm:text-3xl text-[#D4AF37] font-black italic mb-3 leading-none uppercase text-center w-full">{titleText}</h1>
                         <div className="w-full mb-3 bg-black/40 border border-[#D4AF37]/30 p-3 rounded-xl shadow-inner flex-1 flex items-center justify-center">
                            <p className={`${isBonus ? 'text-sm sm:text-base' : 'text-base sm:text-lg'} font-bold leading-tight ${accentColor}`}>"{missionText}"</p>
                         </div>
                         <p className={`italic mb-4 px-1 leading-relaxed ${isBonus ? 'text-[10px] sm:text-xs text-yellow-500 font-bold uppercase tracking-wider' : 'text-xs sm:text-sm text-gray-300'}`}>{flavorText}</p>
                         
                         {isMyTurn ? (
                             <button onClick={triggerAction} className={`stagger-item opacity-0 w-full mt-auto py-4 rounded-xl font-black text-base sm:text-lg tracking-widest uppercase shadow-[0_5px_20px_rgba(0,0,0,0.5)] transition-all active:scale-95 ${isPlaying || isFinal ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black border-2 border-white animate-pulse' : 'bg-white text-black'}`}>
                                {isObstacle ? "ENVANTERE AL" : (isPlaying ? (UI[lang]?.unleashPower || "GÜCÜ KULLAN") : (isBonus ? (UI[lang]?.accept || "KABUL ET") : (UI[lang]?.stageYours || "SAHNE SENİN")))}
                             </button>
                         ) : (
                             <div className="stagger-item opacity-0 w-full mt-auto py-4 rounded-xl font-bold text-sm sm:text-base tracking-widest uppercase bg-black/50 text-gray-400 border border-white/10">
                                ⏳ {TEAM_INFO[currentTeamId].name} Karar Veriyor...
                             </div>
                         )}
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

// --- 4. MAIN GAME & MULTIPLAYER ---
export default function DogaclaVisualsFinal() {
  const [lang, setLang] = useState('tr');
  const [assets] = useState(GAME_ASSETS);
  
  // -- Local User State --
  const [user, setUser] = useState(null);
  const [roomId, setRoomId] = useState('');
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [isSinglePlayer, setIsSinglePlayer] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [toastMsg, setToastMsg] = useState(null); 
  const [isAppLoading, setIsAppLoading] = useState(true); 
  const [teamSelectMode, setTeamSelectMode] = useState(null);
  
  // -- ZAR DURUMLARI --
  const [localDiceState, setLocalDiceState] = useState({ isRolling: false, teamIndex: null, showReveal: false });
  
  // YENİ: Başlangıç Karakter Kurası / Tanıtım (Reveal) Ekranı Durumu
  const [revealState, setRevealState] = useState({
      isActive: false,
      mode: null,
      count: 0,
      selectedTeams: [],
      currentIndex: 0,
      isRolling: false
  });
  
  // -- Synced Game States --
  const [gameState, setGameState] = useState('LOBBY'); 
  const [teams, setTeams] = useState(INITIAL_TEAMS);
  const [players, setPlayers] = useState({}); // { uid: teamId }
  const [readyPlayers, setReadyPlayers] = useState({}); // { uid: true }
  const [targetTeamCount, setTargetTeamCount] = useState(4); 
  const [hostUid, setHostUid] = useState(null); 
  const [currentTurn, setCurrentTurn] = useState(0);
  const [diceValue, setDiceValue] = useState(null);
  const [activeCard, setActiveCard] = useState(null);
  const [cardType, setCardType] = useState(null);
  const [playingBonus, setPlayingBonus] = useState(null);
  const [performanceTimer, setPerformanceTimer] = useState(0);
  const [juryScore, setJuryScore] = useState(0);
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
  const [logs, setLogs] = useState(["DOĞAÇLA Çok Oyunculu Sürümüne Hoş Geldiniz!"]);
  
  // -- Strictly Local UI States --
  const [voteData, setVoteData] = useState({ roleplay: false, obstacleOvercome: false, fail: false, bonusScore: 0 });
  const [reactions, setReactions] = useState([]);
  const [confetti, setConfetti] = useState(false); 
  const [randomEvent, setRandomEvent] = useState(null);
  const [showRules, setShowRules] = useState(false);
  const [showLogsMenu, setShowLogsMenu] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [timerKey, setTimerKey] = useState(0); 
  const [criticLoading, setCriticLoading] = useState(false);

  useEffect(() => {
      const timer = setTimeout(() => setIsAppLoading(false), 2500);
      return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
      const urlParams = new URLSearchParams(window.location.search);
      const roomCodeFromUrl = urlParams.get('room');
      if (roomCodeFromUrl && user && !roomId) {
          joinRoom(roomCodeFromUrl.toUpperCase());
          window.history.replaceState({}, document.title, window.location.pathname);
      }
  }, [user]); 

  // Başlangıç Karakter Kurası / Tanıtımı Mantığı (Zamanlamalar)
  useEffect(() => {
      if (!revealState.isActive) return;
      let timeout;

      if (revealState.isRolling) {
          playSynthSound('roll', soundEnabled);
          timeout = setTimeout(() => {
              setRevealState(prev => ({ ...prev, isRolling: false }));
              playSynthSound('success', soundEnabled);
          }, 1500); 
      } else {
          timeout = setTimeout(() => {
              if (revealState.currentIndex < revealState.count - 1) {
                  setRevealState(prev => ({ ...prev, currentIndex: prev.currentIndex + 1, isRolling: true }));
              } else {
                  setRevealState(prev => ({ ...prev, isActive: false }));
                  if (revealState.mode === 'single') {
                      startSinglePlayer(revealState.count, revealState.selectedTeams);
                  } else {
                      createRoom(revealState.count, revealState.selectedTeams);
                  }
              }
          }, 3500); 
      }

      return () => clearTimeout(timeout);
  }, [revealState.isActive, revealState.isRolling, revealState.currentIndex, revealState.count, revealState.mode, revealState.selectedTeams, soundEnabled]);

  // --- FIREBASE AUTH ---
  useEffect(() => {
      if (!auth) {
          setAuthError("Firebase modülü başlatılamadı.");
          return;
      }
      
      const connectionTimeout = setTimeout(() => {
          if (!user) {
              setAuthError("Bağlantı zaman aşımına uğradı. İnternetinizi kontrol edin veya 'Tek Oyunculu' devam edin.");
          }
      }, 5000);

      const initAuth = async () => {
          try {
              const hasCanvasConfig = typeof __firebase_config !== 'undefined' && __firebase_config;
              if (hasCanvasConfig && typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
                  await signInWithCustomToken(auth, __initial_auth_token);
              } else {
                  await signInAnonymously(auth);
              }
          } catch (e) { 
              console.error("Auth Error", e); 
              setAuthError(e.message || "Giriş reddedildi.");
          }
      };
      initAuth();
      
      const unsub = onAuthStateChanged(auth, (u) => {
          if (u) clearTimeout(connectionTimeout);
          setUser(u);
      });
      
      return () => { unsub(); clearTimeout(connectionTimeout); };
  }, []);

  // --- MULTIPLAYER SYNC SENDER ---
  const syncGame = async (updates) => {
      if ('gameState' in updates) setGameState(updates.gameState);
      if ('teams' in updates) setTeams(updates.teams);
      if ('players' in updates) setPlayers(updates.players);
      if ('readyPlayers' in updates) setReadyPlayers(updates.readyPlayers);
      if ('targetTeamCount' in updates) setTargetTeamCount(updates.targetTeamCount);
      if ('hostUid' in updates) setHostUid(updates.hostUid);
      if ('currentTurn' in updates) setCurrentTurn(updates.currentTurn);
      if ('diceValue' in updates) setDiceValue(updates.diceValue);
      if ('activeCard' in updates) setActiveCard(updates.activeCard);
      if ('cardType' in updates) setCardType(updates.cardType);
      if ('playingBonus' in updates) setPlayingBonus(updates.playingBonus);
      if ('performanceTimer' in updates) setPerformanceTimer(updates.performanceTimer);
      if ('juryScore' in updates) setJuryScore(updates.juryScore);
      if ('hypeMeter' in updates) setHypeMeter(updates.hypeMeter);
      if ('characterMood' in updates) setCharacterMood(updates.characterMood);
      if ('isRollingDice' in updates) setIsRollingDice(updates.isRollingDice);
      if ('showDiceModal' in updates) setShowDiceModal(updates.showDiceModal);
      if ('kuraRolling' in updates) setKuraRolling(updates.kuraRolling);
      if ('finalists' in updates) setFinalists(updates.finalists);
      if ('directors' in updates) setDirectors(updates.directors);
      if ('draftMission' in updates) setDraftMission(updates.draftMission);
      if ('customFinalCard' in updates) setCustomFinalCard(updates.customFinalCard);
      if ('aiCards' in updates) setAiCards(updates.aiCards);
      if ('finalTurnIndex' in updates) setFinalTurnIndex(updates.finalTurnIndex);
      if ('winner' in updates) setWinner(updates.winner);
      if ('logs' in updates) setLogs(updates.logs);

      if (!isSinglePlayer && roomId && db) {
          try { await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'rooms', roomId), updates); } 
          catch (e) { console.error("Sync error:", e); }
      }
  };

  // --- MULTIPLAYER LISTENER ---
  useEffect(() => {
      if (!user || !roomId || !db || isSinglePlayer) return;
      const unsub = onSnapshot(doc(db, 'artifacts', appId, 'public', 'data', 'rooms', roomId), (snap) => {
          if (snap.exists()) {
              const data = snap.data();
              if (data.gameState !== undefined) setGameState(data.gameState);
              if (data.teams !== undefined) setTeams(data.teams);
              if (data.players !== undefined) setPlayers(data.players);
              if (data.readyPlayers !== undefined) setReadyPlayers(data.readyPlayers);
              if (data.targetTeamCount !== undefined) setTargetTeamCount(data.targetTeamCount);
              if (data.hostUid !== undefined) setHostUid(data.hostUid);
              if (data.currentTurn !== undefined) setCurrentTurn(data.currentTurn);
              if (data.diceValue !== undefined) setDiceValue(data.diceValue);
              if (data.activeCard !== undefined) setActiveCard(data.activeCard);
              if (data.cardType !== undefined) setCardType(data.cardType);
              if (data.playingBonus !== undefined) setPlayingBonus(data.playingBonus);
              if (data.performanceTimer !== undefined) setPerformanceTimer(data.performanceTimer);
              if (data.juryScore !== undefined) setJuryScore(data.juryScore);
              if (data.hypeMeter !== undefined) setHypeMeter(data.hypeMeter);
              if (data.characterMood !== undefined) setCharacterMood(data.characterMood);
              if (data.isRollingDice !== undefined) setIsRollingDice(data.isRollingDice);
              if (data.showDiceModal !== undefined) setShowDiceModal(data.showDiceModal);
              if (data.kuraRolling !== undefined) setKuraRolling(data.kuraRolling);
              if (data.finalists !== undefined) setFinalists(data.finalists);
              if (data.directors !== undefined) setDirectors(data.directors);
              if (data.draftMission !== undefined) setDraftMission(data.draftMission);
              if (data.customFinalCard !== undefined) setCustomFinalCard(data.customFinalCard);
              if (data.aiCards !== undefined) setAiCards(data.aiCards);
              if (data.finalTurnIndex !== undefined) setFinalTurnIndex(data.finalTurnIndex);
              if (data.winner !== undefined) setWinner(data.winner);
              if (data.logs !== undefined) setLogs(data.logs);
              
              if (data.eventTrigger) {
                  if (data.eventTrigger.type === 'reaction') { setReactions(p => [...p, { id: Date.now()+Math.random(), emoji: data.eventTrigger.emoji, x: Math.random()*80+10 }]); playSynthSound('click', soundEnabled); }
                  else if (data.eventTrigger.type === 'confetti') { setConfetti(true); setTimeout(() => setConfetti(false), 2000); }
                  else if (data.eventTrigger.type === 'audience') { setRandomEvent(data.eventTrigger.data); setTimeout(() => setRandomEvent(null), 2500); }
              }
          }
      }, (err) => console.error(err));
      return () => unsub();
  }, [user, roomId, isSinglePlayer]);

  const currentTeam = teams[currentTurn] || teams[0];
  const isGoldenMic = hypeMeter >= 100; 
  const isHost = hostUid === user?.uid;
  const bgMusicRef = useRef(new Audio());

  const myTeamId = players[user?.uid];
  const myTeam = myTeamId !== undefined ? teams.find(t => t.id === myTeamId) : null;
  const isMyTurn = isSinglePlayer || myTeamId === currentTeam.id || (isHost && !Object.values(players).includes(currentTeam.id));
  const amIDirector = isSinglePlayer || directors.some(d => d.id === players[user?.uid]) || (isHost && directors.every(d => !Object.values(players).includes(d.id)));

  const totalPlayers = Object.keys(players).length;
  const readyCount = Object.keys(readyPlayers).length;
  const isEveryoneReady = totalPlayers > 0 && readyCount === totalPlayers;
  const amIReady = readyPlayers[user?.uid];

  useEffect(() => {
      const audioEl = bgMusicRef.current;
      if (!soundEnabled) { audioEl.pause(); return; }
      if (audioEl.src !== assets.music_bg) { audioEl.src = assets.music_bg; audioEl.loop = true; audioEl.volume = 0.15; }
      if (audioEl.paused) audioEl.play().catch(e => console.log("Auto-play blocked", e));
  }, [soundEnabled, assets.music_bg]);

  const addLog = (msg) => { const newLogs = [`• ${msg}`, ...logs].slice(0, 15); syncGame({ logs: newLogs }); };
  
  const triggerRemoteEvent = (eventData) => {
      if (isSinglePlayer) {
          if (eventData.type === 'reaction') { setReactions(p => [...p, { id: Date.now()+Math.random(), emoji: eventData.emoji, x: Math.random()*80+10 }]); playSynthSound('click', soundEnabled); }
          else if (eventData.type === 'confetti') { setConfetti(true); setTimeout(() => setConfetti(false), 2000); }
          else if (eventData.type === 'audience') { setRandomEvent(eventData.data); setTimeout(() => setRandomEvent(null), 2500); }
          return;
      }
      syncGame({ eventTrigger: eventData });
  };

  const addReaction = (emoji) => { triggerRemoteEvent({ type: 'reaction', emoji }); setHypeMeter(Math.min(100, hypeMeter + 2)); syncGame({ hypeMeter: Math.min(100, hypeMeter + 2) }); };
  const removeReaction = useCallback((id) => setReactions(prev => prev.filter(r => r.id !== id)), []);

  const promptSinglePlayer = () => setTeamSelectMode('single');
  const promptMultiPlayer = () => setTeamSelectMode('multi');

  const shuffleTeams = (count) => {
      const shuffled = [...INITIAL_TEAMS].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count).sort((a, b) => a.id - b.id);
  };

  const handleTeamSelection = (count, mode) => {
      playSynthSound('click', soundEnabled);
      const activeTeams = shuffleTeams(count);
      setRevealState({
          isActive: true,
          mode: mode,
          count: count,
          selectedTeams: activeTeams,
          currentIndex: 0,
          isRolling: true 
      });
  };

  const startSinglePlayer = (count, activeTeams) => {
      setIsSinglePlayer(true);
      setRoomId('');
      setTeams(activeTeams);
      setTargetTeamCount(count);
      setGameState('INTRO');
      setCurrentTurn(0);
      setHypeMeter(0);
      setTeamSelectMode(null);
      setLogs(["DOĞAÇLA Tek Oyunculu Olarak Başladı!"]);
  };

  const createRoom = async (count, activeTeams) => {
      if (!user || !db) return;
      try {
          const code = Math.random().toString(36).substring(2, 6).toUpperCase();
          const initialData = { 
              gameState: 'INTRO', 
              teams: activeTeams, 
              targetTeamCount: count,
              players: {},
              readyPlayers: {},
              hostUid: user.uid,
              currentTurn: 0, hypeMeter: 0, logs: ["Doğaçla'ya Hoş Geldiniz!"] 
          };
          await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'rooms', code), initialData);
          setIsSinglePlayer(false);
          setRoomId(code);
          setTeamSelectMode(null);
          setAuthError(null);
      } catch (err) {
          console.error(err);
          setAuthError("Oda kurulamadı: " + err.message);
      }
  };
  
  const joinRoom = async (code) => {
      if (!user || !db || code.length !== 4) return;
      try {
          const docSnap = await getDoc(doc(db, 'artifacts', appId, 'public', 'data', 'rooms', code));
          if (docSnap.exists()) {
              setIsSinglePlayer(false);
              setRoomId(code); 
              setAuthError(null);
          } else {
              setAuthError("HATA: Böyle bir oda kodu bulunamadı!");
          }
      } catch(err) {
          console.error(err);
          setAuthError("Odaya Katılma Hatası: " + err.message);
      }
  };

  const joinTeamWithDice = () => {
      if (!user) return;
      playSynthSound('roll', soundEnabled);
      setLocalDiceState({ isRolling: true, teamIndex: null, showReveal: false });
      
      setTimeout(() => {
          const teamCounts = Array(teams.length).fill(0);
          Object.values(players).forEach(tId => {
              const index = teams.findIndex(t => t.id === tId);
              if (index !== -1) teamCounts[index]++;
          });
          const minCount = Math.min(...teamCounts);
          const availableTeamIndices = teamCounts.map((c, i) => c === minCount ? i : -1).filter(i => i !== -1);
          const chosenIndex = availableTeamIndices[Math.floor(Math.random() * availableTeamIndices.length)];
          const assignedTeam = teams[chosenIndex].id;
          
          setLocalDiceState({ isRolling: false, teamIndex: chosenIndex, showReveal: false });
          playSynthSound('click', soundEnabled);
          
          setTimeout(() => {
              playSynthSound('success', soundEnabled);
              setLocalDiceState({ isRolling: false, teamIndex: chosenIndex, showReveal: true });

              setTimeout(() => {
                  setLocalDiceState({ isRolling: false, teamIndex: null, showReveal: false });
                  syncGame({ players: { ...players, [user.uid]: assignedTeam } });
                  addLog(`Yeni bir oyuncu ${TEAM_INFO[assignedTeam].name} takımına katıldı!`);
              }, 3500); 
          }, 1500); 
      }, 3000); 
  };

  const resetGame = () => { 
      playSynthSound('click', soundEnabled);
      setIsSinglePlayer(false);
      syncGame({ gameState: 'LOBBY', teams: INITIAL_TEAMS, players: {}, readyPlayers: {}, targetTeamCount: 4, hostUid: null, currentTurn: 0, diceValue: null, activeCard: null, cardType: null, playingBonus: null, performanceTimer: 0, juryScore: 0, hypeMeter: 0, characterMood: 'idle', isRollingDice: false, showDiceModal: false, kuraRolling: false, finalists: [], directors: [], draftMission: null, customFinalCard: null, aiCards: [], finalTurnIndex: 0, winner: null, logs: ["Doğaçla Mobile Act I!"] });
      setRoomId('');
  };

  const triggerFinalTest = () => {
      const newTeams = teams.map((t, i) => { if (i === 0 || i === 1) return { ...t, pos: 35, score: 150 - i }; return { ...t, pos: 10, score: 50 }; });
      syncGame({ teams: newTeams }); setTimeout(checkFinals, 100);
  };

  const getCurrentCharacterAsset = () => { const baseKey = `team${currentTeam.id}`; return assets[`${baseKey}_${characterMood}`] || assets[`${baseKey}_idle`] || assets[baseKey]; };

  const triggerAudienceEvent = () => {
      if (Math.random() < 0.15) { 
          const isGood = Math.random() > 0.5;
          const msg = isGood ? (lang === 'tr' ? "Gül yağmuru!" : "Roses raining!") : (lang === 'tr' ? "Domates yağmuru!" : "Tomato rain!");
          const color = isGood ? 'text-pink-400' : 'text-red-500';
          triggerRemoteEvent({ type: 'audience', data: { msg, color } });
          if(isGood) { syncGame({ hypeMeter: Math.min(100, hypeMeter + 15), characterMood: 'happy' }); triggerRemoteEvent({ type: 'confetti' }); setTimeout(() => syncGame({characterMood: 'idle'}), 3000); } 
          else { playSynthSound('pop', soundEnabled); syncGame({ characterMood: 'scared' }); setTimeout(() => syncGame({characterMood: 'idle'}), 3000); }
      }
  };

  const startKura = () => { 
      syncGame({ gameState: 'KURA', kuraRolling: true, showDiceModal: true }); 
      playSynthSound('roll', soundEnabled); 
      setTimeout(() => { 
          const winnerIndex = Math.floor(Math.random() * teams.length); 
          syncGame({ currentTurn: winnerIndex, kuraRolling: false }); 
          playSynthSound('success', soundEnabled); 
          setTimeout(() => { 
              syncGame({ showDiceModal: false, gameState: 'ROLL' }); 
              addLog(lang === 'tr' ? `Sahne ışıkları ${TEAM_INFO[teams[winnerIndex].id].name} üzerinde!` : `Spotlights on ${TEAM_INFO[teams[winnerIndex].id].name}!`); 
          }, 2000); 
      }, 2500); 
  };
  
  const askAICritic = async () => { if (!activeCard) return; setCriticLoading(true); setTimeout(() => { addLog(`🤖 ${UI[lang].aiComment}: "${getLocalizedText(TEAM_INFO[currentTeam.id].style, lang)}!"`); setCriticLoading(false); playSynthSound('click', soundEnabled); }, 1500); };
  
  const checkFinals = () => { 
      const finishers = teams.filter(t => t.pos >= 35); 
      if (finishers.length > 0) { 
          const sorted = [...teams].sort((a, b) => b.score - a.score); 
          syncGame({ finalists: sorted.slice(0, 2), directors: sorted.slice(2, 4), finalTurnIndex: 0, currentTurn: teams.findIndex(t => t.id === sorted[0].id), draftMission: null, gameState: 'FINALS_DIRECTOR_INPUT' }); playSynthSound('success', soundEnabled);
      } else { nextTurn(); }
  };

  const throwObstacle = (index) => {
      if (!myTeam || isMyTurn) return;
      const obstacleToThrow = myTeam.heldObstacles[index];
      const newTeams = [...teams];
      
      const myTeamIndex = newTeams.findIndex(t => t.id === myTeam.id);
      newTeams[myTeamIndex] = {
          ...newTeams[myTeamIndex],
          heldObstacles: newTeams[myTeamIndex].heldObstacles.filter((_, i) => i !== index)
      };
      
      const activeTeamIndex = newTeams.findIndex(t => t.id === currentTeam.id);
      newTeams[activeTeamIndex] = {
          ...newTeams[activeTeamIndex],
          activeObstacles: [...newTeams[activeTeamIndex].activeObstacles, obstacleToThrow]
      };

      syncGame({ teams: newTeams, characterMood: 'scared' });
      playSynthSound('scared', soundEnabled);
      triggerRemoteEvent({ type: 'audience', data: { msg: "SABOTAJ!", color: "text-red-500" }});
      addLog(`${TEAM_INFO[myTeam.id].name}, ${TEAM_INFO[currentTeam.id].name}'e engel fırlattı!`);
      setTimeout(() => syncGame({ characterMood: 'idle' }), 3000);
  };

  const generateDraftMission = async () => {
      if (!directorInput.trim()) return;
      playSynthSound('click', soundEnabled); syncGame({ gameState: 'FINALS_GENERATING' });
      const apiKey = ""; const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
      const promptText = `Bir tiyatro yönetmeni olarak, oyuncuların sana verdiği şu fikri al: "${directorInput}". Sahnede oynanacak kısa, detaylı, komik ve absürt bir tiyatro görevine dönüştür. İngilizce çevirisini de yap.`;
      const schema = { type: "OBJECT", properties: { tr: { type: "STRING" }, en: { type: "STRING" } } };
      try {
          let resultData = null; let delay = 1000;
          for(let i=0; i<3; i++) {
              try { const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: promptText }] }], generationConfig: { responseMimeType: "application/json", responseSchema: schema } }) });
                  const data = await response.json(); if(data.candidates) { resultData = JSON.parse(data.candidates[0].content.parts[0].text); break; }
              } catch(err) { if(i===2) throw err; await new Promise(r=>setTimeout(r,delay)); delay*=2; }
          }
          if(resultData && resultData.tr) { playSynthSound('success', soundEnabled); syncGame({ draftMission: resultData, gameState: 'FINALS_DRAFT_REVIEW' }); } else throw new Error("API failed");
      } catch(error) {
          playSynthSound('success', soundEnabled); const t = directorInput.trim();
          syncGame({ draftMission: { tr: `'${t}' temasını pandomim ve abartılı nidalarla seyirciye anlat.`, en: `Explain '${t}' using pantomime and loud noises.` }, gameState: 'FINALS_DRAFT_REVIEW' });
      }
  };

  const approveAndGenerateOptions = async () => {
      playSynthSound('click', soundEnabled); syncGame({ gameState: 'FINALS_GENERATING' });
      const apiKey = ""; const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
      const promptText = `Şu tiyatro görevini temel al: "${getLocalizedText(draftMission, 'tr')}". Lütfen bu görevi 3 farklı sahne tarzına (DRAMATİK, ABSÜRT, SESSİZ) göre uyarla. Hem Türkçe (tr) hem İngilizce (en) üret. Replikler (quotes) kısmında 4 farklı karakter için 1. tekil şahıs ağzından kısa iç ses yaz: "0": İbiş, "1": Karagöz, "2": Shakespeare, "3": Aristofanes`;
      const schema = { type: "ARRAY", items: { type: "OBJECT", properties: { title: { type: "OBJECT", properties: { tr: {type:"STRING"}, en: {type:"STRING"} } }, mission: { type: "OBJECT", properties: { tr: {type:"STRING"}, en: {type:"STRING"} } }, desc: { type: "OBJECT", properties: { tr: {type:"STRING"}, en: {type:"STRING"} } }, quotes: { type: "OBJECT", properties: { "0": { type: "OBJECT", properties: { tr: {type:"STRING"}, en: {type:"STRING"} } }, "1": { type: "OBJECT", properties: { tr: {type:"STRING"}, en: {type:"STRING"} } }, "2": { type: "OBJECT", properties: { tr: {type:"STRING"}, en: {type:"STRING"} } }, "3": { type: "OBJECT", properties: { tr: {type:"STRING"}, en: {type:"STRING"} } } } } } } };
      try {
          let resultData = null; let delay = 1000;
          for(let i=0; i<3; i++) {
              try { const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: promptText }] }], generationConfig: { responseMimeType: "application/json", responseSchema: schema } }) });
                  const data = await response.json(); if(data.candidates) { resultData = JSON.parse(data.candidates[0].content.parts[0].text); break; }
              } catch(err) { if(i===2) throw err; await new Promise(r=>setTimeout(r,delay)); delay*=2; }
          }
          if(resultData && resultData.length > 0) { playSynthSound('success', soundEnabled); syncGame({ aiCards: resultData, gameState: 'FINALS_SELECT_CARD' }); } else throw new Error("API error");
      } catch(error) { playSynthSound('success', soundEnabled); syncGame({ aiCards: generateMockCardsDual(directorInput.trim(), draftMission), gameState: 'FINALS_SELECT_CARD' }); }
  };

  const selectFinalCard = (selectedCard) => { playSynthSound('click', soundEnabled); syncGame({ customFinalCard: { ...selectedCard, type: 'final' }, gameState: 'FINALS_PREP' }); };
  const castWinner = (team) => { playSynthSound('success', soundEnabled); syncGame({ winner: team, gameState: 'END' }); triggerRemoteEvent({ type: 'confetti' }); };

  const moveTokenStepByStep = async (teamId, startPos, targetPos) => { 
      let current = startPos; let currentTeams = [...teams];
      while (current < targetPos) { 
          current++; currentTeams = currentTeams.map(t => t.id === teamId ? { ...t, pos: current } : t);
          setTeams(currentTeams); 
          playSynthSound('click', soundEnabled); await new Promise(resolve => setTimeout(resolve, 200)); 
      } 
      syncGame({ teams: currentTeams });
      
      if (targetPos === 35) { checkFinals(); } else { 
          const type = BOARD_MAP[targetPos].type; 
          if(type === 'start') nextTurn(); else drawCard(type); 
      } 
  };
  
  const rollDice = () => {
    triggerAudienceEvent(); 
    syncGame({ showDiceModal: true, isRollingDice: true, characterMood: 'idle' }); 
    playSynthSound('roll', soundEnabled);
    setTimeout(() => {
        const bonus = Math.floor(currentTeam.score / 5); const roll = Math.ceil(Math.random() * 6);
        syncGame({ diceValue: roll, isRollingDice: false });
        setTimeout(() => {
            syncGame({ showDiceModal: false }); addLog(lang === 'tr' ? `${TEAM_INFO[currentTeam.id].name} ${roll} attı!` : `${TEAM_INFO[currentTeam.id].name} rolled ${roll}!`);
            let newPos = currentTeam.pos + Math.min(roll + bonus, 12); if (newPos >= 35) newPos = 35;
            moveTokenStepByStep(currentTeam.id, currentTeam.pos, newPos);
        }, 1000); 
    }, 2000);
  };

  const drawCard = (type) => { 
      let newMood = 'idle';
      if (type === 'easy' || type === 'bonus') newMood = 'happy'; else if (type === 'medium') newMood = 'thinking'; else if (type === 'hard' || type === 'final' || type === 'obstacle') { newMood = 'scared'; playSynthSound('scared', soundEnabled); } 
      
      let list = []; 
      if (type === 'easy') list = CARDS.EASY; else if (type === 'medium') list = CARDS.MEDIUM; else if (type === 'hard') list = CARDS.HARD; else if (type === 'final') list = CARDS.FINAL; else if (type === 'obstacle') list = CARDS.OBSTACLE; else if (type === 'bonus') list = CARDS.BONUS; 
      const cardData = list[Math.floor(Math.random() * list.length)]; 
      syncGame({ cardType: type, characterMood: newMood, activeCard: cardData, gameState: 'CARD' }); 
  };
  
  const handleCardAction = () => { 
      playSynthSound('click', soundEnabled); 
      if (cardType === 'bonus') { 
          const newTeams = teams.map((t, i) => i === currentTurn ? { ...t, bonuses: [...t.bonuses, activeCard] } : t);
          syncGame({ teams: newTeams, activeCard: null }); 
          addLog(lang === 'tr' ? `${TEAM_INFO[currentTeam.id].name} bonus kaptı!` : `${TEAM_INFO[currentTeam.id].name} got bonus!`); 
          triggerRemoteEvent({ type: 'confetti' }); nextTurn(); 
      } else if (cardType === 'obstacle') { 
          const newTeams = teams.map((t, i) => i === currentTurn ? { ...t, heldObstacles: [...(t.heldObstacles || []), activeCard] } : t);
          syncGame({ teams: newTeams, activeCard: null });
          addLog(`${TEAM_INFO[currentTeam.id].name} bir Engel Kartı kazandı!`);
          nextTurn();
      } else { 
          const timer = cardType === 'easy' ? 60 : (cardType === 'final' ? 120 : 90);
          syncGame({ performanceTimer: timer, gameState: cardType === 'final' ? 'FINALS_PLAY' : 'PERFORM' }); setTimerKey(p => p + 1); 
      } 
  };
  
  const assignObstacleToRival = (targetId) => { const newTeams = teams.map(t => t.id === targetId ? { ...t, activeObstacles: [...t.activeObstacles, activeCard] } : t); syncGame({ teams: newTeams, activeCard: null }); nextTurn(); };
  const updateJuryScore = (delta) => { const newScore = Math.min(Math.max(juryScore+delta, -5), 15); syncGame({ juryScore: newScore }); playSynthSound('click', soundEnabled); };
  
  const submitManualVote = useCallback(() => { 
      playSynthSound('success', soundEnabled); 
      let finalScore = juryScore; 
      if(voteData.roleplay) finalScore += 2; if(voteData.obstacleOvercome) finalScore += 2; if(voteData.fail) finalScore = -2; finalScore += (voteData.bonusScore || 0); 
      
      let newHype = hypeMeter;
      if (isGoldenMic) { finalScore *= 2; addLog(UI[lang].goldenMic + "!"); newHype = 0; playSynthSound('hype', soundEnabled); triggerRemoteEvent({ type: 'confetti' }); } 
      else { newHype = Math.min(100, hypeMeter + (finalScore > 5 ? 20 : 5)); } 
      
      const newMood = finalScore > 3 ? 'happy' : (finalScore < 0 ? 'scared' : characterMood);
      const isFinal = gameState === 'FINALS_VOTE'; 
      const targetId = isFinal && finalists[finalTurnIndex] ? finalists[finalTurnIndex].id : currentTeam.id; 
      const newTeams = teams.map(t => t.id === targetId ? { ...t, score: t.score + finalScore, activeObstacles: [] } : t);
      
      syncGame({ teams: newTeams, juryScore: 0, hypeMeter: newHype, characterMood: newMood });
      setVoteData({ roleplay: false, obstacleOvercome: false, fail: false, bonusScore: 0 }); 
      
      if (isFinal) { 
          if (finalTurnIndex === 0) { syncGame({ finalTurnIndex: 1, currentTurn: teams.findIndex(t => t.id === finalists[1].id), gameState: 'FINALS_PREP' }); } 
          else calculateWinner(); 
      } else { 
          syncGame({ activeCard: null }); 
          if (newTeams.find(t=>t.id===currentTeam.id).pos === 35) setTimeout(checkFinals, 100); else nextTurn(); 
      } 
  }, [gameState, juryScore, voteData, finalists, finalTurnIndex, currentTeam, soundEnabled, isGoldenMic, hypeMeter, lang, teams, characterMood]);
  
  const finishPerformance = () => {
      if (gameState === 'FINALS_PLAY') { if (finalTurnIndex === 0) syncGame({ gameState: 'FINALS_TRANSITION' }); else syncGame({ gameState: 'FINALS_CASTING' }); } 
      else syncGame({ gameState: 'VOTE' });
  };

  const startNextFinalist = () => { syncGame({ finalTurnIndex: 1, currentTurn: teams.findIndex(t => t.id === finalists[1].id), gameState: 'FINALS_PREP' }); playSynthSound('click', soundEnabled); };
  const nextTurn = () => { syncGame({ gameState: 'ROLL', diceValue: null, currentTurn: (currentTurn + 1) % teams.length, characterMood: 'idle' }); };
  const prepareBonus = (bonusIndex) => syncGame({ playingBonus: currentTeam.bonuses[bonusIndex] });
  const executeBonusPower = () => {
      triggerRemoteEvent({ type: 'confetti' });
      let newTimer = performanceTimer;
      if (playingBonus.effect === 'time') { newTimer += 30; addLog(lang === 'tr' ? "+30 Saniye!" : "+30 Sec!"); } 
      else if (playingBonus.effect === 'score') { setVoteData(p => ({...p, bonusScore: (p.bonusScore || 0) + 2})); addLog(lang === 'tr' ? "Gizli +2 Puan!" : "Secret +2 Points!"); } 
      else { addLog(lang === 'tr' ? `${getLocalizedText(playingBonus.name, lang)} gücü!` : `${getLocalizedText(playingBonus.name, lang)} power!`); }
      const newTeams = teams.map(t => t.id === currentTeam.id ? { ...t, bonuses: t.bonuses.filter(b => b.id !== playingBonus.id) } : t);
      syncGame({ teams: newTeams, playingBonus: null, performanceTimer: newTimer });
  };

  // --- LOBBY & TEAM SELECT SCREEN RENDER ---
  if (gameState === 'LOBBY') {
      
      if (revealState.isActive) {
          const topBarTeams = revealState.selectedTeams.slice(0, revealState.currentIndex);
          const revealCurrentTeam = revealState.selectedTeams[revealState.currentIndex];

          return (
              <div className="h-screen w-full flex flex-col items-center justify-center bg-neutral-950 text-white relative overflow-hidden">
                  <div className="absolute inset-0 z-0 opacity-40 transition-opacity duration-1000" style={{backgroundImage: assets.bg ? `url(${assets.bg})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center'}}></div>
                  <div className="absolute inset-0 z-0 bg-gradient-to-t from-black via-transparent to-black/80 pointer-events-none"></div>

                  <div className="absolute top-12 w-full flex justify-center gap-4 z-20 px-4">
                      {topBarTeams.map((t, idx) => (
                          <div key={t.id} className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-white/40 overflow-hidden bg-black shadow-[0_0_15px_rgba(255,255,255,0.2)] animate-fade-in-up">
                               <AssetDisplay src={assets[`team${t.id}_idle`] || assets[`team${t.id}`]} className="w-full h-full object-cover object-top" />
                          </div>
                      ))}
                  </div>

                  <div className="relative z-10 flex flex-col items-center w-full px-4">
                      {revealState.isRolling ? (
                          <div className="text-center scale-110 sm:scale-125 mt-10">
                              <TeamDice3D winnerId={null} isRolling={true} assets={assets} teams={INITIAL_TEAMS} />
                              <div className="mt-12 text-xl sm:text-2xl font-black text-neon-blue animate-pulse tracking-widest">
                                  {revealState.currentIndex + 1}. TAKIM SEÇİLİYOR...
                              </div>
                          </div>
                      ) : (
                          <div className="flex flex-col items-center mt-10 animate-fade-in-up w-full max-w-md bg-black/60 p-6 sm:p-8 rounded-3xl border-2 border-white/10 backdrop-blur-md shadow-2xl">
                              <div className={`w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 ${revealCurrentTeam.border} overflow-hidden bg-black shadow-[0_0_30px_rgba(250,204,21,0.5)] mb-6`}>
                                  <AssetDisplay src={assets[`team${revealCurrentTeam.id}_happy`] || assets[`team${revealCurrentTeam.id}_idle`]} className="w-full h-full object-cover object-top" />
                              </div>
                              <h2 className={`text-4xl sm:text-5xl font-black mb-2 ${revealCurrentTeam.text} drop-shadow-lg tracking-widest uppercase`}>{TEAM_INFO[revealCurrentTeam.id].name}</h2>
                              <p className="text-lg sm:text-xl text-yellow-400 font-bold mb-4 tracking-widest uppercase text-center">{getLocalizedText(TEAM_INFO[revealCurrentTeam.id].desc, lang)}</p>
                              <p className="text-center text-gray-300 text-base sm:text-lg italic bg-black/40 p-4 rounded-xl border border-gray-700 w-full shadow-inner">"{getLocalizedText(TEAM_INFO[revealCurrentTeam.id].longDesc, lang)}"</p>
                              
                              <div className="mt-8 px-6 py-2 bg-white/10 rounded-full text-sm sm:text-base text-gray-300 animate-pulse font-bold tracking-widest border border-white/5">⏳ SIRADAKİ BEKLENİYOR...</div>
                          </div>
                      )}
                  </div>
              </div>
          );
      }

      if (teamSelectMode) {
          return (
              <div className="h-screen w-full flex flex-col items-center justify-center bg-neutral-950 text-white px-4 text-center relative overflow-hidden">
                  <div className="absolute inset-0 z-0 opacity-40 transition-opacity duration-1000" style={{backgroundImage: assets.bg ? `url(${assets.bg})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center'}}></div>
                  <div className="absolute inset-0 z-0 bg-gradient-to-t from-black via-transparent to-black/80 pointer-events-none"></div>
                  
                  <div className="relative z-10 flex flex-col items-center w-full mt-8 px-2">
                      <h2 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600 mb-8 tracking-widest drop-shadow-md">KAÇ TAKIM OLACAK?</h2>
                      <div className="flex flex-col gap-4 w-full max-w-[90vw] sm:max-w-sm">
                          {[2, 3, 4].map(count => (
                              <button key={count} onClick={() => handleTeamSelection(count, teamSelectMode)} className="w-full py-5 px-4 bg-black/60 backdrop-blur-md border-2 border-gray-600 hover:border-yellow-400 text-white font-black text-2xl rounded-2xl active:scale-95 transition shadow-lg flex items-center justify-between overflow-hidden">
                                  <div className="flex items-center gap-3">
                                      <Users size={28} className="text-yellow-500" />
                                      <span>{count} TAKIM</span>
                                  </div>
                                  <div className="flex -space-x-3">
                                      {[...Array(count)].map((_, i) => (
                                          <div key={i} className="w-10 h-10 rounded-full border-2 border-white/20 flex items-center justify-center bg-black shadow-md overflow-hidden relative" style={{ zIndex: 10 - i }}>
                                              <AssetDisplay src={assets[`team${i}_idle`] || assets[`team${i}`]} className="w-full h-full object-cover object-top" />
                                          </div>
                                      ))}
                                  </div>
                              </button>
                          ))}
                      </div>
                      <button onClick={() => setTeamSelectMode(null)} className="mt-8 text-gray-400 font-bold underline px-6 py-2 rounded-full hover:bg-white/10 transition">Geri Dön</button>
                  </div>
              </div>
          )
      }

      return (
          <div className="h-screen w-full flex flex-col items-center justify-center bg-neutral-950 text-white px-4 text-center selection:bg-neon-pink relative overflow-hidden">
              {isAppLoading && (
                  <div className="fixed inset-0 z-[999] bg-black flex flex-col items-center justify-center transition-opacity duration-500 px-4">
                      {assets.logo ? (
                          <img src={assets.logo} alt="Loading Logo" className="w-48 sm:w-64 mb-6 animate-pulse drop-shadow-[0_0_20px_rgba(250,204,21,0.8)] object-contain" />
                      ) : (
                          <Theater size={80} className="text-yellow-500 animate-pulse mb-6 drop-shadow-[0_0_20px_rgba(250,204,21,0.8)]" />
                      )}
                      <h1 className="text-2xl sm:text-3xl font-black text-yellow-400 tracking-widest animate-bounce mt-4">YÜKLENİYOR...</h1>
                      <div className="mt-8 w-48 sm:w-64 h-3 bg-gray-800 rounded-full overflow-hidden border border-white/20">
                          <div className="h-full bg-gradient-to-r from-yellow-600 to-yellow-300 animate-loading-bar"></div>
                      </div>
                  </div>
              )}
              <div className="absolute inset-0 z-0 opacity-40 transition-opacity duration-1000" style={{backgroundImage: assets.bg ? `url(${assets.bg})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center'}}></div>
              <div className="absolute inset-0 z-0 bg-gradient-to-t from-black via-transparent to-black/80 pointer-events-none"></div>
              
              <div className="relative z-10 flex flex-col items-center w-full mt-8 px-2">
                  {assets.logo ? (
                      <img src={assets.logo} alt="DOĞAÇLA" className="w-48 sm:w-64 md:w-80 max-w-[80vw] mb-6 drop-shadow-[0_0_20px_rgba(250,204,21,0.6)] object-contain" />
                  ) : (
                      <>
                          <Theater size={80} className="text-yellow-500 mb-6 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
                          <h1 className="text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600 mb-2 tracking-widest leading-none drop-shadow-2xl">DOĞAÇLA</h1>
                      </>
                  )}
                  <p className="text-gray-300 font-bold tracking-[0.3em] mb-12 uppercase text-xs drop-shadow-md">Mobile Edition</p>
                  
                  <div className="flex flex-col gap-4 w-full max-w-[90vw] sm:max-w-sm">
                      <button onClick={promptSinglePlayer} className="w-full py-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-black text-lg sm:text-xl rounded-2xl shadow-[0_0_20px_rgba(168,85,247,0.3)] active:scale-95 transition">TEK OYUNCULU OYNA</button>
                      
                      <div className="relative flex items-center py-2">
                          <div className="flex-grow border-t border-gray-800"></div><span className="flex-shrink-0 mx-4 text-gray-400 font-black text-[10px] sm:text-xs tracking-widest">ÇOK OYUNCULU</span><div className="flex-grow border-t border-gray-800"></div>
                      </div>

                      {!user ? ( 
                          authError ? (
                              <div className="text-red-500 text-xs font-bold bg-red-900/50 p-4 rounded-xl border border-red-500/50">
                                  HATA: {authError}
                                  <br/><br/>Eğer telefondaysan Firebase panelinden "Authentication &gt; Sign-in method &gt; Anonymous" iznini açtığından emin ol!
                              </div>
                          ) : (
                              <div className="animate-pulse text-neon-blue font-bold tracking-widest text-xs sm:text-sm py-4">Sunucuya Bağlanıyor... <br/><span className="text-[10px] text-gray-400 block mt-2">(Uzun sürerse 'Tek Oyunculu' devam edebilirsiniz)</span></div> 
                          )
                      ) : (
                          <>
                              <button onClick={promptMultiPlayer} className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-black font-black text-lg sm:text-xl rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.3)] active:scale-95 transition">ODA KUR</button>
                              <div className="flex gap-2">
                                  <input value={joinCodeInput} onChange={e => setJoinCodeInput(e.target.value.toUpperCase())} placeholder="ODA KODU" maxLength={4} className="flex-1 bg-black/60 backdrop-blur-md text-white text-center font-black text-xl sm:text-2xl rounded-2xl border-2 border-gray-700 focus:border-neon-blue outline-none uppercase placeholder:text-gray-500 tracking-widest transition shadow-inner" />
                                  <button onClick={() => joinRoom(joinCodeInput)} disabled={joinCodeInput.length !== 4} className="px-6 py-4 bg-blue-600 disabled:bg-gray-800 text-white font-black text-base sm:text-lg rounded-2xl active:scale-95 transition disabled:active:scale-100 shadow-[0_0_20px_rgba(37,99,235,0.3)] disabled:shadow-none">KATIL</button>
                              </div>
                          </>
                      )}
                  </div>
              </div>
          </div>
      );
  }

  // --- TAKIM ATAMA ZARI EKRANI (YEREL) ---
  const renderLocalDice = () => {
      if (!localDiceState.isRolling && localDiceState.teamIndex === null && !localDiceState.showReveal) return null;

      if (localDiceState.showReveal && localDiceState.teamIndex !== null) {
          const assignedTeam = teams[localDiceState.teamIndex];
          return (
              <div className="fixed inset-0 bg-black/95 z-[120] flex items-center justify-center backdrop-blur-md px-4">
                  <ConfettiExplosion />
                  <div className="flex flex-col items-center animate-fade-in-up w-full max-w-md bg-black/60 p-6 sm:p-8 rounded-3xl border-2 border-[#D4AF37] shadow-[0_0_50px_rgba(212,175,55,0.4)]">
                      <h2 className="text-xl text-gray-400 font-bold tracking-widest mb-4 uppercase">SENİN TAKIMIN</h2>
                      <div className={`w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 ${assignedTeam.border} overflow-hidden bg-black shadow-[0_0_30px_rgba(250,204,21,0.5)] mb-6`}>
                          <AssetDisplay src={assets[`team${assignedTeam.id}_happy`] || assets[`team${assignedTeam.id}_idle`]} className="w-full h-full object-cover object-top" />
                      </div>
                      <h2 className={`text-4xl sm:text-5xl font-black mb-2 ${assignedTeam.text} drop-shadow-lg tracking-widest uppercase`}>{TEAM_INFO[assignedTeam.id].name}</h2>
                      <p className="text-center text-gray-300 text-sm sm:text-base italic bg-black/40 p-4 rounded-xl border border-gray-700 w-full mt-2">"{getLocalizedText(TEAM_INFO[assignedTeam.id].desc, lang)}"</p>
                  </div>
              </div>
          );
      }

      return (
          <div className="fixed inset-0 bg-black/95 z-[110] flex items-center justify-center backdrop-blur-md">
              <div className="text-center scale-110">
                  <TeamDice3D winnerId={localDiceState.isRolling ? null : localDiceState.teamIndex} isRolling={localDiceState.isRolling} assets={assets} teams={teams} />
                  <div className="mt-12 text-2xl font-black text-neon-blue tracking-widest">
                      {localDiceState.isRolling ? <span className="animate-pulse">TAKIMIN SEÇİLİYOR...</span> : "İŞTE TAKIMIN!"}
                  </div>
              </div>
          </div>
      )
  };

  return (
    <div className="h-screen w-full font-sans flex flex-col overflow-hidden text-gray-100 bg-neutral-950 selection:bg-neon-pink selection:text-white relative">
      <style>{`
        /* MOBILE OPTIMIZATIONS & VIDEO CSS HACKS */
        * { -webkit-tap-highlight-color: transparent; -webkit-touch-callout: none; -webkit-user-select: none; user-select: none; }
        textarea, input { -webkit-user-select: auto; user-select: auto; }
        body { overscroll-behavior-y: none; touch-action: pan-y; overflow: hidden; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .text-neon-blue { color: #00f3ff; text-shadow: 0 0 10px rgba(0,243,255,0.7); }
        .animate-pulse-fast { animation: pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-10px); } 100% { transform: translateY(0px); } }
        .animate-float { animation: float 6s ease-in-out infinite; }
        @keyframes loadingBar { 0% { width: 0%; } 100% { width: 100%; } }
        .animate-loading-bar { animation: loadingBar 2.5s ease-in-out forwards; }
        
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

        /* HIDING IOS NATIVE VIDEO PLAY BUTTONS COMPLETELY */
        video::-webkit-media-controls { display: none !important; opacity: 0 !important; visibility: hidden !important; }
        video::-webkit-media-controls-start-playback-button { display: none !important; -webkit-appearance: none !important; }
        video::-webkit-media-controls-play-button { display: none !important; -webkit-appearance: none !important; }
        video { outline: none; border: none; }

        .scene { perspective: 600px; }
        .cube { position: relative; transform-style: preserve-3d; transition: transform 1.2s cubic-bezier(0.25, 1, 0.5, 1); }
        .cube__face { position: absolute; }
        .cube__face--1 { transform: rotateY(0deg) translateZ(64px); }
        .cube__face--2 { transform: rotateY(180deg) translateZ(64px); }
        .cube__face--3 { transform: rotateY(90deg) translateZ(64px); }
        .cube__face--4 { transform: rotateY(-90deg) translateZ(64px); }
        .cube__face--5 { transform: rotateX(90deg) translateZ(64px); }
        .cube__face--6 { transform: rotateX(-90deg) translateZ(64px); }
        .show-1 { transform: translateZ(-64px) rotateY(0deg); }
        .show-2 { transform: translateZ(-64px) rotateY(-180deg); }
        .show-3 { transform: translateZ(-64px) rotateY(-90deg); }
        .show-4 { transform: translateZ(-64px) rotateY(90deg); }
        .show-5 { transform: translateZ(-64px) rotateX(-90deg); }
        .show-6 { transform: translateZ(-64px) rotateX(90deg); }
        .rolling, .kura-rolling { 
          animation: spinCube 0.8s infinite linear !important; 
          transition: none !important; 
        }
        @keyframes spinCube { 
          0% { transform: translateZ(-64px) rotateX(0deg) rotateY(0deg) rotateZ(0deg); } 
          100% { transform: translateZ(-64px) rotateX(720deg) rotateY(1080deg) rotateZ(360deg); } 
        }
      `}</style>
      
      {confetti && <ConfettiExplosion />}
      {randomEvent && <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-[80] animate-bounce bg-black/80 px-6 py-2 rounded-full border border-white/20 backdrop-blur-md whitespace-nowrap"><span className={`text-lg font-black ${randomEvent.color} drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]`}>{randomEvent.msg}</span></div>}
      
      {/* BİLDİRİM (TOAST) MESAJI */}
      {toastMsg && (
          <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-[100] bg-green-500 text-white px-6 py-3 rounded-full font-black text-sm shadow-[0_0_20px_rgba(34,197,94,0.6)] animate-bounce whitespace-nowrap border-2 border-green-300">
              {toastMsg}
          </div>
      )}

      {/* YEREL ZAR MODALI (Takım seçimi için) */}
      {renderLocalDice()}

      <div className="absolute inset-0 z-0 opacity-40 transition-opacity duration-1000" style={{backgroundImage: assets.bg ? `url(${assets.bg})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center'}}></div>
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-black via-transparent to-black/80 pointer-events-none"></div>

      {/* KİŞİSEL KİMLİK KARTI (HUD) - Sadece Lobi haricinde ve takımı belliyse görünür */}
      {myTeam && gameState !== 'LOBBY' && gameState !== 'INTRO' && (
         <div className="fixed top-16 right-2 sm:right-4 z-50 bg-black/80 border border-gray-600 rounded-xl p-2 flex items-center gap-2 shadow-lg backdrop-blur-md pointer-events-none">
            <div className={`w-8 h-8 rounded-full border-2 ${myTeam.border} overflow-hidden shadow-inner bg-black`}>
               <AssetDisplay src={assets[`team${myTeam.id}_idle`]} />
            </div>
            <div className="flex flex-col pr-2 border-r border-gray-700">
               <span className={`text-[10px] font-black leading-none uppercase ${myTeam.text}`}>{TEAM_INFO[myTeam.id].name}</span>
               <span className="text-yellow-400 text-[10px] font-bold mt-1 leading-none">{myTeam.score} Puan</span>
            </div>
            <div className="flex gap-2 pl-1">
               <div className="flex flex-col items-center"><Sparkles size={12} className="text-blue-400 mb-0.5"/><span className="text-[10px] text-white font-bold">{myTeam.bonuses?.length || 0}</span></div>
               <div className="flex flex-col items-center"><Skull size={12} className="text-red-500 mb-0.5"/><span className="text-[10px] text-white font-bold">{myTeam.heldObstacles?.length || 0}</span></div>
            </div>
         </div>
      )}

      {showDiceModal && <div className="fixed inset-0 bg-black/90 z-[80] flex items-center justify-center backdrop-blur-md"><div className="text-center scale-110">{gameState === 'KURA' ? <TeamDice3D winnerId={kuraRolling ? null : currentTurn} isRolling={kuraRolling} assets={assets} teams={teams} /> : <Dice3D value={isRollingDice ? null : (diceValue > 6 ? 6 : diceValue)} isRolling={isRollingDice} />}<div className="mt-12 text-2xl font-black text-neon-blue animate-pulse tracking-widest">{kuraRolling ? UI[lang].drawingLots : UI[lang].rollingDice}</div></div></div>}
      
      {/* FLOATING HEADER (MOBILE) */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-black/50 border-b border-white/10 flex items-center justify-between px-2 sm:px-3 z-40 backdrop-blur-lg">
          <div className="flex items-center gap-1 sm:gap-2">
              {assets.logo ? (
                  <img src={assets.logo} alt="Logo" className="h-8 sm:h-10 w-auto object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"/>
              ) : (
                  <>
                      <Theater size={24} className="text-yellow-500"/>
                      <span className="font-black text-sm sm:text-base tracking-[0.1em] text-white">DOĞAÇLA</span>
                  </>
              )}
              {roomId && !isSinglePlayer && <span className="ml-1 px-1.5 py-0.5 bg-gray-800 text-yellow-400 text-[9px] sm:text-[10px] font-mono font-bold rounded border border-yellow-500/30 tracking-widest">ODA:{roomId}</span>}
              {isSinglePlayer && <span className="ml-1 px-1.5 py-0.5 bg-gray-800 text-purple-400 text-[9px] sm:text-[10px] font-mono font-bold rounded border border-purple-500/30 tracking-widest flex items-center gap-1"><User size={10}/> TEKLİ</span>}
          </div>
          
          <div className="flex-1 max-w-[60px] sm:max-w-[80px] mx-2 relative">
              <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden border border-gray-600 relative">
                  <div className={`h-full transition-all duration-700 ${isGoldenMic ? 'bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-300 animate-pulse-fast' : 'bg-gradient-to-r from-blue-900 to-blue-500'}`} style={{ width: `${hypeMeter}%` }}></div>
              </div>
          </div>
          
          <div className="flex items-center gap-1 sm:gap-2">
              <button onClick={() => setSoundEnabled(!soundEnabled)} className="p-1.5 sm:p-2 text-gray-300 hover:text-white transition bg-white/10 rounded-lg">{soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}</button>
              <button onClick={() => setShowRules(true)} className="p-1.5 sm:p-2 text-gray-300 hover:text-yellow-400 transition bg-white/10 rounded-lg"><HelpCircle size={18} /></button>
              <button onClick={() => setShowLogsMenu(true)} className="p-1.5 sm:p-2 text-gray-300 hover:text-white transition bg-white/10 rounded-lg"><List size={18} /></button>
              
              {/* ANA MENÜYE DÖNÜŞ (LOBİ) BUTONU */}
              {gameState !== 'LOBBY' && (
                  <button onClick={resetGame} className="p-1.5 sm:p-2 text-white hover:text-red-400 transition bg-red-600/50 hover:bg-red-600/80 rounded-lg ml-1 shadow-lg border border-red-500/50">
                      <Home size={18} />
                  </button>
              )}
          </div>
      </header>

      {/* HISTORY (LOGS) MODAL */}
      {showLogsMenu && (
         <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/80 backdrop-blur-sm" onClick={() => setShowLogsMenu(false)}>
             <div className="w-full h-[50vh] bg-gray-900 rounded-t-3xl border-t border-[#D4AF37]/30 p-4 shadow-2xl flex flex-col" onClick={e=>e.stopPropagation()}>
                 <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-2">
                     <h3 className="font-bold text-[#D4AF37] flex items-center gap-2"><History size={18}/> {UI[lang].logs}</h3>
                     <button onClick={() => setShowLogsMenu(false)} className="text-gray-400"><X size={24}/></button>
                 </div>
                 <div className="flex-1 overflow-y-auto text-sm font-mono space-y-2 no-scrollbar pb-safe">
                     {logs.map((l, i) => <div key={i} className="text-gray-300 border-l-2 border-neon-blue/50 pl-2 py-1">{l}</div>)}
                 </div>
             </div>
         </div>
      )}
      
      {/* MAIN SCROLLABLE BOARD AREA */}
      <main className="flex-1 overflow-y-auto no-scrollbar pt-20 pb-72 px-2 z-10 relative">
        {reactions.map(r => <FloatingReaction key={r.id} {...r} onComplete={removeReaction} />)}
        
        {gameState === 'INTRO' && (
            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 rounded-2xl h-full backdrop-blur-sm px-4">
                {assets.logo ? (
                    <img src={assets.logo} alt="DOĞAÇLA" className="w-40 sm:w-56 md:w-64 max-w-[70vw] mb-4 animate-pulse drop-shadow-[0_0_30px_rgba(250,204,21,0.5)] object-contain" />
                ) : (
                    <h1 className="text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600 animate-pulse mb-2 text-center leading-none">DOĞAÇLA<br/><span className="text-xl sm:text-2xl text-white tracking-widest font-light">ACT I</span></h1>
                )}

                {/* ODA KODU VE DAVET LİNKİ ALANI */}
                {roomId && !isSinglePlayer && (
                    <div className="mt-4 flex flex-col items-center bg-gray-900/80 p-4 sm:p-5 rounded-3xl border-2 border-yellow-500/30 shadow-[0_0_30px_rgba(0,0,0,0.8)] backdrop-blur-md max-w-full">
                        <div className="text-gray-400 text-[10px] sm:text-xs tracking-[0.2em] mb-1 font-bold text-center">DAVET KODUNUZ</div>
                        <div className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 tracking-widest mb-4 drop-shadow-lg text-center">{roomId}</div>
                        <button onClick={() => {
                            const inviteText = `🎭 DOĞAÇLA oyununa davetlisin!\nOyuna gir ve Çok Oyunculu bölümünden şu oda kodunu yazarak bana katıl: ${roomId}`;
                            navigator.clipboard.writeText(inviteText).catch(() => {
                                const ta = document.createElement('textarea'); ta.value = inviteText; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
                            });
                            setToastMsg("✅ Davet Kodu Kopyalandı! Arkadaşına gönder.");
                            setTimeout(() => setToastMsg(null), 3000);
                        }} className="px-4 sm:px-6 py-2 sm:py-3 w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-black text-sm sm:text-base active:scale-95 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                            <Copy size={16} /> Davet Kodunu Kopyala
                        </button>
                    </div>
                )}

                {/* TAKIM TABLOSU VE OYUNCU SAYILARI */}
                <div className="w-full max-w-[95vw] sm:max-w-md mt-6">
                    <div className="flex justify-between items-end mb-2 px-1">
                        <div className="text-yellow-400 font-bold text-[10px] sm:text-xs tracking-widest">SAHADAKİ TAKIMLAR</div>
                        {roomId && !isSinglePlayer && (
                            <div className="bg-blue-900/50 border border-blue-500/50 px-2 py-1 rounded-md text-neon-blue font-black text-[10px] sm:text-xs tracking-widest flex items-center gap-1 shadow-[0_0_10px_rgba(0,243,255,0.3)]">
                                <Users size={12} /> AKTİF OYUNCU: {totalPlayers}
                            </div>
                        )}
                    </div>
                    <div className="flex justify-center gap-2">
                        {teams.map(t => {
                            const count = isSinglePlayer ? 1 : Object.values(players).filter(id => id === t.id).length;
                            const isMyTeam = players[user?.uid] === t.id;
                            return (
                                <div key={t.id} className={`flex-1 p-3 rounded-2xl border-2 ${t.border} bg-black/80 flex flex-col items-center shadow-[0_0_15px_rgba(0,0,0,0.5)] relative overflow-hidden`}>
                                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-white/20 mb-2 bg-black shadow-inner">
                                        <AssetDisplay src={assets[`team${t.id}_idle`] || assets[`team${t.id}`]} className="w-full h-full object-cover object-top" />
                                    </div>
                                    <div className={`text-[10px] sm:text-xs font-black tracking-widest uppercase ${t.text}`}>{TEAM_INFO[t.id].name}</div>
                                    <div className="text-white font-black text-xl sm:text-2xl mt-1 leading-none">{count} <span className="text-[10px] sm:text-xs font-normal text-gray-400">Kişi</span></div>
                                    {isMyTeam && (
                                        <div className="absolute top-1 right-1 flex items-center justify-center">
                                            <Star size={14} className="text-yellow-400 fill-current animate-pulse" />
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* ZAR ATMA, HAZIR OL VEYA BAŞLATMA BUTONLARI */}
                {roomId && !isSinglePlayer && players[user?.uid] === undefined ? (
                    <button onClick={joinTeamWithDice} className="mt-8 px-8 py-4 sm:py-5 w-full max-w-[90vw] sm:max-w-sm bg-gradient-to-r from-purple-600 to-neon-blue text-white font-black text-lg sm:text-xl rounded-full shadow-[0_0_30px_rgba(0,243,255,0.5)] active:scale-95 transition tracking-widest flex justify-center items-center gap-3">
                        <Dices size={28} className="animate-bounce" /> TAKIM İÇİN ZAR AT
                    </button>
                ) : (
                    <div className="flex flex-col items-center w-full mt-6">
                        {roomId && !isSinglePlayer && (
                             <div className="text-white font-bold text-xs sm:text-sm text-center bg-gray-900 px-6 py-2 rounded-full border border-gray-600 mb-4 flex items-center gap-2 shadow-inner">
                                 Durum: <span className={isEveryoneReady ? "text-green-400" : "text-yellow-400"}>{readyCount} / {totalPlayers} Hazır</span>
                             </div>
                        )}

                        {roomId && !isSinglePlayer && !amIReady && (
                             <button onClick={() => { playSynthSound('success', soundEnabled); syncGame({ readyPlayers: { ...readyPlayers, [user?.uid]: true } }); }} className="px-8 py-4 w-full max-w-[90vw] sm:max-w-sm bg-gradient-to-r from-green-500 to-emerald-600 text-white font-black text-lg sm:text-xl rounded-full shadow-[0_0_30px_rgba(16,185,129,0.4)] active:scale-95 transition tracking-widest flex justify-center items-center gap-2">
                                 HAZIR OL
                             </button>
                        )}

                        {roomId && !isSinglePlayer && amIReady && !isHost && (
                             <div className="text-green-400 font-bold animate-pulse text-sm sm:text-base text-center bg-green-900/20 p-4 rounded-2xl border border-green-500/30 w-full max-w-[90vw] sm:max-w-sm shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                                 ✅ HAZIR (Kurucu bekleniyor...)
                             </div>
                        )}

                        {roomId && !isSinglePlayer && amIReady && isHost && !isEveryoneReady && (
                             <div className="text-yellow-400 font-bold animate-pulse text-sm sm:text-base text-center bg-yellow-900/20 p-4 rounded-2xl border border-yellow-500/30 w-full max-w-[90vw] sm:max-w-sm shadow-[0_0_15px_rgba(250,204,21,0.2)]">
                                 ⏳ Herkesin hazır olması bekleniyor...
                             </div>
                        )}

                        {(isSinglePlayer || (isHost && isEveryoneReady)) && (
                            <button onClick={startKura} className="px-10 sm:px-12 py-4 sm:py-5 w-full max-w-[90vw] sm:max-w-sm bg-white text-black font-black text-xl sm:text-2xl rounded-full shadow-[0_0_30px_rgba(255,255,255,0.4)] active:scale-95 transition tracking-widest flex justify-center items-center gap-2">
                                {roomId && !isSinglePlayer ? "OYUNU BAŞLAT" : UI[lang].start}
                            </button>
                        )}
                    </div>
                )}
            </div>
        )}
        
        {gameState !== 'INTRO' && (
            <div className="grid grid-cols-4 gap-2 max-w-lg mx-auto">
                {BOARD_MAP.map((sq, i) => { 
                    let baseStyle = "bg-gray-900/60 border-gray-700/50"; let glow = ""; let icon = null; 
                    if(sq.type==='easy') { baseStyle="bg-green-900/40 border-green-500/30"; glow="shadow-[0_0_10px_rgba(34,197,94,0.1)]"; } 
                    if(sq.type==='medium') { baseStyle="bg-yellow-900/40 border-yellow-500/30"; glow="shadow-[0_0_10px_rgba(234,179,8,0.1)]"; } 
                    if(sq.type==='hard') { baseStyle="bg-red-900/40 border-red-500/30"; glow="shadow-[0_0_10px_rgba(239,68,68,0.1)]"; } 
                    if(sq.type==='final') { baseStyle="bg-purple-900/60 border-purple-500"; glow="shadow-[0_0_20px_rgba(168,85,247,0.4)]"; icon=<Crown size={18} className="text-purple-300"/>; } 
                    if(sq.type==='obstacle') { baseStyle="bg-gray-800/80 border-gray-600"; icon=<Skull size={16} className="text-gray-400"/>; } 
                    if(sq.type==='bonus') { baseStyle="bg-blue-900/50 border-blue-400/50"; icon=<Sparkles size={16} className="text-blue-300"/>; } 
                    const playersHere = teams.filter(t => t.pos === i);
                    
                    return (
                        <div key={i} className={`aspect-square rounded-xl border ${baseStyle} relative flex flex-col items-center justify-center transition-all duration-300 ${glow} backdrop-blur-sm overflow-hidden`}>
                            <span className="absolute top-1 left-1 text-[8px] sm:text-[10px] uppercase font-bold text-white/40">{UI[lang][sq.type] || sq.type}</span>
                            <span className="absolute top-1 right-1 text-[8px] sm:text-[10px] font-mono opacity-30">{i}</span>
                            {icon && <div className="absolute bottom-1 right-1 opacity-40">{icon}</div>}
                            
                            <div className="absolute inset-0 flex items-center justify-center p-1 pointer-events-none z-20 mt-3">
                                <div className={`w-full h-full flex flex-wrap items-center justify-center gap-1`}>
                                    {playersHere.map((p) => (
                                        <div key={p.id} className={`relative w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white shadow-lg ${p.color} flex items-center justify-center overflow-hidden bg-black transition-all duration-300 ${currentTeam.id === p.id ? 'scale-125 ring-4 ring-white/50 animate-pulse z-30' : 'z-10'} max-w-full max-h-full`}>
                                            {(assets[`team${p.id}`] || assets[`team${p.id}_idle`]) ? <AssetDisplay src={assets[`team${p.id}`] || assets[`team${p.id}_idle`]} className="w-full h-full object-cover object-top" alt={`P${p.id}`} /> : <span className="text-[14px] sm:text-[16px]">{p.icon}</span>}
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

      {/* BOTTOM ACTION SHEET */}
      {gameState !== 'END' && gameState !== 'INTRO' && gameState !== 'KURA' && !gameState.startsWith('FINALS_') && (
          <footer className="fixed bottom-0 left-0 w-full bg-black/90 backdrop-blur-xl border-t border-white/10 rounded-t-3xl z-40 p-4 pb-8 flex flex-col shadow-[0_-10px_30px_rgba(0,0,0,0.6)]">
              <div className="flex items-center gap-3 mb-4">
                  <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 ${currentTeam.border} overflow-hidden bg-black shrink-0 relative shadow-[0_0_20px_rgba(0,0,0,0.8)]`}>
                      <AssetDisplay src={getCurrentCharacterAsset()} className="w-full h-full object-cover object-top" />
                      <div className="absolute top-0 right-0 text-xl sm:text-2xl animate-bounce drop-shadow-lg">{characterMood === 'happy' && '😂'}{characterMood === 'thinking' && '🤔'}{characterMood === 'scared' && '😱'}</div>
                  </div>
                  <div className="flex flex-col flex-1 pl-2">
                      <span className="text-[10px] sm:text-xs text-gray-400 uppercase font-bold tracking-wider">{UI[lang].onStageNow}</span>
                      <span className={`font-black text-2xl sm:text-3xl leading-none ${currentTeam.text}`}>{TEAM_INFO[currentTeam.id].name}</span>
                  </div>
                  <div className="text-right pr-2">
                      <div className="text-[10px] sm:text-xs text-gray-400 uppercase font-bold">Puan</div>
                      <div className="font-mono font-black text-3xl sm:text-4xl text-yellow-500 leading-none">{currentTeam.score}</div>
                  </div>
              </div>

              {currentTeam.activeObstacles.length > 0 && (
                  <div className="w-full p-3 mb-4 bg-red-500/20 border border-red-500/50 rounded-xl flex gap-2 items-center animate-pulse">
                      <AlertTriangle className="text-red-500 shrink-0" size={20}/>
                      <div className="text-sm font-bold text-white line-clamp-1">{getLocalizedText(currentTeam.activeObstacles[0].text, lang)}</div>
                  </div>
              )}

              <div className="w-full flex-1 flex flex-col justify-end">
                  {gameState === 'ROLL' && (
                      isMyTurn ? (
                          <button onClick={rollDice} className="w-full py-4 sm:py-5 bg-gradient-to-r from-neon-blue to-blue-600 text-white text-2xl sm:text-3xl font-black rounded-2xl shadow-[0_0_30px_rgba(0,243,255,0.4)] flex items-center justify-center gap-3 active:scale-95 transition-all uppercase tracking-widest">
                              <Dices size={36} className="animate-bounce" /> {UI[lang].rollDice}
                          </button>
                      ) : (
                          <div className="w-full py-4 sm:py-5 bg-gray-800 text-gray-400 text-lg sm:text-xl font-black rounded-2xl flex items-center justify-center gap-3 border-2 border-gray-700 shadow-inner">
                              ⏳ {TEAM_INFO[currentTeam.id].name} Zar Atıyor...
                          </div>
                      )
                  )}
                  {gameState === 'MOVING' && <div className="text-neon-blue font-black animate-pulse text-center text-xl sm:text-2xl tracking-[0.2em] py-5">{UI[lang].enteringStage}</div>}
                  {gameState === 'TARGET_OBSTACLE' && (
                      isMyTurn ? (
                          <div className="w-full overflow-x-auto flex gap-2 no-scrollbar">
                              {teams.filter(t => t.id !== currentTeam.id).map(t => (
                                  <button key={t.id} onClick={() => assignObstacleToRival(t.id)} className={`flex-1 min-w-[100px] p-4 rounded-xl border-2 border-gray-700 bg-gray-800 flex flex-col items-center gap-2 active:bg-red-900/40 active:border-red-500 transition`}>
                                      <ShieldAlert size={28} className="text-red-500"/><span className="text-sm sm:text-base font-black whitespace-nowrap">{TEAM_INFO[t.id].name}</span>
                                  </button>
                              ))}
                          </div>
                      ) : (
                          <div className="w-full py-4 text-center font-bold text-gray-400 bg-gray-900 border border-gray-700 rounded-xl">⏳ {TEAM_INFO[currentTeam.id].name} hedef seçiyor...</div>
                      )
                  )}
                  {gameState === 'PERFORM' && (
                      <div className="w-full flex flex-col gap-4">
                          <div className="flex justify-between items-end px-2">
                              <div className="flex gap-2 sm:gap-3">
                                  <button onClick={() => addReaction('👏')} className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-green-600/20 border-2 border-green-500/50 flex items-center justify-center text-xl sm:text-2xl active:bg-green-500/40 shadow-lg">👏</button>
                                  <button onClick={() => addReaction('😂')} className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-yellow-600/20 border-2 border-yellow-500/50 flex items-center justify-center text-xl sm:text-2xl active:bg-yellow-500/40 shadow-lg">😂</button>
                              </div>
                              <Timer key={timerKey} duration={performanceTimer} onFinish={finishPerformance} soundEnabled={soundEnabled} />
                          </div>
                          {currentTeam.bonuses.length > 0 && (
                              <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                                  {currentTeam.bonuses.map((b, i) => (
                                      <button key={i} onClick={() => isMyTurn && prepareBonus(i)} className={`px-4 sm:px-5 py-2 sm:py-3 bg-purple-900 border-2 border-purple-500/80 rounded-xl font-bold text-xs sm:text-sm text-white whitespace-nowrap flex items-center gap-2 ${isMyTurn ? 'active:scale-95 shadow-md' : 'opacity-50'}`}>
                                          <Sparkles size={16}/> {getLocalizedText(b.name, lang)}
                                      </button>
                                  ))}
                              </div>
                          )}

                          {/* SABOTAJ / ENGEL FIRLATMA MENÜSÜ */}
                          {!isMyTurn && myTeam?.heldObstacles?.length > 0 && (
                              <div className="mt-2 border-t border-gray-700 pt-4">
                                  <div className="text-red-500 font-bold text-xs mb-2 text-center">😈 SABOTE ET (ENGEL FIRLAT)</div>
                                  <div className="flex gap-2 overflow-x-auto no-scrollbar">
                                      {myTeam.heldObstacles.map((obs, i) => (
                                          <button key={i} onClick={() => throwObstacle(i)} className="px-4 py-2 bg-red-900/50 border border-red-500 rounded-xl text-xs font-bold text-red-200 whitespace-nowrap active:scale-95 shadow-lg">
                                              <Skull size={14} className="inline mr-1"/> {getLocalizedText(obs.text, lang)}
                                          </button>
                                      ))}
                                  </div>
                              </div>
                          )}

                          {isMyTurn ? (
                              <button onClick={finishPerformance} className="w-full py-4 sm:py-5 bg-white/10 text-white rounded-2xl font-black uppercase tracking-widest active:bg-white/20 transition text-lg sm:text-xl border border-white/20">{UI[lang].finishPerf}</button>
                          ) : (
                              <div className="w-full py-4 sm:py-5 bg-black text-gray-400 rounded-2xl font-bold uppercase tracking-widest text-center border border-gray-800">🎭 Performans devam ediyor...</div>
                          )}
                      </div>
                  )}
                  {gameState === 'VOTE' && (
                      <div className="w-full flex flex-col gap-4">
                          {isMyTurn ? (
                              <div className="bg-gray-800 border-2 border-gray-600 p-6 rounded-2xl text-center shadow-inner">
                                  <Users size={48} className="mx-auto text-yellow-500 mb-4 animate-pulse" />
                                  <h3 className="text-xl sm:text-2xl font-black text-white mb-2 uppercase tracking-widest">JÜRİ KARAR VERİYOR</h3>
                                  <p className="text-gray-400 text-sm sm:text-base">Performansın değerlendiriliyor. Lütfen diğer takımların puan vermesini bekle...</p>
                              </div>
                          ) : (
                              <>
                                  <div className="flex gap-2 text-center">
                                      <button onClick={() => setVoteData(p => ({...p, roleplay: !p.roleplay}))} className={`flex-1 py-3 sm:py-4 rounded-xl text-[10px] sm:text-xs font-black border-2 transition ${voteData.roleplay ? 'bg-blue-600 border-blue-400 text-white shadow-[0_0_15px_blue]' : 'border-gray-700 text-gray-400'}`}>{UI[lang].role}</button>
                                      <button onClick={() => setVoteData(p => ({...p, obstacleOvercome: !p.obstacleOvercome}))} className={`flex-1 py-3 sm:py-4 rounded-xl text-[10px] sm:text-xs font-black border-2 transition ${voteData.obstacleOvercome ? 'bg-green-600 border-green-400 text-white shadow-[0_0_15px_green]' : 'border-gray-700 text-gray-400'}`}>{UI[lang].obstacleBtn}</button>
                                      <button onClick={() => setVoteData(p => ({...p, fail: !p.fail}))} className={`flex-1 py-3 sm:py-4 rounded-xl text-[10px] sm:text-xs font-black border-2 transition ${voteData.fail ? 'bg-red-600 border-red-400 text-white shadow-[0_0_15px_red]' : 'border-gray-700 text-gray-400'}`}>{UI[lang].fail}</button>
                                  </div>
                                  <div className="flex justify-between items-center px-4 py-2">
                                      <button onClick={() => updateJuryScore(-1)} className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-red-500/50 text-red-500 flex items-center justify-center active:bg-red-500/20 shadow-lg"><Minus size={28}/></button>
                                      <span className="text-6xl sm:text-7xl font-mono font-black text-white drop-shadow-xl">{juryScore}</span>
                                      <button onClick={() => updateJuryScore(1)} className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-green-500/50 text-green-500 flex items-center justify-center active:bg-green-500/20 shadow-lg"><Plus size={28}/></button>
                                  </div>
                                  <div className="flex gap-3">
                                      <button onClick={askAICritic} className="w-16 bg-purple-900/50 border-2 border-purple-500 text-purple-300 rounded-2xl flex items-center justify-center active:bg-purple-800 shadow-md" disabled={criticLoading}><Bot size={32}/></button>
                                      <button onClick={() => submitManualVote()} className="flex-1 py-4 sm:py-5 bg-white text-black font-black text-lg sm:text-xl rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.5)] active:scale-95 transition uppercase tracking-widest">{UI[lang].confirmScore}</button>
                                  </div>
                              </>
                          )}
                      </div>
                  )}
              </div>
          </footer>
      )}

      {/* FINALS PLAY PANEL */}
      {gameState === 'FINALS_PLAY' && (
          <footer className="fixed bottom-0 left-0 w-full bg-black/95 backdrop-blur-xl border-t-4 border-yellow-500 rounded-t-3xl z-40 p-4 pb-8 flex flex-col shadow-[0_-10px_40px_rgba(250,204,21,0.4)]">
              <div className="flex items-center gap-4 mb-4">
                  <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-yellow-400 overflow-hidden bg-black shrink-0 relative shadow-[0_0_20px_rgba(250,204,21,0.6)]`}><AssetDisplay src={assets[`team${currentTeam.id}_scared`]} className="w-full h-full object-cover object-top" /></div>
                  <div className="flex flex-col flex-1"><span className="text-[10px] sm:text-xs text-yellow-400 uppercase font-black tracking-widest">FİNAL PERFORMANSI</span><span className={`font-black text-2xl sm:text-3xl leading-none text-white mt-1`}>{TEAM_INFO[currentTeam.id].name}</span></div>
              </div>
              <div className="flex justify-between items-center bg-gray-900/50 p-4 sm:p-5 rounded-2xl border-2 border-yellow-500/30 shadow-inner">
                  <div className="text-sm sm:text-base text-yellow-500 font-bold uppercase tracking-widest">{UI[lang].time}</div>
                  <Timer key={timerKey} duration={performanceTimer} onFinish={finishPerformance} soundEnabled={soundEnabled} />
              </div>
              {isMyTurn ? (
                  <button onClick={finishPerformance} className="w-full mt-5 py-4 sm:py-5 bg-gradient-to-r from-yellow-500 to-orange-500 text-black rounded-2xl font-black text-lg sm:text-xl uppercase tracking-widest active:scale-95 shadow-[0_0_20px_rgba(250,204,21,0.5)]">{UI[lang].finishPerf}</button>
              ) : (
                  <div className="w-full mt-5 py-4 sm:py-5 bg-black text-gray-400 rounded-2xl font-bold uppercase tracking-widest text-center border border-gray-800">🎭 Final sahnesi oynanıyor...</div>
              )}
          </footer>
      )}

      {/* FULL SCREEN OVERLAYS (MODALS) */}
      {gameState === 'FINALS_DIRECTOR_INPUT' && directors.length > 0 && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/95 backdrop-blur-md px-4 pb-10">
               <Clapperboard size={80} className="text-yellow-400 mb-6 animate-pulse" />
               <h2 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 mb-3 tracking-widest text-center">{UI[lang].directorPromptTitle}</h2>
               <p className="text-base sm:text-lg text-gray-300 mb-8 text-center max-w-sm">{UI[lang].directorPromptDesc} <span className="text-yellow-400 font-black block mt-2 text-xl">{directors.map(d => TEAM_INFO[d.id].name).join(' & ')}</span></p>
               
               {amIDirector ? (
                   <>
                       <textarea value={directorInput} onChange={e => setDirectorInput(e.target.value)} placeholder="Örn: Uzaylı İstilası..." className="w-full max-w-[90vw] sm:max-w-sm h-36 bg-gray-900 border-2 border-yellow-500/50 rounded-2xl p-5 text-white text-lg sm:text-xl focus:outline-none focus:border-yellow-400 mb-8 resize-none shadow-inner" />
                       <button onClick={generateDraftMission} disabled={!directorInput.trim()} className="w-full max-w-[90vw] sm:max-w-sm py-4 sm:py-5 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-black text-xl sm:text-2xl rounded-full active:scale-95 disabled:opacity-50 transition shadow-[0_0_20px_rgba(250,204,21,0.5)]">{UI[lang].generateDraft}</button>
                   </>
               ) : (
                   <div className="w-full max-w-sm py-6 bg-gray-900 border border-yellow-500/50 rounded-2xl text-center">
                       <p className="text-yellow-500 font-bold animate-pulse">⏳ Yönetmenler senaryo yazıyor...</p>
                   </div>
               )}
          </div>
      )}

      {gameState === 'FINALS_DRAFT_REVIEW' && draftMission && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/95 backdrop-blur-md px-4">
               <Lightbulb size={64} sm:size={80} className="text-yellow-400 mb-6 animate-bounce" />
               <h2 className="text-3xl sm:text-4xl font-black text-yellow-400 mb-8 tracking-widest text-center">{UI[lang].aiDrafted}</h2>
               <div className="bg-gray-900 border-2 border-yellow-400/50 p-6 rounded-2xl w-full max-w-[90vw] sm:max-w-sm mb-8 max-h-[40vh] overflow-y-auto shadow-inner"><p className="text-white text-base sm:text-lg leading-relaxed italic text-center">"{getLocalizedText(draftMission, lang)}"</p></div>
               
               {amIDirector ? (
                   <div className="flex gap-4 w-full max-w-[90vw] sm:max-w-sm"><button onClick={generateDraftMission} className="p-4 sm:p-5 bg-gray-800 text-white rounded-2xl active:bg-gray-700 flex items-center justify-center border border-gray-600"><RefreshCw size={24}/></button><button onClick={approveAndGenerateOptions} className="flex-1 py-4 sm:py-5 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-black text-lg sm:text-xl rounded-2xl active:scale-95 shadow-[0_0_20px_rgba(250,204,21,0.5)]">{UI[lang].createAsIs}</button></div>
               ) : (
                   <div className="text-gray-400 font-bold">⏳ Yönetmen onayı bekleniyor...</div>
               )}
          </div>
      )}

      {gameState === 'FINALS_GENERATING' && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/95 backdrop-blur-md"><Bot size={80} sm:size={100} className="text-neon-blue mb-6 animate-bounce drop-shadow-[0_0_20px_rgba(0,243,255,0.8)]" /><h2 className="text-3xl sm:text-4xl font-black text-neon-blue tracking-widest animate-pulse text-center px-4">{draftMission ? UI[lang].generatingOptions : UI[lang].generatingDraft}</h2></div>
      )}

      {gameState === 'FINALS_SELECT_CARD' && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-start bg-black/95 backdrop-blur-md px-4 py-8 overflow-y-auto no-scrollbar">
               <h2 className="text-3xl sm:text-4xl font-black text-neon-blue mb-8 tracking-widest text-center sticky top-0 bg-black/95 py-4 w-full z-10 drop-shadow-md">{UI[lang].selectAICard}</h2>
               <div className="flex flex-col gap-5 w-full max-w-[90vw] sm:max-w-sm pb-10">
                   {aiCards.map((c, idx) => (
                       <div key={idx} onClick={() => amIDirector && selectFinalCard(c)} className={`bg-gray-900 border-2 border-yellow-500/50 rounded-3xl p-5 sm:p-6 transition-all shadow-[0_0_15px_rgba(250,204,21,0.3)] flex flex-col items-center text-center ${amIDirector ? 'active:scale-95 cursor-pointer' : 'opacity-70'}`}>
                           <h3 className="text-xl sm:text-2xl font-black text-yellow-400 mb-3">{getLocalizedText(c.title, lang)}</h3>
                           <p className="text-white text-base sm:text-lg mb-4 flex-1">"{getLocalizedText(c.mission, lang)}"</p>
                           <p className="text-xs sm:text-sm text-gray-400 italic border-t border-gray-700 pt-3 w-full">{getLocalizedText(c.desc, lang)}</p>
                       </div>
                   ))}
               </div>
               {!amIDirector && <div className="fixed bottom-10 px-6 py-3 bg-black/80 rounded-full border border-yellow-500/50 text-yellow-400 font-bold z-20 backdrop-blur-md">⏳ Yönetmen sahneyi seçiyor...</div>}
          </div>
      )}

      {gameState === 'FINALS_TRANSITION' && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/95 backdrop-blur-md px-4 text-center">
               <h2 className="text-4xl sm:text-5xl font-black text-white mb-10 tracking-widest">{UI[lang].transitionWait}</h2>
               <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full border-4 border-yellow-400 mb-12 overflow-hidden bg-black shadow-[0_0_40px_rgba(250,204,21,0.6)]"><AssetDisplay src={assets[`team${finalists[1].id}_idle`]} className="w-full h-full object-cover object-top" /></div>
               {isHost || isSinglePlayer ? (
                   <button onClick={startNextFinalist} className="w-full max-w-[90vw] sm:max-w-sm py-5 sm:py-6 bg-white text-black font-black text-xl sm:text-2xl rounded-full active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.5)]">{UI[lang].startNext} ({TEAM_INFO[finalists[1].id].name})</button>
               ) : (
                   <div className="text-yellow-400 font-bold animate-pulse text-lg">⏳ Kurucunun başlatması bekleniyor...</div>
               )}
          </div>
      )}

      {gameState === 'FINALS_CASTING' && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/95 backdrop-blur-md px-4 py-8 overflow-y-auto no-scrollbar">
               <Star size={80} sm:size={100} className="text-yellow-400 mb-6 animate-spin-slow drop-shadow-[0_0_20px_rgba(250,204,21,0.8)]" />
               <h2 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 mb-3 tracking-widest text-center leading-none">{UI[lang].auditionComplete}</h2>
               <p className="text-base sm:text-lg text-gray-300 mb-10">{UI[lang].whoGetsRole}</p>
               <div className="flex flex-col gap-6 w-full max-w-[90vw] sm:max-w-sm">
                    <button onClick={() => amIDirector && castWinner(finalists[0])} className={`w-full p-4 sm:p-5 rounded-3xl border-2 border-gray-600 bg-gray-900 flex items-center gap-4 transition-all shadow-lg ${amIDirector ? 'active:border-yellow-400' : 'opacity-70'}`}>
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden shrink-0 bg-black border-2 border-white/20"><AssetDisplay src={assets[`team${finalists[0].id}_happy`]} className="w-full h-full object-cover object-top" /></div>
                        <div className="flex-1 text-left"><h3 className="text-2xl sm:text-3xl font-black text-white">{TEAM_INFO[finalists[0].id].name}</h3><span className="text-sm sm:text-base text-yellow-500 font-bold tracking-widest">{UI[lang].castWinner}</span></div>
                    </button>
                    <div className="text-3xl sm:text-4xl font-black text-red-500 italic text-center drop-shadow-md">VS</div>
                    <button onClick={() => amIDirector && castWinner(finalists[1])} className={`w-full p-4 sm:p-5 rounded-3xl border-2 border-gray-600 bg-gray-900 flex items-center gap-4 transition-all shadow-lg ${amIDirector ? 'active:border-yellow-400' : 'opacity-70'}`}>
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden shrink-0 bg-black border-2 border-white/20"><AssetDisplay src={assets[`team${finalists[1].id}_happy`]} className="w-full h-full object-cover object-top" /></div>
                        <div className="flex-1 text-left"><h3 className="text-2xl sm:text-3xl font-black text-white">{TEAM_INFO[finalists[1].id].name}</h3><span className="text-sm sm:text-base text-yellow-500 font-bold tracking-widest">{UI[lang].castWinner}</span></div>
                    </button>
               </div>
               {!amIDirector && <div className="mt-8 text-yellow-400 font-bold animate-pulse text-lg">⏳ Yönetmenler Karar Veriyor...</div>}
          </div>
      )}

      {gameState === 'END' && winner && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-yellow-900 to-black px-4">
               <ConfettiExplosion />
               <Trophy size={100} sm:size={120} className="text-yellow-400 mb-8 drop-shadow-[0_0_30px_rgba(250,204,21,1)] animate-bounce" />
               <h1 className="text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600 mb-8 tracking-tighter text-center leading-none">{UI[lang].champion}</h1>
               <div className="relative mb-10">
                   <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-full border-4 border-yellow-400 shadow-[0_0_40px_yellow] overflow-hidden bg-black"><AssetDisplay src={assets[`team${winner.id}_happy`]} className="w-full h-full object-cover object-top" /></div>
                   <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-8 sm:px-10 py-2 sm:py-3 rounded-full font-black text-2xl sm:text-3xl whitespace-nowrap shadow-xl">{TEAM_INFO[winner.id].name}</div>
               </div>
               <p className="text-2xl sm:text-3xl text-yellow-200 mb-14 font-bold">{UI[lang].finalScore} <span className="text-white text-4xl sm:text-5xl ml-2">{winner.score}</span></p>
               {(isHost || isSinglePlayer) && (
                   <button onClick={resetGame} className="px-8 sm:px-10 py-5 sm:py-6 w-full max-w-[90vw] sm:max-w-sm bg-white text-black font-black text-lg sm:text-xl uppercase tracking-widest rounded-3xl active:scale-95 transition flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(255,255,255,0.5)]"><RefreshCw size={24} /> {UI[lang].playAgain}</button>
               )}
          </div>
      )}

      {/* KART & BONUS MODALS */}
      {gameState === 'CARD' && activeCard && <CardDisplay card={activeCard} type={cardType} mode="draw" onAction={handleCardAction} assets={assets} currentTeamId={currentTeam.id} lang={lang} isMyTurn={isMyTurn} />}
      {gameState === 'FINALS_PREP' && customFinalCard && <CardDisplay card={customFinalCard} type="final" mode="draw" onAction={() => { playSynthSound('click', soundEnabled); syncGame({ performanceTimer: 120, gameState: 'FINALS_PLAY' }); setTimerKey(k=>k+1); }} assets={assets} currentTeamId={currentTeam.id} lang={lang} isMyTurn={isMyTurn} />}
      {playingBonus && <CardDisplay card={playingBonus} type="bonus" mode="play" onAction={executeBonusPower} assets={assets} currentTeamId={currentTeam.id} lang={lang} isMyTurn={isMyTurn} />}
      
      {/* KURALLAR MODALI */}
      {showRules && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/90 backdrop-blur-md" onClick={() => setShowRules(false)}>
              <div className="bg-gray-900 border-t-4 border-[#D4AF37] rounded-t-3xl w-full p-6 pb-safe shadow-[0_-10px_50px_rgba(212,175,55,0.3)] max-h-[85vh] flex flex-col" onClick={e=>e.stopPropagation()}>
                  <div className="flex justify-between items-center mb-6"><h2 className="text-2xl sm:text-3xl font-black text-[#D4AF37] font-serif tracking-widest">{UI[lang].rulesTitle}</h2><button onClick={() => setShowRules(false)} className="text-gray-400 p-2 bg-black/50 rounded-full"><X size={24}/></button></div>
                  <div className="space-y-4 overflow-y-auto no-scrollbar flex-1 pb-4">
                      {UI[lang].rulesContent.map((rule, idx) => ( <div key={idx} className="bg-black/50 border border-white/10 p-4 sm:p-5 rounded-2xl"><h3 className="text-base sm:text-lg font-bold text-white mb-2">{rule.title}</h3><p className="text-gray-300 text-xs sm:text-sm leading-relaxed">{rule.text}</p></div> ))}
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
    return <div className="text-4xl sm:text-5xl font-mono font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] tracking-wider">{Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</div>;
};
