import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Avatar } from '@/components/Avatar';
import { StatsCard } from '@/components/StatsCard';
import { GameCard } from '@/components/GameCard';
import { Button } from '@/components/ui/button';
import { Trophy, Star, Zap, Award, Phone, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { EmojiIcon } from '@/components/EmojiIcon';

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [games, setGames] = useState<any[]>([]);

  useEffect(() => {
    // Check auth and load data
    const loadDashboard = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/auth');
        return;
      }

      setUser(session.user);

      // Load profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      setProfile(profileData);

      // Load games
      const { data: gamesData } = await supabase
        .from('games')
        .select('*')
        .eq('is_active', true)
        .limit(6);

      setGames(gamesData || []);
    };

    loadDashboard();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
    toast.success('Logged out successfully!');
  };

  const handlePlayGame = (gameId: string) => {
    navigate(`/game/${gameId}`);
  };

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'hi' : 'en');
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Star className="w-12 h-12 text-primary" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/30 to-background relative overflow-hidden">
      {/* Floating Emoji Animations */}
      {[...Array(10)].map((_, i) => {
        const emojis = ['⭐', '🌟', '✨', '🏆', '🎯', '🧠', '🦸', '🏅', '💎', '⚡'];
        return (
          <motion.div
            key={i}
            className="absolute pointer-events-none opacity-15"
            style={{
              left: `${8 + i * 10}%`,
              top: `${12 + (i % 4) * 25}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.sin(i * 0.6) * 20, 0],
              rotate: [0, 20, -20, 0],
              scale: [1, 1.2, 1],
              opacity: [0.08, 0.25, 0.08],
            }}
            transition={{
              duration: 5 + i * 0.4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          >
            <EmojiIcon emoji={emojis[i]} size={28} animated />
          </motion.div>
        );
      })}
      
      {/* Header */}
      <motion.header
        className="bg-card/80 backdrop-blur-sm border-b border-border shadow-sm sticky top-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
              <Avatar size="sm" avatarBody={profile.avatar_body} />
            </motion.div>
            <div>
              <h2 className="font-bold text-lg">{profile.display_name}</h2>
              <p className="text-sm text-muted-foreground">{t('level')} {profile.level}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={toggleLanguage}>
              {i18n.language === 'en' ? '🇮🇳 हिंदी' : '🇬🇧 English'}
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              {t('auth.logout')}
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.h1
            className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {t('welcome', { name: profile.display_name })} <EmojiIcon emoji="✨" size={24} className="inline" />
          </motion.h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Learn about your rights, stay safe, and become a champion for yourself and others!
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          <StatsCard icon={Trophy} label={t('points')} value={profile.points} color="bg-primary" delay={0.1} />
          <StatsCard icon={Star} label={t('level')} value={profile.level} color="bg-accent" delay={0.2} />
          <StatsCard icon={Award} label={t('badges')} value={0} color="bg-secondary" delay={0.3} />
          <StatsCard icon={Zap} label="Streak" value={profile.current_streak} color="bg-success" delay={0.4} />
        </div>

        {/* Emergency Help Section */}
        <motion.div
          className="bg-gradient-to-r from-destructive/10 to-destructive/5 rounded-2xl p-6 mb-12 border-2 border-destructive/20"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="w-8 h-8 text-destructive" />
            <h3 className="text-2xl font-bold">{t('help.emergency')}</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="destructive" className="text-lg py-6" size="lg">
              <Phone className="mr-2" /> {t('help.childline')}
            </Button>
            <Button variant="outline" className="text-lg py-6 border-destructive text-destructive hover:bg-destructive hover:text-white" size="lg">
              <Phone className="mr-2" /> {t('help.police')}
            </Button>
          </div>
        </motion.div>

        {/* Games Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <EmojiIcon emoji="🎮" size={32} /> Games & Activities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.length > 0 ? (
              games.map((game, index) => (
                <GameCard
                  key={game.id}
                  id={game.id}
                  titleKey={`games.${game.game_type}`}
                  description={game.description_en}
                  difficulty={game.difficulty}
                  thumbnailUrl={game.thumbnail_url}
                  onPlay={() => handlePlayGame(game.id)}
                />
              ))
            ) : (
              <motion.div
                className="col-span-full text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="text-xl text-muted-foreground">
                  <EmojiIcon emoji="🎯" size={20} className="inline" /> Games coming soon! Check back later.
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </section>
    </div>
  );
}
