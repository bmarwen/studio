
"use client";

import { useState, useEffect } from 'react';
import type { Player, PlayerClass, PlayerIcon } from '@/types/game';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { INITIAL_PLAYER_STATE, PLAYER_CLASSES } from '@/lib/game-constants';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, Dices } from 'lucide-react';
import Image from 'next/image';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Carousel, CarouselApi, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../ui/carousel';
import { AnimatePresence, motion } from 'framer-motion';

type Props = {
  onPlayerCreate: (player: Player) => void;
};

const ICONS: { id: PlayerIcon; path: string; hint: string;}[] = [
    { id: 'hero1', path: '/icons/hero-avatar-1.png', hint: 'bearded warrior' },
    { id: 'hero2', path: '/icons/hero-avatar-2.png', hint: 'female warrior' },
    { id: 'hero3', path: '/icons/hero-avatar-3.png', hint: 'male elf' },
    { id: 'hero4', path: '/icons/hero-avatar-4.png', hint: 'female elf' },
    { id: 'hero5', path: '/icons/hero-avatar-5.png', hint: 'dragon character' },
    { id: 'hero6', path: '/icons/hero-avatar-6.png', hint: 'dark knight' },
];

const CLASSES: { id: PlayerClass; name: string; description: string; iconPath: string }[] = [
    { id: 'warrior', name: 'Warrior', description: 'A master of melee combat, boasting high health and defense.', iconPath: '/icons/warrior-icon.png' },
    { id: 'mage', name: 'Mage', description: 'A powerful spellcaster with high magic and energy.', iconPath: '/icons/mage-icon.png' },
    { id: 'ranger', name: 'Ranger', description: 'A skilled archer with balanced stats.', iconPath: '/icons/ranger-icon.png' },
    { id: 'assassin', name: 'Assassin', description: 'A deadly rogue with high attack and speed.', iconPath: '/icons/assassin-icon.png' },
];

const NAME_PREFIXES = ["Ael", "Thorn", "Glim", "Shadow", "Bael", "Crys", "Drak", "Fen", "Grim", "Iron"];
const NAME_SUFFIXES = ["dric", "wyn", "fire", "fall", "wood", "shield", "more", "fang", "lore", "gard"];

export default function CharacterCreator({ onPlayerCreate }: Props) {
  const [name, setName] = useState('');
  const [selectedClass, setSelectedClass] = useState<PlayerClass>('warrior');
  const [selectedIcon, setSelectedIcon] = useState<PlayerIcon>('hero1');
  const { toast } = useToast();

  const [iconApi, setIconApi] = useState<CarouselApi>();
  const [classApi, setClassApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!iconApi) return;
    iconApi.on("select", () => {
      const selectedIndex = iconApi.selectedScrollSnap();
      setSelectedIcon(ICONS[selectedIndex].id);
    });
  }, [iconApi]);

  useEffect(() => {
    if (!classApi) return;
    classApi.on("select", () => {
      const selectedIndex = classApi.selectedScrollSnap();
      setSelectedClass(CLASSES[selectedIndex].id);
    });
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
        variant: "destructive"
      })
      return;
    }

    const classStats = PLAYER_CLASSES[selectedClass];
    const newPlayer: Player = {
      ...INITIAL_PLAYER_STATE,
      ...classStats,
      name,
      icon: selectedIcon,
    };
    onPlayerCreate(newPlayer);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background font-body p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <form onSubmit={handleSubmit}>
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-4xl text-primary">Create Your Hero</CardTitle>
            <CardDescription>Customize your character and start your adventure.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 p-6">
            
            {/* Name Input */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-lg font-headline text-center block">Hero Name</Label>
              <div className="flex items-center gap-2 max-w-sm mx-auto">
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Sir Reginald"
                    className="text-base text-center"
                  />
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                         <Button type="button" variant="outline" size="icon" onClick={handleGenerateName}>
                          <Dices className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Generates random name</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
              </div>
            </div>

            {/* Icon Selector */}
            <div className="space-y-2">
                <Label className="text-lg font-headline text-center block">Choose Your Icon</Label>
                <Carousel setApi={setIconApi} opts={{loop: true}} className="w-full max-w-xs mx-auto">
                    <CarouselContent>
                        {ICONS.map(({ id, path, hint }) => (
                            <CarouselItem key={id}>
                                <div className="p-1">
                                    <div className="flex aspect-square items-center justify-center p-2">
                                        <Image src={path} alt={id} width={200} height={200} className="w-48 h-48 rounded-lg shadow-lg border-4 border-transparent group-hover:border-primary transition-colors" data-ai-hint={hint} />
                                    </div>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </div>

            {/* Class Selector */}
            <div className="space-y-2">
                <Label className="text-lg font-headline text-center block">Choose Your Class</Label>
                 <Carousel setApi={setClassApi} opts={{loop: true}} className="w-full max-w-xs mx-auto">
                    <CarouselContent>
                        {CLASSES.map(({ id, name, description, iconPath }) => {
                             const stats = PLAYER_CLASSES[id];
                             return (
                                <CarouselItem key={id}>
                                    <div className="p-1">
                                        <Card className="bg-secondary/50">
                                            <CardHeader className="items-center pb-2">
                                                <Image src={iconPath} alt={name} width={80} height={80} className="w-20 h-20 rounded-full bg-primary/20 p-2 border-2 border-primary" />
                                                <CardTitle className="font-headline text-2xl pt-2">{name}</CardTitle>
                                            </CardHeader>
                                            <CardContent className="text-center space-y-4">
                                                <p className="text-sm text-muted-foreground min-h-[40px]">{description}</p>
                                                <div className="text-xs grid grid-cols-3 gap-x-2 gap-y-1 text-muted-foreground">
                                                    <span>HP: {stats.maxHp}</span>
                                                    <span>ATK: {stats.attack}</span>
                                                    <span>DEF: {stats.defense}</span>
                                                    <span>EN: {stats.maxEnergy}</span>
                                                    <span>MAG: {stats.magic}</span>
                                                    <span></span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </CarouselItem>
                             )
                        })}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={selectedClass}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="text-center mt-2"
                    >
                        <p className="font-bold text-lg font-headline">{CLASSES.find(c => c.id === selectedClass)?.name}</p>
                    </motion.div>
                </AnimatePresence>
            </div>

          </CardContent>
          <CardFooter className="flex-col gap-4 p-6">
            <Button type="submit" size="lg" className="w-full font-headline text-xl">
              Begin Adventure
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
