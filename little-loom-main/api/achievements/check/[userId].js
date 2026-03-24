import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { userId } = req.query;

  try {
    if (req.method === 'POST') {
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

      return res.json({ 
        success: true, 
        newlyUnlocked,
        count: newlyUnlocked.length 
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

