
"use client";

import type { Player, Item, EquipmentSlot, ItemRarity, PlayerClass } from '@/types/game';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Settings, Gavel, Crown, Shirt, Footprints, Volume2, VolumeX } from 'lucide-react';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { cn } from '@/lib/utils';
import { INVENTORY_SIZE } from '@/lib/game-constants';
import { useAudio } from '@/context/AudioContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Label } from '../ui/label';
import { Slider } from '../ui/slider';

interface ControlPanelProps {
  player: Player;
  onUseItem: (item: Item, index: number) => void;
  onEquipItem: (item: Item, index: number) => void;
  onUnequipItem: (slot: EquipmentSlot) => void;
}

const RARITY_COLORS: Record<ItemRarity, string> = {
    Common: 'text-gray-400',
    Rare: 'text-blue-400',
    Epic: 'text-purple-500',
    Legendary: 'text-orange-400',
};

const ItemTooltipContent = ({ item }: { item: Item }) => (
    <div className="p-2 space-y-2 text-sm w-64">
        <p className={cn("font-bold text-base", RARITY_COLORS[item.rarity])}>{item.name}</p>
        <p className="text-xs text-muted-foreground italic">({item.rarity})</p>
        <p className="text-muted-foreground">{item.description}</p>
        {(item.allowedClasses && item.allowedClasses.length > 0) && (
            <p className="text-xs text-cyan-400">Classes: {item.allowedClasses.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(', ')}</p>
        )}
        <Separator/>
        <div className="space-y-1">
            {item.attack ? <p>Attack: <span className="font-mono text-primary">+{item.attack}</span></p> : null}
            {item.magicAttack ? <p>Magic Attack: <span className="font-mono text-purple-400">+{item.magicAttack}</span></p> : null}
            {item.defense ? <p>Defense: <span className="font-mono text-primary">+{item.defense}</span></p> : null}
            {item.armor ? <p>Armor: <span className="font-mono text-primary">+{item.armor}</span></p> : null}
            {item.magicResist ? <p>M.Resist: <span className="font-mono text-primary">+{item.magicResist}</span></p> : null}
            {item.evasion ? <p>Evasion: <span className="font-mono text-primary">+{item.evasion}%</span></p> : null}
            {item.criticalChance ? <p>Crit: <span className="font-mono text-primary">+{item.criticalChance}%</span></p> : null}
            {item.hp ? <p>Restores Health: <span className="font-mono text-green-500">{item.hp}</span></p> : null}
            {item.staminaBoost ? <p>Stamina Regen: <span className="font-mono text-yellow-500">+{item.staminaBoost}</span></p> : null}
            {item.inventorySlots ? <p>Inventory: <span className="font-mono text-blue-400">+{item.inventorySlots} Slots</span></p> : null}
        </div>
    </div>
);

const EquipmentSlotDisplay = ({ slot, item, onUnequip }: { slot: EquipmentSlot, item: Item | null, onUnequip: (slot: EquipmentSlot) => void }) => {
    const ICONS: Record<EquipmentSlot, React.ReactNode> = {
        weapon: <Gavel className="w-10 h-10 text-muted-foreground opacity-75" />,
        helmet: <Crown className="w-10 h-10 text-muted-foreground opacity-75" />,
        armor: <Shirt className="w-10 h-10 text-muted-foreground opacity-75" />,
        belt: (
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-muted-foreground opacity-75">
               <rect x="3" y="8" width="18" height="8" rx="2"></rect><circle cx="12" cy="12" r="2"></circle>
            </svg>
        ),
        boots: (
            <Footprints className="w-10 h-10 text-muted-foreground opacity-75" />
        )
    }

    const buttonContent = (
         <div 
            className="w-20 h-20 bg-secondary rounded-lg flex items-center justify-center border-2 border-dashed border-border hover:border-primary cursor-pointer"
            onClick={() => item && onUnequip(slot)}
        >
            {item ? <img src={item.icon} alt={item.name} className="w-14 h-14" /> : ICONS[slot]}
        </div>
    );

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div>{buttonContent}</div>
                </TooltipTrigger>
                <TooltipContent>
                     <p className="font-bold capitalize">{slot}</p>
                     {item ? <ItemTooltipContent item={item} /> : <p>Empty</p>}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

export default function ControlPanel({ player, onUseItem, onEquipItem, onUnequipItem }: ControlPanelProps) {
  const inventoryCapacity = INVENTORY_SIZE + (player.hasBackpack ? 4 : 0);
  const inventorySlots = Array.from({ length: inventoryCapacity });
  const { isMuted, toggleMute } = useAudio();

  return (
      <div className="w-full">
        <Tabs defaultValue="equipment" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="equipment">Equipment</TabsTrigger>
                <TabsTrigger value="inventory">Inventory ({player.inventory.filter(i => i).length}/{inventoryCapacity})</TabsTrigger>
                <TabsTrigger value="quests">Quests</TabsTrigger>
            </TabsList>
            <TabsContent value="equipment">
                <Card className="bg-card/50">
                    <CardContent className="p-4 flex items-center justify-center gap-x-4">
                       <EquipmentSlotDisplay slot="helmet" item={player.equipment.helmet} onUnequip={onUnequipItem} />
                       <EquipmentSlotDisplay slot="weapon" item={player.equipment.weapon} onUnequip={onUnequipItem} />
                       <EquipmentSlotDisplay slot="armor" item={player.equipment.armor} onUnequip={onUnequipItem} />
                       <EquipmentSlotDisplay slot="belt" item={player.equipment.belt} onUnequip={onUnequipItem} />
                       <EquipmentSlotDisplay slot="boots" item={player.equipment.boots} onUnequip={onUnequipItem} />
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="inventory">
                <Card className="bg-card/50">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="font-headline text-lg">Inventory</CardTitle>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" onClick={toggleMute}>
                                        {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{isMuted ? 'Unmute' : 'Mute'} Music</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-5 gap-2">
                            {inventorySlots.map((_, index) => {
                                const item = player.inventory[index];
                                const inventorySlot = (
                                    <div
                                        key={item ? `item-${item.id}-${index}`: `empty-${index}`}
                                        onClick={() => {
                                            if (!item) return;
                                            if (item.type === 'consumable' || item.type === 'utility') {
                                                onUseItem(item, index);
                                            } else {
                                                onEquipItem(item, index);
                                            }
                                        }}
                                        className={cn(
                                            'w-16 h-16 bg-secondary rounded-lg flex items-center justify-center border-2 border-border relative p-0',
                                            item && 'cursor-pointer hover:border-primary'
                                        )}
                                    >
                                        {item && (
                                            <>
                                                <img src={item.icon} alt={item.name} className="w-10 h-10" />
                                                {item.quantity && item.quantity > 1 && (
                                                    <span className="absolute bottom-1 right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full px-1.5 py-0.5 z-10">
                                                        {item.quantity}
                                                    </span>
                                                )}
                                            </>
                                        )}
                                    </div>
                                );

                                return item ? (
                                    <TooltipProvider key={index}>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                {inventorySlot}
                                            </TooltipTrigger>
                                            <TooltipContent side="bottom">
                                                <ItemTooltipContent item={item} />
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                ) : inventorySlot;
                            })}
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="quests">
                 <Card className="bg-card/50">
                     <CardHeader>
                        <CardTitle className="font-headline text-lg">Active Quests</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {player.quests.length > 0 ? (
                        <ul className="space-y-4">
                          {player.quests.map((quest) => (
                            <li key={quest.id} className="border-b border-border/50 pb-2">
                                <p className="font-bold">{quest.title}</p>
                                <p className="text-sm text-muted-foreground">{quest.description}</p>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">No active quests.</p>
                      )}
                    </CardContent>
                 </Card>
            </TabsContent>
        </Tabs>
        
      </div>
  );
}
