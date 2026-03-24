import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true
}));
app.use(express.json());

// Initialize Supabase Admin Client (server-side with service role key)
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY, // Service role key for admin operations
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Rights Rangers API is running!' });
});

// ==================== USER & PROFILE ROUTES ====================

// Get user profile
app.get('/api/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user profile
app.put('/api/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== GAME ROUTES ====================

// Get all active games
app.get('/api/games', async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('games')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get game scenarios
app.get('/api/games/:gameId/scenarios', async (req, res) => {
  try {
    const { gameId } = req.params;
    
    const { data, error } = await supabaseAdmin
      .from('game_scenarios')
      .select('*')
      .eq('game_id', gameId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Submit game progress
app.post('/api/games/progress', async (req, res) => {
  try {
    const { user_id, scenario_id, choice_made, points_earned, completed } = req.body;

    // Get scenario to check correct answer
    const { data: scenario } = await supabaseAdmin
      .from('game_scenarios')
      .select('correct_choice, points_value')
      .eq('id', scenario_id)
      .single();

    const isCorrect = choice_made === scenario?.correct_choice;
    const points = isCorrect ? (points_earned || scenario?.points_value || 0) : 0;

    // Update or insert progress
    const progressData = {
      user_id,
      scenario_id,
      completed: completed || isCorrect,
      choice_made,
      points_earned: points,
      completed_at: completed ? new Date().toISOString() : null
    };

    const { data: progress, error: progressError } = await supabaseAdmin
      .from('user_progress')
      .upsert(progressData, { onConflict: 'user_id,scenario_id' })
      .select()
      .single();

    if (progressError) throw progressError;

    // Update user points if correct
    if (isCorrect && points > 0) {
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('points')
        .eq('id', user_id)
        .single();

      await supabaseAdmin
        .from('profiles')
        .update({ points: (profile?.points || 0) + points })
        .eq('id', user_id);
    }

    res.json({ 
      success: true, 
      progress, 
      isCorrect, 
      pointsEarned: points 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== ACHIEVEMENTS ROUTES ====================

// Get all achievements
app.get('/api/achievements', async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('achievements')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user achievements
app.get('/api/achievements/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const { data, error } = await supabaseAdmin
      .from('user_achievements')
      .select(`
        *,
        achievement:achievements(*)
      `)
      .eq('user_id', userId);

    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Unlock achievement
app.post('/api/achievements/unlock', async (req, res) => {
  try {
    const { user_id, achievement_id } = req.body;

    const { data, error } = await supabaseAdmin
      .from('user_achievements')
      .insert({
        user_id,
        achievement_id,
        unlocked_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    // Award points
    const { data: achievement } = await supabaseAdmin
      .from('achievements')
      .select('points_reward')
      .eq('id', achievement_id)
      .single();

    if (achievement?.points_reward) {
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('points')
        .eq('id', user_id)
        .single();

      await supabaseAdmin
        .from('profiles')
        .update({ points: (profile?.points || 0) + achievement.points_reward })
        .eq('id', user_id);
    }

    res.json({ success: true, achievement: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Check and unlock achievements based on user progress
app.post('/api/achievements/check/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Get user profile and progress
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    const { data: progress } = await supabaseAdmin
      .from('user_progress')
      .select('*')
      .eq('user_id', userId);

    // Get all achievements
    const { data: achievements } = await supabaseAdmin
      .from('achievements')
      .select('*');

    // Get already unlocked achievements
    const { data: unlocked } = await supabaseAdmin
      .from('user_achievements')
      .select('achievement_id')
      .eq('user_id', userId);

    const unlockedIds = new Set(unlocked?.map(u => u.achievement_id) || []);
    const newlyUnlocked = [];

    // Check each achievement criteria
    for (const achievement of achievements || []) {
      if (unlockedIds.has(achievement.id)) continue;

      const criteria = achievement.criteria;
      let shouldUnlock = false;

      // Example criteria checks
      if (criteria.type === 'points' && profile?.points >= criteria.value) {
        shouldUnlock = true;
      } else if (criteria.type === 'games_completed' && 
                 (progress?.filter(p => p.completed).length || 0) >= criteria.value) {
        shouldUnlock = true;
      } else if (criteria.type === 'streak' && profile?.current_streak >= criteria.value) {
        shouldUnlock = true;
      }

      if (shouldUnlock) {
        // Unlock achievement
        await supabaseAdmin
          .from('user_achievements')
          .insert({
            user_id: userId,
            achievement_id: achievement.id,
            unlocked_at: new Date().toISOString()
          });

        // Award points
        if (achievement.points_reward) {
          await supabaseAdmin
            .from('profiles')
            .update({ points: (profile?.points || 0) + achievement.points_reward })
            .eq('id', userId);
        }

        newlyUnlocked.push(achievement);
      }
    }

    res.json({ 
      success: true, 
      newlyUnlocked,
      count: newlyUnlocked.length 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== LEADERBOARD ROUTES ====================

// Get weekly leaderboard
app.get('/api/leaderboard/weekly', async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('leaderboard_weekly')
      .select('*')
      .limit(100);

    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all-time leaderboard
app.get('/api/leaderboard/alltime', async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('id, display_name, avatar_body, level, points')
      .order('points', { ascending: false })
      .limit(100);

    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== ANALYTICS ROUTES ====================

// Get user statistics
app.get('/api/stats/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    const { data: progress } = await supabaseAdmin
      .from('user_progress')
      .select('*')
      .eq('user_id', userId);

    const { data: achievements } = await supabaseAdmin
      .from('user_achievements')
      .select('*')
      .eq('user_id', userId);

    const stats = {
      totalPoints: profile?.points || 0,
      level: profile?.level || 1,
      currentStreak: profile?.current_streak || 0,
      gamesCompleted: progress?.filter(p => p.completed).length || 0,
      totalGames: progress?.length || 0,
      achievementsUnlocked: achievements?.length || 0,
      totalPointsEarned: progress?.reduce((sum, p) => sum + (p.points_earned || 0), 0) || 0
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Rights Rangers API Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});

export default app;

