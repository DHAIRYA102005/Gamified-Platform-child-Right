# Rights Rangers Backend API

Node.js/Express backend server for the Rights Rangers application.

## Features

- **RESTful API** for game data, user profiles, achievements, and leaderboards
- **Server-side Supabase client** with admin privileges
- **Achievement system** with automatic unlocking
- **Analytics endpoints** for user statistics
- **CORS enabled** for frontend integration

## Setup

1. **Install backend dependencies:**
   ```bash
   npm install express cors dotenv
   ```

2. **Create environment file:**
   Create a `.env` file in the `server/` directory:
   ```env
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   PORT=3001
   FRONTEND_URL=http://localhost:8080
   NODE_ENV=development
   ```

3. **Get Supabase Service Role Key:**
   - Go to your Supabase Dashboard
   - Navigate to Settings → API
   - Copy the `service_role` key (keep this secret!)

## Running the Server

**Development mode:**
```bash
npm run dev:server
```

**Run both frontend and backend:**
```bash
npm run dev:all
```

**Production:**
```bash
npm run server
```

## API Endpoints

### Health Check
- `GET /api/health` - Server status

### Profile
- `GET /api/profile/:userId` - Get user profile
- `PUT /api/profile/:userId` - Update user profile

### Games
- `GET /api/games` - Get all active games
- `GET /api/games/:gameId/scenarios` - Get game scenarios
- `POST /api/games/progress` - Submit game progress

### Achievements
- `GET /api/achievements` - Get all achievements
- `GET /api/achievements/user/:userId` - Get user achievements
- `POST /api/achievements/unlock` - Unlock achievement
- `POST /api/achievements/check/:userId` - Check and auto-unlock achievements

### Leaderboard
- `GET /api/leaderboard/weekly` - Weekly leaderboard
- `GET /api/leaderboard/alltime` - All-time leaderboard

### Analytics
- `GET /api/stats/:userId` - Get user statistics

## Example Usage

```javascript
// Frontend API call example
const response = await fetch('http://localhost:3001/api/games');
const games = await response.json();

// Submit game progress
await fetch('http://localhost:3001/api/games/progress', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    user_id: 'user-uuid',
    scenario_id: 'scenario-uuid',
    choice_made: 'choice-a',
    completed: true
  })
});
```

## Security Notes

- The service role key has admin access - **never expose it to the frontend**
- Always validate user authentication on protected routes
- Consider adding rate limiting for production
- Use environment variables for all sensitive data

