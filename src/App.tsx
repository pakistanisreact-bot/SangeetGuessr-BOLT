import React from 'react';
import { DecadeSelector } from './components/DecadeSelector';
import { GameBoard } from './components/GameBoard';
import { GameOver } from './components/GameOver';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { useGame } from './hooks/useGame';

function App() {
  const { gameState, isLoading, error, startGame, nextQuestion, submitAnswer, restartGame } = useGame();

  if (error) {
    return <ErrorMessage message={error} onRetry={restartGame} />;
  }

  if (isLoading) {
    return <LoadingSpinner message="Loading Bollywood hits..." />;
  }

  switch (gameState.gamePhase) {
    case 'decade-selection':
      return <DecadeSelector onDecadeSelect={startGame} />;
    
    case 'playing':
    case 'answer-reveal':
      if (!gameState.currentQuestion || !gameState.selectedDecade) {
        return <LoadingSpinner />;
      }
      
      return (
        <GameBoard
          question={gameState.currentQuestion}
          decade={gameState.selectedDecade}
          score={gameState.score}
          totalQuestions={gameState.totalQuestions}
          onAnswer={submitAnswer}
          onNextQuestion={nextQuestion}
          onRestart={restartGame}
          showAnswer={gameState.showAnswer}
        />
      );
    
    case 'game-over':
      if (!gameState.selectedDecade) {
        return <LoadingSpinner />;
      }
      
      return (
        <GameOver
          score={gameState.score}
          totalQuestions={gameState.totalQuestions}
          decade={gameState.selectedDecade}
          onRestart={() => startGame(gameState.selectedDecade!)}
          onNewDecade={restartGame}
        />
      );
    
    default:
      return <LoadingSpinner />;
  }
}

export default App;