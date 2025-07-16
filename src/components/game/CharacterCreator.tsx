
"use client";

import { useState, useEffect, useRef } from 'react';
import type { Player, PlayerClass, PlayerIcon, PlayerRace } from '@/types/game';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { INITIAL_PLAYER_STATE, PLAYER_CLASSES } from '@/lib/game-constants';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, Dices, Volume2, VolumeX } from 'lucide-react';
import Image from 'next/image';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Carousel, CarouselApi, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../ui/carousel';
import { AnimatePresence, motion } from 'framer-motion';
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { useAudio } from '@/context/AudioContext';
import { Separator } from '../ui/separator';


type Props = {
  onPlayerCreate: (player: Player) => void;
};

type RaceBonus = {
    key: keyof Player;
    value: number;
    text: string;
}

const RACES: { id: PlayerIcon; name: PlayerRace; bonus: RaceBonus; path: string; hint: string;}[] = [
    { id: 'hero1', name: 'Male Elf', bonus: { key: 'bonusCritChance', value: 5, text: '+5% Critical Chance' }, path: '/icons/hero-avatar-1.png', hint: 'bearded warrior' },
    { id: 'hero2', name: 'Female Elf', bonus: { key: 'bonusXpGain', value: 5, text: '+5% Experience Gain' }, path: '/icons/hero-avatar-2.png', hint: 'female warrior' },
    { id: 'hero3', name: 'Male Troll', bonus: { key: 'consumableFindChance', value: 10, text: '+10% Consumable Find Chance' }, path: '/icons/hero-avatar-3.png', hint: 'male elf' },
    { id: 'hero4', name: 'Female Troll', bonus: { key: 'utilityItemFindChance', value: 10, text: '+10% Utility Item Find Chance' }, path: '/icons/hero-avatar-4.png', hint: 'female elf' },
    { id: 'hero5', name: 'Male Human', bonus: { key: 'rareEquipmentFindChance', value: 5, text: '+5% Rare Equipment Find Chance' }, path: '/icons/hero-avatar-5.png', hint: 'dragon character' },
    { id: 'hero6', name: 'Female Human', bonus: { key: 'consumableFindChance', value: 5, text: '+5% Consumable Find Chance' }, path: '/icons/hero-avatar-6.png', hint: 'dark knight' },
];

const CLASSES: { id: PlayerClass; name: string; description: string; iconPath: string; }[] = [
    { id: 'warrior', name: 'Warrior', description: 'A master of melee combat, boasting high health and defense.', iconPath: '/icons/warrior-icon.png' },
    { id: 'mage', name: 'Mage', description: 'A powerful spellcaster with high magic and stamina.', iconPath: '/icons/mage-icon.png' },
    { id: 'ranger', name: 'Ranger', description: 'A skilled archer with balanced stats.', iconPath: '/icons/ranger-icon.png' },
    { id: 'assassin', name: 'Assassin', description: 'A deadly rogue with high attack and speed.', iconPath: '/icons/assassin-icon.png' },
];

const STAT_LABELS: Record<string, string> = {
    maxHp: "HP",
    maxStamina: "STM",
    attack: "P.ATT",
    magicAttack: "M.ATT",
    defense: "DEF",
    armor: "ARM",
    magicResist: "M.RES",
    evasion: "EVA",
    criticalChance: "CRIT"
}

const STAT_DESCRIPTIONS: Record<string, string> = {
    maxHp: "Health Points: Determines how much damage you can take before being defeated.",
    maxStamina: "Stamina: Used for moving across the map. Regenerates over time.",
    attack: "Physical Attack: Increases damage dealt by physical attacks.",
    magicAttack: "Magic Attack: Increases damage dealt by spells.",
    defense: "Defense: Reduces incoming physical and magic damage by a flat amount.",
    armor: "Armor: Reduces incoming physical damage.",
    magicResist: "Magic Resist: Reduces incoming magic damage.",
    evasion: "Evasion: The chance to completely dodge an incoming attack.",
    criticalChance: "Critical Chance: The probability of landing a critical hit for extra damage."
};


const NAME_PREFIXES = ["Ael", "Thorn", "Glim", "Shadow", "Bael", "Crys", "Drak", "Fen", "Grim", "Iron"];
const NAME_SUFFIXES = ["dric", "wyn", "fire", "fall", "wood", "shield", "more", "fang", "lore", "gard"];

const StatDisplay = ({ labelKey, value, isPercent = false }: { labelKey: string, value: number, isPercent?: boolean }) => (
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger asChild>
                <div className="flex justify-between items-center text-sm py-1 border-b border-border/50">
                    <span className="font-bold uppercase text-muted-foreground">{STAT_LABELS[labelKey]}</span>
                    <span className="font-mono text-primary">{value}{isPercent ? '%' : ''}</span>
                </div>
            </TooltipTrigger>
            <TooltipContent>
                <p>{STAT_DESCRIPTIONS[labelKey]}</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
);

const AnimatedStatCard = ({ classId }: { classId: PlayerClass }) => {
    const stats = PLAYER_CLASSES[classId];
    return (
        <motion.div
            key={classId}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="w-full"
        >
            <Card className="bg-secondary/50 p-2">
                <CardContent className="p-4 space-y-1">
                    <p className="text-center text-muted-foreground mb-4 min-h-[40px] px-2">{CLASSES.find(c => c.id === classId)?.description}</p>
                    <div className="grid grid-cols-2 gap-x-6">
                        <StatDisplay labelKey="maxHp" value={stats.maxHp} />
                        <StatDisplay labelKey="maxStamina" value={stats.maxStamina} />
                        {classId === 'mage' ? (
                            <StatDisplay labelKey="magicAttack" value={stats.magicAttack} />
                        ) : (
                            <StatDisplay labelKey="attack" value={stats.attack} />
                        )}
                        <StatDisplay labelKey="defense" value={stats.defense} />
                        <StatDisplay labelKey="armor" value={stats.armor} />
                        <StatDisplay labelKey="magicResist" value={stats.magicResist} />
                        <StatDisplay labelKey="evasion" value={stats.evasion} isPercent />
                        <StatDisplay labelKey="criticalChance" value={stats.criticalChance} isPercent />
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}

export default function CharacterCreator({ onPlayerCreate }: Props) {
  const [name, setName] = useState('');
  const [selectedClass, setSelectedClass] = useState<PlayerClass>('warrior');
  const [selectedIcon, setSelectedIcon] = useState<PlayerIcon>('hero1');
  const { toast } = useToast();

  const [iconApi, setIconApi] = useState<CarouselApi>();
  const [classApi, setClassApi] = useState<CarouselApi>();
  const tooltipPortalRef = useRef<HTMLDivElement>(null);
  const [isShaking, setIsShaking] = useState(false);
  const { isMuted, toggleMute, playAudio } = useAudio();
  
  useEffect(() => {
    playAudio('/audio/menu-music.wav', { loop: true });
  }, [playAudio]);

  useEffect(() => {
    if (!iconApi) return;
    const onSelect = () => setSelectedIcon(RACES[iconApi.selectedScrollSnap()].id);
    iconApi.on("select", onSelect);
    return () => iconApi.off("select", onSelect);
  }, [iconApi]);

  useEffect(() => {
    if (!classApi) return;
    const onSelect = () => setSelectedClass(CLASSES[classApi.selectedScrollSnap()].id);
    classApi.on("select", onSelect);
    return () => classApi.off("select", onSelect);
  }, [classApi]);


  const handleGenerateName = () => {
    const prefix = NAME_PREFIXES[Math.floor(Math.random() * NAME_PREFIXES.length)];
    const suffix = NAME_SUFFIXES[Math.floor(Math.random() * NAME_SUFFIXES.length)];
    const numbers = Math.floor(1000 + Math.random() * 9000);
    setName(`${prefix}${suffix}${numbers}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast({
        title: (
            <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <span className="font-headline">Hero Naming Ceremony</span>
            </div>
        ),
        description: "Please enter a name for your hero to begin.",
        variant: "destructive",
        duration: 4000,
      });
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 1000);
      return;
    }

    const classStats = PLAYER_CLASSES[selectedClass];
    const selectedRace = RACES.find(r => r.id === selectedIcon);
    const newPlayer: Player = {
      ...INITIAL_PLAYER_STATE,
      ...classStats,
      name,
      icon: selectedIcon,
      race: selectedRace?.name || 'Male Human',
    };

    if (selectedRace) {
        // @ts-ignore
        newPlayer[selectedRace.bonus.key] = (newPlayer[selectedRace.bonus.key] || 0) + selectedRace.bonus.value;
    }

    onPlayerCreate(newPlayer);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background font-body p-4">
      <Card className="w-full max-w-xl shadow-2xl relative">
        <TooltipProvider>
            <div className="absolute top-4 right-4">
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
            </div>
            <div id="tooltip-portal-container" ref={tooltipPortalRef} />
            <form onSubmit={handleSubmit}>
                <CardHeader className="text-center">
                <CardTitle className="font-headline text-4xl text-primary">Create Your Hero</CardTitle>
                <CardDescription>Customize your character and start your adventure.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 p-6">
                
                <motion.div 
                    className="space-y-2"
                    animate={isShaking ? { x: [0, -10, 10, -10, 10, 0] } : {}}
                    transition={{ duration: 0.5 }}
                >
                    <Label htmlFor="name" className="text-lg font-headline text-center block">Hero Name</Label>
                    <div className="flex items-center gap-2 max-w-sm mx-auto">
                        <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., Sir Reginald"
                        className="text-base text-center"
                        />
                        <Tooltip>
                        <TooltipTrigger asChild>
                            <Button type="button" variant="outline" size="icon" onClick={handleGenerateName}>
                            <Dices className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipPrimitive.Portal container={tooltipPortalRef.current}>
                            <TooltipContent>
                            <p>Generates random name</p>
                            </TooltipContent>
                        </TooltipPrimitive.Portal>
                        </Tooltip>
                    </div>
                </motion.div>

                <div className="space-y-2">
                    <Label className="text-lg font-headline text-center block">Choose Your Race</Label>
                    <Carousel setApi={setIconApi} opts={{loop: true}} className="w-full max-w-xs mx-auto">
                        <CarouselContent>
                            {RACES.map(({ id, name, bonus, path, hint }) => (
                                <CarouselItem key={id}>
                                    <div className="p-1 text-center flex flex-col items-center gap-1">
                                        <Image src={path} alt={id} width={128} height={128} className="w-40 h-40 rounded-2xl shadow-lg border-4 border-transparent group-hover:border-primary transition-colors" data-ai-hint={hint} />
                                        <p className="font-bold text-lg font-headline">{name}</p>
                                        <p className="text-sm text-accent">{bonus.text}</p>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious type="button" variant="ghost" className="left-0" />
                        <CarouselNext type="button" variant="ghost" className="right-0" />
                    </Carousel>
                </div>

                <Separator />
                
                <div className="space-y-4">
                    <Label className="text-lg font-headline text-center block">Choose Your Class</Label>
                     <Carousel setApi={setClassApi} opts={{loop: true}} className="w-full max-w-md mx-auto">
                        <CarouselContent>
                            {CLASSES.map(({ id, name, iconPath }) => (
                                <CarouselItem key={id}>
                                    <div className="p-1 text-center flex flex-col items-center gap-2">
                                        <div className="p-2 bg-secondary rounded-full shadow-inner">
                                            <Image src={iconPath} alt={name} width={128} height={128} className="w-24 h-24 rounded-full" />
                                        </div>
                                        <p className="font-bold text-xl font-headline">{name}</p>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious type="button" variant="ghost" className="left-0 -translate-x-1/2" />
                        <CarouselNext type="button" variant="ghost" className="right-0 translate-x-1/2" />
                    </Carousel>

                    <div className="mt-4 flex justify-center">
                        <AnimatePresence mode="wait">
                            <AnimatedStatCard classId={selectedClass} />
                        </AnimatePresence>
                    </div>
                </div>

                </CardContent>
                <CardFooter className="flex-col gap-4 p-6">
                <Button type="submit" size="lg" className="w-full font-headline text-xl">
                    Begin Adventure
                </Button>
                </CardFooter>
            </form>
        </TooltipProvider>
      </Card>
    </div>
  );
}

    

    