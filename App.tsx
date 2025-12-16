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
    
    // Duration matches audio shuffle duration approx 0.8s
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
    <div className="min-h-screen bg-slate-100 flex flex-col items-center overflow-x-hidden relative selection:bg-rose-200">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-48 md:w-64 h-48 md:h-64 bg-rose-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 right-0 w-48 md:w-64 h-48 md:h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-32 left-20 w-48 md:w-64 h-48 md:h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>

      {/* Header */}
      <header className="pt-8 pb-2 md:pb-4 z-10 flex flex-col items-center px-4 text-center">
        <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-purple-600 drop-shadow-sm brand-font mb-2">
          NÃO PODE
        </h1>
        <p className="text-slate-500 font-medium flex flex-wrap justify-center items-center gap-2 text-xs md:text-base">
          <AlertCircle size={16} className="hidden md:block" />
          Escolha uma carta
        </p>
      </header>

      {/* Main Game Area */}
      <main className="flex-1 w-full max-w-6xl relative flex flex-col items-center justify-center p-4 min-h-[500px] md:min-h-[600px]">
        
        <AnimatePresence mode="wait">
          
          {/* IDLE STATE - The Deck Button */}
          {gameState === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
              className="flex flex-col items-center gap-8"
            >
              {/* Stack of Cards Visual */}
              <div className="relative w-40 h-60 md:w-48 md:h-72 cursor-pointer group" onClick={startShuffle}>
                 {[0, 1, 2].map((i) => (
                    <div 
                      key={i}
                      className="absolute inset-0 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 border-4 border-white shadow-xl"
                      style={{ 
                        transform: `translateY(${i * -4}px) translateX(${i * -2}px) rotate(${i * 2}deg)`,
                        zIndex: 10 - i 
                      }}
                    >
                      <div className="w-full h-full flex items-center justify-center opacity-20 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')]"></div>
                    </div>
                 ))}
                 <div className="absolute inset-0 flex items-center justify-center z-20">
                    <Shuffle className="text-white w-16 h-16 group-hover:rotate-180 transition-transform duration-500" />
                 </div>
              </div>

              <button 
                onClick={startShuffle}
                className="px-8 py-4 bg-slate-900 text-white rounded-full font-bold text-xl shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
              >
                <Shuffle size={20} />
                Embaralhar
              </button>
            </motion.div>
          )}

          {/* SHUFFLING STATE - FASTER ANIMATION */}
          {gameState === 'shuffling' && (
            <motion.div
              key="shuffling"
              className="relative w-40 h-60 md:w-48 md:h-72"
            >
               {[0, 1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    className="absolute inset-0 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 border-4 border-white shadow-md"
                    animate={{
                      x: [0, Math.random() * 60 - 30, 0], // More movement
                      y: [0, Math.random() * 30 - 15, 0],
                      rotate: [0, Math.random() * 30 - 15, 0],
                      scale: [1, 1.1, 1],
                      zIndex: [i, Math.floor(Math.random() * 5), i]
                    }}
                    transition={{
                      duration: 0.15, // Faster
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
                 animate={{ opacity: 1, y: 150 }} 
                 className="absolute bottom-0 left-0 right-0 text-center font-bold text-rose-500"
               >
                 Embaralhando...
               </motion.div>
            </motion.div>
          )}

          {/* DEALING & SELECTING STATE */}
          {(gameState === 'dealing' || gameState === 'selecting' || gameState === 'revealed') && (
            <div className="w-full flex items-center justify-center relative pb-24 md:pb-0">
              {/* Force flex-row and use center alignment. Mobile cards are small enough to fit 3 in a row. */}
              <div className="flex flex-row flex-wrap md:flex-nowrap gap-2 md:gap-8 items-center justify-center w-full">
                {currentCards.map((card, index) => {
                  
                  const isSelected = index === selectedCardIndex;
                  const isOther = selectedCardIndex !== null && !isSelected;

                  if (gameState === 'revealed' && isOther) {
                    return null; 
                  }

                  return (
                    <motion.div
                      key={`${card.palavra}-${index}`}
                      layoutId={`card-${index}`} 
                      initial={{ opacity: 0, y: 100, scale: 0.5 }}
                      animate={{ 
                        opacity: 1, 
                        y: 0, 
                        scale: gameState === 'revealed' && isSelected ? (window.innerWidth < 768 ? 1.5 : 1.2) : 1, // Larger scale on mobile reveal
                        zIndex: isSelected ? 50 : 1
                      }}
                      exit={{ opacity: 0, scale: 0.5, y: 50, transition: { duration: 0.3 } }}
                      transition={{ 
                        type: "spring", 
                        damping: 20, 
                        stiffness: 150,
                        delay: gameState === 'dealing' ? index * 0.1 : 0 
                      }}
                      className={`${gameState === 'revealed' && isSelected ? 'z-50' : ''}`}
                    >
                      <GameCard 
                        index={index}
                        data={card}
                        isFlipped={gameState === 'revealed' && isSelected}
                        onClick={() => handleCardClick(index)}
                        disabled={gameState !== 'selecting'}
                      />
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

        </AnimatePresence>

        {/* Revealed Actions */}
        {gameState === 'revealed' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="fixed bottom-6 z-50 flex gap-4 justify-center w-full px-4"
          >
             <button 
                onClick={resetGame}
                className="flex-1 max-w-xs px-6 py-4 bg-white text-slate-700 border-2 border-slate-200 rounded-full font-bold shadow-lg hover:bg-slate-50 hover:border-slate-300 transition-colors flex items-center justify-center gap-2 text-sm md:text-base"
              >
                <RefreshCw size={18} />
                Reiniciar
              </button>
             <button 
                onClick={startShuffle}
                className="flex-1 max-w-xs px-6 py-4 bg-rose-500 text-white rounded-full font-bold shadow-lg hover:bg-rose-600 hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2 text-sm md:text-base"
              >
                <Shuffle size={18} />
                Nova Rodada
              </button>
          </motion.div>
        )}

      </main>

      <footer className="py-4 text-slate-400 text-xs font-medium text-center">
        Jogo "Não Pode" &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default App;
