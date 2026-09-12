import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Dices, Trophy, User, Clock, Star, ShieldAlert, Sparkles, Skull, Theater, 
  AlertTriangle, CheckCircle, XCircle, ScrollText, Plus, Minus, Gavel, 
  Menu, X, Volume2, VolumeX, RefreshCw, LayoutGrid, History, Mic2, Lightbulb,
  Bot, Zap, Monitor, Share2, MessageSquare, MousePointer2, Smile, Heart, ThumbsUp,
  PenTool, Music, Keyboard, Dice5, Repeat, Image as ImageIcon, Upload, Palette, Link as LinkIcon, Wand2, Layers, Loader2, Maximize, Minimize,
  Flame, Crown, PartyPopper, Tv, Target, Hand, Drama, Megaphone, Clapperboard, Video, Frown, Laugh, Ticket, Move, Ghost, Smartphone, Bird, Thermometer, Apple, HelpCircle, Play, Music4, Settings, Sliders
} from 'lucide-react';

// --- 1. SABİT VERİLER ---

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

const DEFAULT_ASSETS = {
    boardBg: GAME_ASSETS.bg, logo: GAME_ASSETS.logo,
    music_bg: GAME_ASSETS.music_bg,
    team0: GAME_ASSETS.ibis, team1: GAME_ASSETS.karagoz, team2: GAME_ASSETS.shakespeare, team3: GAME_ASSETS.aristophanes,
    moderator: GAME_ASSETS.moderator,
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

const DEFAULT_UI_CONFIG = {
    cardWidth: 420,
    cardHeight: 82,
    videoHeightPercent: 44,
    cardPadding: 24,
    titleSize: 32,
    missionTextSize: 18,
    buttonPaddingY: 16
};

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

const CARDS_DATA = {
  EASY: [ 
    { title: { en: "BROKEN ELEVATOR", tr: "BOZUK ASANSÖR" }, mission: { en: "You are stuck in a tight space. Show suffocation and panic with your body.", tr: "Dar bir alanda sıkıştın. Bedeninle boğulma ve paniği göster." }, quotes: { 0: {en: "Sir, we are toasted in this tin can!", tr: "Efendim, bu teneke kutuda piştik!"}, 1: {en: "We are stuck! My ribs are crushed!", tr: "Sıkıştık! Kaburgalarım ezildi!"}, 2: {en: "Oh iron cage! Trapping two souls...", tr: "Ah demir kafes! İki ruhu hapseden..."}, 3: {en: "This mechanical box is the tragedy of modern man.", tr: "Bu mekanik kutu modern insanın trajedisidir."} } }, 
    { title: { en: "POLAR COLD", tr: "KUTUP SOĞUĞU" }, mission: { en: "You are freezing. Teeth chattering. Try to warm up.", tr: "Donuyorsun. Dişlerin birbirine çarpıyor. Isınmaya çalış." }, quotes: { 0: {en: "Oh sir, I'm freezing! My nose turned to ice!", tr: "Aman efendim, donuyorum! Burnum buza döndü!"}, 1: {en: "Frozen! Light the stove!", tr: "Donduk! Yakın sobayı!"}, 2: {en: "Ah, this cold wind pierces my bones.", tr: "Ah, bu soğuk rüzgar kemiklerimi delip geçiyor."}, 3: {en: "This cold extinguishes the fire of the soul.", tr: "Bu soğuk, ruhun ateşini bile söndürüyor."} } }, 
    { title: { en: "CHICKEN ACT", tr: "TAVUK TAKLİDİ" }, mission: { en: "Act like a chicken. Cluck, scratch for food.", tr: "Bir tavuk gibi davran. Gıdakla, yem eşele." }, quotes: { 0: {en: "Cluck cluck sir!", tr: "Gıt gıdak efendim!"}, 1: {en: "Cluck! Are we stuck in a coop?", tr: "Gıdak! Kümese mi tıkıldık?"}, 2: {en: "Like a bird, but flightless... Oh feathered fate!", tr: "Bir kuş gibi ama uçamayan... Ah tüylü kader!"}, 3: {en: "Why must I behave like a chicken? Absurd!", tr: "Neden bir tavuk gibi davranmalıyım? Ne absürt!"} } }, 
    { title: { en: "NO SIGNAL", tr: "SİNYAL YOK" }, mission: { en: "Making a very important call but the line cuts off.", tr: "Çok önemli bir arama yapıyorsun ama hat kesiliyor." }, quotes: { 0: {en: "Hellooo! Can't hear you!", tr: "Alooo! Duyamıyorum seni!"}, 1: {en: "What do you say! Don't shout!", tr: "Ne diyorsun! Bağırma!"}, 2: {en: "Ah, faint voice from afar! Why can't I reach you?", tr: "Ah, uzaklardan gelen cılız ses! Sana neden ulaşamıyorum?"}, 3: {en: "Miscommunication in the age of communication...", tr: "İletişim çağında iletişimsizlik..."} } } 
  ],
  MEDIUM: [ 
    { title: { en: "FORGETFULNESS", tr: "UNUTKANLIK" }, mission: { en: "You forgot what to say right at that moment.", tr: "Tam o an ne söyleyeceğini unuttun." }, quotes: { 0: {en: "Umm... Sir, it was on the tip of my tongue!", tr: "Eee... Efendim, dilimin ucundaydı!"}, 1: {en: "You stole the words from my mind!", tr: "Kelimeleri aklımdan çaldınız!"}, 2: {en: "Ah, my memory betrays me! Words are lost.", tr: "Ah, hafızam bana ihanet ediyor! Kelimeler kayıp."}, 3: {en: "Silence... The greatest line is the unspoken one.", tr: "Sessizlik... En büyük replik söylenmeyendir."} } }, 
    { title: { en: "INVISIBLE APPLE", tr: "GÖRÜNMEZ ELMA" }, mission: { en: "Eat as if you have an apple in hand.", tr: "Elinde bir elma varmış gibi ye." }, quotes: { 0: {en: "Oh sir, this isn't an apple, it's a diamond! Crunch!", tr: "Aman efendim, bu elma değil elmas! Kırt!"}, 1: {en: "I have nothing but I'm eating!", tr: "Elimde hiçbir şey yok ama yiyorum!"}, 2: {en: "I feel the taste of a non-existent fruit.", tr: "Var olmayan bir meyvenin tadını hissediyorum."}, 3: {en: "Creating an invisible object... That is art.", tr: "Görünmez bir obje yaratmak... İşte sanat budur."} } } 
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
    { id: 'tubi', name: 'Tubi', desc: { en: 'Advice!', tr: 'Annen gibi düşün... Tavsiye vereceğim!' }, benefit: { en: 'GET IDEA', tr: 'FİKİR AL' }, effect: 'idea' }, 
    { id: 'kubi', name: 'Kubi', desc: { en: 'Pen in hand! I am writing one more person into this scene. Let it be crowded!', tr: 'Kalem elimde! Bu sahneye bir kişi daha yazıyorum. Kalabalık olsun!' }, benefit: { en: 'EXTRA CHARACTER', tr: 'EKSTRA KARAKTER' }, effect: 'char' }, 
    { id: 'mali', name: 'Mali', desc: { en: 'Profit!', tr: 'Hesapladım, kârlı çıkarız.' }, benefit: { en: '+2 POINTS', tr: '+2 PUAN' }, effect: 'score' }, 
    { id: 'kubo', name: 'Kubo', desc: { en: "Cut! Didn't work, taking it from the top but extending time.", tr: 'Kestik! Olmadı, baştan alıyoruz ama süreyi uzatıyorum.' }, benefit: { en: '+30 SECONDS', tr: '+30 SANİYE' }, effect: 'time' }, 
    { id: 'madox', name: 'Madox', desc: { en: "Changed!", tr: 'Bu sahnenin türü beni sıktı. Değiştirildi!' }, benefit: { en: 'CHANGE GENRE', tr: 'TÜRÜ DEĞİŞTİR' }, effect: 'genre' }, 
    { id: 'dputiyat', name: 'Dpütiyat', desc: { en: 'No being alone! Grab someone, throw them on stage.', tr: 'Yalnız olmak yok! Birini kap, sahneye fırlat.' }, benefit: { en: 'INVITE PLAYER', tr: 'OYUNCU DAVET ET' }, effect: 'add_player' }, 
    { id: 'gulec', name: 'Güleç', desc: { en: 'Applause!', tr: 'Harika! Bir alkış tufanı yaratıyorum!' }, benefit: { en: 'APPLAUSE', tr: 'ALKIŞ' }, effect: 'applause' }, 
    { id: 'sadic', name: 'Sadıç', desc: { en: 'Life is a gamble brother!', tr: 'Hayat bir kumardır kardeşim!' }, benefit: { en: 'LUCKY DICE', tr: 'ŞANS ZARI' }, effect: 'gamble' }, 
    { id: 'cihad', name: 'Cihad', desc: { en: 'I have a surprise in my pocket... Use it!', tr: 'Cebimde bir sürpriz var... Kullan onu!' }, benefit: { en: 'SURPRISE OBJECT', tr: 'SÜRPRİZ OBJE' }, effect: 'double' } 
  ],
  MODERATOR: [
    { 
      id: 'mod_start', 
      name: 'MODERATÖR', 
      title: { en: 'STAGE DIRECTOR', tr: 'REJİSÖR DÜDÜĞÜ' }, 
      desc: { 
        en: 'Attention on stage! Keep the tempo high or you get the whistle!', 
        tr: 'Gözüm üzerinizde! Sahneye çıkan süreyi başlatmayı unutursa klaketi patlatırım!' 
      }, 
      benefit: { en: 'STAGE CONTROL', tr: 'SAHNE KONTROLÜ' }, 
      customVideo: GAME_ASSETS.moderator 
    }
  ]
};

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
      } else if (type === 'success') {
          const playNote = (f, t, dur) => { 
              const o = ctx.createOscillator(); const g = ctx.createGain(); 
              o.type = 'square'; o.connect(g); g.connect(ctx.destination); 
              o.frequency.value = f; g.gain.setValueAtTime(0.05, now + t); 
              g.gain.exponentialRampToValueAtTime(0.001, now + t + dur); 
              o.start(now + t); o.stop(now + t + dur); 
          };
          playNote(523.25, 0, 0.2); playNote(659.25, 0.1, 0.2); playNote(783.99, 0.2, 0.4);
      } else if (type === 'click') {
          osc.type = 'sine'; osc.frequency.setValueAtTime(800, now); gain.gain.setValueAtTime(0.05, now); osc.start(now); osc.stop(now + 0.05);
      }
  } catch (e) { console.error(e); }
};

const AssetDisplay = ({ src, className, style, alt }) => {
    if (!src) {
        return <div className={className} style={{...style, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent'}}>{alt}</div>;
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
    if (lowerText.includes("king") || lowerText.includes("kral") || lowerText.includes("crown")) return <Crown size={40} className="text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.8)]" />;
    if (lowerText.includes("phone") || lowerText.includes("sinyal") || lowerText.includes("call")) return <Smartphone size={40} className="text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.8)]" />;
    if (lowerText.includes("chicken") || lowerText.includes("tavuk")) return <Bird size={40} className="text-orange-400 drop-shadow-[0_0_15px_rgba(251,146,60,0.8)]" />;
    if (lowerText.includes("scared") || lowerText.includes("kork") || lowerText.includes("ghost")) return <Ghost size={40} className="text-gray-300 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />;
    return defaultIcon;
};

// --- CANLI ARAYÜZ (UI) EDİTÖR PANELİ ---
const UIEditorModal = ({ config, onChange, onReset, onClose }) => {
    return (
        <div className="fixed inset-y-0 right-0 w-80 bg-black/95 border-l border-white/20 z-[200] p-6 text-xs flex flex-col shadow-2xl backdrop-blur-xl animate-fadeIn">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                <span className="font-black text-sm uppercase text-purple-400 flex items-center gap-2">
                    <Sliders size={18} /> Canlı UI Editörü
                </span>
                <button onClick={onClose} className="p-1 hover:text-white text-gray-400"><X size={20} /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                <div>
                    <div className="flex justify-between mb-1 text-gray-300"><span>Kart Genişliği (px)</span><b>{config.cardWidth}px</b></div>
                    <input type="range" min="300" max="500" value={config.cardWidth} onChange={e => onChange('cardWidth', Number(e.target.value))} className="w-full accent-purple-500" />
                </div>
                <div>
                    <div className="flex justify-between mb-1 text-gray-300"><span>Kart Yüksekliği (%)</span><b>{config.cardHeight}vh</b></div>
                    <input type="range" min="65" max="95" value={config.cardHeight} onChange={e => onChange('cardHeight', Number(e.target.value))} className="w-full accent-purple-500" />
                </div>
                <div>
                    <div className="flex justify-between mb-1 text-gray-300"><span>Video Alanı (%)</span><b>{config.videoHeightPercent}%</b></div>
                    <input type="range" min="30" max="60" value={config.videoHeightPercent} onChange={e => onChange('videoHeightPercent', Number(e.target.value))} className="w-full accent-purple-500" />
                </div>
                <div>
                    <div className="flex justify-between mb-1 text-gray-300"><span>Başlık Boyutu (px)</span><b>{config.titleSize}px</b></div>
                    <input type="range" min="20" max="48" value={config.titleSize} onChange={e => onChange('titleSize', Number(e.target.value))} className="w-full accent-purple-500" />
                </div>
                <div>
                    <div className="flex justify-between mb-1 text-gray-300"><span>Görev Metni Boyutu (px)</span><b>{config.missionTextSize}px</b></div>
                    <input type="range" min="14" max="28" value={config.missionTextSize} onChange={e => onChange('missionTextSize', Number(e.target.value))} className="w-full accent-purple-500" />
                </div>
                <div>
                    <div className="flex justify-between mb-1 text-gray-300"><span>Alt/Üst Padding</span><b>{config.cardPadding}px</b></div>
                    <input type="range" min="10" max="40" value={config.cardPadding} onChange={e => onChange('cardPadding', Number(e.target.value))} className="w-full accent-purple-500" />
                </div>
                <div>
                    <div className="flex justify-between mb-1 text-gray-300"><span>Buton Kalınlığı (py)</span><b>{config.buttonPaddingY}px</b></div>
                    <input type="range" min="8" max="26" value={config.buttonPaddingY} onChange={e => onChange('buttonPaddingY', Number(e.target.value))} className="w-full accent-purple-500" />
                </div>
            </div>

            <div className="border-t border-white/10 pt-4 space-y-2 mt-auto">
                <button onClick={() => navigator.clipboard.writeText(JSON.stringify(config, null, 2))} className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg transition">
                    Ayarları Kopyala (JSON)
                </button>
                <button onClick={onReset} className="w-full py-2 bg-white/10 hover:bg-white/20 text-gray-300 rounded-lg transition">
                    Varsayılana Sıfırla
                </button>
            </div>
        </div>
    );
};

// --- DİNAMİK KART BİLEŞENİ ---
const CardDisplay = ({ card, type, mode = 'draw', onAction, assets, currentTeamId, lang, uiConfig }) => {
    const cardRef = useRef(null);
    const [mouseState, setMouseState] = useState({ x: 0, y: 0 });
    const [targetState, setTargetState] = useState({ x: 0, y: 0 });

    const isBonus = type === 'bonus';
    const isObstacle = type === 'obstacle';
    const isModerator = type === 'moderator';
    const isFinal = type === 'final';
    const isPlaying = mode === 'play';
    
    const baseKey = `team${currentTeamId}`;
    let characterVideoSrc = assets[`${baseKey}_idle`];
    if (type === 'easy') characterVideoSrc = assets[`${baseKey}_happy`];
    else if (type === 'medium') characterVideoSrc = assets[`${baseKey}_thinking`];
    else if (type === 'hard' || type === 'obstacle' || type === 'final') characterVideoSrc = assets[`${baseKey}_scared`];

    let videoToRender = null;
    if (isModerator) {
        videoToRender = card.customVideo || assets.moderator;
    } else if (isBonus && assets[`bonus_${card.id}`]) {
        videoToRender = assets[`bonus_${card.id}`];
    } else {
        videoToRender = characterVideoSrc;
    }

    let titleText = (isBonus || isModerator) ? (getLocalizedText(card.name, lang) || "BONUS") : (getLocalizedText(card.title, lang) || "GÖREV");
    let missionText = (isBonus || isModerator) ? getLocalizedText(card.desc, lang) : getLocalizedText(card.mission, lang);
    let oppCardLabel = isModerator ? "MODERATÖR REJİSİ" : (getLocalizedText(UI[lang]?.oppCard, lang) || "FIRSAT KARTI");
    let flavorText = (isBonus || isModerator)
        ? `${oppCardLabel} ✦ ${getLocalizedText(card.benefit, lang)}` 
        : (getLocalizedText(getRandomCardText(card, currentTeamId, lang), lang) || getLocalizedText(card.desc, lang));

    let icon = isModerator ? <Clapperboard size={32} className="text-yellow-400 animate-pulse"/> : (isBonus ? <Sparkles size={32} className="text-[#D4AF37]"/> : getCardIcon(missionText + " " + titleText, <Drama size={32} className="text-[#D4AF37]"/>));
    let bgStyle = isModerator ? "bg-gradient-to-b from-emerald-900 to-black" : (isBonus ? (isPlaying ? "bg-gradient-to-b from-yellow-600 to-red-900" : "bg-gradient-to-b from-indigo-600 to-blue-900") : "bg-neutral-900");
    let accentColor = isModerator ? "text-emerald-200" : (isBonus ? (isPlaying ? "text-yellow-200" : "text-indigo-200") : "text-white");
    let glowColor = isModerator ? "rgba(16, 185, 129, 0.6)" : (isBonus ? (isPlaying ? "rgba(255, 200, 0, 0.8)" : "rgba(99, 102, 241, 0.5)") : "rgba(255,255,255,0.1)");

    if (isObstacle) {
        bgStyle = "bg-gradient-to-b from-red-600 to-rose-900";
        accentColor = "text-red-200";
        glowColor = "rgba(225, 29, 72, 0.5)";
        flavorText = card.type === 'marked' ? getLocalizedText(UI[lang].applySelf, lang) : getLocalizedText(UI[lang].giveRival, lang);
        icon = <Skull size={32} className="text-red-500 animate-bounce"/>;
    } else if (!isBonus && !isModerator) {
        if(type === 'easy') { bgStyle = "bg-gradient-to-b from-emerald-500 to-teal-800"; accentColor = "text-emerald-100"; titleText = getLocalizedText(UI[lang].easyLevel, lang); }
        else if(type === 'medium') { bgStyle = "bg-gradient-to-b from-amber-500 to-orange-800"; accentColor = "text-amber-100"; titleText = getLocalizedText(UI[lang].medLevel, lang); }
        else if(type === 'hard') { bgStyle = "bg-gradient-to-b from-rose-500 to-red-800"; accentColor = "text-rose-100"; titleText = getLocalizedText(UI[lang].hardLevel, lang); }
        else if(type === 'final') { bgStyle = "bg-gradient-to-b from-yellow-600 via-orange-600 to-red-900"; accentColor = "text-yellow-100"; }
    }

    const rotateX = mouseState.y * -4;
    const rotateY = mouseState.x * 4;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
            <div 
                ref={cardRef}
                onMouseMove={(e) => {
                    const rect = cardRef.current.getBoundingClientRect();
                    setTargetState({ x: ((e.clientX - rect.left) / rect.width) * 2 - 1, y: ((e.clientY - rect.top) / rect.height) * 2 - 1 });
                }}
                onMouseLeave={() => setTargetState({ x: 0, y: 0 })}
                className="relative rounded-[2.5rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] flex flex-col transition-transform duration-[300ms] ease-out"
                style={{ 
                    width: `${uiConfig.cardWidth}px`,
                    maxWidth: '92vw',
                    height: `${uiConfig.cardHeight}vh`,
                    transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`, 
                    boxShadow: `0 20px 50px -10px ${glowColor}` 
                }}
            >
                <div className={`absolute inset-0 ${bgStyle} z-0`}></div>
                <div className="absolute inset-0 pointer-events-none z-20" style={{ background: `radial-gradient(circle 300px at 50% 50%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.95) 100%)`, mixBlendMode: 'multiply' }}></div>

                <div className="absolute inset-0 z-10 flex flex-col justify-start p-0">
                    
                    {/* VIDEO CONTAINER */}
                    <div 
                        className={`relative w-full shrink-0 z-0 overflow-hidden flex items-center justify-center bg-black`}
                        style={{ height: `${uiConfig.videoHeightPercent}%` }}
                    >
                         {videoToRender && (
                            <AssetDisplay 
                                src={videoToRender} 
                                className={`w-full h-full object-cover object-top ${(isBonus || isModerator) ? 'mix-blend-screen' : ''}`} 
                                alt="Character" 
                            />
                        )}
                        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
                    </div>

                    {/* METİN & BUTON ALANI */}
                    <div 
                        className="relative z-30 flex-1 flex flex-col items-center justify-between text-center overflow-y-auto no-scrollbar -mt-6"
                        style={{ padding: `${uiConfig.cardPadding}px` }}
                    >
                         <div className="flex flex-col items-center w-full">
                             <div className="p-3 rounded-full bg-black/80 border border-[#D4AF37]/50 mb-2 shadow-xl backdrop-blur-md inline-flex justify-center">
                                 {icon}
                             </div>
                             
                             <h1 
                                className="text-[#D4AF37] font-black italic mb-2 leading-none uppercase drop-shadow-md"
                                style={{ fontSize: `${uiConfig.titleSize}px` }}
                             >
                                 {String(titleText)}
                             </h1>
                             
                             <div className="w-full mb-3 bg-black/60 border border-[#D4AF37]/30 p-4 rounded-xl shadow-inner min-h-[4.5rem] flex items-center justify-center">
                                <p 
                                    className={`font-bold leading-tight ${accentColor}`}
                                    style={{ fontSize: `${uiConfig.missionTextSize}px` }}
                                >
                                    "{String(missionText)}"
                                </p>
                             </div>
                             
                             <p className={`italic mb-3 px-2 leading-snug text-xs md:text-sm ${isBonus ? 'text-yellow-500 font-bold uppercase tracking-widest' : 'text-gray-300'}`}>
                                {String(flavorText)}
                             </p>
                         </div>
                         
                         <button 
                            onClick={onAction} 
                            className="w-full rounded-2xl font-black text-lg tracking-[0.1em] uppercase shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all transform hover:scale-[1.02] shrink-0 bg-white text-black hover:bg-gray-200"
                            style={{ padding: `${uiConfig.buttonPaddingY}px 0` }}
                         >
                            {isPlaying ? (getLocalizedText(UI[lang]?.unleashPower, lang) || "GÜCÜ KULLAN") : (isBonus ? (getLocalizedText(UI[lang]?.accept, lang) || "KABUL ET") : (getLocalizedText(UI[lang]?.stageYours, lang) || "SAHNE SENİN"))}
                         </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- ANA UYGULAMA ---
export default function DogaclaVisualsFinal() {
  const [lang, setLang] = useState('tr');
  const [teams, setTeams] = useState(() => JSON.parse(localStorage.getItem('dogacla_teams_v90')) || INITIAL_TEAMS);
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
  const [logs, setLogs] = useState(["Doğaçla 9.8 Canlı Sahne!"]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // Canlı UI Editör State
  const [showEditor, setShowEditor] = useState(false);
  const [uiConfig, setUiConfig] = useState(() => {
      const saved = localStorage.getItem('dogacla_ui_config');
      return saved ? JSON.parse(saved) : DEFAULT_UI_CONFIG;
  });

  const handleConfigChange = (key, value) => {
      const updated = { ...uiConfig, [key]: value };
      setUiConfig(updated);
      localStorage.setItem('dogacla_ui_config', JSON.stringify(updated));
  };

  const handleResetConfig = () => {
      setUiConfig(DEFAULT_UI_CONFIG);
      localStorage.setItem('dogacla_ui_config', JSON.stringify(DEFAULT_UI_CONFIG));
  };

  const currentTeam = teams[currentTurn];
  const isGoldenMic = hypeMeter >= 100; 

  const testModeratorCard = () => {
      setCardType('moderator');
      setActiveCard(CARDS_DATA.MODERATOR[0]);
      setGameState('CARD');
  };

  const nextTurn = () => { 
      setGameState('ROLL'); 
      setDiceValue(1); 
      setCurrentTurn(prev => (prev + 1) % 4); 
      setCharacterMood('idle'); 
  };

  const handleCardAction = () => {
      playSynthSound('click', soundEnabled);
      setActiveCard(null);
      nextTurn();
  };

  return (
    <div className="h-screen font-sans flex flex-col overflow-hidden text-gray-100 bg-[#0a0a0a] relative">
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      
      {/* ÜST HEADER */}
      <header className="h-20 bg-black/60 border-b border-white/10 flex items-center justify-between px-6 z-40 backdrop-blur-md relative">
          <div className="flex items-center gap-4">
              <img src={assets.logo} alt="Logo" className="h-10 w-auto object-contain"/>
              <h1 className="font-black text-2xl tracking-[0.2em] hidden md:block">DOĞAÇLA 9.8</h1>
          </div>
          
          <div className="flex items-center gap-3">
              {/* MODERATÖR TEST BUTONU */}
              <button 
                  onClick={testModeratorCard} 
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition"
              >
                  <Clapperboard size={14} /> Moderatör Kartı Test
              </button>

              {/* CANLI UI EDİTÖRÜ AÇMA BUTONU */}
              <button 
                  onClick={() => setShowEditor(!showEditor)} 
                  className="p-2 bg-purple-600/30 border border-purple-500 hover:bg-purple-600 text-purple-200 rounded-lg transition"
                  title="Arayüz Editörü"
              >
                  <Palette size={20} />
              </button>

              <button onClick={() => setSoundEnabled(!soundEnabled)} className="p-2 bg-white/10 rounded-lg">
                  {soundEnabled ? <Volume2 size={20}/> : <VolumeX size={20}/>}
              </button>
              <button onClick={() => setLang(l => l === 'tr' ? 'en' : 'tr')} className="p-2 bg-white/10 rounded-lg font-bold">
                  {lang.toUpperCase()}
              </button>
          </div>
      </header>
      
      {/* ORTA OYUN ALANI */}
      <div className="flex-1 flex items-center justify-center relative p-6">
          <div className="text-center space-y-4">
              <h2 className="text-4xl font-black text-white">DOĞAÇLA SAHNESİ</h2>
              <p className="text-gray-400 text-sm">Moderatör videosu ve Canlı UI Editörü hazır.</p>
              <div className="flex justify-center gap-4">
                  <button onClick={testModeratorCard} className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-black rounded-xl hover:scale-105 transition shadow-lg">
                      Moderatör Kartını Göster
                  </button>
                  <button onClick={() => { setCardType('bonus'); setActiveCard(CARDS_DATA.BONUS[1]); setGameState('CARD'); }} className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:scale-105 transition">
                      Bonus (Kubi) Test
                  </button>
              </div>
          </div>
      </div>

      {/* MODAL KART GÖRÜNÜMÜ */}
      {gameState === 'CARD' && activeCard && (
          <CardDisplay 
              card={activeCard} 
              type={cardType} 
              mode="draw" 
              onAction={handleCardAction} 
              assets={assets} 
              currentTeamId={currentTeam.id} 
              lang={lang}
              uiConfig={uiConfig}
          />
      )}

      {/* CANLI UI EDİTÖR PANELİ */}
      {showEditor && (
          <UIEditorModal 
              config={uiConfig} 
              onChange={handleConfigChange} 
              onReset={handleResetConfig} 
              onClose={() => setShowEditor(false)} 
          />
      )}
    </div>
  );
}
