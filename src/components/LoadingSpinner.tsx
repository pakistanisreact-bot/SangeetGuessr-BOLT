import React from 'react';
import { Music } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
}

export function LoadingSpinner({ message = "Loading songs..." }: LoadingSpinnerProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="relative mb-8">
          <Music className="w-16 h-16 text-yellow-400 mx-auto animate-bounce" />
          <div className="absolute inset-0 w-16 h-16 mx-auto border-4 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">
          {message}
        </h2>
        <p className="text-purple-200">
          Preparing your Bollywood music challenge...
        </p>
      </div>
    </div>
  );
}