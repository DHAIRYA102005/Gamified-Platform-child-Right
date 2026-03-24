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

  try {
    if (req.method === 'POST') {
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

      return res.json({ 
        success: true, 
        progress, 
        isCorrect, 
        pointsEarned: points 
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

