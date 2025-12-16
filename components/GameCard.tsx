import React from 'react';
import { motion } from 'framer-motion';
import { TabooCardData } from '../types';
import { ThumbsDown } from 'lucide-react';

interface GameCardProps {
  data: TabooCardData;
  isFlipped: boolean;
  onClick?: () => void;
  disabled?: boolean;
  index: number;
}

export const GameCard: React.FC<GameCardProps> = ({ 
  data, 
  isFlipped, 
  onClick, 
  disabled = false,
  index
}) => {
  return (
    <motion.div
      // Mobile: w-28 (approx 112px) h-44 to fit 3 in a row
      // Desktop: w-64 h-96 (original size)
      className={`relative w-28 h-44 md:w-64 md:h-96 perspective-1000 ${disabled ? 'cursor-default' : 'cursor-pointer hover:shadow-2xl'}`}
      onClick={!disabled ? onClick : undefined}
      whileHover={!disabled && !isFlipped ? { scale: 1.05, rotate: index % 2 === 0 ? 2 : -2 } : {}}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <motion.div
        className="w-full h-full relative transform-style-3d transition-all duration-500"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        {/* CARD BACK (Face Down) */}
        <div 
          className="absolute inset-0 w-full h-full backface-hidden rounded-xl md:rounded-2xl shadow-lg md:shadow-xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #FF416C 0%, #FF4B2B 100%)',
            border: '2px md:border-4 solid white'
          }}
        >
          {/* Pattern Overlay */}
          <div className="absolute inset-0 opacity-10" style={{ 
            backgroundImage: 'radial-gradient(circle, #fff 2px, transparent 2.5px)', 
            backgroundSize: '20px 20px' 
          }}></div>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-2 border-2 md:border-4 border-white/20 m-1 md:m-3 rounded-lg md:rounded-xl">
            <ThumbsDown className="mb-2 md:mb-4 text-white drop-shadow-lg animate-bounce w-6 h-6 md:w-16 md:h-16" />
            <h2 className="text-xl md:text-4xl font-bold uppercase text-center tracking-wider brand-font drop-shadow-md leading-none">
              Não<br/>Pode
            </h2>
          </div>
        </div>

        {/* CARD FRONT (Face Up) */}
        <div 
          className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-xl md:rounded-2xl shadow-lg md:shadow-xl bg-white border-2 md:border-4 border-slate-200 overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="bg-slate-100 p-2 md:p-6 border-b border-slate-200 flex flex-col items-center justify-center h-[30%]">
            <span className="hidden md:block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">A Palavra é</span>
            <h3 className="text-sm md:text-3xl font-extrabold text-slate-800 brand-font text-center leading-tight break-words w-full">
              {data.palavra}
            </h3>
          </div>

          {/* Body */}
          <div className="p-2 md:p-6 flex-1 flex flex-col justify-center bg-white relative">
            
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-500 text-white px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[8px] md:text-xs font-bold shadow-sm flex items-center gap-1 whitespace-nowrap z-10">
              <ThumbsDown size={8} className="md:w-3 md:h-3" />
              <span className="md:inline">PROIBIDO</span>
            </div>

            <ul className="space-y-1 md:space-y-3 mt-1 md:mt-2">
              {data.restricoes.map((word, idx) => (
                <li key={idx} className="flex items-center text-slate-600 font-medium bg-red-50 px-1.5 py-0.5 md:px-3 md:py-2 rounded md:rounded-lg border border-red-100 text-[10px] md:text-base leading-tight">
                  <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-red-400 mr-1.5 md:mr-3 flex-shrink-0"></span>
                  {word}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="h-1 md:h-2 bg-gradient-to-r from-red-400 to-orange-500"></div>
        </div>
      </motion.div>
    </motion.div>
  );
};
