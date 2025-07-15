import type { Item, Monster, PlayerClass } from "@/types/game";

// --- ITEM DEFINITIONS ---
// All items available in the game are defined here.
export const ITEMS: Record<string, Omit<Item, 'id' | 'quantity'>> = {
    // --- Consumables ---
    'health_potion': { name: 'Health Potion', type: 'consumable', rarity: 'Common', hp: 20, description: 'Restores 20 health.', icon: '/icons/item-potion.svg'},
    'greater_health_potion': { name: 'Greater Health Potion', type: 'consumable', rarity: 'Rare', hp: 50, description: 'Restores 50 health.', icon: '/icons/item-potion.svg'},
    'elixir_of_vigor': { name: 'Elixir of Vigor', type: 'consumable', rarity: 'Rare', energyBoost: 1, description: 'Temporarily increases passive energy regeneration.', icon: '/icons/item-crystal.svg'},
    'elixir_of_power': { name: 'Elixir of Power', type: 'consumable', rarity: 'Epic', attack: 5, magicAttack: 5, description: 'Temporarily increases your primary attack stat by 5.', icon: '/icons/item-potion-red.svg'},

    // --- Utility ---
    'scrying_orb': { name: 'Scrying Orb', type: 'utility', rarity: 'Rare', description: 'Reveals monsters in a small radius around you.', icon: '/icons/item-orb.svg'},
    
    // ================================================
    // WARRIOR WEAPONS (SWORDS)
    // ================================================
    // Common
    'warrior_sword_common_balanced': { name: 'Soldier\'s Shortsword', type: 'weapon', rarity: 'Common', attack: 5, description: 'Standard issue for all new recruits.', icon: '/icons/item-sword.svg', allowedClasses: ['warrior'] },
    'warrior_sword_common_crit': { name: 'Fencing Foil', type: 'weapon', rarity: 'Common', attack: 3, criticalChance: 3, description: 'Favors precision over brute force.', icon: '/icons/item-sword.svg', allowedClasses: ['warrior'] },
    'warrior_sword_common_defensive': { name: 'Guard\'s Broadsword', type: 'weapon', rarity: 'Common', attack: 4, defense: 1, description: 'A wide blade, good for parrying.', icon: '/icons/item-sword.svg', allowedClasses: ['warrior'] },
    // Rare
    'warrior_sword_rare_balanced': { name: 'Steel Longsword', type: 'weapon', rarity: 'Rare', attack: 12, description: 'A well-balanced and reliable steel sword.', icon: '/icons/item-sword.svg', allowedClasses: ['warrior'] },
    'warrior_sword_rare_crit': { name: 'Saber of Swift Strikes', type: 'weapon', rarity: 'Rare', attack: 9, criticalChance: 6, description: 'A curved blade that sings through the air.', icon: '/icons/item-sword.svg', allowedClasses: ['warrior'] },
    'warrior_sword_rare_defensive': { name: 'Knight\'s Arming Sword', type: 'weapon', rarity: 'Rare', attack: 10, defense: 3, description: 'The chosen weapon of royal knights.', icon: '/icons/item-sword.svg', allowedClasses: ['warrior'] },
    // Epic
    'warrior_sword_epic_balanced': { name: 'Flame Reaver', type: 'weapon', rarity: 'Epic', attack: 20, criticalChance: 5, description: 'A greatsword imbued with fire.', icon: '/icons/item-sword-fire.svg', allowedClasses: ['warrior'] },
    'warrior_sword_epic_crit': { name: 'Blade of the Whirlwind', type: 'weapon', rarity: 'Epic', attack: 16, criticalChance: 12, description: 'So fast it creates its own gale.', icon: '/icons/item-sword.svg', allowedClasses: ['warrior'] },
    'warrior_sword_epic_defensive': { name: 'Bastion of the Juggernaut', type: 'weapon', rarity: 'Epic', attack: 18, defense: 8, description: 'A sword as much for defense as for offense.', icon: '/icons/item-sword.svg', allowedClasses: ['warrior'] },
    // Legendary
    'warrior_sword_legendary_balanced': { name: 'Dragon\'s Tooth', type: 'weapon', rarity: 'Legendary', attack: 35, criticalChance: 10, description: 'Carved from the fang of an ancient dragon.', icon: '/icons/item-sword.svg', allowedClasses: ['warrior'] },
    'warrior_sword_legendary_crit': { name: 'Soul-Render', type: 'weapon', rarity: 'Legendary', attack: 28, criticalChance: 20, description: 'A blade that thirsts for critical strikes.', icon: '/icons/item-sword-fire.svg', allowedClasses: ['warrior'] },
    'warrior_sword_legendary_defensive': { name: 'Aegis of the Unbroken', type: 'weapon', rarity: 'Legendary', attack: 30, defense: 15, description: 'The ultimate defensive weapon.', icon: '/icons/item-sword.svg', allowedClasses: ['warrior'] },

    // ================================================
    // MAGE WEAPONS (WANDS/STAVES)
    // ================================================
    // Common
    'mage_weapon_common_balanced': { name: 'Apprentice Wand', type: 'weapon', rarity: 'Common', magicAttack: 8, description: 'A simple wand for a magic beginner.', icon: '/icons/item-wand.svg', allowedClasses: ['mage'] },
    'mage_weapon_common_crit': { name: 'Crystal-Tipped Wand', type: 'weapon', rarity: 'Common', magicAttack: 6, criticalChance: 4, description: 'Focuses magic to a fine, sharp point.', icon: '/icons/item-wand.svg', allowedClasses: ['mage'] },
    'mage_weapon_common_energy': { name: 'Gnarled Branch', type: 'weapon', rarity: 'Common', magicAttack: 7, energyBoost: 1, description: 'Thrumming with natural energy.', icon: '/icons/item-wand.svg', allowedClasses: ['mage'] },
    // Rare
    'mage_weapon_rare_balanced': { name: 'Staff of Power', type: 'weapon', rarity: 'Rare', magicAttack: 15, description: 'A staff crackling with magical energy.', icon: '/icons/item-staff.svg', allowedClasses: ['mage'] },
    'mage_weapon_rare_crit': { name: 'Scepter of Focused Arcana', type: 'weapon', rarity: 'Rare', magicAttack: 12, criticalChance: 8, description: 'Ideal for powerful, precise spellcasting.', icon: '/icons/item-scepter.svg', allowedClasses: ['mage'] },
    'mage_weapon_rare_energy': { name: 'Soulwood Staff', type: 'weapon', rarity: 'Rare', magicAttack: 13, energyBoost: 3, description: 'Seems to replenish your energy reserves.', icon: '/icons/item-staff.svg', allowedClasses: ['mage'] },
    // Epic
    'mage_weapon_epic_balanced': { name: 'Voidcaller Scepter', type: 'weapon', rarity: 'Epic', magicAttack: 25, description: 'A scepter that hums with the power of the void.', icon: '/icons/item-scepter.svg', allowedClasses: ['mage'] },
    'mage_weapon_epic_crit': { name: 'Storm-Caller\'s Rod', type: 'weapon', rarity: 'Epic', magicAttack: 20, criticalChance: 15, description: 'Calls down bolts of pure critical energy.', icon: '/icons/item-wand.svg', allowedClasses: ['mage'] },
    'mage_weapon_epic_energy': { name: 'Archmage\'s Greatstaff', type: 'weapon', rarity: 'Epic', magicAttack: 22, energyBoost: 7, description: 'A conduit for immense magical flows.', icon: '/icons/item-staff.svg', allowedClasses: ['mage'] },
    // Legendary
    'mage_weapon_legendary_balanced': { name: 'Celestial Pillar', type: 'weapon', rarity: 'Legendary', magicAttack: 40, criticalChance: 10, description: 'A fragment of a fallen star.', icon: '/icons/item-staff.svg', allowedClasses: ['mage'] },
    'mage_weapon_legendary_crit': { name: 'Wand of a Thousand Curses', type: 'weapon', rarity: 'Legendary', magicAttack: 32, criticalChance: 25, description: 'Each strike finds a fatal weakness.', icon: '/icons/item-wand.svg', allowedClasses: ['mage'] },
    'mage_weapon_legendary_energy': { name: 'Heart of the Mana-Geyser', type: 'weapon', rarity: 'Legendary', magicAttack: 35, energyBoost: 15, description: 'An endless wellspring of power.', icon: '/icons/item-scepter.svg', allowedClasses: ['mage'] },
    
    // ================================================
    // RANGER WEAPONS (CROSSBOWS)
    // ================================================
    // Common
    'ranger_weapon_common_balanced': { name: 'Wooden Crossbow', type: 'weapon', rarity: 'Common', attack: 6, description: 'A standard-issue crossbow.', icon: '/icons/item-crossbow.svg', allowedClasses: ['ranger'] },
    'ranger_weapon_common_crit': { name: 'Light Crossbow', type: 'weapon', rarity: 'Common', attack: 4, criticalChance: 4, description: 'Easy to aim for weak spots.', icon: '/icons/item-crossbow.svg', allowedClasses: ['ranger'] },
    'ranger_weapon_common_heavy': { name: 'Heavy Crossbow', type: 'weapon', rarity: 'Common', attack: 8, criticalChance: -2, description: 'Slow, but packs a punch.', icon: '/icons/item-crossbow.svg', allowedClasses: ['ranger'] },
    // Rare
    'ranger_weapon_rare_balanced': { name: 'Hunter\'s Crossbow', type: 'weapon', rarity: 'Rare', attack: 14, criticalChance: 3, description: 'A precise and deadly crossbow for the skilled hunter.', icon: '/icons/item-crossbow.svg', allowedClasses: ['ranger'] },
    'ranger_weapon_rare_crit': { name: 'Eagle-Eye Repeater', type: 'weapon', rarity: 'Rare', attack: 10, criticalChance: 9, description: 'Perfect for finding chinks in armor.', icon: '/icons/item-crossbow.svg', allowedClasses: ['ranger'] },
    'ranger_weapon_rare_heavy': { name: 'Arbalest', type: 'weapon', rarity: 'Rare', attack: 18, criticalChance: -5, description: 'Can punch through the toughest hides.', icon: '/icons/item-crossbow.svg', allowedClasses: ['ranger'] },
    // Epic
    'ranger_weapon_epic_balanced': { name: 'Storm-Caller', type: 'weapon', rarity: 'Epic', attack: 22, description: 'A crossbow that fires bolts with the speed of lightning.', icon: '/icons/item-crossbow-electric.svg', allowedClasses: ['ranger'] },
    'ranger_weapon_epic_crit': { name: 'Viper-Bite Crossbow', type: 'weapon', rarity: 'Epic', attack: 17, criticalChance: 14, description: 'Bolts laced with a potent, crit-enhancing toxin.', icon: '/icons/item-crossbow.svg', allowedClasses: ['ranger'] },
    'ranger_weapon_epic_heavy': { name: 'Dragon-Slayer\'s Greatbow', type: 'weapon', rarity: 'Epic', attack: 28, criticalChance: -8, description: 'Fires bolts the size of small spears.', icon: '/icons/item-crossbow.svg', allowedClasses: ['ranger'] },
    // Legendary
    'ranger_weapon_legendary_balanced': { name: 'Phoenix Wing', type: 'weapon', rarity: 'Legendary', attack: 38, criticalChance: 12, description: 'Reborn in fire, shoots bolts of flame.', icon: '/icons/item-crossbow-electric.svg', allowedClasses: ['ranger'] },
    'ranger_weapon_legendary_crit': { name: 'Heartseeker', type: 'weapon', rarity: 'Legendary', attack: 30, criticalChance: 28, description: 'It is said this bow never misses its mark.', icon: '/icons/item-crossbow.svg', allowedClasses: ['ranger'] },
    'ranger_weapon_legendary_heavy': { name: 'Ballista of the Colossus', type: 'weapon', rarity: 'Legendary', attack: 45, criticalChance: -15, description: 'More of a siege weapon than a crossbow.', icon: '/icons/item-crossbow.svg', allowedClasses: ['ranger'] },

    // ================================================
    // ASSASSIN WEAPONS (DAGGERS)
    // ================================================
    // Common
    'assassin_weapon_common_balanced': { name: 'Iron Dagger', type: 'weapon', rarity: 'Common', attack: 4, criticalChance: 5, description: 'A swift and silent weapon.', icon: '/icons/item-dagger.svg', allowedClasses: ['assassin'] },
    'assassin_weapon_common_crit': { name: 'Stiletto', type: 'weapon', rarity: 'Common', attack: 3, criticalChance: 8, description: 'A needle-thin blade for finding vital points.', icon: '/icons/item-dagger.svg', allowedClasses: ['assassin'] },
    'assassin_weapon_common_attack': { name: 'Main Gauche', type: 'weapon', rarity: 'Common', attack: 5, criticalChance: 3, description: 'A heavier dagger for direct confrontation.', icon: '/icons/item-dagger.svg', allowedClasses: ['assassin'] },
    // Rare
    'assassin_weapon_rare_balanced': { name: 'Shadowfang Blade', type: 'weapon', rarity: 'Rare', attack: 10, criticalChance: 10, description: 'A dagger coated in a fast-acting venom.', icon: '/icons/item-dagger.svg', allowedClasses: ['assassin'] },
    'assassin_weapon_rare_crit': { name: 'Gut-Ripper', type: 'weapon', rarity: 'Rare', attack: 8, criticalChance: 15, description: 'A cruel, serrated blade.', icon: '/icons/item-dagger.svg', allowedClasses: ['assassin'] },
    'assassin_weapon_rare_attack': { name: 'Blackwood Shiv', type: 'weapon', rarity: 'Rare', attack: 12, criticalChance: 7, description: 'Hardened wood, surprisingly deadly.', icon: '/icons/item-dagger.svg', allowedClasses: ['assassin'] },
    // Epic
    'assassin_weapon_epic_balanced': { name: 'Kingsbane', type: 'weapon', rarity: 'Epic', attack: 18, criticalChance: 15, description: 'A legendary dagger said to have toppled thrones.', icon: '/icons/item-dagger-poison.svg', allowedClasses: ['assassin'] },
    'assassin_weapon_epic_crit': { name: 'Misery\'s End', type: 'weapon', rarity: 'Epic', attack: 14, criticalChance: 22, description: 'A quick end to any unfortunate foe.', icon: '/icons/item-dagger-poison.svg', allowedClasses: ['assassin'] },
    'assassin_weapon_epic_attack': { name: 'Obsidian Razor', type: 'weapon', rarity: 'Epic', attack: 22, criticalChance: 10, description: 'Volcanic glass, sharpened to a molecule-thin edge.', icon: '/icons/item-dagger.svg', allowedClasses: ['assassin'] },
    // Legendary
    'assassin_weapon_legendary_balanced': { name: 'The Whisper', type: 'weapon', rarity: 'Legendary', attack: 32, criticalChance: 25, description: 'They never hear it coming.', icon: '/icons/item-dagger.svg', allowedClasses: ['assassin'] },
    'assassin_weapon_legendary_crit': { name: 'Veil of Nothingness', type: 'weapon', rarity: 'Legendary', attack: 25, criticalChance: 40, description: 'Erases foes from existence with critical strikes.', icon: '/icons/item-dagger-poison.svg', allowedClasses: ['assassin'] },
    'assassin_weapon_legendary_attack': { name: 'Fang of the Betrayer', type: 'weapon', rarity: 'Legendary', attack: 40, criticalChance: 15, description: 'A dagger steeped in ancient treachery.', icon: '/icons/item-dagger.svg', allowedClasses: ['assassin'] },

    // --- Universal Legendary Weapon ---
    'blade_of_the_ancients': { name: 'Blade of the Ancients', type: 'weapon', rarity: 'Legendary', attack: 30, criticalChance: 10, description: 'A powerful blade pulsating with ancient magic. Can be wielded by any class.', icon: '/icons/item-sword.svg'},
    
    // ================================================
    // ARMOR
    // ================================================
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
    const newId = `${itemId}_${new Date().getTime()}_${Math.random()}`;
    return { ...itemData, id: newId, quantity: quantity, allowedClasses: itemData.allowedClasses as PlayerClass[] | undefined };
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
            { itemId: 'warrior_sword_common_balanced', chance: 0.05, quantity: 1 },
            { itemId: 'assassin_weapon_common_balanced', chance: 0.05, quantity: 1 },
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
            { itemId: 'ranger_weapon_common_heavy', chance: 0.05, quantity: 1 },
            { itemId: 'warrior_sword_rare_defensive', chance: 0.02, quantity: 1 },
        ]
    },
    'ice_elemental': { 
        name: 'Ice Elemental', 
        icon: '/icons/monster-elemental.svg',
        hp: 30, maxHp: 30, attack: 10, defense: 8, 
        greed: 50, power: 5, 
        lootTable: [
            { itemId: 'elixir_of_vigor', chance: 0.25, quantity: 1 },
            { itemId: 'mage_weapon_common_balanced', chance: 0.1, quantity: 1 },
            { itemId: 'scrying_orb', chance: 0.02, quantity: 1 },
            { itemId: 'mage_weapon_rare_crit', chance: 0.03, quantity: 1 },
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
            { itemId: 'greater_health_potion', chance: 1, quantity: 3 },
            { itemId: 'warrior_sword_legendary_balanced', chance: 0.1, quantity: 1 },
            { itemId: 'mage_weapon_legendary_balanced', chance: 0.1, quantity: 1 },
            { itemId: 'ranger_weapon_legendary_balanced', chance: 0.1, quantity: 1 },
            { itemId: 'assassin_weapon_legendary_balanced', chance: 0.1, quantity: 1 },
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
