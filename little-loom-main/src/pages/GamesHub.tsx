import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Sparkles,
  Search,
  Building2,
  Play,
  Star,
  Trophy,
  Clock,
  Users,
  Brain,
  Zap,
} from 'lucide-react';
import { EmojiIcon } from '@/components/EmojiIcon';
import { GlassCard, XPBadge, DifficultyDots } from '@/components/gamified/GamifiedUI';

const allGames = [
  {
    id: 'rights-rescue',
    title: 'Rights Rescue Adventure',
    titleHi: 'अधिकार रक्षा साहसिक',
    description: 'Help children facing real-life problems through story-based decisions. Make the right choices to protect their rights!',
    descriptionHi: 'कहानी-आधारित निर्णयों के माध्यम से वास्तविक समस्याओं का सामना करने वाले बच्चों की मदद करें।',
    icon: Sparkles,
    color: 'from-primary to-accent',
    bgEmoji: '🦸',
    path: '/games/rights-rescue',
    difficulty: 'Easy',
    duration: '5-10 min',
    players: 'Single',
    rights: ['Education', 'Protection', 'Equality'],
    xpReward: 100,
  },
  {
    id: 'rights-detective',
    title: 'Rights Detective',
    titleHi: 'अधिकार जासूस',
    description: 'Become a detective! Solve cases by matching clues to the correct child rights. Find violations and restore justice!',
    descriptionHi: 'जासूस बनें! सुरागों को सही बाल अधिकारों से मिलाकर मामलों को सुलझाएं।',
    icon: Search,
    color: 'from-secondary to-primary',
    bgEmoji: '🔍',
    path: '/games/rights-detective',
    difficulty: 'Medium',
    duration: '10-15 min',
    players: 'Single',
    rights: ['Protection', 'Health', 'Identity'],
    xpReward: 150,
  },
  {
    id: 'rights-city',
    title: 'Build Your Rights City',
    titleHi: 'अपना अधिकार शहर बनाएं',
    description: 'Design and build a city that protects all children\'s rights! Add schools, hospitals, and safe zones.',
    descriptionHi: 'एक ऐसा शहर डिज़ाइन करें जो सभी बच्चों के अधिकारों की रक्षा करे!',
    icon: Building2,
    color: 'from-success to-secondary',
    bgEmoji: '🏙️',
    path: '/games/rights-city',
    difficulty: 'Medium',
    duration: '15-20 min',
    players: 'Single',
    rights: ['Education', 'Health', 'Safety'],
    xpReward: 200,
  },
  {
    id: 'rights-quiz',
    title: 'Rights Quiz Challenge',
    titleHi: 'अधिकार क्विज चुनौती',
    description: 'Test your knowledge about children\'s rights! Answer questions correctly to earn points and learn more.',
    descriptionHi: 'बाल अधिकारों के बारे में अपने ज्ञान का परीक्षण करें! अंक अर्जित करने के लिए सही उत्तर दें।',
    icon: Brain,
    color: 'from-accent to-primary',
    bgEmoji: '🧠',
    path: '/games/rights-quiz',
    difficulty: 'Easy',
    duration: '5-10 min',
    players: 'Single',
    rights: ['All Rights', 'Education', 'Protection'],
    xpReward: 150,
  },
  {
    id: 'rights-runner',
    title: 'Rights Runner',
    titleHi: 'अधिकार रनर',
    description: 'Endless runner game! Collect rights symbols while avoiding obstacles. Use arrow keys to move left and right.',
    descriptionHi: 'अंतहीन रनर गेम! बाधाओं से बचते हुए अधिकार प्रतीक एकत्र करें। बाएं और दाएं जाने के लिए तीर कुंजियाँ उपयोग करें।',
    icon: Zap,
    color: 'from-yellow-500 to-orange-500',
    bgEmoji: '🏃',
    path: '/games/rights-runner',
    difficulty: 'Medium',
    duration: 'Endless',
    players: 'Single',
    rights: ['All Rights', 'Collection', 'Speed'],
    xpReward: 200,
  },
];

export default function GamesHub() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const lang = i18n.language;

  return (
    <div className="space-y-8 relative overflow-hidden">
      {/* Floating Emoji Animations */}
      {[...Array(9)].map((_, i) => {
        const emojis = ['⭐', '🌟', '✨', '🏆', '🎯', '🧠', '🦸', '🏅', '💎'];
        return (
          <motion.div
            key={i}
            className="absolute pointer-events-none opacity-12"
            style={{
              left: `${8 + i * 11}%`,
              top: `${12 + (i % 3) * 28}%`,
            }}
            animate={{
              y: [0, -32, 0],
              x: [0, Math.sin(i * 0.6) * 22, 0],
              rotate: [0, 22, -22, 0],
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-extrabold mb-2 flex items-center justify-center gap-2">
          <EmojiIcon emoji="🎮" size={40} /> {lang === 'hi' ? 'गेम्स हब' : 'Games Hub'}
        </h1>
        <p className="text-lg text-muted-foreground">
          {lang === 'hi' 
            ? 'खेलें और अपने अधिकारों के बारे में सीखें!'
            : 'Play and learn about your rights!'
          }
        </p>
      </motion.div>

      {/* Games Grid */}
      <div className="grid gap-8">
        {allGames.map((game, index) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.15 }}
          >
            <GlassCard className="overflow-hidden hover:shadow-glow transition-all duration-300">
              <div className="flex flex-col lg:flex-row">
                {/* Game Preview */}
                <div className={`lg:w-1/3 h-48 lg:h-auto bg-gradient-to-br ${game.color} p-8 relative overflow-hidden flex items-center justify-center`}>
                  <motion.div
                    className="flex items-center justify-center"
                    animate={{ 
                      y: [0, -10, 0],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <EmojiIcon emoji={game.bgEmoji} size={96} animated />
                  </motion.div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <motion.div
                    className="absolute bottom-4 left-4 flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-white text-sm font-medium"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Trophy className="w-4 h-4" />
                    +{game.xpReward} XP
                  </motion.div>
                </div>

                {/* Game Info */}
                <CardContent className="flex-1 p-6 lg:p-8">
                  <div className="flex flex-col h-full">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h2 className="text-2xl font-bold mb-1">
                          {lang === 'hi' ? game.titleHi : game.title}
                        </h2>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {game.rights.map((right) => (
                            <Badge key={right} variant="secondary" className="text-xs">
                              {right}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <XPBadge xp={game.xpReward} className="text-[11px]" />
                        <DifficultyDots level={game.difficulty === 'Easy' ? 2 : game.difficulty === 'Medium' ? 3 : 4} />
                      </div>
                    </div>

                    <p className="text-muted-foreground mb-6 flex-1">
                      {lang === 'hi' ? game.descriptionHi : game.description}
                    </p>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{game.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{game.players}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-accent" />
                          <span>4.8</span>
                        </div>
                      </div>

                      <Button 
                        size="lg" 
                        onClick={() => navigate(game.path)}
                        className="w-full sm:w-auto"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        {lang === 'hi' ? 'खेलें' : 'Play Now'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
