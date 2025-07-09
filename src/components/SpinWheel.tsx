import React, { useState, useRef, useEffect } from 'react';
import { RotateCcw, Sparkles, Trophy, Star, Crown, Gem } from 'lucide-react';

interface SpinResult {
  rarity: string;
  color: string;
  icon: React.ReactNode;
  percentage: number;
}

const rarities: SpinResult[] = [
  { rarity: 'Common', color: '#9CA3AF', icon: <Star className="w-6 h-6" />, percentage: 79.96 },
  { rarity: 'Rare', color: '#3B82F6', icon: <Sparkles className="w-6 h-6" />, percentage: 19.6 },
  { rarity: 'Epic', color: '#8B5CF6', icon: <Trophy className="w-6 h-6" />, percentage: 0.35 },
  { rarity: 'Legendary', color: '#F59E0B', icon: <Crown className="w-6 h-6" />, percentage: 0.065 },
  { rarity: 'Mythical', color: '#EF4444', icon: <Gem className="w-6 h-6" />, percentage: 0.025 }
];

export const SpinWheel: React.FC = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<SpinResult | null>(null);
  const [rotation, setRotation] = useState(0);
  const [spinCount, setSpinCount] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);

  const getRandomResult = (): SpinResult => {
    const random = Math.random() * 100;
    let cumulative = 0;
    
    for (const rarity of rarities) {
      cumulative += rarity.percentage;
      if (random <= cumulative) {
        return rarity;
      }
    }
    
    return rarities[0]; // Fallback to Common
  };

  const spin = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setResult(null);
    
    // Generate random rotation (multiple full rotations + random position)
    const baseRotation = 1440 + Math.random() * 1440; // 4-8 full rotations
    const newRotation = rotation + baseRotation;
    setRotation(newRotation);
    
    // Determine result after spin animation
    setTimeout(() => {
      const spinResult = getRandomResult();
      setResult(spinResult);
      setIsSpinning(false);
      setSpinCount(prev => prev + 1);
    }, 3000);
  };

  const resetWheel = () => {
    setRotation(0);
    setResult(null);
    setSpinCount(0);
  };

  // Create wheel segments
  const segments = [];
  let currentAngle = 0;
  
  for (let i = 0; i < rarities.length; i++) {
    const rarity = rarities[i];
    const segmentAngle = (rarity.percentage / 100) * 360;
    
    segments.push(
      <div
        key={rarity.rarity}
        className="absolute w-full h-full"
        style={{
          transform: `rotate(${currentAngle}deg)`,
          clipPath: `polygon(50% 50%, 50% 0%, ${50 + Math.tan((segmentAngle * Math.PI) / 360) * 50}% 0%)`
        }}
      >
        <div
          className="w-full h-full flex items-center justify-center"
          style={{ backgroundColor: rarity.color }}
        >
          <div className="text-white font-bold text-sm transform -rotate-90">
            {rarity.rarity}
          </div>
        </div>
      </div>
    );
    
    currentAngle += segmentAngle;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-slide-in">
      {/* Header */}
      <div className="text-center py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          🎰 Family Spin Wheel
        </h1>
        <p className="text-xl text-gray-400 mb-8">
          Test your luck and spin for different family rarities!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Spin Wheel */}
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
          <div className="flex flex-col items-center space-y-6">
            <div className="relative">
              {/* Wheel Container */}
              <div className="relative w-80 h-80 mx-auto">
                {/* Wheel */}
                <div
                  ref={wheelRef}
                  className="w-full h-full rounded-full border-4 border-gray-600 relative overflow-hidden transition-transform duration-3000 ease-out"
                  style={{ transform: `rotate(${rotation}deg)` }}
                >
                  {/* Segments */}
                  <div className="absolute inset-0">
                    {/* Common - Large segment */}
                    <div
                      className="absolute w-full h-full"
                      style={{
                        background: `conic-gradient(from 0deg, #9CA3AF 0deg, #9CA3AF ${79.96 * 3.6}deg, transparent ${79.96 * 3.6}deg)`
                      }}
                    />
                    
                    {/* Rare */}
                    <div
                      className="absolute w-full h-full"
                      style={{
                        background: `conic-gradient(from ${79.96 * 3.6}deg, #3B82F6 0deg, #3B82F6 ${19.6 * 3.6}deg, transparent ${19.6 * 3.6}deg)`
                      }}
                    />
                    
                    {/* Epic */}
                    <div
                      className="absolute w-full h-full"
                      style={{
                        background: `conic-gradient(from ${(79.96 + 19.6) * 3.6}deg, #8B5CF6 0deg, #8B5CF6 ${0.35 * 3.6}deg, transparent ${0.35 * 3.6}deg)`
                      }}
                    />
                    
                    {/* Legendary */}
                    <div
                      className="absolute w-full h-full"
                      style={{
                        background: `conic-gradient(from ${(79.96 + 19.6 + 0.35) * 3.6}deg, #F59E0B 0deg, #F59E0B ${0.065 * 3.6}deg, transparent ${0.065 * 3.6}deg)`
                      }}
                    />
                    
                    {/* Mythical */}
                    <div
                      className="absolute w-full h-full"
                      style={{
                        background: `conic-gradient(from ${(79.96 + 19.6 + 0.35 + 0.065) * 3.6}deg, #EF4444 0deg, #EF4444 ${0.025 * 3.6}deg, transparent ${0.025 * 3.6}deg)`
                      }}
                    />
                    
                    {/* Labels */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-white font-bold text-lg">COMMON</div>
                    </div>
                  </div>
                </div>
                
                {/* Pointer */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
                  <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-yellow-400"></div>
                </div>
              </div>
            </div>

            {/* Spin Button */}
            <button
              onClick={spin}
              disabled={isSpinning}
              className={`flex items-center space-x-2 px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200 transform hover:scale-105 ${
                isSpinning
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
              }`}
            >
              <RotateCcw className={`w-6 h-6 ${isSpinning ? 'animate-spin' : ''}`} />
              <span>{isSpinning ? 'Spinning...' : 'SPIN!'}</span>
            </button>

            {/* Reset Button */}
            {spinCount > 0 && (
              <button
                onClick={resetWheel}
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Reset Wheel
              </button>
            )}
          </div>
        </div>

        {/* Results and Stats */}
        <div className="space-y-6">
          {/* Current Result */}
          {result && (
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-700 animate-fade-in">
              <h3 className="text-xl font-semibold text-white mb-4 text-center">🎉 Spin Result</h3>
              <div 
                className="flex items-center justify-center space-x-4 p-6 rounded-lg"
                style={{ backgroundColor: `${result.color}20`, borderColor: result.color }}
              >
                <div style={{ color: result.color }}>
                  {result.icon}
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{result.rarity}</p>
                  <p className="text-sm text-gray-400">{result.percentage}% chance</p>
                </div>
              </div>
            </div>
          )}

          {/* Rarity Rates */}
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">📊 Drop Rates</h3>
            <div className="space-y-3">
              {rarities.map((rarity) => (
                <div key={rarity.rarity} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div style={{ color: rarity.color }}>
                      {rarity.icon}
                    </div>
                    <span className="text-white font-medium">{rarity.rarity}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold">{rarity.percentage}%</div>
                    <div className="text-xs text-gray-400">
                      1 in {Math.round(100 / rarity.percentage)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Spin Statistics */}
          {spinCount > 0 && (
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-4">📈 Your Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-800 rounded-lg">
                  <p className="text-2xl font-bold text-blue-400">{spinCount}</p>
                  <p className="text-sm text-gray-400">Total Spins</p>
                </div>
                <div className="text-center p-3 bg-gray-800 rounded-lg">
                  <p className="text-2xl font-bold text-green-400">
                    {result ? result.rarity : 'None'}
                  </p>
                  <p className="text-sm text-gray-400">Last Result</p>
                </div>
              </div>
            </div>
          )}

          {/* Tips */}
          <div className="bg-gradient-to-r from-purple-900 to-blue-900 rounded-lg p-6 border border-purple-700">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
              <span className="mr-2">💡</span>
              Spin Tips
            </h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p>• Common families are the most frequent (79.96% chance)</p>
              <p>• Mythical families are extremely rare (0.025% chance)</p>
              <p>• Each spin is independent - past results don't affect future spins</p>
              <p>• This is for entertainment purposes only</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};