
"use client";

import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MovementControlsProps {
  onMove: (dx: number, dy: number) => void;
}

export default function MovementControls({ onMove }: MovementControlsProps) {
  const buttonBaseClasses = "w-16 h-16 rounded-lg bg-secondary hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background transition-colors";
  const iconClasses = "w-8 h-8";

  return (
    <div className="grid grid-cols-3 grid-rows-3 gap-2 w-52 h-52 p-2 bg-card border-2 border-border rounded-2xl shadow-lg">
      <div />
      <Button
        variant="outline"
        size="icon"
        className={cn(buttonBaseClasses, "col-start-2")}
        onClick={() => onMove(0, -1)}
        aria-label="Move up"
      >
        <ArrowUp className={iconClasses} />
      </Button>
      <div />
      
      <Button
        variant="outline"
        size="icon"
        className={cn(buttonBaseClasses, "row-start-2")}
        onClick={() => onMove(-1, 0)}
        aria-label="Move left"
      >
        <ArrowLeft className={iconClasses} />
      </Button>
      <div className="bg-secondary/50 rounded-md row-start-2 col-start-2" />
      <Button
        variant="outline"
        size="icon"
        className={cn(buttonBaseClasses, "row-start-2")}
        onClick={() => onMove(1, 0)}
        aria-label="Move right"
      >
        <ArrowRight className={iconClasses} />
      </Button>

      <div />
      <Button
        variant="outline"
        size="icon"
        className={cn(buttonBaseClasses, "col-start-2 row-start-3")}
        onClick={() => onMove(0, 1)}
        aria-label="Move down"
      >
        <ArrowDown className={iconClasses} />
      </Button>
      <div />
    </div>
  );
}
