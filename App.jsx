import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Dices, Trophy, User, Clock, Star, ShieldAlert, Sparkles, Skull, Theater, 
  AlertTriangle, CheckCircle, XCircle, ScrollText, Plus, Minus, Gavel, 
  Menu, X, Volume2, VolumeX, RefreshCw, LayoutGrid, History, Mic2, Lightbulb,
  Bot, Zap, Monitor, Share2, MessageSquare, MousePointer2, Smile, Heart, ThumbsUp,
  PenTool, Music, Keyboard, Dice5, Repeat, Image as ImageIcon, Upload, Palette, Link as LinkIcon, Wand2, Layers, Loader2, Maximize, Minimize,
  Flame, Crown, PartyPopper, Tv, Target, Hand, Drama, Megaphone, Clapperboard, Video, Frown, Laugh, Ticket, Move, Ghost, Smartphone, Bird, Thermometer, Apple, HelpCircle, Play, Music4
} from 'lucide-react';

// --- 1. SABİT VERİLER (TÜM TANIMLAMALAR EN ÜSTTE) ---

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
    boardBg: GAME_ASSETS.bg, logo: GAME_ASSETS.logo,
    music_bg: GAME_ASSETS.music_bg,
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

const UI = {
    en: {
        start: "START", rollDice: "ROLL DICE", drawingLots: "DRAWING LOTS...", rollingDice: "ROLLING DICE...",
        onStageNow: "ON STAGE NOW", silence: "Silence", goldenMic: "GOLDEN MICROPHONE", x2Points: "X2 POINTS ACTIVE!",
        enteringStage: "ENTERING STAGE...", whoSabotage: "Who will you sabotage?", time: "Time", finishPerf: "Finish Performance",
        juryScoring: "JURY SCORING", role: "+2 ROLE", obstacleBtn: "+2 OBSTACLE", fail: "-2 FAIL", aiComment: "AI COMMENT",
        confirmScore: "CONFIRM SCORE", backstage: "BACKSTAGE", final: "FINAL", bonus: "BONUS", obstacle: "OBSTACLE",
        easy: "EASY", medium: "MEDIUM", hard: "HARD", oppCard: "OPPORTUNITY CARD", obsCard: "OBSTACLE", improv: "IMPROV",
        easyLevel: "EASY LEVEL", medLevel: "MEDIUM LEVEL", hardLevel: "HARD LEVEL", finalScene: "FINAL SCENE",
        chooseTarget: "CHOOSE TARGET", accept: "ACCEPT", stageYours: "THE STAGE IS YOURS", applySelf: "Apply to Self",
        giveRival: "Give to Rival", perfReq: "Requires Stage Performance.", activeObstacle: "ACTIVE OBSTACLE",
        useBonusBtn: "USE BONUS", unleashPower: "💥 UNLEASH POWER 💥",
        grandFinale: "GRAND FINALE!", onlyTwoRemain: "Only two remain on stage.", champion: "CHAMPION!",
        finalScore: "Final Score:", playAgain: "PLAY AGAIN", vs: "VS", close: "CLOSE",
        directorPromptTitle: "DIRECTOR'S CHAIR", directorPromptDesc: "Losing teams are now Directors! Enter the final scene theme:",
        generateDraft: "GENERATE DRAFT MISSION", regenerate: "REGENERATE", createAsIs: "CREATE OPTIONS AS IS", aiDrafted: "AI DRAFTED THE MISSION",
        generatingDraft: "AI Writing Mission...", generatingOptions: "AI Generating Cards...", castWinner: "CAST THE WINNER",
        auditionComplete: "Auditions Complete!", whoGetsRole: "Who gets the lead role?", transitionWait: "Next Finalist's Turn",
        startNext: "START NEXT AUDITION", selectAICard: "CHOOSE A GENERATED SCENE",
        rulesTitle: "RULES OF THE STAGE",
        rulesContent: [
            { title: "🎭 Take the Stage", text: "Roll the dice and move. Draw a card based on your tile (Easy, Medium, Hard, or Obstacle)." },
            { title: "⏱️ Perform", text: "Act out the scenario on the card within the time limit. Stay in character!" },
            { title: "⚖️ Jury Scoring", text: "The other players judge you. Good roleplay and overcoming obstacles grant extra points." },
            { title: "🌟 Golden Mic", text: "Keep the audience hyped! When the bar fills, your next score is doubled." },
            { title: "🎬 Grand Finale", text: "When a player reaches tile 35, the top 2 teams face off. The losing teams become Directors and write the final scene!" }
        ]
    },
    tr: {
        start: "BAŞLA", rollDice: "ZAR AT", drawingLots: "KURA ÇEKİLİYOR...", rollingDice: "ZAR ATILIYOR...",
        onStageNow: "ŞU AN SAHNEDE", silence: "Sessizlik", goldenMic: "ALTIN MİKROFON", x2Points: "X2 PUAN AKTİF!",
        enteringStage: "SAHNEYE ÇIKIYOR...", whoSabotage: "Kimi sabote edeceksin?", time: "Süre", finishPerf: "Performansı Bitir",
        juryScoring: "JÜRİ OYLAMASI", role: "+2 ROL", obstacleBtn: "+2 ENGEL", fail: "-2 BAŞARISIZ", aiComment: "YAPAY ZEKA",
        confirmScore: "PUANI ONAYLA", backstage: "KULİS", final: "FİNAL", bonus: "BONUS", obstacle: "ENGEL",
        easy: "KOLAY", medium: "ORTA", hard: "ZOR", oppCard: "FIRSAT KARTI", obsCard: "ENGEL", improv: "DOĞAÇLAMA",
        easyLevel: "KOLAY SEVİYE", medLevel: "ORTA SEVİYE", hardLevel: "ZOR SEVİYE", finalScene: "FİNAL SAHNESİ",
        chooseTarget: "HEDEF SEÇ", accept: "KABUL ET", stageYours: "SAHNE SENİN", applySelf: "Kendine Uygula",
        giveRival: "Rakibe Ver", perfReq: "Sahne Performansı Gerektirir.", activeObstacle: "AKTİF ENGEL",
        useBonusBtn: "BONUS KULLAN", unleashPower: "💥 GÜCÜ KULLAN 💥",
        grandFinale: "BÜYÜK FİNAL!", onlyTwoRemain: "Sahnede sadece iki kişi kaldı.", champion: "ŞAMPİYON!",
        finalScore: "Final Puanı:", playAgain: "YENİDEN OYNA", vs: "VS", close: "KAPAT",
        directorPromptTitle: "YÖNETMEN KOLTUĞU", directorPromptDesc: "Kaybedenler yönetmen oldu! Final sahnesinin temasını girin:",
        generateDraft: "GÖREV TASLAĞI ÜRET", regenerate: "YENİDEN ÜRET", createAsIs: "SEÇENEKLERİ OLUŞTUR", aiDrafted: "YAPAY ZEKA GÖREVİ YAZDI",
        generatingDraft: "Yapay Zeka Görevi Yazıyor...", generatingOptions: "Yapay Zeka Kartları Üretiyor...", castWinner: "ROLÜ VER (KAZANANI SEÇ)",
        auditionComplete: "Seçmeler Tamamlandı!", whoGetsRole: "Başrolü kim kapıyor?", transitionWait: "Sıra Diğer Finalistte",
        startNext: "SIRADAKİ SEÇMEYİ BAŞLAT", selectAICard: "ÜRETİLEN SAHNELERDEN BİRİNİ SEÇ",
        rulesTitle: "SAHNE KURALLARI",
        rulesContent: [
            { title: "🎭 Sahneye Çık", text: "Zar at ve ilerle. Durduğun kareye göre (Kolay, Orta, Zor veya Engel) kart çek." },
            { title: "⏱️ Performans", text: "Karttaki senaryoyu süre bitmeden canlandır. Karakterinden çıkma!" },
            { title: "⚖️ Jüri Oylaması", text: "Diğer oyuncular jüri olur. Role girmek ve engelleri aşmak ekstra puan kazandırır." },
            { title: "🌟 Altın Mikrofon", text: "Seyirciyi coştur! Bar dolduğunda alacağın puan ikiye katlanır." },
            { title: "🎬 Büyük Final", text: "Biri 35. kareye ulaştığında en iyi 2 takım finale çıkar. Kaybedenler yönetmen koltuğuna oturur ve finali yazar!" }
        ]
    }
};

const TEAM_INFO = {
    0: { name: 'İBİŞ', desc: { en: 'Cunning & Witty', tr: 'Kurnaz & Esprili' }, longDesc: { en: 'A traditional jester. A word wizard.', tr: 'Geleneksel bir şakacı. Kelime sihirbazı.' }, style: { en: 'Humorous', tr: 'Mizahi' } },
    1: { name: 'KARAGÖZ', desc: { en: 'Physical & Blunt', tr: 'Fiziksel & Dobra' }, longDesc: { en: "Doesn't mince words, says it straight.", tr: 'Lafını esirgemez, dobra dobra konuşur.' }, style: { en: 'Physical', tr: 'Fiziksel' } },
    2: { name: 'SHAKESPEARE', desc: { en: 'Dramatic & Poetic', tr: 'Dramatik & Şiirsel' }, longDesc: { en: 'The most serious actor on stage.', tr: 'Sahnedeki en ciddi ve trajik aktör.' }, style: { en: 'Tragic', tr: 'Trajik' } },
    3: { name: 'ARİSTOFANES', desc: { en: 'Satirical & Clever', tr: 'Hicivli & Zeki' }, longDesc: { en: 'Always looks down on events.', tr: 'Olaylara her zaman yukarıdan bakar ve alay eder.' }, style: { en: 'Ironic', tr: 'İronik' } }
};

// Modifiye edilmiş ve alt satırlara bölünmüş yapı
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
    { id: 'tubi', name: 'Tubi', desc: { en: 'Advice!', tr: 'Annen gibi düşün... Tavsiye vereceğim!' }, benefit: { en: 'GET IDEA', tr: 'FİKİR AL' }, effect: 'idea' }, 
    { id: 'kubi', name: 'Kubi', desc: { en: 'Pen in hand! I am writing one more person into this scene. Let it be crowded!', tr: 'Kalem elimde! Bu sahneye bir kişi daha yazıyorum. Kalabalık olsun!' }, benefit: { en: 'EXTRA CHARACTER', tr: 'EKSTRA KARAKTER' }, effect: 'char' }, 
    { id: 'mali', name: 'Mali', desc: { en: 'Profit!', tr: 'Hesapladım, kârlı çıkarız.' }, benefit: { en: '+2 POINTS', tr: '+2 PUAN' }, effect: 'score' }, 
    { id: 'kubo', name: 'Kubo', desc: { en: "Cut! Didn't work, taking it from the top but extending time.", tr: 'Kestik! Olmadı, baştan alıyoruz ama süreyi uzatıyorum.' }, benefit: { en: '+30 SECONDS', tr: '+30 SANİYE' }, effect: 'time' }, 
    { id: 'madox', name: 'Madox', desc: { en: "Changed!", tr: 'Bu sahnenin türü beni sıktı. Değiştirildi!' }, benefit: { en: 'CHANGE GENRE', tr: 'TÜRÜ DEĞİŞTİR' }, effect: 'genre' }, 
    { id: 'dputiyat', name: 'Dpütiyat', desc: { en: 'No being alone! Grab someone, throw them on stage.', tr: 'Yalnız olmak yok! Birini kap, sahneye fırlat.' }, benefit: { en: 'INVITE PLAYER', tr: 'OYUNCU DAVET ET' }, effect: 'add_player' }, 
    { id: 'gulec', name: 'Güleç', desc: { en: 'Applause!', tr: 'Harika! Bir alkış tufanı yaratıyorum!' }, benefit: { en: 'APPLAUSE', tr: 'ALKIŞ' }, effect: 'applause' }, 
    { id: 'sadic', name: 'Sadıç', desc: { en: 'Life is a gamble brother! Rolling the dice!', tr: 'Hayat bir kumardır kardeşim! Zarları atıyorum!' }, benefit: { en: 'LUCKY DICE', tr: 'ŞANS ZARI' }, effect: 'gamble' }, 
    { id: 'cihad', name: 'Cihad', desc: { en: 'I have a surprise in my pocket... Use it!', tr: 'Cebimde bir sürpriz var... Kullan onu!' }, benefit: { en: 'SURPRISE OBJECT', tr: 'SÜRPRİZ OBJE' }, effect: 'double' } 
  ]
};

// --- GÜVENLİK İÇİN DİL DEĞİŞTİRİCİ ---
const getLocalizedText = (item, lang) => {
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
      } else if (type === 'success') {
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

// --- 3. YARDIMCI BİLEŞENLER ---
const AssetDisplay = ({ src, className, style, alt }) => {
    if (!src) {
        return (
            <div className={className} style={{...style, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent'}}>
                {alt}
            </div>
        );
    }
    const isVideo = src.toLowerCase().endsWith('.mp4') || src.toLowerCase().endsWith('.webm');
    if (isVideo) {
        return <video key={src} src={src} className={className} style={style} autoPlay loop muted playsInline />;
    }
    return <img src={src} className={className} style={style} alt={String(alt)} />;
};

const getCardIcon = (text, defaultIcon) => {
    if (!text) return defaultIcon;
    const lowerText = String(text).toLowerCase();
    if (lowerText.includes("king") || lowerText.includes("kral") || lowerText.includes("crown")) return <Crown size={48} className="text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.8)]" />;
    if (lowerText.includes("phone") || lowerText.includes("sinyal") || lowerText.includes("call")) return <Smartphone size={48} className="text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.8)]" />;
    if (lowerText.includes("chicken") || lowerText.includes("tavuk")) return <Bird size={48} className="text-orange-400 drop-shadow-[0_0_15px_rgba(251,146,60,0.8)]" />;
    if (lowerText.includes("cold") || lowerText.includes("soğuk") || lowerText.includes("freeze")) return <Thermometer size={48} className="text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]" />;
    if (lowerText.includes("apple") || lowerText.includes("elma") || lowerText.includes("eat")) return <Apple size={48} className="text-red-400 drop-shadow-[0_0_15px_rgba(248,113,113,0.8)]" />;
    if (lowerText.includes("song") || lowerText.includes("şarkı") || lowerText.includes("music")) return <Music size={48} className="text-purple-400 drop-shadow-[0_0_15px_rgba(192,132,252,0.8)]" />;
    if (lowerText.includes("laugh") || lowerText.includes("gül")) return <Laugh size={48} className="text-green-400 drop-shadow-[0_0_15px_rgba(74,222,128,0.8)]" />;
    if (lowerText.includes("scared") || lowerText.includes("kork") || lowerText.includes("ghost")) return <Ghost size={48} className="text-gray-300 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />;
    return defaultIcon;
};

const Dice3D = ({ value, isRolling }) => {
    return (
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
};

const TeamDice3D = ({ winnerId, isRolling, assets }) => {
    const renderFace = (teamId) => (
        <div className="w-full h-full flex items-center justify-center bg-black border-4 border-yellow-500 overflow-hidden">
            <AssetDisplay src={assets[`team${teamId}`]} className="w-full h-full object-cover" />
        </div>
    );
    return (
        <div className="scene w-32 h-32 mx-auto perspective-1000">
            <div className={`cube w-full h-full relative transform-style-3d transition-transform duration-1000 ${isRolling ? 'rolling' : `show-${(winnerId || 0) + 1}`}`}>
                {[0, 1, 2, 3, 0, 1].map((t, i) => (
                    <div key={i} className={`cube__face cube__face--${i+1}`}>
                        {renderFace(t)}
                    </div>
                ))}
            </div>
        </div>
    );
};

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
    
    useEffect(() => { 
        setTimeLeft(duration); 
    }, [duration]);
    
    useEffect(() => {
        if (timeLeft <= 0) { 
            if (duration > 0) { 
                playSynthSound('alarm', soundEnabled); 
                onFinish(); 
            } 
            return; 
        }
        const id = setInterval(() => setTimeLeft(t => t - 1), 1000); 
        return () => clearInterval(id);
    }, [timeLeft, onFinish, duration, soundEnabled]);
    
    return (
        <div className="text-6xl font-mono font-bold text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] tracking-widest">
            {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
        </div>
    );
};

// --- 4. KART BİLEŞENİ ---
const CardDisplay = ({ card, type, mode = 'draw', onAction, assets, currentTeamId, lang }) => {
    const cardRef = useRef(null);
    const [mouseState, setMouseState] = useState({ x: 0, y: 0 });
    const [targetState, setTargetState] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const loadAnime = async () => {
            if (!window.anime) {
                const script = document.createElement('script');
                script.src = "https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js";
                document.body.appendChild(script);
                await new Promise(res => script.onload = res);
            }
            if (!window.anime) return;
            const tl = window.anime.timeline({ easing: 'easeOutExpo', duration: 1500 });
            if (mode === 'draw') {
                tl.add({ targets: '#curtain-left', translateX: ['0%', '-100%'], scaleX: [1, 0.2], duration: 1200 }, 0)
                  .add({ targets: '#curtain-right', translateX: ['0%', '100%'], scaleX: [1, 0.2], duration: 1200 }, 0)
                  .add({ targets: '.stagger-item', translateY: [50, 0], opacity: [0, 1], delay: window.anime.stagger(150), easing: 'spring(1, 80, 10, 0)' }, '-=800');
            } else if (mode === 'play') {
                tl.add({ targets: cardRef.current, scale: [2, 1], rotateZ: ['15deg', '0deg'], opacity: [0, 1], duration: 1200, easing: 'easeOutElastic(1, .5)' }, 0)
                  .add({ targets: '.stagger-item', translateY: [30, 0], opacity: [0, 1], delay: window.anime.stagger(100) }, '-=1000');
            }
            if (type === 'bonus' && card.name) {
                 tl.add({ targets: '.bonus-char', opacity: [0, 1], translateY: [20, 0], delay: window.anime.stagger(50), easing: 'easeOutElastic(1, .8)' }, '-=600');
            }
        };
        loadAnime();
        if (mode === 'play') {
            playSynthSound('powerup', true); 
        } else {
            playSynthSound('curtain', true);
        }
    }, [mode, type, card.name]);

    useEffect(() => {
        let frameId;
        const tick = () => {
            setMouseState(prev => ({ x: prev.x + (targetState.x - prev.x) * 0.1, y: prev.y + (targetState.y - prev.y) * 0.1 }));
            frameId = requestAnimationFrame(tick);
        };
        frameId = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frameId);
    }, [targetState]);

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        setTargetState({ x: ((e.clientX - rect.left) / rect.width) * 2 - 1, y: ((e.clientY - rect.top) / rect.height) * 2 - 1 });
    };

    const triggerAction = () => {
        if (mode === 'play' && window.anime && cardRef.current) {
            window.anime({ targets: cardRef.current, scale: [1, 1.5], opacity: [1, 0], filter: ['brightness(1)', 'brightness(3)'], duration: 400, easing: 'easeInExpo', complete: onAction });
        } else {
            onAction();
        }
    };

    if (!card) return null;
    const isBonus = type === 'bonus';
    const isObstacle = type === 'obstacle';
    const isFinal = type === 'final';
    const isPlaying = mode === 'play';
    
    const baseKey = `team${currentTeamId}`;
    let characterVideoSrc = assets[`${baseKey}_idle`];
    if (type === 'easy') characterVideoSrc = assets[`${baseKey}_happy`];
    else if (type === 'medium') characterVideoSrc = assets[`${baseKey}_thinking`];
    else if (type === 'hard' || type === 'obstacle' || type === 'final') characterVideoSrc = assets[`${baseKey}_scared`];

    // GÜVENLİK İÇİN DİL STRING ATAMALARI VE YENİ BONUS KART HİYERARŞİSİ
    let titleText = isBonus ? (getLocalizedText(card.name, lang) || "BONUS") : (getLocalizedText(card.title, lang) || "GÖREV");
    let missionText = isBonus ? getLocalizedText(card.desc, lang) : getLocalizedText(card.mission, lang);
    let oppCardLabel = getLocalizedText(UI[lang]?.oppCard, lang) || "FIRSAT KARTI";
    let flavorText = isBonus 
        ? `${oppCardLabel} ✦ ${getLocalizedText(card.benefit, lang)}` 
        : (getLocalizedText(getRandomCardText(card, currentTeamId, lang), lang) || getLocalizedText(card.desc, lang));

    let icon = isBonus ? <Sparkles size={32} className="text-[#D4AF37]"/> : getCardIcon(missionText + " " + titleText, <Drama size={32} className="text-[#D4AF37]"/>);

    let bgStyle = isBonus ? (isPlaying ? "bg-gradient-to-b from-yellow-600 to-red-900" : "bg-gradient-to-b from-indigo-600 to-blue-900") : "bg-neutral-900";
    let accentColor = isBonus ? (isPlaying ? "text-yellow-200" : "text-indigo-200") : "text-white";
    let glowColor = isBonus ? (isPlaying ? "rgba(255, 200, 0, 0.8)" : "rgba(99, 102, 241, 0.5)") : "rgba(255,255,255,0.1)";

    if (isObstacle) {
        bgStyle = "bg-gradient-to-b from-red-600 to-rose-900";
        accentColor = "text-red-200";
        glowColor = "rgba(225, 29, 72, 0.5)";
        flavorText = card.type === 'marked' ? getLocalizedText(UI[lang].applySelf, lang) : getLocalizedText(UI[lang].giveRival, lang);
        icon = <Skull size={32} className="text-red-500 animate-bounce"/>;
    } else if (!isBonus) {
        if(type === 'easy') { 
            bgStyle = "bg-gradient-to-b from-emerald-500 to-teal-800"; 
            accentColor = "text-emerald-100"; 
            titleText = getLocalizedText(UI[lang].easyLevel, lang); 
        }
        else if(type === 'medium') { 
            bgStyle = "bg-gradient-to-b from-amber-500 to-orange-800"; 
            accentColor = "text-amber-100"; 
            titleText = getLocalizedText(UI[lang].medLevel, lang); 
        }
        else if(type === 'hard') { 
            bgStyle = "bg-gradient-to-b from-rose-500 to-red-800"; 
            accentColor = "text-rose-100"; 
            titleText = getLocalizedText(UI[lang].hardLevel, lang); 
        }
        else if(type === 'final') { 
            bgStyle = "bg-gradient-to-b from-yellow-600 via-orange-600 to-red-900"; 
            accentColor = "text-yellow-100"; 
        }
    }

    const rotateX = mouseState.y * -5;
    const rotateY = mouseState.x * 5;
    const bonusNameChars = isBonus && titleText ? String(titleText).split('') : [];

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
            <style>@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,700&display=swap');</style>
            
            {isPlaying && <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(255,200,0,0.3)_0%,transparent_70%)] animate-pulse"></div>}
            
            <div 
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setTargetState({ x: 0, y: 0 })}
                className="relative w-full max-w-md h-[80vh] rounded-[2.5rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] flex flex-col transition-transform duration-[400ms] ease-out"
                style={{ 
                    transformStyle: 'preserve-3d', 
                    transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`, 
                    boxShadow: `0 20px 50px -10px ${glowColor}` 
                }}
            >
                <div className={`absolute inset-0 ${bgStyle} z-0`}></div>
                <div className="absolute inset-0 pointer-events-none z-20" style={{ background: `radial-gradient(circle 300px at 50% 50%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.95) 100%)`, mixBlendMode: 'multiply' }}></div>

                <div className="absolute inset-0 z-10 flex flex-col justify-start p-0">
                    
                    <div className={`relative w-full h-[40%] shrink-0 z-0 overflow-hidden flex items-center justify-center ${isBonus ? '' : 'bg-black'}`}>
                         {isBonus && assets[`bonus_${card.id}`] ? (
                            <AssetDisplay 
                                src={assets[`bonus_${card.id}`]} 
                                className={`w-full h-full object-cover object-top bg-transparent mix-blend-screen transition-transform duration-700 ${isPlaying ? 'scale-[1.15]' : 'scale-[1.05]'}`} 
                                alt="Bonus" 
                            />
                        ) : (
                            characterVideoSrc && <AssetDisplay src={characterVideoSrc} className="w-full h-full object-cover object-top" alt="Character" />
                        )}
                        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
                    </div>

                    <div className={`relative z-30 flex-1 flex flex-col items-center justify-between text-center px-6 pb-6 -mt-6 pt-2 overflow-y-auto`}>
                         <div className="flex flex-col items-center w-full">
                             
                             <div className="p-3 rounded-full bg-black/80 border border-[#D4AF37]/50 mb-2 shadow-xl backdrop-blur-md inline-flex justify-center stagger-item">
                                 {isPlaying ? <Zap size={32} className="text-yellow-400 animate-pulse"/> : icon}
                             </div>
                             
                             <h1 className="stagger-item text-3xl md:text-4xl text-[#D4AF37] font-black italic mb-2 leading-none uppercase drop-shadow-md">
                                 {isBonus ? (
                                     bonusNameChars.map((char, idx) => (
                                         <span key={idx} className="bonus-char inline-block" style={{textShadow: isPlaying ? '0 0 20px rgba(255,200,0,1)' : 'none'}}>
                                             {char === ' ' ? '\u00A0' : char}
                                         </span>
                                     ))
                                 ) : (
                                     String(titleText)
                                 )}
                             </h1>
                             
                             <div className="stagger-item w-full mb-3 bg-black/60 border border-[#D4AF37]/30 p-4 rounded-xl shadow-inner min-h-[5rem] flex items-center justify-center">
                                <p className={`text-lg md:text-xl font-bold leading-tight ${accentColor}`}>
                                    "{String(missionText)}"
                                </p>
                             </div>
                             
                             <p className={`stagger-item italic mb-4 px-2 leading-snug text-sm md:text-base ${isBonus ? 'text-yellow-500 font-bold uppercase tracking-widest' : 'text-gray-300'}`}>
                                {String(flavorText)}
                             </p>
                             
                         </div>
                         
                         <button onClick={triggerAction} className="stagger-item w-full py-4 rounded-2xl font-black text-xl tracking-[0.1em] uppercase shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all transform hover:scale-[1.02] shrink-0 bg-white text-black hover:bg-gray-200">
                            {isPlaying ? (getLocalizedText(UI[lang]?.unleashPower, lang) || "GÜCÜ KULLAN") : (isBonus ? (getLocalizedText(UI[lang]?.accept, lang) || "KABUL ET") : (getLocalizedText(UI[lang]?.stageYours, lang) || "SAHNE SENİN"))}
                         </button>
                    </div>
                </div>

                {mode === 'draw' && (
                    <svg className="absolute inset-0 z-50 pointer-events-none w-full h-full" preserveAspectRatio="none">
                        <rect id="curtain-left" x="0" y="0" width="50%" height="100%" fill="#8B0000" style={{filter: 'drop-shadow(10px 0 20px rgba(0,0,0,0.8))'}} />
                        <rect id="curtain-right" x="50%" y="0" width="50%" height="100%" fill="#8B0000" style={{filter: 'drop-shadow(-10px 0 20px rgba(0,0,0,0.8))'}} />
                    </svg>
                )}
            </div>
        </div>
    );
};

// --- 5. ANA OYUN ---
export default function DogaclaVisualsFinal() {
  const [lang, setLang] = useState('tr');
  const [teams, setTeams] = useState(() => {
      const saved = localStorage.getItem('dogacla_teams_v90');
      return saved ? JSON.parse(saved) : JSON.parse(JSON.stringify(INITIAL_TEAMS));
  });
  const [assets] = useState(DEFAULT_ASSETS);
  const [currentTurn, setCurrentTurn] = useState(() => parseInt(localStorage.getItem('dogacla_turn_v90')) || 0);
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
  const [logs, setLogs] = useState(["Improv 9.8 - Grand Theater!"]);
  const [reactions, setReactions] = useState([]);
  const [confetti, setConfetti] = useState(false); 
  const [randomEvent, setRandomEvent] = useState(null);
  const [showRules, setShowRules] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [timerKey, setTimerKey] = useState(0); 
  const [criticLoading, setCriticLoading] = useState(false);

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
      localStorage.setItem('dogacla_teams_v90', JSON.stringify(teams));
      localStorage.setItem('dogacla_turn_v90', currentTurn.toString());
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
      localStorage.removeItem('dogacla_teams_v90');
      localStorage.removeItem('dogacla_turn_v90');
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
      setIsRollingDice(false); 
      setShowDiceModal(false); 
      setKuraRolling(false); 
      setFinalists([]); 
      setDirectors([]); 
      setDirectorInput(''); 
      setDraftMission(null); 
      setCustomFinalCard(null); 
      setAiCards([]); 
      setFinalTurnIndex(0); 
      setWinner(null); 
      setLogs(["Improv 9.8 - Grand Theater!"]); 
      setReactions([]); 
      setConfetti(false); 
      setRandomEvent(null); 
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
          const bonus = Math.floor(currentTeam.score / 5); 
          const roll = Math.ceil(Math.random() * 6); 
          setDiceValue(roll); 
          setIsRollingDice(false);
          setTimeout(() => { 
              setShowDiceModal(false); 
              const newPos = Math.min(currentTeam.pos + roll + bonus, 35);
              moveTokenStepByStep(currentTeam.id, currentTeam.pos, newPos);
          }, 1200); 
      }, 1200);
  };

  const drawCard = (type) => { 
      if(type==='start') { 
          nextTurn(); 
          return; 
      }
      setCardType(type); 
      setCharacterMood(type === 'easy' || type === 'bonus' ? 'happy' : (type === 'medium' ? 'thinking' : 'scared'));
      let list = CARDS_DATA[type.toUpperCase()] || CARDS_DATA.EASY; 
      const cardData = list[Math.floor(Math.random() * list.length)]; 
      setActiveCard(cardData); 
      setGameState('CARD'); 
  };
  
  const handleCardAction = () => { 
      playSynthSound('click', soundEnabled); 
      if (cardType === 'bonus') { 
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
          setPerformanceTimer(cardType === 'easy' ? 60 : (cardType === 'final' ? 120 : 90)); 
          setGameState(cardType === 'final' ? 'FINALS_PLAY' : 'PERFORM'); 
          setTimerKey(p => p + 1); 
      } 
  };

  const assignObstacleToRival = (targetId) => { 
      setTeams(prev => prev.map(t => t.id === targetId ? { ...t, activeObstacles: [...t.activeObstacles, activeCard] } : t)); 
      setActiveCard(null); 
      nextTurn(); 
  };

  const updateJuryScore = (delta) => { 
      setJuryScore(p => Math.min(Math.max(p+delta, -5), 15)); 
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
          addLog(getLocalizedText(UI[lang].goldenMic, lang) + "!"); 
          setHypeMeter(0); 
          playSynthSound('hype', soundEnabled); 
          setConfetti(true); 
          setTimeout(() => setConfetti(false), 3000); 
      } else { 
          setHypeMeter(Math.min(100, hypeMeter + (finalScore > 5 ? 20 : 5))); 
      } 
      
      const isFinal = gameState === 'FINALS_VOTE'; 
      const targetId = isFinal && finalists[finalTurnIndex] ? finalists[finalTurnIndex].id : currentTeam.id; 
      
      setTeams(prev => prev.map(t => t.id === targetId ? { ...t, score: t.score + finalScore, activeObstacles: [] } : t)); 
      setJuryScore(0); 
      setVoteData({ roleplay: false, obstacleOvercome: false, fail: false, bonusScore: 0 }); 
      
      if (isFinal) { 
          if (finalTurnIndex === 0) { 
              setFinalTurnIndex(1); 
              setCurrentTurn(finalists[1].id); 
              setGameState('FINALS_PREP'); 
          } else { 
              setWinner(finalists[0].score > finalists[1].score ? finalists[0] : finalists[1]); 
              setGameState('END'); 
          } 
      } else { 
          setActiveCard(null); 
          if (currentTeam.pos === 35) setTimeout(checkFinals, 100); 
          else nextTurn(); 
      } 
  }, [gameState, juryScore, voteData, finalists, finalTurnIndex, currentTeam, soundEnabled, isGoldenMic, hypeMeter, lang]);
  
  const finishPerformance = () => {
      if (gameState === 'FINALS_PLAY') { 
          if (finalTurnIndex === 0) setGameState('FINALS_TRANSITION'); 
          else setGameState('FINALS_CASTING'); 
      } else {
          setGameState('VOTE');
      }
  };

  const startNextFinalist = () => { 
      setFinalTurnIndex(1); 
      setCurrentTurn(finalists[1].id); 
      setGameState('FINALS_PREP'); 
      playSynthSound('click', soundEnabled); 
  };

  const nextTurn = () => { 
      setGameState('ROLL'); 
      setDiceValue(1); 
      setCurrentTurn(prev => (prev + 1) % 4); 
      setCharacterMood('idle'); 
  };

  const prepareBonus = (bonusIndex) => {
      const bonusToPlay = currentTeam.bonuses[bonusIndex];
      setPlayingBonus(bonusToPlay);
  };

  const executeBonusPower = () => {
      setConfetti(true); 
      setTimeout(() => setConfetti(false), 3000);
      
      if (playingBonus.effect === 'time') { 
          setPerformanceTimer(p => p + 30); 
      } else if (playingBonus.effect === 'score') { 
          setVoteData(p => ({...p, bonusScore: (p.bonusScore || 0) + 2})); 
      } 
      
      setTeams(prev => prev.map(t => t.id === currentTeam.id ? { ...t, bonuses: t.bonuses.filter(b => b.id !== playingBonus.id) } : t)); 
      setPlayingBonus(null);
  };

  const askAICritic = () => { 
      setCriticLoading(true); 
      setTimeout(() => { 
          addLog(`🤖 ${getLocalizedText(UI[lang].aiComment, lang)}: "${getLocalizedText(TEAM_INFO[currentTeam.id].style, lang)}!"`); 
          setCriticLoading(false); 
          playSynthSound('click', soundEnabled); 
      }, 1500); 
  };

  const generateDraftMissionAPI = () => { 
      setGameState('FINALS_GENERATING'); 
      setTimeout(() => { 
          setDraftMission({ tr: `Sahnede '${directorInput}' temasını canlandırıyorsun.`, en: `You portray '${directorInput}'.` }); 
          setGameState('FINALS_DRAFT_REVIEW'); 
          playSynthSound('success', soundEnabled); 
      }, 1500); 
  };

  const approveAndGenerateOptionsAPI = () => { 
      setGameState('FINALS_GENERATING'); 
      setTimeout(() => { 
          setAiCards(generateMockCardsDual(directorInput, draftMission)); 
          setGameState('FINALS_SELECT_CARD'); 
          playSynthSound('success', soundEnabled); 
      }, 1500); 
  };

  const getCurrentCharacterAsset = () => assets[`team${currentTeam.id}_${characterMood}`] || assets[`team${currentTeam.id}_idle`] || assets[`team${currentTeam.id}`];

  return (
    <div className="h-screen font-sans flex flex-col overflow-hidden text-gray-100 bg-[#0a0a0a] relative">
      <style>{`
        .text-neon-blue { color: #00f3ff; text-shadow: 0 0 10px rgba(0,243,255,0.7); }
        .border-neon-blue { border-color: #00f3ff; box-shadow: 0 0 10px rgba(0,243,255,0.3); }
        .bg-neon-blue { background-color: #00f3ff; box-shadow: 0 0 20px rgba(0,243,255,0.5); }
        .animate-pulse-fast { animation: pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        .spotlight-overlay { background: radial-gradient(circle at center, transparent 150px, rgba(0,0,0,0.85) 400px); }
        @keyframes breathe { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.03); } }
        .animate-breathe { animation: breathe 4s ease-in-out infinite; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-10px); } 100% { transform: translateY(0px); } }
        
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
        
        /* SCROLLBAR GIZLEME ICIN KÜÇÜK BIR SINIF */
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      
      {confetti && <ConfettiExplosion />}
      
      <div className="absolute inset-0 z-0 opacity-40 transition-opacity duration-1000" style={{backgroundImage: assets.boardBg ? `url(${assets.boardBg})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center'}}></div>
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-black via-transparent to-black/80 pointer-events-none"></div>
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20"><svg width="100%" height="100%"><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/></pattern><rect width="100%" height="100%" fill="url(#grid)" /></svg></div>

      {showDiceModal && <div className="fixed inset-0 bg-black/90 z-[80] flex items-center justify-center backdrop-blur-md"><div className="text-center scale-150">{gameState === 'KURA' ? <TeamDice3D winnerId={currentTurn} isRolling={kuraRolling} assets={assets} /> : <Dice3D value={isRollingDice ? null : (diceValue > 6 ? 6 : diceValue)} isRolling={isRollingDice} />}<div className="mt-8 text-2xl font-black text-neon-blue animate-pulse tracking-widest">{kuraRolling ? getLocalizedText(UI[lang].drawingLots, lang) : getLocalizedText(UI[lang].rollingDice, lang)}</div></div></div>}
      
      <header className="h-20 bg-black/60 border-b border-white/10 flex items-center justify-between px-6 z-40 backdrop-blur-md relative">
          <div className="flex items-center gap-4">
              {assets.logo ? <img src={assets.logo} alt="Logo" className="h-12 w-auto object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"/> : <div className="bg-yellow-500 text-black p-2 rounded-lg"><Theater size={28}/></div>}
              <div className="hidden md:block"><h1 className="font-black text-2xl tracking-[0.2em] text-white">IMPROV <span className="text-neon-blue text-sm align-top">9.8</span></h1></div>
          </div>
          
          <div className="flex-1 max-w-lg mx-6 relative group">
              <div className="flex justify-between text-[10px] uppercase font-bold text-gray-400 mb-1 px-1"><span>{getLocalizedText(UI[lang].silence, lang)}</span><span className={isGoldenMic ? "text-yellow-400 animate-pulse" : ""}>{getLocalizedText(UI[lang].goldenMic, lang)}</span></div>
              <div className="h-4 bg-gray-800 rounded-full overflow-hidden border border-gray-600 relative">
                  <div className={`h-full transition-all duration-700 ${isGoldenMic ? 'bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-300 animate-pulse' : 'bg-blue-500'}`} style={{ width: `${hypeMeter}%` }}></div>
              </div>
          </div>
          
          <div className="flex items-center gap-4">
              <button onClick={() => setSoundEnabled(!soundEnabled)} className="p-2 font-bold hover:text-neon-blue transition bg-white/10 rounded-lg">{soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}</button>
              <button onClick={() => setLang(l => l === 'tr' ? 'en' : 'tr')} className="p-2 font-bold uppercase hover:text-neon-blue transition bg-white/10 rounded-lg">{lang === 'tr' ? 'EN' : 'TR'}</button>
              <div className={`flex items-center gap-3 px-5 py-2 rounded-full bg-black/80 border-2 ${currentTeam.border} shadow-[0_0_20px_rgba(0,0,0,0.5)] transform hover:scale-105 transition`}>
                  <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-black"><AssetDisplay src={getCurrentCharacterAsset()} className="w-full h-full object-cover object-top" alt={getLocalizedText(TEAM_INFO[currentTeam.id].name, lang)} /></div>
                  <div className="flex flex-col leading-none"><span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">{getLocalizedText(UI[lang].onStageNow, lang)}</span><span className={`font-black text-lg ${currentTeam.text}`}>{getLocalizedText(TEAM_INFO[currentTeam.id].name, lang)}</span></div>
                  <div className="h-8 w-[1px] bg-gray-600 mx-1"></div>
                  <span className="font-mono font-bold text-xl text-yellow-500">{currentTeam.score}</span>
              </div>
          </div>
      </header>
      
      <div className="flex-1 flex flex-col md:flex-row relative z-10 overflow-hidden">
        <div className={`flex-1 overflow-auto relative p-4 md:p-8 transition-all duration-500 bg-transparent`}>
            {reactions.map(r => <FloatingReaction key={r.id} {...r} onComplete={removeReaction} />)}
            <div className="absolute inset-0 pointer-events-none transition-all duration-1000 z-0 spotlight-overlay mix-blend-multiply opacity-80" style={{ background: `radial-gradient(circle at ${currentTeam.pos % 6 * 16 + 8}% ${Math.floor(currentTeam.pos/6) * 16 + 10}%, transparent 100px, rgba(0,0,0,0.95) 400px)` }}></div>
            
            {gameState === 'INTRO' && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black">
                    <h1 className="text-8xl font-black mb-12 animate-pulse text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 drop-shadow-[0_0_30px_rgba(0,100,255,0.8)]">IMPROV</h1>
                    <button onClick={startKura} className="px-12 py-5 bg-white text-black font-black text-2xl rounded-full hover:scale-110 transition shadow-[0_0_50px_rgba(255,255,255,0.2)]">
                        {getLocalizedText(UI[lang]?.start, lang) || "BAŞLA"}
                    </button>
                </div>
            )}
            
            {gameState !== 'INTRO' && !gameState.startsWith('FINALS_') && gameState !== 'END' && (
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4 max-w-7xl mx-auto opacity-90">
                    {BOARD_MAP.map((sq, i) => {
                        const playersHere = teams.filter(t => t.pos === i);
                        return (
                            <div key={i} className={`aspect-square rounded-2xl border border-white/10 bg-gray-900/40 relative flex items-center justify-center ${sq.type === 'bonus' ? 'border-blue-500/50 shadow-[inset_0_0_20px_rgba(59,130,246,0.2)]' : ''} ${sq.type === 'obstacle' ? 'border-red-500/50' : ''}`}>
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

            {/* FINALS SCREENS */}
            {gameState === 'FINALS_DIRECTOR_INPUT' && directors.length > 0 && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/95 backdrop-blur-md px-4">
                     <Clapperboard size={80} className="text-yellow-400 mb-6 animate-pulse" />
                     <h2 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 mb-4 tracking-widest text-center">{getLocalizedText(UI[lang].directorPromptTitle, lang)}</h2>
                     <textarea value={directorInput} onChange={e => setDirectorInput(e.target.value)} placeholder="Sahne teması..." className="w-full max-w-2xl h-32 bg-gray-900 border-2 border-yellow-500/50 rounded-xl p-4 text-white text-lg mb-8 shadow-[0_0_20px_rgba(0,0,0,0.5)]" />
                     <button onClick={generateDraftMissionAPI} disabled={!directorInput.trim()} className="px-10 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-black text-xl rounded-full hover:scale-105 transition">{getLocalizedText(UI[lang].generateDraft, lang)}</button>
                </div>
            )}
            {gameState === 'FINALS_DRAFT_REVIEW' && draftMission && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/95 backdrop-blur-md px-4">
                     <h2 className="text-3xl font-black text-yellow-400 mb-8">{getLocalizedText(UI[lang].aiDrafted, lang)}</h2>
                     <div className="bg-gray-900 border border-yellow-400/50 p-6 rounded-xl max-w-2xl w-full mb-8 shadow-2xl"><p className="text-white text-xl italic text-center">"{getLocalizedText(draftMission, lang)}"</p></div>
                     <button onClick={approveAndGenerateOptionsAPI} className="px-10 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-black text-lg rounded-xl hover:scale-105 transition">{getLocalizedText(UI[lang].createAsIs, lang)}</button>
                </div>
            )}
            {gameState === 'FINALS_SELECT_CARD' && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/95 backdrop-blur-md px-4 py-10">
                     <h2 className="text-3xl md:text-5xl font-black text-neon-blue mb-10 text-center">{getLocalizedText(UI[lang].selectAICard, lang)}</h2>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full">
                         {aiCards.map((c, idx) => (
                             <div key={idx} onClick={() => selectFinalCard(c)} className="bg-gray-900 border-2 border-yellow-500/50 rounded-2xl p-6 cursor-pointer hover:scale-105 transition-all text-center">
                                 <h3 className="text-2xl font-bold text-yellow-400 mb-4">{getLocalizedText(c.title, lang)}</h3>
                                 <p className="text-white mb-6 text-lg">"{getLocalizedText(c.mission, lang)}"</p>
                             </div>
                         ))}
                     </div>
                </div>
            )}
            {gameState === 'FINALS_TRANSITION' && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/95">
                     <h2 className="text-4xl md:text-6xl font-black text-white mb-8">{getLocalizedText(UI[lang].transitionWait, lang)}</h2>
                     <AssetDisplay src={assets[`team${finalists[1].id}_idle`]} className="w-48 h-48 rounded-full border-4 border-yellow-400 mb-8 object-cover shadow-[0_0_30px_yellow]" />
                     <button onClick={startNextFinalist} className="px-10 py-4 bg-white text-black font-black text-2xl rounded-full hover:scale-105 transition shadow-[0_0_40px_rgba(255,255,255,0.4)]">
                         {getLocalizedText(UI[lang].startNext, lang)} ({getLocalizedText(TEAM_INFO[finalists[1].id].name, lang)})
                     </button>
                </div>
            )}
            {gameState === 'FINALS_CASTING' && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/95 px-4">
                     <Star size={80} className="text-yellow-400 mb-6 animate-spin-slow" />
                     <h2 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 mb-2 tracking-widest text-center">{getLocalizedText(UI[lang].auditionComplete, lang)}</h2>
                     <p className="text-xl text-gray-300 mb-10">{getLocalizedText(UI[lang].whoGetsRole, lang)}</p>
                     
                     <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 mb-12">
                          <button onClick={() => castWinner(finalists[0])} className="group p-6 rounded-2xl border-4 border-gray-600 hover:border-yellow-400 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_yellow] flex flex-col items-center bg-black/50">
                              <AssetDisplay src={assets[`team${finalists[0].id}_happy`]} className="w-32 h-32 md:w-40 md:h-40 rounded-full mb-4 object-cover border-2 border-transparent group-hover:border-yellow-400" />
                              <h3 className="text-2xl font-bold group-hover:text-yellow-400">{getLocalizedText(TEAM_INFO[finalists[0].id].name, lang)}</h3>
                              <span className="mt-4 px-4 py-2 bg-yellow-500 text-black text-sm font-black rounded opacity-0 group-hover:opacity-100 transition-opacity">{getLocalizedText(UI[lang].castWinner, lang)}</span>
                          </button>
                          
                          <div className="text-4xl font-black text-red-500 italic">VS</div>
                          
                          <button onClick={() => castWinner(finalists[1])} className="group p-6 rounded-2xl border-4 border-gray-600 hover:border-yellow-400 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_yellow] flex flex-col items-center bg-black/50">
                              <AssetDisplay src={assets[`team${finalists[1].id}_happy`]} className="w-32 h-32 md:w-40 md:h-40 rounded-full mb-4 object-cover border-2 border-transparent group-hover:border-yellow-400" />
                              <h3 className="text-2xl font-bold group-hover:text-yellow-400">{getLocalizedText(TEAM_INFO[finalists[1].id].name, lang)}</h3>
                              <span className="mt-4 px-4 py-2 bg-yellow-500 text-black text-sm font-black rounded opacity-0 group-hover:opacity-100 transition-opacity">{getLocalizedText(UI[lang].castWinner, lang)}</span>
                          </button>
                     </div>
                </div>
            )}
            {gameState === 'END' && winner && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-yellow-900 to-black">
                     <ConfettiExplosion />
                     <Trophy size={100} className="text-yellow-400 mb-6 drop-shadow-[0_0_30px_rgba(250,204,21,1)] animate-bounce" />
                     <h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600 mb-4 tracking-tighter">{getLocalizedText(UI[lang].champion, lang)}</h1>
                     <div className="relative mb-8 mt-4">
                         <AssetDisplay src={assets[`team${winner.id}_happy`]} className="w-64 h-64 rounded-full border-8 border-yellow-400 shadow-[0_0_50px_yellow] object-cover bg-black" />
                         <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-8 py-2 rounded-full font-black text-3xl whitespace-nowrap shadow-lg">
                             {getLocalizedText(TEAM_INFO[winner.id].name, lang)}
                         </div>
                     </div>
                     <p className="text-3xl text-yellow-200 mb-12 font-bold">{getLocalizedText(UI[lang].finalScore, lang)} <span className="text-white">{winner.score}</span></p>
                     <button onClick={resetGame} className="px-8 py-4 bg-white text-black font-black uppercase tracking-widest rounded-lg hover:bg-gray-200 hover:scale-105 transition flex items-center gap-3">
                         <RefreshCw size={24} /> {getLocalizedText(UI[lang].playAgain, lang)}
                     </button>
                </div>
            )}
        </div>

        {/* SAĞ PANEL (Sadece oyun oynanırken görünür) */}
        {gameState !== 'END' && gameState !== 'INTRO' && gameState !== 'KURA' && !gameState.startsWith('FINALS_') && (
            <div className="w-full lg:w-[450px] bg-black/60 backdrop-blur-xl border-l border-white/10 flex flex-col shadow-[-20px_0_50px_rgba(0,0,0,0.5)] z-30 relative">
                <div className="h-32 p-4 overflow-y-auto text-xs font-mono space-y-2 border-b border-white/5 bg-black/20 mask-gradient-b">{logs.map((l, i) => <div key={i} className="text-gray-400 border-l-2 border-neon-blue/50 pl-3 py-0.5">{String(l)}</div>)}</div>
                <div className="flex-1 p-8 flex flex-col items-center relative overflow-y-auto">
                    <div className="flex flex-col items-center mb-8 w-full animate-fadeIn group perspective-1000">
                        <div className={`relative w-full max-w-xs rounded-2xl border-2 ${currentTeam.border} bg-gradient-to-b from-gray-800 to-black shadow-[0_0_50px_rgba(0,0,0,0.6)] overflow-hidden transition-transform duration-500 hover:rotate-x-2`}>
                             <div className="w-full aspect-[9/16] relative bg-black overflow-hidden">
                                 <AssetDisplay src={getCurrentCharacterAsset()} className="w-full h-full object-cover object-top opacity-90 group-hover:opacity-100 transition-opacity duration-700" alt={getLocalizedText(TEAM_INFO[currentTeam.id].name, lang)} />
                                 <div className={`absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent`}></div>
                                 <div className="absolute top-2 right-2 text-3xl animate-bounce">{characterMood === 'happy' && '😂'}{characterMood === 'thinking' && '🤔'}{characterMood === 'scared' && '😱'}</div>
                             </div>
                             <div className="p-6 relative -mt-12 text-center">
                                 <h2 className="text-3xl font-black text-white uppercase tracking-tighter drop-shadow-lg mb-1">{getLocalizedText(TEAM_INFO[currentTeam.id].name, lang)}</h2>
                                 <p className="text-neon-blue font-bold text-xs uppercase tracking-[0.2em] mb-3">{getLocalizedText(TEAM_INFO[currentTeam.id].desc, lang)}</p>
                             </div>
                        </div>
                    </div>

                    <div className="w-full flex-1 flex flex-col justify-center gap-4">
                        {currentTeam.activeObstacles.length > 0 && <div className="w-full p-4 bg-red-500/20 border border-red-500/50 rounded-xl flex gap-4 items-center animate-pulse"><AlertTriangle className="text-red-500 shrink-0" size={24}/><div className="text-sm text-white flex-1"><strong className="block text-red-400 font-bold uppercase tracking-wide mb-1">⚠️ {getLocalizedText(UI[lang].activeObstacle, lang)}</strong>{currentTeam.activeObstacles.map((o,i) => <span key={i} className="block opacity-80">- {getLocalizedText(o.text, lang)}</span>)}</div></div>}
                        
                        {gameState === 'ROLL' && <button onClick={rollDice} className="w-full py-8 bg-gradient-to-r from-neon-blue to-blue-700 hover:from-white hover:to-gray-200 hover:text-black text-white text-4xl font-black rounded-2xl shadow-[0_0_40px_rgba(0,243,255,0.4)] flex items-center justify-center gap-4 transition-all duration-300 transform hover:scale-[1.02] uppercase tracking-widest italic"><Dices size={40} /> {getLocalizedText(UI[lang]?.rollDice, lang) || "ZAR AT"}</button>}
                        {gameState === 'TARGET_OBSTACLE' && <div className="w-full animate-fadeIn bg-gray-800/50 p-4 rounded-xl border border-white/10"><h3 className="text-center text-red-400 font-bold mb-4 uppercase tracking-widest">{getLocalizedText(UI[lang].whoSabotage, lang)}</h3>{teams.filter(t => t.id !== currentTeam.id).map(t => <button key={t.id} onClick={() => assignObstacleToRival(t.id)} className="w-full p-4 bg-black rounded-lg border border-gray-700 hover:border-red-500 hover:bg-red-900/20 flex justify-between items-center mb-2 transition"><span>{getLocalizedText(TEAM_INFO[t.id].name, lang)}</span> <ShieldAlert size={18} className="text-red-500"/></button>)}</div>}
                        
                        {gameState === 'PERFORM' && (
                            <div className="w-full text-center bg-gray-900/50 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
                                <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">{getLocalizedText(UI[lang].time, lang)}</div>
                                <Timer key={timerKey} duration={performanceTimer} onFinish={finishPerformance} soundEnabled={soundEnabled} />
                                <div className="mt-6 flex justify-center gap-4"><button onClick={() => addReaction('👏')} className="p-4 bg-green-600/20 hover:bg-green-600/40 rounded-full border border-green-500/50 transition">👏</button><button onClick={() => addReaction('😂')} className="p-4 bg-yellow-600/20 hover:bg-yellow-600/40 rounded-full border border-yellow-500/50 transition">😂</button><button onClick={() => addReaction('😍')} className="p-4 bg-red-600/20 hover:bg-red-600/40 rounded-full border border-red-500/50 transition">😍</button></div>
                                {currentTeam.bonuses.length > 0 && (
                                    <div className="mt-6 grid grid-cols-2 gap-2">
                                        {currentTeam.bonuses.map((b, i) => (
                                            <button key={i} onClick={() => prepareBonus(i)} className="px-3 py-3 bg-gradient-to-r from-purple-900 to-indigo-900 border border-purple-500/80 rounded-lg font-bold text-xs text-white hover:from-purple-800 hover:to-indigo-800 transition flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                                                <Sparkles size={14}/> {getLocalizedText(b.name, lang)}
                                            </button>
                                        ))}
                                    </div>
                                )}
                                <button onClick={finishPerformance} className="w-full mt-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold uppercase tracking-widest transition">{getLocalizedText(UI[lang].finishPerf, lang)}</button>
                            </div>
                        )}
                        
                        {gameState === 'VOTE' && (
                            <div className="w-full bg-black/40 p-6 rounded-2xl border border-white/10">
                                <h3 className="text-center font-black text-neon-blue text-xl mb-6 uppercase tracking-widest border-b border-white/10 pb-4">{getLocalizedText(UI[lang].juryScoring, lang)}</h3>
                                <div className="flex gap-2 justify-center mb-6"><button onClick={() => setVoteData(p => ({...p, roleplay: !p.roleplay}))} className={`flex-1 py-3 rounded-lg text-xs font-bold border transition ${voteData.roleplay ? 'bg-blue-600 border-blue-400 text-white shadow-[0_0_15px_blue]' : 'border-gray-700 text-gray-500 hover:border-gray-500'}`}>{getLocalizedText(UI[lang].role, lang)}</button><button onClick={() => setVoteData(p => ({...p, obstacleOvercome: !p.obstacleOvercome}))} className={`flex-1 py-3 rounded-lg text-xs font-bold border transition ${voteData.obstacleOvercome ? 'bg-green-600 border-green-400 text-white shadow-[0_0_15px_green]' : 'border-gray-700 text-gray-500 hover:border-gray-500'}`}>{getLocalizedText(UI[lang].obstacleBtn, lang)}</button><button onClick={() => setVoteData(p => ({...p, fail: !p.fail}))} className={`flex-1 py-3 rounded-lg text-xs font-bold border transition ${voteData.fail ? 'bg-red-600 border-red-400 text-white shadow-[0_0_15px_red]' : 'border-gray-700 text-gray-500 hover:border-gray-500'}`}>{getLocalizedText(UI[lang].fail, lang)}</button></div>
                                <div className="flex justify-center items-center gap-8 mb-8"><button onClick={() => updateJuryScore(-1)} className="w-12 h-12 rounded-full border border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white transition flex items-center justify-center"><Minus size={24}/></button><span className="text-6xl font-mono font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">{juryScore}</span><button onClick={() => updateJuryScore(1)} className="w-12 h-12 rounded-full border border-green-500/50 text-green-500 hover:bg-green-500 hover:text-white transition flex items-center justify-center"><Plus size={24}/></button></div>
                                <div className="flex gap-3"><button onClick={askAICritic} className="flex-1 py-4 bg-purple-900/50 border border-purple-500 text-purple-300 font-bold rounded-xl hover:bg-purple-800 transition flex items-center justify-center gap-2" disabled={criticLoading}><Bot size={18}/> {getLocalizedText(UI[lang].aiComment, lang)}</button><button onClick={() => submitManualVote()} className="flex-[2] py-4 bg-white text-black font-black text-lg rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.4)] hover:scale-105 transition uppercase tracking-widest">{getLocalizedText(UI[lang].confirmScore, lang)}</button></div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )}

        {/* FİNAL OYNANIŞ PANELİ (Sadece FINALS_PLAY iken görünür) */}
        {gameState === 'FINALS_PLAY' && (
            <div className="w-full lg:w-[450px] bg-black/60 backdrop-blur-xl border-l border-yellow-500/30 flex flex-col shadow-[-20px_0_50px_rgba(250,204,21,0.2)] z-30 relative">
                 <div className="flex-1 p-8 flex flex-col items-center justify-center relative overflow-y-auto">
                      <div className="flex flex-col items-center mb-8 w-full animate-fadeIn group perspective-1000">
                          <div className={`relative w-full max-w-xs rounded-2xl border-4 border-yellow-500 bg-gradient-to-b from-gray-800 to-black shadow-[0_0_50px_rgba(250,204,21,0.6)] overflow-hidden transition-transform duration-500 hover:rotate-x-2`}>
                               <div className="w-full aspect-[9/16] relative bg-black overflow-hidden">
                                   <AssetDisplay src={assets[`team${currentTeam.id}_scared`]} className="w-full h-full object-cover object-top opacity-90 group-hover:opacity-100 transition-opacity duration-700" alt={getLocalizedText(TEAM_INFO[currentTeam.id].name, lang)} />
                                   <div className={`absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent`}></div>
                               </div>
                               <div className="p-6 relative -mt-12 text-center">
                                   <h2 className="text-3xl font-black text-white uppercase tracking-tighter drop-shadow-lg mb-1">{getLocalizedText(TEAM_INFO[currentTeam.id].name, lang)}</h2>
                                   <p className="text-yellow-400 font-bold text-xs uppercase tracking-[0.2em] mb-3">FİNAL PERFORMANSI</p>
                               </div>
                          </div>
                      </div>

                      <div className="w-full text-center bg-gray-900/80 p-6 rounded-2xl border-2 border-yellow-500/50 backdrop-blur-md">
                          <div className="text-xs text-yellow-500 uppercase tracking-widest mb-2">{getLocalizedText(UI[lang].time, lang)}</div>
                          <Timer key={timerKey} duration={performanceTimer} onFinish={finishPerformance} soundEnabled={soundEnabled} />
                          <button onClick={finishPerformance} className="w-full mt-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-black rounded-xl font-black text-xl uppercase tracking-widest transition hover:scale-105 shadow-[0_0_20px_rgba(250,204,21,0.5)]">{getLocalizedText(UI[lang].finishPerf, lang)}</button>
                      </div>
                 </div>
            </div>
        )}
      </div>

      {/* KART ÇEKME EKRANI */}
      {gameState === 'CARD' && activeCard && <CardDisplay card={activeCard} type={cardType} mode="draw" onAction={handleCardAction} assets={assets} currentTeamId={currentTeam.id} lang={lang} />}
      
      {/* FİNAL YZ KART EKRANI */}
      {gameState === 'FINALS_PREP' && customFinalCard && <CardDisplay card={customFinalCard} type="final" mode="draw" onAction={() => { playSynthSound('click', soundEnabled); setPerformanceTimer(120); setGameState('FINALS_PLAY'); setTimerKey(k=>k+1); }} assets={assets} currentTeamId={currentTeam.id} lang={lang} />}

      {/* BONUS OYNAMA (HAVALI) EKRANI */}
      {playingBonus && <CardDisplay card={playingBonus} type="bonus" mode="play" onAction={executeBonusPower} assets={assets} currentTeamId={currentTeam.id} lang={lang} />}
      
      {/* KURALLAR EKRANI (MODAL) */}
      {showRules && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
              <div className="bg-gray-900 border-2 border-[#D4AF37] rounded-2xl max-w-2xl w-full p-6 md:p-10 shadow-[0_0_50px_rgba(212,175,55,0.3)] relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-800 via-[#D4AF37] to-red-800"></div>
                  <button onClick={() => setShowRules(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white transition"><X size={28}/></button>
                  <h2 className="text-3xl md:text-4xl font-black text-[#D4AF37] mb-8 text-center font-serif tracking-widest">{getLocalizedText(UI[lang].rulesTitle, lang)}</h2>
                  
                  <div className="space-y-4 overflow-y-auto max-h-[60vh] pr-2 no-scrollbar">
                      {UI[lang].rulesContent.map((rule, idx) => (
                          <div key={idx} className="bg-black/50 border border-white/10 p-5 rounded-xl hover:border-[#D4AF37]/50 transition duration-300">
                              <h3 className="text-xl font-bold text-white mb-2">{getLocalizedText(rule.title, lang)}</h3>
                              <p className="text-gray-300 leading-relaxed text-sm md:text-base">{getLocalizedText(rule.text, lang)}</p>
                          </div>
                      ))}
                  </div>
                  
                  <div className="mt-8 flex justify-center">
                      <button onClick={() => setShowRules(false)} className="px-10 py-3 bg-[#D4AF37] text-black font-black uppercase tracking-widest rounded-lg hover:bg-white transition">{getLocalizedText(UI[lang].close, lang)}</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}
