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
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { userId } = req.query;

  try {
    if (req.method === 'GET') {
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

      return res.json(stats);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

