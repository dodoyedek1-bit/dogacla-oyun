import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Dices, Trophy, Star, ShieldAlert, Sparkles, Skull, Theater, 
  AlertTriangle, X, Volume2, VolumeX, RefreshCw, History, Bot, Zap, Flame, Crown, 
  Ghost, Smartphone, Bird, Thermometer, Apple, HelpCircle, Music4, List, Plus, Minus, Clapperboard, Lightbulb, Drama, User, Users, Home, Share2, Copy, SkipForward, BookOpen
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
      } else if (type === 'success' || type === 'powerup') {
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

const getDynamicQuotesDual = (prompt, type) => {
    const p = prompt.toLowerCase();
    if (type === 'DRAMATIC') return { "0": { tr: `Aman efendim! Bu '${p}' beni bitirecek. Sahnede ağlayıp sızlayacağım!` }, "1": { tr: `Bana dram deme ulan! '${p}' yüzünden sinir küpüne döndüm, bağıracağım!` }, "2": { tr: `Ah, '${p}'... Acımı tüm salona şiirsel bir dille haykıracağım.` }, "3": { tr: `Trajedi mi? '${p}' ile deliliğe sürükleniyormuş gibi yapacağım.` } };
    else if (type === 'ABSURD') return { "0": { tr: `Maskaralığım şahane! '${p}' için takla atacağım!` }, "1": { tr: `Hay bin köfte! '${p}' diye diye kaşımı gözümü oynatacağım!` }, "2": { tr: `Ne yapsam boş! '${p}' için komik durumlara düşeceğim.` }, "3": { tr: `Şu düştüğüm hale bak! Alaycı bir kahkaha atacağım.` } };
    else return { "0": { tr: `Sus pus oldum! '${p}' derdimi abartılı el kol hareketleriyle anlatacağım.` }, "1": { tr: `Dilimi yuttum! '${p}' olayını görünmez duvara çarparak oynayacağım.` }, "2": { tr: `Kelimeler kifayetsiz... '${p}' acısını yere yığılarak göstereceğim.` }, "3": { tr: `En keskin hiciv... Hiç konuşmadan '${p}' konusunu aşağılayacağım.` } };
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
            { title: "✨ Bonus (Fırsat) Kartları", text: "Mavi karelerden kazanılır ve saklanır. Kendi sahne sıran geldiğinde, süren işlerken alttaki menüden bonusuna tıklayıp gücünü (ekstra süre, kopya vs.) kullanabilirsin!" },
            { title: "😈 Engel (Sabotaj) Kartları", text: "Siyah karelerden kazanılıp envanterde saklanır. Başka bir rakip sahneye çıkarken, 10 saniyelik 'Sabotaj Süresi' içinde ona engel fırlatarak performansını zorlaştırabilirsin." },
            { title: "⚖️ Jüri Oylaması", text: "Diğer oyuncular jüri olur. Herkes oyunu verdikten sonra ortalama puan hanene yazılır." },
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
    
    const isVideo = typeof src === 'string' && (src.toLowerCase().startsWith('blob:') || src.toLowerCase().endsWith('.mp4') || src.toLowerCase().endsWith('.webm'));
    
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
            className={`${className} transition-opacity duration-700 ease-in`} 
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

// DEVASA GÖREV HAVUZU
const CARDS = {
  EASY: [ 
    { title: { tr: "BOZUK ASANSÖR" }, mission: { tr: "Dar bir alanda sıkıştın. Bedeninle paniği göster." }, hint: { tr: "Nefes alışını hızlandır, görünmez dar duvarlara ellerinle vurarak klostrofobiyi hissettir." }, quotes: { 0: {tr: "Aman efendim, asansör bozuldu! İmdat!"}, 1: {tr: "Ulan kapı açıl! Sıkıştım kaldım burada!"}, 2: {tr: "Ah bu demir kafes, ruhumun daraldığı zindan..."}, 3: {tr: "Modern hayatın harikası asansör, bizi fare gibi kapana kıstırdı!"} } }, 
    { title: { tr: "KUTUP SOĞUĞU" }, mission: { tr: "Donuyorsun. Dişlerin birbirine çarpıyor. Isınmaya çalış." }, hint: { tr: "Kollarına sarıl, ayaklarını yere vurarak kan dolaşımını hızlandırmaya çalış, nefesini ellerine üfle." }, quotes: { 0: {tr: "Aman efendim, donuyorum! Burnum buza döndü!"}, 1: {tr: "Donduk! Yakın sobayı!"}, 2: {tr: "Ah, bu soğuk rüzgar kemiklerimi delip geçiyor."}, 3: {tr: "Bu soğuk, ruhun ateşini bile söndürüyor."} } },
    { title: { tr: "ARAMAK" }, mission: { tr: "Gözlüğünü/telefonunu kaybettin, her yeri arıyorsun." }, hint: { tr: "Ceplerini panikle karıştır, hayali koltuk minderlerinin arasına bak, abartılı tepkiler ver." }, quotes: { 0: {tr: "Efendim cüzdan yok! Cüzdanı yemişler!"}, 1: {tr: "Nerede ulan bu meret? Buraya koymuştum!"}, 2: {tr: "Kayıp bir eşya mı, yoksa kayıp bir hafıza mı aradığım?"}, 3: {tr: "Kendi koyduğu şeyi bulamayan aciz insanlık..."} } },
    { title: { tr: "ACI BİBER" }, mission: { tr: "Yanlışlıkla dünyanın en acı biberini yedin. Tepki ver." }, hint: { tr: "Dilin yanıyormuş gibi ağzını açıp elinle yelle, hayali su bardaklarını kafana dik." }, quotes: { 0: {tr: "Yandım anam yandım! Ağzımda ateş var!"}, 1: {tr: "Su verin! İtfaiye çağırın!"}, 2: {tr: "Bu ne cehennem ateşi! Dilim kavruluyor!"}, 3: {tr: "Acı yemek ne büyük bir ahmaklıktır."} } },
    { title: { tr: "KÖPEK GEZDİRME" }, mission: { tr: "Görünmez ve çok yaramaz bir köpeği gezdirmeye çalış." }, hint: { tr: "Tasmayı sıkıca tut, köpek seni çekiyormuş gibi öne doğru savrul, yere eğilip sevmeye çalış." }, quotes: { 0: {tr: "Aman efendim, dur gitme! Koparacaksın kolumu!"}, 1: {tr: "Oğlum dursana! Ulan ne laf anlamaz hayvansın!"}, 2: {tr: "Ah vahşi doğa, bu tasmayla seni ehlileştiremem."}, 3: {tr: "Hayvanı gezdirdiğini sanan insan, aslında kendi gezdiriliyordur."} } },
    { title: { tr: "SİNEK SALDIRISI" }, mission: { tr: "Kulağının dibinde uçan bir sineği yakalamaya çalış." }, hint: { tr: "Havada görünmez bir noktayı takip et, aniden ellerini çırp ve kendi yüzüne tokat at." }, quotes: { 0: {tr: "Efendim gitmiyor bu meret, yapıştı yüzüme!"}, 1: {tr: "Gel buraya! Şap! Ah yüzüm!"}, 2: {tr: "Küçük bir haşere, koskoca aklımı nasıl da çeliyor... "}, 3: {tr: "Doğanın en sinir bozucu icadı: Sinek."} } },
    { title: { tr: "AĞIR KUTU" }, mission: { tr: "İçi taş dolu görünmez bir kutuyu yerden kaldırmaya çalış." }, hint: { tr: "Bacaklarını kırarak eğil, yüzünü buruştur, kutuyu zorla kaldırıp kaslarının titrediğini göster." }, quotes: { 0: {tr: "Aman efendim, fıtık oldum! Bu ne ağırlık!"}, 1: {tr: "Hoooop! Belim koptu! Taş mı var bunun içinde?"}, 2: {tr: "Bu yük, omuzlarımdaki dünyanın ağırlığı sanki."}, 3: {tr: "İnsan kendi yarattığı yüklerin altında böyle ezilir."} } },
    { title: { tr: "SÜMÜKLÜ BÖCEK" }, mission: { tr: "Elinde yapışkan ve iğrenç bir sümüksü madde var." }, hint: { tr: "Parmaklarını iğrenerek birbirinden ayır, elini silkelemeye çalış, yüzünü miden bulanmış gibi yap." }, quotes: { 0: {tr: "İyyy efendim bu ne biçim bir vıcık vıcık şey!"}, 1: {tr: "Midem kalktı! Nereye sileceğim ben bunu!"}, 2: {tr: "Ah, iğrençliğin en somut hali parmaklarımda."}, 3: {tr: "Doğanın sümüksü şakası."} } },
    { title: { tr: "TUVALET SIRASI" }, mission: { tr: "Acil tuvaletin geldi ama önünde çok uzun bir sıra var." }, hint: { tr: "Bacaklarını birbirine dola, yerinde zıpla, kıvran ve öndeki hayali kişilere acele etmelerini işaret et." }, quotes: { 0: {tr: "Efendim patlayacağım! İzin verin geçeyim!"}, 1: {tr: "Hadi be kardeşim! Altıma kaçıracağım!"}, 2: {tr: "Ah zaman! Hiç bu kadar yavaş akmamıştın."}, 3: {tr: "İnsanın en ilkel çaresizliği."} } },
    { title: { tr: "AYNA YANSIMASI" }, mission: { tr: "Aynanın karşısındasın, kendi yansımanla konuş/tartış." }, hint: { tr: "Saçını/üstünü düzelt, sonra kendi kendine kızmaya başla, aynadaki hayali kişiye parmak salla." }, quotes: { 0: {tr: "Ne bakıyorsun bana öyle efendim? Sensin çirkin!"}, 1: {tr: "Ulan ne yakışıklı adamım be! Kimseye benzemem!"}, 2: {tr: "Ayna ayna... Yüzümdeki bu keder kime ait?"}, 3: {tr: "Aynada gördüğün en büyük yalan, kendinsin."} } },
    { title: { tr: "SICAK KUM" }, mission: { tr: "Çıplak ayakla kızgın kumlarda yürümeye çalışıyorsun." }, hint: { tr: "Ayaklarını hızla havaya kaldır, sekiyormuş gibi yürü, yüzünü buruştur." }, quotes: { 0: {tr: "Aman efendim yandım! Ayaklarım tavuk gibi kızardı!"}, 1: {tr: "Hoppa! Zıpla zıpla! Çöl mü burası ulan!"}, 2: {tr: "Cehennemin ateşi ayak tabanlarımdan ruhuma sızıyor."}, 3: {tr: "Tatil dedikleri eziyetin bedeli."} } },
    { title: { tr: "SAKIZ YAPIŞMASI" }, mission: { tr: "Ayakkabının altına dev bir sakız yapıştı, kurtulmaya çalış." }, hint: { tr: "Ayağını yere sürterek kazı, elinle koparmaya çalışıp eline yapıştır." }, quotes: { 0: {tr: "Efendim bu ne biçim sakız, asfaltı kaldırdı!"}, 1: {tr: "Ulan sündü de sündü! Çık artık!"}, 2: {tr: "Geçmişin günahları gibi yakamı bırakmıyor bu illet."}, 3: {tr: "Yere çöp atmanın karması seni buldu."} } },
    { title: { tr: "DİŞ AĞRISI" }, mission: { tr: "Aniden korkunç bir diş ağrısı saplandı." }, hint: { tr: "Yanağını tut, gözlerini sıkıca yum, konuşurken ağzını yamult." }, quotes: { 0: {tr: "Aman efendim beynime vurdu! Kerpeten getirin!"}, 1: {tr: "Ah dişim! Söküp atacağım şimdi!"}, 2: {tr: "Bir kemik parçasının ruhuma verdiği bu eziyet..."}, 3: {tr: "Diş perisi bu sefer can almaya gelmiş."} } },
    { title: { tr: "DAR PANTOLON" }, mission: { tr: "Yıkanıp küçülmüş aşırı dar bir pantolonu giymeye çalış." }, hint: { tr: "Zıplayarak çek, göbeğini içeri çekip nefesini tut, fermuarı çekerken zorlan." }, quotes: { 0: {tr: "Efendim nefes alamıyorum! Korset gibi sardı!"}, 1: {tr: "Ulan patlayacak dikişler! Kim küçülttü bunu!"}, 2: {tr: "Kendi yarattığım bu kumaş hapishanesinde esirim."}, 3: {tr: "Moda uğruna çekilen absürt çileler."} } },
    { title: { tr: "DONDURMA DÜŞÜŞÜ" }, mission: { tr: "Dev külah dondurman eriyip düşmek üzere, toparlamaya çalış." }, hint: { tr: "Elini hızla çevir, damlayan yerleri yalamaya çalış, panikle sağa sola dön." }, quotes: { 0: {tr: "Aman efendim şelale gibi akıyor! Tutun!"}, 1: {tr: "Gitti dondurma! Lan bari damlasını yalayım!"}, 2: {tr: "Tıpkı umutlarım gibi, ellerimde eriyip gidiyor."}, 3: {tr: "Yerçekimi, tatlı keyfimi yine bozdu."} } },
    { title: { tr: "HAPŞIRIK" }, mission: { tr: "Çok önemli bir şey anlatırken sürekli hapşırıyorsun." }, hint: { tr: "Cümlenin tam ortasında kriz geçirerek hapşır ve özür dileyerek devam et." }, quotes: { 0: {tr: "Efendim konu şu ki... HAPŞU! Affedersiniz..."}, 1: {tr: "Bakın dinleyin beni... HAPŞU! Ulan burnum koptu!"}, 2: {tr: "Sözlerimin derinliği... HAPŞU! Uçup gitti rüzgarla..."}, 3: {tr: "Mikropların ciddiyetime suikastı."} } },
    { title: { tr: "SIVI SABUN" }, mission: { tr: "Eline çok fazla sıvı sabun aldın ve köpürüp taşıyor." }, hint: { tr: "Ellerini çılgınca birbirine sürt, köpüğü üstüne başına sıçratıyormuş gibi panikle." }, quotes: { 0: {tr: "Aman efendim bitmiyor bu köpük! Boğulacağım!"}, 1: {tr: "Ulan her yerim sabun oldu! Verin bir havlu!"}, 2: {tr: "Temizlenmek isterken, köpükten bir dağın altında kaldım."}, 3: {tr: "Modern temizliğin çıldırtan bedeli."} } },
    { title: { tr: "GÖZÜNE TOZ KAÇMASI" }, mission: { tr: "Gözüne kocaman bir toz kaçtı ve yaşarıyor." }, hint: { tr: "Tek gözünü sıkıca kapat, elinle ovuştur, kör olmuş gibi etrafı yokla." }, quotes: { 0: {tr: "Efendim kör oldum! Gözüm çıktı yerinden!"}, 1: {tr: "Üfleyin ulan şu gözüme! Yanıyor!"}, 2: {tr: "Bir zerre toz, dünyamı karanlığa boğdu..."}, 3: {tr: "Koskoca insan, bir toza yenik düşüyor."} } },
    { title: { tr: "KOKMUŞ ÇORAP" }, mission: { tr: "Yerde bulduğun bir çorabın kokusuna maruz kaldın." }, hint: { tr: "Burnunu parmaklarınla tıka, miden bulanmış gibi yapıp öğür, kafanı geri çek." }, quotes: { 0: {tr: "Aman efendim bu ne biçim koku! Ölü fare mi var içinde!"}, 1: {tr: "Iyy! Atın lan şunu çöpe! Midem kalktı!"}, 2: {tr: "Ah, insanlığın bıraktığı bu zehirli koku..."}, 3: {tr: "Biyolojik bir silah olarak kirli çorap."} } },
    { title: { tr: "YAPIŞKAN KAPI" }, mission: { tr: "Görünmez bir kapının kolu eline yapıştı, bırakamıyorsun." }, hint: { tr: "Elini kolundan kurtarmaya çalış, bacaklarınla kapıyı it, tüm gücünle asıl." }, quotes: { 0: {tr: "Efendim bırakmıyor bu meret beni! Kolum kopacak!"}, 1: {tr: "Ulan kim sürdü buraya bu yapışkanı! Açıl!"}, 2: {tr: "Kapalı kapılar sadece ruhumu değil, bedenimi de esir aldı."}, 3: {tr: "Gitmene izin vermeyen eşyalar..."} } }
  ],
  MEDIUM: [ 
    { title: { tr: "UNUTKANLIK" }, mission: { tr: "Tam o an ne söyleyeceğini unuttun. Kıvırmaya çalış." }, hint: { tr: "Gözlerini tavana dik, 'Eee, hımm' diyerek düşünüyormuş gibi yap, saçmala." }, quotes: { 0: {tr: "Eee... Efendim, dilimin ucundaydı!"}, 1: {tr: "Kelimeleri aklımdan çaldınız!"}, 2: {tr: "Ah, hafızam bana ihanet ediyor! Kelimeler kayıp."}, 3: {tr: "Sessizlik... En büyük replik söylenmeyendir."} } }, 
    { title: { tr: "GÖRÜNMEZ ELMA" }, mission: { tr: "Elinde bir elma varmış gibi ye ve çekirdeğini at." }, hint: { tr: "Elmayı gömleğine sil, ısırırken yüksek bir ses çıkar, suyunu damlatıyormuş gibi yap." }, quotes: { 0: {tr: "Aman efendim, bu elma değil elmas! Kırt!"}, 1: {tr: "Elimde hiçbir şey yok ama yiyorum!"}, 2: {tr: "Var olmayan bir meyvenin tadını hissediyorum."}, 3: {tr: "Görünmez bir obje yaratmak... İşte sanat budur."} } },
    { title: { tr: "SARHOŞ ASTRONOT" }, mission: { tr: "Yerçekimsiz ortamda sarhoşmuş gibi hareket et." }, hint: { tr: "Ağır ve süzülerek hareket et, dengeni kaybetmiş gibi geriye doğru yavaşça devril." }, quotes: { 0: {tr: "Aman efendim, uzayda başım dönüyor, uçuyorum!"}, 1: {tr: "Hooop! Yakalayın beni! Gezegenler etrafımda dönüyor!"}, 2: {tr: "Yıldızların arasında kaybolmuş sarhoş bir ruhum ben."}, 3: {tr: "Yerçekimi bile bu saçmalığı durduramıyor."} } },
    { title: { tr: "HIÇKIRIK KRİZİ" }, mission: { tr: "Ciddi bir haber sunarken sürekli hıçkırık tutuyor." }, hint: { tr: "Omuzlarını aniden yukarı kaldırarak hıçkır, ciddi yüz ifadeni bozmadan devam etmeye çalış." }, quotes: { 0: {tr: "Efendim bugün... (Hıck!) çok önemli bir... (Hıck!)"}, 1: {tr: "Ulan durmuyor! (Hıck!) Getirin bir bardak su!"}, 2: {tr: "Trajik bir hikaye bu... (Hıck!) Ah bu bedenim bana isyan ediyor!"}, 3: {tr: "Ciddiyetin hıçkırıkla imtihanı."} } },
    { title: { tr: "YAVAŞ ÇEKİM" }, mission: { tr: "Biriyle kavga ediyormuşsun gibi yavaş çekimde hareket et." }, hint: { tr: "Ağzını kocaman açarak 'Hayıııır' diye bağır, hayali bir yumruğu çok yavaşça yemiş gibi savrul." }, quotes: { 0: {tr: "Neeeee yaaaaaapııııyooorsuuuun efeeendiiiiim!"}, 1: {tr: "Aaaah! Vurmaaa ulaaaan!"}, 2: {tr: "Zamaaaan donduuuu... Acıııı yavaaaaşça büyüyyoooor..."}, 3: {tr: "Kavgaaadaaa bileee estetiik."} } },
    { title: { tr: "TERS RÜZGAR" }, mission: { tr: "Çok şiddetli bir rüzgara karşı yürümeye çalış." }, hint: { tr: "Gövdeni öne eğ, görünmez bir duvara yaslanıyormuş gibi bacaklarını zorlanarak at." }, quotes: { 0: {tr: "Aman efendim uçacağım! Uçurtma oldum!"}, 1: {tr: "Ulan bu ne rüzgar! Ağzım burnum yer değiştirdi!"}, 2: {tr: "Doğanın gazabı karşısında bir kum tanesiyim sadece!"}, 3: {tr: "Rüzgara karşı yürümek, hayata karşı yürümektir."} } },
    { title: { tr: "BOZUK OTOMAT" }, mission: { tr: "Kola otomatına paran sıkıştı, kolunu içine sokup çıkarmaya çalış." }, hint: { tr: "Makineye tekme at, kolunu omuza kadar makineye sokup sıkışmış gibi panikle çekiştir." }, quotes: { 0: {tr: "Aman efendim param gitti! Geri ver paramı makine!"}, 1: {tr: "Ulan kırarım seni! Ver lan kolamı!"}, 2: {tr: "Bir demir yığını, umutlarımı çaldı."}, 3: {tr: "Kapitalizmin en net özeti: Paran gider, ürün gelmez."} } },
    { title: { tr: "TİKTOK DANSI" }, mission: { tr: "Ekrana bakarak kendi uydurduğun saçma bir dansı yap." }, hint: { tr: "Yüzüne sahte bir gülümseme yerleştir, el kol hareketlerini robotik ve tekrarlı şekilde yap." }, quotes: { 0: {tr: "Aman efendim nasıl beğeni alıyoruz böyle iyi mi?"}, 1: {tr: "Ulan ne şekillere girdim iki beğeni için!"}, 2: {tr: "Ruhumun boşluğunu, bu saçma dansla dolduruyorum."}, 3: {tr: "Dijital kölelikte yeni bir seviye."} } },
    { title: { tr: "GÖRÜNMEZ ORKESTRA" }, mission: { tr: "Çılgın bir orkestra şefi gibi görünmez müzisyenleri yönet." }, hint: { tr: "Elindeki görünmez çubukla havayı yar, saçlarını savur, kemanlara ve davullara gir işareti ver." }, quotes: { 0: {tr: "Girin kemanlar! Hoop davullar! Aman efendim harika!"}, 1: {tr: "Ulan yanlış çaldın! Sana diyorum flütçü!"}, 2: {tr: "Bu sessiz senfoni, kalbimin çığlığıdır."}, 3: {tr: "Hiçlikten müzik yaratmak..."} } },
    { title: { tr: "KAYGAN ZEMİN" }, mission: { tr: "Buz tutmuş bir yolda düşmemeye çalışarak yürü." }, hint: { tr: "Kollarını iki yana açıp dengede durmaya çalış, ayakların altından kayıyormuş gibi kısa adımlar at." }, quotes: { 0: {tr: "Aman efendim buz pateni yapıyoruz sanki!"}, 1: {tr: "Eyvah! Kafa göz yarılacak şimdi!"}, 2: {tr: "Bu kaygan yol, hayatın ne kadar güvensiz olduğunun kanıtı."}, 3: {tr: "Düşüşü bekleyen komik insanlık."} } },
    { title: { tr: "PANDOMİMCİ HAPİSTE" }, mission: { tr: "Görünmez bir cam kutunun içine hapsoldun." }, hint: { tr: "Ellerini görünmez bir cama daya, etrafını yokla, duvarları itmeye çalış." }, quotes: { 0: {tr: "Efendim çıkamıyorum! Cam var burada cam!"}, 1: {tr: "Kim kapattı ulan beni buraya! Kıracağım şimdi!"}, 2: {tr: "Özgürlüğüm bir hiçliğin ardında tutsak."}, 3: {tr: "Sessizliğin en klasik ve klişe zindanı."} } },
    { title: { tr: "KÖTÜ ÇEVİRMEN" }, mission: { tr: "Yabancı bir turiste yol tarif et, ama dil bilmiyorsun." }, hint: { tr: "Abartılı el kol hareketleri yap, anlamsız sesler çıkarıp yön işaret et." }, quotes: { 0: {tr: "Efendim no no, go düz! And den dön right!"}, 1: {tr: "Ulan anlamıyor ki! Bak kardeşim, böyle dümdüz!"}, 2: {tr: "Kelimelerin kifayetsizliği, dillerin duvarına çarpıyor."}, 3: {tr: "İletişimsizliğin evrensel komedisi."} } },
    { title: { tr: "ŞİŞME BOT" }, mission: { tr: "Ağzınla devasa bir şişme botu şişirmeye çalışıyorsun." }, hint: { tr: "Derin nefes al, yanaklarını şişirerek abartılı şekilde üfle, yorulup başın dönsün." }, quotes: { 0: {tr: "Efendim ciğerim soldu! Bitmiyor bu!"}, 1: {tr: "Püfff! Ulan hava kaçırıyor galiba, delik mi bu!"}, 2: {tr: "Nefesimle hayat veriyorum bu cansız plastiğe."}, 3: {tr: "Pompa almamak için ciğerini heba eden ahmak."} } },
    { title: { tr: "YALAN MAKİNESİ" }, mission: { tr: "Yalan söyledikçe elektrik çarpan bir koltuktasın." }, hint: { tr: "Konuşurken aniden sarsıl, çırpın, sonra hiçbir şey olmamış gibi devam et." }, quotes: { 0: {tr: "Ben hiç yalan s-söylemem efen... Bzzzt! Ah!"}, 1: {tr: "Ulan dürüst adamım ben! Bzzzt! Yandım!"}, 2: {tr: "Gerçekler acıdır... Bzzzt! Gerçekten acıymış!"}, 3: {tr: "Teknoloji, dürüstlüğü zorla aşılıyor."} } },
    { title: { tr: "BOZUK ROBOT" }, mission: { tr: "Şarjı bitmek üzere olan ve bozulup tekleyen bir robotsun." }, hint: { tr: "Hareketlerini kesik kesik yap, 'Bip bop' sesleri çıkar, yavaşça enerjin bitsin." }, quotes: { 0: {tr: "E-efendim... S-sistem çök... Bip..."}, 1: {tr: "Ulan şarj... Bitti... Fişe takın beni..."}, 2: {tr: "Metal kalbim... Yavaşlıyor... Karanlık..."}, 3: {tr: "Yapay zekanın fişi çekilinceki çaresizliği."} } },
    { title: { tr: "SESSİZ SİNEMA YARIŞMASI" }, mission: { tr: "Çok uzun bir film ismini sessiz sinema ile anlatmaya çalışıyorsun." }, hint: { tr: "Parmaklarınla kelime sayısını göster, abartılı hareketlerle anlat, karşı taraf anlamayınca sinirlen." }, quotes: { 0: {tr: "Efendim iki kelime! Birinci kelime, uçuyor! Yok anlamadı!"}, 1: {tr: "Ulan sağır mısın dilsiz mi! Bak, böyle kocaman!"}, 2: {tr: "Anlamı hecelere böldüm ama nafile."}, 3: {tr: "İnsanların anlama kapasitesi tam bir trajedi."} } },
    { title: { tr: "MAYMUN TAKLİDİ" }, mission: { tr: "Bir maymunun vücuduna hapsolmuş bir insansın." }, hint: { tr: "Koltukaltlarını kaşı, muz soyuyormuş gibi yap ama aynı zamanda ciddi konuşmaya çalış." }, quotes: { 0: {tr: "Efendim ben aslında... Uu uu aa aa! Muz verin!"}, 1: {tr: "Ne bakıyorsunuz ulan! Uu aa! Kaşınıyor sırtım!"}, 2: {tr: "Evrimin tersine döndüğü bu acımasız beden..."}, 3: {tr: "İçimizdeki ilkel doğanın uyanışı."} } },
    { title: { tr: "AŞIRI ACI KAHVE" }, mission: { tr: "Çok sıcak ve acı bir kahveyi yudumladın." }, hint: { tr: "Ağzını yakmış gibi 'Hah, hıh' yap, dilini dışarı çıkar, bardağı elinde salla." }, quotes: { 0: {tr: "Yandım anam! Bu ne biçim kahve efendim, katran gibi!"}, 1: {tr: "Iyy! Ulan boğazım delindi be!"}, 2: {tr: "Bu siyah sıvı, ruhum kadar acı ve karanlık."}, 3: {tr: "İnsanın uyanmak için kendine ettiği eziyet."} } },
    { title: { tr: "ARIZALI KUKLA" }, mission: { tr: "İpleri birbirine karışmış bir kukla gibi hareket et." }, hint: { tr: "Bir kolun yukarı kalkarken diğeri garip bir şekilde bükülsün, kendi kontrolünü kaybet." }, quotes: { 0: {tr: "Aman efendim iplerim dolandı! Kolum nerede!"}, 1: {tr: "Çekin ulan şu ipleri düzgün! Boynum büküldü!"}, 2: {tr: "Görünmez efendilerin elinde bir oyuncağım sadece."}, 3: {tr: "Özgür iradenin koca bir yalan olduğunun kanıtı."} } },
    { title: { tr: "SIKIŞMIŞ KAVANOZ" }, mission: { tr: "Kapağı asla açılmayan bir turşu kavanozunu açmaya çalış." }, hint: { tr: "Kavanozu iki elinle sıkıca kavra, yüzünü buruşturarak tüm gücünle çevir, tişörtünle açmayı dene." }, quotes: { 0: {tr: "Efendim açılmıyor bu namussuz! Fıtık oldum!"}, 1: {tr: "Verin ulan kıracağım şimdi bunu! İnat inat!"}, 2: {tr: "Küçücük bir kapak, koca insan iradesine meydan okuyor."}, 3: {tr: "Turşu yemek için verilen bu anlamsız savaş..."} } }
  ],
  HARD: [ 
    { title: { tr: "SAHTE KRAL" }, mission: { tr: "Her şeyin kontrol altında olduğu yalanını söyleyen paniklemiş bir lider." }, hint: { tr: "Titreyerek gülümse, terini sil, kekele ama sürekli 'her şey yolunda' mesajı ver." }, quotes: { 0: {tr: "Ben kralım efendim! T-Tabii ki korkmuyorum!"}, 1: {tr: "Benim dediğim olur! B-Bana güvenin!"}, 2: {tr: "Tacım titriyor, ama maskem düşmemeli..."}, 3: {tr: "Güç, korkunun en büyük örtüsüdür."} } }, 
    { title: { tr: "AĞLARKEN GÜLMEK" }, mission: { tr: "Çok üzücü bir şey anlatırken sinir krizi geçirip kahkaha at." }, hint: { tr: "Önce hıçkırarak ağla, sonra aniden gözyaşları içinde çılgınca gülmeye başla." }, quotes: { 0: {tr: "Hahaha! Çok komik efendim... Ah kalbim! Hahaha!"}, 1: {tr: "Ulan ne kadar komik... (Ağlar) Hahaha! Vah bana!"}, 2: {tr: "Gözyaşlarım kahkahama karışıyor, aklım deliliğe... "}, 3: {tr: "Trajedi ve komedi birbirine bu kadar yakındır işte."} } },
    { title: { tr: "İKİ KİŞİLİK KAVGA" }, mission: { tr: "Kendi kendinle (iki farklı karakter olarak) sözlü kavga et." }, hint: { tr: "Sürekli sağa ve sola dönerek beden dilini ve ses tonunu değiştir, kendini tokatla." }, quotes: { 0: {tr: "-Sen sus efendim! -Asıl sen sus kaba adam!"}, 1: {tr: "-Ne vuruyorsun lan! -Hak ettin oğlum!"}, 2: {tr: "İçimdeki iki ruh savaşıyor, bedenim bir savaş alanı."}, 3: {tr: "Şizofreninin sahnede hayat buluşu."} } },
    { title: { tr: "SESSİZ ÇIĞLIK" }, mission: { tr: "Boğazın düğümlenmiş, sesin çıkmıyor ama avazın çıktığı kadar bağır." }, hint: { tr: "Yüzünü kıpkırmızı yap, boyun damarlarını şişir, ağzını kocaman aç ama SIFIR ses çıkar." }, quotes: { 0: {tr: "(Sessizce) İMDAT EFENDİM, KİMSE DUYMUYOR MU!"}, 1: {tr: "(Sessizce) ULAN YARDIM EDİN PATLAYACAĞIM!"}, 2: {tr: "(Sessizce) Dünyaya haykırıyorum, ama evren sağır..."}, 3: {tr: "(Sessizce) En gürültülü sessizlik."} } },
    { title: { tr: "YARATIK SALDIRISI" }, mission: { tr: "Görünmez bir ahtapot tarafından yutuluyorsun, kurtulmaya çalış." }, hint: { tr: "Boynuna dolanan kolları çekiştir, nefessiz kalmış gibi yap, yerde sürünerek boğuş." }, quotes: { 0: {tr: "Aman efendim bırak boynumu! Bu ne biçim yaratık!"}, 1: {tr: "Ulan yapışma koluma! Kopartacağım seni!"}, 2: {tr: "Bu canavar beni karanlığa, dibe çekiyor..."}, 3: {tr: "Kendi yarattığı canavarlarla boğuşan insan."} } },
    { title: { tr: "TER VE TİTREME" }, mission: { tr: "Hem donuyor hem de sıcaktan terliyormuşsun gibi hisset." }, hint: { tr: "Bir yandan dişlerini çatırdatarak titre, diğer yandan alnından ter siliyormuş gibi yap." }, quotes: { 0: {tr: "Aman efendim hem dondum hem piştim!"}, 1: {tr: "Ulan bu ne biçim hastalık, içim titriyor dışım yanıyor!"}, 2: {tr: "Bedenim araf'ta kalmış, ne sıcak ne soğuk... "}, 3: {tr: "Biyolojik sistemin tamamen çöküşü."} } },
    { title: { tr: "KULLANMA KILAVUZU" }, mission: { tr: "Bomba imha ediyorsun ama kılavuz Çince." }, hint: { tr: "Hayali kağıdı ters çevir, panikle terini sil, kırmızı ve mavi kablolar arasında titre." }, quotes: { 0: {tr: "Aman efendim bu yazılar ters! Kırmızı mı mavi mi!"}, 1: {tr: "Ulan patlayacağız! Nerede Türkçe yazıyor burada!"}, 2: {tr: "Ölüm ile yaşam arasındaki ince çizgi... Ve ben okuyamıyorum."}, 3: {tr: "Bilinmezliğin karşısındaki çaresiz panik."} } },
    { title: { tr: "GERİYE AKAN ZAMAN" }, mission: { tr: "Yaptığın her hareketi ve söylediğin kelimeyi tersten oyna." }, hint: { tr: "Geri geri yürü, nesneleri yere koymak yerine yerden eline uçuyormuş gibi al." }, quotes: { 0: {tr: "!midnefe namA !muroyidiy ireg ireG"}, 1: {tr: "!nalU !muroyüşüd eyireG"}, 2: {tr: "...royıkla zısmısatnah namaz, haA"}, 3: {tr: "!kılmaçamras rib lısaN"} } },
    { title: { tr: "KOMİK CENAZE" }, mission: { tr: "Çok sevdiğin birinin cenazesinde gülmemeye çalışarak konuş." }, hint: { tr: "Ağlıyormuş gibi yaparken dudaklarını ısırıp kıkırdamayı bastırmaya çalış." }, quotes: { 0: {tr: "Efendim çok iyi bir insandı... (Kıkırdar) Çok özleyeceğiz..."}, 1: {tr: "Ulan rahmetli de hep güldürürdü bizi... (Kahkahayı bastırır)"}, 2: {tr: "Ah kara toprak! (Gülümser) Gözyaşlarım kilitlendi..."}, 3: {tr: "Ölümün absürtlüğüne gülmek..."} } },
    { title: { tr: "HİPNOZ" }, mission: { tr: "Gözlerinle kameraya/seyirciye bakarak onları hipnotize etmeye çalış." }, hint: { tr: "Gözlerini kocaman aç, ellerini yavaşça sarkaç gibi salla, gizemli bir ses tonu kullan." }, quotes: { 0: {tr: "Aman efendim gözlerime bakın... Çok uykunuz geldi..."}, 1: {tr: "Bana bak ulan! İki saniyede uyuturum seni!"}, 2: {tr: "Ruhunuzu bana teslim edin... Göz kapaklarınız ağırlaşıyor..."}, 3: {tr: "Bir zihnin diğerini esir alma çabası."} } },
    { title: { tr: "DÜNYANIN SONU" }, mission: { tr: "Meteor çarpmasına 10 saniye kalmış, televizyonda son haberi sunuyorsun." }, hint: { tr: "Mikrofonu tut, hızlıca konuş, sonra masanın altına saklanıp bağır." }, quotes: { 0: {tr: "Sayın seyirciler, hakkınızı helal edin, taş düşüyor!"}, 1: {tr: "Ulan meteor geliyor meteor! Kaçın kurtarın kendinizi!"}, 2: {tr: "Gökyüzü alevler içinde yarılıyor, son sahnemiz geldi!"}, 3: {tr: "Sonunda bu saçma gezegenden kurtuluyoruz."} } },
    { title: { tr: "GÖRÜNMEZ KILIÇ" }, mission: { tr: "Dünyanın en zorlu görünmez kılıç dövüşünü tek başına yap." }, hint: { tr: "Havaya kılıç salla, darbe almış gibi geriye sendele, epik hareketler yap." }, quotes: { 0: {tr: "Hiyah! Aman efendim kolumu kestiler!"}, 1: {tr: "Gel lan buraya! Al sana şovalyelik!"}, 2: {tr: "Bu çelik, onurumu ve kanımı taşıyor!"}, 3: {tr: "Olmayan bir düşmana sallanan zavallı bir kılıç."} } },
    { title: { tr: "HAFIZA KAYBI" }, mission: { tr: "Tam şu an kim olduğunu unuttun, ellerine ve etrafına bakarak anlamaya çalış." }, hint: { tr: "Ellerine şaşkınca bak, yüzünü yokla, 'Ben kimim, burası neresi?' der gibi oyna." }, quotes: { 0: {tr: "Aman efendim, ben kimin nesiyim? Adım neydi!"}, 1: {tr: "Burası neresi ulan! Siz kimsiniz!"}, 2: {tr: "Bir boşluktayım... Geçmişim bir rüya gibi silindi."}, 3: {tr: "Hafıza yoksa, dert de yoktur."} } },
    { title: { tr: "VAMPİR TERAPİSİ" }, mission: { tr: "Kan görmeye dayanamayan ve bayılan bir vampirsin." }, hint: { tr: "Dişlerini göster ama hayali bir kan görünce miden bulansın ve bayılacak gibi ol." }, quotes: { 0: {tr: "Efendim kan mı o! İyyy içim kalktı!"}, 1: {tr: "Ulan ketçap verin bana, ben bunu içemem!"}, 2: {tr: "Lanet olsun bu doğama, kızıl sıvı beni dehşete düşürüyor."}, 3: {tr: "Kendi varoluşundan iğrenen bir ölümsüz."} } },
    { title: { tr: "ÇOK KİŞİLİ BEDEN" }, mission: { tr: "Bedenini üç farklı kişi kontrol ediyormuş gibi oyna." }, hint: { tr: "Sağ elin sol eline vursun, ayağın kendi kendine yürümeye çalışsın, farklı sesler çıkar." }, quotes: { 0: {tr: "Aman efendim sol kolum bana isyan ediyor!"}, 1: {tr: "Ulan bacağım dur! Gitme oraya!"}, 2: {tr: "Bedenim bir savaş alanı, ruhlarım birbiriyle çarpışıyor."}, 3: {tr: "Kendi içinde bölünen zavallı insanlık."} } },
    { title: { tr: "TELEPATİ" }, mission: { tr: "Sadece zihin gücüyle karşındaki nesneyi uçurmaya çalış." }, hint: { tr: "Gözlerini kocaman aç, ellerini objeye doğru tut, aşırı zorlanıyormuş gibi titremeye başla." }, quotes: { 0: {tr: "Efendim kalkmıyor bu! Beynim yandı!"}, 1: {tr: "Kalk ulan yukarı! Patlayacak kafam!"}, 2: {tr: "Zihnimin gücü, maddenin ağırlığına yenik düşüyor... "}, 3: {tr: "İnsanın sınırlarını zorlayan o aptal çabası."} } },
    { title: { tr: "CANLI YAYIN KAZASI" }, mission: { tr: "Haber sunarken arkanda beliren bir hayaleti fark edip çaktırmamaya çalış." }, hint: { tr: "Kameraya ciddi bakarken aniden arkana dönüp irkil, sonra zorla gülümseyip devam et." }, quotes: { 0: {tr: "Sayın seyirciler... Arkamda biri mi var efendim!"}, 1: {tr: "Bugün hava çok... Bismillahirrahmanirrahim!"}, 2: {tr: "Karanlığın içinden gelen bu silüet de ne?"}, 3: {tr: "Medya her şeyi saklar, hayaletleri bile."} } },
    { title: { tr: "GÖRÜNMEZ MERDİVEN" }, mission: { tr: "Kuvvetli bir fırtınada sallanan görünmez bir merdivenden in." }, hint: { tr: "Ayaklarını yüksekten yavaşça aşağı bas, rüzgardan savruluyormuş gibi tutunmaya çalış." }, quotes: { 0: {tr: "Aman efendim düşeceğim! Tutun beni!"}, 1: {tr: "Ulan kayıyor ayağım! Bittik!"}, 2: {tr: "Uçuruma inen bu görünmez basamaklar..."}, 3: {tr: "Düşüşün kaçınılmaz olduğu o ince çizgi."} } },
    { title: { tr: "SAHTE ÇEVİRMEN" }, mission: { tr: "Sahnede dünyanın en karmaşık dilini uydurup kendini çevir." }, hint: { tr: "Anlamsız garip sesler çıkar, sonra dönüp 'Burada diyor ki...' diyerek uyduruk şeyler söyle." }, quotes: { 0: {tr: "Habele hubele! Yani diyor ki efendim, merhaba."}, 1: {tr: "Maka maku şaka! Diyor ki ulan dağılın buradan!"}, 2: {tr: "Krakatoa memento! Ruhun derinliklerinden bir mesaj... "}, 3: {tr: "Dilin bir aldatmaca olduğunu kanıtlayan an."} } },
    { title: { tr: "HIZLANDIRILMIŞ VİDEO" }, mission: { tr: "Normal bir yemeği 10x hızlandırılmış bir videodaymışsın gibi ye." }, hint: { tr: "Ellerini robotik ve aşırı hızlı şekilde ağzına götür, çiğneme hareketini komik bir hızda yap." }, quotes: { 0: {tr: "Amanefendimbunasılyemektiknefesalamadım!"}, 1: {tr: "Ulangittilokmalarboğazımatakıldı!"}, 2: {tr: "Zamanınacımasızhızıkarşısındaezilenben..."}, 3: {tr: "Tüketimçılgınlığınınsonnoktası."} } }
  ],
  FINAL: [ 
    { title: { tr: "VEDA KONUŞMASI" }, mission: { tr: "Oyun bitiyor. Seyirciye dramatik ve epik bir veda konuşması yap." }, hint: { tr: "Seyirciyi selamla, ağlıyormuş gibi yap, sahnenin tozunu yuttuğunu hissettir." }, quotes: { 0: {tr: "Sürçülisan ettiysek affola, İbiş kaçar efendim!"}, 1: {tr: "Hadi bana eyvallah! İyi güldük ulan!"}, 2: {tr: "Perde kapanırken, geriye gölgelerimiz kalır... Elveda!"}, 3: {tr: "Oyun biter, gerçek hayat denilen tiyatro başlar."} } } 
  ],
  OBSTACLE: [ 
    { id: 'o1', text: { tr: "Sadece TEK HECELİ kelimeler kurarak oyna!" }, ruleDesc: { tr: "Rakip performans boyunca sadece 'Evet, Gel, Bak' gibi TEK HECELİ kelimeler kurmak zorunda kalır." } }, 
    { id: 'o2', text: { tr: "Müzikal gibi! ŞARKI SÖYLEYEREK anlat!" }, ruleDesc: { tr: "Rakip görevini normal konuşarak değil, rap yaparak veya şarkı söyleyerek anlatmak zorundadır." } }, 
    { id: 'o3', text: { tr: "Asla kameraya bakma! SIRTIN DÖNÜK oyna!" }, ruleDesc: { tr: "Rakip performans boyunca asla seyirciye/kameraya bakamaz, hep arkası dönük oynamak zorundadır." } },
    { id: 'o4', text: { tr: "Durmak yok! Sürekli ZIPLAYARAK oyna!" }, ruleDesc: { tr: "Rakip yerinde duramaz! Tüm sahne boyunca sürekli zıplayarak rol yapmak zorundadır." } },
    { id: 'o5', text: { tr: "Her cümlenin sonuna bir KAHKAHA patlat!" }, ruleDesc: { tr: "Görev ne kadar acıklı olursa olsun, rakip kurduğu her cümlenin sonuna kahkaha eklemek zorundadır." } },
    { id: 'o6', text: { tr: "Mimik yasak! Kesik kesik bir ROBOT gibi oyna!" }, ruleDesc: { tr: "Rakibin mimikleri silinir. Kesik kesik robot hareketleri ve mekanik bir sesle oynamak zorundadır." } },
    { id: 'o7', text: { tr: "Dudaklarını BİRBİRİNE DEĞDİRMEDEN (B, P, M) konuş!" }, ruleDesc: { tr: "Rakip konuşurken dudaklarını birbirine değdiremez. Değerse jüri anında eksi puan verir!" } },
    { id: 'o8', text: { tr: "Her 5 saniyede bir heykel gibi DON ve bekle!" }, ruleDesc: { tr: "Rakip oynarken her 5 saniyede bir video donmuş gibi heykel olup beklemek zorundadır." } }
  ],
  BONUS: [ 
    { id: 'tubi', name: 'Tubi', quote: { tr: 'Buradayım canım! Annen gibi düşün... Sana taktik vereceğim!' }, ruleDesc: { tr: 'Süren durur ve 10 saniye boyunca sahnede ne yapacağını düşünme/okuma fırsatı bulursun.' }, benefit: { tr: 'FİKİR AL' }, effect: 'idea' }, 
    { id: 'kubi', name: 'Kubi', quote: { tr: 'Kalem elimde! Bu sahneye bir kişi daha yazıyorum. Kalabalık olsun!' }, ruleDesc: { tr: 'Sahnene uydurma bir yan karakter eklersin. Tek başına değil, onunla kavga ediyor/konuşuyormuş gibi oynarsın.' }, benefit: { tr: 'EKSTRA KARAKTER' }, effect: 'char' }, 
    { id: 'mali', name: 'Mali', quote: { tr: 'Hesapladım, bu işten kârlı çıkarız.' }, ruleDesc: { tr: 'Jüri oylamasına gerek kalmadan performansına banko +2 puan eklenir.' }, benefit: { tr: '+2 PUAN' }, effect: 'score' }, 
    { id: 'kubo', name: 'Kubo', quote: { tr: 'Kestik! Olmadı, baştan alıyoruz ama süreyi uzatıyorum.' }, ruleDesc: { tr: 'Zamanın daraldığında sürene anında +30 saniye ekler.' }, benefit: { tr: '+30 SANİYE' }, effect: 'time' }, 
    { id: 'madox', name: 'Madox', quote: { tr: 'Bu sahnenin türü beni sıktı. Değiştirildi!' }, ruleDesc: { tr: 'Görevini anında iptal eder ve sana yeni bir rastgele görev çektirir.' }, benefit: { tr: 'TÜRÜ DEĞİŞTİR' }, effect: 'genre' }, 
    { id: 'dputiyat', name: 'Dpütiyat', quote: { tr: 'Yalnız olmak yok! Birini kap, sahneye fırlat.' }, ruleDesc: { tr: 'İstediğin bir rakibi sahneye çağırıp görevini onunla oynamasını istersin.' }, benefit: { tr: 'OYUNCU DAVET ET' }, effect: 'add_player' }, 
    { id: 'gulec', name: 'Güleç', quote: { tr: 'Harika! Bir alkış tufanı yaratıyorum!' }, ruleDesc: { tr: 'Seyirci coşkusu (Altın Mikrofon) anında %100 dolar, alacağın puanlar 2 ile çarpılır.' }, benefit: { tr: 'ALKIŞ BONUSU' }, effect: 'applause' }, 
    { id: 'sadic', name: 'Sadıç', quote: { tr: 'Hayat bir kumardır kardeşim! Zarları atıyorum!' }, ruleDesc: { tr: 'Şans zarı atar. %50 ihtimalle +10 Puan kazandırır, %50 ihtimalle -10 Puan kaybettirir.' }, benefit: { tr: 'ŞANS ZARI' }, effect: 'gamble' }, 
    { id: 'cihad', name: 'Cihad', quote: { tr: 'Cebimde bir sürpriz var... Kullan onu!' }, ruleDesc: { tr: 'Sahneye anında dahil edebileceğin rastgele saçma bir obje (hayali) verir.' }, benefit: { tr: 'SÜRPRİZ OBJE' }, effect: 'double' } 
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

const TeamDice3D = ({ winnerId, isRolling, activeAssets, teams }) => {
    const [currentClass, setCurrentClass] = useState('');
    useEffect(() => { 
        if (isRolling) setCurrentClass('kura-rolling'); 
        else if (winnerId !== null) setCurrentClass(`show-${winnerId + 1}`); 
    }, [winnerId, isRolling]);

    const renderFace = (teamIndex) => {
        const team = teams[teamIndex % teams.length];
        const assetSrc = activeAssets[`team${team.id}_idle`] || activeAssets[`team${team.id}`];
        return <div className="w-full h-full flex items-center justify-center bg-black border-2 border-[#D4AF37] rounded-lg overflow-hidden shadow-[inset_0_0_20px_rgba(212,175,55,0.5)] drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">{assetSrc ? <AssetDisplay src={assetSrc} className="w-full h-full object-cover object-top" alt={`Team ${team.id}`} /> : <span className="text-[#D4AF37] text-3xl">T{team.id+1}</span>}</div>;
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
const CardDisplay = ({ card, type, mode = 'draw', onAction, activeAssets, currentTeamId, lang, isMyTurn = true }) => {
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
        if (!isMyTurn) return; 
        if (mode === 'play' && window.anime && cardRef.current) {
            window.anime({ targets: cardRef.current, scale: [1, 1.2], opacity: [1, 0], duration: 300, easing: 'easeInExpo', complete: onAction });
        } else onAction();
    };

    if (!card) return null;
    const isBonus = type === 'bonus'; const isObstacle = type === 'obstacle'; const isFinal = type === 'final'; const isPlaying = mode === 'play';
    let titleText = "", missionText = "", flavorText = "", icon = <Drama size={32} className="text-[#D4AF37]"/>, characterVideoSrc = null, bgStyle = "bg-neutral-900", accentColor = "text-white", glowColor = "rgba(0,0,0,0.6)";
    const baseKey = `team${currentTeamId}`;

    const isHiddenFromOpponent = !isMyTurn && (isBonus || isObstacle) && mode === 'draw';

    if (isBonus) {
        titleText = isHiddenFromOpponent ? "GİZLİ BONUS" : (getLocalizedText(card.name, lang) || "BONUS"); 
        missionText = isHiddenFromOpponent ? "Rakip bir Fırsat Kartı çekti. Sahnede kullanmak üzere envanterine eklendi!" : getLocalizedText(card.quote, lang);
        flavorText = isHiddenFromOpponent ? "GİZLİ KART" : `${UI[lang]?.oppCard || "FIRSAT KARTI"} ✦ ${getLocalizedText(card.benefit, lang)}`;
        icon = <Sparkles size={32} className="text-blue-400 animate-pulse"/>; bgStyle = isPlaying ? "bg-gradient-to-b from-yellow-600 to-red-900" : "bg-gradient-to-b from-indigo-600 to-blue-900"; accentColor = isPlaying ? "text-yellow-200" : "text-indigo-200"; glowColor = isPlaying ? "rgba(255, 200, 0, 0.8)" : "rgba(99, 102, 241, 0.5)";
    } else if (isObstacle) {
        titleText = isHiddenFromOpponent ? "GİZLİ ENGEL" : UI[lang].obsCard; 
        missionText = isHiddenFromOpponent ? "Rakip bir Sabotaj Kartı çekti. Başkalarının performansı sırasında fırlatabilir!" : getLocalizedText(card.text, lang); 
        flavorText = isHiddenFromOpponent ? "GİZLİ KART" : "ENVANTERE EKLENDİ! Başkasının sırasında fırlat.";
        icon = <Skull size={32} className="text-red-500 animate-bounce"/>; characterVideoSrc = activeAssets[`${baseKey}_scared`]; bgStyle = "bg-gradient-to-b from-red-600 to-rose-900"; accentColor = "text-red-200"; glowColor = "rgba(225, 29, 72, 0.5)";
    } else {
        const fallbackTitle = UI[lang] ? UI[lang].improv : "DOĞAÇLAMA";
        titleText = isFinal ? (getLocalizedText(card.title, lang) || fallbackTitle) : fallbackTitle; 
        missionText = getLocalizedText(card.mission, lang);
        const quoteStr = getRandomCardText(card, currentTeamId, lang);
        flavorText = quoteStr ? `"${quoteStr}"` : getLocalizedText(card.desc, lang);
        icon = getCardIcon(missionText + " " + titleText, <Drama size={32} className="text-[#D4AF37]"/>);
        if(type === 'easy') { characterVideoSrc = activeAssets[`${baseKey}_happy`]; bgStyle = "bg-gradient-to-b from-emerald-500 to-teal-800"; accentColor = "text-emerald-100"; titleText = UI[lang]?.easyLevel || "KOLAY SEVİYE"; } 
        else if(type === 'medium') { characterVideoSrc = activeAssets[`${baseKey}_thinking`]; bgStyle = "bg-gradient-to-b from-amber-500 to-orange-800"; accentColor = "text-amber-100"; titleText = UI[lang]?.medLevel || "ORTA SEVİYE"; } 
        else if(type === 'hard') { bgStyle = "bg-gradient-to-b from-rose-500 to-red-800"; accentColor = "text-rose-100"; characterVideoSrc = activeAssets[`${baseKey}_scared`]; titleText = UI[lang]?.hardLevel || "ZOR SEVİYE"; } 
        else if(type === 'final') { bgStyle = "bg-gradient-to-b from-yellow-600 via-orange-600 to-red-900"; accentColor = "text-yellow-100"; characterVideoSrc = activeAssets[`${baseKey}_scared`]; }
    }

    return (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/90 backdrop-blur-sm overflow-hidden px-4">
            {isPlaying && isBonus && <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(255,200,0,0.3)_0%,transparent_70%)] animate-pulse"></div>}
            
            <div ref={cardRef} className={`relative w-full max-w-[90vw] sm:max-w-sm h-[75vh] max-h-[600px] rounded-3xl overflow-hidden shadow-2xl flex flex-col opacity-100 border border-white/20 [mask-image:radial-gradient(white,black)] [-webkit-mask-image:-webkit-radial-gradient(white,black)] transform-gpu`} style={{ boxShadow: `0 10px 40px -10px ${glowColor}`, isolation: 'isolate' }}>
                <div className={`absolute inset-0 ${bgStyle} z-0`}></div>
                
                <div className="absolute inset-0 z-10 flex flex-col justify-start p-0">
                    <div className={`relative w-full h-[55%] shrink-0 z-0 overflow-hidden flex items-center justify-center bg-black`}>
                         
                         {/* ARKA PLAN BLUR SADECE BONUS İÇİN */}
                         {isBonus && !isHiddenFromOpponent && activeAssets[`bonus_${card.id}`] && (
                             <AssetDisplay src={activeAssets[`bonus_${card.id}`]} className="absolute inset-0 w-full h-full object-cover scale-[1.5] blur-2xl opacity-60 bg-transparent" alt="Blur Bg" />
                         )}

                         {/* ANA VİDEO VEYA GİZLİ İKON */}
                         {isBonus ? (
                             isHiddenFromOpponent ? (
                                 <Sparkles size={100} className="text-blue-500 animate-pulse relative z-10 drop-shadow-[0_0_20px_rgba(59,130,246,0.8)]" />
                             ) : (
                                 activeAssets[`bonus_${card.id}`] ? <AssetDisplay src={activeAssets[`bonus_${card.id}`]} className={`relative z-10 w-full h-full object-contain object-center transition-transform duration-700 ${isPlaying ? 'scale-110 drop-shadow-[0_0_30px_rgba(255,200,0,0.8)]' : 'scale-100 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]'}`} alt="Bonus" /> : null
                             )
                         ) : (
                             (isObstacle && isHiddenFromOpponent) ? (
                                 <Skull size={100} className="text-red-500 animate-bounce relative z-10 drop-shadow-[0_0_20px_rgba(239,68,68,0.8)]" />
                             ) : (
                                 characterVideoSrc && <AssetDisplay src={characterVideoSrc} className="relative z-10 w-full h-full object-contain object-center transition-transform duration-700" alt="Character" />
                             )
                         )}

                        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black via-black/80 to-transparent z-20"></div>
                    </div>
                    
                    <div className={`relative z-30 flex-1 flex flex-col items-center justify-start text-center px-6 pb-6 -mt-6`}>
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
                                {isObstacle ? "ENVANTERE AL (Rakibe At)" : (isPlaying ? (UI[lang]?.unleashPower || "GÜCÜ KULLAN") : (isBonus ? "ENVANTERE AL (Sıranda Kullan)" : (UI[lang]?.stageYours || "SAHNE SENİN")))}
                             </button>
                         ) : (
                             <div className="stagger-item opacity-0 w-full mt-auto py-4 rounded-xl font-bold text-sm sm:text-base tracking-widest uppercase bg-black/50 text-gray-400 border border-white/10">
                                ⏳ {TEAM_INFO[currentTeamId].name} Kartı Okuyor...
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
  const [blobAssets, setBlobAssets] = useState({}); // YENİ: Gerçekten Gömülen Blob Videolar
  
  // -- Local User State --
  const [user, setUser] = useState(null);
  const [roomId, setRoomId] = useState('');
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [isSinglePlayer, setIsSinglePlayer] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [toastMsg, setToastMsg] = useState(null); 
  const [isAppLoading, setIsAppLoading] = useState(true); 
  const [teamSelectMode, setTeamSelectMode] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  const [localDiceState, setLocalDiceState] = useState({ isRolling: false, teamIndex: null, showReveal: false });
  const [revealState, setRevealState] = useState({ isActive: false, mode: null, count: 0, selectedTeams: [], currentIndex: 0, isRolling: false });
  
  // -- Synced Game States --
  const [gameState, setGameState] = useState('LOBBY'); 
  const [teams, setTeams] = useState(INITIAL_TEAMS);
  const [players, setPlayers] = useState({}); 
  const [readyPlayers, setReadyPlayers] = useState({}); 
  const [targetTeamCount, setTargetTeamCount] = useState(4); 
  const [hostUid, setHostUid] = useState(null); 
  const [currentTurn, setCurrentTurn] = useState(0);
  const [diceValue, setDiceValue] = useState(null);
  const [activeCard, setActiveCard] = useState(null);
  const [cardType, setCardType] = useState(null);
  const [playingBonus, setPlayingBonus] = useState(null);
  const [performanceTimer, setPerformanceTimer] = useState(0);
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
  
  // İPUCU VE OYLAMA SİSTEMİ STATE'LERİ
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const [showHintModal, setShowHintModal] = useState(false);
  const [juryVotes, setJuryVotes] = useState({}); // YENİ SENKRONİZE OY SİSTEMİ

  // -- Strictly Local UI States --
  const [localJuryScore, setLocalJuryScore] = useState(0); 
  const [voteData, setVoteData] = useState({ roleplay: false, obstacleOvercome: false, fail: false, bonusScore: 0 });
  const [reactions, setReactions] = useState([]);
  const [confetti, setConfetti] = useState(false); 
  const [randomEvent, setRandomEvent] = useState(null);
  const [showRules, setShowRules] = useState(false);
  const [showLogsMenu, setShowLogsMenu] = useState(false);
  const [showCardInfoMenu, setShowCardInfoMenu] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [timerKey, setTimerKey] = useState(0); 
  const [criticLoading, setCriticLoading] = useState(false);
  const [hintTimerLeft, setHintTimerLeft] = useState(10); 
  const [bonusAlert, setBonusAlert] = useState(null);

  // Ortak Asset Değişkeni (Network yerine Blob URL'leri kullanır)
  const activeAssets = { ...assets, ...blobAssets };

  // YENİ: GERÇEKÇİ ASSET YÜKLEME VE GÖMME (PRELOADER)
  useEffect(() => {
      let isMounted = true;
      const loadRealAssets = async () => {
          const keys = Object.keys(GAME_ASSETS).filter(k => GAME_ASSETS[k].endsWith('.mp4'));
          const newBlobs = {};
          let count = 0;
          
          for (const key of keys) {
              if (!isMounted) return;
              try {
                  const res = await fetch(GAME_ASSETS[key]);
                  const blob = await res.blob();
                  const blobUrl = URL.createObjectURL(blob);
                  newBlobs[key] = blobUrl;
                  
                  // Görsel motor darboğazını engellemek için gizli donanım önbelleklemesi
                  const vid = document.createElement('video');
                  vid.src = blobUrl;
                  vid.preload = 'auto';
                  vid.muted = true;
                  vid.load();
              } catch (e) {
                  console.warn("Preload failed for", key);
                  newBlobs[key] = GAME_ASSETS[key];
              }
              count++;
              setLoadingProgress(Math.floor((count / keys.length) * 100));
          }
          
          if (isMounted) {
              setBlobAssets(newBlobs);
              setTimeout(() => setIsAppLoading(false), 500); 
          }
      };
      
      const failsafe = setTimeout(() => {
          if (isMounted && isAppLoading) setIsAppLoading(false);
      }, 12000); 

      loadRealAssets();
      return () => { isMounted = false; clearTimeout(failsafe); };
  }, []);

  useEffect(() => {
      const urlParams = new URLSearchParams(window.location.search);
      const roomCodeFromUrl = urlParams.get('room');
      if (roomCodeFromUrl && user && !roomId) {
          joinRoom(roomCodeFromUrl.toUpperCase());
          window.history.replaceState({}, document.title, window.location.pathname);
      }
  }, [user]); 

  // Başlangıç Karakter Kurası / Tanıtımı Mantığı
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

  // İpucu Geri Sayım Sayacı
  useEffect(() => {
      if (showHintModal) {
          setHintTimerLeft(10);
          const timer = setInterval(() => {
              setHintTimerLeft(prev => {
                  if (prev <= 1) {
                      clearInterval(timer);
                      if (isMyTurn) closeHint(); 
                      return 0;
                  }
                  return prev - 1;
              });
          }, 1000);
          return () => clearInterval(timer);
      }
  }, [showHintModal]);

  // --- FIREBASE AUTH ---
  useEffect(() => {
      if (!auth) { setAuthError("Firebase modülü başlatılamadı."); return; }
      const connectionTimeout = setTimeout(() => {
          if (!user) setAuthError("Bağlantı zaman aşımına uğradı. İnternetinizi kontrol edin veya 'Tek Oyunculu' devam edin.");
      }, 5000);

      const initAuth = async () => {
          try {
              const hasCanvasConfig = typeof __firebase_config !== 'undefined' && __firebase_config;
              if (hasCanvasConfig && typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
                  await signInWithCustomToken(auth, __initial_auth_token);
              } else { await signInAnonymously(auth); }
          } catch (e) { 
              console.error("Auth Error", e); setAuthError(e.message || "Giriş reddedildi.");
          }
      };
      initAuth();
      
      const unsub = onAuthStateChanged(auth, (u) => {
          if (u) clearTimeout(connectionTimeout);
          setUser(u);
      });
      return () => { unsub(); clearTimeout(connectionTimeout); };
  }, []);

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
      if ('isTimerPaused' in updates) setIsTimerPaused(updates.isTimerPaused);
      if ('showHintModal' in updates) setShowHintModal(updates.showHintModal);
      if ('juryVotes' in updates) setJuryVotes(updates.juryVotes);

      if (!isSinglePlayer && roomId && db) {
          try { await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'rooms', roomId), updates); } 
          catch (e) { console.error("Sync error:", e); }
      }
  };

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
              if (data.isTimerPaused !== undefined) setIsTimerPaused(data.isTimerPaused);
              if (data.showHintModal !== undefined) setShowHintModal(data.showHintModal);
              if (data.juryVotes !== undefined) setJuryVotes(data.juryVotes);
              
              if (data.eventTrigger) {
                  if (data.eventTrigger.type === 'reaction') { setReactions(p => [...p, { id: Date.now()+Math.random(), emoji: data.eventTrigger.emoji, x: Math.random()*80+10 }]); playSynthSound('click', soundEnabled); }
                  else if (data.eventTrigger.type === 'confetti') { setConfetti(true); setTimeout(() => setConfetti(false), 2000); }
                  else if (data.eventTrigger.type === 'audience') { setRandomEvent(data.eventTrigger.data); setTimeout(() => setRandomEvent(null), 2500); }
                  else if (data.eventTrigger.type === 'bonus_alert') {
                      setBonusAlert(data.eventTrigger.data);
                      playSynthSound('powerup', soundEnabled);
                      setTimeout(() => setBonusAlert(null), 6000);
                  }
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
      if (audioEl.src !== activeAssets.music_bg) { audioEl.src = activeAssets.music_bg; audioEl.loop = true; audioEl.volume = 0.15; }
      if (audioEl.paused) audioEl.play().catch(e => console.log("Auto-play blocked", e));
  }, [soundEnabled, activeAssets.music_bg]);

  const addLog = (msg) => { const newLogs = [`• ${msg}`, ...logs].slice(0, 15); syncGame({ logs: newLogs }); };
  
  const triggerRemoteEvent = (eventData) => {
      if (isSinglePlayer) {
          if (eventData.type === 'reaction') { setReactions(p => [...p, { id: Date.now()+Math.random(), emoji: eventData.emoji, x: Math.random()*80+10 }]); playSynthSound('click', soundEnabled); }
          else if (eventData.type === 'confetti') { setConfetti(true); setTimeout(() => setConfetti(false), 2000); }
          else if (eventData.type === 'audience') { setRandomEvent(eventData.data); setTimeout(() => setRandomEvent(null), 2500); }
          else if (eventData.type === 'bonus_alert') {
              setBonusAlert(eventData.data);
              playSynthSound('powerup', soundEnabled);
              setTimeout(() => setBonusAlert(null), 6000);
          }
          return;
      }
      syncGame({ eventTrigger: eventData });
  };

  const addReaction = (emoji) => { triggerRemoteEvent({ type: 'reaction', emoji }); setHypeMeter(Math.min(100, hypeMeter + 2)); syncGame({ hypeMeter: Math.min(100, hypeMeter + 2) }); };
  const removeReaction = useCallback((id) => setReactions(prev => prev.filter(r => r.id !== id)), []);

  const promptSinglePlayer = () => setTeamSelectMode('single');
  const promptMultiPlayer = () => setTeamSelectMode('multi');

  const handleTeamSelection = (count, mode) => {
      playSynthSound('click', soundEnabled);
      const activeTeams = [...INITIAL_TEAMS].sort(() => 0.5 - Math.random()).slice(0, count).sort((a, b) => a.id - b.id);
      setRevealState({ isActive: true, mode: mode, count: count, selectedTeams: activeTeams, currentIndex: 0, isRolling: true });
  };

  const startSinglePlayer = (count, activeTeams) => {
      setIsSinglePlayer(true); setRoomId(''); setTeams(activeTeams); setTargetTeamCount(count); setGameState('INTRO'); setCurrentTurn(0); setHypeMeter(0); setTeamSelectMode(null); setLogs(["DOĞAÇLA Tek Oyunculu Olarak Başladı!"]);
  };

  const createRoom = async (count, activeTeams) => {
      if (!user || !db) return;
      try {
          const code = Math.random().toString(36).substring(2, 6).toUpperCase();
          const initialData = { gameState: 'INTRO', teams: activeTeams, targetTeamCount: count, players: {}, readyPlayers: {}, hostUid: user.uid, currentTurn: 0, hypeMeter: 0, logs: ["Doğaçla'ya Hoş Geldiniz!"] };
          await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'rooms', code), initialData);
          setIsSinglePlayer(false); setRoomId(code); setTeamSelectMode(null); setAuthError(null);
      } catch (err) { console.error(err); setAuthError("Oda kurulamadı: " + err.message); }
  };
  
  const joinRoom = async (code) => {
      if (!user || !db || code.length !== 4) return;
      try {
          const docSnap = await getDoc(doc(db, 'artifacts', appId, 'public', 'data', 'rooms', code));
          if (docSnap.exists()) { setIsSinglePlayer(false); setRoomId(code); setAuthError(null); } 
          else { setAuthError("HATA: Böyle bir oda kodu bulunamadı!"); }
      } catch(err) { console.error(err); setAuthError("Odaya Katılma Hatası: " + err.message); }
  };

  const joinTeamWithDice = () => {
      if (!user) return;
      playSynthSound('roll', soundEnabled);
      setLocalDiceState({ isRolling: true, teamIndex: null, showReveal: false });
      setTimeout(() => {
          const teamCounts = Array(teams.length).fill(0);
          Object.values(players).forEach(tId => { const index = teams.findIndex(t => t.id === tId); if (index !== -1) teamCounts[index]++; });
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
      playSynthSound('click', soundEnabled); setIsSinglePlayer(false);
      syncGame({ gameState: 'LOBBY', teams: INITIAL_TEAMS, players: {}, readyPlayers: {}, targetTeamCount: 4, hostUid: null, currentTurn: 0, diceValue: null, activeCard: null, cardType: null, playingBonus: null, performanceTimer: 0, hypeMeter: 0, characterMood: 'idle', isRollingDice: false, showDiceModal: false, kuraRolling: false, finalists: [], directors: [], draftMission: null, customFinalCard: null, aiCards: [], finalTurnIndex: 0, winner: null, logs: ["Doğaçla Mobile Act I!"], isTimerPaused: false, showHintModal: false, juryVotes: {} });
      setLocalJuryScore(0);
      setRoomId('');
      setShowCardInfoMenu(false);
  };

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
  
  const throwObstacle = (index) => {
      if (!myTeam || isMyTurn) return;
      const obstacleToThrow = myTeam.heldObstacles[index];
      const newTeams = [...teams];
      const myTeamIndex = newTeams.findIndex(t => t.id === myTeam.id);
      newTeams[myTeamIndex] = { ...newTeams[myTeamIndex], heldObstacles: newTeams[myTeamIndex].heldObstacles.filter((_, i) => i !== index) };
      const activeTeamIndex = newTeams.findIndex(t => t.id === currentTeam.id);
      newTeams[activeTeamIndex] = { ...newTeams[activeTeamIndex], activeObstacles: [...newTeams[activeTeamIndex].activeObstacles, obstacleToThrow] };

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
      const promptText = `Bir tiyatro yönetmeni olarak, oyuncuların sana verdiği şu fikri al: "${directorInput}". Sahnede oynanacak KISA, KOMİK ve ABSÜRT bir tiyatro görevine dönüştür. İngilizce çevirisini de yap. Lütfen ÇOK KISA cümleler kullan. Maksimum 2 cümle olsun.`;
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
      
      const promptText = `Şu tiyatro görevini temel al: "${getLocalizedText(draftMission, 'tr')}". Lütfen bu görevi 3 farklı sahne tarzına göre uyarla. Hem Türkçe (tr) hem İngilizce (en) üret. Lütfen SADECE başlık, görev (mission) ve açıklama (desc) üret. ÇOK KISA CÜMLELER KUR. Maksimum 2 cümle.`;
      
      const schema = { 
          type: "ARRAY", 
          items: { 
              type: "OBJECT", 
              properties: { 
                  styleType: {type: "STRING", description: "DRAMATIC, ABSURD veya SILENT yaz."},
                  title: { type: "OBJECT", properties: { tr: {type:"STRING"}, en: {type:"STRING"} } }, 
                  mission: { type: "OBJECT", properties: { tr: {type:"STRING"}, en: {type:"STRING"} } }, 
                  desc: { type: "OBJECT", properties: { tr: {type:"STRING"}, en: {type:"STRING"} } }
              } 
          } 
      };
      
      try {
          let resultData = null; let delay = 1000;
          for(let i=0; i<3; i++) {
              try { const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: promptText }] }], generationConfig: { responseMimeType: "application/json", responseSchema: schema } }) });
                  const data = await response.json(); if(data.candidates) { resultData = JSON.parse(data.candidates[0].content.parts[0].text); break; }
              } catch(err) { if(i===2) throw err; await new Promise(r=>setTimeout(r,delay)); delay*=2; }
          }
          if(resultData && resultData.length > 0) { 
              const fastCards = resultData.map(c => ({
                  ...c,
                  quotes: getDynamicQuotesDual(directorInput.trim(), c.styleType || 'ABSURD')
              }));
              playSynthSound('success', soundEnabled); 
              syncGame({ aiCards: fastCards, gameState: 'FINALS_SELECT_CARD' }); 
          } else throw new Error("API error");
      } catch(error) { 
          playSynthSound('success', soundEnabled); 
          syncGame({ aiCards: generateMockCardsDual(directorInput.trim(), draftMission), gameState: 'FINALS_SELECT_CARD' }); 
      }
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
      
      if (targetPos === 35) { 
          const finishers = currentTeams.filter(t => t.pos >= 35); 
          if (finishers.length > 0) { 
              const sorted = [...currentTeams].sort((a, b) => b.score - a.score); 
              syncGame({ teams: currentTeams, finalists: sorted.slice(0, 2), directors: sorted.slice(2, 4), finalTurnIndex: 0, currentTurn: currentTeams.findIndex(t => t.id === sorted[0].id), draftMission: null, gameState: 'FINALS_DIRECTOR_INPUT' }); playSynthSound('success', soundEnabled);
          }
      } else { 
          syncGame({ teams: currentTeams });
          const type = BOARD_MAP[targetPos].type; 
          if(type === 'start') {
              syncGame({ gameState: 'ROLL', diceValue: null, currentTurn: (currentTurn + 1) % currentTeams.length, characterMood: 'idle' });
          } else drawCard(type); 
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
          syncGame({ teams: newTeams, activeCard: null, gameState: 'ROLL', diceValue: null, currentTurn: (currentTurn + 1) % teams.length, characterMood: 'idle' }); 
          addLog(lang === 'tr' ? `${TEAM_INFO[currentTeam.id].name} bonus kaptı!` : `${TEAM_INFO[currentTeam.id].name} got bonus!`); 
          triggerRemoteEvent({ type: 'confetti' }); 
      } else if (cardType === 'obstacle') { 
          const newTeams = teams.map((t, i) => i === currentTurn ? { ...t, heldObstacles: [...(t.heldObstacles || []), activeCard] } : t);
          syncGame({ teams: newTeams, activeCard: null, gameState: 'ROLL', diceValue: null, currentTurn: (currentTurn + 1) % teams.length, characterMood: 'idle' });
          addLog(`${TEAM_INFO[currentTeam.id].name} bir Engel Kartı kazandı!`);
      } else { 
          syncGame({ performanceTimer: 10, gameState: 'PRE_PERFORM' }); 
          setTimerKey(p => p + 1); 
      } 
  };

  const processVotingResult = useCallback((scores) => {
      let avgScore = 0;
      if (scores.length > 0) {
          avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
      }
      
      let newHype = hypeMeter;
      let finalScore = avgScore;

      if (isGoldenMic) { 
          finalScore *= 2; 
          addLog(UI[lang].goldenMic + "!"); 
          newHype = 0; 
          playSynthSound('hype', soundEnabled); 
          triggerRemoteEvent({ type: 'confetti' }); 
      } else { 
          newHype = Math.min(100, hypeMeter + (finalScore > 5 ? 20 : 5)); 
      } 
      
      const newMood = finalScore > 3 ? 'happy' : (finalScore < 0 ? 'scared' : characterMood);
      const isFinal = gameState === 'FINALS_VOTE'; 
      const targetId = isFinal && finalists[finalTurnIndex] ? finalists[finalTurnIndex].id : currentTeam.id; 
      const newTeams = teams.map(t => t.id === targetId ? { ...t, score: t.score + finalScore, activeObstacles: [] } : t);
      
      const updates = { teams: newTeams, hypeMeter: newHype, characterMood: newMood, activeCard: null, juryVotes: {} };

      if (isFinal) { 
          if (finalTurnIndex === 0) { 
              updates.finalTurnIndex = 1;
              updates.currentTurn = newTeams.findIndex(t => t.id === finalists[1].id);
              updates.gameState = 'FINALS_PREP';
              syncGame(updates);
          } 
          else {
              const winnerTeam = newTeams.find(t => t.id === finalists[0].id).score > newTeams.find(t => t.id === finalists[1].id).score ? finalists[0] : finalists[1];
              updates.winner = winnerTeam;
              updates.gameState = 'END';
              syncGame(updates);
              triggerRemoteEvent({ type: 'confetti' });
          }
      } else { 
          const hasFinished = newTeams.find(t=>t.id===currentTeam.id).pos === 35;
          if (hasFinished) {
              const sorted = [...newTeams].sort((a, b) => b.score - a.score);
              updates.finalists = sorted.slice(0, 2);
              updates.directors = sorted.slice(2, 4);
              updates.finalTurnIndex = 0;
              updates.currentTurn = newTeams.findIndex(t => t.id === sorted[0].id);
              updates.draftMission = null;
              updates.gameState = 'FINALS_DIRECTOR_INPUT';
              syncGame(updates);
              playSynthSound('success', soundEnabled);
          } else {
              updates.gameState = 'ROLL';
              updates.diceValue = null;
              updates.currentTurn = (currentTurn + 1) % teams.length;
              updates.characterMood = 'idle';
              syncGame(updates);
          }
      }
  }, [gameState, finalists, finalTurnIndex, currentTeam.id, teams, isGoldenMic, hypeMeter, soundEnabled, lang, characterMood]);

  const submitManualVote = useCallback(() => { 
      if (gameState !== 'VOTE' && gameState !== 'FINALS_VOTE') return;
      if (juryVotes[user?.uid] !== undefined) return; 

      playSynthSound('success', soundEnabled); 
      let calcScore = localJuryScore; 
      if(voteData.roleplay) calcScore += 2; 
      if(voteData.obstacleOvercome) calcScore += 2; 
      if(voteData.fail) calcScore = -2; 
      calcScore += (voteData.bonusScore || 0); 
      
      setVoteData({ roleplay: false, obstacleOvercome: false, fail: false, bonusScore: 0 }); 
      setLocalJuryScore(0); 

      if (isSinglePlayer) {
          processVotingResult([calcScore]);
      } else {
          const roomRef = doc(db, 'artifacts', appId, 'public', 'data', 'rooms', roomId);
          updateDoc(roomRef, { [`juryVotes.${user.uid}`]: calcScore }).catch(e => console.error("Vote error", e));
      }
  }, [gameState, localJuryScore, voteData, isSinglePlayer, processVotingResult, user, juryVotes, soundEnabled, roomId]);

  useEffect(() => {
      if (!isHost || isSinglePlayer) return;
      if (gameState === 'VOTE' || gameState === 'FINALS_VOTE') {
          const performingTeamId = gameState === 'FINALS_VOTE' ? finalists[finalTurnIndex]?.id : currentTeam.id;
          const eligibleVoters = Object.keys(players).filter(uid => players[uid] !== performingTeamId);
          
          if (eligibleVoters.length > 0 && eligibleVoters.every(uid => juryVotes[uid] !== undefined)) {
              processVotingResult(Object.values(juryVotes));
          }
      }
  }, [juryVotes, gameState, isHost, isSinglePlayer, players, currentTeam.id, finalists, finalTurnIndex, processVotingResult]);
  
  const finishPerformance = () => {
      if (gameState === 'PRE_PERFORM') {
          const timer = cardType === 'easy' ? 60 : (cardType === 'final' ? 120 : 90);
          syncGame({ performanceTimer: timer, gameState: cardType === 'final' ? 'FINALS_PLAY' : 'PERFORM' }); 
          setTimerKey(p => p + 1);
      }
      else if (gameState === 'FINALS_PLAY') { 
          if (finalTurnIndex === 0) syncGame({ gameState: 'FINALS_TRANSITION' }); 
          else syncGame({ gameState: 'FINALS_CASTING' }); 
      } 
      else syncGame({ gameState: 'VOTE' });
  };

  const startNextFinalist = () => { syncGame({ finalTurnIndex: 1, currentTurn: teams.findIndex(t => t.id === finalists[1].id), gameState: 'FINALS_PREP' }); playSynthSound('click', soundEnabled); };
  
  const prepareBonus = (bonusIndex) => syncGame({ playingBonus: currentTeam.bonuses[bonusIndex] });
  
  const executeBonusPower = () => {
      triggerRemoteEvent({ type: 'confetti' });
      let newTimer = performanceTimer;
      let newHype = hypeMeter;
      let newCard = activeCard;
      let bonusMsg = "";
      let color = "text-blue-400";
      let pointDelta = 0;

      const getRoleplayMsg = (effect) => {
          const msgs = {
              'time': ["Zamanı büktü! Yönetmen araya girdi ve süreyi uzattı! (+30 Saniye)", "Tam sahne bitecekken ek süre kazandı! (+30 Saniye)"],
              'score': ["Jüriye gizli bir rüşvet verildi! Temizinden +2 Puan!", "Kimse fark etmeden skoru +2 artırdı! Sinsice!"],
              'applause': ["Seyirci çıldırdı! Altın Mikrofon artık aktif, X2 PUAN!", "Müthiş bir karizma! Seyirci coştu, Altın Mikrofon devrede!"],
              'gamble_win': ["Hayat bir kumar! Zarlar atıldı, şans onunla: KASAYA +10 PUAN!", "Risk aldı ve başardı! Çöpe gitmeden büyük +10 PUAN!"],
              'gamble_lose': ["Hayat bir kumar! Zarlar atıldı... Eyvah! -10 PUAN!", "Büyük risk, büyük hüsran! Zar kötü geldi: -10 PUAN!"],
              'genre': ["Senaryoyu çöpe fırlattı! 'Ben bunu oynamam' deyip yeni rol kaptı!", "Yönetmen sinirlendi! 'Değiştirin bu sahneyi!' dedi, yepyeni bir rol geldi!"],
              'default': ["Kimsenin beklemediği o efsanevi bonus devrede!", "Beklenmedik bir hamle! Sahnede büyük bir oyun çevirdi!"]
          };
          const arr = msgs[effect] || msgs['default'];
          return arr[Math.floor(Math.random() * arr.length)];
      };

      if (playingBonus.effect === 'time') { 
          newTimer += 30; 
          bonusMsg = getRoleplayMsg('time');
          color = "text-green-400";
      } 
      else if (playingBonus.effect === 'score') { 
          pointDelta = 2;
          bonusMsg = getRoleplayMsg('score');
          color = "text-yellow-400";
      }
      else if (playingBonus.effect === 'applause') {
          newHype = 100;
          bonusMsg = getRoleplayMsg('applause');
          color = "text-yellow-500";
      }
      else if (playingBonus.effect === 'gamble') {
          const isWin = Math.random() > 0.5;
          pointDelta = isWin ? 10 : -10;
          bonusMsg = isWin ? getRoleplayMsg('gamble_win') : getRoleplayMsg('gamble_lose');
          color = isWin ? "text-green-500" : "text-red-500";
      }
      else if (playingBonus.effect === 'genre') {
          const list = [...CARDS.MEDIUM, ...CARDS.HARD];
          newCard = list[Math.floor(Math.random() * list.length)];
          bonusMsg = getRoleplayMsg('genre');
          color = "text-purple-400";
      }
      else {
          bonusMsg = getRoleplayMsg('default');
          color = "text-pink-400";
      }

      triggerRemoteEvent({ 
          type: 'bonus_alert', 
          data: { 
              teamName: TEAM_INFO[currentTeam.id].name, 
              bonusName: getLocalizedText(playingBonus.name, lang),
              msg: bonusMsg,
              color: color
          } 
      });

      const newTeams = teams.map(t => t.id === currentTeam.id ? { 
          ...t, 
          score: t.score + pointDelta,
          bonuses: t.bonuses.filter(b => b.id !== playingBonus.id) 
      } : t);

      syncGame({ 
          teams: newTeams, 
          playingBonus: null, 
          performanceTimer: newTimer,
          hypeMeter: newHype,
          activeCard: newCard
      });
  };

  const requestHint = () => {
      if (!isMyTurn || !activeCard?.hint) return;
      playSynthSound('powerup', soundEnabled);
      syncGame({ isTimerPaused: true, showHintModal: true });
  };

  const closeHint = () => {
      playSynthSound('click', soundEnabled);
      syncGame({ isTimerPaused: false, showHintModal: false });
  };

  const getCurrentCharacterAsset = () => { const baseKey = `team${currentTeam.id}`; return activeAssets[`${baseKey}_${characterMood}`] || activeAssets[`${baseKey}_idle`] || activeAssets[baseKey]; };

  // --- LOBBY & TEAM SELECT SCREEN RENDER ---
  if (gameState === 'LOBBY') {
      
      if (revealState.isActive) {
          const topBarTeams = revealState.selectedTeams.slice(0, revealState.currentIndex);
          const revealCurrentTeam = revealState.selectedTeams[revealState.currentIndex];

          return (
              <div className="h-screen w-full flex flex-col items-center justify-center bg-neutral-950 text-white relative overflow-hidden">
                  <div className="absolute inset-0 z-0 opacity-40 transition-opacity duration-1000" style={{backgroundImage: activeAssets.bg ? `url(${activeAssets.bg})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center'}}></div>
                  <div className="absolute inset-0 z-0 bg-gradient-to-t from-black via-transparent to-black/80 pointer-events-none"></div>

                  <div className="absolute top-12 w-full flex justify-center gap-4 z-20 px-4">
                      {topBarTeams.map((t, idx) => (
                          <div key={t.id} className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-white/40 overflow-hidden bg-black shadow-[0_0_15px_rgba(255,255,255,0.2)] animate-fade-in-up">
                               <AssetDisplay src={activeAssets[`team${t.id}_idle`] || activeAssets[`team${t.id}`]} className="w-full h-full object-cover object-top" />
                          </div>
                      ))}
                  </div>

                  <div className="relative z-10 flex flex-col items-center w-full px-4">
                      {revealState.isRolling ? (
                          <div className="text-center scale-110 sm:scale-125 mt-10">
                              <TeamDice3D winnerId={null} isRolling={true} activeAssets={activeAssets} teams={INITIAL_TEAMS} />
                              <div className="mt-12 text-xl sm:text-2xl font-black text-neon-blue animate-pulse tracking-widest">
                                  {revealState.currentIndex + 1}. TAKIM SEÇİLİYOR...
                              </div>
                          </div>
                      ) : (
                          <div className="flex flex-col items-center mt-10 animate-fade-in-up w-full max-w-md bg-black/60 p-6 sm:p-8 rounded-3xl border-2 border-white/10 backdrop-blur-md shadow-2xl">
                              <div className={`w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 ${revealCurrentTeam.border} overflow-hidden bg-black shadow-[0_0_30px_rgba(250,204,21,0.5)] mb-6`}>
                                  <AssetDisplay src={activeAssets[`team${revealCurrentTeam.id}_happy`] || activeAssets[`team${revealCurrentTeam.id}_idle`]} className="w-full h-full object-cover object-top" />
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
                  <div className="absolute inset-0 z-0 opacity-40 transition-opacity duration-1000" style={{backgroundImage: activeAssets.bg ? `url(${activeAssets.bg})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center'}}></div>
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
                                              <AssetDisplay src={activeAssets[`team${i}_idle`] || activeAssets[`team${i}`]} className="w-full h-full object-cover object-top" />
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
                      {GAME_ASSETS.logo ? (
                          <img src={GAME_ASSETS.logo} alt="Loading Logo" className="w-48 sm:w-64 mb-6 animate-pulse drop-shadow-[0_0_20px_rgba(250,204,21,0.8)] object-contain bg-transparent" />
                      ) : (
                          <Theater size={80} className="text-yellow-500 animate-pulse mb-6 drop-shadow-[0_0_20px_rgba(250,204,21,0.8)]" />
                      )}
                      <h1 className="text-2xl sm:text-3xl font-black text-yellow-400 tracking-widest animate-bounce mt-4">YÜKLENİYOR... %{loadingProgress}</h1>
                      <div className="mt-8 w-48 sm:w-64 h-3 bg-gray-800 rounded-full overflow-hidden border border-white/20">
                          <div className="h-full bg-gradient-to-r from-yellow-600 to-yellow-300 transition-all duration-300" style={{ width: `${loadingProgress}%` }}></div>
                      </div>
                  </div>
              )}
              <div className="absolute inset-0 z-0 opacity-40 transition-opacity duration-1000" style={{backgroundImage: activeAssets.bg ? `url(${activeAssets.bg})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center'}}></div>
              <div className="absolute inset-0 z-0 bg-gradient-to-t from-black via-transparent to-black/80 pointer-events-none"></div>
              
              <div className="relative z-10 flex flex-col items-center w-full mt-8 px-2">
                  {activeAssets.logo ? (
                      <img src={activeAssets.logo} alt="DOĞAÇLA" className="w-48 sm:w-64 md:w-80 max-w-[80vw] mb-6 drop-shadow-[0_0_20px_rgba(250,204,21,0.6)] object-contain bg-transparent" />
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
                          <AssetDisplay src={activeAssets[`team${assignedTeam.id}_happy`] || activeAssets[`team${assignedTeam.id}_idle`]} className="w-full h-full object-cover object-top" />
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
                  <TeamDice3D winnerId={localDiceState.isRolling ? null : localDiceState.teamIndex} isRolling={localDiceState.isRolling} activeAssets={activeAssets} teams={teams} />
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

      {/* DEV BONUS DUYURU MODALI */}
      {bonusAlert && (
          <div className="fixed inset-0 z-[130] pointer-events-none flex flex-col items-center justify-center bg-black/60 backdrop-blur-md animate-fade-in-up px-4">
              <div className="bg-gray-900 border-4 border-blue-500 p-6 sm:p-10 rounded-3xl shadow-[0_0_50px_rgba(59,130,246,0.6)] text-center w-full max-w-[90vw] sm:max-w-md animate-pulse-fast">
                  <Sparkles size={64} className="text-blue-400 mx-auto mb-4 animate-spin-slow" />
                  <div className="text-blue-300 font-bold tracking-widest text-xs sm:text-sm mb-2 uppercase">🎭 {bonusAlert.teamName} BİR HAMLE YAPTI!</div>
                  <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 uppercase">{bonusAlert.bonusName}</h2>
                  <div className="bg-black/50 border border-gray-700 rounded-2xl p-4">
                      <p className={`text-lg sm:text-xl font-black ${bonusAlert.color} drop-shadow-md leading-snug`}>{bonusAlert.msg}</p>
                  </div>
              </div>
          </div>
      )}

      {/* İPUCU MODALI (Zamanı Durdurur) */}
      {showHintModal && (
          <div className="fixed inset-0 z-[110] bg-black/95 flex flex-col items-center justify-center p-6 text-center backdrop-blur-lg">
              <Lightbulb size={80} className="text-yellow-400 mb-6 animate-pulse" />
              <h2 className="text-3xl font-black text-yellow-400 mb-4 tracking-widest uppercase">YÖNETMEN İPUCUSU</h2>
              <p className="text-xl sm:text-2xl text-white mb-8 border-2 border-yellow-500/50 bg-black/50 p-6 rounded-2xl shadow-[0_0_30px_rgba(250,204,21,0.3)]">
                  {getLocalizedText(activeCard?.hint, lang)}
              </p>
              <div className="text-6xl sm:text-7xl font-black text-neon-blue mb-8">{hintTimerLeft}</div>
              {isMyTurn && (
                  <button onClick={closeHint} className="px-8 py-4 w-full max-w-[90vw] sm:max-w-sm bg-white text-black font-black text-xl rounded-full active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.5)]">
                      ANLADIM (DEVAM ET)
                  </button>
              )}
          </div>
      )}

      <div className="absolute inset-0 z-0 opacity-40 transition-opacity duration-1000" style={{backgroundImage: activeAssets.bg ? `url(${activeAssets.bg})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center'}}></div>
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-black via-transparent to-black/80 pointer-events-none"></div>

      {/* KİŞİSEL KİMLİK KARTI (HUD) - Sadece Lobi haricinde ve takımı belliyse görünür */}
      {myTeam && gameState !== 'LOBBY' && gameState !== 'INTRO' && (
         <div className="fixed top-16 right-2 sm:right-4 z-50 bg-black/80 border border-gray-600 rounded-xl p-2 flex items-center gap-2 shadow-lg backdrop-blur-md pointer-events-none">
            <div className={`w-8 h-8 rounded-full border-2 ${myTeam.border} overflow-hidden shadow-inner bg-black`}>
               <AssetDisplay src={activeAssets[`team${myTeam.id}_idle`]} className="w-full h-full object-cover object-top" />
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

      {showDiceModal && <div className="fixed inset-0 bg-black/90 z-[80] flex items-center justify-center backdrop-blur-md"><div className="text-center scale-110">{gameState === 'KURA' ? <TeamDice3D winnerId={kuraRolling ? null : currentTurn} isRolling={kuraRolling} activeAssets={activeAssets} teams={teams} /> : <Dice3D value={isRollingDice ? null : (diceValue > 6 ? 6 : diceValue)} isRolling={isRollingDice} />}<div className="mt-12 text-2xl font-black text-neon-blue animate-pulse tracking-widest">{kuraRolling ? UI[lang].drawingLots : UI[lang].rollingDice}</div></div></div>}
      
      {/* FLOATING HEADER (MOBILE) */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-black/50 border-b border-white/10 flex items-center justify-between px-2 sm:px-3 z-40 backdrop-blur-lg">
          <div className="flex items-center gap-1 sm:gap-2">
              {activeAssets.logo ? (
                  <img src={activeAssets.logo} alt="Logo" className="h-8 sm:h-10 w-auto object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] bg-transparent"/>
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
              <button onClick={() => setShowCardInfoMenu(true)} className="p-1.5 sm:p-2 text-gray-300 hover:text-blue-400 transition bg-white/10 rounded-lg" title="Kart Rehberi"><BookOpen size={18} /></button>
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
                {activeAssets.logo ? (
                    <img src={activeAssets.logo} alt="DOĞAÇLA" className="w-40 sm:w-56 md:w-64 max-w-[70vw] mb-4 animate-pulse drop-shadow-[0_0_30px_rgba(250,204,21,0.5)] object-contain bg-transparent" />
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
                                        <AssetDisplay src={activeAssets[`team${t.id}_idle`] || activeAssets[`team${t.id}`]} className="w-full h-full object-cover object-top" />
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
                                            {(activeAssets[`team${p.id}`] || activeAssets[`team${p.id}_idle`]) ? <AssetDisplay src={activeAssets[`team${p.id}`] || activeAssets[`team${p.id}_idle`]} className="w-full h-full object-cover object-top" alt={`P${p.id}`} /> : <span className="text-[14px] sm:text-[16px]">{p.icon}</span>}
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
                  
                  {gameState === 'PRE_PERFORM' && (
                      <div className="w-full flex flex-col gap-4 text-center">
                          <h3 className="text-xl font-black text-red-500 animate-pulse uppercase tracking-widest">SABOTAJ SÜRESİ</h3>
                          <Timer key={timerKey} duration={performanceTimer} onFinish={finishPerformance} soundEnabled={soundEnabled} isPaused={isTimerPaused} />
                          
                          {!isMyTurn && myTeam?.heldObstacles?.length > 0 && (
                              <div className="mt-2 border-t border-gray-700 pt-4">
                                  <div className="text-red-500 font-bold text-xs mb-2">😈 HEMEN BİR ENGEL FIRLAT!</div>
                                  <div className="flex gap-2 overflow-x-auto no-scrollbar justify-center">
                                      {myTeam.heldObstacles.map((obs, i) => (
                                          <button key={i} onClick={() => throwObstacle(i)} className="px-4 py-3 bg-red-900/50 border-2 border-red-500 rounded-xl text-sm font-bold text-red-100 whitespace-nowrap active:scale-95 shadow-[0_0_15px_rgba(239,68,68,0.5)]">
                                              <Skull size={16} className="inline mr-1 mb-0.5"/> {getLocalizedText(obs.text, lang)}
                                          </button>
                                      ))}
                                  </div>
                              </div>
                          )}
                          {isMyTurn && (
                              <p className="text-gray-400 text-sm font-bold px-4">Rakiplerinin sana engel atması için son saniyeler, hazırlan!</p>
                          )}
                          {(isHost || isSinglePlayer) && (
                              <button onClick={finishPerformance} className="mt-2 px-4 py-3 bg-white/10 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 active:bg-white/20"><SkipForward size={16}/> SÜREYİ ATLA (HEMEN BAŞLA)</button>
                          )}
                      </div>
                  )}

                  {gameState === 'PERFORM' && (
                      <div className="w-full flex flex-col gap-4">
                          <div className="flex justify-between items-end px-2">
                              <div className="flex gap-2 sm:gap-3">
                                  <button onClick={() => addReaction('👏')} className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-green-600/20 border-2 border-green-500/50 flex items-center justify-center text-xl sm:text-2xl active:bg-green-500/40 shadow-lg">👏</button>
                                  <button onClick={() => addReaction('😂')} className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-yellow-600/20 border-2 border-yellow-500/50 flex items-center justify-center text-xl sm:text-2xl active:bg-yellow-500/40 shadow-lg">😂</button>
                              </div>
                              <Timer key={timerKey} duration={performanceTimer} onFinish={finishPerformance} soundEnabled={soundEnabled} isPaused={isTimerPaused} />
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

                          {/* İPUCU BUTONU */}
                          {isMyTurn && (
                              <button onClick={requestHint} className="w-full py-3 bg-yellow-600/20 border-2 border-yellow-500/50 rounded-xl font-bold text-yellow-400 flex justify-center items-center gap-2 active:bg-yellow-500/40 transition mb-2 shadow-[0_0_15px_rgba(250,204,21,0.2)]">
                                  <HelpCircle size={20} /> İPUCU AL (Süreyi Durdurur)
                              </button>
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
                          {isMyTurn && !isSinglePlayer ? (
                              <div className="bg-gray-800 border-2 border-gray-600 p-6 rounded-2xl text-center shadow-inner">
                                  <div className="flex gap-3 justify-center mb-4">
                                       {teams.filter(t => t.id !== currentTeam.id).map(t => (
                                           <div key={t.id} className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 ${t.border} overflow-hidden bg-black shadow-lg animate-pulse`}>
                                               <AssetDisplay src={activeAssets[`team${t.id}_thinking`] || activeAssets[`team${t.id}_idle`]} className="w-full h-full object-cover object-top" />
                                           </div>
                                       ))}
                                  </div>
                                  <h3 className="text-xl sm:text-2xl font-black text-yellow-400 mb-2 uppercase tracking-widest">JÜRİ KARAR VERİYOR</h3>
                                  <p className="text-gray-300 text-sm sm:text-base">Performansın değerlendiriliyor. Lütfen diğer takımların puan vermesini bekle...</p>
                                  
                                  {/* YENİ: BEKLENEN JÜRİLER LİSTESİ */}
                                  <div className="mt-4 p-3 bg-black/40 rounded-xl border border-gray-700 w-full text-left">
                                      <div className="text-neon-blue font-bold tracking-widest mb-2 text-center text-xs">JÜRİ DURUMU ({Object.keys(juryVotes).length}/{Object.keys(players).filter(uid => players[uid] !== currentTeam.id).length})</div>
                                      {Object.keys(players).filter(uid => players[uid] !== currentTeam.id).map(uid => (
                                          <div key={uid} className={`text-xs font-bold flex justify-between items-center py-1 border-b border-white/5 ${juryVotes[uid] !== undefined ? 'text-green-400' : 'text-yellow-400 animate-pulse'}`}>
                                              <span>{TEAM_INFO[players[uid]].name}</span>
                                              <span>{juryVotes[uid] !== undefined ? '✅ OY VERDİ' : '⏳ BEKLİYOR'}</span>
                                          </div>
                                      ))}
                                  </div>
                                  
                                  {isHost && Object.keys(juryVotes).length > 0 && (
                                      <button onClick={() => { playSynthSound('click', soundEnabled); processVotingResult(Object.values(juryVotes)); }} className="mt-4 px-4 py-3 bg-red-600/50 hover:bg-red-600 rounded-lg text-sm font-bold text-white border border-red-500 w-full transition">Tüm Oyları Beklemeden Bitir</button>
                                  )}
                              </div>
                          ) : (
                              juryVotes[user?.uid] !== undefined ? (
                                  <div className="bg-gray-800 border-2 border-green-500 p-6 rounded-2xl text-center shadow-inner animate-fade-in-up">
                                       <div className="flex justify-center mb-4"><CheckCircleIcon size={48} className="text-green-400" /></div>
                                       <h3 className="text-xl sm:text-2xl font-black text-green-400 mb-2 uppercase tracking-widest">OYUNUZ GÖNDERİLDİ!</h3>
                                       <p className="text-gray-300 text-sm sm:text-base">Diğer jürilerin oylamayı tamamlaması bekleniyor...</p>
                                       
                                       {/* YENİ: BEKLENEN JÜRİLER LİSTESİ */}
                                       {!isSinglePlayer && (
                                           <div className="mt-4 p-3 bg-black/40 rounded-xl border border-gray-700 w-full text-left">
                                               <div className="text-neon-blue font-bold tracking-widest mb-2 text-center text-xs">JÜRİ DURUMU ({Object.keys(juryVotes).length}/{Object.keys(players).filter(uid => players[uid] !== currentTeam.id).length})</div>
                                               {Object.keys(players).filter(uid => players[uid] !== currentTeam.id).map(uid => (
                                                   <div key={uid} className={`text-xs font-bold flex justify-between items-center py-1 border-b border-white/5 ${juryVotes[uid] !== undefined ? 'text-green-400' : 'text-yellow-400 animate-pulse'}`}>
                                                       <span>{TEAM_INFO[players[uid]].name}</span>
                                                       <span>{juryVotes[uid] !== undefined ? '✅ OY VERDİ' : '⏳ BEKLİYOR'}</span>
                                                   </div>
                                               ))}
                                           </div>
                                       )}
                                       
                                       {isHost && (
                                           <button onClick={() => { playSynthSound('click', soundEnabled); processVotingResult(Object.values(juryVotes)); }} className="mt-4 px-4 py-3 bg-red-600/50 hover:bg-red-600 rounded-lg text-sm font-bold text-white border border-red-500 w-full transition">Tüm Oyları Beklemeden Bitir</button>
                                       )}
                                  </div>
                              ) : (
                                  <>
                                      <div className="flex gap-2 text-center">
                                          <button onClick={() => setVoteData(p => ({...p, roleplay: !p.roleplay}))} className={`flex-1 py-3 sm:py-4 rounded-xl text-[10px] sm:text-xs font-black border-2 transition ${voteData.roleplay ? 'bg-blue-600 border-blue-400 text-white shadow-[0_0_15px_blue]' : 'border-gray-700 text-gray-400'}`}>{UI[lang].role}</button>
                                          <button onClick={() => setVoteData(p => ({...p, obstacleOvercome: !p.obstacleOvercome}))} className={`flex-1 py-3 sm:py-4 rounded-xl text-[10px] sm:text-xs font-black border-2 transition ${voteData.obstacleOvercome ? 'bg-green-600 border-green-400 text-white shadow-[0_0_15px_green]' : 'border-gray-700 text-gray-400'}`}>{UI[lang].obstacleBtn}</button>
                                          <button onClick={() => setVoteData(p => ({...p, fail: !p.fail}))} className={`flex-1 py-3 sm:py-4 rounded-xl text-[10px] sm:text-xs font-black border-2 transition ${voteData.fail ? 'bg-red-600 border-red-400 text-white shadow-[0_0_15px_red]' : 'border-gray-700 text-gray-400'}`}>{UI[lang].fail}</button>
                                      </div>
                                      <div className="flex justify-between items-center px-4 py-2">
                                          <button onClick={() => updateLocalJuryScore(-1)} className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-red-500/50 text-red-500 flex items-center justify-center active:bg-red-500/20 shadow-lg"><Minus size={28}/></button>
                                          <span className="text-6xl sm:text-7xl font-mono font-black text-white drop-shadow-xl">{localJuryScore}</span>
                                          <button onClick={() => updateLocalJuryScore(1)} className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-green-500/50 text-green-500 flex items-center justify-center active:bg-green-500/20 shadow-lg"><Plus size={28}/></button>
                                      </div>
                                      <div className="flex gap-3">
                                          <button onClick={askAICritic} className="w-16 bg-purple-900/50 border-2 border-purple-500 text-purple-300 rounded-2xl flex items-center justify-center active:bg-purple-800 shadow-md" disabled={criticLoading}><Bot size={32}/></button>
                                          <button onClick={() => submitManualVote()} className="flex-1 py-4 sm:py-5 bg-white text-black font-black text-lg sm:text-xl rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.5)] active:scale-95 transition uppercase tracking-widest">{UI[lang].confirmScore}</button>
                                      </div>
                                  </>
                              )
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
                  <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-yellow-400 overflow-hidden bg-black shrink-0 relative shadow-[0_0_20px_rgba(250,204,21,0.6)]`}><AssetDisplay src={activeAssets[`team${currentTeam.id}_scared`]} className="w-full h-full object-cover object-top" /></div>
                  <div className="flex flex-col flex-1"><span className="text-[10px] sm:text-xs text-yellow-400 uppercase font-black tracking-widest">FİNAL PERFORMANSI</span><span className={`font-black text-2xl sm:text-3xl leading-none text-white mt-1`}>{TEAM_INFO[currentTeam.id].name}</span></div>
              </div>
              <div className="flex justify-between items-center bg-gray-900/50 p-4 sm:p-5 rounded-2xl border-2 border-yellow-500/30 shadow-inner">
                  <div className="text-sm sm:text-base text-yellow-500 font-bold uppercase tracking-widest">{UI[lang].time}</div>
                  <Timer key={timerKey} duration={performanceTimer} onFinish={finishPerformance} soundEnabled={soundEnabled} isPaused={isTimerPaused} />
              </div>

              {/* İPUCU BUTONU FİNALDE DE GEÇERLİ */}
              {isMyTurn && (
                  <button onClick={requestHint} className="w-full mt-3 py-3 bg-yellow-600/20 border-2 border-yellow-500/50 rounded-xl font-bold text-yellow-400 flex justify-center items-center gap-2 active:bg-yellow-500/40 transition shadow-[0_0_15px_rgba(250,204,21,0.2)]">
                      <HelpCircle size={20} /> İPUCU AL (Süreyi Durdurur)
                  </button>
              )}

              {isMyTurn ? (
                  <button onClick={finishPerformance} className="w-full mt-3 py-4 sm:py-5 bg-gradient-to-r from-yellow-500 to-orange-500 text-black rounded-2xl font-black text-lg sm:text-xl uppercase tracking-widest active:scale-95 shadow-[0_0_20px_rgba(250,204,21,0.5)]">{UI[lang].finishPerf}</button>
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
               <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full border-4 border-yellow-400 mb-12 overflow-hidden bg-black shadow-[0_0_40px_rgba(250,204,21,0.6)]"><AssetDisplay src={activeAssets[`team${finalists[1].id}_idle`]} className="w-full h-full object-cover object-top" /></div>
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
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden shrink-0 bg-black border-2 border-white/20"><AssetDisplay src={activeAssets[`team${finalists[0].id}_happy`]} className="w-full h-full object-cover object-top" /></div>
                        <div className="flex-1 text-left"><h3 className="text-2xl sm:text-3xl font-black text-white">{TEAM_INFO[finalists[0].id].name}</h3><span className="text-sm sm:text-base text-yellow-500 font-bold tracking-widest">{UI[lang].castWinner}</span></div>
                    </button>
                    <div className="text-3xl sm:text-4xl font-black text-red-500 italic text-center drop-shadow-md">VS</div>
                    <button onClick={() => amIDirector && castWinner(finalists[1])} className={`w-full p-4 sm:p-5 rounded-3xl border-2 border-gray-600 bg-gray-900 flex items-center gap-4 transition-all shadow-lg ${amIDirector ? 'active:border-yellow-400' : 'opacity-70'}`}>
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden shrink-0 bg-black border-2 border-white/20"><AssetDisplay src={activeAssets[`team${finalists[1].id}_happy`]} className="w-full h-full object-cover object-top" /></div>
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
                   <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-full border-4 border-yellow-400 shadow-[0_0_40px_yellow] overflow-hidden bg-black"><AssetDisplay src={activeAssets[`team${winner.id}_happy`]} className="w-full h-full object-cover object-top" /></div>
                   <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-8 sm:px-10 py-2 sm:py-3 rounded-full font-black text-2xl sm:text-3xl whitespace-nowrap shadow-xl">{TEAM_INFO[winner.id].name}</div>
               </div>
               <p className="text-2xl sm:text-3xl text-yellow-200 mb-14 font-bold">{UI[lang].finalScore} <span className="text-white text-4xl sm:text-5xl ml-2">{winner.score}</span></p>
               {(isHost || isSinglePlayer) && (
                   <button onClick={resetGame} className="px-8 sm:px-10 py-5 sm:py-6 w-full max-w-[90vw] sm:max-w-sm bg-white text-black font-black text-lg sm:text-xl uppercase tracking-widest rounded-3xl active:scale-95 transition flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(255,255,255,0.5)]"><RefreshCw size={24} /> {UI[lang].playAgain}</button>
               )}
          </div>
      )}

      {/* KART & BONUS MODALS */}
      {gameState === 'CARD' && activeCard && <CardDisplay card={activeCard} type={cardType} mode="draw" onAction={handleCardAction} activeAssets={activeAssets} currentTeamId={currentTeam.id} lang={lang} isMyTurn={isMyTurn} />}
      {gameState === 'FINALS_PREP' && customFinalCard && <CardDisplay card={customFinalCard} type="final" mode="draw" onAction={() => { playSynthSound('click', soundEnabled); syncGame({ performanceTimer: 120, gameState: 'FINALS_PLAY' }); setTimerKey(k=>k+1); }} activeAssets={activeAssets} currentTeamId={currentTeam.id} lang={lang} isMyTurn={isMyTurn} />}
      {playingBonus && <CardDisplay card={playingBonus} type="bonus" mode="play" onAction={executeBonusPower} activeAssets={activeAssets} currentTeamId={currentTeam.id} lang={lang} isMyTurn={isMyTurn} />}
      
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

      {/* KART REHBERİ MODALI */}
      {showCardInfoMenu && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/90 backdrop-blur-md" onClick={() => setShowCardInfoMenu(false)}>
              <div className="bg-gray-900 border-t-4 border-blue-500 rounded-t-3xl w-full p-6 pb-safe shadow-[0_-10px_50px_rgba(59,130,246,0.3)] max-h-[85vh] flex flex-col" onClick={e=>e.stopPropagation()}>
                  <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl sm:text-2xl font-black text-blue-400 tracking-widest flex items-center gap-2"><BookOpen size={24}/> KART REHBERİ</h2>
                      <button onClick={() => setShowCardInfoMenu(false)} className="text-gray-400 p-2 bg-black/50 rounded-full"><X size={24}/></button>
                  </div>
                  <div className="overflow-y-auto no-scrollbar flex-1 pb-4 space-y-6">
                      <div>
                          <h3 className="text-lg font-black text-yellow-400 mb-3 border-b border-yellow-500/30 pb-2 flex items-center gap-2"><Sparkles size={20}/> BONUS KARTLARI</h3>
                          <div className="space-y-3">
                              {CARDS.BONUS.map(b => (
                                  <div key={b.id} className="bg-blue-900/20 border border-blue-500/30 p-3 rounded-xl flex flex-col gap-1">
                                      <div className="flex justify-between items-center">
                                          <span className="font-black text-blue-300 text-sm sm:text-base">{b.name}</span>
                                          <span className="text-[10px] sm:text-xs font-bold bg-blue-500/20 text-blue-200 px-2 py-1 rounded-md">{getLocalizedText(b.benefit, lang)}</span>
                                      </div>
                                      <p className="text-blue-200 text-xs sm:text-sm font-bold mt-1">{getLocalizedText(b.ruleDesc, lang)}</p>
                                      <p className="text-gray-400 text-xs italic mt-1">"{getLocalizedText(b.quote, lang)}"</p>
                                  </div>
                              ))}
                          </div>
                      </div>
                      <div>
                          <h3 className="text-lg font-black text-red-400 mb-3 border-b border-red-500/30 pb-2 flex items-center gap-2"><Skull size={20}/> ENGEL KARTLARI</h3>
                          <div className="space-y-3">
                              {CARDS.OBSTACLE.map(o => (
                                  <div key={o.id} className="bg-red-900/20 border border-red-500/30 p-3 rounded-xl flex flex-col gap-1">
                                      <div className="flex items-start gap-2">
                                          <ShieldAlert size={16} className="text-red-500 shrink-0 mt-0.5" />
                                          <span className="font-black text-red-300 text-sm">{getLocalizedText(o.text, lang)}</span>
                                      </div>
                                      <p className="text-gray-300 text-xs sm:text-sm pl-6">{getLocalizedText(o.ruleDesc, lang)}</p>
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}

// Mobile optimized Timer
const Timer = ({ duration, onFinish, soundEnabled, isPaused }) => {
    const [timeLeft, setTimeLeft] = useState(duration);
    useEffect(() => { setTimeLeft(duration); }, [duration]);
    useEffect(() => {
        if (timeLeft <= 0) { if (duration > 0) { playSynthSound('alarm', soundEnabled); onFinish(); } return; }
        if (isPaused) return; // Zamanı dondurma kodu
        const id = setInterval(() => setTimeLeft(t => t - 1), 1000); return () => clearInterval(id);
    }, [timeLeft, onFinish, duration, soundEnabled, isPaused]);
    return <div className="text-4xl sm:text-5xl font-mono font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] tracking-wider">{Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</div>;
};
const CheckCircleIcon = ({ size, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinelinejoin="round" className={className}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);
