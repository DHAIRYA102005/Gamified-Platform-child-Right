# 🚀 Quick Start - Node.js Backend Integration

## ✅ What's Been Added

Your project now has a **full Node.js/Express backend** with:

- ✅ Express.js server (`server/index.js`)
- ✅ RESTful API endpoints for games, achievements, leaderboards
- ✅ Server-side Supabase client with admin privileges
- ✅ Frontend API client utility (`src/lib/api.ts`)
- ✅ Updated npm scripts for running backend
- ✅ Complete documentation

## 🎯 Next Steps to Run

### 1. Create Environment File

Create `server/.env` file:

```bash
# In PowerShell
cd server
@"
SUPABASE_URL=https://fwvtxckqvaeuquhxfhfr.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
PORT=3001
FRONTEND_URL=http://localhost:8080
NODE_ENV=development
"@ | Out-File -FilePath .env -Encoding utf8
```

**Get your Service Role Key:**
- Go to https://supabase.com/dashboard
- Select your project → Settings → API
- Copy the `service_role` key

### 2. Start the Backend

```bash
# Run backend only
npm run dev:server

# OR run both frontend + backend together
npm run dev:all
```

### 3. Test the API

Open in browser: http://localhost:3001/api/health

You should see: `{"status":"ok","message":"Rights Rangers API is running!"}`

## 📋 Available API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/games` | GET | Get all games |
| `/api/games/:id/scenarios` | GET | Get game scenarios |
| `/api/games/progress` | POST | Submit game progress |
| `/api/achievements` | GET | Get all achievements |
| `/api/achievements/check/:userId` | POST | Auto-check achievements |
| `/api/leaderboard/weekly` | GET | Weekly leaderboard |
| `/api/stats/:userId` | GET | User statistics |

## 💡 Usage in Frontend

```typescript
import { apiClient } from '@/lib/api';

// Get games from backend
const games = await apiClient.getGames();

// Submit progress
await apiClient.submitGameProgress({
  user_id: userId,
  scenario_id: scenarioId,
  choice_made: 'choice-a',
  completed: true
});
```

## 📚 Full Documentation

- **Backend API**: See `server/README.md`
- **Setup Guide**: See `BACKEND_SETUP.md`

## 🎉 You're Ready!

Your full-stack application is now set up with:
- ✅ React frontend (Vite)
- ✅ Node.js backend (Express)
- ✅ Supabase database
- ✅ RESTful API

Happy coding! 🚀

