# Bollywood Beat - Guess the Song Game

A beautiful music guessing game featuring Bollywood songs from different decades (1980s, 1990s, 2000s, 2010s).

## Features

- **Decade Selection**: Choose from 4 different Bollywood eras
- **Progressive Audio**: Listen to songs for 1s, 2s, 5s, or 15s
- **Multiple Choice**: 4 options with 1 correct answer
- **Score Tracking**: Track your progress across questions
- **Responsive Design**: Works perfectly on all devices

## Setup

### Apple Music API

This game uses the iTunes Search API (Apple Music) to fetch Bollywood songs. No API key is required as it uses Apple's public search endpoint.

The service automatically searches for:
- 1980s: "best of 80s bollywood hindi"
- 1990s: "best of 90s bollywood hindi" 
- 2000s: "best of 2000s bollywood hindi"
- 2010s: "best of 2010s bollywood hindi"

### Running the Game

```bash
npm install
npm run dev
```

## How to Play

1. **Choose Your Era**: Select from 1980s, 1990s, 2000s, or 2010s
2. **Listen Carefully**: Play the audio sample (starts at 1 second)
3. **Make Your Guess**: Choose from 4 song options
4. **Skip if Needed**: Jump to longer audio clips (2s, 5s, 15s)
5. **Score Points**: Get points for correct answers
6. **Complete the Game**: Answer 5 questions to finish

## Technologies Used

- React 18 with TypeScript
- Tailwind CSS for styling
- iTunes Search API (Apple Music) for music data
- Vite for development and building
- Lucide React for icons

## Game Rules

- Each game consists of 5 questions
- Songs are randomly selected from your chosen decade
- Audio clips progressively increase in length
- You can skip to longer clips at any time
- Score is tracked throughout the game