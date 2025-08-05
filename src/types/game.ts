export interface Song {
  id: string;
  name: string;
  artist: string;
  preview_url: string | null;
  image_url: string;
  release_date: string;
}

export interface GameQuestion {
  correctSong: Song;
  options: Song[];
  currentDuration: number;
  maxDuration: number;
}

export interface GameState {
  selectedDecade: string | null;
  currentQuestion: GameQuestion | null;
  score: number;
  totalQuestions: number;
  isPlaying: boolean;
  showAnswer: boolean;
  gamePhase: 'decade-selection' | 'playing' | 'answer-reveal' | 'game-over';
}

export type Decade = '1980s' | '1990s' | '2000s' | '2010s';