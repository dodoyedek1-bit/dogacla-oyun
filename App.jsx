import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Dices, Trophy, User, Clock, Star, ShieldAlert, Sparkles, Skull, Theater, 
  AlertTriangle, CheckCircle, XCircle, ScrollText, Plus, Minus, Gavel, 
  Menu, X, Volume2, VolumeX, RefreshCw, LayoutGrid, History, Mic2, Lightbulb,
  Bot, Zap, Monitor, Share2, MessageSquare, MousePointer2, Smile, Heart, ThumbsUp,
  PenTool, Music, Keyboard, Dice5, Repeat, Image as ImageIcon, Upload, Palette, Link as LinkIcon, Wand2, Layers, Loader2, Maximize, Minimize,
  Flame, Crown, PartyPopper, Tv, Target, Hand, Drama, Megaphone, Clapperboard, Video, Frown, Laugh, Ticket, Move, Ghost, Smartphone, Bird, Thermometer, Apple, HelpCircle, Play, Music4
} from 'lucide-react';

// --- 1. ASSET VE MEDYA BAĞLANTILARI ---
const GAME_ASSETS = {
    bg: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/arkplan.png",
    logo: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/dogacla_logsu.png",
    music_bg: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/The_Clockwork_Caper.mp3", 
    ibis: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/ibi%C5%9F.png", 
    karagoz: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/karagoz.png",
    shakespeare: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/sheashper.png",
    aristophanes: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/aristopahnes.png",
    moderator: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/Moderator.mp4",
    
    // Takım Duygu Döngüleri
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

    // Standart Bonus Kart Videoları
    madox: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/madox_karti.mp4",
    diputiyat: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/dputiyat_karti.mp4",
    gulec: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/Gulec_karti.mp4",
    kubi: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/kubi_karti.mp4",
    mali: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/Mali_karti.mp4",
    sadic: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/sadic_karti.mp4",
    tubi: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/tubi_karti.mp4",
    cicu: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/%C3%A7i-%C3%A7u.png",

    // Kubo 5'li Senaryo Video Havuzu
    kubo_scenarios: [
      "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/Kubo_panik.mp4",
      "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/Kubo_sinsi.mp4",
      "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/Kubo_b%C4%B1kk%C4%B1n.mp4",
      "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/Kubo_sinirli.mp4",
      "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/Kubo_Tiyatroda%20zaman%20%C3%B6nemli.mp4"
    ]
};

const DEFAULT_ASSETS = {
    boardBg: GAME_ASSETS.bg, 
    logo: GAME_ASSETS.logo,
    music_bg: GAME_ASSETS.music_bg,
    team0: GAME_ASSETS.ibis, 
    team1: GAME_ASSETS.karagoz, 
    team2: GAME_ASSETS.shakespeare, 
    team3: GAME_ASSETS.aristophanes,
    bonus_tubi: GAME_ASSETS.tubi, 
    bonus_kubi: GAME_ASSETS.kubi, 
    bonus_mali: GAME_ASSETS.mali,
    bonus_kubo: GAME_ASSETS.kubo_scenarios[0], 
    bonus_madox: GAME_ASSETS.madox, 
    bonus_dputiyat: GAME_ASSETS.diputiyat,
    bonus_gulec: GAME_ASSETS.gulec, 
    bonus_sadic: GAME_ASSETS.sadic, 
    bonus_cihad: GAME_ASSETS.cicu,
    moderator: GAME_ASSETS.moderator,
    kubo_scenarios: GAME_ASSETS.kubo_scenarios,
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

const UI = {
    en: {
        start: "START", rollDice: "ROLL DICE", drawingLots: "DRAWING LOTS...", rollingDice: "ROLLING DICE...",
        onStageNow: "ON STAGE NOW", silence: "Silence", goldenMic: "GOLDEN MICROPHONE", x2Points: "X2 POINTS ACTIVE!",
        whoSabotage: "Who will you sabotage?", time: "Time", finishPerf: "Finish Performance",
        juryScoring: "JURY SCORING", role: "+2 ROLE", obstacleBtn: "+2 OBSTACLE", fail: "-2 FAIL", aiComment: "AI COMMENT",
        confirmScore: "CONFIRM SCORE", oppCard: "OPPORTUNITY CARD",
        chooseTarget: "CHOOSE TARGET", accept: "ACCEPT", stageYours: "THE STAGE IS YOURS", applySelf: "Apply to Self",
        giveRival: "Give to Rival", activeObstacle: "ACTIVE OBSTACLE",
        useBonusBtn: "USE BONUS", unleashPower: "💥 UNLEASH POWER 💥",
        grandFinale: "GRAND FINALE!", champion: "CHAMPION!",
        finalScore: "Final Score:", playAgain: "PLAY AGAIN", close: "CLOSE",
        directorPromptTitle: "DIRECTOR'S CHAIR",
        generateDraft: "GENERATE DRAFT MISSION", createAsIs: "CREATE OPTIONS AS IS", aiDrafted: "AI DRAFTED THE MISSION",
        castWinner: "CAST THE WINNER", auditionComplete: "Auditions Complete!", whoGetsRole: "Who gets the lead role?",
        transitionWait: "Next Finalist's Turn", startNext: "START NEXT AUDITION", selectAICard: "CHOOSE A GENERATED SCENE",
        rulesTitle: "RULES OF THE STAGE",
        rulesContent: [
            { title: "🎭 Take the Stage", text: "Roll the dice and advance. Draw cards based on your tile (Easy, Medium, Hard, Obstacle, or Bonus)." },
            { title: "⏱️ Perform", text: "Act out the scenario within the time limit. Overcome active obstacles without breaking character." },
            { title: "🎬 Rehearsal Director (Kubo)", text: "Use Kubo to stop time and gain +30 seconds of emergency rehearsal time!" },
            { title: "⚖️ Jury Scoring", text: "Other teams judge you. Successful characterization and overcoming obstacles award points." }
        ]
    },
    tr: {
        start: "BAŞLA", rollDice: "ZAR AT", drawingLots: "KURA ÇEKİLİYOR...", rollingDice: "ZAR ATILIYOR...",
        onStageNow: "ŞU AN SAHNEDE", silence: "Sessizlik", goldenMic: "ALTIN MİKROFON", x2Points: "X2 PUAN AKTİF!",
        whoSabotage: "Kimi sabote edeceksin?", time: "Süre", finishPerf: "Performansı Bitir",
        juryScoring: "JÜRİ OYLAMASI", role: "+2 ROL", obstacleBtn: "+2 ENGEL", fail: "-2 BAŞARISIZ", aiComment: "YAPAY ZEKA",
        confirmScore: "PUANI ONAYLA", oppCard: "FIRSAT KARTI",
        chooseTarget: "HEDEF SEÇ", accept: "KABUL ET", stageYours: "SAHNE SENİN", applySelf: "Kendine Uygula",
        giveRival: "Rakibe Ver", activeObstacle: "AKTİF ENGEL",
        useBonusBtn: "BONUS KULLAN", unleashPower: "💥 GÜCÜ KULLAN 💥",
        grandFinale: "BÜYÜK FİNAL!", champion: "ŞAMPİYON!",
        finalScore: "Final Puanı:", playAgain: "YENİDEN OYNA", close: "KAPAT",
        directorPromptTitle: "YÖNETMEN KOLTUĞU",
        generateDraft: "GÖREV TASLAĞI ÜRET", createAsIs: "SEÇENEKLERİ OLUŞTUR", aiDrafted: "YAPAY ZEKA GÖREVİ YAZDI",
        castWinner: "ROLÜ VER (KAZANANI SEÇ)", auditionComplete: "Seçmeler Tamamlandı!", whoGetsRole: "Başrolü kim kapıyor?",
        transitionWait: "Sıra Diğer Finalistte", startNext: "SIRADAKİ SEÇMEYİ BAŞLAT", selectAICard: "ÜRETİLEN SAHNELERDEN BİRİNİ SEÇ",
        rulesTitle: "SAHNE KURALLARI",
        rulesContent: [
            { title: "🎭 Sahneye Çık", text: "Zar at ve ilerle. Bastığın kareye göre (Kolay, Orta, Zor, Engel veya Fırsat) kart çek." },
            { title: "⏱️ Performans", text: "Verilen senaryoyu süre bitmeden canlandır. Karakterinden ödün verme!" },
            { title: "🎬 Rejisör Müdahalesi (Kubo)", text: "Sahnede tıkandığında Kubo bonusuyla zamanı dondur ve +30 saniye ek süre kazan!" },
            { title: "⚖️ Jüri Oylaması", text: "Diğer oyuncular jüri olur. Role sadakat ve aşılan engeller ekstra puan kazandırır." }
        ]
    }
};

const TEAM_INFO = {
    0: { name: 'İBİŞ', desc: { en: 'Cunning & Witty', tr: 'Kurnaz & Esprili' }, style: { en: 'Humorous', tr: 'Mizahi' } },
    1: { name: 'KARAGÖZ', desc: { en: 'Physical & Blunt', tr: 'Fiziksel & Dobra' }, style: { en: 'Physical', tr: 'Fiziksel' } },
    2: { name: 'SHAKESPEARE', desc: { en: 'Dramatic & Poetic', tr: 'Dramatik & Şiirsel' }, style: { en: 'Tragic', tr: 'Trajik' } },
    3: { name: 'ARİSTOFANES', desc: { en: 'Satirical & Clever', tr: 'Hicivli & Zeki' }, style: { en: 'Ironic', tr: 'İronik' } }
};

const CARDS_DATA = {
  EASY: [ 
    { 
      title: { en: "BROKEN ELEVATOR", tr: "BOZUK ASANSÖR" }, 
      mission: { en: "You are stuck in a tight space. Show suffocation and panic with your body.", tr: "Dar bir alanda sıkıştın. Bedeninle boğulma ve paniği göster." }, 
      quotes: { 
        0: {en: "Sir, we are toasted in this tin can!", tr: "Efendim, bu teneke kutuda piştik!"}, 
        1: {en: "We are stuck! My ribs are crushed!", tr: "Sıkıştık! Kaburgalarım ezildi!"}, 
        2: {en: "Oh iron cage! Trapping two souls...", tr: "Ah demir kafes! İki ruhu hapseden..."}, 
        3: {en: "This mechanical box is the tragedy of modern man.", tr: "Bu mekanik kutu modern insanın trajedisidir."} 
      } 
    }, 
    { 
      title: { en: "POLAR COLD", tr: "KUTUP SOĞUĞU" }, 
      mission: { en: "You are freezing. Teeth chattering. Try to warm up.", tr: "Donuyorsun. Dişlerin birbirine çarpıyor. Isınmaya çalış." }, 
      quotes: { 
        0: {en: "Oh sir, I'm freezing! My nose turned to ice!", tr: "Aman efendim, donuyorum! Burnum buza döndü!"}, 
        1: {en: "Frozen! Light the stove!", tr: "Donduk! Yakın sobayı!"}, 
        2: {en: "Ah, this cold wind pierces my bones.", tr: "Ah, bu soğuk rüzgar kemiklerimi delip geçiyor."}, 
        3: {en: "This cold extinguishes the fire of the soul.", tr: "Bu soğuk, ruhun ateşini bile söndürüyor."} 
      } 
    },
    { 
      title: { en: "CHICKEN ACT", tr: "TAVUK TAKLİDİ" }, 
      mission: { en: "Act like a chicken. Cluck, scratch for food.", tr: "Bir tavuk gibi davran. Gıdakla, yem eşele." }, 
      quotes: { 
        0: {en: "Cluck cluck sir!", tr: "Gıt gıdak efendim!"}, 
        1: {en: "Cluck! Are we stuck in a coop?", tr: "Gıdak! Kümese mi tıkıldık?"}, 
        2: {en: "Like a bird, but flightless... Oh feathered fate!", tr: "Bir kuş gibi ama uçamayan... Ah tüylü kader!"}, 
        3: {en: "Why must I behave like a chicken? Absurd!", tr: "Neden bir tavuk gibi davranmalıyım? Ne absürt!"} 
      } 
    },
    { 
      title: { en: "NO SIGNAL", tr: "SİNYAL YOK" }, 
      mission: { en: "Making a very important call but the line cuts off.", tr: "Çok önemli bir arama yapıyorsun ama hat kesiliyor." }, 
      quotes: { 
        0: {en: "Hellooo! Can't hear you!", tr: "Alooo! Duyamıyorum seni!"}, 
        1: {en: "What do you say! Don't shout!", tr: "Ne diyorsun! Bağırma!"}, 
        2: {en: "Ah, faint voice from afar! Why can't I reach you?", tr: "Ah, uzaklardan gelen cılız ses! Sana neden ulaşamıyorum?"}, 
        3: {en: "Miscommunication in the age of communication...", tr: "İletişim çağında iletişimsizlik..."} 
      } 
    } 
  ],
  MEDIUM: [ 
    { 
      title: { en: "FORGETFULNESS", tr: "UNUTKANLIK" }, 
      mission: { en: "You forgot what to say right at that moment.", tr: "Tam o an ne söyleyeceğini unuttun." }, 
      quotes: { 
        0: {en: "Umm... Sir, it was on the tip of my tongue!", tr: "Eee... Efendim, dilimin ucundaydı!"}, 
        1: {en: "You stole the words from my mind!", tr: "Kelimeleri aklımdan çaldınız!"}, 
        2: {en: "Ah, my memory betrays me! Words are lost.", tr: "Ah, hafızam bana ihanet ediyor! Kelimeler kayıp."}, 
        3: {en: "Silence... The greatest line is the unspoken one.", tr: "Sessizlik... En büyük replik söylenmeyendir."} 
      } 
    }, 
    { 
      title: { en: "INVISIBLE APPLE", tr: "GÖRÜNMEZ ELMA" }, 
      mission: { en: "Eat as if you have an apple in hand.", tr: "Elinde bir elma varmış gibi ye." }, 
      quotes: { 
        0: {en: "Oh sir, this isn't an apple, it's a diamond! Crunch!", tr: "Aman efendim, bu elma değil elmas! Kırt!"}, 
        1: {en: "I have nothing but I'm eating!", tr: "Elimde hiçbir şey yok ama yiyorum!"}, 
        2: {en: "I feel the taste of a non-existent fruit.", tr: "Var olmayan bir meyvenin tadını hissediyorum."}, 
        3: {en: "Creating an invisible object... That is art.", tr: "Görünmez bir obje yaratmak... İşte sanat budur."} 
      } 
    } 
  ],
  HARD: [ 
    { 
      title: { en: "FAKE KING", tr: "SAHTE KRAL" }, 
      mission: { en: "A panicked leader lying that everything is under control.", tr: "Her şeyin kontrol altında olduğu yalanını söyleyen paniklemiş bir lider." }, 
      quotes: { 
        0: {en: "I am the king! (Trembles)", tr: "Kral benim! (Titrer)"}, 
        1: {en: "What I say goes! I am the King! I'm not scared...", tr: "Benim dediğim olur! Ben Kralım! Korkmuyorum..."}, 
        2: {en: "Oh my people! This crown is heavy...", tr: "Ah halkım! Bu taç çok ağır..."}, 
        3: {en: "This illusion I offer is for your peace.", tr: "Sunduğum bu illüzyon sizin huzurunuz içindir."} 
      } 
    }, 
    { 
      title: { en: "LAUGHING CRYING", tr: "AĞLARKEN GÜLMEK" }, 
      mission: { en: "Laugh while telling something very sad.", tr: "Çok üzücü bir şey anlatırken kahkaha at." }, 
      quotes: { 
        0: {en: "Hahaha! Oh, it's so sad!", tr: "Hahaha! Ah, ne kadar üzücü!"}, 
        1: {en: "Hahaha! Oh my poor head!", tr: "Hahaha! Vah zavallı başım!"}, 
        2: {en: "My smile is a mask hiding my tears.", tr: "Gülümsemem, gözyaşlarımı saklayan bir maskedir."}, 
        3: {en: "Tragedy and comedy... Two faces of life.", tr: "Trajedi ve komedi... Hayatın iki yüzü."} 
      } 
    } 
  ],
  FINAL: [ 
    { 
      title: { en: "FAREWELL SPEECH", tr: "VEDA KONUŞMASI" }, 
      mission: { en: "The play is ending. Give a dramatic farewell.", tr: "Oyun bitiyor. Dramatik bir veda konuşması yap." }, 
      quotes: { 
        0: {en: "Forgive us if we slipped up!", tr: "Sürçülisan ettiysek affola!"}, 
        1: {en: "I'm out of here!", tr: "Ben kaçar!"}, 
        2: {en: "As the curtain falls, our shadows remain.", tr: "Perde kapanırken, geriye gölgelerimiz kalır."}, 
        3: {en: "The play ends, real life begins.", tr: "Oyun biter, gerçek hayat başlar."} 
      } 
    } 
  ],
  OBSTACLE: [ 
    { id: 'o1', text: { en: "Speak only in single words.", tr: "Sadece tek kelimelerle konuş." }, type: 'marked' }, 
    { id: 'o2', text: { en: "Sing every sentence you utter.", tr: "Her cümleni şarkı söyleyerek bitir." }, type: 'unmarked' }, 
    { id: 'o3', text: { en: "No eye contact allowed.", tr: "Kimseyle göz teması kurma." }, type: 'marked' }, 
    { id: 'o4', text: { en: "Keep both hands deep in pockets.", tr: "Eller daima ceplerde kilitli kalsın." }, type: 'marked' }, 
    { id: 'o5', text: { en: "Play entire scene with your back turned.", tr: "Arkanı seyirciye dönerek oyna." }, type: 'marked' }, 
    { id: 'o6', text: { en: "Jump on one foot continuously.", tr: "Tek ayak üzerinde zıplayarak tirad at." }, type: 'unmarked' }, 
    { id: 'o7', text: { en: "Deliver lines in an intense theatrical whisper.", tr: "Bütün repliklerini yoğun fısıltıyla söyle." }, type: 'marked' }, 
    { id: 'o8', text: { en: "Move in exaggerated slow motion.", tr: "Aşırı ağır çekimde (slow motion) hareket et." }, type: 'marked' }, 
    { id: 'o9', text: { en: "Start every sentence with 'Actually...'", tr: "Her söze 'Aslında' diye başla." }, type: 'unmarked' }, 
    { id: 'o10', text: { en: "Deliver serious lines while laughing.", tr: "Ciddi replikleri kahkaha krizinde oku." }, type: 'marked' } 
  ],
  BONUS: [ 
    { id: 'kubo', name: { en: 'Kubo', tr: 'Kubo' }, desc: { en: 'Cut! The director steps in. Extends time by +30 seconds!', tr: 'Kestik! Rejisör devreye giriyor. Süreyi anında +30 saniye uzatır!' }, benefit: { en: '+30 SECONDS', tr: '+30 SANİYE' }, effect: 'time' }, 
    { id: 'gulec', name: { en: 'Güleç', tr: 'Güleç' }, desc: { en: 'Scholarly encouragement! Fills the hall with thunderous applause.', tr: 'Bilimsel moral desteği! Salonda alkış tufanı koparır.' }, benefit: { en: 'APPLAUSE & MORAL', tr: 'ALKIŞ & MORAL' }, effect: 'applause' }, 
    { id: 'tubi', name: { en: 'Tubi', tr: 'Tubi' }, desc: { en: 'Maternal advice behind the fan... Gives you an instant plot idea!', tr: 'Yelpazenin ardından anaç akıl verir... Anında sahne fikri kazandırır!' }, benefit: { en: 'GET IDEA', tr: 'FİKİR AL' }, effect: 'idea' }, 
    { id: 'kubi', name: { en: 'Kubi', tr: 'Kubi' }, desc: { en: 'Pen in hand! Writing one more character onto the stage boards.', tr: 'Kalem elimde! Sahneye fazladan bir oyuncu daha yazıyorum.' }, benefit: { en: 'EXTRA CHARACTER', tr: 'EKSTRA KARAKTER' }, effect: 'char' }, 
    { id: 'mali', name: { en: 'Mali', tr: 'Mali' }, desc: { en: 'Calculated financial audit! Grants +2 direct score boost.', tr: 'Hesapladım, karlı çıktık! Doğrudan +2 puan kazandırır.' }, benefit: { en: '+2 POINTS', tr: '+2 PUAN' }, effect: 'score' }, 
    { id: 'madox', name: { en: 'Madox', desc: 'Bored of this rhythm! Snaps fingers to switch the play genre.', tr: 'Bu sahnenin türü beni sıktı. Parmak şıklatıp türü değiştirir!' }, benefit: { en: 'CHANGE GENRE', tr: 'TÜRÜ DEĞİŞTİR' }, effect: 'genre' }, 
    { id: 'dputiyat', name: { en: 'Dpütiyat', tr: 'Dpütiyat' }, desc: { en: 'No solo acts! Drags a rival actor directly on stage with you.', tr: 'Yalnız oynamak yok! Rakip takımdan birini kolundan sahneye çeker.' }, benefit: { en: 'DRAG PLAYER', tr: 'OYUNCU ÇEK' }, effect: 'add_player' }, 
    { id: 'sadic', name: { en: 'Sadıç', tr: 'Sadıç' }, desc: { en: 'Life is a gamble! Blows on loaded dice for a double-or-nothing roll.', tr: 'Hayat bir kumar! Zarları üfler, şansını ya ikiye katlar ya sıfırlar.' }, benefit: { en: 'LUCKY DICE', tr: 'ŞANS ZARI' }, effect: 'gamble' }, 
    { id: 'cihad', name: { en: 'Cihad', tr: 'Cihad' }, desc: { en: 'Pulls a magical mystery theatrical prop from his deep pockets.', tr: 'Cebinden sahneyi kurtaracak gizemli bir tiyatro objesi çıkarır.' }, benefit: { en: 'SURPRISE OBJECT', tr: 'SÜRPRİZ OBJE' }, effect: 'double' } 
  ],
  MODERATOR: [
    { 
      id: 'mod_start', 
      name: { en: 'MODERATOR', tr: 'MODERATÖR' }, 
      title: { en: "DIRECTOR'S WHISTLE", tr: 'REJİSÖR DÜDÜĞÜ' }, 
      desc: { 
        en: 'Eyes on the board! If an actor forgets to start their timer on stage, the clapperboard slams shut!', 
        tr: 'Gözüm üzerinizde! Sahneye çıkan süreyi başlatmayı unutursa klaketi patlatırım!' 
      }, 
      benefit: { en: 'STAGE AUTHORITY', tr: 'SAHNE KONTROLÜ' }, 
      customVideo: GAME_ASSETS.moderator 
    }
  ]
};

// --- DİL VE METİN YARDIMCILARI ---
const getLocalizedText = (item, lang = 'tr') => {
    if (!item) return "";
    if (typeof item === 'string') return item;
    if (item[lang]) return String(item[lang]);
    if (item['tr']) return String(item['tr']);
    if (item['en']) return String(item['en']);
    return String(item);
};

const getRandomCardText = (card, teamId, lang) => {
    if (!card || !card.quotes || !card.quotes[teamId]) return "";
    return getLocalizedText(card.quotes[teamId], lang);
};

const generateBoardMap = () => {
    return Array(36).fill(null).map((_, i) => {
        if (i === 0) return { type: 'start' };
        if (i === 35) return { type: 'final' };
        if (i % 5 === 0) return { type: 'bonus' }; 
        if (i % 6 === 0) return { type: 'obstacle' };
        if (i < 10) return { type: 'easy' };
        if (i < 20) return { type: 'medium' };
        return { type: 'hard' };
    });
};
const BOARD_MAP = generateBoardMap();

// --- 2. SES MOTORU ---
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
          osc.frequency.linearRampToValueAtTime(800, now + 0.4);
          gain.gain.setValueAtTime(0.2, now); 
          gain.gain.linearRampToValueAtTime(0, now + 0.4);
          osc.start(now); 
          osc.stop(now + 0.4);
      } else if (type === 'success' || type === 'powerup') {
          const playNote = (f, t, dur) => { 
              const o = ctx.createOscillator(); 
              const g = ctx.createGain(); 
              o.type = 'square'; 
              o.connect(g); 
              g.connect(ctx.destination); 
              o.frequency.value = f; 
              g.gain.setValueAtTime(0.05, now + t); 
              g.gain.exponentialRampToValueAtTime(0.001, now + t + dur); 
              o.start(now + t); 
              o.stop(now + t + dur); 
          };
          playNote(523.25, 0, 0.2); 
          playNote(659.25, 0.1, 0.2); 
          playNote(783.99, 0.2, 0.4);
      } else if (type === 'click') {
          osc.type = 'sine'; 
          osc.frequency.setValueAtTime(800, now); 
          gain.gain.setValueAtTime(0.05, now); 
          osc.start(now); 
          osc.stop(now + 0.05);
      }
  } catch (e) { 
      console.error(e); 
  }
};

// --- 3. YARDIMCI GÖRSEL BİLEŞENLER ---
const AssetDisplay = ({ src, className, style, alt }) => {
    if (!src) {
        return <div className={className} style={style}>{alt}</div>;
    }
    const isVideo = src.toLowerCase().endsWith('.mp4') || src.toLowerCase().endsWith('.webm');
    if (isVideo) {
        return <video key={src} src={src} className={className} style={style} autoPlay loop muted playsInline />;
    }
    return <img src={src} className={className} style={style} alt={String(alt)} />;
};

const getCardIcon = (text, defaultIcon) => {
    if (!text) return defaultIcon;
    const lower = String(text).toLowerCase();
    if (lower.includes("king") || lower.includes("kral")) return <Crown size={32} className="text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.8)]" />;
    if (lower.includes("phone") || lower.includes("sinyal")) return <Smartphone size={32} className="text-blue-400" />;
    if (lower.includes("chicken") || lower.includes("tavuk")) return <Bird size={32} className="text-orange-400" />;
    if (lower.includes("cold") || lower.includes("soğuk")) return <Thermometer size={32} className="text-cyan-400" />;
    if (lower.includes("apple") || lower.includes("elma")) return <Apple size={32} className="text-red-400" />;
    return defaultIcon;
};

const Dice3D = ({ value, isRolling }) => (
    <div className="scene w-32 h-32 mx-auto perspective-1000">
        <div className={`cube w-full h-full relative transform-style-3d transition-transform duration-1000 ${isRolling ? 'rolling' : `show-${value || 1}`}`}>
            {[1, 2, 3, 4, 5, 6].map(n => (
                <div key={n} className={`cube__face cube__face--${n} absolute w-32 h-32 border-2 border-white/20 bg-blue-600 flex items-center justify-center text-5xl font-black text-white shadow-inner`}>
                    {n}
                </div>
            ))}
        </div>
    </div>
);

const TeamDice3D = ({ winnerId, isRolling, assets }) => (
    <div className="scene w-32 h-32 mx-auto perspective-1000">
        <div className={`cube w-full h-full relative transform-style-3d transition-transform duration-1000 ${isRolling ? 'rolling' : `show-${(winnerId || 0) + 1}`}`}>
            {[0, 1, 2, 3, 0, 1].map((t, i) => (
                <div key={i} className={`cube__face cube__face--${i+1} absolute w-32 h-32 border-4 border-yellow-500 bg-black overflow-hidden flex items-center justify-center`}>
                    <AssetDisplay src={assets[`team${t}`]} className="w-full h-full object-cover" />
                </div>
            ))}
        </div>
    </div>
);

const FloatingReaction = ({ emoji, x, onComplete, id }) => {
  useEffect(() => { 
      const timer = setTimeout(() => onComplete(id), 1200); 
      return () => clearTimeout(timer); 
  }, [id, onComplete]);
  return <div className="absolute bottom-1/4 text-5xl pointer-events-none select-none z-[60] animate-float" style={{ left: `${x}%` }}>{String(emoji)}</div>;
};

const ConfettiExplosion = () => (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
        {[...Array(40)].map((_, i) => (
            <div 
                key={i} 
                className="absolute animate-confetti" 
                style={{
                    left: `${Math.random() * 100}%`, 
                    top: '-10px', 
                    backgroundColor: ['#ff0', '#f0f', '#0ff', '#0f0', '#d4af37'][Math.floor(Math.random() * 5)], 
                    width: '10px', 
                    height: '10px', 
                    animationDuration: `${Math.random() * 2 + 1}s`
                }} 
            />
        ))}
    </div>
);

const Timer = ({ duration, onFinish, soundEnabled }) => {
    const [timeLeft, setTimeLeft] = useState(duration);
    useEffect(() => { setTimeLeft(duration); }, [duration]);
    
    useEffect(() => {
        if (timeLeft <= 0) { 
            if (duration > 0) onFinish(); 
            return; 
        }
        const id = setInterval(() => setTimeLeft(t => t - 1), 1000); 
        return () => clearInterval(id);
    }, [timeLeft, onFinish, duration]);
    
    return (
        <div className="text-6xl font-mono font-bold text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] tracking-widest">
            {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
        </div>
    );
};

// --- 4. GÜNCELLENMİŞ KART BİLEŞENİ (MODERATÖR & KUBO HAVUZU ENTEGRELİ) ---
const CardDisplay = ({ card, type, mode = 'draw', onAction, assets, currentTeamId, lang }) => {
    const cardRef = useRef(null);
    const isBonus = type === 'bonus';
    const isObstacle = type === 'obstacle';
    const isModerator = type === 'moderator';
    const isPlaying = mode === 'play';

    // Video belirleme mantığı
    let videoToRender = null;
    const baseKey = `team${currentTeamId}`;

    if (isModerator) {
        videoToRender = card.customVideo || assets.moderator;
    } else if (isBonus) {
        if (card.activeVideoUrl) {
            videoToRender = card.activeVideoUrl;
        } else if (card.id === 'kubo' && assets.kubo_scenarios) {
            // Kubo için rastgele 5'li havuzdan seçim
            videoToRender = assets.kubo_scenarios[Math.floor(Math.random() * assets.kubo_scenarios.length)];
        } else {
            videoToRender = assets[`bonus_${card.id}`] || assets[card.id] || assets.bonus_kubo;
        }
    } else {
        if (type === 'easy') videoToRender = assets[`${baseKey}_happy`];
        else if (type === 'medium') videoToRender = assets[`${baseKey}_thinking`];
        else videoToRender = assets[`${baseKey}_scared`];
    }

    let titleText = (isBonus || isModerator) ? getLocalizedText(card.name, lang) : getLocalizedText(card.title, lang);
    let missionText = (isBonus || isModerator) ? getLocalizedText(card.desc, lang) : getLocalizedText(card.mission, lang);
    let flavorText = (isBonus || isModerator) 
        ? `${getLocalizedText(UI[lang]?.oppCard, lang)} ✦ ${getLocalizedText(card.benefit, lang)}`
        : (getLocalizedText(getRandomCardText(card, currentTeamId, lang), lang) || getLocalizedText(card.desc, lang));

    let icon = isModerator 
        ? <Clapperboard size={32} className="text-emerald-400 animate-pulse"/> 
        : (isBonus ? <Sparkles size={32} className="text-[#D4AF37]"/> : <Drama size={32} className="text-[#D4AF37]"/>);

    let bgStyle = isModerator 
        ? "bg-gradient-to-b from-emerald-950 via-neutral-900 to-black" 
        : (isBonus ? (isPlaying ? "bg-gradient-to-b from-yellow-700 via-neutral-900 to-black" : "bg-gradient-to-b from-amber-950 via-neutral-900 to-black") : "bg-neutral-950");

    let glowColor = isModerator 
        ? "rgba(16, 185, 129, 0.5)" 
        : (isBonus ? "rgba(212, 175, 55, 0.5)" : "rgba(212, 175, 55, 0.2)");

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fadeIn">
            <div 
                ref={cardRef}
                className="relative w-full max-w-sm rounded-[2.5rem] overflow-hidden border border-[#D4AF37]/40 flex flex-col shadow-2xl transition-all duration-300"
                style={{ 
                    height: '82vh',
                    boxShadow: `0 25px 60px -15px ${glowColor}` 
                }}
            >
                <div className={`absolute inset-0 ${bgStyle} z-0`}></div>
                
                {/* VİDEO BÖLÜMÜ */}
                <div className="relative w-full h-[45%] shrink-0 z-10 overflow-hidden flex items-center justify-center bg-black">
                    <video 
                        key={videoToRender}
                        src={videoToRender} 
                        className="w-full h-full object-cover object-top" 
                        autoPlay 
                        loop={!isBonus} 
                        muted={false}
                        playsInline 
                    />
                    <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-transparent"></div>
                </div>

                {/* METİN VE AKSİYON BUTONU */}
                <div className="relative z-20 flex-1 flex flex-col items-center justify-between text-center p-6 overflow-y-auto no-scrollbar -mt-6">
                    <div className="flex flex-col items-center w-full">
                        <div className="p-3 rounded-full bg-black/80 border border-[#D4AF37]/50 mb-2 shadow-xl backdrop-blur-md inline-flex justify-center">
                            {icon}
                        </div>
                        
                        <h1 className="text-[#D4AF37] font-black italic mb-2 leading-tight uppercase drop-shadow-md text-2xl">
                            {titleText}
                        </h1>
                        
                        <div className="w-full mb-3 bg-black/60 border border-[#D4AF37]/30 p-4 rounded-2xl shadow-inner min-h-[4.5rem] flex items-center justify-center">
                            <p className="font-bold leading-tight text-white/95 text-sm md:text-base">
                                "{missionText}"
                            </p>
                        </div>
                        
                        <p className="italic px-2 text-xs text-yellow-500/90 font-medium">
                            {flavorText}
                        </p>
                    </div>
                    
                    <button 
                        onClick={onAction} 
                        className="w-full py-4 rounded-2xl font-black text-base tracking-widest uppercase shadow-2xl transition-all transform hover:scale-[1.02] active:scale-95 bg-gradient-to-r from-[#D4AF37] via-amber-300 to-[#D4AF37] text-black hover:brightness-110"
                    >
                        {isModerator ? "KULİSE DÖN" : (isBonus ? (mode === 'play' ? "GÜCÜ KULLAN" : "KABUL ET") : "SAHNEYE ÇIK")}
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- 5. ANA OYUN BİLEŞENİ ---
export default function DogaclaVisualsFinal() {
  const [lang, setLang] = useState('tr');
  const [teams, setTeams] = useState(() => {
      const saved = localStorage.getItem('dogacla_teams_v98');
      return saved ? JSON.parse(saved) : JSON.parse(JSON.stringify(INITIAL_TEAMS));
  });
  const [assets] = useState(DEFAULT_ASSETS);
  const [currentTurn, setCurrentTurn] = useState(() => parseInt(localStorage.getItem('dogacla_turn_v98')) || 0);
  const [gameState, setGameState] = useState('INTRO');
  const [diceValue, setDiceValue] = useState(1);
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
  const [logs, setLogs] = useState(["Doğaçla 9.8 - Reji Masası Açıldı!"]);
  const [reactions, setReactions] = useState([]);
  const [confetti, setConfetti] = useState(false); 
  const [showRules, setShowRules] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [timerKey, setTimerKey] = useState(0); 

  const currentTeam = teams[currentTurn];
  const isGoldenMic = hypeMeter >= 100; 

  const bgMusicRef = useRef(new Audio());

  useEffect(() => {
      const audioEl = bgMusicRef.current;
      if (!soundEnabled) { 
          audioEl.pause(); 
          return; 
      }
      const trackToPlay = assets.music_bg; 
      if (audioEl.src !== trackToPlay) { 
          audioEl.src = trackToPlay; 
          audioEl.loop = true; 
          audioEl.volume = 0.2; 
      }
      if (audioEl.paused) {
          audioEl.play().catch(e => console.log("Otomatik oynatma engellendi.", e));
      }
  }, [soundEnabled, assets.music_bg]);

  useEffect(() => {
      localStorage.setItem('dogacla_teams_v98', JSON.stringify(teams));
      localStorage.setItem('dogacla_turn_v98', currentTurn.toString());
  }, [teams, currentTurn]);

  const addLog = (msg) => {
      setLogs(prev => [`• ${msg}`, ...prev].slice(0, 15));
  };

  const addReaction = (emoji) => { 
      playSynthSound('click', soundEnabled); 
      const id = Date.now() + Math.random(); 
      const x = Math.random() * 80 + 10; 
      setReactions(prev => [...prev, { id, emoji, x }]); 
      setHypeMeter(prev => Math.min(100, prev + 2)); 
  };

  const removeReaction = useCallback((id) => {
      setReactions(prev => prev.filter(r => r.id !== id));
  }, []);

  const resetGame = () => { 
      playSynthSound('click', soundEnabled);
      localStorage.removeItem('dogacla_teams_v98');
      localStorage.removeItem('dogacla_turn_v98');
      setTeams(JSON.parse(JSON.stringify(INITIAL_TEAMS)));
      setCurrentTurn(0); 
      setDiceValue(1); 
      setActiveCard(null); 
      setCardType(null); 
      setPlayingBonus(null); 
      setPerformanceTimer(0); 
      setJuryScore(0); 
      setVoteData({ roleplay: false, obstacleOvercome: false, fail: false, bonusScore: 0 }); 
      setHypeMeter(0); 
      setCharacterMood('idle'); 
      setGameState('INTRO'); 
  };

  const startKura = () => { 
      setGameState('KURA'); 
      setKuraRolling(true); 
      playSynthSound('roll', soundEnabled); 
      setShowDiceModal(true); 
      setTimeout(() => { 
          const winnerId = Math.floor(Math.random() * 4); 
          setCurrentTurn(winnerId); 
          setKuraRolling(false); 
          playSynthSound('success', soundEnabled); 
          setTimeout(() => { 
              setShowDiceModal(false); 
              setGameState('ROLL'); 
          }, 2000); 
      }, 3000); 
  };

  const checkFinals = () => { 
      const finishers = teams.filter(t => t.pos >= 35); 
      if (finishers.length > 0) { 
          const sorted = [...teams].sort((a, b) => b.score - a.score); 
          setFinalists(sorted.slice(0, 2)); 
          setDirectors(sorted.slice(2, 4)); 
          setFinalTurnIndex(0); 
          setCurrentTurn(sorted[0].id); 
          setDraftMission(null); 
          setGameState('FINALS_DIRECTOR_INPUT'); 
          playSynthSound('success', soundEnabled);
      } else { 
          nextTurn(); 
      }
  };

  const moveTokenStepByStep = async (teamId, startPos, targetPos) => { 
      let current = startPos; 
      while (current < targetPos) { 
          current++; 
          setTeams(prev => prev.map(t => t.id === teamId ? { ...t, pos: current } : t)); 
          playSynthSound('click', soundEnabled); 
          await new Promise(resolve => setTimeout(resolve, 200)); 
      } 
      if (targetPos === 35) {
          checkFinals(); 
      } else { 
          drawCard(BOARD_MAP[targetPos].type); 
      }
  };
  
  const rollDice = () => {
      setShowDiceModal(true); 
      setIsRollingDice(true); 
      playSynthSound('roll', soundEnabled);
      setTimeout(() => {
          const roll = Math.ceil(Math.random() * 6); 
          setDiceValue(roll); 
          setIsRollingDice(false);
          setTimeout(() => { 
              setShowDiceModal(false); 
              const newPos = Math.min(currentTeam.pos + roll, 35);
              moveTokenStepByStep(currentTeam.id, currentTeam.pos, newPos);
          }, 1200); 
      }, 1200);
  };

  const drawCard = (type) => { 
      if(type === 'start') { 
          nextTurn(); 
          return; 
      }
      setCardType(type); 
      setCharacterMood(type === 'easy' || type === 'bonus' ? 'happy' : (type === 'medium' ? 'thinking' : 'scared'));
      
      if (type === 'bonus') {
          const bonusObj = CARDS_DATA.BONUS[Math.floor(Math.random() * CARDS_DATA.BONUS.length)];
          // Kubo çekildiyse 5 senaryodan birini bağla
          if (bonusObj.id === 'kubo') {
              const randomScenario = assets.kubo_scenarios[Math.floor(Math.random() * assets.kubo_scenarios.length)];
              setActiveCard({ ...bonusObj, activeVideoUrl: randomScenario });
          } else {
              setActiveCard(bonusObj);
          }
      } else if (type === 'obstacle') {
          const obs = CARDS_DATA.OBSTACLE[Math.floor(Math.random() * CARDS_DATA.OBSTACLE.length)];
          setActiveCard(obs);
      } else {
          const list = CARDS_DATA[type.toUpperCase()] || CARDS_DATA.EASY; 
          setActiveCard(list[Math.floor(Math.random() * list.length)]); 
      }
      setGameState('CARD'); 
  };
  
  const handleCardAction = () => { 
      playSynthSound('click', soundEnabled); 
      if (cardType === 'moderator') {
          setActiveCard(null);
          setGameState('ROLL');
      }
      else if (cardType === 'bonus') { 
          setTeams(prev => prev.map((t, i) => i === currentTurn ? { ...t, bonuses: [...t.bonuses, activeCard] } : t)); 
          setActiveCard(null); 
          nextTurn(); 
      } 
      else if (cardType === 'obstacle') { 
          if (activeCard.type === 'unmarked') {
              setGameState('TARGET_OBSTACLE'); 
          } else { 
              setTeams(prev => prev.map((t, i) => i === currentTurn ? { ...t, activeObstacles: [...t.activeObstacles, activeCard] } : t)); 
              setActiveCard(null); 
              nextTurn(); 
          } 
      } else { 
          setPerformanceTimer(cardType === 'easy' ? 60 : 90); 
          setGameState('PERFORM'); 
          setTimerKey(p => p + 1); 
      } 
  };

  const assignObstacleToRival = (targetId) => { 
      setTeams(prev => prev.map(t => t.id === targetId ? { ...t, activeObstacles: [...t.activeObstacles, activeCard] } : t)); 
      setActiveCard(null); 
      nextTurn(); 
  };

  const updateJuryScore = (delta) => { 
      setJuryScore(p => Math.min(Math.max(p + delta, -5), 15)); 
      playSynthSound('click', soundEnabled); 
  };
  
  const submitManualVote = useCallback((score = juryScore) => { 
      playSynthSound('success', soundEnabled); 
      let finalScore = score; 
      if(voteData.roleplay) finalScore += 2; 
      if(voteData.obstacleOvercome) finalScore += 2; 
      if(voteData.fail) finalScore = -2; 
      finalScore += (voteData.bonusScore || 0); 
      
      if (isGoldenMic) { 
          finalScore *= 2; 
          addLog("🌟 ALTIN MİKROFON DEVREDE! PUANLAR KATLANDI!"); 
          setHypeMeter(0); 
          setConfetti(true); 
          setTimeout(() => setConfetti(false), 3000); 
      } else { 
          setHypeMeter(Math.min(100, hypeMeter + (finalScore > 5 ? 20 : 5))); 
      } 
      
      setTeams(prev => prev.map(t => t.id === currentTeam.id ? { ...t, score: t.score + finalScore, activeObstacles: [] } : t)); 
      setJuryScore(0); 
      setVoteData({ roleplay: false, obstacleOvercome: false, fail: false, bonusScore: 0 }); 
      setActiveCard(null); 
      nextTurn(); 
  }, [juryScore, voteData, currentTeam, soundEnabled, isGoldenMic, hypeMeter]);

  const finishPerformance = () => {
      setGameState('VOTE');
  };

  const nextTurn = () => { 
      setGameState('ROLL'); 
      setDiceValue(1); 
      setCurrentTurn(prev => (prev + 1) % 4); 
      setCharacterMood('idle'); 
  };

  // Performans Esnasında Bonus Oynama
  const prepareBonus = (bonusIndex) => {
      const bonusToPlay = currentTeam.bonuses[bonusIndex];
      if (bonusToPlay.id === 'kubo') {
          const randomScenario = assets.kubo_scenarios[Math.floor(Math.random() * assets.kubo_scenarios.length)];
          setPlayingBonus({ ...bonusToPlay, activeVideoUrl: randomScenario });
      } else {
          setPlayingBonus(bonusToPlay);
      }
  };

  const executeBonusPower = () => {
      setConfetti(true); 
      setTimeout(() => setConfetti(false), 3000);
      
      if (playingBonus.effect === 'time') { 
          setPerformanceTimer(p => p + 30); // Kubo +30 sn ekler
          addLog("🎬 Kubo araya girdi: +30 Saniye Ek Süre!");
      } else if (playingBonus.effect === 'score') { 
          setVoteData(p => ({...p, bonusScore: (p.bonusScore || 0) + 2})); 
          addLog("💰 Mali devreye girdi: +2 Puan Finans Desteği!");
      } 
      
      setTeams(prev => prev.map(t => t.id === currentTeam.id ? { ...t, bonuses: t.bonuses.filter(b => b.id !== playingBonus.id) } : t)); 
      setPlayingBonus(null);
  };

  const getCurrentCharacterAsset = () => assets[`team${currentTeam.id}_${characterMood}`] || assets[`team${currentTeam.id}_idle`] || assets[`team${currentTeam.id}`];

  return (
    <div className="h-screen font-sans flex flex-col overflow-hidden text-gray-100 bg-[#0a0a0a] relative select-none">
      <style>{`
        .text-neon-blue { color: #00f3ff; text-shadow: 0 0 10px rgba(0,243,255,0.7); }
        .scene { width: 128px; height: 128px; perspective: 600px; }
        .cube { width: 100%; height: 100%; position: relative; transform-style: preserve-3d; transition: transform 1s cubic-bezier(0.25, 1, 0.5, 1); }
        .cube__face { position: absolute; width: 128px; height: 128px; }
        .cube__face--1 { transform: rotateY(0deg) translateZ(64px); } .cube__face--2 { transform: rotateY(180deg) translateZ(64px); }
        .cube__face--3 { transform: rotateY(90deg) translateZ(64px); } .cube__face--4 { transform: rotateY(-90deg) translateZ(64px); }
        .cube__face--5 { transform: rotateX(90deg) translateZ(64px); } .cube__face--6 { transform: rotateX(-90deg) translateZ(64px); }
        .show-1 { transform: translateZ(-64px) rotateY(0deg); } .show-2 { transform: translateZ(-64px) rotateY(-180deg); }
        .show-3 { transform: translateZ(-64px) rotateY(-90deg); } .show-4 { transform: translateZ(-64px) rotateY(90deg); }
        .show-5 { transform: translateZ(-64px) rotateX(-90deg); } .show-6 { transform: translateZ(-64px) rotateX(90deg); }
        .rolling { animation: spinCube 0.5s infinite linear; }
        @keyframes spinCube { 0% { transform: rotateX(0deg) rotateY(0deg); } 100% { transform: rotateX(360deg) rotateY(360deg); } }
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      
      {confetti && <ConfettiExplosion />}
      
      <div className="absolute inset-0 z-0 opacity-40 transition-opacity duration-1000" style={{backgroundImage: assets.boardBg ? `url(${assets.boardBg})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center'}}></div>
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-black via-transparent to-black/80 pointer-events-none"></div>

      {showDiceModal && (
        <div className="fixed inset-0 bg-black/90 z-[80] flex items-center justify-center backdrop-blur-md">
          <div className="text-center scale-150">
            {gameState === 'KURA' ? <TeamDice3D winnerId={currentTurn} isRolling={kuraRolling} assets={assets} /> : <Dice3D value={isRollingDice ? null : diceValue} isRolling={isRollingDice} />}
            <div className="mt-8 text-2xl font-black text-neon-blue animate-pulse tracking-widest">
              {kuraRolling ? getLocalizedText(UI[lang].drawingLots, lang) : getLocalizedText(UI[lang].rollingDice, lang)}
            </div>
          </div>
        </div>
      )}
      
      {/* REJİ ÜST BAR (MODERATÖR BUTONLU) */}
      <header className="h-20 bg-black/60 border-b border-white/10 flex items-center justify-between px-6 z-40 backdrop-blur-md relative">
          <div className="flex items-center gap-4">
              {assets.logo ? <img src={assets.logo} alt="Logo" className="h-12 w-auto object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"/> : <div className="bg-yellow-500 text-black p-2 rounded-lg"><Theater size={28}/></div>}
              <div className="hidden md:block"><h1 className="font-black text-2xl tracking-[0.2em] text-white">DOĞAÇLA <span className="text-neon-blue text-sm align-top">9.8</span></h1></div>
          </div>
          
          <div className="flex-1 max-w-lg mx-6 relative">
              <div className="flex justify-between text-[10px] uppercase font-bold text-gray-400 mb-1 px-1">
                <span>{getLocalizedText(UI[lang].silence, lang)}</span>
                <span className={isGoldenMic ? "text-yellow-400 animate-pulse" : ""}>{getLocalizedText(UI[lang].goldenMic, lang)}</span>
              </div>
              <div className="h-4 bg-gray-800 rounded-full overflow-hidden border border-gray-600 relative">
                  <div className={`h-full transition-all duration-700 ${isGoldenMic ? 'bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-300 animate-pulse' : 'bg-blue-500'}`} style={{ width: `${hypeMeter}%` }}></div>
              </div>
          </div>
          
          <div className="flex items-center gap-3">
              {/* MODERATÖR DÜDÜĞÜ BUTONU */}
              <button 
                onClick={() => { setCardType('moderator'); setActiveCard(CARDS_DATA.MODERATOR[0]); setGameState('CARD'); }}
                className="px-3 py-2 bg-emerald-600/80 hover:bg-emerald-600 border border-emerald-400/50 rounded-xl text-xs font-black flex items-center gap-1.5 transition shadow-[0_0_15px_rgba(16,185,129,0.4)]"
              >
                <Clapperboard size={16} /> Moderatör
              </button>

              <button onClick={() => setSoundEnabled(!soundEnabled)} className="p-2 font-bold hover:text-neon-blue transition bg-white/10 rounded-lg">{soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}</button>
              <button onClick={() => setLang(l => l === 'tr' ? 'en' : 'tr')} className="p-2 font-bold uppercase hover:text-neon-blue transition bg-white/10 rounded-lg">{lang === 'tr' ? 'EN' : 'TR'}</button>
              
              <div className={`flex items-center gap-3 px-4 py-2 rounded-full bg-black/80 border-2 ${currentTeam.border} shadow-[0_0_20px_rgba(0,0,0,0.5)]`}>
                  <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-black"><AssetDisplay src={getCurrentCharacterAsset()} className="w-full h-full object-cover object-top" alt="Takım" /></div>
                  <div className="flex flex-col leading-none"><span className="text-[10px] text-gray-400 uppercase font-bold">{getLocalizedText(UI[lang].onStageNow, lang)}</span><span className={`font-black text-base ${currentTeam.text}`}>{getLocalizedText(TEAM_INFO[currentTeam.id].name, lang)}</span></div>
                  <span className="font-mono font-bold text-xl text-yellow-500 ml-2">{currentTeam.score}P</span>
              </div>
          </div>
      </header>
      
      {/* OYUN ALANI */}
      <div className="flex-1 flex flex-col md:flex-row relative z-10 overflow-hidden">
        <div className="flex-1 overflow-auto relative p-4 md:p-8 transition-all duration-500">
            {reactions.map(r => <FloatingReaction key={r.id} {...r} onComplete={removeReaction} />)}
            
            {gameState === 'INTRO' && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black">
                    <h1 className="text-7xl font-black mb-12 animate-pulse text-center text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-600 drop-shadow-[0_0_30px_rgba(212,175,55,0.8)]">DOĞAÇLA</h1>
                    <button onClick={startKura} className="px-12 py-5 bg-white text-black font-black text-2xl rounded-full hover:scale-110 transition shadow-[0_0_50px_rgba(255,255,255,0.2)]">
                        {getLocalizedText(UI[lang]?.start, lang) || "BAŞLA"}
                    </button>
                </div>
            )}
            
            {gameState !== 'INTRO' && (
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4 max-w-7xl mx-auto opacity-90">
                    {BOARD_MAP.map((sq, i) => {
                        const playersHere = teams.filter(t => t.pos === i);
                        return (
                            <div key={i} className={`aspect-square rounded-2xl border border-white/10 bg-gray-900/40 relative flex items-center justify-center ${sq.type === 'bonus' ? 'border-amber-500/60 shadow-[inset_0_0_20px_rgba(212,175,55,0.3)]' : ''} ${sq.type === 'obstacle' ? 'border-red-500/60 shadow-[inset_0_0_20px_rgba(239,68,68,0.3)]' : ''}`}>
                                <span className="absolute top-2 right-2 text-[10px] opacity-30 font-bold">{i}</span>
                                <div className="flex flex-wrap gap-1 justify-center">
                                    {playersHere.map(p => (
                                        <div key={p.id} className={`w-8 h-8 md:w-12 md:h-12 rounded-full border-2 border-white ${p.color} overflow-hidden bg-black shadow-2xl ${currentTeam.id === p.id ? 'scale-110 ring-4 ring-white/30 animate-pulse z-10' : ''}`}>
                                            <AssetDisplay src={assets[`team${p.id}`]} className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>

        {/* SAĞ YÖNETİM & SAHNE PANELİ */}
        {gameState !== 'INTRO' && (
            <div className="w-full lg:w-[420px] bg-black/70 backdrop-blur-xl border-l border-white/10 flex flex-col z-30 relative shadow-2xl">
                <div className="h-28 p-4 overflow-y-auto text-xs font-mono space-y-1.5 border-b border-white/10 bg-black/40">
                  {logs.map((l, i) => <div key={i} className="text-gray-400 border-l-2 border-[#D4AF37] pl-2">{String(l)}</div>)}
                </div>

                <div className="flex-1 p-6 flex flex-col items-center justify-between overflow-y-auto">
                    {/* Karakter Kartı */}
                    <div className="w-full max-w-xs rounded-2xl border-2 border-[#D4AF37]/50 bg-black overflow-hidden shadow-2xl mb-4">
                        <div className="w-full aspect-[9/16] relative bg-black">
                            <AssetDisplay src={getCurrentCharacterAsset()} className="w-full h-full object-cover object-top" alt="Karakter" />
                            <div className="absolute top-2 right-2 text-3xl animate-bounce">
                              {characterMood === 'happy' && '😂'}
                              {characterMood === 'thinking' && '🤔'}
                              {characterMood === 'scared' && '😱'}
                            </div>
                        </div>
                        <div className="p-4 text-center">
                            <h2 className="text-2xl font-black text-white">{getLocalizedText(TEAM_INFO[currentTeam.id].name, lang)}</h2>
                            <p className="text-amber-400 text-xs font-bold uppercase">{getLocalizedText(TEAM_INFO[currentTeam.id].desc, lang)}</p>
                        </div>
                    </div>

                    {/* Aksiyon Alanı */}
                    <div className="w-full space-y-4">
                        {currentTeam.activeObstacles.length > 0 && (
                            <div className="w-full p-3 bg-red-500/20 border border-red-500/50 rounded-xl flex gap-3 items-center animate-pulse">
                              <AlertTriangle className="text-red-500 shrink-0" size={20}/>
                              <div className="text-xs text-white">
                                <strong className="block text-red-400 font-bold uppercase">⚠️ AKTİF ENGEL</strong>
                                {currentTeam.activeObstacles.map((o,i) => <span key={i} className="block">• {getLocalizedText(o.text, lang)}</span>)}
                              </div>
                            </div>
                        )}
                        
                        {gameState === 'ROLL' && (
                          <button onClick={rollDice} className="w-full py-6 bg-gradient-to-r from-[#D4AF37] via-amber-400 to-[#D4AF37] text-black text-2xl font-black rounded-2xl shadow-xl flex items-center justify-center gap-3 transform hover:scale-[1.02] active:scale-95 transition">
                            <Dices size={32} /> {getLocalizedText(UI[lang]?.rollDice, lang) || "ZAR AT"}
                          </button>
                        )}

                        {gameState === 'TARGET_OBSTACLE' && (
                          <div className="w-full bg-gray-800/80 p-4 rounded-xl border border-white/10">
                            <h3 className="text-center text-red-400 font-bold mb-3 uppercase text-xs">{getLocalizedText(UI[lang].whoSabotage, lang)}</h3>
                            {teams.filter(t => t.id !== currentTeam.id).map(t => (
                              <button key={t.id} onClick={() => assignObstacleToRival(t.id)} className="w-full p-3 bg-black rounded-lg border border-gray-700 hover:border-red-500 flex justify-between items-center mb-2 text-sm transition">
                                <span>{getLocalizedText(TEAM_INFO[t.id].name, lang)}</span> <ShieldAlert size={16} className="text-red-500"/>
                              </button>
                            ))}
                          </div>
                        )}
                        
                        {gameState === 'PERFORM' && (
                            <div className="w-full text-center bg-gray-900/80 p-5 rounded-2xl border border-white/10">
                                <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">{getLocalizedText(UI[lang].time, lang)}</div>
                                <Timer key={timerKey} duration={performanceTimer} onFinish={finishPerformance} soundEnabled={soundEnabled} />
                                
                                {/* Performans Sırasında Bonus Kart Çıkartıp Kullanma */}
                                {currentTeam.bonuses.length > 0 && (
                                    <div className="mt-4 grid grid-cols-2 gap-2">
                                        {currentTeam.bonuses.map((b, i) => (
                                            <button key={i} onClick={() => prepareBonus(i)} className="px-3 py-2.5 bg-gradient-to-r from-amber-600 to-yellow-600 text-black font-black text-xs rounded-xl shadow-lg flex items-center justify-center gap-1.5 active:scale-95 transition">
                                                <Sparkles size={14}/> {getLocalizedText(b.name, lang)} ({b.effect === 'time' ? '+30s' : '+2P'})
                                            </button>
                                        ))}
                                    </div>
                                )}
                                
                                <button onClick={finishPerformance} className="w-full mt-4 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold uppercase tracking-wider text-xs transition">
                                  {getLocalizedText(UI[lang].finishPerf, lang)}
                                </button>
                            </div>
                        )}
                        
                        {gameState === 'VOTE' && (
                            <div className="w-full bg-black/60 p-5 rounded-2xl border border-white/10 space-y-4">
                                <h3 className="text-center font-black text-[#D4AF37] text-lg uppercase tracking-wider">{getLocalizedText(UI[lang].juryScoring, lang)}</h3>
                                <div className="flex gap-2">
                                  <button onClick={() => setVoteData(p => ({...p, roleplay: !p.roleplay}))} className={`flex-1 py-2.5 rounded-lg text-xs font-bold border transition ${voteData.roleplay ? 'bg-blue-600 border-blue-400 text-white' : 'border-gray-700 text-gray-400'}`}>+2 ROL</button>
                                  <button onClick={() => setVoteData(p => ({...p, obstacleOvercome: !p.obstacleOvercome}))} className={`flex-1 py-2.5 rounded-lg text-xs font-bold border transition ${voteData.obstacleOvercome ? 'bg-green-600 border-green-400 text-white' : 'border-gray-700 text-gray-400'}`}>+2 ENGEL</button>
                                  <button onClick={() => setVoteData(p => ({...p, fail: !p.fail}))} className={`flex-1 py-2.5 rounded-lg text-xs font-bold border transition ${voteData.fail ? 'bg-red-600 border-red-400 text-white' : 'border-gray-700 text-gray-400'}`}>-2 KURAL</button>
                                </div>
                                <div className="flex justify-center items-center gap-6">
                                  <button onClick={() => updateJuryScore(-1)} className="w-10 h-10 rounded-full border border-red-500 text-red-500 flex items-center justify-center"><Minus size={20}/></button>
                                  <span className="text-5xl font-mono font-bold text-white">{juryScore}</span>
                                  <button onClick={() => updateJuryScore(1)} className="w-10 h-10 rounded-full border border-green-500 text-green-500 flex items-center justify-center"><Plus size={20}/></button>
                                </div>
                                <button onClick={() => submitManualVote()} className="w-full py-3.5 bg-[#D4AF37] text-black font-black text-base rounded-xl uppercase tracking-widest shadow-lg hover:brightness-110 transition">
                                  {getLocalizedText(UI[lang].confirmScore, lang)}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )}
      </div>

      {/* KART AÇILMA EKRANI */}
      {gameState === 'CARD' && activeCard && (
        <CardDisplay 
          card={activeCard} 
          type={cardType} 
          mode="draw" 
          onAction={handleCardAction} 
          assets={assets} 
          currentTeamId={currentTeam.id} 
          lang={lang} 
        />
      )}

      {/* PERFORMANS ESNASINDA BONUS OYNAMA MODALI */}
      {playingBonus && (
        <CardDisplay 
          card={playingBonus} 
          type="bonus" 
          mode="play" 
          onAction={executeBonusPower} 
          assets={assets} 
          currentTeamId={currentTeam.id} 
          lang={lang} 
        />
      )}
    </div>
  );
}
