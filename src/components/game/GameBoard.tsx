"use client";

import { memo } from 'react';
import { motion } from 'framer-motion';
import { Home, Mountain, Sparkles, TreePine, Waves, Snowflake } from 'lucide-react';
import type { TileData, PlayerIcon } from '@/types/game';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { VIEWPORT_SIZE } from '@/lib/game-constants';

interface TileProps {
  tile: TileData;
}

const getPlayerIconPath = (icon: PlayerIcon) => {
    switch (icon) {
        case 'hero1': return '/icons/warrior-icon.svg';
        case 'hero2': return '/icons/mage-icon.svg';
        case 'hero3': return '/icons/ranger-icon.svg';
        case 'hero4': return '/icons/assassin-icon.svg';
        default: return '/icons/warrior-icon.svg';
    }
}

const getTileIcon = (tile: TileData) => {
  if (tile.item) return <img src={tile.item.icon} alt={tile.item.name} className="w-8 h-8 animate-pulse" />;
  switch (tile.terrain) {
    case 'tree': return <TreePine className="w-8 h-8 text-green-700 dark:text-green-500" />;
    case 'mountain': return <Mountain className="w-8 h-8 text-gray-600 dark:text-gray-400" />;
    case 'river': return <Waves className="w-8 h-8 text-blue-600 dark:text-blue-400" />;
    case 'snow': return <Snowflake className="w-8 h-8 text-blue-300 dark:text-blue-200" />;
    case 'town': return <Home className="w-8 h-8 text-amber-800 dark:text-amber-300" />;
    default: return null;
  }
};

const getTooltipContent = (tile: TileData) => {
    if (tile.item) return `Something catches your eye...`;
    if (tile.terrain === 'snow') return 'Snowy field';
    return tile.terrain.charAt(0).toUpperCase() + tile.terrain.slice(1);
}

const Tile = memo(({ tile }: TileProps) => {
  const isObstacle = tile.terrain === 'mountain';
  const icon = getTileIcon(tile);
  
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn(
            "w-16 h-16 border border-border/20 flex items-center justify-center transition-colors aspect-square",
            isObstacle ? 'bg-secondary' : 'bg-background hover:bg-accent/20',
            tile.terrain === 'grass' && 'bg-green-900/40',
            tile.terrain === 'river' && 'bg-blue-900/50',
            tile.terrain === 'snow' && 'bg-white/10',
            "relative"
          )}>
            {icon}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{getTooltipContent(tile)}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});

Tile.displayName = 'Tile';


interface GameBoardProps {
  viewport: TileData[][];
  playerIcon: PlayerIcon;
}

const GameBoard = ({ viewport, playerIcon }: GameBoardProps) => {
  const playerPosition = Math.floor(VIEWPORT_SIZE / 2);
  const iconPath = getPlayerIconPath(playerIcon);

  if (!viewport || viewport.length === 0) {
    return <div>Loading map...</div>;
  }

  return (
    <div className="relative border-4 border-primary rounded-lg shadow-xl p-2 bg-secondary">
      <div className={`grid grid-cols-${VIEWPORT_SIZE} gap-1`}>
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
        className="absolute flex items-center justify-center pointer-events-none w-16 h-16"
        style={{
            top: `calc(${playerPosition} * (4rem + 0.25rem) + 0.5rem)`, // 4rem tile + 0.25rem gap, plus padding
            left: `calc(${playerPosition} * (4rem + 0.25rem) + 0.5rem)`,
        }}
      >
          <img src={iconPath} alt="player icon" className="w-12 h-12 drop-shadow-lg" />
      </div>
    </div>
  );
};

export default GameBoard;
