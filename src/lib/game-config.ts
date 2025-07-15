import type { Item, Monster, PlayerClass } from "@/types/game";

// --- ITEM DEFINITIONS ---
// All items available in the game are defined here.
export const ITEMS: Record<string, Omit<Item, 'id' | 'quantity'>> = {
    // --- Consumables ---
    'health_potion': { name: 'Health Potion', type: 'consumable', rarity: 'Common', hp: 20, description: 'Restores 20 health.', icon: '/icons/item-potion.svg'},
    'greater_health_potion': { name: 'Greater Health Potion', type: 'consumable', rarity: 'Rare', hp: 50, description: 'Restores 50 health.', icon: '/icons/item-potion.svg'},
    'elixir_of_vigor': { name: 'Elixir of Vigor', type: 'consumable', rarity: 'Rare', energyBoost: 1, description: 'Temporarily increases passive energy regeneration.', icon: '/icons/item-crystal.svg'},
    'elixir_of_strength': { name: 'Elixir of Strength', type: 'consumable', rarity: 'Epic', attack: 5, description: 'Temporarily increases attack by 5.', icon: '/icons/item-potion-red.svg'},

    // --- Utility ---
    'scrying_orb': { name: 'Scrying Orb', type: 'utility', rarity: 'Rare', description: 'Reveals monsters in a small radius around you.', icon: '/icons/item-orb.svg'},
    
    // --- Warrior Weapons (Swords) ---
    'rusty_sword': { name: 'Rusty Sword', type: 'weapon', rarity: 'Common', attack: 5, description: 'A bit worn but better than nothing.', icon: '/icons/item-sword.svg', allowedClasses: ['warrior'] },
    'steel_longsword': { name: 'Steel Longsword', type: 'weapon', rarity: 'Rare', attack: 12, description: 'A well-balanced and reliable steel sword.', icon: '/icons/item-sword.svg', allowedClasses: ['warrior'] },
    'flame_reaver': { name: 'Flame Reaver', type: 'weapon', rarity: 'Epic', attack: 20, criticalChance: 5, description: 'A greatsword imbued with fire.', icon: '/icons/item-sword-fire.svg', allowedClasses: ['warrior'] },
    
    // --- Mage Weapons (Wands/Staves) ---
    'apprentice_wand': { name: 'Apprentice Wand', type: 'weapon', rarity: 'Common', magicAttack: 8, description: 'A simple wand for a magic beginner.', icon: '/icons/item-wand.svg', allowedClasses: ['mage'] },
    'staff_of_power': { name: 'Staff of Power', type: 'weapon', rarity: 'Rare', magicAttack: 15, description: 'A staff crackling with magical energy.', icon: '/icons/item-staff.svg', allowedClasses: ['mage'] },
    'voidcaller_scepter': { name: 'Voidcaller Scepter', type: 'weapon', rarity: 'Epic', magicAttack: 25, description: 'A scepter that hums with the power of the void.', icon: '/icons/item-scepter.svg', allowedClasses: ['mage'] },
    
    // --- Ranger Weapons (Crossbows) ---
    'wooden_crossbow': { name: 'Wooden Crossbow', type: 'weapon', rarity: 'Common', attack: 6, description: 'A standard-issue crossbow.', icon: '/icons/item-crossbow.svg', allowedClasses: ['ranger'] },
    'hunter_crossbow': { name: 'Hunter\'s Crossbow', type: 'weapon', rarity: 'Rare', attack: 14, criticalChance: 3, description: 'A precise and deadly crossbow for the skilled hunter.', icon: '/icons/item-crossbow.svg', allowedClasses: ['ranger'] },
    'storm_caller': { name: 'Storm-Caller', type: 'weapon', rarity: 'Epic', attack: 22, description: 'A crossbow that fires bolts with the speed of lightning.', icon: '/icons/item-crossbow-electric.svg', allowedClasses: ['ranger'] },

    // --- Assassin Weapons (Daggers) ---
    'iron_dagger': { name: 'Iron Dagger', type: 'weapon', rarity: 'Common', attack: 4, criticalChance: 5, description: 'A swift and silent weapon.', icon: '/icons/item-dagger.svg', allowedClasses: ['assassin'] },
    'shadowfang_blade': { name: 'Shadowfang Blade', type: 'weapon', rarity: 'Rare', attack: 10, criticalChance: 10, description: 'A dagger coated in a fast-acting venom.', icon: '/icons/item-dagger.svg', allowedClasses: ['assassin'] },
    'kingsbane': { name: 'Kingsbane', type: 'weapon', rarity: 'Epic', attack: 18, criticalChance: 15, description: 'A legendary dagger said to have toppled thrones.', icon: '/icons/item-dagger-poison.svg', allowedClasses: ['assassin'] },

    // --- Universal Legendary Weapon ---
    'blade_of_the_ancients': { name: 'Blade of the Ancients', type: 'weapon', rarity: 'Legendary', attack: 30, criticalChance: 10, description: 'A powerful blade pulsating with ancient magic. Can be wielded by any class.', icon: '/icons/item-sword.svg'},
    
    // --- Warrior Armor ---
    'iron_helmet': { name: 'Iron Helmet', type: 'helmet', rarity: 'Common', defense: 3, description: 'A sturdy iron helmet.', icon: '/icons/item-helmet.svg', allowedClasses: ['warrior']},
    'iron_platebody': { name: 'Iron Platebody', type: 'armor', rarity: 'Common', defense: 6, description: 'Solid protection for the torso.', icon: '/icons/item-armor.svg', allowedClasses: ['warrior']},
    'iron_warbelt': { name: 'Iron Warbelt', type: 'belt', rarity: 'Common', defense: 2, description: 'Holds your pants up, and your guts in.', icon: '/icons/item-belt.svg', allowedClasses: ['warrior']},

    // --- Mage Armor ---
    'mage_cowl': { name: 'Mage Cowl', type: 'helmet', rarity: 'Common', defense: 1, description: 'A simple cowl for a spellcaster.', icon: '/icons/item-cowl.svg', allowedClasses: ['mage']},
    'enchanted_robes': { name: 'Enchanted Robes', type: 'armor', rarity: 'Common', defense: 3, description: 'Robes woven with protective spells.', icon: '/icons/item-robe.svg', allowedClasses: ['mage']},
    'manaweave_sash': { name: 'Manaweave Sash', type: 'belt', rarity: 'Common', defense: 1, description: 'A sash that helps focus magical energies.', icon: '/icons/item-sash.svg', allowedClasses: ['mage']},

    // --- Ranger Armor ---
    'leather_cap': { name: 'Leather Cap', type: 'helmet', rarity: 'Common', defense: 2, description: 'Lightweight and durable.', icon: '/icons/item-cap.svg', allowedClasses: ['ranger']},
    'leather_tunic': { name: 'Leather Tunic', type: 'armor', rarity: 'Common', defense: 4, description: 'Basic leather protection.', icon: '/icons/item-tunic.svg', allowedClasses: ['ranger']},
    'utility_belt': { name: 'Utility Belt', type: 'belt', rarity: 'Common', defense: 1, description: 'A belt with many useful pouches.', icon: '/icons/item-belt.svg', allowedClasses: ['ranger']},

    // --- Assassin Armor ---
    'shadow_hood': { name: 'Shadow Hood', type: 'helmet', rarity: 'Common', defense: 1, criticalChance: 2, description: 'A dark hood that conceals the face.', icon: '/icons/item-hood.svg', allowedClasses: ['assassin']},
    'dark_leather_jerkin': { name: 'Dark Leather Jerkin', type: 'armor', rarity: 'Common', defense: 3, criticalChance: 3, description: 'Silent and flexible armor.', icon: '/icons/item-jerkin.svg', allowedClasses: ['assassin']},
    'bandolier': { name: 'Bandolier', type: 'belt', rarity: 'Common', defense: 1, criticalChance: 1, description: 'For easy access to tools of the trade.', icon: '/icons/item-bandolier.svg', allowedClasses: ['assassin']},
    
    // --- Generic High-Tier Armor ---
    'dragonscale_helm': { name: 'Dragonscale Helm', type: 'legendary', rarity: 'Legendary', defense: 12, criticalChance: 5, description: 'A helm crafted from the scales of a mythical dragon.', icon: '/icons/item-helmet.svg'},
    'steel_platebody': { name: 'Steel Platebody', type: 'armor', rarity: 'Rare', defense: 8, description: 'Provides good protection against physical attacks.', icon: '/icons/item-armor.svg'},
    'reinforced_belt': { name: 'Reinforced Belt', type: 'belt', rarity: 'Rare', defense: 4, description: 'A simple but effective belt.', icon: '/icons/item-belt.svg'},

};

// Helper function to create a full item object with an ID
export function createItem(itemId: string, quantity: number = 1): Item {
    if (!ITEMS[itemId]) throw new Error(`Item with id ${itemId} not found in ITEMS definition.`);
    const itemData = ITEMS[itemId];
    return { ...itemData, id: itemId, quantity: quantity, allowedClasses: itemData.allowedClasses as PlayerClass[] | undefined };
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
            { itemId: 'health_potion', chance: 0.25, quantity: 1 },
            { itemId: 'rusty_sword', chance: 0.05, quantity: 1 },
            { itemId: 'iron_dagger', chance: 0.05, quantity: 1 },
        ] 
    },
    'slime': { 
        name: 'Slime', 
        icon: '/icons/monster-slime.svg',
        hp: 15, maxHp: 15, attack: 5, defense: 5, 
        greed: 20, power: -50, 
        lootTable: [
             { itemId: 'health_potion', chance: 0.05, quantity: 1 }
        ]
    },
    'orc_grunt': { 
        name: 'Orc Grunt', 
        icon: '/icons/monster-orc.svg',
        hp: 40, maxHp: 40, attack: 12, defense: 4, 
        greed: 85, power: 10,
        lootTable: [
            { itemId: 'health_potion', chance: 0.2, quantity: 2 },
            { itemId: 'iron_helmet', chance: 0.1, quantity: 1 },
            { itemId: 'iron_platebody', chance: 0.05, quantity: 1 },
            { itemId: 'wooden_crossbow', chance: 0.05, quantity: 1 },
        ]
    },
    'ice_elemental': { 
        name: 'Ice Elemental', 
        icon: '/icons/monster-elemental.svg',
        hp: 30, maxHp: 30, attack: 10, defense: 8, 
        greed: 50, power: 5, 
        lootTable: [
            { itemId: 'elixir_of_vigor', chance: 0.25, quantity: 1 },
            { itemId: 'apprentice_wand', chance: 0.1, quantity: 1 },
            { itemId: 'scrying_orb', chance: 0.02, quantity: 1 },
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
            { itemId: 'greater_health_potion', chance: 1, quantity: 3 }
        ]
    }
};

// --- TERRAIN-BASED CONFIGURATION ---

// Defines which monsters can spawn in which terrain type.
export const TERRAIN_MONSTER_SPAWNS: Record<string, { monsterId: string, chance: number }[]> = {
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

// Loot from tiles has been removed as per user request.
// All loot now comes from monster drops.
export const TERRAIN_TILE_LOOT: Record<string, { itemId: string, chance: number, quantity: number }[]> = {
    grass: [],
    tree: [],
    river: [],
    snow: [],
    mountain: [],
    town: [],
    camp: [],
}
