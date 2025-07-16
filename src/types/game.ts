export type Coordinates = { x: number; y: number };

export type TerrainType = 'grass' | 'tree' | 'mountain' | 'river' | 'town' | 'snow' | 'camp';
export type PlayerClass = 'warrior' | 'mage' | 'ranger' | 'assassin';
export type PlayerIcon = 'hero1' | 'hero2' | 'hero3' | 'hero4' | 'hero5' | 'hero6';
export type PlayerRace = 'Male Elf' | 'Female Elf' | 'Male Troll' | 'Female Troll' | 'Male Human' | 'Female Human';

export type EquipmentSlot = 'weapon' | 'helmet' | 'armor' | 'belt' | 'boots';
export type ItemType = 'weapon' | 'armor' | 'helmet' | 'belt' | 'boots' | 'consumable' | 'legendary' | 'utility';
export type ItemRarity = 'Common' | 'Rare' | 'Epic' | 'Legendary';
export type PlayerEffectType = 'stamina_regen_boost' | 'attack_boost';

export type PlayerEffect = {
  id: string;
  type: PlayerEffectType;
  value: number;
  expiresAt: number; // unix timestamp
}

export type Item = {
  id: string;
  itemId: string;
  name: string;
  type: ItemType;
  rarity: ItemRarity;
  attack?: number;
  magicAttack?: number;
  defense?: number;
  armor?: number;
  magicResist?: number;
  evasion?: number;
  criticalChance?: number;
  hp?: number;
  staminaBoost?: number;
  staminaRegenBonus?: number; // e.g., 0.2 for 20%
  effectDuration?: number; // in seconds
  description: string;
  icon: string;
  quantity: number;
  allowedClasses?: PlayerClass[];
  inventorySlots?: number;

  // Secondary Stats
  initiative?: number;
  scoutRange?: number;
  doubleHitChance?: number;
  lootLuck?: number;
  xpGainBonus?: number;
};

export type MonsterLoot = {
    itemId: string;
    chance: number; // 0 to 1
    quantity: number;
}

export type Monster = {
  id: string;
  name: string;
  icon: string;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  lootTable: MonsterLoot[];
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
  stamina: number;
  maxStamina: number;
  attack: number;
  magicAttack: number;
  defense: number;
  armor: number;
  magicResist: number;
  evasion: number;
  criticalChance: number;
  position: Coordinates;
  inventory: (Item | null)[];
  hasBackpack: boolean;
  quests: Quest[];
  equipment: Equipment;
  activeEffects: PlayerEffect[];

  // Racial Bonuses
  bonusCritChance?: number;
  consumableFindChance?: number;
  rareEquipmentFindChance?: number;
  bonusXpGain?: number;
  utilityItemFindChance?: number;

  // Secondary Stats
  initiative: number;
  scoutRange: number;
  doubleHitChance: number;
  lootLuck: number;
  xpGainBonus: number;
};

export type CombatLogEntry = {
  id: number;
  message: string;
};
