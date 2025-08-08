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

export type Decade = 'pre-2000s' | 'post-2000s';