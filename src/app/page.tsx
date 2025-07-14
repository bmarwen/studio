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
    setPlayer(null); // Go back to character creator
    setGameKey(prevKey => prevKey + 1);
  };

  useEffect(() => {
    // This is a good place for logic that should run once when a character is created.
    // For example, starting up background music.
    // Note: Can't add audio files directly in this environment.
  }, [player]);

  if (!player) {
    return <CharacterCreator onPlayerCreate={handleCharacterCreation} />;
  }

  return <Game key={gameKey} initialPlayer={player} onReset={handleGameReset} />;
}
