
"use client";

import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MovementControlsProps {
  onMove: (dx: number, dy: number) => void;
}

export default function MovementControls({ onMove }: MovementControlsProps) {
  const buttonBaseClasses = "w-16 h-16 rounded-lg bg-secondary hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background transition-colors flex items-center justify-center";
  const iconClasses = "w-8 h-8";

  return (
    <div className="relative w-48 h-48">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[4.2rem] h-[4.2rem] bg-card/50 rounded-lg" />

        {/* Arrow Buttons */}
        <Button variant="outline" size="icon" className={cn(buttonBaseClasses, "absolute top-0 left-1/2 -translate-x-1/2")} onClick={() => onMove(0, -1)} aria-label="Move up">
            <ArrowUp className={iconClasses} />
        </Button>
        <Button variant="outline" size="icon" className={cn(buttonBaseClasses, "absolute bottom-0 left-1/2 -translate-x-1/2")} onClick={() => onMove(0, 1)} aria-label="Move down">
            <ArrowDown className={iconClasses} />
        </Button>
        <Button variant="outline" size="icon" className={cn(buttonBaseClasses, "absolute left-0 top-1/2 -translate-y-1/2")} onClick={() => onMove(-1, 0)} aria-label="Move left">
            <ArrowLeft className={iconClasses} />
        </Button>
        <Button variant="outline" size="icon" className={cn(buttonBaseClasses, "absolute right-0 top-1/2 -translate-y-1/2")} onClick={() => onMove(1, 0)} aria-label="Move right">
            <ArrowRight className={iconClasses} />
        </Button>
    </div>
  );
}
