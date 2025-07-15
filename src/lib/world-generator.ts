import type { TileData, Monster, Item } from "@/types/game";
import { MAP_SIZE, TERRAIN_STAMINA_COST } from "./game-constants";
import { MONSTERS, TERRAIN_MONSTER_SPAWNS, createItem, TERRAIN_TILE_LOOT } from "./game-config";

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
      const campNoise = simpleNoise(x, y, 0.3, seed + 400);

      if (mountainNoise > 0.75) {
        terrain = 'mountain';
      } else if (snowNoise > 0.6) {
        terrain = 'snow';
      } else if (riverNoise > 0.9) {
        terrain = 'river';
      } else if (campNoise > 0.95) { // Made camps much rarer
        terrain = 'camp';
      } else if (treeNoise > 0.6) {
        terrain = 'tree';
      }
      
      let monster: Monster | undefined;
      const monsterSpawns = TERRAIN_MONSTER_SPAWNS[terrain];
      if (monsterSpawns) {
        for (const spawn of monsterSpawns) {
            if(Math.random() < spawn.chance) {
                const monsterTemplate = MONSTERS[spawn.monsterId];
                if (monsterTemplate) {
                    monster = { ...monsterTemplate, id: `${spawn.monsterId}_${x}_${y}` };
                    break; // Only spawn one monster per tile
                }
            }
        }
      }

      let item: Item | undefined;
      const tileLoot = TERRAIN_TILE_LOOT[terrain];
      if (tileLoot) {
        for (const loot of tileLoot) {
            if (Math.random() < loot.chance) {
                item = createItem(loot.itemId, loot.quantity);
                break; // Only one item find per tile
            }
        }
      }

      world[y][x] = { terrain, monster, item };
    }
  }

  const townX = Math.floor(MAP_SIZE / 2);
  const townY = Math.floor(MAP_SIZE / 2);
  world[townY][townX] = { terrain: 'town' };

  // Clear area around town
  for(let i = -1; i <= 1; i++) {
    for(let j = -1; j <= 1; j++) {
        if(i === 0 && j === 0) continue;
        if (world[townY+j] && world[townY+j][townX+i]) {
            world[townY+j][townX+i].monster = undefined;
            world[townY+j][townX+i].item = undefined;
        }
    }
  }

  return world;
}
