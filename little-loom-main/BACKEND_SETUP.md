# Node.js Backend Setup Guide

This project now includes a Node.js/Express backend server for enhanced functionality.

## 🚀 Quick Start

### 1. Install Backend Dependencies

```bash
npm install
```

This will install Express, CORS, and dotenv along with your existing dependencies.

### 2. Set Up Environment Variables

Create a `.env` file in the `server/` directory:

```bash
# Windows PowerShell
cd server
New-Item -ItemType File -Name .env
```

Then add these variables (see `server/env.example.txt` for template):

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
PORT=3001
FRONTEND_URL=http://localhost:8080
NODE_ENV=development
```

**How to get your Supabase Service Role Key:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API**
4. Copy the **`service_role`** key (⚠️ Keep this secret! Never expose to frontend)

### 3. Run the Backend Server

**Option A: Run backend only**
```bash
npm run dev:server
```

**Option B: Run both frontend and backend together**
```bash
npm run dev:all
```

The backend will run on `http://localhost:3001`
The frontend will run on `http://localhost:8080`

## 📁 Project Structure

```
rights-rangers-play-main/
├── server/
│   ├── index.js          # Main Express server
│   ├── README.md         # Backend documentation
│   └── .env              # Environment variables (create this)
├── src/
│   └── lib/
│       └── api.ts        # Frontend API client
└── package.json          # Updated with backend scripts
```

## 🎯 What the Backend Provides

### Benefits of Adding Node.js Backend:

1. **Server-Side Operations**
   - Secure admin operations with Supabase service role
   - Data processing and validation
   - Business logic that shouldn't be in the frontend

2. **API Endpoints**
   - `/api/games` - Game management
   - `/api/achievements` - Achievement system with auto-unlocking
   - `/api/leaderboard` - Leaderboard data
   - `/api/stats` - User analytics
   - `/api/profile` - User profile management

3. **Enhanced Features**
   - Automatic achievement checking and unlocking
   - Server-side point calculations
   - Analytics and statistics
   - Secure data operations

## 🔧 Usage Examples

### In Your React Components

You can now use the API client instead of direct Supabase calls:

```typescript
import { apiClient } from '@/lib/api';

// Get games
const games = await apiClient.getGames();

// Submit game progress
const result = await apiClient.submitGameProgress({
  user_id: userId,
  scenario_id: scenarioId,
  choice_made: 'choice-a',
  completed: true
});

// Check achievements
const achievements = await apiClient.checkAchievements(userId);
```

### Or Use Direct API Calls

```typescript
const response = await fetch('http://localhost:3001/api/games');
const games = await response.json();
```

## 🔒 Security Notes

- ⚠️ **Never expose the service role key** to the frontend
- The backend uses the service role key for admin operations
- Frontend should still use the public Supabase key for user authentication
- Consider adding authentication middleware to protect API routes

## 📝 Next Steps

1. **Add Authentication Middleware** - Verify JWT tokens from Supabase
2. **Add Rate Limiting** - Prevent API abuse
3. **Add Logging** - Track API usage
4. **Add Error Handling** - Better error responses
5. **Add Webhooks** - For external integrations
6. **Add Scheduled Tasks** - For daily/weekly resets

## 🐛 Troubleshooting

**Port already in use?**
- Change `PORT` in `server/.env` to a different port (e.g., 3002)

**CORS errors?**
- Make sure `FRONTEND_URL` in `.env` matches your frontend URL

**Supabase connection errors?**
- Verify your `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are correct
- Check that your Supabase project is active

## 📚 API Documentation

See `server/README.md` for complete API endpoint documentation.

