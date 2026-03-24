import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { EmojiIcon } from '@/components/EmojiIcon';
import { GlassCard, DifficultyDots, XPBadge } from '@/components/gamified/GamifiedUI';

const rights = [
  {
    id: 'education',
    emoji: '📚',
    title_en: 'Right to Education',
    title_hi: 'शिक्षा का अधिकार',
    desc_en: 'Every child aged 6-14 has the right to free education under RTE Act.',
    desc_hi: 'RTE अधिनियम के तहत 6-14 वर्ष के हर बच्चे को मुफ्त शिक्षा का अधिकार है।',
    xp: 80,
    difficulty: 2,
  },
  {
    id: 'protection',
    emoji: '🛡️',
    title_en: 'Right to Protection',
    title_hi: 'सुरक्षा का अधिकार',
    desc_en: 'Children must be protected from abuse, exploitation and child labour.',
    desc_hi: 'बच्चों को दुर्व्यवहार, शोषण और बाल श्रम से बचाया जाना चाहिए।',
    xp: 90,
    difficulty: 3,
  },
  {
    id: 'health',
    emoji: '🏥',
    title_en: 'Right to Health',
    title_hi: 'स्वास्थ्य का अधिकार',
    desc_en: 'Every child has the right to healthcare and nutritious food.',
    desc_hi: 'हर बच्चे को स्वास्थ्य सेवा और पौष्टिक भोजन का अधिकार है।',
    xp: 70,
    difficulty: 2,
  },
  {
    id: 'equality',
    emoji: '⚖️',
    title_en: 'Right to Equality',
    title_hi: 'समानता का अधिकार',
    desc_en: 'No discrimination based on gender, religion or caste.',
    desc_hi: 'लिंग, धर्म या जाति के आधार पर कोई भेदभाव नहीं।',
    xp: 75,
    difficulty: 2,
  },
  {
    id: 'identity',
    emoji: '🆔',
    title_en: 'Right to Identity',
    title_hi: 'पहचान का अधिकार',
    desc_en: 'Every child has the right to a name and nationality from birth.',
    desc_hi: 'हर बच्चे को जन्म से नाम और राष्ट्रीयता का अधिकार है।',
    xp: 65,
    difficulty: 1,
  },
  {
    id: 'play',
    emoji: '🎮',
    title_en: 'Right to Play',
    title_hi: 'खेलने का अधिकार',
    desc_en: 'Children have the right to rest, play and leisure activities.',
    desc_hi: 'बच्चों को आराम, खेल और मनोरंजन का अधिकार है।',
    xp: 60,
    difficulty: 1,
  },
];

export default function LearnRights() {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const navigate = useNavigate();

  return (
    <div className="space-y-8 relative overflow-hidden">
      {/* Floating Emoji Animations */}
      {[...Array(7)].map((_, i) => {
        const emojis = ['⭐', '🌟', '✨', '📚', '🧠', '🦸', '🏆'];
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
              ease: "easeInOut",
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
          <EmojiIcon emoji="📖" size={40} /> {lang === 'hi' ? 'अपने अधिकार जानें' : 'Learn Your Rights'}
        </h1>
        <p className="text-muted-foreground">
          {lang === 'hi' ? 'भारतीय कानून के तहत बच्चों के अधिकार' : "Children's rights under Indian law"}
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {rights.map((right, index) => (
          <motion.button
            key={right.id}
            type="button"
            onClick={() => navigate(`/learn/${right.id}`)}
            initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="text-left"
          >
            <GlassCard className="h-full p-5 cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center shadow-lg shrink-0">
                  <EmojiIcon emoji={right.emoji} size={32} />
                </div>
                <div className="space-y-2 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="font-bold text-lg">
                      {lang === 'hi' ? right.title_hi : right.title_en}
                    </h2>
                    <XPBadge xp={right.xp} className="text-[10px]" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {lang === 'hi' ? right.desc_hi : right.desc_en}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <DifficultyDots level={right.difficulty} />
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
