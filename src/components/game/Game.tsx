"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import type { Player, TileData, Monster, CombatLogEntry, Item } from '@/types/game';
import { generateWorld } from '@/lib/world-generator';
import { MAP_SIZE, VIEWPORT_SIZE, ENERGY_REGEN_RATE, TERRAIN_ENERGY_COST } from '@/lib/game-constants';
import GameBoard from './GameBoard';
import ControlPanel from './ControlPanel';
import MovementControls from './MovementControls';
import CombatDialog from './CombatDialog';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Progress } from '../ui/progress';

interface GameProps {
  initialPlayer: Player;
  onReset: () => void;
}

const playSound = (src: string, volume = 0.5) => {
  const sound = new Audio(src);
  sound.volume = volume;
  sound.play().catch(e => console.error(`Failed to play sound: ${src}`, e));
};

export default function Game({ initialPlayer, onReset }: GameProps) {
  const [player, setPlayer] = useState<Player>(initialPlayer);
  const [worldMap, setWorldMap] = useState<TileData[][]>([]);
  const [viewport, setViewport] = useState<TileData[][]>([]);
  const [gameLog, setGameLog] = useState<string[]>(['Welcome to Square Clash!']);
  
  const [pendingCombat, setPendingCombat] = useState<Monster | null>(null);
  const [combatCountdown, setCombatCountdown] = useState(0);

  const [combatInfo, setCombatInfo] = useState<{ open: boolean, monster: Monster, log: CombatLogEntry[], result: string } | null>(null);

  const countdownTimer = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const map = generateWorld();
    setWorldMap(map);
    addLog(`A new world has been generated for ${player.name} the ${player.class}. Your quest begins!`);
  }, []); // Run only once per game instance

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
          // Edge of the world
          newViewport[y][x] = { terrain: 'grass' };
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
        if (p.energy < p.maxEnergy) {
          const energyRegen = 1 + p.inventory.reduce((acc, item) => acc + (item.energyBoost || 0), 0);
          return { ...p, energy: Math.min(p.maxEnergy, p.energy + energyRegen) };
        }
        return p;
      });
    }, ENERGY_REGEN_RATE);
    return () => clearInterval(energyTimer);
  }, [player.inventory]);

  const addLog = (message: string) => {
    setGameLog(prev => [message, ...prev.slice(0, 9)]);
  };

  const startCombat = (monster: Monster) => {
    setPendingCombat(null);
    addLog(`You encounter a fierce ${monster.name}!`);
    const combatLog: CombatLogEntry[] = [{ id: 0, message: `The battle against ${monster.name} begins!` }];
    
    let playerHp = player.hp;
    let monsterHp = monster.hp;
    let turn = 0;

    while (playerHp > 0 && monsterHp > 0) {
      turn++;
      // Player attacks
      const playerDamage = Math.max(1, player.attack - monster.defense);
      monsterHp -= playerDamage;
      combatLog.push({id: turn * 2 - 1, message: `You strike the ${monster.name} for ${playerDamage} damage.`});
      if (monsterHp <= 0) break;

      // Monster attacks
      const monsterDamage = Math.max(1, monster.attack - player.defense);
      playerHp -= monsterDamage;
      combatLog.push({id: turn * 2, message: `The ${monster.name} hits you for ${monsterDamage} damage.`});
    }
    
    let result = '';
    if (playerHp > 0) {
      playSound('/sfx/victory.wav');
      result = `You defeated the ${monster.name}! You have ${playerHp} HP left.`;
      const loot = monster.loot[Math.floor(Math.random() * monster.loot.length)];
      setPlayer(p => {
        const newInventory = loot ? [...p.inventory, loot] : p.inventory;
        if (loot) {
            addLog(`You found: ${loot.name}!`);
        }
        return {
          ...p,
          hp: playerHp,
          inventory: newInventory
        }
      });
    } else {
      playSound('/sfx/defeat.wav');
      result = `You were defeated by the ${monster.name}... You limp away.`;
      setPlayer(p => ({ ...p, hp: 1, energy: Math.floor(p.energy/2) })); // Penalty on losing
    }
    addLog(result);
    setCombatInfo({ open: true, monster, log: combatLog, result });
  };
  
  useEffect(() => {
    if (pendingCombat) {
        playSound('/sfx/encounter.wav');
        setCombatCountdown(3);
        countdownTimer.current = setInterval(() => {
            setCombatCountdown(c => c - 1);
        }, 1000);
    }
    return () => clearInterval(countdownTimer.current);
  }, [pendingCombat]);

  useEffect(() => {
      if (combatCountdown === 0 && pendingCombat) {
          clearInterval(countdownTimer.current);
          startCombat(pendingCombat);
      }
  }, [combatCountdown, pendingCombat]);

  const handleMove = useCallback((dx: number, dy: number) => {
    if (combatInfo?.open || pendingCombat) return; // Don't move if in combat dialog
    
    const newX = Math.max(0, Math.min(MAP_SIZE - 1, player.position.x + dx));
    const newY = Math.max(0, Math.min(MAP_SIZE - 1, player.position.y + dy));

    if (newX === player.position.x && newY === player.position.y) return;

    const targetTile = worldMap[newY]?.[newX];
    if (!targetTile) return;
    
    const moveCost = TERRAIN_ENERGY_COST[targetTile.terrain] || 1;
    if (player.energy < moveCost) {
      addLog("Not enough energy to move!");
      return;
    }

    setPlayer(p => ({ ...p, energy: p.energy - moveCost }));

    if (targetTile.terrain === 'mountain') {
      addLog("You can't climb these treacherous mountains!");
      return;
    }
    
    setPlayer(p => ({...p, position: {x: newX, y: newY}}));
    addLog(`You move to (${newX}, ${newY}).`);

    if (targetTile.monster) {
      setPendingCombat(targetTile.monster);
      // Remove monster after combat
      const newMap = [...worldMap];
      newMap[newY][newX] = {...newMap[newY][newX], monster: undefined};
      setWorldMap(newMap);
    }
    
    if (targetTile.item) {
        addLog(`You found a ${targetTile.item.name}!`);
        playSound('/sfx/item-found.wav', 0.3);
        setPlayer(p => ({...p, inventory: [...p.inventory, targetTile.item as Item]}));
        const newMap = [...worldMap];
        newMap[newY][newX] = {...newMap[newY][newX], item: undefined};
        setWorldMap(newMap);
    }

  }, [player, worldMap, combatInfo, pendingCombat]);
  
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
          if (combatInfo?.open || pendingCombat) return;
          if (e.key === 'ArrowUp') handleMove(0, -1);
          if (e.key === 'ArrowDown') handleMove(0, 1);
          if (e.key === 'ArrowLeft') handleMove(-1, 0);
          if (e.key === 'ArrowRight') handleMove(1, 0);
        };
    
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleMove, combatInfo, pendingCombat]);

  return (
    <div className="flex h-screen w-screen bg-background font-body text-foreground overflow-hidden">
      <main className="flex-1 flex flex-col items-center justify-center p-4 gap-4 relative">
        <h1 className="text-4xl font-headline text-primary absolute top-4 left-4">Square Clash</h1>
        <GameBoard viewport={viewport} playerIcon={player.icon} />
        <MovementControls onMove={handleMove} />
      </main>
      <aside className="w-1/3 max-w-sm bg-card border-l-2 border-border p-4 overflow-y-auto">
        <ControlPanel player={player} log={gameLog} onReset={onReset} />
      </aside>
      
      {pendingCombat && (
        <AlertDialog open={!!pendingCombat}>
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
          onClose={() => setCombatInfo(info => info ? { ...info, open: false } : null)}
        />
      )}
    </div>
  );
}
