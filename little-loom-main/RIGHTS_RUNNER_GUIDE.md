# 🏃 Rights Runner - Subway Surfer Style Game

## 🎮 Game Overview

**Rights Runner** is an endless runner game inspired by Subway Surfer, where players:
- 🦸 Control a hero character
- 📚 Collect rights symbols (Education, Health, Protection, Play, Food)
- ⚠️ Avoid obstacles (violations)
- 🏆 Earn points and build combos
- 📈 Progress through increasing difficulty

## 🎯 Game Features

### Core Mechanics
- **3-Lane System**: Move left/right between 3 lanes
- **Endless Runner**: Game continues until collision
- **Progressive Speed**: Speed increases with distance
- **Combo System**: Collect multiple rights for bonus points
- **Score Tracking**: Points saved to user profile

### Collectibles
- 📚 **Education** (10 points) - Books symbol
- 🏥 **Health** (10 points) - Hospital symbol  
- 🛡️ **Protection** (15 points) - Shield symbol
- ⚽ **Play** (5 points) - Ball symbol
- 🍎 **Food** (8 points) - Apple symbol

### Controls
- **Desktop**: Arrow Keys (← →) or A/D keys
- **Mobile**: On-screen buttons
- **Pause**: Spacebar or pause button

## 🎨 Visual Design

- Animated hero character (🦸)
- Rotating collectible icons
- Lane markers for guidance
- Smooth animations with Framer Motion
- Confetti on high scores
- Real-time score display

## 📊 Scoring System

- **Base Points**: Each collectible has base points
- **Combo Bonus**: +10% per combo level
- **Distance Bonus**: Speed increases with distance
- **High Score**: Tracks best performance
- **Profile Points**: Score/10 converted to profile points

## 🚀 How to Play

1. Click "Start Game"
2. Use arrow keys or A/D to move left/right
3. Collect rights symbols (📚🏥🛡️⚽🍎)
4. Avoid obstacles (⚠️)
5. Build combos for bonus points
6. Survive as long as possible!

## 🔧 Technical Details

### Game Loop
- Uses `requestAnimationFrame` for smooth 60fps gameplay
- Delta time calculation for consistent speed
- Collision detection using distance formula

### State Management
- React hooks for game state
- Real-time updates for collectibles and obstacles
- Automatic spawning based on speed

### Performance
- Efficient rendering with React components
- Optimized collision detection
- Smooth animations with Framer Motion

## 🎯 Future Enhancements

Potential additions:
- Jump mechanic (up arrow)
- Power-ups (shield, magnet, speed boost)
- Different hero characters
- Multiple difficulty levels
- Daily challenges
- Leaderboard integration
- Sound effects
- Background music
- Particle effects on collection

## 📱 Mobile Support

- Touch controls with on-screen buttons
- Responsive design
- Optimized for mobile screens

## 🎉 Enjoy the Game!

Have fun collecting rights and setting new high scores! 🏆

