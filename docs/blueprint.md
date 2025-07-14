# **App Name**: Square Clash

## Core Features:

- Square Grid Map Display: Display a square grid map (8x8) with the player centered. The map should include visual elements like trees, rivers, and mountains represented by icons.
- RPG-Styled Panel: Display an RPG-styled panel showing player stats, inventory, energy bar, and any active quests.
- Energy Management System: Implement energy consumption per move. The player has a limited energy pool that regenerates over time. Items can affect regeneration rate.
- Turn-based Movement: Implement player movement limited by energy. Player encounters others or monsters if they occupy the same grid square. No actual visual fight, just outcome reports.
- Combat System: Combat system without visual representation. Determine the outcome based on stats, items, spells, etc. Display the fight steps in the combat results report.
- World Generation and Encounters: Random generation of lootable items, treasure, and quests when exploring the map.
- Loot Attempt Tool: AI tool to decide when or whether an NPC combatant will attempt to steal the user's loot during or after a battle, depending on contextual factors such as the NPC's relative power level, greed, and/or relationship to other nearby players.

## Style Guidelines:

- Primary color: Earthy Brown (#A0522D), reminiscent of a traditional RPG environment.
- Background color: Light Beige (#F5F5DC) for readability and contrast.
- Accent color: Burnt Orange (#CC6633) for highlights, calls to action, and item significance. This vivid color will stand out against the calmer background and primary colors, while remaining stylistically consistent.
- Body font: 'Literata' serif for readability and the vintage feel desired for RPG content.
- Headline font: 'Belleza', a stylish sans-serif for a slightly modern artistic touch in an RPG style.
- Icons should represent elements like trees, mountains, rivers, and items, designed in a 16-bit pixel style, staying true to the RPG visual style. All of them must be visible on the game board, not in a different menu, if you hover on the board icons should popup in a box near of the elements
- The game map occupies 3/4 of the screen, and the RPG panel on the right contains the stats, inventory, and quests. Place all the combat related buttons right near your champion , you stats should always be visible.
- Simple animations for events like gaining/losing energy and showing combat outcomes.