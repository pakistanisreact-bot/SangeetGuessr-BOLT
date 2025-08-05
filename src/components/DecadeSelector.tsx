import React from 'react';
import { Music, Calendar } from 'lucide-react';
import { Decade } from '../types/game';

interface DecadeSelectorProps {
  onDecadeSelect: (decade: Decade) => void;
}

const decades: { value: Decade; label: string; description: string; gradient: string }[] = [
  {
    value: '1980s',
    label: '1980s',
    description: 'Classic Bollywood Era',
    gradient: 'from-purple-600 to-pink-600'
  },
  {
    value: '1990s', 
    label: '1990s',
    description: 'Golden Romance Period',
    gradient: 'from-blue-600 to-purple-600'
  },
  {
    value: '2000s',
    label: '2000s', 
    description: 'Modern Bollywood',
    gradient: 'from-green-600 to-blue-600'
  },
  {
    value: '2010s',
    label: '2010s',
    description: 'Contemporary Hits',
    gradient: 'from-orange-600 to-red-600'
  }
];

export function DecadeSelector({ onDecadeSelect }: DecadeSelectorProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Music className="w-12 h-12 text-yellow-400 mr-3" />
            <h1 className="text-5xl font-bold text-white tracking-tight">
              Bollywood Beat
            </h1>
          </div>
          <p className="text-xl text-purple-200 max-w-2xl mx-auto leading-relaxed">
            Test your knowledge of Bollywood music across the decades. Choose your era and guess the song!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {decades.map((decade) => (
            <button
              key={decade.value}
              onClick={() => onDecadeSelect(decade.value)}
              className={`group relative overflow-hidden rounded-2xl p-8 text-left transition-all duration-300 hover:scale-105 hover:shadow-2xl bg-gradient-to-br ${decade.gradient}`}
            >
              <div className="relative z-10">
                <div className="flex items-center mb-4">
                  <Calendar className="w-8 h-8 text-white mr-3" />
                  <h3 className="text-3xl font-bold text-white">
                    {decade.label}
                  </h3>
                </div>
                <p className="text-lg text-white/90 mb-4">
                  {decade.description}
                </p>
                <div className="flex items-center text-white/80">
                  <Music className="w-5 h-5 mr-2" />
                  <span className="text-sm font-medium">
                    Classic hits from the {decade.label}
                  </span>
                </div>
              </div>
              
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500" />
            </button>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-purple-300">
            Powered by Apple Music • Experience the magic of Bollywood music
          </p>
        </div>
      </div>
    </div>
  );
}