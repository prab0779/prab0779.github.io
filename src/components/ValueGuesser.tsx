import React, { useState, useEffect, useMemo } from 'react';
import { RefreshCw, Trophy, Target, Clock, CheckCircle, XCircle, SkipForward } from 'lucide-react';
import { Item } from '../types/Item';

interface ValueGuesserProps {
  items: Item[];
}

interface GameStats {
  correct: number;
  total: number;
  streak: number;
  bestStreak: number;
}

interface GuessResult {
  isCorrect: boolean;
  userGuess: number;
  actualValue: number;
  difference: number;
  accuracy: number;
}

export const ValueGuesser: React.FC<ValueGuesserProps> = ({ items }) => {
  const [currentItem, setCurrentItem] = useState<Item | null>(null);
  const [userGuess, setUserGuess] = useState<string>('');
  const [gameStats, setGameStats] = useState<GameStats>({ correct: 0, total: 0, streak: 0, bestStreak: 0 });
  const [lastResult, setLastResult] = useState<GuessResult | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [usedItems, setUsedItems] = useState<Set<string>>(new Set());
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [gameMode, setGameMode] = useState<'casual' | 'timed'>('casual');
  const [isGameActive, setIsGameActive] = useState(false);

  // Filter out items without proper values for the game
  const gameItems = useMemo(() => {
    return items.filter(item => item.value > 0 && item.name && item.emoji);
  }, [items]);

  // Timer effect for timed mode
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (gameMode === 'timed' && timeLeft !== null && timeLeft > 0 && isGameActive && !showResult) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev === null || prev <= 1) {
            // Time's up - auto submit
            handleSubmitGuess(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timeLeft, gameMode, isGameActive, showResult]);

  const getRandomItem = () => {
    if (gameItems.length === 0) return null;
    
    // If we've used all items, reset the used items set
    if (usedItems.size >= gameItems.length) {
      setUsedItems(new Set());
    }
    
    // Get items that haven't been used yet
    const availableItems = gameItems.filter(item => !usedItems.has(item.id));
    const itemsToChooseFrom = availableItems.length > 0 ? availableItems : gameItems;
    
    const randomIndex = Math.floor(Math.random() * itemsToChooseFrom.length);
    return itemsToChooseFrom[randomIndex];
  };

  const startNewRound = () => {
    const newItem = getRandomItem();
    setCurrentItem(newItem);
    setUserGuess('');
    setShowResult(false);
    setLastResult(null);
    
    if (gameMode === 'timed') {
      setTimeLeft(15); // 15 seconds per question
    }
    
    if (newItem) {
      setUsedItems(prev => new Set([...prev, newItem.id]));
    }
  };

  const startGame = (mode: 'casual' | 'timed') => {
    setGameMode(mode);
    setIsGameActive(true);
    setGameStats({ correct: 0, total: 0, streak: 0, bestStreak: 0 });
    setUsedItems(new Set());
    startNewRound();
  };

  const handleSubmitGuess = (timeUp: boolean = false) => {
    if (!currentItem || showResult) return;
    
    const guess = timeUp ? 0 : parseInt(userGuess) || 0;
    const actualValue = currentItem.value;
    const difference = Math.abs(guess - actualValue);
    const accuracy = Math.max(0, 100 - (difference / actualValue) * 100);
    
    // Consider it correct if within 10% of actual value
    const isCorrect = accuracy >= 90;
    
    const result: GuessResult = {
      isCorrect,
      userGuess: guess,
      actualValue,
      difference,
      accuracy
    };
    
    setLastResult(result);
    setShowResult(true);
    
    // Update stats
    setGameStats(prev => {
      const newStreak = isCorrect ? prev.streak + 1 : 0;
      return {
        correct: prev.correct + (isCorrect ? 1 : 0),
        total: prev.total + 1,
        streak: newStreak,
        bestStreak: Math.max(prev.bestStreak, newStreak)
      };
    });
  };

  const renderItemIcon = (emoji: string, itemName: string) => {
    if (!emoji || typeof emoji !== 'string') {
      return <span className="text-8xl">👹</span>;
    }
    
    if (emoji.startsWith('/')) {
      return (
        <div className="w-32 h-32 flex items-center justify-center">
          <img 
            src={emoji} 
            alt={itemName}
            className="w-32 h-32 object-contain pixelated"
            style={{ imageRendering: 'pixelated' }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const fallback = target.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = 'block';
            }}
          />
          <span className="text-8xl hidden">👹</span>
        </div>
      );
    }
    return <span className="text-8xl">{emoji}</span>;
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 90) return 'text-green-400';
    if (accuracy >= 70) return 'text-yellow-400';
    if (accuracy >= 50) return 'text-orange-400';
    return 'text-red-400';
  };

  const getAccuracyMessage = (accuracy: number) => {
    if (accuracy >= 95) return '🎯 Perfect! Amazing guess!';
    if (accuracy >= 90) return '✨ Excellent! Very close!';
    if (accuracy >= 70) return '👍 Good guess!';
    if (accuracy >= 50) return '🤔 Not bad, but could be better';
    return '💭 Keep practicing!';
  };

  if (!isGameActive) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-slide-in">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Value Guesser
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Test your knowledge of AOTR item values!
          </p>
        </div>

        {/* Game Mode Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div 
            onClick={() => startGame('casual')}
            className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl p-8 border border-blue-700 cursor-pointer hover:from-blue-800 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
          >
            <div className="text-center">
              <div className="text-4xl mb-4">🎮</div>
              <h3 className="text-xl font-bold text-white mb-3">Casual Mode</h3>
              <p className="text-blue-200 mb-4">
                Take your time to guess item values. No pressure, just fun!
              </p>
              <ul className="text-sm text-blue-300 space-y-1">
                <li>• No time limit</li>
                <li>• Learn at your own pace</li>
                <li>• Perfect for beginners</li>
              </ul>
            </div>
          </div>

          <div 
            onClick={() => startGame('timed')}
            className="bg-gradient-to-br from-red-900 to-red-800 rounded-xl p-8 border border-red-700 cursor-pointer hover:from-red-800 hover:to-red-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
          >
            <div className="text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-white mb-3">Timed Challenge</h3>
              <p className="text-red-200 mb-4">
                15 seconds per item. Quick thinking required!
              </p>
              <ul className="text-sm text-red-300 space-y-1">
                <li>• 15 seconds per guess</li>
                <li>• Test your expertise</li>
                <li>• Competitive scoring</li>
              </ul>
            </div>
          </div>
        </div>

        {/* How to Play */}
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <span className="mr-2">📖</span>
            How to Play
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
            <div>
              <p className="mb-2">1. 🖼️ Look at the item image and name</p>
              <p className="mb-2">2. 💭 Guess its value in keys</p>
              <p className="mb-2">3. ✅ Submit your guess</p>
            </div>
            <div>
              <p className="mb-2">4. 📊 See how close you were</p>
              <p className="mb-2">5. 🏆 Build your streak</p>
              <p className="mb-2">6. 🎯 Become a value expert!</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentItem) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="text-6xl mb-4">⚠️</div>
        <h3 className="text-xl font-semibold text-gray-300 mb-2">No items available</h3>
        <p className="text-gray-500">Please check back later when items are loaded</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-slide-in">
      {/* Game Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-gray-900 rounded-lg p-4 border border-gray-700">
        <div className="flex items-center space-x-4 mb-4 sm:mb-0">
          <div className="text-2xl">🎯</div>
          <div>
            <h1 className="text-xl font-bold text-white">Value Guesser</h1>
            <p className="text-sm text-gray-400">{gameMode === 'timed' ? 'Timed Challenge' : 'Casual Mode'}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          {gameMode === 'timed' && timeLeft !== null && (
            <div className={`flex items-center space-x-2 ${timeLeft <= 5 ? 'text-red-400' : 'text-white'}`}>
              <Clock className="w-5 h-5" />
              <span className="text-xl font-bold">{timeLeft}s</span>
            </div>
          )}
          
          <div className="text-center">
            <p className="text-sm text-gray-400">Score</p>
            <p className="text-lg font-bold text-white">{gameStats.correct}/{gameStats.total}</p>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-400">Streak</p>
            <p className="text-lg font-bold text-yellow-400">{gameStats.streak}</p>
          </div>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Item Display */}
        <div className="lg:col-span-2">
          <div className="bg-gray-900 rounded-xl p-8 border border-gray-700 text-center">
            <h2 className="text-lg font-semibold text-white mb-6">Guess the value of this item:</h2>
            
            {/* Item Card */}
            <div className="bg-gray-800 rounded-xl p-8 border border-gray-600 inline-block min-w-[300px]">
              <div className="mb-6 flex items-center justify-center h-32">
                {renderItemIcon(currentItem.emoji, currentItem.name)}
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 text-center">{currentItem.name}</h3>
              <p className="text-gray-400 text-center text-lg">{currentItem.category}</p>
            </div>

            {/* Guess Input */}
            {!showResult && (
              <div className="mt-8 space-y-6">
                {/* Value Slider */}
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-600">
                  <div className="text-center mb-4">
                    <p className="text-gray-400 text-sm mb-2">Drag the slider or type your guess</p>
                    <div className="flex items-center justify-center space-x-3">
                      <span className="text-2xl">🔑</span>
                      <span className="text-3xl font-bold text-blue-400">{userGuess || '0'}</span>
                      <span className="text-gray-400 text-lg">keys</span>
                    </div>
                  </div>
                  
                  {/* Custom Slider */}
                  <div className="space-y-4">
                    <input
                      type="range"
                      min="1"
                      max="10000"
                      value={userGuess || '1'}
                      onChange={(e) => setUserGuess(e.target.value)}
                      className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${((parseInt(userGuess) || 1) / 10000) * 100}%, #374151 ${((parseInt(userGuess) || 1) / 10000) * 100}%, #374151 100%)`
                      }}
                    />
                    
                    {/* Quick Value Buttons */}
                    <div className="grid grid-cols-5 gap-2">
                      {[10, 50, 100, 500, 1000].map(value => (
                        <button
                          key={value}
                          onClick={() => setUserGuess(value.toString())}
                          className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                    
                    {/* Manual Input */}
                    <div className="flex items-center justify-center">
                      <input
                        type="number"
                        min="1"
                        max="100000"
                        value={userGuess}
                        onChange={(e) => setUserGuess(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSubmitGuess()}
                        placeholder="Type exact value..."
                        className="w-48 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-center font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center space-x-3">
                  <button
                    onClick={() => handleSubmitGuess()}
                    disabled={!userGuess || parseInt(userGuess) <= 0}
                    className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 transform hover:scale-105 font-medium"
                  >
                    <Target className="w-5 h-5" />
                    <span>Submit Guess</span>
                  </button>
                  
                  <button
                    onClick={startNewRound}
                    className="flex items-center space-x-2 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all duration-200"
                  >
                    <SkipForward className="w-5 h-5" />
                    <span>Skip</span>
                  </button>
                </div>
              </div>
            )}

            {/* Result Display */}
            {showResult && lastResult && (
              <div className="mt-8 space-y-4 animate-fade-in">
                <div className={`p-6 rounded-lg border-2 ${
                  lastResult.isCorrect 
                    ? 'bg-green-900 bg-opacity-30 border-green-500' 
                    : 'bg-red-900 bg-opacity-30 border-red-500'
                }`}>
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    {lastResult.isCorrect ? (
                      <CheckCircle className="w-8 h-8 text-green-400" />
                    ) : (
                      <XCircle className="w-8 h-8 text-red-400" />
                    )}
                    <span className={`text-xl font-bold ${lastResult.isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                      {lastResult.isCorrect ? 'Correct!' : 'Incorrect'}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-white">
                    <p>Your guess: <span className="font-bold text-blue-400">🔑 {lastResult.userGuess}</span></p>
                    <p>Actual value: <span className="font-bold text-yellow-400">🔑 {lastResult.actualValue}</span></p>
                    <p>Difference: <span className="font-bold text-gray-300">🔑 {lastResult.difference}</span></p>
                    <p>Accuracy: <span className={`font-bold ${getAccuracyColor(lastResult.accuracy)}`}>
                      {lastResult.accuracy.toFixed(1)}%
                    </span></p>
                  </div>
                  
                  <p className={`mt-3 font-medium ${getAccuracyColor(lastResult.accuracy)}`}>
                    {getAccuracyMessage(lastResult.accuracy)}
                  </p>
                </div>
                
                <button
                  onClick={startNewRound}
                  className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 transform hover:scale-105 font-medium mx-auto"
                >
                  <RefreshCw className="w-5 h-5" />
                  <span>Next Item</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Stats Sidebar */}
        <div className="space-y-6">
          {/* Current Stats */}
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
              Game Stats
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Accuracy:</span>
                <span className="text-white font-bold">
                  {gameStats.total > 0 ? `${((gameStats.correct / gameStats.total) * 100).toFixed(1)}%` : '0%'}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Current Streak:</span>
                <span className="text-yellow-400 font-bold">{gameStats.streak}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Best Streak:</span>
                <span className="text-green-400 font-bold">{gameStats.bestStreak}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Questions:</span>
                <span className="text-white font-bold">{gameStats.total}</span>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-gradient-to-br from-purple-900 to-blue-900 rounded-lg p-6 border border-purple-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <span className="mr-2">💡</span>
              Pro Tips
            </h3>
            <div className="space-y-2 text-sm text-purple-200">
              <p>• Consider item rarity and demand</p>
              <p>• Limited items are usually more valuable</p>
              <p>• Check the item category for clues</p>
              <p>• Practice makes perfect!</p>
            </div>
          </div>

          {/* Difficulty Levels */}
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">🎯 Accuracy Levels</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-green-400">Expert (90%+)</span>
                <span className="text-green-400">🎯</span>
              </div>
              <div className="flex justify-between">
                <span className="text-yellow-400">Good (70-89%)</span>
                <span className="text-yellow-400">👍</span>
              </div>
              <div className="flex justify-between">
                <span className="text-orange-400">Fair (50-69%)</span>
                <span className="text-orange-400">🤔</span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-400">Needs Practice (&lt;50%)</span>
                <span className="text-red-400">💭</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
