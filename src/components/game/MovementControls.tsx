
"use client";

import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

interface MovementControlsProps {
  onMove: (dx: number, dy: number) => void;
}

export default function MovementControls({ onMove }: MovementControlsProps) {
  return (
    <>
      <Button variant="outline" size="lg" className="absolute top-1/2 -left-28 -translate-y-1/2" onClick={() => onMove(-1, 0)} aria-label="Move left">
        <ArrowLeft />
      </Button>
      <Button variant="outline" size="lg" className="absolute top-1/2 -right-28 -translate-y-1/2" onClick={() => onMove(1, 0)} aria-label="Move right">
        <ArrowRight />
      </Button>
      <Button variant="outline" size="lg" className="absolute left-1/2 -top-20 -translate-x-1/2" onClick={() => onMove(0, -1)} aria-label="Move up">
        <ArrowUp />
      </Button>
      <Button variant="outline" size="lg" className="absolute left-1/2 -bottom-20 -translate-x-1/2" onClick={() => onMove(0, 1)} aria-label="Move down">
        <ArrowDown />
      </Button>
    </>
  );
}


    
