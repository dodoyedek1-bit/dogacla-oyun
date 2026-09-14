import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, SafeAreaView, Dimensions, ActivityIndicator } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Dices, Trophy, Star, ShieldAlert, Sparkles, Skull, Crown, Smartphone, Bird, Thermometer, Clapperboard, Users, User, Home } from 'lucide-react-native';

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

const { width } = Dimensions.get('window');

const GAME_ASSETS = {
    bg: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/arkplan.png",
    logo: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/dogacla_logsu.png",
    team0_idle: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/ibis_orta.mp4", 
    team1_idle: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/karagoz_orta.mp4",
    team2_idle: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/shakespeare_orta.mp4",
    team3_idle: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/artisto_bekleme.mp4",
    moderator: "https://raw.githubusercontent.com/dodoyedek1-bit/Dogacla-Oyunu/main/Moderator.mp4",
};

const TEAM_INFO = {
    0: { name: 'İBİŞ', desc: 'Kurnaz & Esprili', color: 'bg-orange-500' },
    1: { name: 'KARAGÖZ', desc: 'Fiziksel & Dobra', color: 'bg-red-600' },
    2: { name: 'SHAKESPEARE', desc: 'Dramatik & Şiirsel', color: 'bg-purple-600' },
    3: { name: 'ARİSTOFANES', desc: 'Hicivli & Zeki', color: 'bg-blue-600' }
};

const INITIAL_TEAMS = [
  { id: 0, score: 0, pos: 0 }, { id: 1, score: 0, pos: 0 }, { id: 2, score: 0, pos: 0 }, { id: 3, score: 0, pos: 0 }
];

// NATIVE MEDYA OYNATICI (Sıfır Kasma)
const AssetDisplay = ({ src, style }) => {
    if (!src) return <View style={style} className="bg-gray-800" />;
    const isVideo = src.endsWith('.mp4');
    
    if (isVideo) {
        return (
            <Video 
                source={{ uri: src }} 
                resizeMode={ResizeMode.COVER} 
                shouldPlay 
                isLooping 
                isMuted 
                style={style} 
            />
        );
    }
    return <Image source={{ uri: src }} style={style} />;
};

export default function App() {
  const [user, setUser] = useState(null);
  const [roomId, setRoomId] = useState('');
  const [joinCodeInput, setJoinCodeInput] = useState('');
  
  const [gameState, setGameState] = useState('LOBBY'); 
  const [teams, setTeams] = useState(INITIAL_TEAMS);
  const [players, setPlayers] = useState({}); 
  const [readyPlayers, setReadyPlayers] = useState({}); 
  const [hostUid, setHostUid] = useState(null); 
  const [moderatorUid, setModeratorUid] = useState(null); 
  const [currentTurn, setCurrentTurn] = useState(0);

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
          if(k==='readyPlayers') setReadyPlayers(updates[k]);
          if(k==='moderatorUid') setModeratorUid(updates[k]);
          if(k==='hostUid') setHostUid(updates[k]);
          if(k==='currentTurn') setCurrentTurn(updates[k]);
      });
      if (roomId && db) {
          updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'rooms', roomId), updates).catch(console.error);
      }
  };

  useEffect(() => {
      if (!roomId) return;
      return onSnapshot(doc(db, 'artifacts', appId, 'public', 'data', 'rooms', roomId), (snap) => {
          if (snap.exists()) {
              const d = snap.data();
              if(d.gameState) setGameState(d.gameState);
              if(d.teams) setTeams(d.teams);
              if(d.players) setPlayers(d.players);
              if(d.readyPlayers) setReadyPlayers(d.readyPlayers);
              if(d.moderatorUid !== undefined) setModeratorUid(d.moderatorUid);
              if(d.hostUid !== undefined) setHostUid(d.hostUid);
              if(d.currentTurn !== undefined) setCurrentTurn(d.currentTurn);
          }
      });
  }, [roomId]);

  const createRoom = async () => {
      const code = Math.random().toString(36).substring(2, 6).toUpperCase();
      await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'rooms', code), { gameState: 'INTRO', teams: INITIAL_TEAMS, players: {}, readyPlayers: {}, hostUid: user.uid, moderatorUid: null, currentTurn: 0 });
      setRoomId(code);
  };

  const joinRoom = async (code) => {
      const docSnap = await getDoc(doc(db, 'artifacts', appId, 'public', 'data', 'rooms', code));
      if (docSnap.exists()) setRoomId(code);
  };

  const currentTeam = teams[currentTurn];
  const isHost = hostUid === user?.uid;
  const isDedicatedModerator = moderatorUid === user?.uid;

  // MODERATÖR MANTIĞI DÜZELTİLMESİ
  // Aktif oyuncu sayısını buluyoruz (Moderatör oyuncu listesine dahil değilse sorun yok)
  const activePlayerCount = Object.keys(players).length;
  const readyCount = Object.keys(readyPlayers).length;
  // Herkesin hazır olma durumu: En az 1 oyuncu olmalı ve hazır sayısı oyuncu sayısına eşit olmalı.
  const isEveryoneReady = activePlayerCount > 0 && readyCount === activePlayerCount;
  const amIReady = readyPlayers[user?.uid];

  const joinTeamWithDice = () => {
      // Şimdilik rastgele takıma atıyoruz
      const randomTeamId = Math.floor(Math.random() * 4);
      syncGame({ players: { ...players, [user.uid]: randomTeamId } });
  };

  const becomeModerator = () => {
      syncGame({ moderatorUid: user.uid, hostUid: user.uid });
  };

  const resetGame = () => {
      syncGame({ gameState: 'LOBBY', players: {}, readyPlayers: {}, hostUid: null, moderatorUid: null });
      setRoomId('');
  };

  if (!user) {
      return (
          <SafeAreaView className="flex-1 bg-neutral-950 justify-center items-center">
              <ActivityIndicator size="large" color="#eab308" />
              <Text className="text-yellow-500 font-bold mt-4">Sunucuya Bağlanıyor...</Text>
          </SafeAreaView>
      );
  }

  if (gameState === 'LOBBY') {
      return (
          <SafeAreaView className="flex-1 bg-neutral-950 items-center justify-center p-6">
              <Text className="text-5xl font-black text-yellow-500 mb-2">DOĞAÇLA</Text>
              <Text className="text-gray-400 tracking-widest mb-12 uppercase text-xs">Mobile Native</Text>
              
              <View className="w-full gap-4 max-w-sm">
                  <TouchableOpacity onPress={createRoom} className="bg-emerald-600 p-5 rounded-2xl items-center shadow-lg">
                      <Text className="text-white font-black text-xl tracking-widest">ODA KUR</Text>
                  </TouchableOpacity>
                  
                  <View className="flex-row items-center my-2">
                      <View className="flex-1 h-px bg-gray-800" />
                      <Text className="text-gray-500 px-4 font-bold">YADA</Text>
                      <View className="flex-1 h-px bg-gray-800" />
                  </View>

                  <TextInput 
                      value={joinCodeInput} 
                      onChangeText={setJoinCodeInput} 
                      placeholder="ODA KODU" 
                      placeholderTextColor="#6b7280"
                      maxLength={4}
                      autoCapitalize="characters"
                      className="bg-gray-900 border-2 border-gray-700 text-white p-5 rounded-2xl text-center font-black text-2xl uppercase" 
                  />
                  <TouchableOpacity onPress={() => joinRoom(joinCodeInput)} disabled={joinCodeInput.length !== 4} className={`p-5 rounded-2xl items-center ${joinCodeInput.length === 4 ? 'bg-blue-600' : 'bg-gray-800'}`}>
                      <Text className="text-white font-black text-xl tracking-widest">KATIL</Text>
                  </TouchableOpacity>
              </View>
          </SafeAreaView>
      );
  }

  if (gameState === 'INTRO') {
      return (
          <SafeAreaView className="flex-1 bg-neutral-950 p-4">
              <ScrollView contentContainerStyle={{flexGrow: 1, justifyContent: 'center', alignItems: 'center'}}>
                  
                  <View className="bg-gray-900 border-2 border-yellow-500 p-5 rounded-3xl items-center w-full max-w-sm mb-6 shadow-lg">
                      <Text className="text-gray-400 text-xs tracking-widest font-bold mb-1">DAVET KODUNUZ</Text>
                      <Text className="text-5xl font-black text-white">{roomId}</Text>
                  </View>

                  <View className="w-full max-w-sm flex-row flex-wrap justify-center gap-2 mb-8">
                      {teams.map(t => {
                          const playerCount = Object.values(players).filter(id => id === t.id).length;
                          return (
                              <View key={t.id} className="w-[48%] bg-gray-900 border border-gray-700 rounded-2xl p-4 items-center">
                                  <View className="w-16 h-16 rounded-full overflow-hidden border-2 border-white mb-2">
                                      <AssetDisplay src={GAME_ASSETS[`team${t.id}_idle`]} style={{width: '100%', height: '100%'}} />
                                  </View>
                                  <Text className="text-white font-bold text-xs uppercase">{TEAM_INFO[t.id].name}</Text>
                                  <Text className="text-gray-400 font-bold mt-1">{playerCount} Kişi</Text>
                              </View>
                          );
                      })}
                  </View>

                  {/* BAŞLATMA VE HAZIR OLMA KONTROLLERİ */}
                  <View className="w-full max-w-sm gap-4 mt-auto mb-4">
                      
                      {/* OYUNCU DEĞİLSE VE MODERATÖR DEĞİLSE */}
                      {players[user?.uid] === undefined && moderatorUid !== user?.uid && (
                          <>
                              <TouchableOpacity onPress={joinTeamWithDice} className="bg-purple-600 p-5 rounded-full items-center">
                                  <Text className="text-white font-black text-lg">TAKIMA KATIL (ZAR AT)</Text>
                              </TouchableOpacity>
                              
                              {!moderatorUid && (
                                  <TouchableOpacity onPress={becomeModerator} className="bg-gray-900 border-2 border-emerald-500 p-4 rounded-full items-center mt-2">
                                      <Text className="text-emerald-400 font-bold">YADA MODERATÖR OL</Text>
                                  </TouchableOpacity>
                              )}
                          </>
                      )}

                      {/* MODERATÖR İSE */}
                      {isDedicatedModerator && (
                          <View className="bg-emerald-900 p-4 rounded-2xl items-center mb-2 border border-emerald-500">
                              <Text className="text-emerald-300 font-bold">🎬 REJİ MASASINDASINIZ</Text>
                          </View>
                      )}

                      {/* DURUM BİLGİSİ */}
                      <View className="bg-gray-900 p-3 rounded-full border border-gray-700 items-center">
                          <Text className="text-gray-300 font-bold">DURUM: {readyCount} / {activePlayerCount} Hazır</Text>
                      </View>

                      {/* OYUNCUYSA VE HAZIR DEĞİLSE */}
                      {players[user?.uid] !== undefined && !amIReady && (
                          <TouchableOpacity onPress={() => syncGame({ readyPlayers: { ...readyPlayers, [user?.uid]: true } })} className="bg-green-600 p-5 rounded-full items-center">
                              <Text className="text-white font-black text-lg">HAZIR OL</Text>
                          </TouchableOpacity>
                      )}

                      {/* MODERATÖR OYUNU BAŞLATIR */}
                      {isDedicatedModerator && isEveryoneReady && (
                          <TouchableOpacity onPress={() => syncGame({ gameState: 'ROLL' })} className="bg-yellow-500 p-5 rounded-full items-center mt-2">
                              <Text className="text-black font-black text-xl">OYUNU BAŞLAT</Text>
                          </TouchableOpacity>
                      )}
                      
                      {/* OYUNCULAR BEKLİYOR UYARISI */}
                      {(isHost || isDedicatedModerator) && !isEveryoneReady && activePlayerCount > 0 && (
                          <Text className="text-yellow-500 text-center font-bold mt-2">Oyuncuların hazır olması bekleniyor...</Text>
                      )}
                  </View>
              </ScrollView>
          </SafeAreaView>
      );
  }

  // OYUN İÇİ (SafeAreaView ekran kaymasını engeller)
  return (
      <SafeAreaView className="flex-1 bg-neutral-950">
          <View className="flex-row justify-between items-center p-4 bg-gray-900 border-b border-gray-800">
              <Text className="text-yellow-500 font-black tracking-widest text-lg">DOĞAÇLA</Text>
              <TouchableOpacity onPress={resetGame} className="bg-red-600/50 px-3 py-1 rounded border border-red-500"><Text className="text-white font-bold">ÇIKIŞ</Text></TouchableOpacity>
          </View>
          
          <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 16 }}>
              <View className="bg-gray-900 border-2 border-gray-700 p-6 rounded-3xl items-center mt-10">
                  <View className="w-32 h-32 rounded-full overflow-hidden border-4 border-yellow-500 bg-black mb-4">
                      <AssetDisplay src={GAME_ASSETS[`team${currentTeam.id}_idle`]} style={{width: '100%', height: '100%'}} />
                  </View>
                  <Text className="text-gray-400 font-bold uppercase text-xs mb-1">SAHNEDEKİ TAKIM</Text>
                  <Text className="text-white font-black text-4xl">{TEAM_INFO[currentTeam.id].name}</Text>
              </View>

              <View className="mt-auto pt-10">
                  {isDedicatedModerator ? (
                      <View className="bg-emerald-900 border border-emerald-500 p-6 rounded-2xl items-center">
                          <Text className="text-emerald-400 font-bold text-center text-lg mb-2">Reji Masası Aktif</Text>
                          <Text className="text-gray-300 text-center mb-4">Sahnedeki oyuncuları yönetebilirsiniz.</Text>
                          <TouchableOpacity onPress={() => syncGame({ gameState: 'VOTE' })} className="bg-red-600 w-full p-4 rounded-xl items-center">
                              <Text className="text-white font-bold text-lg">KURAL İHLALİ (-2 Puan)</Text>
                          </TouchableOpacity>
                      </View>
                  ) : (
                      <TouchableOpacity className="bg-blue-600 p-6 rounded-full items-center shadow-lg active:opacity-80">
                          <Text className="text-white font-black text-2xl tracking-widest">ZAR AT</Text>
                      </TouchableOpacity>
                  )}
              </View>
          </ScrollView>
      </SafeAreaView>
  );
}
