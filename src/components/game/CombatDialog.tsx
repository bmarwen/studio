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
import type { CombatLogEntry, Monster } from '@/types/game';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import LootAttemptClient from './LootAttemptClient';

interface CombatDialogProps {
  combatInfo: {
    open: boolean;
    monster: Monster;
    log: CombatLogEntry[];
    result: string;
  };
  onClose: () => void;
}

export default function CombatDialog({ combatInfo, onClose }: CombatDialogProps) {
  const { open, monster, log, result } = combatInfo;
  const playerWon = result.includes("defeated");

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-headline text-2xl">
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
                <h3 className="font-bold mb-2">Aftermath...</h3>
                <div className="h-48 w-full rounded-md border p-4">
                  {playerWon ? (
                    <LootAttemptClient npc={monster} />
                  ) : (
                    <p className="text-sm text-muted-foreground">You gather your senses and prepare to continue your journey.</p>
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
