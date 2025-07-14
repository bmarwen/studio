"use client";

import { useState, useEffect } from 'react';
import Game from '@/components/game/Game';
import CharacterCreator from '@/components/game/CharacterCreator';
import type { Player } from '@/types/game';

export default function HomePage() {
  const [player, setPlayer] = useState<Player | null>(null);
  const [gameKey, setGameKey] = useState(0);

  const handleCharacterCreation = (createdPlayer: Player) => {
    setPlayer(createdPlayer);
  };
  
  const handleGameReset = () => {
    setGameKey(prevKey => prevKey + 1);
  };

  useEffect(() => {
    // This is a good place to start/stop music
    const audio = new Audio('/music/adventure-awaits.mp3');
    audio.loop = true;
    audio.volume = 0.3;
    audio.play().catch(e => console.error("Audio play failed:", e));

    return () => {
      audio.pause();
    };
  }, []);

  if (!player) {
    return <CharacterCreator onPlayerCreate={handleCharacterCreation} />;
  }

  return <Game key={gameKey} initialPlayer={player} onReset={handleGameReset} />;
}
