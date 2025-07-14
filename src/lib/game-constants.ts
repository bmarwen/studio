import type { Player, PlayerClass } from '@/types/game';

export const MAP_SIZE = 100; // Smaller for performance in this demo
export const VIEWPORT_SIZE = 9;
export const ENERGY_REGEN_RATE = 2000; // ms

export const TERRAIN_ENERGY_COST = {
    grass: 2,
    tree: 4,
    river: 6,
    snow: 8,
    mountain: 20, // Though movement is blocked
    town: 1,
    treasure: 1,
};

export const INITIAL_PLAYER_STATE: Omit<Player, 'name' | 'class' | 'icon'> = {
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

export const PLAYER_CLASSES: Record<PlayerClass, Omit<Player, 'position' | 'inventory' | 'quests' | 'name' | 'icon'>> = {
    warrior: {
        class: 'warrior',
        hp: 120,
        maxHp: 120,
        energy: 80,
        maxEnergy: 80,
        attack: 15,
        defense: 10,
        magic: 0,
    },
    mage: {
        class: 'mage',
        hp: 80,
        maxHp: 80,
        energy: 120,
        maxEnergy: 120,
        attack: 5,
        defense: 5,
        magic: 20,
    },
    ranger: {
        class: 'ranger',
        hp: 100,
        maxHp: 100,
        energy: 100,
        maxEnergy: 100,
        attack: 12,
        defense: 7,
        magic: 5,
    },
    assassin: {
        class: 'assassin',
        hp: 90,
        maxHp: 90,
        energy: 110,
        maxEnergy: 110,
        attack: 18,
        defense: 5,
        magic: 2,
    }
};
