export type Coordinates = { x: number; y: number };

export type TerrainType = 'grass' | 'tree' | 'mountain' | 'river' | 'town' | 'snow' | 'camp';
export type PlayerClass = 'warrior' | 'mage' | 'ranger' | 'assassin';
export type PlayerIcon = 'hero1' | 'hero2' | 'hero3' | 'hero4' | 'hero5' | 'hero6';
export type PlayerRace = 'Male Elf' | 'Female Elf' | 'Male Troll' | 'Female Troll' | 'Male Human' | 'Female Human';

export type EquipmentSlot = 'weapon' | 'helmet' | 'armor' | 'belt';
export type ItemType = 'weapon' | 'armor' | 'helmet' | 'belt' | 'consumable';
export type ItemRarity = 'Common' | 'Rare' | 'Epic' | 'Legendary';


export type Item = {
  id: string;
  name: string;
  type: ItemType;
  rarity: ItemRarity;
  attack?: number;
  defense?: number;
  magic?: number;
  hp?: number;
  energyBoost?: number;
  description: string;
  icon: string;
  quantity?: number;
};

export type Monster = {
  id: string;
  name: string;
  icon: string;
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

export type Equipment = {
    [key in EquipmentSlot]: Item | null;
}

export type Player = {
  name: string;
  class: PlayerClass;
  race: PlayerRace;
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
  equipment: Equipment;
};

export type CombatLogEntry = {
  id: number;
  message: string;
};
