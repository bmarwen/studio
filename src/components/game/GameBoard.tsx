
"use client";

import { memo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Home, Mountain, Trees, Waves, Snowflake, Tent, Sprout } from 'lucide-react';
import type { TileData, Player, PlayerIcon } from '@/types/game';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { VIEWPORT_SIZE } from '@/lib/game-constants';
import Image from 'next/image';

interface TileProps {
  tile: TileData;
}

const getPlayerIconPath = (icon: PlayerIcon) => {
    switch (icon) {
        case 'hero1': return '/icons/hero-avatar-1.png';
        case 'hero2': return '/icons/hero-avatar-2.png';
        case 'hero3': return '/icons/hero-avatar-3.png';
        case 'hero4': return '/icons/hero-avatar-4.png';
        case 'hero5': return '/icons/hero-avatar-5.png';
        case 'hero6': return '/icons/hero-avatar-6.png';
        default: return '/icons/hero-avatar-1.png';
    }
}

const getTileIcon = (tile: TileData) => {
  switch (tile.terrain) {
    case 'tree': return <Trees className="w-10 h-10 text-green-700 dark:text-green-500" />;
    case 'mountain': return <Mountain className="w-10 h-10 text-gray-600 dark:text-gray-400" />;
    case 'river': return <Waves className="w-10 h-10 text-blue-600 dark:text-blue-400" />;
    case 'snow': return <Snowflake className="w-10 h-10 text-blue-300 dark:text-blue-200" />;
    case 'town': return <Home className="w-10 h-10 text-amber-800 dark:text-amber-300" />;
    case 'camp': return <Tent className="w-10 h-10 text-orange-600 dark:text-orange-400" />;
    case 'grass': return <Sprout className="w-10 h-10 text-green-700 dark:text-green-500" />;
    default: return null;
  }
};

const getTooltipContent = (tile: TileData) => {
    if (tile.terrain === 'snow') return 'Snowy field';
    if (tile.terrain === 'camp') return 'A safe place to rest.';
    if (tile.terrain === 'mountain') return 'Treacherous mountains. Moving here costs a lot of stamina.';
    if (tile.terrain === 'grass') return 'Grass field';
    if (tile.terrain === 'tree') return 'Forest';
    return tile.terrain.charAt(0).toUpperCase() + tile.terrain.slice(1);
}

const TileContent = memo(({ tile }: {tile: TileData}) => {
    return getTileIcon(tile);
});
TileContent.displayName = "TileContent";


const Tile = memo(({ tile }: TileProps) => {
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn(
            "w-20 h-20 border border-border/20 flex items-center justify-center transition-colors aspect-square",
            tile.terrain === 'mountain' ? 'bg-secondary' : 'bg-background hover:bg-accent/20',
            tile.terrain === 'river' && 'bg-blue-900/50',
            tile.terrain === 'snow' && 'bg-white/10',
            tile.terrain === 'camp' && 'bg-orange-400/10 dark:bg-orange-900/40',
            "relative"
          )}>
            <TileContent tile={tile} />
          </div>
        </TooltipTrigger>
        <TooltipContent>
            <p className="font-bold">{getTooltipContent(tile)}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});

Tile.displayName = 'Tile';


interface GameBoardProps {
  viewport: TileData[][];
  player: Player;
  isMoving: boolean;
  moveCooldown: number;
  moveCount: number;
}

const GameBoard = ({ viewport, player, isMoving, moveCooldown, moveCount }: GameBoardProps) => {
  const iconPath = getPlayerIconPath(player.icon);

  if (!viewport || viewport.length === 0) {
    return <div>Loading map...</div>;
  }

  return (
    <div className="relative border-4 border-primary rounded-lg shadow-xl p-2 bg-secondary">
      <div className={`grid grid-cols-9 gap-1`}>
        {viewport.map((row, y) =>
          row.map((tile, x) => (
            <motion.div
              key={`${x}-${y}`}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: (y * VIEWPORT_SIZE + x) * 0.02 }}
            >
              <Tile tile={tile} />
            </motion.div>
          ))
        )}
      </div>
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center"
      >
        <AnimatePresence>
          {isMoving && (
            <motion.div
              key={`loader-${moveCount}`}
              className="absolute w-[4.5rem] h-[4.5rem] z-20 flex items-center justify-center"
              exit={{ opacity: 0 }}
            >
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <motion.circle
                  cx="50"
                  cy="50"
                  r="48"
                  stroke="hsl(var(--primary))"
                  strokeWidth="4"
                  fill="transparent"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1.01 }}
                  transition={{ 
                    duration: moveCooldown / 1000, 
                    ease: 'linear' 
                  }}
                />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <img src={iconPath} alt="player icon" className="w-16 h-16 rounded-full drop-shadow-lg z-10 pointer-events-auto" />
                </TooltipTrigger>
                <TooltipContent>
                    <p>{player.name}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default GameBoard;
