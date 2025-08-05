import { useState, useCallback } from 'react';
import { GameState, GameQuestion, Song, Decade } from '../types/game';
import { appleMusicService } from '../services/appleMusic';

const SONGS_PER_BATCH = 50;
const RELOAD_THRESHOLD = 45; // Reload when 45 songs have been used

export function useGame() {
  const [gameState, setGameState] = useState<GameState>({
    selectedDecade: null,
    currentQuestion: null,
    score: 0,
    questionsAnswered: 0,
    isPlaying: false,
    showAnswer: false,
    gamePhase: 'decade-selection',
    usedSongIds: new Set(),
    availableSongs: [],
    consecutiveCorrect: 0,
    totalCorrect: 0,
    totalAttempted: 0
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

  const loadMoreSongs = useCallback(async (decade: Decade, excludeIds: Set<string>): Promise<Song[]> => {
    const appleMusicTracks = await appleMusicService.getRandomSongs(decade, SONGS_PER_BATCH, excludeIds);
    
    if (appleMusicTracks.length < 10) {
      throw new Error(`Sorry, we couldn't find enough new Bollywood songs for the ${decade}. You've played most of the available songs!`);
    }

    return appleMusicTracks.map(track => ({
      id: track.trackId.toString(),
      name: track.trackName,
      artist: track.artistName || 'Unknown Artist',
      preview_url: track.previewUrl,
      image_url: track.artworkUrl100 || track.artworkUrl60 || '',
      release_date: track.releaseDate
    }));
  }, []);

  const startGame = useCallback(async (decade: Decade) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Clear cache to ensure fresh songs
      appleMusicService.clearCache();
      
      const songs = await loadMoreSongs(decade, new Set());
      const firstQuestion = await createQuestion(songs.slice(0, 12));

      const usedIds = new Set([firstQuestion.correctSong.id, ...firstQuestion.options.map(s => s.id)]);

      setGameState({
        selectedDecade: decade,
        currentQuestion: firstQuestion,
        score: 0,
        questionsAnswered: 1,
        isPlaying: false,
        showAnswer: false,
        gamePhase: 'playing',
        usedSongIds: usedIds,
        availableSongs: songs,
        consecutiveCorrect: 0,
        totalCorrect: 0,
        totalAttempted: 0
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load songs');
    } finally {
      setIsLoading(false);
    }
  }, [createQuestion, loadMoreSongs]);

  const nextQuestion = useCallback(async () => {
    if (!gameState.selectedDecade) {
      return;
    }

    setIsLoading(true);
    
    try {
      let availableSongs = gameState.availableSongs;
      let usedSongIds = new Set(gameState.usedSongIds);

      // Check if we need to load more songs
      if (usedSongIds.size >= RELOAD_THRESHOLD) {
        console.log('Loading more songs...');
        const newSongs = await loadMoreSongs(gameState.selectedDecade, usedSongIds);
        availableSongs = [...availableSongs, ...newSongs];
      }

      // Get unused songs for the question
      const unusedSongs = availableSongs.filter(song => !usedSongIds.has(song.id));
      
      if (unusedSongs.length < 4) {
        throw new Error('No more unique songs available. You\'ve mastered this decade!');
      }

      const question = await createQuestion(unusedSongs.slice(0, 12));
      
      // Mark these songs as used
      question.options.forEach(song => usedSongIds.add(song.id));

      setGameState(prev => ({
        ...prev,
        currentQuestion: question,
        questionsAnswered: prev.questionsAnswered + 1,
        showAnswer: false,
        gamePhase: 'playing',
        usedSongIds: usedSongIds,
        availableSongs: availableSongs
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load the next question. Please check your internet connection and try again.');
    } finally {
      setIsLoading(false);
    }
  }, [gameState.selectedDecade, gameState.availableSongs, gameState.usedSongIds, createQuestion, loadMoreSongs]);

  const submitAnswer = useCallback((isCorrect: boolean) => {
    setGameState(prev => ({
      ...prev,
      score: isCorrect ? prev.score + 1 : prev.score,
      consecutiveCorrect: isCorrect ? prev.consecutiveCorrect + 1 : 0,
      totalCorrect: isCorrect ? prev.totalCorrect + 1 : prev.totalCorrect,
      totalAttempted: prev.totalAttempted + 1,
      showAnswer: true,
      gamePhase: isCorrect ? 'answer-reveal' : 'game-over'
    }));
  }, []);

  const restartGame = useCallback(() => {
    appleMusicService.clearCache();
    setGameState({
      selectedDecade: null,
      currentQuestion: null,
      score: 0,
      questionsAnswered: 0,
      isPlaying: false,
      showAnswer: false,
      gamePhase: 'decade-selection',
      usedSongIds: new Set(),
      availableSongs: [],
      consecutiveCorrect: 0,
      totalCorrect: 0,
      totalAttempted: 0
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