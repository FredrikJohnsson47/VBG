import React, { useState, useEffect, useCallback } from 'react';
import { QUIZ_DATA, IMAGE_URL } from './constants.js';

// Helper component for individual clickable points on the image
const ClickablePoint = ({ item, onClick, isGuessed, isDisabled }) => {
  const baseClasses = "absolute flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-in-out";
  
  const stateClasses = isGuessed
    ? "bg-green-500/70 border-2 border-green-300 scale-110"
    : "bg-transparent hover:bg-white/20";
    
  return (
    <button
      style={{ top: item.position.top, left: item.position.left }}
      className={`${baseClasses} ${stateClasses}`}
      onClick={() => onClick(item.id)}
      disabled={isDisabled || isGuessed}
      aria-label={`Plats: ${item.name}`}
    >
      {/* Number is hidden to avoid duplication with background image */}
    </button>
  );
};


// Main App Component
const App = () => {
  const [shuffledItems, setShuffledItems] = useState([]);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [guessedIds, setGuessedIds] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const [mistakes, setMistakes] = useState(0); // Track incorrect clicks

  const shuffleArray = useCallback((array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }, []);
  
  useEffect(() => {
    setShuffledItems(shuffleArray(QUIZ_DATA));
  }, [shuffleArray]);

  const handleReset = useCallback(() => {
    setShuffledItems(shuffleArray(QUIZ_DATA));
    setCurrentItemIndex(0);
    setGuessedIds([]);
    setFeedback(null);
    setGameFinished(false);
    setMistakes(0); // Reset mistakes on new game
  }, [shuffleArray]);

  const handlePointClick = useCallback((clickedId) => {
    if (gameFinished || feedback) return;

    const currentItem = shuffledItems[currentItemIndex];
    if (clickedId === currentItem.id) {
      setFeedback({ type: 'correct', message: 'Rätt!' });
      const newGuessedIds = [...guessedIds, clickedId];
      setGuessedIds(newGuessedIds);

      setTimeout(() => {
        const nextIndex = currentItemIndex + 1;
        if (nextIndex >= shuffledItems.length) {
          setGameFinished(true);
          setFeedback(null);
        } else {
          setCurrentItemIndex(nextIndex);
          setFeedback(null);
        }
      }, 1500);
    } else {
      setMistakes(prev => prev + 1); // Increment mistakes
      setFeedback({ type: 'incorrect', message: 'Fel, försök igen.' });
      setTimeout(() => {
        setFeedback(null);
      }, 1500);
    }
  }, [currentItemIndex, gameFinished, guessedIds, shuffledItems, feedback]);

  const currentItem = !gameFinished && shuffledItems.length > 0 ? shuffledItems[currentItemIndex] : null;

  const getFeedbackClasses = () => {
    if (!feedback) return "opacity-0";
    switch (feedback.type) {
      case 'correct': return "text-green-400 opacity-100";
      case 'incorrect': return "text-red-400 opacity-100";
      default: return "opacity-0";
    }
  };
  
  const getFinalFeedback = () => {
    if (mistakes === 0) {
      return {
        title: "Alla rätt!",
        comment: "Du är ju en expert på Varbergs fästning!"
      };
    } else if (mistakes <= 3) {
      return {
        title: "Snyggt jobbat!",
        comment: ""
      };
    } else {
      return {
        title: "Bra kämpat!",
        comment: "Du har lärt dig något nytt om Varbergs fästning."
      };
    }
  };

  const finalFeedback = gameFinished ? getFinalFeedback() : null;

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-slate-900">
      <main className="w-full max-w-5xl mx-auto bg-slate-800/50 backdrop-blur-lg rounded-2xl shadow-2xl p-6 md:p-8 border border-slate-700">
        <header className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Varbergs Fästning Quiz</h1>
          <p className="text-slate-400 mt-2">Identifiera platserna i bilden</p>
        </header>

        <div className="relative w-full rounded-lg overflow-hidden shadow-lg border-2 border-slate-700" style={{ aspectRatio: '1.777' }}>
          <img src={IMAGE_URL} alt="Varbergs Fästning" className="w-full h-full object-cover" />
          {QUIZ_DATA.map(item => (
            <ClickablePoint
              key={item.id}
              item={item}
              onClick={handlePointClick}
              isGuessed={guessedIds.includes(item.id)}
              isDisabled={!!feedback}
            />
          ))}
        </div>

        <footer className="mt-6 text-center">
          <div className="h-20 flex flex-col items-center justify-center bg-slate-900/70 rounded-lg p-4">
            {gameFinished && finalFeedback ? (
               <div className="text-center transition-opacity duration-500 opacity-100">
                  <p className="text-2xl font-bold text-yellow-400">{finalFeedback.title}</p>
                  {finalFeedback.comment && <p className="text-xl font-semibold text-slate-200 mt-2">{finalFeedback.comment}</p>}
               </div>
            ) : (
              <>
                <p className="text-xl md:text-2xl font-semibold text-slate-200 transition-opacity duration-300 h-8">
                  {currentItem?.question || 'Laddar...'}
                </p>
                <p className={`mt-1 text-lg font-bold transition-opacity duration-500 h-7 ${getFeedbackClasses()}`}>
                  {feedback?.message || '​'}
                </p>
              </>
            )}
          </div>
          
          <button
            onClick={handleReset}
            className="mt-6 px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75 transition-transform transform hover:scale-105"
          >
            {gameFinished ? 'Spela igen' : 'Börja om'}
          </button>
        </footer>
      </main>
    </div>
  );
};

export default App;
