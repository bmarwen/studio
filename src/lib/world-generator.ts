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
    { name: 'Ice Elemental', hp: 30, maxHp: 30, attack: 10, defense: 8, loot: [ITEMS[3]], greed: 50, power: 5 }
];

// Using a simple noise function for terrain generation
function simpleNoise(x: number, y: number, scale: number) {
    // This is a very basic placeholder. A real implementation would use Perlin or Simplex noise.
    return (Math.sin(x * scale) + Math.cos(y * scale)) / 2;
}

export function generateWorld(): TileData[][] {
  const world: TileData[][] = [];

  for (let y = 0; y < MAP_SIZE; y++) {
    world[y] = [];
    for (let x = 0; x < MAP_SIZE; x++) {
      let terrain: TileData['terrain'] = 'grass';
      
      const mountainNoise = simpleNoise(x, y, 0.1);
      const treeNoise = simpleNoise(x, y, 0.2);
      const riverNoise = simpleNoise(x, y, 0.05);
      const snowNoise = simpleNoise(y, x, 0.15); // Different noise for snow

      if (mountainNoise > 0.7) {
        terrain = 'mountain';
      } else if (snowNoise > 0.6 && mountainNoise > 0.5) {
        terrain = 'snow';
      }
      else if (treeNoise > 0.6) {
        terrain = 'tree';
      } else if (Math.abs(riverNoise) > 0.95) {
        terrain = 'river';
      }

      let monster: Monster | undefined;
      if (terrain === 'tree' && Math.random() < 0.1) {
        const monsterTemplate = MONSTERS[Math.floor(Math.random() * (MONSTERS.length - 1))]; // Not ice elemental
        monster = { ...monsterTemplate, id: `m_${x}_${y}` };
      } else if (terrain === 'snow' && Math.random() < 0.15) {
        const monsterTemplate = MONSTERS[3]; // Ice Elemental
        monster = { ...monsterTemplate, id: `m_${x}_${y}` };
      }
      
      let item: Item | undefined;
      if (terrain === 'grass' && Math.random() < 0.02) {
        item = ITEMS[Math.floor(Math.random() * ITEMS.length)];
      }
      
      world[y][x] = { terrain, monster, item };
    }
  }

  // Place a town near the center, ensuring it's not on an obstacle
  const townX = Math.floor(MAP_SIZE / 2);
  const townY = Math.floor(MAP_SIZE / 2);
  world[townY][townX] = { terrain: 'town' };
  world[townY+1][townX] = { terrain: 'grass' };
  world[townY-1][townX] = { terrain: 'grass' };
  world[townY][townX+1] = { terrain: 'grass' };
  world[townY][townX-1] = { terrain: 'grass' };


  return world;
}
