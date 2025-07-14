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
import type { CombatLogEntry, Monster, Item } from '@/types/game';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import LootAttemptClient from './LootAttemptClient';
import Image from 'next/image';

interface CombatDialogProps {
  combatInfo: {
    open: boolean;
    monster: Monster;
    log: CombatLogEntry[];
    result: string;
    loot?: Item | null;
  };
  onClose: () => void;
}

export default function CombatDialog({ combatInfo, onClose }: CombatDialogProps) {
  const { open, monster, log, result, loot } = combatInfo;
  const playerWon = result.includes("defeated");

  return (
    <AlertDialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-headline text-2xl flex items-center gap-4">
            {monster.icon && <Image src={monster.icon} alt={monster.name} width={60} height={60} className="rounded-md bg-secondary p-1" />}
            Combat Results: {playerWon ? "Victory!" : "Defeat"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {result}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex gap-4">
            <div className='w-1/2'>
                <h3 className="font-bold mb-2">Combat Log</h3>
                <ScrollArea className="h-48 w-full rounded-md border p-4 font-mono text-xs">
                    {log.map((entry) => (
                    <p key={entry.id}>{entry.message}</p>
                    ))}
                </ScrollArea>
            </div>
            <div className='w-1/2'>
                <h3 className="font-bold mb-2">Aftermath</h3>
                <div className="h-48 w-full rounded-md border p-4 flex flex-col justify-center items-center">
                  {playerWon ? (
                    loot ? (
                      <div className="text-center space-y-2">
                        <p className="font-bold">Loot Found!</p>
                        <div className="flex flex-col items-center gap-2 p-2 rounded-md bg-secondary">
                          <Image src={loot.icon} alt={loot.name} width={40} height={40} />
                          <p className="text-sm font-medium">{loot.name}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">The {monster.name} had nothing of value.</p>
                    )
                  ) : (
                    <p className="text-sm text-muted-foreground text-center">You gather your senses and prepare to continue your journey.</p>
                  )}
                </div>
            </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogAction onClick={onClose}>Continue Adventure</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
