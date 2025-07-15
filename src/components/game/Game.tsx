
"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import type { Player, TileData, Monster, CombatLogEntry, Item, EquipmentSlot, ItemType } from '@/types/game';
import { generateWorld } from '@/lib/world-generator';
import { MAP_SIZE, VIEWPORT_SIZE, ENERGY_REGEN_RATE, TERRAIN_ENERGY_COST, PLAYER_CLASSES, INVENTORY_SIZE, MOVE_COOLDOWN } from '@/lib/game-constants';
import GameBoard from './GameBoard';
import ControlPanel from './ControlPanel';
import MovementControls from './MovementControls';
import CombatDialog from './CombatDialog';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Progress } from '../ui/progress';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, Hourglass, ZapOff } from 'lucide-react';
import { useAudio } from '@/context/AudioContext';

interface GameProps {
  initialPlayer: Player;
  onReset: () => void;
}

export default function Game({ initialPlayer, onReset }: GameProps) {
  const [player, setPlayer] = useState<Player>(initialPlayer);
  const [worldMap, setWorldMap] = useState<TileData[][]>([]);
  const [viewport, setViewport] = useState<TileData[][]>([]);
  const [gameLog, setGameLog] = useState<string[]>(['Welcome to Square Clash!']);
  
  const [pendingCombat, setPendingCombat] = useState<Monster | null>(null);
  const [combatCountdown, setCombatCountdown] = useState(0);

  const [isMoving, setIsMoving] = useState(false);

  const [combatInfo, setCombatInfo] = useState<{ open: boolean, monster: Monster, log: CombatLogEntry[], result: string, loot?: Item | null } | null>(null);
  const { toast } = useToast();
  const { playAudio } = useAudio();

  const countdownTimer = useRef<NodeJS.Timeout>();
  const moveTimeout = useRef<NodeJS.Timeout>();

  // --- Music Effect ---
  useEffect(() => {
    playAudio('/audio/in-game-music.wav', { loop: true, fade: true });
  }, [playAudio]);

  // --- State Ref for Callbacks ---
  // This holds all the state that our move handler needs.
  // By using a ref, our keydown event listener can always access the latest state.
  const gameStateRef = useRef({
    player,
    worldMap,
    combatInfo,
    pendingCombat,
    isMoving
  });

  useEffect(() => {
    gameStateRef.current = { player, worldMap, combatInfo, pendingCombat, isMoving };
  }, [player, worldMap, combatInfo, pendingCombat, isMoving]);
  // ---------------------------------

  useEffect(() => {
    const map = generateWorld();
    setWorldMap(map);
    addLog(`A new world has been generated for ${player.name} the ${player.class}. Your quest begins!`);
  }, []); // Run only once per game instance

  const calculateStats = useCallback((basePlayer: Player) => {
    const baseStats = PLAYER_CLASSES[basePlayer.class];
    let attack = baseStats.attack;
    let defense = baseStats.defense;
    let criticalChance = baseStats.criticalChance + (basePlayer.bonusCritChance || 0);

    Object.values(basePlayer.equipment).forEach(item => {
        if(item) {
            attack += item.attack || 0;
            defense += item.defense || 0;
            criticalChance += item.criticalChance || 0;
        }
    });

    return {...basePlayer, attack, defense, criticalChance};
  }, []);

  useEffect(() => {
    setPlayer(p => calculateStats(p));
  }, [player.equipment, calculateStats]);

  const updateViewport = useCallback((center: { x: number; y: number }) => {
    if (worldMap.length === 0) return;
    const half = Math.floor(VIEWPORT_SIZE / 2);
    const startX = Math.max(0, center.x - half);
    const startY = Math.max(0, center.y - half);
    
    const newViewport: TileData[][] = [];
    for (let y = 0; y < VIEWPORT_SIZE; y++) {
      newViewport[y] = [];
      for (let x = 0; x < VIEWPORT_SIZE; x++) {
        const worldX = startX + x;
        const worldY = startY + y;
        if (worldX < MAP_SIZE && worldY < MAP_SIZE) {
          newViewport[y][x] = worldMap[worldY][worldX];
        } else {
          newViewport[y][x] = { terrain: 'mountain' }; // Edge of the world is impassable
        }
      }
    }
    setViewport(newViewport);
  }, [worldMap]);

  useEffect(() => {
    updateViewport(player.position);
  }, [player.position, worldMap, updateViewport]);
  
  useEffect(() => {
    const energyTimer = setInterval(() => {
      setPlayer(p => {
        if (p.hp <= 0) return p; // Don't regen if dead

        const currentTile = worldMap[p.position.y]?.[p.position.x];
        const isResting = currentTile?.terrain === 'camp';
        const energyBoost = isResting ? 5 : 0;
        
        if (p.energy < p.maxEnergy || (isResting && p.hp < p.maxHp)) {
          const energyRegen = (1 + energyBoost);
          const hpRegen = isResting ? 5 : 0;
          
          return { 
            ...p, 
            energy: Math.min(p.maxEnergy, p.energy + energyRegen),
            hp: Math.min(p.maxHp, p.hp + hpRegen),
          };
        }
        return p;
      });
    }, ENERGY_REGEN_RATE);
    return () => clearInterval(energyTimer);
  }, [worldMap]);


  const addLog = (message: string) => {
    setGameLog(prev => [message, ...prev.slice(0, 19)]);
  };

  const startCombat = (monster: Monster) => {
    addLog(`You encounter a fierce ${monster.name}!`);
    const combatLog: CombatLogEntry[] = [];
    setCombatInfo({ open: true, monster, log: combatLog, result: `Fighting ${monster.name}...` });

    let playerHp = gameStateRef.current.player.hp;
    let monsterHp = monster.hp;
    let turn = 0;

    const combatInterval = setInterval(() => {
      turn++;
      
      // Player attacks
      const playerDamage = Math.max(1, gameStateRef.current.player.attack - monster.defense);
      monsterHp -= playerDamage;
      const playerAttackMessage = `You strike the ${monster.name} for ${playerDamage} damage.`;
      setCombatInfo(info => ({...info!, log: [...info!.log, { id: turn * 2 - 1, message: playerAttackMessage }]}));

      if (monsterHp <= 0) {
        clearInterval(combatInterval);
        endCombat(playerHp, monster);
        return;
      }

      // Monster attacks
      const monsterDamage = Math.max(1, monster.attack - gameStateRef.current.player.defense);
      playerHp -= monsterDamage;
      const monsterAttackMessage = `The ${monster.name} hits you for ${monsterDamage} damage.`;
      setCombatInfo(info => ({...info!, log: [...info!.log, { id: turn * 2, message: monsterAttackMessage }]}));
      
      if (playerHp <= 0) {
        clearInterval(combatInterval);
        endCombat(0, monster);
        return;
      }
    }, 1000); // One action per second
  };

  const endCombat = (finalPlayerHp: number, monster: Monster) => {
    let result = '';
    let foundLoot: Item | null = null;
    if (finalPlayerHp > 0) {
      result = `You defeated the ${monster.name}! You have ${Math.round(finalPlayerHp)} HP left.`;
      playAudio('/audio/combat-victory.wav');
      const loot = monster.loot[Math.floor(Math.random() * monster.loot.length)];
      setPlayer(p => {
        const newInventory = [...p.inventory];
        if (loot) {
            foundLoot = loot;
            addLog(`You found: ${loot.name}!`);
            const existingItemIndex = newInventory.findIndex(i => i.id === loot.id);
            if (existingItemIndex > -1 && newInventory[existingItemIndex].quantity) {
                newInventory[existingItemIndex].quantity = (newInventory[existingItemIndex].quantity || 1) + 1;
            } else if(newInventory.length < INVENTORY_SIZE) {
                newInventory.push({...loot, quantity: 1});
            } else {
                addLog("Your inventory is full! You couldn't pick up the loot.");
                foundLoot = null;
            }
        }
        return {
          ...p,
          hp: finalPlayerHp,
          inventory: newInventory
        }
      });
    } else {
      result = `You were defeated by the ${monster.name}... You limp away.`;
      playAudio('/audio/combat-defeat.wav');
      setPlayer(p => ({ ...p, hp: 1, energy: Math.floor(p.energy/2) })); // Penalty on losing
    }
    addLog(result);
    setCombatInfo(info => ({...info!, result, loot: foundLoot}));
  };
  
  const initiateCombat = useCallback((monster: Monster) => {
     if (gameStateRef.current.combatInfo?.open || gameStateRef.current.pendingCombat) return;

    playAudio('/audio/combat-start.wav');
    setPendingCombat(monster);
    setCombatCountdown(3);

    countdownTimer.current = setInterval(() => {
        setCombatCountdown(c => {
            const newTime = c - 1;
            if (newTime <= 0) {
                clearInterval(countdownTimer.current);
            }
            return newTime;
        });
    }, 1000);
  }, [playAudio]);

  useEffect(() => {
    if (combatCountdown === 0 && pendingCombat) {
      startCombat(pendingCombat);
      setPendingCombat(null);
    }
  }, [combatCountdown, pendingCombat]);

  const handleMove = (dx: number, dy: number) => {
    const { player, worldMap, combatInfo, pendingCombat, isMoving } = gameStateRef.current;

    if (combatInfo?.open || pendingCombat || isMoving) {
        if (isMoving) {
             toast({
                title: (
                <div className="flex items-center gap-2">
                    <Hourglass className="h-5 w-5 text-destructive" />
                    <span className="font-headline">Movement Cooldown</span>
                </div>
                ),
                description: "You must wait before moving again.",
                variant: "destructive"
            });
        }
        return;
    }

    const newX = player.position.x + dx;
    const newY = player.position.y + dy;
    
    if (newX < 0 || newX >= MAP_SIZE || newY < 0 || newY >= MAP_SIZE) {
        addLog("You can't move beyond the edge of the world.");
        return;
    }

    const targetTile = worldMap[newY][newX];
    
    const moveCost = TERRAIN_ENERGY_COST[targetTile.terrain];
    if (player.energy < moveCost) {
      addLog("Not enough energy to move!");
      toast({
        title: (
          <div className="flex items-center gap-2">
            <ZapOff className="h-5 w-5 text-destructive" />
            <span className="font-headline">Out of Energy</span>
          </div>
        ),
        description: "You are too tired to move. Wait for your energy to recover.",
        variant: "destructive"
      });
      return;
    }
    
    playAudio('/audio/move.wav', { volume: 0.3 });
    setIsMoving(true);
    moveTimeout.current = setTimeout(() => setIsMoving(false), MOVE_COOLDOWN);
    
    setPlayer(p => {
        const newPlayerState = {
            ...p,
            energy: p.energy - moveCost,
            position: {x: newX, y: newY}
        };

        addLog(`You move to (${newX}, ${newY}). Energy spent: ${moveCost}.`);

        if (targetTile.monster) {
            initiateCombat(targetTile.monster);
            setWorldMap(prevMap => {
                const newMap = prevMap.map(row => [...row]);
                newMap[newY][newX] = {...newMap[newY][newX], monster: undefined};
                return newMap;
            });
        }
        
        if (targetTile.item) {
            addLog(`You found a ${targetTile.item.name}!`);
            playAudio('/audio/item-found.wav', { volume: 0.7 });
            const newInventory = [...newPlayerState.inventory];
            const existingItemIndex = newInventory.findIndex(i => i.id === targetTile.item!.id);
            if (existingItemIndex > -1 && newInventory[existingItemIndex].quantity) {
                newInventory[existingItemIndex].quantity = (newInventory[existingItemIndex].quantity || 1) + 1;
            } else if (newInventory.length < INVENTORY_SIZE) {
                newInventory.push({...targetTile.item, quantity: 1});
            } else {
                addLog("Your inventory is full! You leave the item on the ground.");
            }
            newPlayerState.inventory = newInventory;
            
            setWorldMap(prevMap => {
                const newMap = prevMap.map(row => [...row]);
                newMap[newY][newX] = {...newMap[newY][newX], item: undefined};
                return newMap;
            });
        }
        return newPlayerState;
    });

  };

  const handleUseItem = (itemToUse: Item, index: number) => {
    if (itemToUse.type !== 'consumable') return;

    let itemUsed = false;
    const newInventory = [...player.inventory];
    const itemInInventory = newInventory[index];

    if (itemInInventory && itemInInventory.id === itemToUse.id) {
        if(itemInInventory.quantity && itemInInventory.quantity > 1) {
            itemInInventory.quantity -= 1;
        } else {
            newInventory.splice(index, 1);
        }
        itemUsed = true;
    }

    if(itemUsed) {
        playAudio('/audio/use-potion.wav');
        setPlayer(p => {
            const newHp = Math.min(p.maxHp, p.hp + (itemToUse.hp || 0));
            addLog(`You used ${itemToUse.name}.`);
            return {...p, hp: newHp, inventory: newInventory };
        })
    }
  };

  const handleEquipItem = (itemToEquip: Item, index: number) => {
    if (itemToEquip.type === 'consumable') return;

    setPlayer(p => {
        const newInventory = [...p.inventory];
        const newEquipment = { ...p.equipment };
        const slot = itemToEquip.type as EquipmentSlot;

        // Remove from inventory
        newInventory.splice(index, 1);

        // If something is already equipped in that slot, move it to inventory
        const currentlyEquipped = newEquipment[slot];
        if(currentlyEquipped && newInventory.length < INVENTORY_SIZE) {
            newInventory.push(currentlyEquipped);
             addLog(`You unequipped ${currentlyEquipped.name}.`);
        } else if (currentlyEquipped) {
            addLog(`Your inventory is full! Could not unequip ${currentlyEquipped.name}.`);
            newInventory.splice(index, 0, itemToEquip); // add it back
            return p; // Abort if no space
        }

        // Equip new item
        playAudio('/audio/equip-item.wav');
        newEquipment[slot] = itemToEquip;
        addLog(`You equipped ${itemToEquip.name}.`);
        
        const newPlayer = {...p, inventory: newInventory, equipment: newEquipment};
        return calculateStats(newPlayer);
    });
  };

  const handleUnequipItem = (slot: EquipmentSlot) => {
    setPlayer(p => {
        if (p.inventory.length >= INVENTORY_SIZE) {
            addLog("Cannot unequip, inventory is full!");
            return p;
        }

        const newInventory = [...p.inventory];
        const newEquipment = { ...p.equipment };
        const itemToUnequip = newEquipment[slot];

        if (itemToUnequip) {
            playAudio('/audio/equip-item.wav', { volume: 0.5 });
            newEquipment[slot] = null;
            newInventory.push(itemToUnequip);
            addLog(`You unequipped ${itemToUnequip.name}.`);
        }

        const newPlayer = {...p, inventory: newInventory, equipment: newEquipment};
        return calculateStats(newPlayer);
    });
  }
  
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
          if (document.activeElement?.tagName === 'INPUT') return;
          if (e.key === 'ArrowUp') handleMove(0, -1);
          if (e.key === 'ArrowDown') handleMove(0, 1);
          if (e.key === 'ArrowLeft') handleMove(-1, 0);
          if (e.key === 'ArrowRight') handleMove(1, 0);
        };
    
        window.addEventListener('keydown', handleKeyDown);

        return () => {
          window.removeEventListener('keydown', handleKeyDown);
          clearTimeout(moveTimeout.current);
          clearInterval(countdownTimer.current);
        }
    }, [initiateCombat]);

  return (
    <div className="flex h-screen w-screen bg-background font-body text-foreground overflow-hidden">
      <main className="flex-1 flex flex-col items-center justify-center p-4 gap-4 relative">
        <h1 className="text-4xl font-headline text-primary absolute top-4 left-4">Square Clash</h1>
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        >
          <GameBoard viewport={viewport} playerIcon={player.icon} isMoving={isMoving} />
        </motion.div>
        <MovementControls onMove={handleMove} />
      </main>
      <aside className="w-1/3 max-w-sm bg-card border-l-2 border-border p-4 overflow-y-auto">
        <ControlPanel player={player} log={gameLog} onReset={onReset} onUseItem={handleUseItem} onEquipItem={handleEquipItem} onUnequipItem={handleUnequipItem} />
      </aside>
      
      {pendingCombat && !combatInfo?.open && (
        <AlertDialog open={true}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="font-headline text-2xl">Danger!</AlertDialogTitle>
                    <AlertDialogDescription>
                        You've encountered a wild {pendingCombat.name}! Prepare for battle!
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="text-center py-4">
                    <p className="text-6xl font-bold font-mono">{combatCountdown}</p>
                    <Progress value={(3 - combatCountdown) / 3 * 100} className="w-full mt-4 h-4"/>
                </div>
            </AlertDialogContent>
        </AlertDialog>
      )}

      {combatInfo && combatInfo.open && (
        <CombatDialog
          combatInfo={combatInfo}
          onClose={() => {
            setCombatInfo(info => info ? { ...info, open: false } : null);
            setPendingCombat(null);
          }}
        />
      )}
    </div>
  );
}

    