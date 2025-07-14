import type { TileData, Monster, Item } from "@/types/game";
import { MAP_SIZE } from "./game-constants";

const ITEMS: Item[] = [
    { id: 'i1', name: 'Rusty Sword', type: 'weapon', attack: 2, description: 'A bit worn but better than nothing.', icon: '/icons/item-sword.svg' },
    { id: 'i2', name: 'Leather Tunic', type: 'armor', defense: 2, description: 'Basic leather protection.', icon: '/icons/item-tunic.svg' },
    { id: 'i3', name: 'Health Potion', type: 'consumable', hp: 20, description: 'Restores 20 health.', icon: '/icons/item-potion.svg'},
    { id: 'i4', name: 'Energy Crystal', type: 'consumable', energyBoost: 1, description: 'Slightly increases passive energy regeneration.', icon: '/icons/item-crystal.svg'}
];

const MONSTERS: Omit<Monster, 'id'>[] = [
    { name: 'Goblin', hp: 20, maxHp: 20, attack: 8, defense: 2, loot: [ITEMS[0]], greed: 70, power: -20 },
    { name: 'Slime', hp: 15, maxHp: 15, attack: 5, defense: 5, loot: [ITEMS[2]], greed: 20, power: -50 },
    { name: 'Orc Grunt', hp: 40, maxHp: 40, attack: 12, defense: 4, loot: [ITEMS[1]], greed: 85, power: 10 },
    { name: 'Ice Elemental', hp: 30, maxHp: 30, attack: 10, defense: 8, loot: [ITEMS[3]], greed: 50, power: 5 }
];

function simpleNoise(x: number, y: number, scale: number, offset: number = 0) {
    return (Math.sin((x + offset) * scale) + Math.cos((y + offset) * scale)) / 2;
}

export function generateWorld(): TileData[][] {
  const world: TileData[][] = [];
  const seed = Math.random() * 1000;

  for (let y = 0; y < MAP_SIZE; y++) {
    world[y] = [];
    for (let x = 0; x < MAP_SIZE; x++) {
      let terrain: TileData['terrain'] = 'grass';
      
      const mountainNoise = simpleNoise(x, y, 0.1, seed);
      const treeNoise = simpleNoise(x, y, 0.2, seed + 100);
      const riverNoise = Math.abs(simpleNoise(x, y, 0.05, seed + 200));
      const snowNoise = simpleNoise(y, x, 0.08, seed + 300);

      if (mountainNoise > 0.75) {
        terrain = 'mountain';
      } else if (snowNoise > 0.6) {
        terrain = 'snow';
      } else if (riverNoise > 0.9) {
        terrain = 'river';
      } else if (treeNoise > 0.6) {
        terrain = 'tree';
      }

      let monster: Monster | undefined;
      let item: Item | undefined;
      
      if (terrain !== 'mountain') {
        const monsterRoll = Math.random();
        if (terrain === 'tree' && monsterRoll < 0.3) { 
          const monsterTemplate = MONSTERS[Math.floor(Math.random() * (MONSTERS.length - 1))];
          monster = { ...monsterTemplate, id: `m_${x}_${y}` };
        } else if (terrain === 'snow' && monsterRoll < 0.35) {
          monster = { ...MONSTERS[3], id: `m_${x}_${y}` };
        } else if (terrain === 'grass' && monsterRoll < 0.15) {
          monster = { ...MONSTERS[1], id: `m_${x}_${y}` };
        } else if (terrain === 'river' && monsterRoll < 0.2) {
          monster = { ...MONSTERS[1], id: `m_${x}_${y}` };
        }

        const itemRoll = Math.random();
        if (terrain === 'grass' && itemRoll < 0.05) {
          item = ITEMS[Math.floor(Math.random() * ITEMS.length)];
        }
      }
      
      world[y][x] = { terrain, monster, item };
    }
  }

  const townX = Math.floor(MAP_SIZE / 2);
  const townY = Math.floor(MAP_SIZE / 2);
  world[townY][townX] = { terrain: 'town' };

  return world;
}