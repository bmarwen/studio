
"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { CombatLogEntry, Monster, Item, Player, PlayerIcon } from '@/types/game';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import LootAttemptClient from './LootAttemptClient';
import Image from 'next/image';
import { Progress } from '../ui/progress';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

const getPlayerIconPath = (icon: PlayerIcon) => {
    switch (icon) {
        case 'hero1': return '/icons/hero-avatar-1.png';
        case 'hero2': return '/icons/hero-avatar-2.png';
        case 'hero3': return '/icons/hero-avatar-3.png';
        case 'hero4': return '/icons/hero-avatar-4.png';
        case 'hero5': return '/icons/hero-avatar-5.png';
        case 'hero6': return '/icons/hero-avatar-6.png';
        default: return '/icons/hero-avatar-1.png';
    }
}

export interface CombatInfo {
    open: boolean;
    monster: Monster;
    log: CombatLogEntry[];
    status: 'fighting' | 'victory' | 'defeat';
    loot?: Item[];
    xpGained?: number;
    playerHp: number;
    playerMaxHp: number;
    monsterHp: number;
    playerIcon: PlayerIcon;
}

interface CombatDialogProps {
  combatInfo: CombatInfo;
  onClose: () => void;
}

export default function CombatDialog({ combatInfo, onClose }: CombatDialogProps) {
  const { open, monster, log, status, loot, xpGained, playerHp, playerMaxHp, monsterHp, playerIcon } = combatInfo;
  const isFighting = status === 'fighting';
  
  const getTitle = () => {
    if (status === 'victory') return "Victory!";
    if (status === 'defeat') return "Defeat";
    return `Fighting ${monster.name}...`;
  }
  
  const getDescription = () => {
    if (status === 'victory') return `You defeated the ${monster.name}!`;
    if (status === 'defeat') return `You were defeated by the ${monster.name}...`;
    return `The battle rages on!`;
  }

  return (
    <AlertDialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-headline text-2xl flex items-center gap-4">
            Combat Results: {getTitle()}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {getDescription()}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex gap-4">
            <div className='w-1/2 space-y-2'>
                <h3 className="font-bold">Player</h3>
                <div className="rounded-md border p-2 space-y-2">
                    <div className="flex items-center gap-2">
                        <Image src={getPlayerIconPath(playerIcon)} alt="Player Icon" width={40} height={40} className="rounded-md bg-secondary p-1" />
                        <p className="text-sm font-medium">You</p>
                    </div>
                    <Progress value={(playerHp / playerMaxHp) * 100} className="h-4" indicatorClassName="bg-green-500" />
                    <p className="text-xs text-right font-mono">{Math.round(playerHp)} / {playerMaxHp}</p>
                </div>
                <h3 className="font-bold pt-2">Combat Log</h3>
                <ScrollArea className="h-48 w-full rounded-md border p-4 font-mono text-xs">
                    {log.map((entry) => (
                    <p key={entry.id}>{entry.message}</p>
                    ))}
                </ScrollArea>
            </div>
            <div className='w-1/2 space-y-2'>
                <h3 className="font-bold">Monster</h3>
                 <div className="rounded-md border p-2 space-y-2">
                    <div className="flex items-center gap-2">
                        {monster.icon && <Image src={monster.icon} alt={monster.name} width={40} height={40} className="rounded-md bg-secondary p-1" />}
                        <p className="text-sm font-medium">{monster.name}</p>
                    </div>
                    <Progress value={(monsterHp / monster.maxHp) * 100} className="h-4" indicatorClassName="bg-red-500" />
                    <p className="text-xs text-right font-mono">{Math.round(monsterHp)} / {monster.maxHp}</p>
                </div>
                <h3 className="font-bold pt-2">Aftermath</h3>
                <ScrollArea className="h-48 w-full rounded-md border p-4">
                  {status === 'victory' ? (
                    <div className="text-center space-y-4">
                      {(loot && loot.length > 0) ? (
                        <div>
                          <p className="font-bold">Loot Found!</p>
                          <div className="flex flex-col items-center gap-2 p-2 rounded-md bg-secondary mt-2">
                            {loot.map((item, index) => (
                              <div key={index} className="flex items-center gap-2">
                                  <Image src={item.icon} alt={item.name} width={40} height={40} />
                                  <p className="text-sm font-medium">{item.name}{item.quantity && item.quantity > 1 ? ` x${item.quantity}` : ''}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-center items-center h-full">
                          <p className="text-sm text-muted-foreground">The {monster.name} had nothing of value.</p>
                        </div>
                      )}
                      {(xpGained && xpGained > 0) && (
                        <div>
                            <p className="font-bold">Experience Gained</p>
                            <motion.div 
                              className="flex items-center justify-center gap-2 mt-2 text-lg text-yellow-400"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.5, duration: 0.5 }}
                            >
                                <Star className="w-5 h-5" />
                                <span className="font-bold">+{xpGained} XP</span>
                            </motion.div>
                        </div>
                      )}
                    </div>
                  ) : status === 'defeat' ? (
                    <div className="flex justify-center items-center h-full">
                        <p className="text-sm text-muted-foreground text-center">You gather your senses and prepare to continue your journey.</p>
                    </div>
                  ) : (
                    <div className="flex justify-center items-center h-full">
                        <p className="text-sm text-muted-foreground text-center">The outcome is not yet decided...</p>
                    </div>
                  )}
                </ScrollArea>
            </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogAction onClick={onClose} disabled={isFighting}>
            {isFighting ? "Fighting..." : "Continue Adventure"}
            </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
