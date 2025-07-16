
import type { Item, Monster, PlayerClass } from "@/types/game";

// --- ITEM DEFINITIONS ---
// All items available in the game are defined here.
export const ITEMS: Record<string, Omit<Item, 'id' | 'quantity' | 'itemId'>> = {
    // --- Consumables ---
    'health_potion': { name: 'Health Potion', type: 'consumable', rarity: 'Common', hp: 20, description: 'Restores 20 health.', icon: '/icons/item-potion.svg'},
    'greater_health_potion': { name: 'Greater Health Potion', type: 'consumable', rarity: 'Rare', hp: 50, description: 'Restores 50 health.', icon: '/icons/item-potion.svg'},
    'elixir_of_power': { name: 'Elixir of Power', type: 'consumable', rarity: 'Epic', attack: 5, magicAttack: 5, description: 'Temporarily increases your primary attack stat by 5.', icon: '/icons/item-potion-red.svg'},
    'elixir_of_haste': { name: 'Elixir of Haste', type: 'consumable', rarity: 'Rare', description: 'Increases stamina regeneration by 20% for 60 seconds.', icon: '/icons/item-potion-yellow.svg', staminaRegenBonus: 0.2, effectDuration: 60 },
    'potion_of_iron_skin': { name: 'Potion of Iron Skin', type: 'consumable', rarity: 'Rare', armor: 20, effectDuration: 30, description: 'Increases Armor by 20 for 30 seconds.', icon: '/icons/item-potion-grey.svg'},
    'potion_of_magic_barrier': { name: 'Potion of Magic Barrier', type: 'consumable', rarity: 'Rare', magicResist: 20, effectDuration: 30, description: 'Increases Magic Resist by 20 for 30 seconds.', icon: '/icons/item-potion-blue.svg'},
    'potion_of_swiftness': { name: 'Potion of Swiftness', type: 'consumable', rarity: 'Rare', evasion: 15, effectDuration: 30, description: 'Increases Evasion by 15% for 30 seconds.', icon: '/icons/item-potion-green.svg'},
    'tome_of_knowledge': { name: 'Tome of Knowledge', type: 'utility', rarity: 'Rare', xpGainBonus: 10, description: 'Permanently increases all experience gain by 10%.', icon: '/icons/item-book.svg'},


    // --- Utility ---
    'scrying_orb': { name: 'Scrying Orb', type: 'utility', rarity: 'Rare', description: 'Reveals monsters in a small radius around you.', icon: '/icons/item-orb.svg', scoutRange: 2},
    'adventurers_pack': { name: 'Adventurer\'s Pack', type: 'quest', rarity: 'Rare', description: 'Permanently increases your inventory size by 4 slots.', icon: '/icons/item-pack.svg', inventorySlots: 4},
    
    // ================================================
    // WARRIOR WEAPONS (SWORDS)
    // ================================================
    // Common
    'warrior_sword_common_balanced': { name: 'Soldier\'s Shortsword', type: 'weapon', rarity: 'Common', attack: 5, defense: 1, description: 'Standard issue for all new recruits.', icon: '/icons/item-sword.svg', allowedClasses: ['warrior'] },
    'warrior_sword_common_crit': { name: 'Fencing Foil', type: 'weapon', rarity: 'Common', attack: 3, criticalChance: 3, description: 'Favors precision over brute force.', icon: '/icons/item-sword.svg', allowedClasses: ['warrior'] },
    'warrior_sword_common_defensive': { name: 'Guard\'s Broadsword', type: 'weapon', rarity: 'Common', attack: 4, defense: 2, armor: 1, description: 'A wide blade, good for parrying.', icon: '/icons/item-sword.svg', allowedClasses: ['warrior'] },
    // Rare
    'warrior_sword_rare_balanced': { name: 'Steel Longsword', type: 'weapon', rarity: 'Rare', attack: 12, defense: 2, initiative: 5, description: 'A well-balanced and reliable steel sword.', icon: '/icons/item-sword.svg', allowedClasses: ['warrior'] },
    'warrior_sword_rare_crit': { name: 'Saber of Swift Strikes', type: 'weapon', rarity: 'Rare', attack: 9, criticalChance: 6, evasion: 2, description: 'A curved blade that sings through the air.', icon: '/icons/item-sword.svg', allowedClasses: ['warrior'] },
    'warrior_sword_rare_defensive': { name: 'Knight\'s Arming Sword', type: 'weapon', rarity: 'Rare', attack: 10, defense: 3, armor: 3, description: 'The chosen weapon of royal knights.', icon: '/icons/item-sword.svg', allowedClasses: ['warrior'] },
    // Epic
    'warrior_sword_epic_balanced': { name: 'Flame Reaver', type: 'weapon', rarity: 'Epic', attack: 20, criticalChance: 5, magicResist: 5, doubleHitChance: 5, description: 'A greatsword imbued with fire that strikes with startling speed.', icon: '/icons/item-sword-fire.svg', allowedClasses: ['warrior'] },
    'warrior_sword_epic_crit': { name: 'Blade of the Whirlwind', type: 'weapon', rarity: 'Epic', attack: 16, criticalChance: 12, evasion: 4, initiative: 10, description: 'So fast it creates its own gale.', icon: '/icons/item-sword.svg', allowedClasses: ['warrior'] },
    'warrior_sword_epic_defensive': { name: 'Bastion of the Juggernaut', type: 'weapon', rarity: 'Epic', attack: 18, defense: 8, armor: 5, description: 'A sword as much for defense as for offense.', icon: '/icons/item-sword.svg', allowedClasses: ['warrior'] },
    // Legendary
    'warrior_sword_legendary_balanced': { name: 'Dragon\'s Tooth', type: 'weapon', rarity: 'Legendary', attack: 35, defense: 5, criticalChance: 10, magicResist: 10, initiative: 15, doubleHitChance: 10, description: 'Carved from the fang of an ancient dragon, it bites twice.', icon: '/icons/item-sword.svg', allowedClasses: ['warrior'] },
    'warrior_sword_legendary_crit': { name: 'Soul-Render', type: 'weapon', rarity: 'Legendary', attack: 28, criticalChance: 20, evasion: 5, lootLuck: 10, description: 'A blade that thirsts for critical strikes and enemy treasures.', icon: '/icons/item-sword-fire.svg', allowedClasses: ['warrior'] },
    'warrior_sword_legendary_defensive': { name: 'Aegis of the Unbroken', type: 'weapon', rarity: 'Legendary', attack: 30, defense: 15, armor: 10, magicResist: 5, description: 'The ultimate defensive weapon.', icon: '/icons/item-sword.svg', allowedClasses: ['warrior'] },

    // ================================================
    // MAGE WEAPONS (WANDS/STAVES)
    // ================================================
    // Common
    'mage_weapon_common_balanced': { name: 'Apprentice Wand', type: 'weapon', rarity: 'Common', magicAttack: 8, magicResist: 1, description: 'A simple wand for a magic beginner.', icon: '/icons/item-wand.svg', allowedClasses: ['mage'] },
    'mage_weapon_common_crit': { name: 'Crystal-Tipped Wand', type: 'weapon', rarity: 'Common', magicAttack: 6, criticalChance: 4, description: 'Focuses magic to a fine, sharp point.', icon: '/icons/item-wand.svg', allowedClasses: ['mage'] },
    'mage_weapon_common_defensive': { name: 'Gnarled Branch', type: 'weapon', rarity: 'Common', magicAttack: 7, defense: 1, staminaBoost: 5, description: 'Thrumming with natural energy.', icon: '/icons/item-wand.svg', allowedClasses: ['mage'] },
    // Rare
    'mage_weapon_rare_balanced': { name: 'Staff of Power', type: 'weapon', rarity: 'Rare', magicAttack: 15, magicResist: 3, xpGainBonus: 5, description: 'A staff crackling with magical energy that hums with knowledge.', icon: '/icons/item-staff.svg', allowedClasses: ['mage'] },
    'mage_weapon_rare_crit': { name: 'Scepter of Focused Arcana', type: 'weapon', rarity: 'Rare', magicAttack: 12, criticalChance: 8, initiative: 5, description: 'Ideal for powerful, precise spellcasting.', icon: '/icons/item-scepter.svg', allowedClasses: ['mage'] },
    'mage_weapon_rare_defensive': { name: 'Soulwood Staff', type: 'weapon', rarity: 'Rare', magicAttack: 13, defense: 2, staminaBoost: 10, description: 'Seems to replenish your stamina reserves.', icon: '/icons/item-staff.svg', allowedClasses: ['mage'] },
    // Epic
    'mage_weapon_epic_balanced': { name: 'Voidcaller Scepter', type: 'weapon', rarity: 'Epic', magicAttack: 25, magicResist: 5, lootLuck: 10, description: 'A scepter that hums with the power of the void, pulling valuables from defeated foes.', icon: '/icons/item-scepter.svg', allowedClasses: ['mage'] },
    'mage_weapon_epic_crit': { name: 'Storm-Caller\'s Rod', type: 'weapon', rarity: 'Epic', magicAttack: 20, criticalChance: 15, doubleHitChance: 5, description: 'Calls down bolts of pure critical energy.', icon: '/icons/item-wand.svg', allowedClasses: ['mage'] },
    'mage_weapon_epic_defensive': { name: 'Archmage\'s Greatstaff', type: 'weapon', rarity: 'Epic', magicAttack: 22, defense: 5, staminaBoost: 15, xpGainBonus: 10, description: 'A conduit for immense magical flows and profound wisdom.', icon: '/icons/item-staff.svg', allowedClasses: ['mage'] },
    // Legendary
    'mage_weapon_legendary_balanced': { name: 'Celestial Pillar', type: 'weapon', rarity: 'Legendary', magicAttack: 40, magicResist: 10, criticalChance: 10, doubleHitChance: 10, description: 'A fragment of a fallen star that strikes twice.', icon: '/icons/item-staff.svg', allowedClasses: ['mage'] },
    'mage_weapon_legendary_crit': { name: 'Wand of a Thousand Curses', type: 'weapon', rarity: 'Legendary', magicAttack: 32, criticalChance: 25, lootLuck: 15, description: 'Each strike finds a fatal weakness and the treasure it guards.', icon: '/icons/item-wand.svg', allowedClasses: ['mage'] },
    'mage_weapon_legendary_defensive': { name: 'Heart of the Mana-Geyser', type: 'weapon', rarity: 'Legendary', magicAttack: 35, defense: 10, staminaBoost: 25, xpGainBonus: 20, description: 'An endless wellspring of power and insight.', icon: '/icons/item-scepter.svg', allowedClasses: ['mage'] },
    
    // ================================================
    // RANGER WEAPONS (CROSSBOWS)
    // ================================================
    // Common
    'ranger_weapon_common_balanced': { name: 'Wooden Crossbow', type: 'weapon', rarity: 'Common', attack: 6, evasion: 1, description: 'A standard-issue crossbow.', icon: '/icons/item-crossbow.svg', allowedClasses: ['ranger'] },
    'ranger_weapon_common_crit': { name: 'Light Crossbow', type: 'weapon', rarity: 'Common', attack: 4, criticalChance: 4, description: 'Easy to aim for weak spots.', icon: '/icons/item-crossbow.svg', allowedClasses: ['ranger'] },
    'ranger_weapon_common_heavy': { name: 'Heavy Crossbow', type: 'weapon', rarity: 'Common', attack: 8, criticalChance: -2, defense: 1, description: 'Slow, but packs a punch.', icon: '/icons/item-crossbow.svg', allowedClasses: ['ranger'] },
    // Rare
    'ranger_weapon_rare_balanced': { name: 'Hunter\'s Crossbow', type: 'weapon', rarity: 'Rare', attack: 14, evasion: 2, criticalChance: 3, initiative: 5, description: 'A precise and deadly crossbow for the skilled hunter.', icon: '/icons/item-crossbow.svg', allowedClasses: ['ranger'] },
    'ranger_weapon_rare_crit': { name: 'Eagle-Eye Repeater', type: 'weapon', rarity: 'Rare', attack: 10, criticalChance: 9, scoutRange: 1, description: 'Perfect for finding chinks in armor.', icon: '/icons/item-crossbow.svg', allowedClasses: ['ranger'] },
    'ranger_weapon_rare_heavy': { name: 'Arbalest', type: 'weapon', rarity: 'Rare', attack: 18, criticalChance: -5, armor: 2, description: 'Can punch through the toughest hides.', icon: '/icons/item-crossbow.svg', allowedClasses: ['ranger'] },
    // Epic
    'ranger_weapon_epic_balanced': { name: 'Storm-Caller', type: 'weapon', rarity: 'Epic', attack: 22, evasion: 4, criticalChance: 5, doubleHitChance: 7, description: 'A crossbow that fires bolts with the speed of lightning.', icon: '/icons/item-crossbow-electric.svg', allowedClasses: ['ranger'] },
    'ranger_weapon_epic_crit': { name: 'Viper-Bite Crossbow', type: 'weapon', rarity: 'Epic', attack: 17, criticalChance: 14, lootLuck: 7, description: 'Bolts laced with a potent, crit-enhancing toxin that helps find valuables.', icon: '/icons/item-crossbow.svg', allowedClasses: ['ranger'] },
    'ranger_weapon_epic_heavy': { name: 'Dragon-Slayer\'s Greatbow', type: 'weapon', rarity: 'Epic', attack: 28, criticalChance: -8, armor: 5, description: 'Fires bolts the size of small spears.', icon: '/icons/item-crossbow.svg', allowedClasses: ['ranger'] },
    // Legendary
    'ranger_weapon_legendary_balanced': { name: 'Phoenix Wing', type: 'weapon', rarity: 'Legendary', attack: 38, evasion: 8, criticalChance: 12, doubleHitChance: 12, description: 'Reborn in fire, shoots bolts of flame that strike twice.', icon: '/icons/item-crossbow-electric.svg', allowedClasses: ['ranger'] },
    'ranger_weapon_legendary_crit': { name: 'Heartseeker', type: 'weapon', rarity: 'Legendary', attack: 30, criticalChance: 28, scoutRange: 3, description: 'It is said this bow never misses its mark, nor the horizon.', icon: '/icons/item-crossbow.svg', allowedClasses: ['ranger'] },
    'ranger_weapon_legendary_heavy': { name: 'Ballista of the Colossus', type: 'weapon', rarity: 'Legendary', attack: 45, criticalChance: -15, armor: 10, initiative: -10, description: 'More of a siege weapon than a crossbow.', icon: '/icons/item-crossbow.svg', allowedClasses: ['ranger'] },

    // ================================================
    // ASSASSIN WEAPONS (DAGGERS)
    // ================================================
    // Common
    'assassin_weapon_common_balanced': { name: 'Iron Dagger', type: 'weapon', rarity: 'Common', attack: 4, criticalChance: 5, evasion: 1, description: 'A swift and silent weapon.', icon: '/icons/item-dagger.svg', allowedClasses: ['assassin'] },
    'assassin_weapon_common_crit': { name: 'Stiletto', type: 'weapon', rarity: 'Common', attack: 3, criticalChance: 8, description: 'A needle-thin blade for finding vital points.', icon: '/icons/item-dagger.svg', allowedClasses: ['assassin'] },
    'assassin_weapon_common_attack': { name: 'Main Gauche', type: 'weapon', rarity: 'Common', attack: 5, criticalChance: 3, defense: 1, description: 'A heavier dagger for direct confrontation.', icon: '/icons/item-dagger.svg', allowedClasses: ['assassin'] },
    // Rare
    'assassin_weapon_rare_balanced': { name: 'Shadowfang Blade', type: 'weapon', rarity: 'Rare', attack: 10, criticalChance: 10, evasion: 2, initiative: 7, description: 'A dagger coated in a fast-acting venom.', icon: '/icons/item-dagger.svg', allowedClasses: ['assassin'] },
    'assassin_weapon_rare_crit': { name: 'Gut-Ripper', type: 'weapon', rarity: 'Rare', attack: 8, criticalChance: 15, lootLuck: 5, description: 'A cruel, serrated blade that uncovers enemy weak points and valuables.', icon: '/icons/item-dagger.svg', allowedClasses: ['assassin'] },
    'assassin_weapon_rare_attack': { name: 'Blackwood Shiv', type: 'weapon', rarity: 'Rare', attack: 12, criticalChance: 7, defense: 2, description: 'Hardened wood, surprisingly deadly.', icon: '/icons/item-dagger.svg', allowedClasses: ['assassin'] },
    // Epic
    'assassin_weapon_epic_balanced': { name: 'Kingsbane', type: 'weapon', rarity: 'Epic', attack: 18, criticalChance: 15, evasion: 4, doubleHitChance: 8, description: 'A legendary dagger said to have toppled thrones with two quick strikes.', icon: '/icons/item-dagger-poison.svg', allowedClasses: ['assassin'] },
    'assassin_weapon_epic_crit': { name: 'Misery\'s End', type: 'weapon', rarity: 'Epic', attack: 14, criticalChance: 22, initiative: 12, description: 'A quick end to any unfortunate foe.', icon: '/icons/item-dagger-poison.svg', allowedClasses: ['assassin'] },
    'assassin_weapon_epic_attack': { name: 'Obsidian Razor', type: 'weapon', rarity: 'Epic', attack: 22, criticalChance: 10, defense: 4, description: 'Volcanic glass, sharpened to a molecule-thin edge.', icon: '/icons/item-dagger.svg', allowedClasses: ['assassin'] },
    // Legendary
    'assassin_weapon_legendary_balanced': { name: 'The Whisper', type: 'weapon', rarity: 'Legendary', attack: 32, criticalChance: 25, evasion: 10, initiative: 20, doubleHitChance: 15, description: 'They never hear it coming, twice.', icon: '/icons/item-dagger.svg', allowedClasses: ['assassin'] },
    'assassin_weapon_legendary_crit': { name: 'Veil of Nothingness', type: 'weapon', rarity: 'Legendary', attack: 25, criticalChance: 40, lootLuck: 20, description: 'Erases foes from existence with critical strikes, leaving only their valuables behind.', icon: '/icons/item-dagger-poison.svg', allowedClasses: ['assassin'] },
    'assassin_weapon_legendary_attack': { name: 'Fang of the Betrayer', type: 'weapon', rarity: 'Legendary', attack: 40, criticalChance: 15, defense: 8, description: 'A dagger steeped in ancient treachery.', icon: '/icons/item-dagger.svg', allowedClasses: ['assassin'] },

    // --- Universal Legendary Weapon ---
    'blade_of_the_ancients': { name: 'Blade of the Ancients', type: 'weapon', rarity: 'Legendary', attack: 30, criticalChance: 10, defense: 10, initiative: 10, doubleHitChance: 5, lootLuck: 5, xpGainBonus: 5, description: 'A powerful blade pulsating with ancient magic. Can be wielded by any class.', icon: '/icons/item-sword.svg'},
    
    // ================================================
    // ARMOR - BODY
    // ================================================

    // --- Warrior Armor ---
    'warrior_armor_common_balanced': { name: 'Iron Platebody', type: 'armor', rarity: 'Common', defense: 4, armor: 6, description: 'Solid protection for the torso.', icon: '/icons/item-armor.svg', allowedClasses: ['warrior']},
    'warrior_armor_common_offensive': { name: 'Brawler\'s Harness', type: 'armor', rarity: 'Common', defense: 2, armor: 4, attack: 1, description: 'Less protection, more freedom to move.', icon: '/icons/item-armor.svg', allowedClasses: ['warrior']},
    'warrior_armor_common_defensive': { name: 'Reinforced Mail', type: 'armor', rarity: 'Common', defense: 5, armor: 8, magicResist: 2, description: 'Extra plating where it counts.', icon: '/icons/item-armor.svg', allowedClasses: ['warrior']},
    'warrior_armor_rare_balanced': { name: 'Steel Platebody', type: 'armor', rarity: 'Rare', defense: 8, armor: 12, initiative: -5, description: 'Superb steel protection.', icon: '/icons/item-armor.svg', allowedClasses: ['warrior']},
    'warrior_armor_rare_offensive': { name: 'Berserker\'s Raiment', type: 'armor', rarity: 'Rare', defense: 6, armor: 9, attack: 3, description: 'For those who favor attack over all.', icon: '/icons/item-armor.svg', allowedClasses: ['warrior']},
    'warrior_armor_rare_defensive': { name: 'Knight\'s Full Plate', type: 'armor', rarity: 'Rare', defense: 10, armor: 15, magicResist: 4, description: 'The pinnacle of defensive craftsmanship.', icon: '/icons/item-armor.svg', allowedClasses: ['warrior']},
    'warrior_armor_epic_balanced': { name: 'Plate of the Citadel', type: 'armor', rarity: 'Epic', defense: 14, armor: 20, attack: 5, description: 'Immovable and inspiring.', icon: '/icons/item-armor.svg', allowedClasses: ['warrior']},
    'warrior_armor_epic_offensive': { name: 'Gladiator\'s War-Plate', type: 'armor', rarity: 'Epic', defense: 10, armor: 15, attack: 8, criticalChance: 5, doubleHitChance: 3, description: 'Adorned with symbols of victory.', icon: '/icons/item-armor.svg', allowedClasses: ['warrior']},
    'warrior_armor_epic_defensive': { name: 'Juggernaut\'s Embrace', type: 'armor', rarity: 'Epic', defense: 18, armor: 25, magicResist: 8, description: 'Like being encased in a mountain.', icon: '/icons/item-armor.svg', allowedClasses: ['warrior']},
    'warrior_armor_legendary_balanced': { name: 'Dragonscale Plate', type: 'armor', rarity: 'Legendary', defense: 22, armor: 30, magicResist: 10, attack: 10, description: 'Impervious to all but the mightiest blows.', icon: '/icons/item-armor.svg', allowedClasses: ['warrior']},
    'warrior_armor_legendary_offensive': { name: 'Armor of Unending Fury', type: 'armor', rarity: 'Legendary', defense: 16, armor: 22, attack: 15, criticalChance: 8, doubleHitChance: 7, description: 'The more you are hit, the harder you strike.', icon: '/icons/item-armor.svg', allowedClasses: ['warrior']},
    'warrior_armor_legendary_defensive': { name: 'Bulwark of the Ancients', type: 'armor', rarity: 'Legendary', defense: 28, armor: 40, magicResist: 15, description: 'Has weathered a thousand years of war.', icon: '/icons/item-armor.svg', allowedClasses: ['warrior']},

    // --- Mage Armor ---
    'mage_armor_common_balanced': { name: 'Enchanted Robes', type: 'armor', rarity: 'Common', defense: 2, magicResist: 4, description: 'Robes woven with protective spells.', icon: '/icons/item-robe.svg', allowedClasses: ['mage']},
    'mage_armor_common_offensive': { name: 'Acolyte\'s Vestments', type: 'armor', rarity: 'Common', defense: 1, magicResist: 2, magicAttack: 2, description: 'Focuses power, but offers little protection.', icon: '/icons/item-robe.svg', allowedClasses: ['mage']},
    'mage_armor_common_defensive': { name: 'Woven Linen Robes', type: 'armor', rarity: 'Common', defense: 3, magicResist: 5, staminaBoost: 5, description: 'Thick robes that are surprisingly tough.', icon: '/icons/item-robe.svg', allowedClasses: ['mage']},
    'mage_armor_rare_balanced': { name: 'Sorcerer\'s Robes', type: 'armor', rarity: 'Rare', defense: 4, magicResist: 8, magicAttack: 4, xpGainBonus: 5, description: 'Fine robes for a skilled spellcaster.', icon: '/icons/item-robe.svg', allowedClasses: ['mage']},
    'mage_armor_rare_offensive': { name: 'Robes of Raw Power', type: 'armor', rarity: 'Rare', defense: 2, magicResist: 4, magicAttack: 7, description: 'Sacrifices all defense for pure offense.', icon: '/icons/item-robe.svg', allowedClasses: ['mage']},
    'mage_armor_rare_defensive': { name: 'Barrier Robes', type: 'armor', rarity: 'Rare', defense: 6, magicResist: 12, staminaBoost: 10, description: 'Shimmers with a protective field.', icon: '/icons/item-robe.svg', allowedClasses: ['mage']},
    'mage_armor_epic_balanced': { name: 'Archmage\'s Robes', type: 'armor', rarity: 'Epic', defense: 8, magicResist: 15, magicAttack: 10, xpGainBonus: 10, description: 'Worn only by the most powerful mages.', icon: '/icons/item-robe.svg', allowedClasses: ['mage']},
    'mage_armor_epic_offensive': { name: 'Void-Woven Robes', type: 'armor', rarity: 'Epic', defense: 5, magicResist: 10, magicAttack: 15, criticalChance: 5, description: 'Stitched with threads of pure darkness.', icon: '/icons/item-robe.svg', allowedClasses: ['mage']},
    'mage_armor_epic_defensive': { name: 'Runic Robes of Warding', type: 'armor', rarity: 'Epic', defense: 10, magicResist: 20, staminaBoost: 15, description: 'Covered in runes of protection.', icon: '/icons/item-robe.svg', allowedClasses: ['mage']},
    'mage_armor_legendary_balanced': { name: 'Celestial Raiment', type: 'armor', rarity: 'Legendary', defense: 14, magicResist: 25, magicAttack: 18, xpGainBonus: 15, description: 'Woven from starlight itself.', icon: '/icons/item-robe.svg', allowedClasses: ['mage']},
    'mage_armor_legendary_offensive': { name: 'Robes of the Arcanist-God', type: 'armor', rarity: 'Legendary', defense: 10, magicResist: 15, magicAttack: 25, criticalChance: 10, doubleHitChance: 10, description: 'Unleashes devastating power.', icon: '/icons/item-robe.svg', allowedClasses: ['mage']},
    'mage_armor_legendary_defensive': { name: 'Mantle of the Timeless', type: 'armor', rarity: 'Legendary', defense: 18, magicResist: 35, staminaBoost: 25, description: 'A robe that exists outside of time.', icon: '/icons/item-robe.svg', allowedClasses: ['mage']},

    // --- Ranger Armor ---
    'ranger_armor_common_balanced': { name: 'Leather Tunic', type: 'armor', rarity: 'Common', defense: 3, evasion: 3, description: 'Basic leather protection.', icon: '/icons/item-tunic.svg', allowedClasses: ['ranger']},
    'ranger_armor_common_offensive': { name: 'Trapper\'s Jerkin', type: 'armor', rarity: 'Common', defense: 2, evasion: 2, criticalChance: 2, description: 'Lightweight for quick movements.', icon: '/icons/item-tunic.svg', allowedClasses: ['ranger']},
    'ranger_armor_common_defensive': { name: 'Hardened Leather Tunic', type: 'armor', rarity: 'Common', defense: 4, armor: 2, evasion: 1, description: 'Tougher than it looks.', icon: '/icons/item-tunic.svg', allowedClasses: ['ranger']},
    'ranger_armor_rare_balanced': { name: 'Hunter\'s Leathers', type: 'armor', rarity: 'Rare', defense: 6, evasion: 6, criticalChance: 3, scoutRange: 1, description: 'Perfect for tracking prey.', icon: '/icons/item-tunic.svg', allowedClasses: ['ranger']},
    'ranger_armor_rare_offensive': { name: 'Stalker\'s Garb', type: 'armor', rarity: 'Rare', defense: 4, evasion: 5, criticalChance: 6, description: 'Blends into the shadows.', icon: '/icons/item-tunic.svg', allowedClasses: ['ranger']},
    'ranger_armor_rare_defensive': { name: 'Beast-Hide Armor', type: 'armor', rarity: 'Rare', defense: 8, armor: 5, evasion: 3, description: 'Made from the hide of a great beast.', icon: '/icons/item-tunic.svg', allowedClasses: ['ranger']},
    'ranger_armor_epic_balanced': { name: 'Wild-Walker\'s Tunic', type: 'armor', rarity: 'Epic', defense: 10, evasion: 10, criticalChance: 7, scoutRange: 2, description: 'Allows silent movement through any terrain.', icon: '/icons/item-tunic.svg', allowedClasses: ['ranger']},
    'ranger_armor_epic_offensive': { name: 'Armor of the Swift Arrow', type: 'armor', rarity: 'Epic', defense: 7, evasion: 8, criticalChance: 12, attack: 4, initiative: 5, description: 'Makes your shots fly truer.', icon: '/icons/item-tunic.svg', allowedClasses: ['ranger']},
    'ranger_armor_epic_defensive': { name: 'Guardian\'s Scale Mail', type: 'armor', rarity: 'Epic', defense: 12, armor: 8, evasion: 6, description: 'Flexible scales that deflect blows.', icon: '/icons/item-tunic.svg', allowedClasses: ['ranger']},
    'ranger_armor_legendary_balanced': { name: 'Dragon-Scale Vest', type: 'armor', rarity: 'Legendary', defense: 16, evasion: 15, criticalChance: 12, attack: 8, scoutRange: 3, description: 'Light, flexible, and nearly impenetrable.', icon: '/icons/item-tunic.svg', allowedClasses: ['ranger']},
    'ranger_armor_legendary_offensive': { name: 'Mantle of the Eagle-Eye', type: 'armor', rarity: 'Legendary', defense: 12, evasion: 12, criticalChance: 20, attack: 10, initiative: 10, description: 'You see all, and hit all.', icon: '/icons/item-tunic.svg', allowedClasses: ['ranger']},
    'ranger_armor_legendary_defensive': { name: 'Hide of the World-Turtle', type: 'armor', rarity: 'Legendary', defense: 20, armor: 15, evasion: 8, description: 'Impossibly tough and resilient.', icon: '/icons/item-tunic.svg', allowedClasses: ['ranger']},

    // --- Assassin Armor ---
    'assassin_armor_common_balanced': { name: 'Dark Leather Jerkin', type: 'armor', rarity: 'Common', defense: 2, evasion: 4, criticalChance: 3, description: 'Silent and flexible armor.', icon: '/icons/item-jerkin.svg', allowedClasses: ['assassin']},
    'assassin_armor_common_offensive': { name: 'Shadow-Stitched Vest', type: 'armor', rarity: 'Common', defense: 1, evasion: 3, criticalChance: 5, description: 'Barely there, but enhances critical strikes.', icon: '/icons/item-jerkin.svg', allowedClasses: ['assassin']},
    'assassin_armor_common_defensive': { name: 'Reinforced Jerkin', type: 'armor', rarity: 'Common', defense: 3, armor: 2, evasion: 2, criticalChance: 1, description: 'A bit of extra padding for risky jobs.', icon: '/icons/item-jerkin.svg', allowedClasses: ['assassin']},
    'assassin_armor_rare_balanced': { name: 'Nightshade Leathers', type: 'armor', rarity: 'Rare', defense: 5, evasion: 8, criticalChance: 7, initiative: 5, description: 'Dyed with poisonous plants.', icon: '/icons/item-jerkin.svg', allowedClasses: ['assassin']},
    'assassin_armor_rare_offensive': { name: 'Cutthroat\'s Garb', type: 'armor', rarity: 'Rare', defense: 3, evasion: 6, criticalChance: 10, attack: 2, description: 'Designed for ruthless efficiency.', icon: '/icons/item-jerkin.svg', allowedClasses: ['assassin']},
    'assassin_armor_rare_defensive': { name: 'Armor of the Unseen', type: 'armor', rarity: 'Rare', defense: 7, armor: 4, evasion: 5, criticalChance: 4, description: 'Helps you escape after the strike.', icon: '/icons/item-jerkin.svg', allowedClasses: ['assassin']},
    'assassin_armor_epic_balanced': { name: 'Silent Death Armor', type: 'armor', rarity: 'Epic', defense: 9, evasion: 12, criticalChance: 12, attack: 3, initiative: 10, description: 'Your enemies never hear you coming.', icon: '/icons/item-jerkin.svg', allowedClasses: ['assassin']},
    'assassin_armor_epic_offensive': { name: 'Blade-Dancer\'s Tunic', type: 'armor', rarity: 'Epic', defense: 6, evasion: 10, criticalChance: 18, attack: 5, doubleHitChance: 5, description: 'A whirlwind of death.', icon: '/icons/item-jerkin.svg', allowedClasses: ['assassin']},
    'assassin_armor_epic_defensive': { name: 'Ghostweave Armor', type: 'armor', rarity: 'Epic', defense: 12, armor: 6, evasion: 8, criticalChance: 8, description: 'Almost ethereal protection.', icon: '/icons/item-jerkin.svg', allowedClasses: ['assassin']},
    'assassin_armor_legendary_balanced': { name: 'Liars\'s Embrace', type: 'armor', rarity: 'Legendary', defense: 14, evasion: 18, criticalChance: 20, attack: 10, initiative: 15, description: 'The perfect tool for a perfect betrayal.', icon: '/icons/item-jerkin.svg', allowedClasses: ['assassin']},
    'assassin_armor_legendary_offensive': { name: 'Vestments of the Faceless Man', type: 'armor', rarity: 'Legendary', defense: 10, evasion: 15, criticalChance: 30, attack: 12, doubleHitChance: 10, description: 'Become no one.', icon: '/icons/item-jerkin.svg', allowedClasses: ['assassin']},
    'assassin_armor_legendary_defensive': { name: 'Shroud of Eternal Misdirection', type: 'armor', rarity: 'Legendary', defense: 18, armor: 10, evasion: 15, criticalChance: 15, description: 'They can\'t hit what they can\'t see.', icon: '/icons/item-jerkin.svg', allowedClasses: ['assassin']},

    // ================================================
    // HELMETS
    // ================================================

    // --- Warrior Helmets ---
    'warrior_helmet_common_balanced': { name: 'Iron Helmet', type: 'helmet', rarity: 'Common', defense: 2, armor: 3, description: 'A sturdy iron helmet.', icon: '/icons/item-helmet.svg', allowedClasses: ['warrior']},
    'warrior_helmet_common_offensive': { name: 'Spiked Helm', type: 'helmet', rarity: 'Common', defense: 1, armor: 2, attack: 1, description: 'An intimidating, offensive helm.', icon: '/icons/item-helmet.svg', allowedClasses: ['warrior']},
    'warrior_helmet_common_defensive': { name: 'Greathelm', type: 'helmet', rarity: 'Common', defense: 2, armor: 4, magicResist: 1, description: 'Full-face protection.', icon: '/icons/item-helmet.svg', allowedClasses: ['warrior']},
    'warrior_helmet_rare_balanced': { name: 'Steel Helmet', type: 'helmet', rarity: 'Rare', defense: 4, armor: 6, description: 'Finely crafted steel headwear.', icon: '/icons/item-helmet.svg', allowedClasses: ['warrior']},
    'warrior_helmet_rare_offensive': { name: 'Vanguard\'s Helm', type: 'helmet', rarity: 'Rare', defense: 3, armor: 4, attack: 2, initiative: 3, description: 'Lead the charge with this helm.', icon: '/icons/item-helmet.svg', allowedClasses: ['warrior']},
    'warrior_helmet_rare_defensive': { name: 'Sentinel\'s Bascinet', type: 'helmet', rarity: 'Rare', defense: 5, armor: 8, magicResist: 2, description: 'A helm for the unbreachable wall.', icon: '/icons/item-helmet.svg', allowedClasses: ['warrior']},
    'warrior_helmet_epic_balanced': { name: 'Champion\'s Helm', type: 'helmet', rarity: 'Epic', defense: 7, armor: 10, attack: 3, lootLuck: 5, description: 'The helm of a true arena champion.', icon: '/icons/item-helmet.svg', allowedClasses: ['warrior']},
    'warrior_helmet_epic_offensive': { name: 'Helm of Fury', type: 'helmet', rarity: 'Epic', defense: 5, armor: 7, attack: 5, criticalChance: 3, description: 'Channels your rage into power.', icon: '/icons/item-helmet.svg', allowedClasses: ['warrior']},
    'warrior_helmet_epic_defensive': { name: 'Colossus Helm', type: 'helmet', rarity: 'Epic', defense: 9, armor: 14, magicResist: 4, description: 'Massive and incredibly resilient.', icon: '/icons/item-helmet.svg', allowedClasses: ['warrior']},
    'warrior_helmet_legendary_balanced': { name: 'Dragonbone Helm', type: 'helmet', rarity: 'Legendary', defense: 11, armor: 15, magicResist: 7, attack: 7, lootLuck: 10, description: 'Crafted from a dragon\'s skull.', icon: '/icons/item-helmet.svg', allowedClasses: ['warrior']},
    'warrior_helmet_legendary_offensive': { name: 'Crown of the War-God', type: 'helmet', rarity: 'Legendary', defense: 8, armor: 10, attack: 10, criticalChance: 5, initiative: 10, description: 'A symbol of ultimate martial power.', icon: '/icons/item-helmet.svg', allowedClasses: ['warrior']},
    'warrior_helmet_legendary_defensive': { name: 'Face of the Mountain', type: 'helmet', rarity: 'Legendary', defense: 15, armor: 22, magicResist: 8, description: 'Solid, unyielding, and eternal.', icon: '/icons/item-helmet.svg', allowedClasses: ['warrior']},

    // --- Mage Helmets ---
    'mage_helmet_common_balanced': { name: 'Mage Cowl', type: 'helmet', rarity: 'Common', defense: 1, magicResist: 2, magicAttack: 1, description: 'A simple cowl for a spellcaster.', icon: '/icons/item-cowl.svg', allowedClasses: ['mage']},
    'mage_helmet_common_offensive': { name: 'Circlet of Focus', type: 'helmet', rarity: 'Common', magicResist: 1, magicAttack: 2, description: 'Aids in concentrating magical energies.', icon: '/icons/item-cowl.svg', allowedClasses: ['mage']},
    'mage_helmet_common_defensive': { name: 'Thick Hood', type: 'helmet', rarity: 'Common', defense: 2, magicResist: 3, description: 'A heavy hood for some protection.', icon: '/icons/item-cowl.svg', allowedClasses: ['mage']},
    'mage_helmet_rare_balanced': { name: 'Enchanter\'s Cowl', type: 'helmet', rarity: 'Rare', defense: 2, magicResist: 5, magicAttack: 3, xpGainBonus: 3, description: 'Woven with threads of mana and wisdom.', icon: '/icons/item-cowl.svg', allowedClasses: ['mage']},
    'mage_helmet_rare_offensive': { name: 'Crown of Arcane Insight', type: 'helmet', rarity: 'Rare', defense: 1, magicResist: 3, magicAttack: 5, criticalChance: 2, description: 'Reveals the weaknesses of your foes.', icon: '/icons/item-cowl.svg', allowedClasses: ['mage']},
    'mage_helmet_rare_defensive': { name: 'Warding Headdress', type: 'helmet', rarity: 'Rare', defense: 3, magicResist: 8, staminaBoost: 5, description: 'Deflects hostile magic.', icon: '/icons/item-cowl.svg', allowedClasses: ['mage']},
    'mage_helmet_epic_balanced': { name: 'Cowl of the High Magus', type: 'helmet', rarity: 'Epic', defense: 4, magicResist: 10, magicAttack: 7, xpGainBonus: 7, description: 'A sign of mastery over the elements and knowledge.', icon: '/icons/item-cowl.svg', allowedClasses: ['mage']},
    'mage_helmet_epic_offensive': { name: 'Diadem of Raw Chaos', type: 'helmet', rarity: 'Epic', defense: 2, magicResist: 6, magicAttack: 10, criticalChance: 4, description: 'Barely contained magical fury.', icon: '/icons/item-cowl.svg', allowedClasses: ['mage']},
    'mage_helmet_epic_defensive': { name: 'Mind-Cage Circlet', type: 'helmet', rarity: 'Epic', defense: 6, magicResist: 15, staminaBoost: 10, description: 'Protects the mind as well as the body.', icon: '/icons/item-cowl.svg', allowedClasses: ['mage']},
    'mage_helmet_legendary_balanced': { name: 'Third Eye of the Seer', type: 'helmet', rarity: 'Legendary', defense: 7, magicResist: 18, magicAttack: 12, criticalChance: 5, scoutRange: 2, xpGainBonus: 10, description: 'Sees all possibilities, near and far.', icon: '/icons/item-cowl.svg', allowedClasses: ['mage']},
    'mage_helmet_legendary_offensive': { name: 'Crown of the Storm-Lord', type: 'helmet', rarity: 'Legendary', defense: 5, magicResist: 12, magicAttack: 18, criticalChance: 8, doubleHitChance: 5, description: 'Command the very heavens.', icon: '/icons/item-cowl.svg', allowedClasses: ['mage']},
    'mage_helmet_legendary_defensive': { name: 'Veil of Tranquility', type: 'helmet', rarity: 'Legendary', defense: 10, magicResist: 25, staminaBoost: 15, description: 'An oasis of calm in a storm of magic.', icon: '/icons/item-cowl.svg', allowedClasses: ['mage']},

    // --- Ranger Helmets ---
    'ranger_helmet_common_balanced': { name: 'Leather Cap', type: 'helmet', rarity: 'Common', defense: 1, evasion: 2, description: 'Lightweight and durable.', icon: '/icons/item-cap.svg', allowedClasses: ['ranger']},
    'ranger_helmet_common_offensive': { name: 'Eagle-Eye Goggles', type: 'helmet', rarity: 'Common', evasion: 1, criticalChance: 2, description: 'Helps in spotting targets.', icon: '/icons/item-cap.svg', allowedClasses: ['ranger']},
    'ranger_helmet_common_defensive': { name: 'Boiled Leather Cap', type: 'helmet', rarity: 'Common', defense: 2, armor: 1, evasion: 1, description: 'Stiffened for better protection.', icon: '/icons/item-cap.svg', allowedClasses: ['ranger']},
    'ranger_helmet_rare_balanced': { name: 'Pathfinder\'s Hood', type: 'helmet', rarity: 'Rare', defense: 3, evasion: 4, criticalChance: 2, scoutRange: 1, description: 'For those who brave the wilderness.', icon: '/icons/item-cap.svg', allowedClasses: ['ranger']},
    'ranger_helmet_rare_offensive': { name: 'Sharpshooter\'s Cap', type: 'helmet', rarity: 'Rare', defense: 2, evasion: 3, criticalChance: 5, attack: 1, description: 'A lucky cap for a skilled shot.', icon: '/icons/item-cap.svg', allowedClasses: ['ranger']},
    'ranger_helmet_rare_defensive': { name: 'Troll-Hide Hood', type: 'helmet', rarity: 'Rare', defense: 4, armor: 3, evasion: 2, description: 'Tough and regenerative.', icon: '/icons/item-cap.svg', allowedClasses: ['ranger']},
    'ranger_helmet_epic_balanced': { name: 'Sentry\'s Coif', type: 'helmet', rarity: 'Epic', defense: 5, evasion: 7, criticalChance: 4, attack: 2, scoutRange: 2, description: 'The watchful eye of the forest.', icon: '/icons/item-cap.svg', allowedClasses: ['ranger']},
    'ranger_helmet_epic_offensive': { name: 'Helm of the Far-Striker', type: 'helmet', rarity: 'Epic', defense: 4, evasion: 5, criticalChance: 8, attack: 4, description: 'Makes distant targets seem close.', icon: '/icons/item-cap.svg', allowedClasses: ['ranger']},
    'ranger_helmet_epic_defensive': { name: 'Wyvern-Scale Coif', type: 'helmet', rarity: 'Epic', defense: 7, armor: 5, evasion: 4, description: 'Resistant to tooth and claw.', icon: '/icons/item-cap.svg', allowedClasses: ['ranger']},
    'ranger_helmet_legendary_balanced': { name: 'Gryphon-Feather Cap', type: 'helmet', rarity: 'Legendary', defense: 8, evasion: 10, criticalChance: 8, attack: 5, scoutRange: 3, initiative: 5, description: 'As light and sharp as the wind.', icon: '/icons/item-cap.svg', allowedClasses: ['ranger']},
    'ranger_helmet_legendary_offensive': { name: 'Crown of the Hunt-Lord', type: 'helmet', rarity: 'Legendary', defense: 6, evasion: 8, criticalChance: 15, attack: 8, description: 'No prey can escape your sight.', icon: '/icons/item-cap.svg', allowedClasses: ['ranger']},
    'ranger_helmet_legendary_defensive': { name: 'Helm of the Unseen Path', type: 'helmet', rarity: 'Legendary', defense: 12, armor: 8, evasion: 7, description: 'You leave no trace.', icon: '/icons/item-cap.svg', allowedClasses: ['ranger']},

    // --- Assassin Helmets ---
    'assassin_helmet_common_balanced': { name: 'Shadow Hood', type: 'helmet', rarity: 'Common', defense: 1, evasion: 2, criticalChance: 2, description: 'A dark hood that conceals the face.', icon: '/icons/item-hood.svg', allowedClasses: ['assassin']},
    'assassin_helmet_common_offensive': { name: 'Executioner\'s Hood', type: 'helmet', rarity: 'Common', evasion: 1, criticalChance: 3, description: 'A terrifying visage.', icon: '/icons/item-hood.svg', allowedClasses: ['assassin']},
    'assassin_helmet_common_defensive': { name: 'Padded Hood', type: 'helmet', rarity: 'Common', defense: 2, evasion: 1, description: 'A little extra protection.', icon: '/icons/item-hood.svg', allowedClasses: ['assassin']},
    'assassin_helmet_rare_balanced': { name: 'Thief\'s Cowl', type: 'helmet', rarity: 'Rare', defense: 2, evasion: 5, criticalChance: 4, lootLuck: 5, description: 'A staple of the underworld.', icon: '/icons/item-hood.svg', allowedClasses: ['assassin']},
    'assassin_helmet_rare_offensive': { name: 'Mask of the Grinning Imp', type: 'helmet', rarity: 'Rare', defense: 1, evasion: 4, criticalChance: 7, attack: 1, description: 'Gleefully malevolent.', icon: '/icons/item-hood.svg', allowedClasses: ['assassin']},
    'assassin_helmet_rare_defensive': { name: 'Night-Runner\'s Cowl', type: 'helmet', rarity: 'Rare', defense: 4, evasion: 3, criticalChance: 2, description: 'Perfect for rooftop escapes.', icon: '/icons/item-hood.svg', allowedClasses: ['assassin']},
    'assassin_helmet_epic_balanced': { name: 'Cowl of the Silent Killer', type: 'helmet', rarity: 'Epic', defense: 4, evasion: 8, criticalChance: 8, attack: 2, initiative: 7, description: 'Death comes without a sound.', icon: '/icons/item-hood.svg', allowedClasses: ['assassin']},
    'assassin_helmet_epic_offensive': { name: 'Gaze of the Void', type: 'helmet', rarity: 'Epic', defense: 3, evasion: 6, criticalChance: 12, attack: 4, description: 'What looks back from the abyss.', icon: '/icons/item-hood.svg', allowedClasses: ['assassin']},
    'assassin_helmet_epic_defensive': { name: 'Wraith-Visage', type: 'helmet', rarity: 'Epic', defense: 6, evasion: 5, criticalChance: 5, description: 'Become a fleeting phantom.', icon: '/icons/item-hood.svg', allowedClasses: ['assassin']},
    'assassin_helmet_legendary_balanced': { name: 'Mask of the Betrayer', type: 'helmet', rarity: 'Legendary', defense: 7, evasion: 12, criticalChance: 15, attack: 7, initiative: 12, lootLuck: 10, description: 'A friendly face that hides a deadly secret.', icon: '/icons/item-hood.svg', allowedClasses: ['assassin']},
    'assassin_helmet_legendary_offensive': { name: 'Cowl of a Thousand Lies', type: 'helmet', rarity: 'Legendary', defense: 5, evasion: 10, criticalChance: 22, attack: 10, description: 'The truth is your weapon.', icon: '/icons/item-hood.svg', allowedClasses: ['assassin']},
    'assassin_helmet_legendary_defensive': { name: 'Hood of the Eternal Shadow', type: 'helmet', rarity: 'Legendary', defense: 10, evasion: 8, criticalChance: 10, description: 'Darkness is your greatest ally.', icon: '/icons/item-hood.svg', allowedClasses: ['assassin']},

    // ================================================
    // BELTS
    // ================================================

    // --- Warrior Belts ---
    'warrior_belt_common_balanced': { name: 'Iron Warbelt', type: 'belt', rarity: 'Common', defense: 1, armor: 2, description: 'Holds your pants up, and your guts in.', icon: '/icons/item-belt.svg', allowedClasses: ['warrior']},
    'warrior_belt_common_offensive': { name: 'Studded Belt', type: 'belt', rarity: 'Common', armor: 1, attack: 1, description: 'A belt with iron studs.', icon: '/icons/item-belt.svg', allowedClasses: ['warrior']},
    'warrior_belt_common_defensive': { name: 'Wide Leather Belt', type: 'belt', rarity: 'Common', defense: 1, armor: 3, magicResist: 1, description: 'Offers decent core protection.', icon: '/icons/item-belt.svg', allowedClasses: ['warrior']},
    'warrior_belt_rare_balanced': { name: 'Steel-Plated Belt', type: 'belt', rarity: 'Rare', defense: 2, armor: 4, description: 'A solid steel plate guards your midsection.', icon: '/icons/item-belt.svg', allowedClasses: ['warrior']},
    'warrior_belt_rare_offensive': { name: 'Belt of the Savage', type: 'belt', rarity: 'Rare', defense: 1, armor: 2, attack: 2, description: 'Made from raw, untamed materials.', icon: '/icons/item-belt.svg', allowedClasses: ['warrior']},
    'warrior_belt_rare_defensive': { name: 'Girdle of Fortitude', type: 'belt', rarity: 'Rare', defense: 3, armor: 6, magicResist: 2, description: 'Imbued with an aura of toughness.', icon: '/icons/item-belt.svg', allowedClasses: ['warrior']},
    'warrior_belt_epic_balanced': { name: 'Belt of the Warlord', type: 'belt', rarity: 'Epic', defense: 4, armor: 6, attack: 3, initiative: 5, description: 'A commander\'s belt.', icon: '/icons/item-belt.svg', allowedClasses: ['warrior']},
    'warrior_belt_epic_offensive': { name: 'Onslaught Girdle', type: 'belt', rarity: 'Epic', defense: 2, armor: 4, attack: 4, criticalChance: 2, description: 'Never stop advancing.', icon: '/icons/item-belt.svg', allowedClasses: ['warrior']},
    'warrior_belt_epic_defensive': { name: 'Mountain-Heart Belt', type: 'belt', rarity: 'Epic', defense: 6, armor: 9, magicResist: 3, description: 'Contains a core of solid rock.', icon: '/icons/item-belt.svg', allowedClasses: ['warrior']},
    'warrior_belt_legendary_balanced': { name: 'Girdle of Giant Strength', type: 'belt', rarity: 'Legendary', defense: 6, armor: 8, attack: 7, description: 'Grants the might of a giant.', icon: '/icons/item-belt.svg', allowedClasses: ['warrior']},
    'warrior_belt_legendary_offensive': { name: 'Belt of Unstoppable Carnage', type: 'belt', rarity: 'Legendary', defense: 4, armor: 5, attack: 8, criticalChance: 4, doubleHitChance: 5, description: 'Leave only destruction in your wake.', icon: '/icons/item-belt.svg', allowedClasses: ['warrior']},
    'warrior_belt_legendary_defensive': { name: 'World-Serpent\'s Scale Belt', type: 'belt', rarity: 'Legendary', defense: 9, armor: 14, magicResist: 5, description: 'Made from a single scale of a world-ending serpent.', icon: '/icons/item-belt.svg', allowedClasses: ['warrior']},

    // --- Mage Belts ---
    'mage_belt_common_balanced': { name: 'Manaweave Sash', type: 'belt', rarity: 'Common', defense: 1, magicResist: 1, description: 'A sash that helps focus magical energies.', icon: '/icons/item-sash.svg', allowedClasses: ['mage']},
    'mage_belt_common_offensive': { name: 'Sash of Minor Power', type: 'belt', rarity: 'Common', magicAttack: 1, description: 'A simple sash with a hint of power.', icon: '/icons/item-sash.svg', allowedClasses: ['mage']},
    'mage_belt_common_defensive': { name: 'Rope Belt', type: 'belt', rarity: 'Common', defense: 1, magicResist: 2, description: 'Surprisingly sturdy.', icon: '/icons/item-sash.svg', allowedClasses: ['mage']},
    'mage_belt_rare_balanced': { name: 'Spell-Treated Sash', type: 'belt', rarity: 'Rare', defense: 2, magicResist: 3, magicAttack: 2, description: 'Enchanted for balance in combat.', icon: '/icons/item-sash.svg', allowedClasses: ['mage']},
    'mage_belt_rare_offensive': { name: 'Sash of Raw Magic', type: 'belt', rarity: 'Rare', defense: 1, magicResist: 2, magicAttack: 3, criticalChance: 1, description: 'Focuses untamed magical forces.', icon: '/icons/item-sash.svg', allowedClasses: ['mage']},
    'mage_belt_rare_defensive': { name: 'Energy-Binder Sash', type: 'belt', rarity: 'Rare', defense: 2, magicResist: 5, staminaBoost: 5, description: 'Helps contain and control your stamina.', icon: '/icons/item-sash.svg', allowedClasses: ['mage']},
    'mage_belt_epic_balanced': { name: 'Archon\'s Sash', type: 'belt', rarity: 'Epic', defense: 3, magicResist: 6, magicAttack: 5, xpGainBonus: 5, description: 'A symbol of high-level mastery.', icon: '/icons/item-sash.svg', allowedClasses: ['mage']},
    'mage_belt_epic_offensive': { name: 'Sash of the Void-Storm', type: 'belt', rarity: 'Epic', defense: 2, magicResist: 4, magicAttack: 7, criticalChance: 3, description: 'A vortex of destructive power.', icon: '/icons/item-sash.svg', allowedClasses: ['mage']},
    'mage_belt_epic_defensive': { name: 'Mana-Battery Belt', type: 'belt', rarity: 'Epic', defense: 4, magicResist: 8, staminaBoost: 10, description: 'Stores and slowly releases vast amounts of stamina.', icon: '/icons/item-sash.svg', allowedClasses: ['mage']},
    'mage_belt_legendary_balanced': { name: 'Sash of Cosmic Balance', type: 'belt', rarity: 'Legendary', defense: 5, magicResist: 10, magicAttack: 8, criticalChance: 4, xpGainBonus: 10, description: 'Aligns the stars in your favor.', icon: '/icons/item-sash.svg', allowedClasses: ['mage']},
    'mage_belt_legendary_offensive': { name: 'Girdle of the Apocalypse', type: 'belt', rarity: 'Legendary', defense: 3, magicResist: 6, magicAttack: 12, criticalChance: 6, description: 'Unravel the fabric of reality.', icon: '/icons/item-sash.svg', allowedClasses: ['mage']},
    'mage_belt_legendary_defensive': { name: 'Sash of the Ethereal Plane', type: 'belt', rarity: 'Legendary', defense: 7, magicResist: 15, staminaBoost: 15, description: 'Partially phases you out of harm\'s way.', icon: '/icons/item-sash.svg', allowedClasses: ['mage']},

    // --- Ranger Belts ---
    'ranger_belt_common_balanced': { name: 'Utility Belt', type: 'belt', rarity: 'Common', defense: 1, evasion: 1, description: 'A belt with many useful pouches.', icon: '/icons/item-belt.svg', allowedClasses: ['ranger']},
    'ranger_belt_common_offensive': { name: 'Quiver-Belt', type: 'belt', rarity: 'Common', criticalChance: 1, description: 'Allows for faster arrow drawing.', icon: '/icons/item-belt.svg', allowedClasses: ['ranger']},
    'ranger_belt_common_defensive': { name: 'Thick Leather Belt', type: 'belt', rarity: 'Common', defense: 2, evasion: 1, description: 'A simple, sturdy belt.', icon: '/icons/item-belt.svg', allowedClasses: ['ranger']},
    'ranger_belt_rare_balanced': { name: 'Explorer\'s Belt', type: 'belt', rarity: 'Rare', defense: 2, evasion: 3, criticalChance: 1, scoutRange: 1, description: 'Has a tool for every situation.', icon: '/icons/item-belt.svg', allowedClasses: ['ranger']},
    'ranger_belt_rare_offensive': { name: 'Bandolier of Bolts', type: 'belt', rarity: 'Rare', defense: 1, evasion: 2, criticalChance: 3, attack: 1, description: 'Keeps ammunition close at hand.', icon: '/icons/item-belt.svg', allowedClasses: ['ranger']},
    'ranger_belt_rare_defensive': { name: 'Beast-Tamer\'s Girdle', type: 'belt', rarity: 'Rare', defense: 4, armor: 2, evasion: 1, description: 'Worn from wrestling with wild creatures.', icon: '/icons/item-belt.svg', allowedClasses: ['ranger']},
    'ranger_belt_epic_balanced': { name: 'Wilderness Survival Belt', type: 'belt', rarity: 'Epic', defense: 3, evasion: 5, criticalChance: 3, attack: 2, scoutRange: 2, description: 'Everything you need to survive the wilds.', icon: '/icons/item-belt.svg', allowedClasses: ['ranger']},
    'ranger_belt_epic_offensive': { name: 'Deadeye\'s Belt', type: 'belt', rarity: 'Epic', defense: 2, evasion: 4, criticalChance: 6, attack: 3, description: 'Helps steady your aim for that perfect shot.', icon: '/icons/item-belt.svg', allowedClasses: ['ranger']},
    'ranger_belt_epic_defensive': { name: 'Girdle of the Iron-Hide', type: 'belt', rarity: 'Epic', defense: 6, armor: 4, evasion: 3, description: 'As tough as a rhino\'s skin.', icon: '/icons/item-belt.svg', allowedClasses: ['ranger']},
    'ranger_belt_legendary_balanced': { name: 'Horizon-Walker\'s Belt', type: 'belt', rarity: 'Legendary', defense: 5, evasion: 8, criticalChance: 6, attack: 6, scoutRange: 3, description: 'For those who have seen it all.', icon: '/icons/item-belt.svg', allowedClasses: ['ranger']},
    'ranger_belt_legendary_offensive': { name: 'Wind-Chaser\'s Sash', type: 'belt', rarity: 'Legendary', defense: 3, evasion: 6, criticalChance: 10, attack: 8, initiative: 7, description: 'You are as fast and deadly as the wind.', icon: '/icons/item-belt.svg', allowedClasses: ['ranger']},
    'ranger_belt_legendary_defensive': { name: 'Adamantite-Weave Belt', type: 'belt', rarity: 'Legendary', defense: 8, armor: 6, evasion: 5, description: 'An unbreakable defense.', icon: '/icons/item-belt.svg', allowedClasses: ['ranger']},

    // --- Assassin Belts ---
    'assassin_belt_common_balanced': { name: 'Bandolier', type: 'belt', rarity: 'Common', evasion: 1, criticalChance: 1, description: 'For easy access to tools of the trade.', icon: '/icons/item-bandolier.svg', allowedClasses: ['assassin']},
    'assassin_belt_common_offensive': { name: 'Poison-Vial Belt', type: 'belt', rarity: 'Common', evasion: 1, criticalChance: 2, description: 'Keeps nasty surprises handy.', icon: '/icons/item-bandolier.svg', allowedClasses: ['assassin']},
    'assassin_belt_common_defensive': { name: 'Reinforced Sash', type: 'belt', rarity: 'Common', defense: 1, evasion: 1, description: 'A bit of protection for a close-quarters fight.', icon: '/icons/item-bandolier.svg', allowedClasses: ['assassin']},
    'assassin_belt_rare_balanced': { name: 'Thief\'s Toolbelt', type: 'belt', rarity: 'Rare', defense: 1, evasion: 3, criticalChance: 3, lootLuck: 5, description: 'Lockpicks, smoke bombs, and more.', icon: '/icons/item-bandolier.svg', allowedClasses: ['assassin']},
    'assassin_belt_rare_offensive': { name: 'Belt of a Thousand Knives', type: 'belt', rarity: 'Rare', evasion: 2, criticalChance: 5, attack: 1, description: 'You\'re never unarmed.', icon: '/icons/item-bandolier.svg', allowedClasses: ['assassin']},
    'assassin_belt_rare_defensive': { name: 'Escape-Artist\'s Belt', type: 'belt', rarity: 'Rare', defense: 2, evasion: 4, criticalChance: 1, description: 'For getting out of tight spots.', icon: '/icons/item-bandolier.svg', allowedClasses: ['assassin']},
    'assassin_belt_epic_balanced': { name: 'Guildmaster\'s Sash', type: 'belt', rarity: 'Epic', defense: 3, evasion: 6, criticalChance: 6, attack: 2, lootLuck: 10, description: 'A mark of high rank in the shadows.', icon: '/icons/item-bandolier.svg', allowedClasses: ['assassin']},
    'assassin_belt_epic_offensive': { name: 'Vital-Point Belt', type: 'belt', rarity: 'Epic', defense: 2, evasion: 5, criticalChance: 9, attack: 3, description: 'Helps you aim for the weak spots.', icon: '/icons/item-bandolier.svg', allowedClasses: ['assassin']},
    'assassin_belt_epic_defensive': { name: 'Shadow-Walker\'s Belt', type: 'belt', rarity: 'Epic', defense: 5, evasion: 8, criticalChance: 4, description: 'Meld with the darkness.', icon: '/icons/item-bandolier.svg', allowedClasses: ['assassin']},
    'assassin_belt_legendary_balanced': { name: 'Night-God\'s Cord', type: 'belt', rarity: 'Legendary', defense: 5, evasion: 10, criticalChance: 10, attack: 6, lootLuck: 15, initiative: 10, description: 'A gift from a deity of darkness.', icon: '/icons/item-bandolier.svg', allowedClasses: ['assassin']},
    'assassin_belt_legendary_offensive': { name: 'Sash of Certain Death', type: 'belt', rarity: 'Legendary', defense: 3, evasion: 8, criticalChance: 15, attack: 8, description: 'One strike is all you need.', icon: '/icons/item-bandolier.svg', allowedClasses: ['assassin']},
    'assassin_belt_legendary_defensive': { name: 'Belt of the Phantom', type: 'belt', rarity: 'Legendary', defense: 8, evasion: 12, criticalChance: 8, description: 'You were never there.', icon: '/icons/item-bandolier.svg', allowedClasses: ['assassin']},

    // ================================================
    // BOOTS
    // ================================================

    // --- Warrior Boots ---
    'warrior_boots_common': { name: 'Iron Greaves', type: 'boots', rarity: 'Common', defense: 1, armor: 2, description: 'Sturdy iron boots.', icon: '/icons/item-boots.svg', allowedClasses: ['warrior']},
    'warrior_boots_rare': { name: 'Steel Sabatons', type: 'boots', rarity: 'Rare', defense: 2, armor: 4, description: 'Articulated steel boots for protection.', icon: '/icons/item-boots.svg', allowedClasses: ['warrior']},
    'warrior_boots_epic': { name: 'Earthshaker Greaves', type: 'boots', rarity: 'Epic', defense: 4, armor: 7, attack: 2, initiative: -5, description: 'Every step shakes the ground.', icon: '/icons/item-boots.svg', allowedClasses: ['warrior']},
    'warrior_boots_legendary': { name: 'Greaves of the Unmovable', type: 'boots', rarity: 'Legendary', defense: 7, armor: 10, magicResist: 5, description: 'Roots you to the very earth.', icon: '/icons/item-boots.svg', allowedClasses: ['warrior']},

    // --- Mage Boots ---
    'mage_boots_common': { name: 'Apprentice\'s Shoes', type: 'boots', rarity: 'Common', magicResist: 2, evasion: 1, description: 'Simple shoes for a spellcaster.', icon: '/icons/item-shoes.svg', allowedClasses: ['mage']},
    'mage_boots_rare': { name: 'Boots of Spell-Weaving', type: 'boots', rarity: 'Rare', magicResist: 4, evasion: 2, staminaBoost: 5, description: 'Helps you move through complex spells.', icon: '/icons/item-shoes.svg', allowedClasses: ['mage']},
    'mage_boots_epic': { name: 'Mana-Walker Boots', type: 'boots', rarity: 'Epic', magicResist: 7, evasion: 4, staminaBoost: 10, description: 'Draws stamina from the ground.', icon: '/icons/item-shoes.svg', allowedClasses: ['mage']},
    'mage_boots_legendary': { name: 'Boots of the Ethereal', type: 'boots', rarity: 'Legendary', magicResist: 10, evasion: 8, staminaBoost: 15, initiative: 10, description: 'Allows you to walk between worlds.', icon: '/icons/item-shoes.svg', allowedClasses: ['mage']},

    // --- Ranger Boots ---
    'ranger_boots_common': { name: 'Leather Boots', type: 'boots', rarity: 'Common', defense: 1, evasion: 2, description: 'Standard boots for a ranger.', icon: '/icons/item-boots-leather.svg', allowedClasses: ['ranger']},
    'ranger_boots_rare': { name: 'Silent-Tread Boots', type: 'boots', rarity: 'Rare', defense: 2, evasion: 5, initiative: 5, description: 'Makes no sound on any surface.', icon: '/icons/item-boots-leather.svg', allowedClasses: ['ranger']},
    'ranger_boots_epic': { name: 'Wind-Strider Boots', type: 'boots', rarity: 'Epic', defense: 4, evasion: 8, criticalChance: 3, initiative: 8, description: 'You move with the speed of the wind.', icon: '/icons/item-boots-leather.svg', allowedClasses: ['ranger']},
    'ranger_boots_legendary': { name: 'Pathfinder\'s Greaves', type: 'boots', rarity: 'Legendary', defense: 7, evasion: 12, criticalChance: 5, scoutRange: 2, description: 'No path is hidden from you.', icon: '/icons/item-boots-leather.svg', allowedClasses: ['ranger']},

    // --- Assassin Boots ---
    'assassin_boots_common': { name: 'Soft-Soled Shoes', type: 'boots', rarity: 'Common', evasion: 3, criticalChance: 1, description: 'Designed for stealth.', icon: '/icons/item-shoes-soft.svg', allowedClasses: ['assassin']},
    'assassin_boots_rare': { name: 'Boots of the Cat', type: 'boots', rarity: 'Rare', evasion: 6, criticalChance: 2, initiative: 5, description: 'Land silently from any height.', icon: '/icons/item-shoes-soft.svg', allowedClasses: ['assassin']},
    'assassin_boots_epic': { name: 'Fleet-Footed Slippers', type: 'boots', rarity: 'Epic', evasion: 10, criticalChance: 4, attack: 2, initiative: 10, description: 'A blur of motion.', icon: '/icons/item-shoes-soft.svg', allowedClasses: ['assassin']},
    'assassin_boots_legendary': { name: 'Boots of the Ghostly Step', type: 'boots', rarity: 'Legendary', evasion: 15, criticalChance: 7, attack: 4, initiative: 15, description: 'You were never here.', icon: '/icons/item-shoes-soft.svg', allowedClasses: ['assassin']},
};

// Helper function to create a full item object with an ID
export function createItem(itemId: string, quantity: number = 1): Item {
    if (!ITEMS[itemId]) throw new Error(`Item with id ${itemId} not found in ITEMS definition.`);
    const itemData = ITEMS[itemId];
    const newId = `${itemId}_${new Date().getTime()}_${Math.random()}`;
    return { ...itemData, id: newId, itemId, quantity: quantity, allowedClasses: itemData.allowedClasses as PlayerClass[] | undefined };
}

// --- MONSTER DEFINITIONS ---
// lootTable: { itemId, chance (0-1), quantity }
export const MONSTERS: Record<string, Omit<Monster, 'id'>> = {
    'goblin': { 
        name: 'Goblin', 
        icon: '/icons/monster-goblin.svg',
        hp: 35, maxHp: 35, attack: 12, defense: 4, 
        greed: 70, power: -20, xp: 15,
        lootTable: [
            { itemId: 'health_potion', chance: 0.25, quantity: 1 },
            { itemId: 'warrior_sword_common_balanced', chance: 0.05, quantity: 1 },
            { itemId: 'assassin_weapon_common_balanced', chance: 0.05, quantity: 1 },
            { itemId: 'ranger_belt_common_balanced', chance: 0.02, quantity: 1 },
            { itemId: 'mage_helmet_common_balanced', chance: 0.02, quantity: 1 },
            { itemId: 'warrior_boots_common', chance: 0.03, quantity: 1 },
            { itemId: 'assassin_boots_common', chance: 0.03, quantity: 1 },
            { itemId: 'adventurers_pack', chance: 0.01, quantity: 1 },
        ] 
    },
    'slime': { 
        name: 'Slime', 
        icon: '/icons/monster-slime.svg',
        hp: 25, maxHp: 25, attack: 8, defense: 8, 
        greed: 20, power: -50, xp: 10,
        lootTable: [
             { itemId: 'health_potion', chance: 0.1, quantity: 1 },
             { itemId: 'mage_belt_common_offensive', chance: 0.03, quantity: 1 },
             { itemId: 'potion_of_magic_barrier', chance: 0.05, quantity: 1 },
             { itemId: 'mage_boots_common', chance: 0.04, quantity: 1 },
        ]
    },
    'orc_grunt': { 
        name: 'Orc Grunt', 
        icon: '/icons/monster-orc.svg',
        hp: 60, maxHp: 60, attack: 18, defense: 8, 
        greed: 85, power: 10, xp: 25,
        lootTable: [
            { itemId: 'health_potion', chance: 0.2, quantity: 2 },
            { itemId: 'potion_of_iron_skin', chance: 0.1, quantity: 1 },
            { itemId: 'warrior_helmet_common_defensive', chance: 0.1, quantity: 1 },
            { itemId: 'warrior_armor_common_defensive', chance: 0.05, quantity: 1 },
            { itemId: 'ranger_weapon_common_heavy', chance: 0.05, quantity: 1 },
            { itemId: 'warrior_sword_rare_defensive', chance: 0.02, quantity: 1 },
            { itemId: 'ranger_armor_rare_defensive', chance: 0.01, quantity: 1 },
            { itemId: 'warrior_boots_rare', chance: 0.03, quantity: 1 },
            { itemId: 'adventurers_pack', chance: 0.02, quantity: 1 },
        ]
    },
    'ice_elemental': { 
        name: 'Ice Elemental', 
        icon: '/icons/monster-elemental.svg',
        hp: 50, maxHp: 50, attack: 15, defense: 12, 
        greed: 50, power: 5, xp: 40,
        lootTable: [
            { itemId: 'elixir_of_haste', chance: 0.2, quantity: 1 },
            { itemId: 'potion_of_swiftness', chance: 0.1, quantity: 1 },
            { itemId: 'mage_weapon_common_balanced', chance: 0.1, quantity: 1 },
            { itemId: 'scrying_orb', chance: 0.05, quantity: 1 },
            { itemId: 'mage_weapon_rare_crit', chance: 0.03, quantity: 1 },
            { itemId: 'mage_armor_rare_defensive', chance: 0.02, quantity: 1 },
            { itemId: 'mage_helmet_rare_defensive', chance: 0.02, quantity: 1 },
            { itemId: 'mage_boots_rare', chance: 0.04, quantity: 1 },
        ] 
    },
    'ancient_dragon': { 
        name: 'Ancient Dragon', 
        icon: '/icons/monster-dragon.svg',
        hp: 250, maxHp: 250, attack: 40, defense: 25, 
        greed: 95, power: 80, xp: 500,
        lootTable: [
            { itemId: 'blade_of_the_ancients', chance: 0.3, quantity: 1 },
            { itemId: 'greater_health_potion', chance: 1, quantity: 3 },
            { itemId: 'warrior_armor_legendary_balanced', chance: 0.1, quantity: 1 },
            { itemId: 'mage_armor_legendary_balanced', chance: 0.1, quantity: 1 },
            { itemId: 'ranger_armor_legendary_balanced', chance: 0.1, quantity: 1 },
            { itemId: 'assassin_armor_legendary_balanced', chance: 0.1, quantity: 1 },
            { itemId: 'warrior_helmet_legendary_balanced', chance: 0.1, quantity: 1 },
            { itemId: 'mage_helmet_legendary_balanced', chance: 0.1, quantity: 1 },
            { itemId: 'ranger_helmet_legendary_balanced', chance: 0.1, quantity: 1 },
            { itemId: 'assassin_helmet_legendary_balanced', chance: 0.1, quantity: 1 },
            { itemId: 'warrior_belt_legendary_balanced', chance: 0.1, quantity: 1 },
            { itemId: 'mage_belt_legendary_balanced', chance: 0.1, quantity: 1 },
            { itemId: 'ranger_belt_legendary_balanced', chance: 0.1, quantity: 1 },
            { itemId: 'assassin_belt_legendary_balanced', chance: 0.1, quantity: 1 },
            { itemId: 'warrior_boots_legendary', chance: 0.1, quantity: 1 },
            { itemId: 'mage_boots_legendary', chance: 0.1, quantity: 1 },
            { itemId: 'ranger_boots_legendary', chance: 0.1, quantity: 1 },
            { itemId: 'assassin_boots_legendary', chance: 0.1, quantity: 1 },
            { itemId: 'elixir_of_power', chance: 0.5, quantity: 2 },
            { itemId: 'adventurers_pack', chance: 0.1, quantity: 1 },
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
