"use client";

import { useState } from 'react';
import Game from '@/components/game/Game';
import CharacterCreator from '@/components/game/CharacterCreator';
import type { Player } from '@/types/game';

export default function HomePage() {
  const [player, setPlayer] = useState<Player | null>(null);

  const handleCharacterCreation = (createdPlayer: Player) => {
    setPlayer(createdPlayer);
  };

  if (!player) {
    return <CharacterCreator onPlayerCreate={handleCharacterCreation} />;
  }

  return <Game initialPlayer={player} />;
}
