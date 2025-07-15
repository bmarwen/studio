import type { Player, PlayerClass, PlayerRace } from '@/types/game';

export const MAP_SIZE = 100;
export const VIEWPORT_SIZE = 9;
export const STAMINA_REGEN_RATE = 1000; // ms, faster regen
export const MOVE_COOLDOWN = 1200; // ms
export const INVENTORY_SIZE = 8;

export const TERRAIN_STAMINA_COST: Record<string, number> = {
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
  stamina: 100,
  maxStamina: 100,
  attack: 10,
  magicAttack: 0,
  defense: 5,
  armor: 0,
  magicResist: 0,
  evasion: 0,
  criticalChance: 5,
  position: { x: Math.floor(MAP_SIZE / 2), y: Math.floor(MAP_SIZE / 2) },
  inventory: [],
  hasBackpack: false,
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
  activeEffects: [],
  bonusCritChance: 0,
  consumableFindChance: 0,
  rareEquipmentFindChance: 0,
  bonusXpGain: 0,
  utilityItemFindChance: 0,
};

export const PLAYER_CLASSES: Record<PlayerClass, Omit<Player, 'position' | 'inventory' | 'quests' | 'name' | 'icon' | 'equipment' | 'race' | 'bonusCritChance' | 'consumableFindChance' | 'rareEquipmentFindChance' | 'bonusXpGain' | 'utilityItemFindChance' | 'activeEffects' | 'hasBackpack'>> = {
    warrior: {
        class: 'warrior',
        hp: 120,
        maxHp: 120,
        stamina: 80,
        maxStamina: 80,
        attack: 15,
        magicAttack: 0,
        defense: 10,
        armor: 10,
        magicResist: 5,
        evasion: 5,
        criticalChance: 5,
    },
    mage: {
        class: 'mage',
        hp: 80,
        maxHp: 80,
        stamina: 120,
        maxStamina: 120,
        attack: 5, // Low physical attack
        magicAttack: 15, // High magic attack
        defense: 5,
        armor: 3,
        magicResist: 10,
        evasion: 7,
        criticalChance: 10, // Mages can crit with spells
    },
    ranger: {
        class: 'ranger',
        hp: 100,
        maxHp: 100,
        stamina: 100,
        maxStamina: 100,
        attack: 12,
        magicAttack: 0,
        defense: 7,
        armor: 7,
        magicResist: 7,
        evasion: 10,
        criticalChance: 10,
    },
    assassin: {
        class: 'assassin',
        hp: 90,
        maxHp: 90,
        stamina: 110,
        maxStamina: 110,
        attack: 18,
        magicAttack: 0,
        defense: 5,
        armor: 5,
        magicResist: 5,
        evasion: 15,
        criticalChance: 20,
    }
};
