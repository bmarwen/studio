"use client";

import { memo } from 'react';
import { motion } from 'framer-motion';
import { Home, Mountain, Sparkles, TreePine, UserRound, Waves, Snowflake, Axe, User, ShieldQuestion, Wand } from 'lucide-react';
import type { TileData, PlayerIcon } from '@/types/game';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { VIEWPORT_SIZE } from '@/lib/game-constants';

interface TileProps {
  tile: TileData;
}

const getPlayerIcon = (icon: PlayerIcon) => {
    const props = { className: "w-8 h-8 text-primary-foreground bg-primary rounded-full p-1 shadow-lg" };
    switch (icon) {
        case 'hero1': return <User {...props} />;
        case 'hero2': return <Axe {...props} />;
        case 'hero3': return <Wand {...props} />;
        case 'hero4': return <ShieldQuestion {...props} />;
        default: return <UserRound {...props} />;
    }
}

const getTileIcon = (tile: TileData) => {
  switch (tile.terrain) {
    case 'tree': return <TreePine className="w-6 h-6 text-green-700 dark:text-green-500" />;
    case 'mountain': return <Mountain className="w-6 h-6 text-gray-600 dark:text-gray-400" />;
    case 'river': return <Waves className="w-6 h-6 text-blue-600 dark:text-blue-400" />;
    case 'snow': return <Snowflake className="w-6 h-6 text-blue-300 dark:text-blue-200" />;
    case 'treasure': return <Sparkles className="w-6 h-6 text-yellow-500" />;
    case 'town': return <Home className="w-6 h-6 text-amber-800 dark:text-amber-300" />;
    default: return null;
  }
};

const getTooltipContent = (tile: TileData) => {
    if (tile.monster) return "You sense danger...";
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
            "w-16 h-16 border border-border/20 flex items-center justify-center transition-colors",
            isObstacle ? 'bg-secondary' : 'bg-background hover:bg-accent/20',
            tile.terrain === 'grass' && 'bg-green-900/20',
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

  return (
    <div className="relative border-4 border-primary rounded-lg shadow-xl p-2 bg-secondary">
      <div className="grid grid-cols-9 gap-1">
        {viewport.map((row, y) =>
          row.map((tile, x) => (
            <motion.div
              key={`${x}-${y}`}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: (y * VIEWPORT_SIZE + x) * 0.02 }}
            >
              <Tile tile={{...tile, monster: undefined}} />
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
          {getPlayerIcon(playerIcon)}
      </div>
    </div>
  );
};

export default GameBoard;
