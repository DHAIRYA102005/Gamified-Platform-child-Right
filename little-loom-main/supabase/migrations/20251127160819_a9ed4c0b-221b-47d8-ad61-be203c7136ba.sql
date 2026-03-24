-- Fix security issue: recreate view with security_invoker=on
DROP VIEW IF EXISTS public.leaderboard_weekly;

CREATE VIEW public.leaderboard_weekly
WITH (security_invoker=on) AS
SELECT 
  p.id,
  p.display_name,
  p.avatar_body,
  p.level,
  COALESCE(SUM(up.points_earned), 0) AS weekly_points
FROM public.profiles p
LEFT JOIN public.user_progress up ON p.id = up.user_id 
  AND up.completed_at >= NOW() - INTERVAL '7 days'
GROUP BY p.id, p.display_name, p.avatar_body, p.level
ORDER BY weekly_points DESC
LIMIT 100;