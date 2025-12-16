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
  isExpanded?: boolean; // Controls internal font scaling
}

export const GameCard: React.FC<GameCardProps> = ({ 
  data, 
  isFlipped, 
  onClick, 
  disabled = false,
  index,
  isExpanded = false
}) => {
  return (
    <motion.div
      // Size controlled by parent
      className={`relative w-full h-full perspective-1000 ${disabled ? 'cursor-default' : 'cursor-pointer hover:shadow-2xl'}`}
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
            <ThumbsDown className={`text-white drop-shadow-lg animate-bounce ${isExpanded ? 'w-12 h-12 mb-4' : 'w-8 h-8 mb-2'}`} />
            <h2 className={`font-bold uppercase text-center tracking-wider brand-font drop-shadow-md leading-none ${isExpanded ? 'text-3xl' : 'text-xl'}`}>
              Não<br/>Pode
            </h2>
          </div>
        </div>

        {/* CARD FRONT (Face Up) */}
        <div 
          className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-xl md:rounded-2xl shadow-lg md:shadow-xl bg-white border-2 md:border-4 border-slate-200 overflow-hidden flex flex-col"
        >
          {/* Header Section */}
          <div className="bg-slate-100 p-2 md:p-4 border-b border-slate-200 flex flex-col items-center justify-center h-[28%] flex-shrink-0 relative z-0">
            <span className={`font-bold text-slate-400 uppercase tracking-widest mb-1 ${isExpanded ? 'text-xs block' : 'text-[6px] hidden md:block'}`}>
              A Palavra é
            </span>
            <h3 className={`font-extrabold text-slate-800 brand-font text-center leading-tight break-words w-full px-2 ${isExpanded ? 'text-2xl md:text-3xl' : 'text-xs md:text-lg'}`}>
              {data.palavra}
            </h3>
          </div>

          {/* Floating 'Proibido' Badge - Centered on the seam between Header and Body */}
          <div className="absolute top-[28%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
             <div className="bg-red-500 text-white px-3 py-0.5 rounded-full shadow-md flex items-center justify-center gap-1 whitespace-nowrap border-2 border-white">
                <ThumbsDown size={isExpanded ? 12 : 8} strokeWidth={3} />
                <span className={`font-black tracking-wider ${isExpanded ? 'text-[10px] md:text-xs' : 'text-[6px]'}`}>PROIBIDO</span>
             </div>
          </div>

          {/* Body Section */}
          <div className="flex-1 bg-white relative p-3 md:p-4 flex flex-col justify-center overflow-hidden">
             
            {isExpanded ? (
               // GRID LAYOUT FOR EXPANDED STATE (2-2-1)
               <div className="grid grid-cols-2 gap-2 w-full h-full content-center pt-2">
                 {data.restricoes.map((word, idx) => {
                   const isLast = idx === 4;
                   return (
                     <div 
                       key={idx} 
                       className={`
                         flex items-center justify-center 
                         bg-red-50 border-2 border-red-100 rounded-lg 
                         text-slate-700 font-bold text-center leading-none shadow-sm
                         ${isLast ? 'col-span-2' : ''}
                       `}
                     >
                        <span className="text-lg md:text-2xl truncate px-1 py-1 w-full">{word}</span>
                     </div>
                   );
                 })}
               </div>
            ) : (
               // COMPACT LIST LAYOUT FOR SELECTING STATE
               <ul className="flex flex-col justify-center h-full space-y-0.5 pt-1">
                  {data.restricoes.map((word, idx) => (
                    <li key={idx} className="flex items-center text-slate-600 font-medium bg-red-50 rounded border border-red-100 px-1 py-0.5 text-[8px]">
                      <span className="rounded-full bg-red-400 w-1 h-1 mr-1 flex-shrink-0"></span>
                      <span className="truncate">{word}</span>
                    </li>
                  ))}
               </ul>
            )}
          </div>
          
          <div className="h-1.5 flex-shrink-0 bg-gradient-to-r from-red-400 to-orange-500"></div>
        </div>
      </motion.div>
    </motion.div>
  );
};
