import { useState, useCallback } from 'react';
import { GameState, GameQuestion, Song, Decade } from '../types/game';
import { appleMusicService } from '../services/appleMusic';

const QUESTIONS_PER_GAME = 5;

export function useGame() {
  const [gameState, setGameState] = useState<GameState>({
    selectedDecade: null,
    currentQuestion: null,
    score: 0,
    totalQuestions: 0,
    isPlaying: false,
    showAnswer: false,
    gamePhase: 'decade-selection'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createQuestion = useCallback(async (songs: Song[]): Promise<GameQuestion> => {
    const correctSong = songs[Math.floor(Math.random() * songs.length)];
    const otherSongs = songs.filter(song => song.id !== correctSong.id);
    const incorrectOptions = otherSongs
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    
    const options = [correctSong, ...incorrectOptions]
      .sort(() => 0.5 - Math.random());

    return {
      correctSong,
      options,
      currentDuration: 1,
      maxDuration: 15
    };
  }, []);

  const startGame = useCallback(async (decade: Decade) => {
    setIsLoading(true);
    setError(null);
    
    // Clear previously used songs for fresh game
    appleMusicService.clearUsedSongs();
    
    try {
      const appleMusicTracks = await appleMusicService.getRandomSongs(decade, 12);
      
      if (appleMusicTracks.length < 4) {
        throw new Error(`Sorry, we couldn't find enough Bollywood songs for the ${decade}. Please try a different decade or check your internet connection.`);
      }

      const songs: Song[] = appleMusicTracks.map(track => ({
        id: track.trackId.toString(),
        name: track.trackName,
        artist: track.artistName || 'Unknown Artist',
        preview_url: track.previewUrl,
        image_url: track.artworkUrl100 || track.artworkUrl60 || '',
        release_date: track.releaseDate
      }));

      const firstQuestion = await createQuestion(songs);

      setGameState({
        selectedDecade: decade,
        currentQuestion: firstQuestion,
        score: 0,
        totalQuestions: 1,
        isPlaying: false,
        showAnswer: false,
        gamePhase: 'playing'
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load songs');
    } finally {
      setIsLoading(false);
    }
  }, [createQuestion]);

  const nextQuestion = useCallback(async () => {
    if (!gameState.selectedDecade || gameState.totalQuestions >= QUESTIONS_PER_GAME) {
      setGameState(prev => ({ ...prev, gamePhase: 'game-over' }));
      return;
    }

    setIsLoading(true);
    
    try {
      const appleMusicTracks = await appleMusicService.getRandomSongs(gameState.selectedDecade, 12);
      const songs: Song[] = appleMusicTracks.map(track => ({
        id: track.trackId.toString(),
        name: track.trackName,
        artist: track.artistName || 'Unknown Artist',
        preview_url: track.previewUrl,
        image_url: track.artworkUrl100 || track.artworkUrl60 || '',
        release_date: track.releaseDate
      }));

      const question = await createQuestion(songs);

      setGameState(prev => ({
        ...prev,
        currentQuestion: question,
        totalQuestions: prev.totalQuestions + 1,
        showAnswer: false,
        gamePhase: 'playing'
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load the next question. Please check your internet connection and try again.');
    } finally {
      setIsLoading(false);
    }
  }, [gameState.selectedDecade, gameState.totalQuestions, createQuestion]);

  const submitAnswer = useCallback((isCorrect: boolean) => {
    setGameState(prev => ({
      ...prev,
      score: isCorrect ? prev.score + 1 : prev.score,
      showAnswer: true,
      gamePhase: 'answer-reveal'
    }));
  }, []);

  const restartGame = useCallback(() => {
    setGameState({
      selectedDecade: null,
      currentQuestion: null,
      score: 0,
      totalQuestions: 0,
      isPlaying: false,
      showAnswer: false,
      gamePhase: 'decade-selection'
    });
    setError(null);
  }, []);

  return {
    gameState,
    isLoading,
    error,
    startGame,
    nextQuestion,
    submitAnswer,
    restartGame
  };
}