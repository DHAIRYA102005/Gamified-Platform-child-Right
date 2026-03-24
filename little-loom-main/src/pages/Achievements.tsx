import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Lock, Star } from 'lucide-react';
import { EmojiIcon } from '@/components/EmojiIcon';

const achievements = [
  { id: 1, name_en: 'First Steps', name_hi: 'पहला कदम', emoji: '👶', earned: true, xp: 50 },
  { id: 2, name_en: 'Rights Champion', name_hi: 'अधिकार चैंपियन', emoji: '🏆', earned: true, xp: 100 },
  { id: 3, name_en: 'Case Solver', name_hi: 'मामला सुलझाने वाला', emoji: '🔍', earned: false, xp: 150 },
  { id: 4, name_en: 'City Builder', name_hi: 'शहर निर्माता', emoji: '🏙️', earned: false, xp: 200 },
  { id: 5, name_en: 'Perfect Score', name_hi: 'पूर्ण स्कोर', emoji: '💯', earned: false, xp: 250 },
  { id: 6, name_en: 'Week Warrior', name_hi: 'साप्ताहिक योद्धा', emoji: '🔥', earned: false, xp: 300 },
];

export default function Achievements() {
  const { i18n } = useTranslation();
  const lang = i18n.language;

  return (
    <div className="space-y-8 relative overflow-hidden">
      {/* Floating Emoji Animations */}
      {[...Array(8)].map((_, i) => {
        const emojis = ['⭐', '🌟', '✨', '🏆', '🏅', '💎', '🦸', '🎯'];
        return (
          <motion.div
            key={i}
            className="absolute pointer-events-none opacity-10"
            style={{
              left: `${10 + i * 12}%`,
              top: `${15 + (i % 3) * 28}%`,
            }}
            animate={{
              y: [0, -35, 0],
              x: [0, Math.sin(i * 0.7) * 25, 0],
              rotate: [0, 28, -28, 0],
              scale: [1, 1.25, 1],
              opacity: [0.06, 0.2, 0.06],
            }}
            transition={{
              duration: 5.5 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.7,
            }}
          >
            <EmojiIcon emoji={emojis[i]} size={30} animated />
          </motion.div>
        );
      })}
      
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h1 className="text-4xl font-extrabold mb-2 flex items-center justify-center gap-2">
          <EmojiIcon emoji="🏆" size={40} /> {lang === 'hi' ? 'उपलब्धियां' : 'Achievements'}
        </h1>
        <p className="text-muted-foreground">{lang === 'hi' ? 'अपनी उपलब्धियां देखें!' : 'View your earned badges!'}</p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-4">
        {achievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`text-center p-6 ${achievement.earned ? 'border-accent' : 'opacity-60'}`}>
              <CardContent className="p-0 space-y-3">
                <div className="relative inline-block">
                  <EmojiIcon emoji={achievement.emoji} size={48} />
                  {!achievement.earned && <Lock className="absolute -bottom-1 -right-1 w-5 h-5 text-muted-foreground" />}
                </div>
                <h3 className="font-bold">{lang === 'hi' ? achievement.name_hi : achievement.name_en}</h3>
                <Badge variant={achievement.earned ? 'default' : 'secondary'}>
                  <Star className="w-3 h-3 mr-1" /> {achievement.xp} XP
                </Badge>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
