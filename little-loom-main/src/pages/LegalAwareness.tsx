import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { GlassCard, DifficultyDots, XPBadge } from '@/components/gamified/GamifiedUI';
import { EmojiIcon } from '@/components/EmojiIcon';

const topics = [
  {
    id: 'child-labour',
    emoji: '🧱',
    title_en: 'Child Labour',
    title_hi: 'बाल श्रम',
    desc_en: 'Why children should not be made to work in shops, homes or factories.',
    desc_hi: 'क्यों बच्चों से दुकानों, घरों या फैक्ट्रियों में काम नहीं करवाया जाना चाहिए।',
    xp: 70,
    difficulty: 2,
  },
  {
    id: 'child-abuse',
    emoji: '🚫',
    title_en: 'Child Abuse',
    title_hi: 'बाल शोषण',
    desc_en: 'Understanding safe and unsafe touch and speaking up for yourself.',
    desc_hi: 'सुरक्षित और असुरक्षित स्पर्श को समझना और अपने लिए आवाज उठाना।',
    xp: 80,
    difficulty: 3,
  },
  {
    id: 'online-safety',
    emoji: '💻',
    title_en: 'Online Safety',
    title_hi: 'ऑनलाइन सुरक्षा',
    desc_en: 'Staying safe on the internet, games and social media.',
    desc_hi: 'इंटरनेट, गेम्स और सोशल मीडिया पर सुरक्षित रहना।',
    xp: 60,
    difficulty: 2,
  },
  {
    id: 'school-safety',
    emoji: '🏫',
    title_en: 'School Safety',
    title_hi: 'स्कूल सुरक्षा',
    desc_en: 'Your rights inside school, in classrooms and playgrounds.',
    desc_hi: 'कक्षा और खेल मैदान सहित स्कूल के अंदर आपके अधिकार।',
    xp: 70,
    difficulty: 2,
  },
  {
    id: 'juvenile-justice',
    emoji: '⚖️',
    title_en: 'Juvenile Justice',
    title_hi: 'किशोर न्याय',
    desc_en: 'What happens when children are in conflict with the law.',
    desc_hi: 'जब बच्चे कानून के साथ संघर्ष में होते हैं तो क्या होता है।',
    xp: 90,
    difficulty: 4,
  },
] as const;

export default function LegalAwareness() {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const navigate = useNavigate();

  return (
    <div className="space-y-8 relative overflow-hidden">
      {/* Floating Emoji Animations */}
      {[...Array(7)].map((_, i) => {
        const emojis = ['⭐', '🌟', '✨', '🧠', '🛡️', '📢', '🏆'];
        return (
          <motion.div
            key={i}
            className="absolute pointer-events-none opacity-10"
            style={{
              left: `${10 + i * 14}%`,
              top: `${15 + (i % 3) * 30}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.cos(i * 0.8) * 18, 0],
              rotate: [0, 25, -25, 0],
              scale: [1, 1.2, 1],
              opacity: [0.06, 0.18, 0.06],
            }}
            transition={{
              duration: 5.5 + i * 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.7,
            }}
          >
            <EmojiIcon emoji={emojis[i]} size={26} animated />
          </motion.div>
        );
      })}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-extrabold mb-2 flex items-center justify-center gap-2">
          <EmojiIcon emoji="📢" size={40} />{' '}
          {lang === 'hi' ? 'कानूनी जागरूकता' : 'Legal Literacy & Awareness'}
        </h1>
        <p className="text-muted-foreground">
          {lang === 'hi'
            ? 'महत्वपूर्ण विषयों के बारे में जानें जो आपको सुरक्षित और जागरूक बनाते हैं।'
            : 'Learn about important topics that keep you safe and informed.'}
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {topics.map((topic, index) => (
          <motion.button
            key={topic.id}
            type="button"
            onClick={() => navigate(`/awareness/${topic.id}`)}
            initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="text-left"
          >
            <GlassCard className="h-full p-5 cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center shadow-lg shrink-0">
                  <EmojiIcon emoji={topic.emoji} size={32} />
                </div>
                <div className="space-y-2 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="font-bold text-lg">
                      {lang === 'hi' ? topic.title_hi : topic.title_en}
                    </h2>
                    <XPBadge xp={topic.xp} className="text-[10px]" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {lang === 'hi' ? topic.desc_hi : topic.desc_en}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <DifficultyDots level={topic.difficulty} />
                    <span className="text-[11px] text-muted-foreground">
                      {lang === 'hi' ? 'टैप करें और जानें →' : 'Tap to learn more →'}
                    </span>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.button>
        ))}
      </div>
    </div>
  );
}


