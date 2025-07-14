import type { Player } from '@/types/game';

export const MAP_SIZE = 100; // Smaller for performance in this demo
export const VIEWPORT_SIZE = 8;
export const MOVE_ENERGY_COST = 5;
export const ENERGY_REGEN_RATE = 2000; // ms

export const INITIAL_PLAYER_STATE: Player = {
  name: "Hero",
  hp: 100,
  maxHp: 100,
  energy: 50,
  maxEnergy: 50,
  attack: 10,
  defense: 5,
  magic: 0,
  position: { x: Math.floor(MAP_SIZE / 2), y: Math.floor(MAP_SIZE / 2) },
  inventory: [],
  quests: [{
    id: 'q1',
    title: 'Explore the World',
    description: 'Survive and find your fortune in this vast land.',
    isCompleted: false
  }],
};
