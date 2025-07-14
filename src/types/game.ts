export type Coordinates = { x: number; y: number };

export type TerrainType = 'grass' | 'tree' | 'mountain' | 'river' | 'town' | 'snow';
export type PlayerClass = 'warrior' | 'mage' | 'ranger' | 'assassin';
export type PlayerIcon = 'hero1' | 'hero2' | 'hero3' | 'hero4';

export type Item = {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'consumable';
  attack?: number;
  defense?: number;
  magic?: number;
  hp?: number;
  energyBoost?: number;
  description: string;
  icon: string;
};

export type Monster = {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  loot: Item[];
  greed: number;
  power: number;
};

export type Quest = {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
};

export type TileData = {
  terrain: TerrainType;
  monster?: Monster;
  item?: Item;
  quest?: Quest;
};

export type Player = {
  name: string;
  class: PlayerClass;
  icon: PlayerIcon;
  hp: number;
  maxHp: number;
  energy: number;
  maxEnergy: number;
  attack: number;
  defense: number;
  magic: number;
  position: Coordinates;
  inventory: Item[];
  quests: Quest[];
};

export type CombatLogEntry = {
  id: number;
  message: string;
};
