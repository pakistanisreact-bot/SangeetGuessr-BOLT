import React from 'react';
import { Trophy, RotateCcw, Music } from 'lucide-react';
import { Decade } from '../types/game';

interface GameOverProps {
  score: number;
  questionsAnswered: number;
  decade: Decade;
  onRestart: () => void;
  onNewDecade: () => void;
}

export function GameOver({ score, questionsAnswered, decade, onRestart, onNewDecade }: GameOverProps) {
  const percentage = questionsAnswered > 0 ? Math.round((score / questionsAnswered) * 100) : 0;
  
  const getScoreMessage = () => {
    if (score >= 20) return "Bollywood Legend! 🏆";
    if (score >= 10) return "Music Master! 🎵";
    if (score >= 5) return "Good Run! 🎶";
    if (score >= 1) return "Nice Try! 🎤";
    return "Better Luck Next Time! 🎵";
  };

  const getScoreColor = () => {
    if (score >= 20) return "text-yellow-600";
    if (score >= 10) return "text-green-600";
    if (score >= 5) return "text-blue-600";
    return "text-purple-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
          <div className="mb-6">
            <Trophy className={`w-20 h-20 mx-auto mb-4 ${getScoreColor()}`} />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Game Complete!
            </h1>
            <p className={`text-xl font-semibold ${getScoreColor()}`}>
              {getScoreMessage()}
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6 mb-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-800 mb-2">
                {score} Correct
              </div>
              <div className="text-lg text-gray-600 mb-1">
                Out of {questionsAnswered} Questions
              </div>
              {questionsAnswered > 0 && (
                <div className="text-sm text-gray-500 mb-2">
                  {percentage}% Success Rate
                </div>
              )}
              <div className="text-sm text-gray-500">
                {decade} Bollywood Songs
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={onRestart}
              className="w-full flex items-center justify-center px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Play {decade} Again
            </button>
            
            <button
              onClick={onNewDecade}
              className="w-full flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-800 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            >
              <Music className="w-5 h-5 mr-2" />
              Choose Different Era
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}