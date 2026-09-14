import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, Animated, Dimensions, SafeAreaView, Easing, TextInput } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Dices, Trophy, Star, ShieldAlert, Sparkles, Skull, AlertTriangle, X, Volume2, VolumeX, RefreshCw, History, Bot, Zap, Crown, Smartphone, Bird, Thermometer, Apple, HelpCircle, Music4, List, Plus, Minus, Clapperboard, Lightbulb, User, Users, Home, Copy, SkipForward, BookOpen, Pause, Play as PlayIcon, StopCircle, WifiOff } from 'lucide-react-native';

import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, updateDoc, onSnapshot } from 'firebase/firestore';

// --- FIREBASE SETUP ---
const firebaseConfig = {
    apiKey: "AIzaSy" + "BlQCUn6Uv1HXk1lrPQx92-vZtEA_KRehQ",
    authDomain: "dogacla-ca144.firebaseapp.com",
    projectId: "dogacla-ca144",
    storageBucket: "dogacla-ca144.firebasestorage.app",
    messagingSenderId: "29430014172",
    appId: "1:29430014172:web:15b8a5ef2f3df11e5b1419"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = "dogacla-ca144";

const { width, height } = Dimensions.get('window');

// React Native'de Web Audio API çalışmaz. Sesleri ileride expo-av ile mp3 olarak ekleyebilirsin.
const playSynthSound = (type, enabled) => { if (!enabled) return; console.log("Sound Triggered:", type); };

const getLocalizedText = (obj, lang) => {
    if (!obj) return "";
    if (typeof obj === 'string') return obj;
    return obj[lang] || obj.tr || obj.en || "";
};

const UI = {
    tr: {
        start: "BAŞLA", rollDice: "ZAR AT", drawingLots: "KURA...", rollingDice: "ZAR...",
        onStageNow: "SAHNEDE", silence: "Sessizlik", goldenMic: "ALTIN MİKROFON",
        time: "Süre", finishPerf: "Bitir", juryScoring: "JÜRİ OYLAMASI",
        role: "+2 ROL", obstacleBtn: "+2 ENGEL", fail: "-2 HATA", confirmScore: "ONAYLA",
        champion: "ŞAMPİYON!", playAgain: "YENİDEN OYNA"
    }
};

const TEAM_INFO = {
    0: { name: 'İBİŞ', desc: { tr: 'Kurnaz & Esprili' }, style: { tr: 'Mizahi' } },
    1: { name: 'KARAGÖZ', desc: { tr: 'Fiziksel & Dobra' }, style: { tr: 'Fiziksel' } },
    2: { name: 'SHAKESPEARE', desc: { tr: 'Dramatik & Şiirsel' }, style: { tr: 'Trajik' } },
    3: { name: 'ARİSTOFANES', desc: { tr: 'Hicivli & Zeki' }, style: { tr: 'İronik' } }
};

const INITIAL_TEAMS = [
  { id: 0, color: 'bg-orange-500', border: 'border-orange-500', text: 'text-orange-500', icon: '🤡', score: 0, pos: 0, bonuses: [], heldObstacles: [], activeObstacles: [] },
  { id: 1, color: 'bg-red-600', border: 'border-red-600', text: 'text-red-600', icon: '👺', score: 0, pos: 0, bonuses: [], heldObstacles: [], activeObstacles: [] },
  { id: 2, color: 'bg-purple-600', border: 'border-purple-600', text: 'text-purple-600', icon: '✒️', score: 0, pos: 0, bonuses: [], heldObstacles: [], activeObstacles: [] },
  { id: 3, color: 'bg-blue-600', border: 'border-blue-600', text: 'text-blue-600', icon: '🏛️', score: 0, pos: 0, bonuses: [], heldObstacles: [], activeObstacles: [] },
];

const GAME_ASSETS = {
    bg: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/arkplan.png",
    logo: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/dogacla_logsu.png",
    team0_idle: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/ibis_orta.mp4", 
    team0_happy: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/ibis_kolay.mp4",
    team0_scared: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/ibis_zor.mp4",
    team1_idle: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/karagoz_orta.mp4",
    team1_happy: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/karagoz_kolay.mp4",
    team1_scared: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/karagoz_zor.mp4",
    team2_idle: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/shakespeare_orta.mp4",
    team2_happy: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/shakespeare_kolay.mp4",
    team2_scared: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/shakespeare_zor.mp4",
    team3_idle: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/artisto_bekleme.mp4",
    team3_happy: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/aristo_kolay.mp4",
    team3_scared: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/artisto_zor.mp4",
    bonus_kubo: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/Kubo_panik.mp4",
    moderator: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/Moderator.mp4",
};

// BURAYA ESKİ KODDAKİ TÜM CARDS DİZİSİNİ KOPYALAYABİLİRSİN. KISA TUTULDU.
const CARDS = {
  EASY: [ 
    { title: { tr: "BOZUK ASANSÖR" }, mission: { tr: "Dar bir alanda sıkıştın. Bedeninle paniği göster." }, hint: { tr: "Nefes alışını hızlandır, klostrofobiyi hissettir." }, quotes: { 0: {tr: "Aman efendim, asansör bozuldu! İmdat!"} } }
  ],
  MEDIUM: [ 
    { title: { tr: "UNUTKANLIK" }, mission: { tr: "Tam o an ne söyleyeceğini unuttun. Kıvırmaya çalış." }, hint: { tr: "Gözlerini tavana dik, 'Eee, hımm' diyerek düşün." }, quotes: { 0: {tr: "Eee... Efendim, dilimin ucundaydı!"} } }
  ],
  HARD: [ 
    { title: { tr: "SAHTE KRAL" }, mission: { tr: "Her şeyin kontrol altında olduğu yalanını söyleyen paniklemiş lider." }, hint: { tr: "Titreyerek gülümse, terini sil." }, quotes: { 0: {tr: "Ben kralım efendim! T-Tabii ki korkmuyorum!"} } }
  ],
  FINAL: [ 
    { title: { tr: "VEDA KONUŞMASI" }, mission: { tr: "Oyun bitiyor. Dramatik veda konuşması yap." }, hint: { tr: "Ağlıyormuş gibi yap." }, quotes: { 0: {tr: "Sürçülisan ettiysek affola!"} } } 
  ],
  OBSTACLE: [ 
    { id: 'o1', text: { tr: "Sadece TEK HECELİ kelimeler kurarak oyna!" }, ruleDesc: { tr: "Rakip sadece 'Evet, Gel, Bak' kullanabilir." } }
  ],
  BONUS: [ 
    { id: 'kubo', name: { tr: 'Kubo' }, quote: { tr: 'Baştan alıyoruz ama süreyi uzatıyorum.' }, ruleDesc: { tr: '+30 saniye ekler.' }, benefit: { tr: '+30 SANİYE' }, effect: 'time' }
  ],
  MODERATOR: [
    { id: 'mod_start', name: { tr: 'MODERATÖR' }, title: { tr: 'REJİSÖR MÜDAHALESİ' }, desc: { tr: 'Yönetmen yetkileri!' }, benefit: { tr: 'SAHNE KONTROLÜ' } }
  ]
};

const BOARD_MAP = Array(36).fill(null).map((_, i) => {
  if (i === 0) return { type: 'start' };
  if (i === 35) return { type: 'final' };
  if (i % 5 === 0) return { type: 'bonus' }; 
  if (i % 6 === 0) return { type: 'obstacle' };
  if (i < 10) return { type: 'easy' };
  if (i < 20) return { type: 'medium' };
  return { type: 'hard' };
});

// NATIVE VIDEO VE IMAGE BİLEŞENİ
const AssetDisplay = ({ src, style, className }) => {
    if (!src) return <View style={style} />;
    const isVideo = typeof src === 'string' && src.endsWith('.mp4');
    
    if (isVideo) {
        return (
            <Video 
                source={{ uri: src }} 
                resizeMode={ResizeMode.COVER} 
                shouldPlay 
                isLooping 
                isMuted 
                style={[{width: '100%', height: '100%'}, style]} 
            />
        );
    }
    return <Image source={{ uri: src }} style={[{width: '100%', height: '100%'}, style]} />;
};

// NATIVE KART MODALI (ANIMATED)
const CardDisplay = ({ card, type, onAction, onModeratorAction, currentTeamId, lang, isMyTurn, isHost, isTimerPaused }) => {
    const scaleAnim = useRef(new Animated.Value(0.5)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.spring(scaleAnim, { toValue: 1, friction: 5, useNativeDriver: true }),
            Animated.timing(opacityAnim, { toValue: 1, duration: 400, useNativeDriver: true })
        ]).start();
    }, []);

    const triggerAction = () => {
        Animated.timing(opacityAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => onAction());
    };

    if (!card) return null;
    const isBonus = type === 'bonus'; 
    const isObstacle = type === 'obstacle'; 
    const isModerator = type === 'moderator';

    let videoSrc = GAME_ASSETS[`team${currentTeamId}_happy`];
    if (isModerator) videoSrc = GAME_ASSETS.moderator;
    else if (isBonus) videoSrc = GAME_ASSETS.bonus_kubo;
    else if (isObstacle) videoSrc = GAME_ASSETS[`team${currentTeamId}_scared`];

    return (
        <View className="absolute top-0 left-0 right-0 bottom-0 bg-black/90 justify-center items-center z-50 p-4">
            <Animated.View style={{ transform: [{ scale: scaleAnim }], opacity: opacityAnim }} className="w-full max-w-sm bg-neutral-900 rounded-3xl overflow-hidden border-2 border-yellow-500 shadow-lg">
                <View className="h-64 w-full bg-black">
                    <AssetDisplay src={videoSrc} />
                </View>
                <View className="p-6 items-center">
                    <Text className="text-2xl font-bold text-yellow-400 mb-2">{isModerator ? "MODERATÖR" : (card.title?.tr || "GÖREV")}</Text>
                    <Text className="text-white text-center mb-6">{isModerator ? card.desc?.tr : card.mission?.tr}</Text>
                    
                    {isModerator && isHost ? (
                         <View className="w-full gap-2">
                             <TouchableOpacity onPress={() => onModeratorAction('toggle_time')} className="bg-yellow-500 py-3 rounded-xl items-center">
                                 <Text className="font-bold text-black">{isTimerPaused ? "SÜREYİ BAŞLAT" : "SÜREYİ DURDUR"}</Text>
                             </TouchableOpacity>
                             <TouchableOpacity onPress={() => onModeratorAction('rule_violation')} className="bg-red-600 py-3 rounded-xl items-center">
                                 <Text className="font-bold text-white">İHLAL (-2 Puan) KES</Text>
                             </TouchableOpacity>
                             <TouchableOpacity onPress={triggerAction} className="py-2 items-center">
                                 <Text className="text-gray-400">Kapat</Text>
                             </TouchableOpacity>
                         </View>
                    ) : (
                         <TouchableOpacity onPress={triggerAction} className="bg-white w-full py-4 rounded-xl items-center">
                            <Text className="font-bold text-black uppercase">{isMyTurn ? "KABUL ET / DEVAM" : "BEKLENİYOR"}</Text>
                         </TouchableOpacity>
                    )}
                </View>
            </Animated.View>
        </View>
    );
};

export default function App() {
  const [lang, setLang] = useState('tr');
  const [user, setUser] = useState(null);
  const [roomId, setRoomId] = useState('');
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [isSinglePlayer, setIsSinglePlayer] = useState(false);
  
  const [gameState, setGameState] = useState('LOBBY'); 
  const [teams, setTeams] = useState(INITIAL_TEAMS);
  const [players, setPlayers] = useState({}); 
  const [hostUid, setHostUid] = useState(null); 
  const [moderatorUid, setModeratorUid] = useState(null); 
  const [currentTurn, setCurrentTurn] = useState(0);
  const [activeCard, setActiveCard] = useState(null);
  const [cardType, setCardType] = useState(null);
  const [performanceTimer, setPerformanceTimer] = useState(0);
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  
  useEffect(() => {
      signInAnonymously(auth).catch(console.error);
      const unsub = onAuthStateChanged(auth, setUser);
      return unsub;
  }, []);

  const syncGame = async (updates) => {
      Object.keys(updates).forEach(k => {
          if(k==='gameState') setGameState(updates[k]);
          if(k==='teams') setTeams(updates[k]);
          if(k==='players') setPlayers(updates[k]);
          if(k==='currentTurn') setCurrentTurn(updates[k]);
          if(k==='activeCard') setActiveCard(updates[k]);
          if(k==='cardType') setCardType(updates[k]);
          if(k==='isTimerPaused') setIsTimerPaused(updates[k]);
          if(k==='moderatorUid') setModeratorUid(updates[k]);
          if(k==='hostUid') setHostUid(updates[k]);
      });
      if (!isSinglePlayer && roomId) {
          updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'rooms', roomId), updates).catch(console.error);
      }
  };

  useEffect(() => {
      if (!roomId || isSinglePlayer) return;
      return onSnapshot(doc(db, 'artifacts', appId, 'public', 'data', 'rooms', roomId), (snap) => {
          if (snap.exists()) {
              const d = snap.data();
              if(d.gameState) setGameState(d.gameState);
              if(d.teams) setTeams(d.teams);
              if(d.players) setPlayers(d.players);
              if(d.currentTurn !== undefined) setCurrentTurn(d.currentTurn);
              if(d.activeCard !== undefined) setActiveCard(d.activeCard);
              if(d.cardType) setCardType(d.cardType);
              if(d.isTimerPaused !== undefined) setIsTimerPaused(d.isTimerPaused);
              if(d.moderatorUid !== undefined) setModeratorUid(d.moderatorUid);
              if(d.hostUid !== undefined) setHostUid(d.hostUid);
          }
      });
  }, [roomId, isSinglePlayer]);

  const createRoom = async () => {
      const code = Math.random().toString(36).substring(2, 6).toUpperCase();
      await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'rooms', code), { gameState: 'INTRO', teams: INITIAL_TEAMS, players: {}, hostUid: user.uid, currentTurn: 0 });
      setIsSinglePlayer(false); setRoomId(code);
  };

  const currentTeam = teams[currentTurn];
  const isHost = hostUid === user?.uid;
  const isDedicatedModerator = moderatorUid === user?.uid;
  const isMyTurn = isSinglePlayer || players[user?.uid] === currentTeam?.id;

  const joinTeam = () => syncGame({ players: { ...players, [user.uid]: 0 } }); // Hızlı test için Takım 0
  const becomeModerator = () => syncGame({ moderatorUid: user.uid, hostUid: user.uid });
  const startGame = () => syncGame({ gameState: 'ROLL' });

  const handleModeratorAction = (action) => {
      if (action === 'toggle_time') syncGame({ isTimerPaused: !isTimerPaused });
      if (action === 'rule_violation') syncGame({ gameState: 'VOTE', activeCard: null, isTimerPaused: false });
  };

  const drawCard = () => {
      const card = CARDS.EASY[0];
      syncGame({ cardType: 'easy', activeCard: card, gameState: 'CARD' });
  };

  if (gameState === 'LOBBY') {
      return (
          <SafeAreaView className="flex-1 bg-neutral-950 justify-center items-center p-4">
              <Text className="text-4xl font-black text-yellow-500 mb-8">DOĞAÇLA (RN)</Text>
              {!user ? <Text className="text-white">Bağlanıyor...</Text> : (
                  <View className="w-full gap-4">
                      <TouchableOpacity onPress={() => {setIsSinglePlayer(true); setGameState('INTRO');}} className="bg-purple-600 p-4 rounded-xl items-center"><Text className="text-white font-bold">TEK OYUNCULU</Text></TouchableOpacity>
                      <TouchableOpacity onPress={createRoom} className="bg-green-600 p-4 rounded-xl items-center"><Text className="text-white font-bold">ODA KUR</Text></TouchableOpacity>
                      <TextInput value={joinCodeInput} onChangeText={setJoinCodeInput} placeholder="ODA KODU" className="bg-gray-800 text-white p-4 rounded-xl text-center" />
                      <TouchableOpacity onPress={() => {setRoomId(joinCodeInput.toUpperCase()); setIsSinglePlayer(false);}} className="bg-blue-600 p-4 rounded-xl items-center"><Text className="text-white font-bold">KATIL</Text></TouchableOpacity>
                  </View>
              )}
          </SafeAreaView>
      );
  }

  if (gameState === 'INTRO') {
      return (
          <SafeAreaView className="flex-1 bg-neutral-950 items-center justify-center p-4">
              <Text className="text-3xl font-bold text-white mb-8">ODA: {roomId || 'TEKLİ'}</Text>
              {players[user?.uid] === undefined && moderatorUid !== user?.uid ? (
                  <View className="w-full gap-4">
                      <TouchableOpacity onPress={joinTeam} className="bg-blue-600 p-4 rounded-xl items-center"><Text className="text-white font-bold">TAKIMA KATIL</Text></TouchableOpacity>
                      <TouchableOpacity onPress={becomeModerator} className="bg-gray-800 border border-emerald-500 p-4 rounded-xl items-center"><Text className="text-emerald-400 font-bold">MODERATÖR OL</Text></TouchableOpacity>
                  </View>
              ) : (
                  <TouchableOpacity onPress={startGame} className="bg-white p-5 rounded-full w-full items-center"><Text className="text-black font-black text-xl">OYUNU BAŞLAT</Text></TouchableOpacity>
              )}
          </SafeAreaView>
      );
  }

  return (
      <SafeAreaView className="flex-1 bg-neutral-950">
          <View className="flex-row justify-between items-center p-4 bg-gray-900 border-b border-gray-800">
              <Text className="text-yellow-500 font-bold">DOĞAÇLA</Text>
              {isHost && <TouchableOpacity onPress={() => syncGame({cardType: 'moderator', activeCard: CARDS.MODERATOR[0], gameState: 'CARD'})}><Text className="text-emerald-400">REJİ</Text></TouchableOpacity>}
          </View>
          
          <ScrollView className="flex-1 p-4">
              <Text className="text-white text-center mb-4">Sıra: {TEAM_INFO[currentTeam.id].name}</Text>
              {gameState === 'ROLL' && isMyTurn && (
                  <TouchableOpacity onPress={drawCard} className="bg-blue-600 p-6 rounded-2xl items-center"><Text className="text-white font-black text-xl">KART ÇEK</Text></TouchableOpacity>
              )}
              {gameState === 'ROLL' && !isMyTurn && <Text className="text-gray-500 text-center">Zar atılması bekleniyor...</Text>}
          </ScrollView>

          {gameState === 'CARD' && activeCard && (
              <CardDisplay card={activeCard} type={cardType} onAction={() => syncGame({gameState: 'ROLL', activeCard: null})} onModeratorAction={handleModeratorAction} currentTeamId={currentTeam.id} lang={lang} isMyTurn={isMyTurn} isHost={isHost} isTimerPaused={isTimerPaused} />
          )}
      </SafeAreaView>
  );
}
