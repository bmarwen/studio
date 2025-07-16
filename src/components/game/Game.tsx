
"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import type { Player, TileData, Monster, CombatLogEntry, Item, EquipmentSlot, PlayerEffect, PlayerClass } from '@/types/game';
import { generateWorld } from '@/lib/world-generator';
import { MAP_SIZE, VIEWPORT_SIZE, STAMINA_REGEN_RATE, TERRAIN_STAMINA_COST, PLAYER_CLASSES, INVENTORY_SIZE, MOVE_COOLDOWN } from '@/lib/game-constants';
import GameBoard from './GameBoard';
import ControlPanel from './ControlPanel';
import MovementControls from './MovementControls';
import CombatDialog, { type CombatInfo } from './CombatDialog';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Progress } from '../ui/progress';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, Hourglass, ZapOff, Scroll, Heart, Activity, Shield, Swords, Wand, Dices, Settings, ShieldCheck, PersonStanding, ShieldOff } from 'lucide-react';
import { useAudio } from '@/context/AudioContext';
import { createItem } from '@/lib/game-config';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Label } from '../ui/label';
import { Slider } from '../ui/slider';
import { Button } from '../ui/button';


const CLASS_ICONS: Record<PlayerClass, string> = {
    warrior: '/icons/warrior-icon.png',
    mage: '/icons/mage-icon.png',
    ranger: '/icons/ranger-icon.png',
    assassin: '/icons/assassin-icon.png',
}

const StatItem = ({ icon, label, value, maxValue, colorClass, indicatorClassName }: { icon: React.ReactNode, label: string, value: number, maxValue?: number, colorClass: string, indicatorClassName?: string }) => (
  <div>
    <div className="flex justify-between items-center mb-1 text-sm">
      <div className="flex items-center gap-2">
        {icon}
        <span className="font-medium">{label}</span>
      </div>
      <span className={`font-mono ${colorClass}`}>{maxValue ? `${Math.round(value)}/${maxValue}` : value}</span>
    </div>
    {maxValue && <Progress value={(value / maxValue) * 100} className="h-2" indicatorClassName={indicatorClassName} />}
  </div>
);

const CombatStatDisplay = ({ label, value, icon, tooltipText }: { label: string, value: number, icon: React.ReactNode, tooltipText: string }) => (
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger asChild>
                <div className="flex justify-between items-center text-sm py-1 border-b border-border/50">
                    <span className="font-bold uppercase text-muted-foreground flex items-center gap-1">{icon}{label}</span>
                    <span className="font-mono text-primary">{value}</span>
                </div>
            </TooltipTrigger>
            <TooltipContent>
                <p>{tooltipText}</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
);


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
  const [moveCooldown, setMoveCooldown] = useState(MOVE_COOLDOWN);

  const [combatInfo, setCombatInfo] = useState<CombatInfo | null>(null);
  const { toast } = useToast();
  const { playAudio } = useAudio();

  const combatTimerRef = useRef<NodeJS.Timeout>();
  const worldGeneratedRef = useRef(false);

  // --- Music Effect ---
  useEffect(() => {
    // playAudio('/audio/in-game-music.wav', { loop: true, fade: true });
  }, [playAudio]);

  // --- State Ref for Callbacks ---
  const gameStateRef = useRef({
    player,
    worldMap,
    combatInfo,
    pendingCombat,
    isMoving,
    moveCooldown
  });

  useEffect(() => {
    gameStateRef.current = { player, worldMap, combatInfo, pendingCombat, isMoving, moveCooldown };
  }, [player, worldMap, combatInfo, pendingCombat, isMoving, moveCooldown]);
  // ---------------------------------

  useEffect(() => {
    if (worldGeneratedRef.current) return;
    worldGeneratedRef.current = true;
    
    const map = generateWorld();
    setWorldMap(map);
    addLog(`A new world has been generated for ${player.name} the ${player.class}. Your quest begins!`);
  }, []); // Run only once per game instance

  const calculateStats = useCallback((basePlayer: Player) => {
    const baseStats = PLAYER_CLASSES[basePlayer.class];
    let attack = baseStats.attack;
    let magicAttack = baseStats.magicAttack;
    let defense = baseStats.defense;
    let armor = baseStats.armor;
    let magicResist = baseStats.magicResist;
    let evasion = baseStats.evasion;
    let criticalChance = baseStats.criticalChance + (basePlayer.bonusCritChance || 0);

    Object.values(basePlayer.equipment).forEach(item => {
        if(item) {
            attack += item.attack || 0;
            magicAttack += item.magicAttack || 0;
            defense += item.defense || 0;
            armor += item.armor || 0;
            magicResist += item.magicResist || 0;
            evasion += item.evasion || 0;
            criticalChance += item.criticalChance || 0;
        }
    });

    return {...basePlayer, attack, magicAttack, defense, armor, magicResist, evasion, criticalChance};
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
    const staminaTimer = setInterval(() => {
      setPlayer(p => {
        if (p.hp <= 0) return p; // Don't regen if dead

        // Clean up expired effects
        const now = Date.now();
        const activeEffects = p.activeEffects.filter(effect => effect.expiresAt > now);

        const currentTile = worldMap[p.position.y]?.[p.position.x];
        const isResting = currentTile?.terrain === 'camp';
        const staminaBoost = isResting ? 5 : 0;
        
        let staminaRegenMultiplier = 1;
        const regenBuff = activeEffects.find(e => e.type === 'stamina_regen_boost');
        if (regenBuff) {
            staminaRegenMultiplier += regenBuff.value;
        }

        if (p.stamina < p.maxStamina || (isResting && p.hp < p.maxHp)) {
          const staminaRegen = (1 + staminaBoost) * staminaRegenMultiplier;
          const hpRegen = isResting ? 5 : 0;
          
          return { 
            ...p, 
            stamina: Math.min(p.maxStamina, p.stamina + staminaRegen),
            hp: Math.min(p.maxHp, p.hp + hpRegen),
            activeEffects: activeEffects,
          };
        }
        
        // If nothing else changes, still update effects if some expired
        if (activeEffects.length !== p.activeEffects.length) {
            return { ...p, activeEffects };
        }

        return p;
      });
    }, STAMINA_REGEN_RATE);
    return () => clearInterval(staminaTimer);
  }, [worldMap]);


  const addLog = (message: string) => {
    setGameLog(prev => [message, ...prev.slice(0, 19)]);
  };

  const startCombat = useCallback((monster: Monster) => {
    addLog(`You encounter a fierce ${monster.name}!`);
    const initialPlayerState = gameStateRef.current.player;

    setCombatInfo({ 
        open: true, 
        monster, 
        log: [], 
        status: 'fighting', 
        playerHp: initialPlayerState.hp, 
        playerMaxHp: initialPlayerState.maxHp, 
        monsterHp: monster.hp,
        playerIcon: initialPlayerState.icon
    });

    let playerHp = initialPlayerState.hp;
    let monsterHp = monster.hp;
    let turn = 0;

    const combatInterval = setInterval(() => {
      turn++;
      
      const currentPlayerState = gameStateRef.current.player;

      // Player attacks
      const playerDamage = Math.max(1, (currentPlayerState.attack + currentPlayerState.magicAttack) - monster.defense);
      monsterHp -= playerDamage;
      const playerAttackMessage = `You strike the ${monster.name} for ${playerDamage} damage.`;
      
      setCombatInfo(info => ({
          ...info!, 
          log: [...info!.log, { id: turn * 2 - 1, message: playerAttackMessage }],
          monsterHp: Math.max(0, monsterHp),
        }));

      if (monsterHp <= 0) {
        clearInterval(combatInterval);
        endCombat(playerHp, monster);
        return;
      }

      // Monster attacks
      const monsterDamage = Math.max(1, monster.attack - currentPlayerState.defense);
      playerHp -= monsterDamage;
      const monsterAttackMessage = `The ${monster.name} hits you for ${monsterDamage} damage.`;
      setCombatInfo(info => ({
          ...info!, 
          log: [...info!.log, { id: turn * 2, message: monsterAttackMessage }],
          playerHp: playerHp,
      }));
      
      if (playerHp <= 0) {
        clearInterval(combatInterval);
        endCombat(0, monster);
        return;
      }
    }, 1000); // One action per second
  }, []); // Eslint ignore: we need stable function

  const endCombat = (finalPlayerHp: number, monster: Monster) => {
    let newStatus: 'victory' | 'defeat';
    const allLoot: Item[] = [];
    if (finalPlayerHp > 0) {
      newStatus = 'victory';
      addLog(`You defeated the ${monster.name}! You have ${Math.round(finalPlayerHp)} HP left.`);
      playAudio('/audio/combat-victory.wav');

      // Process loot table
      if(monster.lootTable) {
          for(const loot of monster.lootTable) {
              if (Math.random() < loot.chance) {
                  allLoot.push(createItem(loot.itemId, loot.quantity));
              }
          }
      }
      
      setPlayer(p => {
        const inventoryCapacity = INVENTORY_SIZE + (p.hasBackpack ? 4 : 0);
        const newInventory = [...p.inventory];
        if (allLoot.length > 0) {
            allLoot.forEach(loot => {
                const logMessage = loot.quantity > 1 ? `${loot.quantity}x ${loot.name}` : loot.name;
                addLog(`You found: ${logMessage}!`);
                const existingItemIndex = newInventory.findIndex(i => i?.itemId === loot.itemId && i?.type === 'consumable');

                if (existingItemIndex > -1 && newInventory[existingItemIndex] && newInventory[existingItemIndex]!.quantity) {
                    newInventory[existingItemIndex]!.quantity = (newInventory[existingItemIndex]!.quantity || 1) + loot.quantity;
                } else {
                    const emptySlotIndex = newInventory.findIndex(slot => slot === null || slot === undefined);
                    if (emptySlotIndex !== -1 && emptySlotIndex < inventoryCapacity) {
                         newInventory[emptySlotIndex] = loot;
                    } else if (newInventory.filter(i => i !== null).length < inventoryCapacity) {
                         newInventory.push(loot);
                    } else {
                         addLog(`Your inventory is full! You couldn't pick up the ${loot.name}.`);
                    }
                }
            })
        }

        return {
          ...p,
          hp: finalPlayerHp,
          inventory: newInventory
        }
      });
    } else {
      newStatus = 'defeat';
      addLog(`You were defeated by the ${monster.name}... You limp away.`);
      playAudio('/audio/combat-defeat.wav');
      setPlayer(p => ({ ...p, hp: 1, stamina: Math.floor(p.stamina/2) })); // Penalty on losing
    }
    
    setCombatInfo(info => ({...info!, status: newStatus, loot: allLoot}));
  };
  
  const initiateCombat = useCallback((monster: Monster) => {
    if (gameStateRef.current.combatInfo?.open || gameStateRef.current.pendingCombat) return;

    setTimeout(() => {
        setPendingCombat(monster);
        setCombatCountdown(3);
    }, 1300); // 1.3s delay
  }, []);

  useEffect(() => {
    if (combatCountdown > 0 && pendingCombat) {
      combatTimerRef.current = setTimeout(() => {
        setCombatCountdown(prev => prev - 1);
      }, 1000);
    } else if (combatCountdown === 0 && pendingCombat) {
      startCombat(pendingCombat);
      setPendingCombat(null);
    }
    return () => {
      if (combatTimerRef.current) {
        clearTimeout(combatTimerRef.current);
      }
    }
  }, [combatCountdown, pendingCombat, startCombat]);


  const handleMove = (dx: number, dy: number) => {
    const { player, worldMap, combatInfo, pendingCombat, isMoving, moveCooldown: currentMoveCooldown } = gameStateRef.current;

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
    
    const moveCost = TERRAIN_STAMINA_COST[targetTile.terrain];
    if (player.stamina < moveCost) {
      addLog("Not enough stamina to move!");
      toast({
        title: (
          <div className="flex items-center gap-2">
            <ZapOff className="h-5 w-5 text-destructive" />
            <span className="font-headline">Out of Stamina</span>
          </div>
        ),
        description: "You are too tired to move. Wait for your stamina to recover.",
        variant: "destructive"
      });
      return;
    }
    
    setIsMoving(true);
    playAudio('/audio/move.wav', { volume: 0.3 });
    
    addLog(`You move to (${newX}, ${newY}). Stamina spent: ${moveCost}.`);

    if (targetTile.item) {
        const logMessage = targetTile.item.quantity && targetTile.item.quantity > 1 ? `${targetTile.item.quantity}x ${targetTile.item.name}`: targetTile.item.name;
        addLog(`You found a ${logMessage}!`);
        playAudio('/audio/item-found.wav', { volume: 0.7 });
    }

    setPlayer(p => {
        const newPlayerState = {
            ...p,
            stamina: p.stamina - moveCost,
            position: {x: newX, y: newY}
        };

        if (targetTile.monster) {
            initiateCombat(targetTile.monster);
            setWorldMap(prevMap => {
                const newMap = prevMap.map(row => [...row]);
                newMap[newY][newX] = {...newMap[newY][newX], monster: undefined};
                return newMap;
            });
        }
        
        const inventoryCapacity = INVENTORY_SIZE + (newPlayerState.hasBackpack ? 4 : 0);

        if (targetTile.item) {
            const newInventory = [...newPlayerState.inventory];
            const existingItemIndex = newInventory.findIndex(i => i?.itemId === targetTile.item!.itemId && i.type === 'consumable');

            if (existingItemIndex > -1 && newInventory[existingItemIndex] && newInventory[existingItemIndex]!.quantity) {
                newInventory[existingItemIndex]!.quantity = (newInventory[existingItemIndex]!.quantity || 1) + (targetTile.item.quantity || 1);
            } else if (newInventory.filter(i => i !== null).length < inventoryCapacity) {
                const emptySlotIndex = newInventory.findIndex(slot => slot === null || slot === undefined);
                if (emptySlotIndex !== -1) {
                    newInventory[emptySlotIndex] = targetTile.item;
                } else {
                    newInventory.push(targetTile.item);
                }
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

    setTimeout(() => {
      setIsMoving(false);
    }, currentMoveCooldown);

  };

  const handleUseItem = (itemToUse: Item, index: number) => {
    if (itemToUse.type !== 'consumable' && itemToUse.type !== 'utility') return;
    
    if (itemToUse.hp && player.hp >= player.maxHp) {
        toast({
            title: (
                <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-400" />
                    <span className="font-headline">Health is Full</span>
                </div>
            ),
            description: "You cannot use this item, your health is already full.",
            variant: "destructive",
        });
        return;
    }
    
    if (itemToUse.inventorySlots && player.hasBackpack) {
        toast({
            title: (
                <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-400" />
                    <span className="font-headline">Backpack Already Equipped</span>
                </div>
            ),
            description: "You can only benefit from one backpack.",
            variant: "destructive",
        });
        return;
    }


    let itemUsed = false;
    const newInventory = [...player.inventory];
    const itemInInventory = newInventory[index];

    if (itemInInventory && itemInInventory.id === itemToUse.id) {
        if(itemInInventory.quantity && itemInInventory.quantity > 1) {
            itemInInventory.quantity -= 1;
        } else {
            newInventory[index] = null;
        }
        itemUsed = true;
    }

    if(itemUsed) {
        playAudio('/audio/use-potion.wav');
        let logMessage = `You used ${itemToUse.name}.`;
        if (itemToUse.itemId?.includes('elixir_of_power')) {
            logMessage = `You feel a surge of power from the ${itemToUse.name}!`;
        } else if (itemToUse.staminaRegenBonus && itemToUse.effectDuration) {
            logMessage = `You feel energized by the ${itemToUse.name}!`;
        } else if (itemToUse.inventorySlots) {
            logMessage = `You equip the ${itemToUse.name}, gaining more inventory space!`;
        }
        addLog(logMessage);

        setPlayer(p => {
            let newPlayerState = {...p};
            const newHp = Math.min(p.maxHp, p.hp + (itemToUse.hp || 0));
            newPlayerState.hp = newHp;
            
            if (itemToUse.itemId?.includes('elixir_of_power')) {
                 if (p.magicAttack > p.attack) {
                    newPlayerState.magicAttack += itemToUse.magicAttack || 0;
                 } else {
                    newPlayerState.attack += itemToUse.attack || 0;
                 }
            } else if (itemToUse.staminaRegenBonus && itemToUse.effectDuration) {
                const newEffect: PlayerEffect = {
                    id: `effect_${itemToUse.id}_${Date.now()}`,
                    type: 'stamina_regen_boost',
                    value: itemToUse.staminaRegenBonus,
                    expiresAt: Date.now() + itemToUse.effectDuration * 1000,
                };
                newPlayerState.activeEffects = [...newPlayerState.activeEffects, newEffect];
            } else if (itemToUse.inventorySlots) {
                newPlayerState.hasBackpack = true;
            }

            newPlayerState.inventory = newInventory;
            return calculateStats(newPlayerState);
        })
    }
  };

  const handleEquipItem = (itemToEquip: Item, index: number) => {
    if (itemToEquip.type === 'consumable' || itemToEquip.type === 'utility') return;

    if (itemToEquip.allowedClasses && !itemToEquip.allowedClasses.includes(player.class)) {
        toast({
            title: (
                <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    <span className="font-headline">Wrong Class</span>
                </div>
            ),
            description: `You are a ${player.class}. You cannot equip this item.`,
            variant: "destructive",
        });
        return;
    }

    setPlayer(p => {
        const newInventory = [...p.inventory];
        const newEquipment = { ...p.equipment };
        const slot = itemToEquip.type as EquipmentSlot;

        // Remove from inventory
        newInventory[index] = null;

        // If something is already equipped in that slot, move it to inventory
        const currentlyEquipped = newEquipment[slot];
        if(currentlyEquipped) {
            const emptySlotIndex = newInventory.findIndex(i => !i);
            if (emptySlotIndex !== -1) {
                newInventory[emptySlotIndex] = currentlyEquipped;
                addLog(`You unequipped ${currentlyEquipped.name}.`);
            } else {
                 addLog(`Your inventory is full! Could not unequip ${currentlyEquipped.name}.`);
                 newInventory[index] = itemToEquip; // add it back
                 return p; // Abort if no space
            }
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
        const inventoryCapacity = INVENTORY_SIZE + (p.hasBackpack ? 4 : 0);
        const emptySlotIndex = p.inventory.findIndex(i => !i);
        if (emptySlotIndex === -1 && p.inventory.filter(i => i).length >= inventoryCapacity) {
            addLog("Cannot unequip, inventory is full!");
            toast({
                title: (
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        <span className="font-headline">Inventory Full</span>
                    </div>
                ),
                description: "You cannot unequip this item because your inventory is full.",
                variant: "destructive",
            });
            return p;
        }

        const newInventory = [...p.inventory];
        const newEquipment = { ...p.equipment };
        const itemToUnequip = newEquipment[slot];

        if (itemToUnequip) {
            playAudio('/audio/equip-item.wav', { volume: 0.5 });
            newEquipment[slot] = null;
            newInventory[emptySlotIndex] = itemToUnequip;
            addLog(`You unequipped ${itemToUnequip.name}.`);
        }

        const newPlayer = {...p, inventory: newInventory, equipment: newEquipment};
        return calculateStats(newPlayer);
    });
  }
  
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
          if (document.activeElement?.tagName === 'INPUT') return;
          if (e.key === 'ArrowUp' || e.key === 'w') handleMove(0, -1);
          if (e.key === 'ArrowDown' || e.key === 's') handleMove(0, 1);
          if (e.key === 'ArrowLeft' || e.key === 'a') handleMove(-1, 0);
          if (e.key === 'ArrowRight' || e.key === 'd') handleMove(1, 0);
        };
    
        window.addEventListener('keydown', handleKeyDown);

        return () => {
          window.removeEventListener('keydown', handleKeyDown);
        }
    }, []);

  return (
    <div className="min-h-screen w-screen bg-background font-body text-foreground flex justify-center pt-12">
       <div className="flex flex-row items-start justify-center gap-2 w-full">
            
            <div className="flex items-center" style={{height: '744px'}}>
              <MovementControls onMove={handleMove} />
            </div>

            <main className="flex flex-col items-center gap-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <GameBoard viewport={viewport} playerIcon={player.icon} isMoving={isMoving} moveCooldown={moveCooldown} />
                </motion.div>
                <div className="w-full max-w-xl mx-auto">
                    <ControlPanel 
                        player={player} 
                        onUseItem={handleUseItem} 
                        onEquipItem={handleEquipItem} 
                        onUnequipItem={handleUnequipItem}
                    />
                </div>
            </main>

            <aside className="w-72 flex flex-col gap-4">
                 <Card className="bg-card/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="font-headline text-2xl text-primary">{player.name}</CardTitle>
                        <img src={CLASS_ICONS[player.class]} alt={player.class} className="w-14 h-14 rounded-full bg-secondary p-1" />
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <CardDescription className="flex items-center gap-2">
                            Level 1 {player.class.charAt(0).toUpperCase() + player.class.slice(1)}
                        </CardDescription>
                         <Separator />
                        <StatItem icon={<Heart className="text-red-500" />} label="Health" value={player.hp} maxValue={player.maxHp} colorClass="text-red-500" indicatorClassName="bg-red-500" />
                        <StatItem icon={<Activity className="text-yellow-400" />} label="Stamina" value={player.stamina} maxValue={player.maxStamina} colorClass="text-yellow-400" indicatorClassName="bg-yellow-400" />
                         <Separator />
                         <div className="grid grid-cols-2 gap-x-4">
                            {player.magicAttack > player.attack ? (
                                 <CombatStatDisplay label="M.ATT" value={player.magicAttack} icon={<Wand size={16}/>} tooltipText="Magic Attack" />
                            ) : (
                                 <CombatStatDisplay label="P.ATT" value={player.attack} icon={<Swords size={16}/>} tooltipText="Physical Attack" />
                            )}
                            <CombatStatDisplay label="DEF" value={player.defense} icon={<Shield size={16}/>} tooltipText="Defense" />
                            <CombatStatDisplay label="ARM" value={player.armor} icon={<ShieldCheck size={16}/>} tooltipText="Armor" />
                            <CombatStatDisplay label="M.RES" value={player.magicResist} icon={<Wand size={16}/>} tooltipText="Magic Resist" />
                            <CombatStatDisplay label="EVA" value={player.evasion} icon={<ShieldOff size={16}/>} tooltipText="Evasion" />
                            <CombatStatDisplay label="CRIT" value={player.criticalChance} icon={<Dices size={16}/>} tooltipText="Crit Chance" />
                        </div>
                    </CardContent>
                </Card>
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="dev">
                        <AccordionTrigger className="text-lg font-headline bg-card/50 px-4 rounded-t-lg">
                            <div className="flex items-center gap-2"><Settings />Dev Mode</div>
                        </AccordionTrigger>
                        <AccordionContent className="p-4 space-y-4 bg-card/50 rounded-b-lg">
                        <p className="text-xs text-muted-foreground">Dev tools for testing.</p>
                        <div className='space-y-2'>
                            <Label>Move Cooldown: {(moveCooldown / 1000).toFixed(1)}s</Label>
                            <Slider 
                                value={[moveCooldown]}
                                onValueChange={([v]) => setMoveCooldown(v)} 
                                min={500} 
                                max={3000} 
                                step={100} 
                            />
                        </div>
                        <Button variant="outline" onClick={onReset} className="w-full">Reset World</Button>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
                <Card className="h-80">
                    <CardHeader className="p-4">
                        <CardTitle className="font-headline text-lg flex items-center gap-2"><Scroll />Game Log</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 h-[calc(100%-4rem)]">
                        <div className="text-xs font-mono space-y-2 p-4 h-full bg-secondary rounded-b-lg overflow-y-auto custom-scrollbar">
                            {gameLog.map((msg, i) => <p key={i} className={i === 0 ? 'text-foreground' : 'text-muted-foreground'}>{`> ${msg}`}</p>)}
                        </div>
                    </CardContent>
                </Card>
            </aside>
       </div>
       
      {pendingCombat && combatCountdown > 0 && (
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
 

    


    

    

    

    