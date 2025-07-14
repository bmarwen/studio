"use client";

import type { Player, Item, EquipmentSlot } from '@/types/game';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Heart, Zap, Swords, Shield, Wand2, Scroll, Package, BookUser, Settings, PlusCircle, Shirt, ShieldCheck, Crown, Gavel } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { cn } from '@/lib/utils';
import { INVENTORY_SIZE } from '@/lib/game-constants';

interface ControlPanelProps {
  player: Player;
  log: string[];
  onReset: () => void;
  onUseItem: (item: Item, index: number) => void;
  onEquipItem: (item: Item, index: number) => void;
  onUnequipItem: (slot: EquipmentSlot) => void;
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

const EquipmentSlotDisplay = ({ slot, item, onUnequip }: { slot: EquipmentSlot, item: Item | null, onUnequip: (slot: EquipmentSlot) => void }) => {
    const ICONS: Record<EquipmentSlot, React.ReactNode> = {
        weapon: <Gavel className="w-8 h-8 text-muted-foreground" />,
        helmet: <Crown className="w-8 h-8 text-muted-foreground" />,
        armor: <Shirt className="w-8 h-8 text-muted-foreground" />,
        belt: <ShieldCheck className="w-8 h-8 text-muted-foreground" />,
    }

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button 
                        variant="ghost" 
                        className="w-16 h-16 bg-secondary rounded-lg flex items-center justify-center border-2 border-dashed border-border hover:border-primary"
                        onClick={() => item && onUnequip(slot)}
                    >
                        {item ? <img src={item.icon} alt={item.name} className="w-10 h-10" /> : ICONS[slot]}
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                     <p className="font-bold capitalize">{slot}</p>
                     {item ? <p>{item.name}</p> : <p>Empty</p>}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

const ItemTooltipContent = ({ item }: { item: Item }) => (
    <div className="p-2 space-y-2 text-sm">
        <p className="font-bold text-base">{item.name}</p>
        <p className="text-muted-foreground italic">{item.description}</p>
        <Separator/>
        <div className="space-y-1">
            {item.attack ? <p>Attack: <span className="font-mono text-primary">+{item.attack}</span></p> : null}
            {item.defense ? <p>Defense: <span className="font-mono text-primary">+{item.defense}</span></p> : null}
            {item.magic ? <p>Magic: <span className="font-mono text-primary">+{item.magic}</span></p> : null}
            {item.hp ? <p>Restores Health: <span className="font-mono text-green-500">{item.hp}</span></p> : null}
            {item.energyBoost ? <p>Energy Regen: <span className="font-mono text-yellow-500">+{item.energyBoost}</span></p> : null}
        </div>
    </div>
);


export default function ControlPanel({ player, log, onReset, onUseItem, onEquipItem, onUnequipItem }: ControlPanelProps) {
  const inventorySlots = Array.from({ length: INVENTORY_SIZE });

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

        <Accordion type="multiple" defaultValue={["equipment", "inventory"]} className="w-full">
            <AccordionItem value="equipment">
                <AccordionTrigger className="text-lg font-headline">
                    <div className="flex items-center gap-2"><Package />Equipment</div>
                </AccordionTrigger>
                <AccordionContent>
                    <div className="grid grid-cols-4 gap-2">
                        <EquipmentSlotDisplay slot="weapon" item={player.equipment.weapon} onUnequip={onUnequipItem} />
                        <EquipmentSlotDisplay slot="helmet" item={player.equipment.helmet} onUnequip={onUnequipItem} />
                        <EquipmentSlotDisplay slot="armor" item={player.equipment.armor} onUnequip={onUnequipItem} />
                        <EquipmentSlotDisplay slot="belt" item={player.equipment.belt} onUnequip={onUnequipItem} />
                    </div>
                </AccordionContent>
            </AccordionItem>
          <AccordionItem value="inventory">
            <AccordionTrigger className="text-lg font-headline">
                <div className="flex items-center gap-2"><Package />Inventory</div>
            </AccordionTrigger>
            <AccordionContent>
               <div className="grid grid-cols-4 gap-2">
                 {inventorySlots.map((_, index) => {
                    const item = player.inventory[index];
                    return (
                        <TooltipProvider key={index}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button 
                                        variant="ghost" 
                                        onClick={() => item && item.type !== 'consumable' && onEquipItem(item, index)}
                                        className="w-16 h-16 bg-secondary rounded-lg flex items-center justify-center border-2 border-border relative p-0 hover:border-primary"
                                    >
                                        {item && (
                                            <>
                                                <img src={item.icon} alt={item.name} className="w-10 h-10" />
                                                {item.quantity && item.quantity > 1 && (
                                                    <span className="absolute bottom-1 right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full px-1.5 py-0.5 z-10">
                                                        {item.quantity}
                                                    </span>
                                                )}
                                                {item.type === 'consumable' && (
                                                    <Button size="icon" variant="ghost" onClick={(e) => { e.stopPropagation(); onUseItem(item, index); }} className="absolute -top-2 -right-2 w-6 h-6 bg-green-600 hover:bg-green-700 rounded-full z-20">
                                                        <PlusCircle className="w-4 h-4 text-white" />
                                                    </Button>
                                                )}
                                            </>
                                        )}
                                    </Button>
                                </TooltipTrigger>
                                {item && <TooltipContent side="bottom" className="w-64"><ItemTooltipContent item={item} /></TooltipContent>}
                            </Tooltip>
                        </TooltipProvider>
                    )
                 })}
               </div>
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
