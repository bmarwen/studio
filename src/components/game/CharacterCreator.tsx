
"use client";

import { useState, useEffect, useRef } from 'react';
import type { Player, PlayerClass, PlayerIcon, PlayerRace } from '@/types/game';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { INITIAL_PLAYER_STATE, PLAYER_CLASSES } from '@/lib/game-constants';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, ChevronLeft, ChevronRight, Dices, Volume2, VolumeX } from 'lucide-react';
import Image from 'next/image';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Carousel, CarouselApi, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../ui/carousel';
import { AnimatePresence, motion } from 'framer-motion';
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { useAudio } from '@/context/AudioContext';


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

const STAT_DEFINITIONS: Record<string, { title: string; description: string }> = {
    maxHp: { title: 'Health Points', description: 'Determines how much damage you can take before being defeated.' },
    maxStamina: { title: 'Stamina', description: 'Consumed when moving. Regenerates over time.' },
    attack: { title: 'Physical Attack', description: 'Increases the amount of physical damage you deal in combat.' },
    magicAttack: { title: 'Magic Attack', description: 'Increases the amount of magical damage you deal in combat.' },
    defense: { title: 'Defense', description: 'Reduces the amount of damage you receive from enemy attacks.' },
    armor: { title: 'Armor', description: 'Reduces physical damage taken.' },
    magicResist: { title: 'Magic Resist', description: 'Reduces magical damage taken.' },
    evasion: { title: 'Evasion', description: 'The chance to completely dodge an incoming attack.' },
    criticalChance: { title: 'Critical Chance', description: 'The probability of landing a critical hit for extra damage.' }
}

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

const NAME_PREFIXES = ["Ael", "Thorn", "Glim", "Shadow", "Bael", "Crys", "Drak", "Fen", "Grim", "Iron"];
const NAME_SUFFIXES = ["dric", "wyn", "fire", "fall", "wood", "shield", "more", "fang", "lore", "gard"];

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
    const onSelect = () => {
      const selectedIndex = iconApi.selectedScrollSnap();
      setSelectedIcon(RACES[selectedIndex].id);
    };
    iconApi.on("select", onSelect);
    return () => {
      iconApi.off("select", onSelect);
    };
  }, [iconApi]);

  useEffect(() => {
    if (!classApi) return;
    const onSelect = () => {
      const selectedIndex = classApi.selectedScrollSnap();
      setSelectedClass(CLASSES[selectedIndex].id);
    };
    classApi.on("select", onSelect);
    return () => {
      classApi.off("select", onSelect);
    };
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
      <Card className="w-full max-w-lg shadow-2xl relative">
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
                    <Carousel setApi={iconApi} opts={{loop: true}} className="w-full max-w-xs mx-auto">
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

                <div className="space-y-2">
                    <Label className="text-lg font-headline text-center block">Choose Your Class</Label>
                    <Carousel setApi={setClassApi} opts={{loop: true}} className="w-full max-w-xs mx-auto">
                        <CarouselContent>
                            {CLASSES.map(({ id, name, description, iconPath }) => {
                                const stats = PLAYER_CLASSES[id];
                                const relevantStats = Object.entries(stats).filter(([key]) => {
                                    if (id === 'mage') return key !== 'attack';
                                    return key !== 'magicAttack';
                                }).filter(([key]) => key in STAT_DEFINITIONS);

                                return (
                                    <CarouselItem key={id}>
                                        <AnimatePresence mode="wait">
                                            <motion.div
                                                key={id}
                                                initial={{ opacity: 0, x: 50 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -50 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <Card className="bg-secondary/50 relative text-card-foreground">
                                                    <div className="grid grid-cols-5 gap-4 p-4">
                                                        <div className="col-span-3 flex flex-col">
                                                            <div className="flex items-center gap-4">
                                                                <Image src={iconPath} alt={name} width={80} height={80} className="w-20 h-20 rounded-full bg-primary/20 p-2 border-2 border-primary/80" />
                                                                <CardTitle className="font-headline text-2xl">{name}</CardTitle>
                                                            </div>
                                                            <p className="text-sm text-muted-foreground min-h-[40px] pt-4">{description}</p>
                                                        </div>
                                                        <div className="col-span-2 grid grid-cols-2 gap-x-3 gap-y-2 justify-center pl-2">
                                                            {relevantStats.map(([key, value]) => {
                                                                const statKey = key;
                                                                
                                                                return (
                                                                    <Tooltip key={`${id}-${key}`}>
                                                                        <TooltipTrigger asChild>
                                                                            <div className="flex items-center justify-between gap-2 cursor-help text-xs">
                                                                                <span className="font-bold uppercase text-muted-foreground">{STAT_LABELS[statKey as keyof typeof STAT_LABELS]}</span>
                                                                                <span className="font-mono text-primary">{value}{key.includes('Chance') || key.includes('evasion') ? '%' : ''}</span>
                                                                            </div>
                                                                        </TooltipTrigger>
                                                                        <TooltipPrimitive.Portal container={tooltipPortalRef.current}>
                                                                            <TooltipContent side="bottom">
                                                                                <div className="space-y-1 w-48">
                                                                                    <p className="font-bold">{STAT_DEFINITIONS[statKey as keyof typeof STAT_DEFINITIONS].title}</p>
                                                                                    <p className="text-muted-foreground">{STAT_DEFINITIONS[statKey as keyof typeof STAT_DEFINITIONS].description}</p>
                                                                                </div>
                                                                            </TooltipContent>
                                                                        </TooltipPrimitive.Portal>
                                                                    </Tooltip>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                </Card>
                                            </motion.div>
                                        </AnimatePresence>
                                    </CarouselItem>
                                )
                            })}
                        </CarouselContent>
                        <CarouselPrevious type="button" variant="ghost" />
                        <CarouselNext type="button" variant="ghost" />
                    </Carousel>
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
