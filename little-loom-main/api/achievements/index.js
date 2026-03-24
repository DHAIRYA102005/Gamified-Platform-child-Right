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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabaseAdmin
        .from('achievements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return res.json(data || []);
    }

    if (req.method === 'POST') {
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

      return res.json({ success: true, achievement: data });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

