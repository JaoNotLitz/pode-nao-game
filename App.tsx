import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shuffle, RefreshCw, AlertCircle } from 'lucide-react';
import { cardsData } from './data/cards';
import { GameCard } from './components/GameCard';
import { TabooCardData, GameState } from './types';
import { playShuffleSound, playFlipSound } from './utils/sound';

// Helper to shuffle array
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('idle');
  const [currentCards, setCurrentCards] = useState<TabooCardData[]>([]);
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);

  const startShuffle = () => {
    // Play sound
    playShuffleSound();

    setGameState('shuffling');
    setSelectedCardIndex(null);
    
    setTimeout(() => {
      // Pick 3 random cards
      const shuffled = shuffleArray(cardsData);
      setCurrentCards(shuffled.slice(0, 3));
      setGameState('dealing');
      
      // Allow transition from dealing to selecting
      setTimeout(() => {
        setGameState('selecting');
      }, 400);
    }, 1000);
  };

  const handleCardClick = (index: number) => {
    if (gameState !== 'selecting') return;
    
    playFlipSound();
    
    setSelectedCardIndex(index);
    setGameState('revealed');
  };

  const resetGame = () => {
    setGameState('idle');
    setSelectedCardIndex(null);
    setCurrentCards([]);
  };

  return (
    // Main container locked to 100dvh to prevent scrolling
    <div className="h-[100dvh] w-screen bg-slate-100 flex flex-col items-center overflow-hidden relative selection:bg-rose-200 font-sans">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-48 h-48 bg-rose-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-48 h-48 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000 pointer-events-none"></div>
      <div className="absolute -bottom-32 left-20 w-48 h-48 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000 pointer-events-none"></div>

      {/* Header */}
      <header className="h-[15vh] flex-shrink-0 flex flex-col justify-center items-center px-4 text-center z-10 mt-4 md:mt-0">
        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-purple-600 drop-shadow-sm brand-font leading-tight">
          NÃO PODE
        </h1>
        <p className="text-slate-500 font-medium flex items-center gap-2 text-xs md:text-sm mt-1">
          {gameState === 'idle' && "Vamos jogar?"}
          {(gameState === 'dealing' || gameState === 'selecting') && "Escolha uma carta"}
          {gameState === 'revealed' && "Descreva a palavra!"}
        </p>
      </header>

      {/* Main Game Area */}
      <main className="flex-1 w-full relative flex flex-col items-center justify-center p-4">
        
        <AnimatePresence mode="wait">
          
          {/* IDLE STATE */}
          {gameState === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
              className="flex flex-col items-center gap-6"
            >
              {/* Stack of Cards Visual */}
              <div className="relative w-32 h-44 cursor-pointer group" onClick={startShuffle}>
                 {[0, 1, 2].map((i) => (
                    <div 
                      key={i}
                      className="absolute inset-0 rounded-xl bg-gradient-to-br from-rose-500 to-red-600 border-4 border-white shadow-xl"
                      style={{ 
                        transform: `translateY(${i * -4}px) translateX(${i * -2}px) rotate(${i * 2}deg)`,
                        zIndex: 10 - i 
                      }}
                    >
                      <div className="w-full h-full flex items-center justify-center opacity-20 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')]"></div>
                    </div>
                 ))}
                 <div className="absolute inset-0 flex items-center justify-center z-20">
                    <Shuffle className="text-white w-12 h-12 group-hover:rotate-180 transition-transform duration-500" />
                 </div>
              </div>

              <button 
                onClick={startShuffle}
                className="px-8 py-3 bg-slate-900 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              >
                <Shuffle size={18} />
                Embaralhar
              </button>
            </motion.div>
          )}

          {/* SHUFFLING STATE */}
          {gameState === 'shuffling' && (
            <motion.div
              key="shuffling"
              className="relative w-32 h-44"
            >
               {[0, 1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    className="absolute inset-0 rounded-xl bg-gradient-to-br from-rose-500 to-red-600 border-4 border-white shadow-md"
                    animate={{
                      x: [0, Math.random() * 60 - 30, 0],
                      y: [0, Math.random() * 30 - 15, 0],
                      rotate: [0, Math.random() * 30 - 15, 0],
                      scale: [1, 1.1, 1],
                      zIndex: [i, Math.floor(Math.random() * 5), i]
                    }}
                    transition={{
                      duration: 0.15,
                      repeat: Infinity,
                      repeatType: "mirror"
                    }}
                  >
                     <div className="w-full h-full flex items-center justify-center">
                        <span className="text-white/30 text-4xl font-black">?</span>
                     </div>
                  </motion.div>
               ))}
               <motion.div 
                 initial={{ opacity: 0, y: 50 }} 
                 animate={{ opacity: 1, y: 120 }} 
                 className="absolute -bottom-12 left-0 right-0 text-center font-bold text-rose-500 text-sm"
               >
                 Embaralhando...
               </motion.div>
            </motion.div>
          )}

          {/* DEALING & SELECTING STATE */}
          {(gameState === 'dealing' || gameState === 'selecting' || gameState === 'revealed') && (
            <div className="w-full h-full flex items-center justify-center">
              <div className="flex flex-row items-center justify-center gap-3 w-full max-w-4xl">
                {currentCards.map((card, index) => {
                  
                  const isSelected = index === selectedCardIndex;
                  const isOther = selectedCardIndex !== null && !isSelected;

                  if (gameState === 'revealed' && isOther) {
                    return null; 
                  }

                  // === PROPORTIONAL SIZING LOGIC ===
                  // Selecting: 28vw width ensures 3 fit nicely. Aspect ratio 5/7 maintains card shape.
                  // Revealed: 55vh height ensures it doesn't overflow vertically. Aspect ratio 5/7 dictates width.
                  const wrapperClasses = gameState === 'revealed' && isSelected
                    ? "h-[55vh] max-h-[500px] aspect-[5/7] z-50" // Revealed: Height constrained
                    : "w-[28vw] max-w-[180px] aspect-[5/7] z-10"; // Selecting: Width constrained

                  return (
                    <motion.div
                      key={`${card.palavra}-${index}`}
                      layoutId={`card-${index}`}
                      className={wrapperClasses}
                      initial={{ opacity: 0, y: 100 }}
                      animate={{ 
                        opacity: 1, 
                        y: 0,
                      }}
                      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                      transition={{ 
                        type: "spring", 
                        damping: 25, 
                        stiffness: 120,
                        delay: gameState === 'dealing' ? index * 0.1 : 0 
                      }}
                    >
                      <GameCard 
                        index={index}
                        data={card}
                        isFlipped={gameState === 'revealed' && isSelected}
                        onClick={() => handleCardClick(index)}
                        disabled={gameState !== 'selecting'}
                        isExpanded={gameState === 'revealed' && isSelected}
                      />
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

        </AnimatePresence>

        {/* Revealed Actions Buttons */}
        {gameState === 'revealed' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute bottom-8 left-0 right-0 z-50 flex gap-3 justify-center px-4"
          >
             <button 
                onClick={resetGame}
                className="flex-1 max-w-[140px] py-3 bg-white text-slate-700 border border-slate-300 rounded-full font-bold shadow-md active:bg-slate-100 flex items-center justify-center gap-2 text-xs md:text-sm"
              >
                <RefreshCw size={16} />
                Reiniciar
              </button>
             <button 
                onClick={startShuffle}
                className="flex-1 max-w-[140px] py-3 bg-rose-500 text-white border border-rose-600 rounded-full font-bold shadow-md active:bg-rose-600 flex items-center justify-center gap-2 text-xs md:text-sm"
              >
                <Shuffle size={16} />
                Nova Rodada
              </button>
          </motion.div>
        )}

      </main>

      {/* Footer */}
      <footer className="h-[5vh] flex-shrink-0 flex items-center justify-center text-slate-400 text-[10px]">
        Jogo "Não Pode" &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default App;
