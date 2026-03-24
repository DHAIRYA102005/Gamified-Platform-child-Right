import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { EmojiIcon } from '@/components/EmojiIcon';
import { Shield, Sparkles, Zap } from 'lucide-react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const GlassCard = ({ children, className = '', hover = true }: GlassCardProps) => {
  return (
    <motion.div
      className={`relative bg-card/80 backdrop-blur-xl rounded-3xl border-2 border-border/50 shadow-card overflow-hidden ${className}`}
      whileHover={
        hover
          ? {
              y: -6,
              scale: 1.02,
              transition: { type: 'spring', stiffness: 260, damping: 20 },
            }
          : undefined
      }
    >
      <motion.div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 opacity-0"
        whileHover={hover ? { opacity: 1 } : undefined}
        transition={{ duration: 0.3 }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

interface XPBadgeProps {
  xp: number;
  label?: string;
  className?: string;
}

export const XPBadge = ({ xp, label = 'XP', className = '' }: XPBadgeProps) => {
  return (
    <Badge
      variant="secondary"
      className={`bg-gradient-to-r from-accent to-primary text-white font-bold flex items-center gap-1 px-3 py-1 shadow-md ${className}`}
    >
      <Zap className="w-3 h-3" />
      <span>+{xp}</span>
      <span className="text-xs opacity-90">{label}</span>
    </Badge>
  );
};

interface DifficultyDotsProps {
  level: number; // 1-5
}

export const DifficultyDots = ({ level }: DifficultyDotsProps) => {
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className={`w-2.5 h-2.5 rounded-full ${
            i < level ? 'bg-accent' : 'bg-muted'
          }`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.05 * i }}
        />
      ))}
    </div>
  );
};

interface XPProgressProps {
  currentXP: number;
  xpToNext: number;
  levelLabel: string;
}

export const XPProgress = ({ currentXP, xpToNext, levelLabel }: XPProgressProps) => {
  const progress = Math.min((currentXP / xpToNext) * 100, 100);

  return (
    <GlassCard className="p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            <Sparkles className="w-4 h-4 text-accent" />
          </motion.div>
          <span>{levelLabel}</span>
        </div>
        <Badge variant="outline" className="text-xs">
          {currentXP} / {xpToNext} XP
        </Badge>
      </div>
      <div className="relative h-3 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-secondary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1 }}
          />
        </motion.div>
      </div>
    </GlassCard>
  );
};

interface VideoCardProps {
  title: string;
  youtubeId: string;
  xpReward?: number;
}

export const VideoCard = ({ title, youtubeId, xpReward }: VideoCardProps) => {
  return (
    <GlassCard className="p-4 lg:p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <EmojiIcon emoji="🎥" size={20} />
          <span>Watch &amp; Learn</span>
        </div>
        {typeof xpReward === 'number' && <XPBadge xp={xpReward} className="text-xs" />}
      </div>
      <div className="aspect-video rounded-2xl overflow-hidden border border-border/60 bg-muted">
        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${youtubeId}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </GlassCard>
  );
};

interface MiniMissionProps {
  title: string;
  description: string;
  xpReward: number;
}

export const MiniMissionCard = ({ title, description, xpReward }: MiniMissionProps) => {
  return (
    <GlassCard className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <EmojiIcon emoji="🎯" size={22} />
          <span className="font-semibold text-sm">Mini Mission</span>
        </div>
        <XPBadge xp={xpReward} className="text-xs" />
      </div>
      <div>
        <p className="font-semibold text-sm mb-1">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <div className="flex items-center gap-2 text-xs">
        <input type="checkbox" className="w-4 h-4 rounded border-primary text-primary" />
        <span>Mark as done</span>
      </div>
    </GlassCard>
  );
};

interface HelpSafetyProps {
  className?: string;
}

export const HelpSafetyCard = ({ className = '' }: HelpSafetyProps) => {
  return (
    <GlassCard className={`p-4 space-y-3 border-secondary/40 ${className}`}>
      <div className="flex items-center gap-2">
        <Shield className="w-5 h-5 text-secondary" />
        <span className="font-semibold text-sm">Help &amp; Safety</span>
      </div>
      <p className="text-xs text-muted-foreground">
        In India, you can call <span className="font-semibold">1098 (Childline)</span> any time you feel unsafe
        or see another child in danger. It&apos;s free and confidential.
      </p>
      <p className="text-xs text-muted-foreground">
        In emergencies, you can also call <span className="font-semibold">100 (Police)</span>.
      </p>
    </GlassCard>
  );
};


