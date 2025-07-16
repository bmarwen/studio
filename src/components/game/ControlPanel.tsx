
"use client";

import type { Player, Item, EquipmentSlot, ItemRarity, PlayerClass } from '@/types/game';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Heart, Zap, Swords, Shield, Star, Scroll, Package, BookUser, Settings, Sparkles, Gavel, Crown, Shirt, ShieldCheck, Volume2, VolumeX } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { cn } from '@/lib/utils';
import { INVENTORY_SIZE } from '@/lib/game-constants';
import { useAudio } from '@/context/AudioContext';
import { Slider } from '../ui/slider';
import { Label } from '../ui/label';

interface ControlPanelProps {
  player: Player;
  log: string[];
  moveCooldown: number;
  onReset: () => void;
  onUseItem: (item: Item, index: number) => void;
  onEquipItem: (item: Item, index: number) => void;
  onUnequipItem: (slot: EquipmentSlot) => void;
  onMoveSpeedChange: (speed: number) => void;
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

const RARITY_COLORS: Record<ItemRarity, string> = {
    Common: 'text-gray-400',
    Rare: 'text-blue-400',
    Epic: 'text-purple-500',
    Legendary: 'text-orange-400',
};

const CLASS_ICONS: Record<PlayerClass, string> = {
    warrior: '/icons/warrior-icon.png',
    mage: '/icons/mage-icon.png',
    ranger: '/icons/ranger-icon.png',
    assassin: '/icons/assassin-icon.png',
}

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
        weapon: <Gavel className="w-8 h-8 text-muted-foreground" />,
        helmet: <Crown className="w-8 h-8 text-muted-foreground" />,
        armor: <Shirt className="w-8 h-8 text-muted-foreground" />,
        belt: <ShieldCheck className="w-8 h-8 text-muted-foreground" />,
    }

    const buttonContent = (
         <div 
            className="w-16 h-16 bg-secondary rounded-lg flex items-center justify-center border-2 border-dashed border-border hover:border-primary cursor-pointer"
            onClick={() => item && onUnequip(slot)}
        >
            {item ? <img src={item.icon} alt={item.name} className="w-10 h-10" /> : ICONS[slot]}
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

const SmallStatDisplay = ({ label, value, isPercent = false, icon, tooltip }: {label: string, value: number, isPercent?: boolean, icon: React.ReactNode, tooltip: string}) => (
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger asChild>
                <div className="flex items-center justify-between text-sm py-1.5 px-3 bg-secondary/50 rounded-md">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        {icon}
                        <span className="font-bold uppercase">{label}</span>
                    </div>
                    <span className="font-mono text-primary">{value}{isPercent ? '%' : ''}</span>
                </div>
            </TooltipTrigger>
            <TooltipContent>
                <p>{tooltip}</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
)

export default function ControlPanel({ player, log, moveCooldown, onReset, onUseItem, onEquipItem, onUnequipItem, onMoveSpeedChange }: ControlPanelProps) {
  const inventoryCapacity = INVENTORY_SIZE + (player.hasBackpack ? 4 : 0);
  const inventorySlots = Array.from({ length: inventoryCapacity });
  const { isMuted, toggleMute } = useAudio();

  const primaryAttackStat = player.class === 'mage' 
    ? { label: "M.ATT", value: player.magicAttack, icon: <Sparkles className="w-4 h-4 text-purple-400" />, tooltip: "Magic Attack: Increases damage dealt by spells." }
    : { label: "P.ATT", value: player.attack, icon: <Swords className="w-4 h-4 text-gray-400" />, tooltip: "Physical Attack: Increases damage dealt by physical attacks." };

  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col gap-4 pr-4">
        <Card className="bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-headline text-2xl text-primary">{player.name}</CardTitle>
            <img src={CLASS_ICONS[player.class]} alt={player.class} className="w-14 h-14 rounded-full bg-secondary p-1" />
          </CardHeader>
          <CardContent className="space-y-4">
            <CardDescription className="flex items-center gap-2">
                Level 1 {player.class.charAt(0).toUpperCase() + player.class.slice(1)}
            </CardDescription>
            <StatItem icon={<Heart className="text-red-500" />} label="Health" value={player.hp} maxValue={player.maxHp} colorClass="text-red-500" indicatorClassName="bg-red-500" />
            <StatItem icon={<Zap className="text-yellow-400" />} label="Stamina" value={player.stamina} maxValue={player.maxStamina} colorClass="text-yellow-400" indicatorClassName="bg-yellow-400" />
            <Separator />
            <div className="grid grid-cols-2 gap-2">
                <SmallStatDisplay label={primaryAttackStat.label} value={primaryAttackStat.value} icon={primaryAttackStat.icon} tooltip={primaryAttackStat.tooltip} />
                <SmallStatDisplay label="DEF" value={player.defense} icon={<Shield className="w-4 h-4 text-gray-400" />} tooltip="Defense: Reduces incoming physical and magic damage by a flat amount."/>
                <SmallStatDisplay label="ARM" value={player.armor} icon={<Shield className="w-4 h-4 text-blue-400" />} tooltip="Armor: Reduces incoming physical damage."/>
                <SmallStatDisplay label="M.RES" value={player.magicResist} icon={<Shield className="w-4 h-4 text-purple-400" />} tooltip="Magic Resist: Reduces incoming magic damage."/>
                <SmallStatDisplay label="CRIT" value={player.criticalChance} isPercent icon={<Star className="w-4 h-4 text-gray-400" />} tooltip="Critical Chance: The probability of landing a critical hit for extra damage."/>
                <SmallStatDisplay label="EVA" value={player.evasion} isPercent icon={<Shield className="w-4 h-4 text-green-400" />} tooltip="Evasion: The chance to completely dodge an incoming attack."/>
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
                <div className="flex items-center gap-2"><Package />Inventory ({player.inventory.filter(i => i).length}/{inventoryCapacity})</div>
            </AccordionTrigger>
            <AccordionContent>
               <div className="grid grid-cols-4 gap-4">
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
               <div className='space-y-2'>
                <Label>Move Cooldown: {(moveCooldown / 1000).toFixed(1)}s</Label>
                <Slider 
                    value={[moveCooldown]}
                    onValueChange={([v]) => onMoveSpeedChange(v)} 
                    min={500} 
                    max={3000} 
                    step={100} 
                />
               </div>
               <Button variant="outline" onClick={onReset} className="w-full">Reset World</Button>
               <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="outline" size="icon" onClick={toggleMute} className="w-full">
                            {isMuted ? <VolumeX /> : <Volume2 />}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{isMuted ? 'Unmute' : 'Mute'} Music</p>
                    </TooltipContent>
                </Tooltip>
               </TooltipProvider>
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

    