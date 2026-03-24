import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { StatsCard } from '@/components/StatsCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Star, 
  Zap, 
  Award, 
  Phone, 
  Shield,
  Play,
  Sparkles,
  Target,
  Building2,
  Search,
  BookOpen,
  Brain
} from 'lucide-react';
import { toast } from 'sonner';
import { EmojiIcon } from '@/components/EmojiIcon';
import { GlassCard, XPBadge, XPProgress } from '@/components/gamified/GamifiedUI';

export default function DashboardHome() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [dailyChallenge, setDailyChallenge] = useState({
    title: 'Complete 2 Games',
    progress: 1,
    total: 2,
    reward: 50,
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    setProfile(profileData);
  };

  const lang = i18n.language;

  const currentXP = profile?.points ?? 0;
  const xpToNext = 1000;

  const gamesList = [
    {
      id: 'rights-rescue',
      title: 'Rights Rescue Adventure',
      titleHi: 'अधिकार रक्षा साहसिक',
      description: 'Help children facing real-life problems through story-based decisions',
      descriptionHi: 'कहानी-आधारित निर्णयों के माध्यम से वास्तविक समस्याओं का सामना करने वाले बच्चों की मदद करें',
      icon: Sparkles,
      color: 'from-primary to-accent',
      path: '/games/rights-rescue',
    },
    {
      id: 'rights-detective',
      title: 'Rights Detective',
      titleHi: 'अधिकार जासूस',
      description: 'Solve cases by matching clues to the correct child rights',
      descriptionHi: 'सुरागों को सही बाल अधिकारों से मिलाकर मामलों को सुलझाएं',
      icon: Search,
      color: 'from-secondary to-primary',
      path: '/games/rights-detective',
    },
    {
      id: 'rights-city',
      title: 'Build Your Rights City',
      titleHi: 'अपना अधिकार शहर बनाएं',
      description: 'Build a city that protects children\'s rights',
      descriptionHi: 'एक ऐसा शहर बनाएं जो बच्चों के अधिकारों की रक्षा करे',
      icon: Building2,
      color: 'from-success to-secondary',
      path: '/games/rights-city',
    },
    {
      id: 'rights-quiz',
      title: 'Rights Quiz Challenge',
      titleHi: 'अधिकार क्विज चुनौती',
      description: 'Test your knowledge about children\'s rights',
      descriptionHi: 'बाल अधिकारों के बारे में अपने ज्ञान का परीक्षण करें',
      icon: Brain,
      color: 'from-accent to-primary',
      path: '/games/rights-quiz',
    },
    {
      id: 'rights-runner',
      title: 'Rights Runner',
      titleHi: 'अधिकार रनर',
      description: 'Endless runner - collect rights and avoid obstacles',
      descriptionHi: 'अंतहीन रनर - अधिकार एकत्र करें और बाधाओं से बचें',
      icon: Zap,
      color: 'from-yellow-500 to-orange-500',
      path: '/games/rights-runner',
    },
  ];

  return (
    <div className="space-y-8 relative overflow-hidden">
      {/* Floating Emoji Animations */}
      {[...Array(8)].map((_, i) => {
        const emojis = ['⭐', '🌟', '✨', '🏆', '🎯', '🧠', '🦸', '🏅'];
        return (
          <motion.div
            key={i}
            className="absolute pointer-events-none opacity-12"
            style={{
              left: `${10 + i * 12}%`,
              top: `${15 + (i % 3) * 30}%`,
            }}
            animate={{
              y: [0, -28, 0],
              x: [0, Math.cos(i * 0.7) * 18, 0],
              rotate: [0, 18, -18, 0],
              scale: [1, 1.18, 1],
              opacity: [0.08, 0.22, 0.08],
            }}
            transition={{
              duration: 4.5 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.6,
            }}
          >
            <EmojiIcon emoji={emojis[i]} size={26} animated />
          </motion.div>
        );
      })}
      
      {/* Dashboard Hero */}
      <GlassCard className="p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row items-center gap-6">
          <div className="flex items-center gap-4 flex-1">
            <motion.div
              className="w-16 h-16 rounded-3xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center shadow-lg"
              animate={{ scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <EmojiIcon emoji="🦸" size={40} />
            </motion.div>
            <div className="space-y-1">
              <motion.h1
                className="text-2xl lg:text-3xl font-extrabold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent"
                animate={{ backgroundPosition: ['0%', '100%', '0%'] }}
                transition={{ duration: 5, repeat: Infinity }}
              >
                {t('welcome', { name: profile?.display_name || 'Hero' })}
              </motion.h1>
              <p className="text-sm text-muted-foreground">
                {lang === 'hi'
                  ? 'अपने अधिकारों के बारे में जानें और चैंपियन बनें!'
                  : 'Learn about your rights and become a champion!'}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <XPBadge xp={currentXP} label={lang === 'hi' ? 'कुल XP' : 'Total XP'} />
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Star className="w-3 h-3 text-accent" />
                  {lang === 'hi' ? `स्तर ${profile?.level ?? 1}` : `Level ${profile?.level ?? 1}`}
                </span>
              </div>
            </div>
          </div>
          <div className="w-full lg:max-w-xs">
            <XPProgress
              currentXP={currentXP}
              xpToNext={xpToNext}
              levelLabel={
                lang === 'hi'
                  ? `अगले स्तर तक प्रगति`
                  : 'Progress to next level'
              }
            />
          </div>
        </div>
      </GlassCard>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={Trophy} label={t('points')} value={profile?.points || 0} color="bg-primary" delay={0.1} />
        <StatsCard icon={Star} label={t('level')} value={profile?.level || 1} color="bg-accent" delay={0.2} />
        <StatsCard icon={Award} label={t('badges')} value={0} color="bg-secondary" delay={0.3} />
        <StatsCard icon={Zap} label="Streak" value={profile?.current_streak || 0} color="bg-success" delay={0.4} />
      </div>

      {/* Daily Mission */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <GlassCard className="border-accent/40 p-6 bg-gradient-to-r from-accent/5 to-primary/5">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <motion.div
                  className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Target className="w-7 h-7 text-accent" />
                </motion.div>
                <div>
                  <h3 className="font-bold text-lg">{lang === 'hi' ? 'दैनिक मिशन' : 'Daily Mission'}</h3>
                  <p className="text-muted-foreground">{dailyChallenge.title}</p>
                </div>
              </div>
              <div className="flex-1 md:max-w-xs">
                <div className="flex justify-between text-sm mb-1">
                  <span>{dailyChallenge.progress}/{dailyChallenge.total}</span>
                  <span className="text-accent font-bold flex items-center gap-1">
                    <Zap className="w-4 h-4" /> +{dailyChallenge.reward} XP
                  </span>
                </div>
                <Progress value={(dailyChallenge.progress / dailyChallenge.total) * 100} className="h-3" />
              </div>
            </div>
          </CardContent>
        </GlassCard>
      </motion.div>

      {/* Games Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <EmojiIcon emoji="🎮" size={28} /> {lang === 'hi' ? 'खेल और गतिविधियाँ' : 'Games & Activities'}
          </h2>
          <Button variant="outline" onClick={() => navigate('/games')}>
            {lang === 'hi' ? 'सभी देखें' : 'View All'}
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {gamesList.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <Card 
                className="group cursor-pointer overflow-hidden hover:shadow-glow transition-all duration-300 h-full"
                onClick={() => navigate(game.path)}
              >
                <div className={`h-32 bg-gradient-to-br ${game.color} p-6 relative overflow-hidden`}>
                  <motion.div
                    className="absolute inset-0 bg-white/10"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.5 }}
                  />
                  <game.icon className="w-12 h-12 text-white/90" />
                  <div className="absolute bottom-4 right-4">
                    <motion.div
                      className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
                      whileHover={{ scale: 1.2 }}
                    >
                      <Play className="w-5 h-5 text-white" />
                    </motion.div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg mb-1">
                    {lang === 'hi' ? game.titleHi : game.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {lang === 'hi' ? game.descriptionHi : game.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Emergency Help Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="border-2 border-destructive/20 bg-gradient-to-r from-destructive/5 to-destructive/10">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-destructive">
              <Shield className="w-6 h-6" />
              {t('help.emergency')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <Button 
                variant="destructive" 
                size="lg" 
                className="h-14 text-lg"
                onClick={() => window.location.href = 'tel:1098'}
              >
                <Phone className="mr-2 w-5 h-5" /> {t('help.childline')}
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="h-14 text-lg border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => window.location.href = 'tel:100'}
              >
                <Phone className="mr-2 w-5 h-5" /> {t('help.police')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Continue Learning */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card className="bg-gradient-to-r from-muted/50 to-muted/30">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="font-bold text-xl mb-1">
                  {lang === 'hi' ? 'अपने अधिकार जानें' : 'Know Your Rights'}
                </h3>
                <p className="text-muted-foreground">
                  {lang === 'hi' 
                    ? 'शिक्षा, सुरक्षा और समानता के अधिकारों के बारे में जानें'
                    : 'Learn about rights to education, protection, and equality'
                  }
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={() => navigate('/learn')} size="lg">
                  {lang === 'hi' ? 'अभी सीखें' : 'Start Learning'} →
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/awareness')}
                  size="lg"
                >
                  {lang === 'hi' ? 'कानूनी जागरूकता' : 'Legal Awareness'} →
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
