
import type { Player, PlayerClass, PlayerRace } from '@/types/game';

export const MAP_SIZE = 100;
export const VIEWPORT_SIZE = 9;
export const ENERGY_REGEN_RATE = 1500; // ms, slower regen
export const MOVE_COOLDOWN = 2600; // ms
export const INVENTORY_SIZE = 16; // 4 rows of 4

export const TERRAIN_ENERGY_COST: Record<string, number> = {
    grass: 8,
    tree: 12,
    river: 16,
    snow: 20,
    town: 1,
    camp: 1,
    mountain: 30,
};

export const INITIAL_PLAYER_STATE: Omit<Player, 'name' | 'class' | 'icon' | 'race'> = {
  hp: 100,
  maxHp: 100,
  energy: 100,
  maxEnergy: 100,
  attack: 10,
  defense: 5,
  criticalChance: 5,
  position: { x: Math.floor(MAP_SIZE / 2), y: Math.floor(MAP_SIZE / 2) },
  inventory: [],
  quests: [{
    id: 'q1',
    title: 'Explore the World',
    description: 'Survive and find your fortune in this vast land.',
    isCompleted: false
  }],
  equipment: {
    weapon: null,
    helmet: null,
    armor: null,
    belt: null,
  },
  bonusCritChance: 0,
  consumableFindChance: 0,
  rareEquipmentFindChance: 0,
  bonusXpGain: 0,
  utilityItemFindChance: 0,
};

export const PLAYER_CLASSES: Record<PlayerClass, Omit<Player, 'position' | 'inventory' | 'quests' | 'name' | 'icon' | 'equipment' | 'race' | 'bonusCritChance' | 'consumableFindChance' | 'rareEquipmentFindChance' | 'bonusXpGain' | 'utilityItemFindChance'>> = {
    warrior: {
        class: 'warrior',
        hp: 120,
        maxHp: 120,
        energy: 80,
        maxEnergy: 80,
        attack: 15,
        defense: 10,
        criticalChance: 5,
    },
    mage: {
        class: 'mage',
        hp: 80,
        maxHp: 80,
        energy: 120,
        maxEnergy: 120,
        attack: 5,
        magicAttack: 15,
        defense: 5,
        criticalChance: 15,
    },
    ranger: {
        class: 'ranger',
        hp: 100,
        maxHp: 100,
        energy: 100,
        maxEnergy: 100,
        attack: 12,
        defense: 7,
        criticalChance: 10,
    },
    assassin: {
        class: 'assassin',
        hp: 90,
        maxHp: 90,
        energy: 110,
        maxEnergy: 110,
        attack: 18,
        defense: 5,
        criticalChance: 20,
    }
};
