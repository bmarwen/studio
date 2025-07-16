
"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import type { Player, TileData, Monster, CombatLogEntry, Item, EquipmentSlot, PlayerEffect, PlayerClass, DistributableStat } from '@/types/game';
import { generateWorld } from '@/lib/world-generator';
import { MAP_SIZE, VIEWPORT_SIZE, STAMINA_REGEN_RATE, MOVE_COOLDOWN, PLAYER_CLASSES, INVENTORY_SIZE, BASE_XP_TO_LEVEL, TERRAIN_STAMINA_COST } from '@/lib/game-constants';
import GameBoard from './GameBoard';
import ControlPanel from './ControlPanel';
import MovementControls from './MovementControls';
import CombatDialog, { type CombatInfo } from './CombatDialog';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogAction } from '@/components/ui/alert-dialog';
import { Progress } from '../ui/progress';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, Hourglass, ZapOff, Scroll, Heart, Activity, Shield, Swords, Wand, Dices, Settings, ShieldCheck, Gem, Star, MapPin, UtensilsCrossed, Rabbit, Antenna, Volume2, VolumeX, LocateOff, Plus, Minus, BrainCircuit, Omega } from 'lucide-react';
import { useAudio } from '@/context/AudioContext';
import { createItem } from '@/lib/game-config';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Label } from '../ui/label';
import { Slider } from '../ui/slider';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';


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

const CombatStatDisplay = ({ label, value, icon, tooltipText, isPercent = false }: { label: string, value: number, icon: React.ReactNode, tooltipText: string, isPercent?: boolean }) => (
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger asChild>
                <div className="flex justify-between items-center text-sm py-1 border-b border-border/50">
                    <span className="font-bold uppercase text-muted-foreground flex items-center gap-1">{icon}{label}</span>
                    <span className="font-mono text-primary">{value}{isPercent ? '%' : ''}</span>
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
  const [moveCount, setMoveCount] = useState(0);

  const [isLevelUpDialogOpen, setLevelUpDialogOpen] = useState(false);
  const [pendingStatPoints, setPendingStatPoints] = useState<Partial<Record<DistributableStat, number>>>({});
  
  const [combatInfo, setCombatInfo] = useState<CombatInfo | null>(null);
  const { toast } = useToast();
  const { playAudio, toggleMute, isMuted } = useAudio();

  const combatTimerRef = useRef<NodeJS.Timeout>();
  const worldGeneratedRef = useRef(false);

  // --- Music Effect ---
  useEffect(() => {
    playAudio('/audio/game-music.wav', { loop: true });
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
  }, [player.name, player.class]); // Run only once per game instance

  const calculateStats = useCallback((basePlayer: Player) => {
    const classStats = PLAYER_CLASSES[basePlayer.class];

    let attack = basePlayer.attack;
    let magicAttack = basePlayer.magicAttack;
    let defense = basePlayer.defense;
    let armor = classStats.armor;
    let magicResist = classStats.magicResist;
    let evasion = classStats.evasion;
    let criticalChance = classStats.criticalChance + (basePlayer.bonusCritChance || 0);

    // Secondary stats
    let initiative = 50; // Base value
    let scoutRange = 0; // Base value
    let doubleHitChance = 0; // Base value
    let lootLuck = 0; // Base value
    let xpGainBonus = (basePlayer.bonusXpGain || 0);

    Object.values(basePlayer.equipment).forEach(item => {
        if(item) {
            attack += item.attack || 0;
            magicAttack += item.magicAttack || 0;
            defense += item.defense || 0;
            armor += item.armor || 0;
            magicResist += item.magicResist || 0;
            evasion += item.evasion || 0;
            criticalChance += item.criticalChance || 0;
            
            initiative += item.initiative || 0;
            scoutRange += item.scoutRange || 0;
            doubleHitChance += item.doubleHitChance || 0;
            lootLuck += item.lootLuck || 0;
            xpGainBonus += item.xpGainBonus || 0;
        }
    });

    return {...basePlayer, attack, magicAttack, defense, armor, magicResist, evasion, criticalChance, initiative, scoutRange, doubleHitChance, lootLuck, xpGainBonus};
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

const attemptToAddToInventory = (inventory: (Item | null)[], itemToAdd: Item, player: Player): { newInventory: (Item | null)[], success: boolean } => {
    const newInventory = [...inventory];
    const capacity = INVENTORY_SIZE + (player.hasBackpack ? 4 : 0);

    // --- 1. Attempt to STACK ---
    if (itemToAdd.type === 'consumable' && itemToAdd.quantity) {
        for (let i = 0; i < newInventory.length; i++) {
            const existingItem = newInventory[i];
            if (existingItem?.itemId === itemToAdd.itemId && existingItem.quantity && existingItem.quantity < 9) {
                newInventory[i] = { ...existingItem, quantity: existingItem.quantity + 1 };
                // If stacking a quantity of more than 1, this needs a loop, but for now, we assume adding one at a time.
                return { newInventory, success: true };
            }
        }
    }

    // --- 2. Attempt to add to an EMPTY SLOT ---
    const emptySlotIndex = newInventory.findIndex(slot => slot === null);
    if (emptySlotIndex !== -1) {
        newInventory[emptySlotIndex] = itemToAdd;
        return { newInventory, success: true };
    }

    // --- 3. No space found ---
    return { newInventory: inventory, success: false };
};


  const endCombat = (finalPlayerHp: number, monster: Monster) => {
    let newStatus: 'victory' | 'defeat';
    const allLoot: Item[] = [];
    const logsToAdd: string[] = [];
    
    // Get the most up-to-date player state
    const playerState = gameStateRef.current.player;
    let newPlayerState = { ...playerState };

    if (finalPlayerHp > 0) {
        newStatus = 'victory';
        const xpGained = monster.xp;
        playAudio('/audio/combat-victory.wav');

        if (monster.lootTable) {
            for (const loot of monster.lootTable) {
                if (Math.random() < loot.chance) {
                    allLoot.push(createItem(loot.itemId, loot.quantity));
                }
            }
        }
      
        let tempInventory = [...newPlayerState.inventory];
        if (allLoot.length > 0) {
            for (const lootItem of allLoot) {
                const { newInventory, success } = attemptToAddToInventory(tempInventory, lootItem, newPlayerState);
                tempInventory = newInventory;
                const logMessage = lootItem.quantity > 1 ? `${lootItem.quantity}x ${lootItem.name}` : lootItem.name;
                if (success) {
                    logsToAdd.push(`You found: ${logMessage}!`);
                } else {
                    logsToAdd.push(`Your inventory is full! Couldn't pick up ${logMessage}.`);
                }
            }
        }

        newPlayerState.inventory = tempInventory;
        
        logsToAdd.push(`You defeated the ${monster.name}! You gain ${xpGained} XP. You have ${Math.round(finalPlayerHp)} HP left.`);
        
        let currentXp = newPlayerState.xp + xpGained;
        let currentLevel = newPlayerState.level;
        let xpToNext = newPlayerState.xpToNextLevel;
        let newStatPoints = newPlayerState.statPoints;

        if (currentXp >= xpToNext) {
            playAudio('/audio/level-up.wav');
            currentLevel++;
            currentXp -= xpToNext;
            xpToNext = Math.floor(BASE_XP_TO_LEVEL * Math.pow(currentLevel, 1.5));
            newStatPoints += 2;
            logsToAdd.push(`Level Up! You are now level ${currentLevel}!`);
            setLevelUpDialogOpen(true);
        }

        newPlayerState = {
            ...newPlayerState,
            hp: finalPlayerHp,
            level: currentLevel,
            xp: currentXp,
            xpToNextLevel: xpToNext,
            statPoints: newStatPoints,
        };
        
        setPlayer(newPlayerState);
        setGameLog(prev => [...logsToAdd.reverse(), ...prev.slice(0, 20 - logsToAdd.length)]);
        setCombatInfo(info => ({...info!, status: newStatus, loot: allLoot, xpGained }));

    } else {
        newStatus = 'defeat';
        logsToAdd.push(`You were defeated by the ${monster.name}... You limp away.`);
        playAudio('/audio/combat-defeat.wav');
        
        newPlayerState = { ...newPlayerState, hp: 1, stamina: Math.floor(playerState.stamina/2) };
        setPlayer(newPlayerState);
        setGameLog(prev => [...logsToAdd.reverse(), ...prev.slice(0, 20 - logsToAdd.length)]);
        setCombatInfo(info => ({...info!, status: newStatus, loot: [], xpGained: 0 }));
    }
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
    setMoveCount(c => c + 1);
    playAudio('/audio/move.wav', { volume: 0.3 });
    
    addLog(`You move to (${newX}, ${newY}). Stamina spent: ${moveCost}.`);

    if (targetTile.item) {
        playAudio('/audio/item-found.wav', { volume: 0.7 });
    }

    setPlayer(p => {
        let newPlayerState = {
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
        
        if (targetTile.item) {
            const foundItem = targetTile.item;
            const { newInventory, success } = attemptToAddToInventory(p.inventory, foundItem, p);
            
            if(success) {
                newPlayerState.inventory = newInventory;
                 addLog(`You found: ${foundItem.name}!`);

                setWorldMap(prevMap => {
                    const newMap = prevMap.map(row => [...row]);
                    newMap[newY][newX] = {...newMap[newY][newX], item: undefined};
                    return newMap;
                });
            } else {
                addLog(`Your inventory is full! You couldn't pick up the ${foundItem.name}.`);
            }
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
    
    let logMessage = `You used ${itemToUse.name}.`;
    if (itemToUse.itemId?.includes('elixir_of_power')) {
        logMessage = `You feel a surge of power from the ${itemToUse.name}!`;
    } else if (itemToUse.staminaRegenBonus && itemToUse.effectDuration) {
        logMessage = `You feel energized by the ${itemToUse.name}!`;
    } else if (itemToUse.inventorySlots) {
        logMessage = `You equip the ${itemToUse.name}, gaining more inventory space!`;
    } else if (itemToUse.xpGainBonus) {
        logMessage = `You read the ${itemToUse.name} and feel more knowledgeable!`;
    }
    addLog(logMessage);
    playAudio('/audio/use-potion.wav');

    setPlayer(p => {
        let itemUsed = false;
        const newInventory = [...p.inventory];
        const itemInInventory = newInventory[index];

        if (itemInInventory && itemInInventory.id === itemToUse.id) {
            if(itemInInventory.quantity && itemInInventory.quantity > 1) {
                itemInInventory.quantity -= 1;
            } else {
                newInventory[index] = null;
            }
            itemUsed = true;
        }

        if(!itemUsed) return p;

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
        } 
        
        if (itemToUse.xpGainBonus) {
            newPlayerState.xpGainBonus += itemToUse.xpGainBonus;
        }

        newPlayerState.inventory = newInventory;
        return calculateStats(newPlayerState);
    })
  };

  const handleEquipItem = (itemToEquip: Item, index: number) => {
    if (itemToEquip.type === 'consumable' || itemToEquip.type === 'utility' || itemToEquip.type === 'quest') return;

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

    addLog(`You equipped ${itemToEquip.name}.`);
    playAudio('/audio/equip-item.wav');

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
        newEquipment[slot] = itemToEquip;
        
        const newPlayer = {...p, inventory: newInventory, equipment: newEquipment};
        return calculateStats(newPlayer);
    });
  };

  const handleUnequipItem = (slot: EquipmentSlot) => {
    const itemToUnequip = player.equipment[slot];
    if (!itemToUnequip) return;
    
    const inventoryCapacity = INVENTORY_SIZE + (player.hasBackpack ? 4 : 0);
    const currentItemCount = player.inventory.filter(i => i).length;
    if (currentItemCount >= inventoryCapacity) {
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
        return;
    }
    
    addLog(`You unequipped ${itemToUnequip.name}.`);
    playAudio('/audio/equip-item.wav', { volume: 0.5 });

    setPlayer(p => {
        const newInventory = [...p.inventory];
        const newEquipment = { ...p.equipment };
        const emptySlotIndex = player.inventory.findIndex(i => !i);
        
        newEquipment[slot] = null;
        newInventory[emptySlotIndex] = itemToUnequip;

        const newPlayer = {...p, inventory: newInventory, equipment: newEquipment};
        return calculateStats(newPlayer);
    });
  }

  const handleStatPointChange = (stat: DistributableStat, amount: number) => {
      const currentSpent = Object.values(pendingStatPoints).reduce((acc, val) => acc + (val || 0), 0);
      const pointsAvailable = player.statPoints - currentSpent;

      if (amount > 0 && pointsAvailable <= 0) return; // No points left to spend

      const currentChange = pendingStatPoints[stat] || 0;
      if (amount < 0 && currentChange <= 0) return; // Cannot go below zero

      setPendingStatPoints(prev => ({
          ...prev,
          [stat]: (prev[stat] || 0) + amount
      }));
  };

  const handleConfirmStats = () => {
    setPlayer(p => {
        const spentPoints = Object.values(pendingStatPoints).reduce((acc, val) => acc + (val || 0), 0);
        if (spentPoints > p.statPoints) return p; // Should not happen with UI guards

        let newPlayerState = { 
            ...p,
            statPoints: p.statPoints - spentPoints,
        };

        (Object.keys(pendingStatPoints) as DistributableStat[]).forEach(stat => {
            const points = pendingStatPoints[stat] || 0;
            if (stat === 'maxHp') {
                newPlayerState.maxHp += points * 10; // +10 HP per point
                newPlayerState.hp = newPlayerState.maxHp; // Heal to full on level up
            } else if (stat === 'maxStamina') {
                newPlayerState.maxStamina += points * 5; // +5 Stamina per point
                newPlayerState.stamina = newPlayerState.maxStamina;
            } else {
                 // @ts-ignore
                newPlayerState[stat] += points;
            }
        });
        
        return calculateStats(newPlayerState);
    });
    setPendingStatPoints({});
    setLevelUpDialogOpen(false);
  };
  
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
          if (document.activeElement?.tagName === 'INPUT' || isLevelUpDialogOpen || combatInfo?.open) return;
          if (e.key === 'ArrowUp' || e.key === 'w') handleMove(0, -1);
          if (e.key === 'ArrowDown' || e.key === 's') handleMove(0, 1);
          if (e.key === 'ArrowLeft' || e.key === 'a') handleMove(-1, 0);
          if (e.key === 'ArrowRight' || e.key === 'd') handleMove(1, 0);
        };
    
        window.addEventListener('keydown', handleKeyDown);

        return () => {
          window.removeEventListener('keydown', handleKeyDown);
        }
    }, [isLevelUpDialogOpen, combatInfo, handleMove]);

  return (
    <div className="min-h-screen w-screen bg-background font-body text-foreground flex justify-center items-start pt-12">
       <div className="flex flex-row items-start justify-center gap-4 w-full max-w-[1400px]">
            
            <div className="flex flex-col items-center justify-center h-[744px] w-[240px]">
              <MovementControls onMove={handleMove} />
            </div>

            <div className="flex flex-col gap-4">
                <div className="relative">
                    <TooltipProvider>
                        <div className="absolute top-2 left-2 -translate-x-full z-10">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" onClick={toggleMute}>
                                        {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="left">
                                    <p>{isMuted ? 'Unmute' : 'Mute'} Music</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    </TooltipProvider>
                    <GameBoard viewport={viewport} player={player} isMoving={isMoving} moveCooldown={moveCooldown} moveCount={moveCount} />
                </div>
                <div className="w-full mx-auto">
                    <ControlPanel 
                        player={player} 
                        onUseItem={handleUseItem} 
                        onEquipItem={handleEquipItem} 
                        onUnequipItem={handleUnequipItem}
                    />
                </div>
            </div>

            <aside className="w-72 flex flex-col gap-4">
                 <Card className="bg-card/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="font-headline text-2xl text-primary">{player.name}</CardTitle>
                        <img src={CLASS_ICONS[player.class]} alt={player.class} className="w-14 h-14 rounded-full bg-secondary p-1" />
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex justify-between items-center">
                            <CardDescription>
                                Level {player.level} {player.class.charAt(0).toUpperCase() + player.class.slice(1)}
                            </CardDescription>
                            {player.statPoints > 0 && <div className="text-sm font-bold text-accent animate-pulse">Points to spend!</div>}
                        </div>
                        <div>
                            <div className="flex justify-between items-center text-xs text-muted-foreground mb-1">
                                <span>XP</span>
                                <span>{player.xp} / {player.xpToNextLevel}</span>
                            </div>
                             <Progress value={(player.xp / player.xpToNextLevel) * 100} className="h-2" indicatorClassName="bg-yellow-400" />
                        </div>
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
                            <CombatStatDisplay label="M.RES" value={player.magicResist} icon={<Omega size={16}/>} tooltipText="Magic Resist" />
                            <CombatStatDisplay label="EVA" value={player.evasion} icon={<LocateOff size={16}/>} tooltipText="Evasion" />
                            <CombatStatDisplay label="CRIT" value={player.criticalChance} icon={<Dices size={16}/>} tooltipText="Crit Chance" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-card/50">
                    <CardHeader className="p-4">
                        <CardTitle className="font-headline text-lg">Secondary Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1">
                        <div className="grid grid-cols-2 gap-x-4">
                             <CombatStatDisplay label="INIT" value={player.initiative} icon={<Rabbit size={16}/>} tooltipText="Initiative: Chance to strike first in combat." isPercent />
                             <CombatStatDisplay label="SCOUT" value={player.scoutRange} icon={<Antenna size={16}/>} tooltipText="Scout Range: Reveals threats in a wider area." />
                             <CombatStatDisplay label="D.HIT" value={player.doubleHitChance} icon={<UtensilsCrossed size={16}/>} tooltipText="Double Hit: Chance to strike twice in one attack." isPercent/>
                             <CombatStatDisplay label="LUCK" value={player.lootLuck} icon={<Gem size={16}/>} tooltipText="Loot Luck: Increases the chance of finding rare items." isPercent/>
                             <CombatStatDisplay label="XP" value={player.xpGainBonus} icon={<Star size={16}/>} tooltipText="Experience Bonus: Increases XP gained from all sources." isPercent/>
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
                                className="w-full"
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
                            {gameLog.map((msg, i) => <p key={i} className={i === gameLog.length -1 ? 'text-muted-foreground' : 'text-foreground'}>{`> ${msg}`}</p>)}
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

      {isLevelUpDialogOpen && (
        <AlertDialog open={isLevelUpDialogOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="font-headline text-3xl flex items-center gap-2 text-yellow-400">
                        <Star /> Level Up!
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Congratulations! You've reached level {player.level}. Distribute your 2 stat points to grow stronger.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="space-y-4 py-4">
                    <div className="text-center font-bold">
                        Points remaining: <span className="text-accent text-lg">{player.statPoints - Object.values(pendingStatPoints).reduce((a,b) => (a || 0) + (b || 0), 0)}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                        <Label htmlFor="maxHp" className="flex items-center gap-2"><Heart className="text-red-500" /> Max Health</Label>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => handleStatPointChange('maxHp', -1)}><Minus/></Button>
                            <span className="font-mono w-10 text-center text-lg">{player.maxHp} <span className="text-green-500">{(pendingStatPoints.maxHp || 0) > 0 && `+${(pendingStatPoints.maxHp || 0) * 10}`}</span></span>
                            <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => handleStatPointChange('maxHp', 1)}><Plus/></Button>
                        </div>
                    </div>
                     <div className="flex items-center justify-between">
                        <Label htmlFor="maxStamina" className="flex items-center gap-2"><Activity className="text-yellow-400"/> Max Stamina</Label>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => handleStatPointChange('maxStamina', -1)}><Minus/></Button>
                            <span className="font-mono w-10 text-center text-lg">{player.maxStamina} <span className="text-green-500">{(pendingStatPoints.maxStamina || 0) > 0 && `+${(pendingStatPoints.maxStamina || 0) * 5}`}</span></span>
                            <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => handleStatPointChange('maxStamina', 1)}><Plus/></Button>
                        </div>
                    </div>
                    {player.class === 'mage' ? (
                        <div className="flex items-center justify-between">
                            <Label htmlFor="magicAttack" className="flex items-center gap-2"><Wand/> Magic Attack</Label>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => handleStatPointChange('magicAttack', -1)}><Minus/></Button>
                                <span className="font-mono w-10 text-center text-lg">{player.magicAttack} <span className="text-green-500">{(pendingStatPoints.magicAttack || 0) > 0 && `+${pendingStatPoints.magicAttack}`}</span></span>
                                <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => handleStatPointChange('magicAttack', 1)}><Plus/></Button>
                            </div>
                        </div>
                    ) : (
                         <div className="flex items-center justify-between">
                            <Label htmlFor="attack" className="flex items-center gap-2"><Swords/> Physical Attack</Label>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => handleStatPointChange('attack', -1)}><Minus/></Button>
                                <span className="font-mono w-10 text-center text-lg">{player.attack} <span className="text-green-500">{(pendingStatPoints.attack || 0) > 0 && `+${pendingStatPoints.attack}`}</span></span>
                                <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => handleStatPointChange('attack', 1)}><Plus/></Button>
                            </div>
                        </div>
                    )}
                     <div className="flex items-center justify-between">
                        <Label htmlFor="defense" className="flex items-center gap-2"><Shield/> Defense</Label>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => handleStatPointChange('defense', -1)}><Minus/></Button>
                            <span className="font-mono w-10 text-center text-lg">{player.defense} <span className="text-green-500">{(pendingStatPoints.defense || 0) > 0 && `+${pendingStatPoints.defense}`}</span></span>
                            <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => handleStatPointChange('defense', 1)}><Plus/></Button>
                        </div>
                    </div>

                </div>
                <AlertDialogFooter>
                    <AlertDialogAction 
                        onClick={handleConfirmStats} 
                        disabled={Object.values(pendingStatPoints).reduce((a,b) => (a || 0) + (b || 0), 0) <= 0}
                        className="w-full"
                    >
                        Confirm
                    </AlertDialogAction>
                </AlertDialogFooter>
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
