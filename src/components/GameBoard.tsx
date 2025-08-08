import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, RotateCcw, Volume2 } from 'lucide-react';
import { GameQuestion, Decade } from '../types/game';

interface GameBoardProps {
  question: GameQuestion;
  decade: Decade;
  score: number;
  totalQuestions: number;
  onAnswer: (isCorrect: boolean) => void;
  onNextQuestion: () => void;
  onRestart: () => void;
  showAnswer: boolean;
}

const DURATIONS = [1, 2, 5, 15];

function getCategoryGradient(decade: string): string {
  const gradients: { [key: string]: string } = {
    'pre-2000s': 'from-purple-600 to-pink-600',
    'post-2000s': 'from-green-600 to-blue-600'
  };
  return gradients[decade] || 'from-purple-600 to-blue-600';
}

export function GameBoard({ 
  question, 
  decade, 
  score, 
  totalQuestions, 
  onAnswer, 
  onNextQuestion, 
  onRestart,
  showAnswer 
}: GameBoardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentDurationIndex, setCurrentDurationIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const currentDuration = DURATIONS[currentDurationIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
    }
    setIsPlaying(false);
    setCurrentDurationIndex(0);
    setSelectedAnswer(null);
  }, [question]);

  const playAudio = () => {
    if (!audioRef.current || !question.correctSong.preview_url) return;

    if (isPlaying) {
      audioRef.current.pause();
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
      setIsPlaying(false);
      return;
    }

    audioRef.current.currentTime = 0;
    audioRef.current.play();
    setIsPlaying(true);

    intervalRef.current = setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
    }, currentDuration * 1000);
  };

  const skipToNextDuration = () => {
    if (currentDurationIndex < DURATIONS.length - 1) {
      setCurrentDurationIndex(currentDurationIndex + 1);
      if (isPlaying) {
        setIsPlaying(false);
        if (audioRef.current) {
          audioRef.current.pause();
        }
        if (intervalRef.current) {
          clearTimeout(intervalRef.current);
        }
      }
    }
  };

  const handleAnswerSelect = (song: any) => {
    if (showAnswer || selectedAnswer) return;
    
    setSelectedAnswer(song.id);
    const isCorrect = song.id === question.correctSong.id;
    onAnswer(isCorrect);
  };

  const getAnswerButtonClass = (song: any) => {
    const baseClass = "w-full p-4 rounded-xl text-left transition-all duration-300 border-2";
    
    if (!showAnswer && !selectedAnswer) {
      return `${baseClass} border-purple-200 bg-white hover:border-purple-400 hover:shadow-lg hover:-translate-y-1 cursor-pointer`;
    }
    
    if (song.id === question.correctSong.id) {
      return `${baseClass} border-green-500 bg-green-50 text-green-800`;
    }
    
    if (selectedAnswer === song.id && song.id !== question.correctSong.id) {
      return `${baseClass} border-red-500 bg-red-50 text-red-800`;
    }
    
    return `${baseClass} border-gray-200 bg-gray-50 text-gray-500`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={onRestart}
              className="flex items-center px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors mr-4"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              New Game
            </button>
            <div className="text-white">
              <span className="text-lg font-semibold">{decade}</span>
              <span className="ml-4 text-purple-200">
                Round {totalQuestions} • Score: {score}
              </span>
            </div>
          </div>
        </div>

        {/* Main Game Area */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-6">
          {/* Album Art */}
          {/* Category Artwork */}
          <div className="text-center mb-8">
            <div className="relative inline-block w-48 h-48 mx-auto">
              <div className={`w-full h-full rounded-2xl shadow-lg bg-gradient-to-br ${getCategoryGradient(decade)} flex items-center justify-center`}>
                <div className="text-center text-white">
                  <Volume2 className="w-16 h-16 mx-auto mb-2 opacity-90" />
                  <div className="text-2xl font-bold">{decade}</div>
                  <div className="text-sm opacity-80">Bollywood</div>
                </div>
              </div>
            </div>
          </div>

          {/* Audio Controls */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-center mb-6">
              <button
                onClick={playAudio}
                disabled={!question.correctSong.preview_url}
                className="flex items-center justify-center w-16 h-16 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mr-4"
              >
                {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
              </button>
              
              <div className="flex-1 max-w-md">
                <div className="text-center mb-2">
                  <span className="text-lg font-semibold text-gray-800">
                    Listen for {currentDuration} second{currentDuration !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  {DURATIONS.map((duration, index) => (
                    <div
                      key={duration}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        index <= currentDurationIndex
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {duration}s
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={skipToNextDuration}
                disabled={currentDurationIndex >= DURATIONS.length - 1}
                className="flex items-center justify-center w-12 h-12 bg-gray-200 text-gray-600 rounded-full hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ml-4"
              >
                <SkipForward className="w-6 h-6" />
              </button>
            </div>

            {!question.correctSong.preview_url && (
              <div className="text-center py-4">
                <p className="text-gray-600">
                  Audio preview not available for this song
                </p>
              </div>
            )}
          </div>

          {/* Question */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Which song is this?
            </h2>
            <p className="text-gray-600">
              Choose the correct song from {decade === 'pre-2000s' ? 'Classic' : 'Modern'} Bollywood era
            </p>
          </div>

          {/* Answer Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {question.options.map((song) => (
              <button
                key={song.id}
                onClick={() => handleAnswerSelect(song)}
                disabled={showAnswer || selectedAnswer !== null}
                className={getAnswerButtonClass(song)}
              >
                <div className="flex items-center">
                  <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center mr-4 flex-shrink-0">
                    <Volume2 className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <h4 className="font-semibold text-lg mb-1">
                      {song.name}
                    </h4>
                    <p className="text-sm opacity-75">
                      {song.artist}
                    </p>
                  </div>
                  {showAnswer && song.id === question.correctSong.id && (
                    <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center">
                      ✓
                    </div>
                  )}
                  {selectedAnswer === song.id && song.id !== question.correctSong.id && (
                    <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center">
                      ✗
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Next Question Button */}
          {showAnswer && (
            <div className="text-center">
              <button
                onClick={onNextQuestion}
                className="px-8 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors"
              >
                Next Question
              </button>
            </div>
          )}
        </div>

        {/* Audio Element */}
        <audio
          ref={audioRef}
          preload="metadata"
          className="hidden"
        >
          {question.correctSong.preview_url && (
            <source src={question.correctSong.preview_url} type="audio/mpeg" />
          )}
        </audio>
      </div>
    </div>
  );
}