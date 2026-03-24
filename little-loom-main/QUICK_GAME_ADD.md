# 🎮 Quick Guide: Adding a New Game

## ✅ What's Already Done

I've created a complete example game (**Rights Quiz Challenge**) and integrated it into your app!

## 📋 Steps to Add Your Own Game

### 1. Create Your Game Component

Copy `src/pages/games/GAME_TEMPLATE.tsx` and customize it:

```bash
# Copy the template
cp src/pages/games/GAME_TEMPLATE.tsx src/pages/games/YourGameName.tsx
```

### 2. Add Route (3 lines)

Edit `src/App.tsx`:

```typescript
// Add import
import YourGameName from "./pages/games/YourGameName";

// Add route
<Route path="/games/your-game" element={<DashboardLayout><YourGameName /></DashboardLayout>} />
```

### 3. Register in Games Hub (1 object)

Edit `src/pages/GamesHub.tsx`:

Add to `allGames` array:
```typescript
{
  id: 'your-game',
  title: 'Your Game Title',
  titleHi: 'आपका गेम',
  description: 'Description...',
  descriptionHi: 'विवरण...',
  icon: YourIcon, // from lucide-react
  color: 'from-primary to-accent',
  bgEmoji: '🎮',
  path: '/games/your-game',
  difficulty: 'Easy',
  duration: '10-15 min',
  players: 'Single',
  rights: ['Education'],
  xpReward: 100,
}
```

### 4. Add to Dashboard (1 object)

Edit `src/pages/DashboardHome.tsx`:

Add to `gamesList` array (same format as step 3)

## 🎯 Game Ideas Ready to Build

See `GAME_DEVELOPMENT_GUIDE.md` for 10+ game ideas including:
- Memory Match
- Word Search
- Crossword Puzzle
- Timeline Game
- Spot the Difference
- And more!

## 📚 Full Documentation

- **Complete Guide**: `GAME_DEVELOPMENT_GUIDE.md`
- **Template**: `src/pages/games/GAME_TEMPLATE.tsx`
- **Example**: `src/pages/games/RightsQuiz.tsx` (fully working!)

## 🚀 Test Your New Game

1. Start dev server: `npm run dev`
2. Navigate to `/games`
3. Click on your new game!

---

**That's it!** You now have everything you need to build unlimited games! 🎉

