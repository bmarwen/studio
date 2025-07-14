import type { TileData, Monster, Item } from "@/types/game";
import { MAP_SIZE } from "./game-constants";

const ITEMS: Item[] = [
    { id: 'i1', name: 'Rusty Sword', type: 'weapon', attack: 2, description: 'A bit worn but better than nothing.' },
    { id: 'i2', name: 'Leather Tunic', type: 'armor', defense: 2, description: 'Basic leather protection.' },
    { id: 'i3', name: 'Health Potion', type: 'consumable', hp: 20, description: 'Restores a small amount of health.'},
    { id: 'i4', name: 'Energy Crystal', type: 'consumable', energyBoost: 1, description: 'Slightly increases energy regeneration.'}
];

const MONSTERS: Omit<Monster, 'id'>[] = [
    { name: 'Goblin', hp: 20, maxHp: 20, attack: 8, defense: 2, loot: [ITEMS[0]], greed: 70, power: -20 },
    { name: 'Slime', hp: 15, maxHp: 15, attack: 5, defense: 5, loot: [ITEMS[2]], greed: 20, power: -50 },
    { name: 'Orc Grunt', hp: 40, maxHp: 40, attack: 12, defense: 4, loot: [ITEMS[1]], greed: 85, power: 10 },
];

export function generateWorld(): TileData[][] {
  const world: TileData[][] = [];

  for (let y = 0; y < MAP_SIZE; y++) {
    world[y] = [];
    for (let x = 0; x < MAP_SIZE; x++) {
      let terrain: TileData['terrain'] = 'grass';
      const noise = Math.random();

      if (noise > 0.85) {
        terrain = 'tree';
      } else if (noise > 0.95) {
        terrain = 'mountain';
      } else if (x % 20 === 0 || y % 20 === 0) {
        if (Math.random() > 0.8) terrain = 'river';
      }

      let monster: Monster | undefined;
      if (terrain === 'tree' && Math.random() < 0.1) {
        const monsterTemplate = MONSTERS[Math.floor(Math.random() * MONSTERS.length)];
        monster = { ...monsterTemplate, id: `m_${x}_${y}` };
      }
      
      let item: Item | undefined;
      if (terrain === 'grass' && Math.random() < 0.02) {
        item = ITEMS[Math.floor(Math.random() * ITEMS.length)];
      }
      
      world[y][x] = { terrain, monster, item };
    }
  }

  // Place a town
  const townX = Math.floor(MAP_SIZE / 2) + 5;
  const townY = Math.floor(MAP_SIZE / 2) + 5;
  world[townY][townX].terrain = 'town';

  return world;
}
