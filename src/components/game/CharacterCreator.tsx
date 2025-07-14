
"use client";

import { useState } from 'react';
import type { Player, PlayerClass, PlayerIcon } from '@/types/game';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { INITIAL_PLAYER_STATE, PLAYER_CLASSES } from '@/lib/game-constants';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle } from 'lucide-react';
import Image from 'next/image';

type Props = {
  onPlayerCreate: (player: Player) => void;
};

const ICONS: { id: PlayerIcon; path: string; hint: string;}[] = [
    { id: 'hero1', path: '/icons/hero-avatar-warrior.png', hint: 'bearded warrior' },
    { id: 'hero2', path: '/icons/icon-elf.png', hint: 'elf archer' },
    { id: 'hero3', path: '/icons/hero-avatar-dragon.png', hint: 'dragon face' },
    { id: 'hero4', path: '/icons/hero-avatar-knight.png', hint: 'male knight' },
];

const CLASSES: { id: PlayerClass; name: string; description: string; icon: React.ReactNode }[] = [
    { id: 'warrior', name: 'Warrior', description: 'A master of melee combat, boasting high health and defense.', icon: <img src="/icons/class-warrior.png" className="w-5 h-5" /> },
    { id: 'mage', name: 'Mage', description: 'A powerful spellcaster with high magic and energy.', icon: <img src="/icons/class-mage.png" className="w-5 h-5" /> },
    { id: 'ranger', name: 'Ranger', description: 'A skilled archer with balanced stats.', icon: <img src="/icons/class-ranger.png" className="w-5 h-5" /> },
    { id: 'assassin', name: 'Assassin', description: 'A deadly rogue with high attack and speed.', icon: <img src="/icons/class-assassin.png" className="w-5 h-5" /> },
];

export default function CharacterCreator({ onPlayerCreate }: Props) {
  const [name, setName] = useState('');
  const [selectedClass, setSelectedClass] = useState<PlayerClass>('warrior');
  const [selectedIcon, setSelectedIcon] = useState<PlayerIcon>('hero1');
  const { toast } = useToast();

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
    <div className="flex items-center justify-center h-screen bg-background font-body">
      <Card className="w-full max-w-3xl shadow-2xl">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="font-headline text-4xl text-center text-primary">Create Your Hero</CardTitle>
            <CardDescription className="text-center">Begin your adventure in the world of Square Clash.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* Left Side: Name and Icon */}
            <div className="space-y-6">
              <div>
                <Label htmlFor="name" className="text-lg font-headline">Hero Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Sir Reginald"
                  className="mt-2 text-base"
                />
              </div>
              <div>
                <Label className="text-lg font-headline">Choose Your Icon</Label>
                <RadioGroup
                  value={selectedIcon}
                  onValueChange={(val) => setSelectedIcon(val as PlayerIcon)}
                  className="mt-2 grid grid-cols-2 gap-4"
                >
                  {ICONS.map(({ id, path, hint }) => (
                     <Label
                        key={id}
                        htmlFor={id}
                        className={cn(
                          'flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all aspect-square',
                          selectedIcon === id ? 'border-primary bg-primary/10' : 'border-border'
                        )}
                      >
                       <RadioGroupItem value={id} id={id} className="sr-only" />
                       <Image src={path} alt={id} width={128} height={128} className="w-32 h-32" data-ai-hint={hint} />
                     </Label>
                  ))}
                </RadioGroup>
              </div>
            </div>

            {/* Right Side: Class Selection */}
            <div className="space-y-2">
                <Label className="text-lg font-headline">Choose Your Class</Label>
                <RadioGroup
                    value={selectedClass}
                    onValueChange={(val) => setSelectedClass(val as PlayerClass)}
                    className="space-y-2"
                >
                    {CLASSES.map(({ id, name, description, icon }) => {
                        const stats = PLAYER_CLASSES[id];
                        return (
                            <Label key={id} htmlFor={id} className={cn(
                                'flex flex-col p-4 border-2 rounded-lg cursor-pointer transition-all',
                                selectedClass === id ? 'border-primary bg-primary/10' : 'border-border'
                            )}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <RadioGroupItem value={id} id={id} />
                                        <span className="font-bold text-base">{name}</span>
                                        {icon}
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground mt-2 pl-8">{description}</p>
                                <div className="text-xs grid grid-cols-3 gap-x-4 pl-8 mt-2 text-muted-foreground">
                                    <span>HP: {stats.maxHp}</span>
                                    <span>ATK: {stats.attack}</span>
                                    <span>DEF: {stats.defense}</span>
                                    <span>EN: {stats.maxEnergy}</span>
                                    <span>MAG: {stats.magic}</span>
                                </div>
                            </Label>
                        )
                    })}
                </RadioGroup>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-4">
            <Button type="submit" size="lg" className="w-full font-headline text-xl">
              Begin Adventure
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
