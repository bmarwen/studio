"use client";

import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

interface MovementControlsProps {
  onMove: (dx: number, dy: number) => void;
}

export default function MovementControls({ onMove }: MovementControlsProps) {
  return (
    <div className="grid grid-cols-3 grid-rows-3 gap-2 w-48 mt-4" aria-label="Movement controls">
      <div className="col-start-2 row-start-1">
        <Button variant="outline" size="lg" className="w-full h-full" onClick={() => onMove(0, -1)} aria-label="Move up">
          <ArrowUp />
        </Button>
      </div>
      <div className="col-start-1 row-start-2">
        <Button variant="outline" size="lg" className="w-full h-full" onClick={() => onMove(-1, 0)} aria-label="Move left">
          <ArrowLeft />
        </Button>
      </div>
      <div className="col-start-3 row-start-2">
        <Button variant="outline" size="lg" className="w-full h-full" onClick={() => onMove(1, 0)} aria-label="Move right">
          <ArrowRight />
        </Button>
      </div>
      <div className="col-start-2 row-start-3">
        <Button variant="outline" size="lg" className="w-full h-full" onClick={() => onMove(0, 1)} aria-label="Move down">
          <ArrowDown />
        </Button>
      </div>
    </div>
  );
}
