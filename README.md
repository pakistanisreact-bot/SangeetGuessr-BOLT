# Bollywood Beat - Guess the Song Game

A beautiful music guessing game featuring Bollywood songs from two major eras (Pre-2000s and Post-2000s).

## Features

- **Era Selection**: Choose from 2 major Bollywood eras (Classic vs Modern)
- **Progressive Audio**: Listen to songs for 1s, 2s, 5s, or 15s
- **Multiple Choice**: 4 options with 1 correct answer
- **Extended Gameplay**: Play up to 50 rounds per category
- **Score Tracking**: Track your progress across all rounds
- **Responsive Design**: Works perfectly on all devices

## Setup

### Apple Music API

This game uses the iTunes Search API (Apple Music) to fetch Bollywood songs. No API key is required as it uses Apple's public search endpoint.

The service automatically searches for:
- Pre-2000s: "bollywood 90s hindi songs classic", "hindi film songs 80s 90s", etc.
- Post-2000s: "bollywood 2000s 2010s hindi songs", "modern bollywood hindi music", etc.

### Running the Game

```bash
npm install
npm run dev
```

## How to Play

1. **Choose Your Era**: Select from Pre-2000s (Classic) or Post-2000s (Modern)
2. **Listen Carefully**: Play the audio sample (starts at 1 second)
3. **Make Your Guess**: Choose from 4 song options
4. **Skip if Needed**: Jump to longer audio clips (2s, 5s, 15s)
5. **Score Points**: Get points for correct answers
6. **Play Extended Sessions**: Enjoy up to 50 rounds per category

## Technologies Used

- React 18 with TypeScript
- Tailwind CSS for styling
- iTunes Search API (Apple Music) for music data
- Vite for development and building
- Lucide React for icons

## Game Rules

- Each game can have up to 50 rounds
- Songs are randomly selected from your chosen era (Pre-2000s or Post-2000s)
- Audio clips progressively increase in length
- You can skip to longer clips at any time
- Score is tracked throughout all rounds