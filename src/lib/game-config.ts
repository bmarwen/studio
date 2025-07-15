
import type { Item, Monster, TerrainType } from "@/types/game";

// --- ITEM DEFINITIONS ---
// All items available in the game are defined here.
export const ITEMS: Record<string, Omit<Item, 'id'>> = {
    'rusty_sword': { name: 'Rusty Sword', type: 'weapon', rarity: 'Common', attack: 2, description: 'A bit worn but better than nothing.', icon: '/icons/item-sword.svg' },
    'leather_tunic': { name: 'Leather Tunic', type: 'armor', rarity: 'Common', defense: 2, description: 'Basic leather protection.', icon: '/icons/item-tunic.svg' },
    'health_potion': { name: 'Health Potion', type: 'consumable', rarity: 'Common', hp: 20, description: 'Restores 20 health.', icon: '/icons/item-potion.svg'},
    'elixir_of_vigor': { name: 'Elixir of Vigor', type: 'consumable', rarity: 'Rare', energyBoost: 1, description: 'Temporarily increases passive energy regeneration.', icon: '/icons/item-crystal.svg'},
    'iron_helmet': { name: 'Iron Helmet', type: 'helmet', rarity: 'Common', defense: 3, description: 'A sturdy iron helmet.', icon: '/icons/item-helmet.svg'},
    'steel_platebody': { name: 'Steel Platebody', type: 'armor', rarity: 'Rare', defense: 5, description: 'Provides good protection against physical attacks.', icon: '/icons/item-armor.svg'},
    'reinforced_belt': { name: 'Reinforced Belt', type: 'belt', rarity: 'Common', defense: 1, description: 'A simple but effective belt.', icon: '/icons/item-belt.svg'},
    'blade_of_the_ancients': { name: 'Blade of the Ancients', type: 'weapon', rarity: 'Epic', attack: 10, criticalChance: 5, description: 'A powerful blade pulsating with ancient magic.', icon: '/icons/item-sword.svg'},
    'dragonscale_helm': { name: 'Dragonscale Helm', type: 'legendary', rarity: 'Legendary', defense: 8, criticalChance: 3, description: 'A helm crafted from the scales of a mythical dragon.', icon: '/icons/item-helmet.svg'},
};

// Helper function to create a full item object with an ID
export function createItem(itemId: string, quantity: number = 1): Item {
    if (!ITEMS[itemId]) throw new Error(`Item with id ${itemId} not found in ITEMS definition.`);
    return { ...ITEMS[itemId], id: itemId, quantity };
}


// --- MONSTER DEFINITIONS ---
// lootTable: { itemId, chance (0-1), quantity }
export const MONSTERS: Record<string, Omit<Monster, 'id'>> = {
    'goblin': { 
        name: 'Goblin', 
        icon: '/icons/monster-goblin.svg',
        hp: 20, maxHp: 20, attack: 8, defense: 2, 
        greed: 70, power: -20, 
        lootTable: [
            { itemId: 'rusty_sword', chance: 0.1, quantity: 1 },
            { itemId: 'health_potion', chance: 0.5, quantity: 1 }
        ] 
    },
    'slime': { 
        name: 'Slime', 
        icon: '/icons/monster-slime.svg',
        hp: 15, maxHp: 15, attack: 5, defense: 5, 
        greed: 20, power: -50, 
        lootTable: [
             { itemId: 'health_potion', chance: 0.1, quantity: 1 } // Very low chance
        ]
    },
    'orc_grunt': { 
        name: 'Orc Grunt', 
        icon: '/icons/monster-orc.svg',
        hp: 40, maxHp: 40, attack: 12, defense: 4, 
        greed: 85, power: 10,
        lootTable: [
            { itemId: 'leather_tunic', chance: 0.2, quantity: 1 },
            { itemId: 'iron_helmet', chance: 0.15, quantity: 1 },
            { itemId: 'health_potion', chance: 0.3, quantity: 2 },
        ]
    },
    'ice_elemental': { 
        name: 'Ice Elemental', 
        icon: '/icons/monster-elemental.svg',
        hp: 30, maxHp: 30, attack: 10, defense: 8, 
        greed: 50, power: 5, 
        lootTable: [
            { itemId: 'elixir_of_vigor', chance: 0.25, quantity: 1 }
        ] 
    },
    'ancient_dragon': { 
        name: 'Ancient Dragon', 
        icon: '/icons/monster-dragon.svg',
        hp: 150, maxHp: 150, attack: 25, defense: 15, 
        greed: 95, power: 80, 
        lootTable: [
            { itemId: 'dragonscale_helm', chance: 0.5, quantity: 1 },
            { itemId: 'blade_of_the_ancients', chance: 0.3, quantity: 1 },
            { itemId: 'health_potion', chance: 1, quantity: 5 } // Guaranteed potions
        ]
    }
};

// --- TERRAIN-BASED CONFIGURATION ---

// Defines which monsters can spawn in which terrain type.
export const TERRAIN_MONSTER_SPAWNS: Record<TerrainType, { monsterId: string, chance: number }[]> = {
    grass: [
        { monsterId: 'slime', chance: 0.15 },
        { monsterId: 'goblin', chance: 0.10 },
    ],
    tree: [
        { monsterId: 'goblin', chance: 0.2 },
        { monsterId: 'orc_grunt', chance: 0.1 },
    ],
    river: [
        { monsterId: 'slime', chance: 0.2 },
    ],
    snow: [
        { monsterId: 'ice_elemental', chance: 0.35 }
    ],
    mountain: [], // No monsters in mountains
    town: [], // No monsters in town
    camp: [], // No monsters in camp
};

// Defines loot that can be found by simply walking over a tile.
export const TERRAIN_TILE_LOOT: Record<TerrainType, { itemId: string, chance: number, quantity: number }[]> = {
    grass: [
        { itemId: 'health_potion', chance: 0.005, quantity: 1} // Very rare find
    ],
    tree: [
        { itemId: 'leather_tunic', chance: 0.002, quantity: 1 }
    ],
    river: [],
    snow: [],
    mountain: [],
    town: [],
    camp: [],
}
