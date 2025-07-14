"use client";

import type { Player } from '@/types/game';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Heart, Zap, Swords, Shield, Wand2, Scroll, Package, BookUser, Settings } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '../ui/button';

interface ControlPanelProps {
  player: Player;
  log: string[];
  onReset: () => void;
}

const StatItem = ({ icon, label, value, maxValue, colorClass, indicatorClassName }: { icon: React.ReactNode, label: string, value: number, maxValue?: number, colorClass: string, indicatorClassName?: string }) => (
  <div>
    <div className="flex justify-between items-center mb-1 text-sm">
      <div className="flex items-center gap-2">
        {icon}
        <span className="font-medium">{label}</span>
      </div>
      <span className={`font-mono ${colorClass}`}>{maxValue ? `${value}/${maxValue}` : value}</span>
    </div>
    {maxValue && <Progress value={(value / maxValue) * 100} className="h-2" indicatorClassName={indicatorClassName} />}
  </div>
);

export default function ControlPanel({ player, log, onReset }: ControlPanelProps) {
  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col gap-4 pr-4">
        <Card className="bg-card/50">
          <CardHeader>
            <CardTitle className="font-headline text-2xl text-primary">{player.name}</CardTitle>
            <CardDescription>Level 1 {player.class.charAt(0).toUpperCase() + player.class.slice(1)}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <StatItem icon={<Heart className="text-red-500" />} label="Health" value={player.hp} maxValue={player.maxHp} colorClass="text-red-500" indicatorClassName="bg-red-500" />
            <StatItem icon={<Zap className="text-yellow-400" />} label="Energy" value={player.energy} maxValue={player.maxEnergy} colorClass="text-yellow-400" indicatorClassName="bg-yellow-400" />
            <Separator />
            <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2"><Swords className="w-4 h-4 text-gray-400" /> Attack: <span className="font-mono">{player.attack}</span></div>
                <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-gray-400" /> Defense: <span className="font-mono">{player.defense}</span></div>
                <div className="flex items-center gap-2"><Wand2 className="w-4 h-4 text-gray-400" /> Magic: <span className="font-mono">{player.magic}</span></div>
            </div>
          </CardContent>
        </Card>

        <Accordion type="multiple" defaultValue={["inventory", "dev"]} className="w-full">
          <AccordionItem value="inventory">
            <AccordionTrigger className="text-lg font-headline">
                <div className="flex items-center gap-2"><Package />Inventory</div>
            </AccordionTrigger>
            <AccordionContent>
              {player.inventory.length > 0 ? (
                <ul className="space-y-2 text-sm">
                  {player.inventory.map((item, index) => (
                    <li key={index} className="flex items-center gap-2 p-2 rounded-md bg-secondary">
                        <span className="font-medium">{item.name}</span>
                        <span className="text-xs text-muted-foreground italic truncate"> - {item.description}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">Your backpack is empty.</p>
              )}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="quests">
            <AccordionTrigger className="text-lg font-headline">
                <div className="flex items-center gap-2"><BookUser />Quests</div>
            </AccordionTrigger>
            <AccordionContent>
              {player.quests.length > 0 ? (
                <ul className="space-y-2">
                  {player.quests.map((quest) => (
                    <li key={quest.id}>
                        <p className="font-bold">{quest.title}</p>
                        <p className="text-sm text-muted-foreground">{quest.description}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No active quests.</p>
              )}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="dev">
            <AccordionTrigger className="text-lg font-headline">
                <div className="flex items-center gap-2"><Settings />Dev Mode</div>
            </AccordionTrigger>
            <AccordionContent className="p-4 space-y-4">
               <p className="text-xs text-muted-foreground">Dev tools for testing.</p>
               <Button variant="outline" onClick={onReset} className="w-full">Reset World</Button>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        <Card>
            <CardHeader className="p-4">
                <CardTitle className="font-headline text-lg flex items-center gap-2"><Scroll />Game Log</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="text-xs font-mono space-y-2 p-4 h-48 bg-secondary rounded-b-lg overflow-y-auto flex flex-col-reverse">
                    {log.map((msg, i) => <p key={i} className={i === 0 ? 'text-foreground' : 'text-muted-foreground'}>{`> ${msg}`}</p>)}
                </div>
            </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}
