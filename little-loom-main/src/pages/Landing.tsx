import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Shield,
  Gamepad2,
  Trophy,
  Users,
  Star,
  Heart,
  Sparkles,
  ArrowRight,
  Award,
  Zap,
  Target,
  Lock,
  CheckCircle2,
  TrendingUp,
  Play,
  Pause,
  BookOpen,
  HelpCircle,
  Theater,
  User,
  ChevronRight,
  Menu,
  X,
  Home,
} from 'lucide-react';
import { EmojiIcon } from '@/components/EmojiIcon';

// ============================================================================
// GAMIFICATION DATA & CONFIGURATION
// ============================================================================

const features = [
  {
    icon: Gamepad2,
    title: 'Fun Games',
    description: 'Learn your rights through exciting adventures and quizzes!',
    color: 'from-primary to-accent',
    xp: 50,
    badge: '🎮',
    mission: 'Game Master',
  },
  {
    icon: Shield,
    title: 'Stay Safe',
    description: 'Know how to protect yourself and get help when needed.',
    color: 'from-secondary to-primary',
    xp: 75,
    badge: '🛡️',
    mission: 'Safety Champion',
  },
  {
    icon: Trophy,
    title: 'Earn Badges',
    description: 'Complete challenges and collect awesome achievements!',
    color: 'from-accent to-success',
    xp: 100,
    badge: '🏆',
    mission: 'Achievement Hunter',
  },
  {
    icon: Users,
    title: 'Help Others',
    description: 'Learn to be a champion for your friends and family.',
    color: 'from-success to-secondary',
    xp: 125,
    badge: '💪',
    mission: 'Community Hero',
  },
];

const floatingEmojis = ['⭐', '🌟', '✨', '🏆', '🎯', '🧠', '💪', '🎨', '📚', '🌈', '🎪', '🎭', '🎲', '🦸', '🦸', '🦸', '🏅', '⚡', '💎', '🎁'];

// Game Flow Steps
const gameFlowSteps = [
  {
    step: 1,
    title: 'Choose Avatar',
    description: 'Pick your hero character and customize your look!',
    emoji: '🧒',
    xp: 10,
    color: 'from-primary to-secondary',
  },
  {
    step: 2,
    title: 'Play Games',
    description: 'Dive into exciting adventures and challenges!',
    emoji: '🎮',
    xp: 25,
    color: 'from-secondary to-accent',
  },
  {
    step: 3,
    title: 'Learn Rights',
    description: 'Discover your rights through interactive stories!',
    emoji: '📚',
    xp: 50,
    color: 'from-accent to-primary',
  },
  {
    step: 4,
    title: 'Earn Badges',
    description: 'Complete missions and unlock achievements!',
    emoji: '🏆',
    xp: 75,
    color: 'from-primary to-accent',
  },
  {
    step: 5,
    title: 'Become a Hero',
    description: 'Level up and help protect children everywhere!',
    emoji: '🦸',
    xp: 100,
    color: 'from-accent to-secondary',
  },
];

// Game Modes
const gameModes = [
  {
    icon: BookOpen,
    title: 'Story Adventures',
    description: 'Embark on epic journeys where you make choices that matter!',
  
    difficulty: 3,
    color: 'from-blue-500 to-indigo-600',
    xp: 100,
  },
  {
    icon: HelpCircle,
    title: 'Quizzes & Challenges',
    description: 'Test your knowledge and earn points with fun quizzes!',
    difficulty: 2,
    color: 'from-purple-500 to-pink-600',
    xp: 75,
  },
  {
    icon: Theater,
    title: 'Role-Play Scenarios',
    description: 'Practice real-life situations in a safe, fun environment!',
    
    difficulty: 4,
    color: 'from-orange-500 to-red-600',
    xp: 125,
  },
  {
    icon: Shield,
    title: 'Safety Missions',
    description: 'Learn how to stay safe and protect yourself and others!',
  
    difficulty: 3,
    color: 'from-green-500 to-emerald-600',
    xp: 150,
  },
];

// Badges Collection
const badges = [
  {
    id: 1,
    emoji: '🛡️',
    name: 'Safety Star',
    description: 'Complete 3 safety missions',
    unlocked: true,
    rarity: 'common',
  },
  {
    id: 2,
    emoji: '📚',
    name: 'Knowledge Keeper',
    description: 'Answer 10 quiz questions correctly',
    unlocked: true,
    rarity: 'common',
  },
  {
    id: 3,
    emoji: '🏆',
    name: 'Champion',
    description: 'Win 5 games in a row',
    unlocked: false,
    rarity: 'rare',
  },
  {
    id: 4,
    emoji: '💪',
    name: 'Rights Defender',
    description: 'Complete all story adventures',
    unlocked: false,
    rarity: 'epic',
  },
  {
    id: 5,
    emoji: '🌟',
    name: 'Super Hero',
    description: 'Reach level 10',
    unlocked: false,
    rarity: 'legendary',
  },
  {
    id: 6,
    emoji: '🎯',
    name: 'Perfect Score',
    description: 'Get 100% on any quiz',
    unlocked: true,
    rarity: 'rare',
  },
  {
    id: 7,
    emoji: '🎨',
    name: 'Creative Explorer',
    description: 'Complete 10 role-play scenarios',
    unlocked: false,
    rarity: 'epic',
  },
  {
    id: 8,
    emoji: '⚡',
    name: 'Speed Runner',
    description: 'Complete a game in under 5 minutes',
    unlocked: false,
    rarity: 'rare',
  },
];

// ============================================================================
// REUSABLE ANIMATED COMPONENTS
// ============================================================================

/**
 * Animated Mascot Component
 * Hero character that responds to mouse movement and scroll
 */
const AnimatedMascot = ({ mouseX, mouseY }: { mouseX: any; mouseY: any }) => {
  const springConfig = { stiffness: 150, damping: 15 };
  const x = useSpring(useTransform(mouseX, [0, 1], [-20, 20]), springConfig);
  const y = useSpring(useTransform(mouseY, [0, 1], [-20, 20]), springConfig);

  return (
    <motion.div
      className="relative w-full max-w-md mx-auto"
      style={{ x, y }}
    >
      {/* Main Hero Character */}
      <motion.div
        className="relative w-80 h-80 mx-auto"
        animate={{
          scale: [1, 1.05, 1],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* Glowing Background Rings */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary/30 via-secondary/30 to-accent/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        
        {/* Rotating Rings */}
        <motion.div
          className="absolute inset-0 border-4 border-primary/20 rounded-full"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute inset-4 border-4 border-secondary/20 rounded-full"
          animate={{ rotate: [360, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        />

        {/* Hero Emoji */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <EmojiIcon emoji="🦸" textSize="9xl" className="filter drop-shadow-2xl" />
        </motion.div>
      </motion.div>

      {/* Floating Badges Around Hero */}
      {[
        { emoji: '🛡️', position: 'top-0 left-0', delay: 0 },
        { emoji: '📖', position: 'top-0 right-0', delay: 0.5 },
        { emoji: '🏅', position: 'bottom-0 left-0', delay: 1 },
        { emoji: '💪', position: 'bottom-0 right-0', delay: 1.5 },
      ].map((badge, i) => (
        <motion.div
          key={i}
          className={`absolute ${badge.position} w-20 h-20 bg-card/80 backdrop-blur-md rounded-3xl shadow-2xl border-2 border-primary/20 flex items-center justify-center`}
          animate={{
            y: [0, -15, 0],
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: badge.delay,
            ease: 'easeInOut',
          }}
          whileHover={{
            scale: 1.2,
            rotate: 360,
            transition: { duration: 0.5 },
          }}
        >
          <EmojiIcon emoji={badge.emoji} size={32} />
        </motion.div>
      ))}
    </motion.div>
  );
};

/**
 * Interactive Floating Emoji
 * Responds to mouse movement for playful interaction
 */
const InteractiveFloatingEmoji = ({
  emoji,
  index,
  mouseX,
  mouseY,
}: {
  emoji: string;
  index: number;
  mouseX: any;
  mouseY: any;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const isSuperhero = emoji === '🦸';

  // Calculate distance from mouse to emoji for interactive effect
  // Use normalized mouse position (0-1) to create subtle movement
  const x = useTransform(mouseX, [0, 1], [-15, 15]);
  const y = useTransform(mouseY, [0, 1], [-15, 15]);

  // Enhanced animation for superheroes - more dynamic flying
  const superheroAnimation = isSuperhero ? {
    y: [0, -40, -20, -40, 0],
    x: [0, Math.sin(index) * 30, Math.cos(index) * 20, Math.sin(index) * 30, 0],
    rotate: [0, 25, -25, 25, 0],
    scale: [1, 1.2, 1.1, 1.2, 1],
  } : {
    y: [0, -25, 0],
    rotate: [0, 15, -15, 0],
    scale: isHovered ? [1, 1.3, 1] : [1, 1.1, 1],
  };

  return (
    <motion.div
      ref={ref}
      className={`absolute ${isSuperhero ? 'opacity-25 hover:opacity-60' : 'opacity-30 hover:opacity-70'} cursor-pointer transition-opacity`}
      style={{
        left: `${10 + index * 8}%`,
        top: `${15 + (index % 4) * 22}%`,
        x,
        y,
      }}
      animate={superheroAnimation}
      transition={{
        duration: isSuperhero ? 6 + index * 0.4 : 4 + index * 0.3,
        repeat: Infinity,
        ease: isSuperhero ? 'easeInOut' : 'easeInOut',
        delay: index * 0.2,
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.5, zIndex: 10 }}
      whileTap={{ scale: 0.9 }}
    >
      <EmojiIcon emoji={emoji} size={isSuperhero ? 45 : 40} animated={!isSuperhero} />
    </motion.div>
  );
};

/**
 * Gamified Feature Card
 * Mission-style card with XP, badges, and interactive animations
 */
const GamifiedFeatureCard = ({
  feature,
  index,
}: {
  feature: (typeof features)[0];
  index: number;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="group relative"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{
        delay: index * 0.15,
        type: 'spring',
        stiffness: 100,
        damping: 15,
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Glassmorphism Card */}
      <motion.div
        className="relative bg-card/80 backdrop-blur-xl p-8 rounded-3xl shadow-card border-2 border-border/50 overflow-hidden"
        whileHover={{
          y: -8,
          scale: 1.02,
          transition: { type: 'spring', stiffness: 300, damping: 20 },
        }}
        style={{
          boxShadow: isHovered
            ? '0 20px 60px -12px hsl(var(--primary) / 0.3), 0 0 40px -10px hsl(var(--primary-glow) / 0.2)'
            : undefined,
        }}
      >
        {/* Gradient Background Glow */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
        />

        {/* XP Badge */}
        <motion.div
          className="absolute top-4 right-4"
          initial={{ scale: 0, rotate: -180 }}
          whileInView={{ scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.15 + 0.3, type: 'spring' }}
        >
          <Badge
            variant="secondary"
            className="bg-gradient-to-r from-accent to-primary text-white font-bold text-sm px-3 py-1 shadow-lg"
          >
            <Zap className="w-3 h-3 mr-1" />
            +{feature.xp} XP
          </Badge>
        </motion.div>

        {/* Mission Icon Container */}
        <motion.div
          className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg relative overflow-hidden`}
          whileHover={{
            scale: 1.15,
            rotate: [0, -10, 10, -10, 0],
            transition: { duration: 0.5 },
          }}
        >
          {/* Shine Effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
              ease: 'easeInOut',
            }}
          />
          <feature.icon className="w-10 h-10 text-white relative z-10" />
        </motion.div>

        {/* Mission Badge Preview */}
        <motion.div
          className="absolute top-4 left-4 opacity-20 group-hover:opacity-40 transition-opacity"
          animate={{
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: index * 0.2,
          }}
        >
          <EmojiIcon emoji={feature.badge} size={32} />
        </motion.div>

        {/* Content */}
        <div className="relative z-10">
          <motion.h3
            className="text-2xl font-extrabold mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"
            whileHover={{ scale: 1.05 }}
          >
            {feature.title}
          </motion.h3>

          {/* Mission Label */}
          <motion.div
            className="flex items-center gap-2 mb-4"
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.15 + 0.2 }}
          >
            <Target className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">{feature.mission}</span>
          </motion.div>

          <p className="text-muted-foreground leading-relaxed">{feature.description}</p>

          {/* Progress Indicator */}
          <motion.div
            className="mt-6 flex items-center gap-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.15 + 0.4 }}
          >
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                className={`h-full bg-gradient-to-r ${feature.color} rounded-full`}
                initial={{ width: 0 }}
                whileInView={{ width: '75%' }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 + 0.5, duration: 1, ease: 'easeOut' }}
              />
            </div>
            <span className="text-xs font-bold text-muted-foreground">75%</span>
          </motion.div>
        </div>

        {/* Hover Glow Effect */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 rounded-3xl blur-2xl`}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </motion.div>
  );
};

/**
 * Animated Text with Stagger Effect
 * Word-by-word or line-by-line animation
 */
const AnimatedText = ({
  text,
  className = '',
  delay = 0,
  splitBy = 'word',
}: {
  text: string;
  className?: string;
  delay?: number;
  splitBy?: 'word' | 'line';
}) => {
  const words = splitBy === 'word' ? text.split(' ') : [text];

  return (
    <h1 className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: delay + i * 0.1,
            type: 'spring',
            stiffness: 100,
            damping: 12,
          }}
        >
          {word}
          {splitBy === 'word' && i < words.length - 1 && '\u00A0'}
        </motion.span>
      ))}
    </h1>
  );
};

/**
 * Gamified CTA Button
 * Game-like button with squash effect and success animation
 */
const GamifiedButton = ({
  children,
  onClick,
  variant = 'default',
  size = 'lg',
  className = '',
}: {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'secondary';
  size?: 'lg' | 'sm';
  className?: string;
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleClick = () => {
    setIsPressed(true);
    setShowSuccess(true);
    setTimeout(() => {
      setIsPressed(false);
      setShowSuccess(false);
    }, 600);
    onClick();
  };

  return (
    <motion.div
      className="relative"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        animate={{
          scale: showSuccess ? [1, 1.2, 1] : 1,
          boxShadow: showSuccess
            ? [
                '0 0 0 0px hsl(var(--primary) / 0.4)',
                '0 0 0 20px hsl(var(--primary) / 0)',
                '0 0 0 0px hsl(var(--primary) / 0)',
              ]
            : undefined,
        }}
        transition={{ duration: 0.6 }}
      >
        <Button
          size={size}
          variant={variant}
          className={`relative overflow-hidden ${className}`}
          onClick={handleClick}
          onMouseDown={() => setIsPressed(true)}
          onMouseUp={() => setIsPressed(false)}
          onMouseLeave={() => setIsPressed(false)}
        >
          {/* Shine Effect on Hover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            initial={{ x: '-100%' }}
            whileHover={{ x: '200%' }}
            transition={{ duration: 0.6 }}
          />

          {/* Button Content */}
          <span className="relative z-10 flex items-center">
            {children}
          </span>

          {/* Success Particles */}
          {showSuccess && (
            <>
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: 1, scale: 0 }}
                  animate={{
                    opacity: [1, 0],
                    scale: [0, 1.5],
                    x: Math.cos((i * 60 * Math.PI) / 180) * 50,
                    y: Math.sin((i * 60 * Math.PI) / 180) * 50,
                  }}
                  transition={{ duration: 0.6, delay: i * 0.05 }}
                >
                  <Sparkles className="w-4 h-4 text-white" />
                </motion.div>
              ))}
            </>
          )}
        </Button>
      </motion.div>
    </motion.div>
  );
};

/**
 * XP Progress Bar Component
 * Shows level and progress with smooth animations
 */
const XPProgressBar = () => {
  const xpProgress = 65; // Example: 65% to next level
  const currentLevel = 1;
  const currentXP = 650;
  const xpToNext = 1000;

  return (
    <motion.div
      className="w-full max-w-md bg-card/60 backdrop-blur-md rounded-2xl p-4 border-2 border-primary/20 shadow-lg"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, type: 'spring' }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            <Star className="w-5 h-5 text-accent fill-accent" />
          </motion.div>
          <span className="font-bold text-sm">
            Level {currentLevel}: <span className="text-primary">Rights Explorer</span> <EmojiIcon emoji="🦸" size={16} className="inline ml-1" />
          </span>
        </div>
        <Badge variant="secondary" className="bg-gradient-to-r from-accent to-primary text-white">
          <TrendingUp className="w-3 h-3 mr-1" />
          {currentXP} / {xpToNext} XP
        </Badge>
      </div>
      <div className="relative h-3 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-secondary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${xpProgress}%` }}
          transition={{ delay: 0.5, duration: 1.5, ease: 'easeOut' }}
        >
          {/* Shimmer Effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 1,
              ease: 'easeInOut',
            }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

/**
 * Child Safety Trust Indicator
 * Friendly shield visuals and safe space badges
 */
const SafetyTrustIndicator = () => {
  return (
    <motion.div
      className="flex items-center gap-3 bg-card/60 backdrop-blur-md rounded-2xl p-4 border-2 border-secondary/30 shadow-md"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4, type: 'spring' }}
      whileHover={{ scale: 1.05 }}
    >
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Shield className="w-8 h-8 text-secondary" />
      </motion.div>
      <div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm">Safe Space</span>
          <Badge variant="outline" className="text-xs bg-success/10 border-success/30 text-success">
            <Lock className="w-3 h-3 mr-1" />
            Verified
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">Your privacy and safety are protected</p>
      </div>
    </motion.div>
  );
};

/**
 * Video Hero Component
 * Premium video hero with overlay UI elements
 */
const VideoHero = ({ mouseX, mouseY }: { mouseX: any; mouseY: any }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const springConfig = { stiffness: 150, damping: 15 };
  const x = useSpring(useTransform(mouseX, [0, 1], [-15, 15]), springConfig);
  const y = useSpring(useTransform(mouseY, [0, 1], [-15, 15]), springConfig);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <motion.div
      className="relative w-full max-w-2xl mx-auto"
      style={{ x, y }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5, type: 'spring', stiffness: 100 }}
    >
      {/* Video Container */}
      <motion.div
        className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-primary/20"
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          boxShadow: '0 25px 50px -12px hsl(var(--primary) / 0.4), 0 0 60px -15px hsl(var(--primary-glow) / 0.3)',
        }}
      >
        {/* Video Element */}
        <div className="relative w-full aspect-video bg-gradient-to-br from-primary/30 via-secondary/30 to-accent/30">
          {/* Placeholder Video Background - Animated Gradient */}
          <motion.div
            className="absolute inset-0"
            animate={{
              background: [
                'linear-gradient(135deg, hsl(var(--primary) / 0.4), hsl(var(--secondary) / 0.4), hsl(var(--accent) / 0.4))',
                'linear-gradient(135deg, hsl(var(--secondary) / 0.4), hsl(var(--accent) / 0.4), hsl(var(--primary) / 0.4))',
                'linear-gradient(135deg, hsl(var(--accent) / 0.4), hsl(var(--primary) / 0.4), hsl(var(--secondary) / 0.4))',
              ],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
          
          {/* Animated Game Interface Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <EmojiIcon emoji="🎮" size={96} />
            </motion.div>
          </div>

          {/* Floating Game Elements */}
          {['✨', '⭐', '🎯', '🏆'].map((emoji, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${20 + i * 20}%`,
                top: `${15 + (i % 2) * 60}%`,
              }}
              animate={{
                y: [0, -20, 0],
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            >
              <EmojiIcon emoji={emoji} size={32} animated />
            </motion.div>
          ))}

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/40 to-transparent" />

          {/* Overlay UI Elements */}
          <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-3">
            {/* Level Badge */}
            <motion.div
              className="bg-card/90 backdrop-blur-md rounded-2xl p-3 border-2 border-primary/30 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-accent fill-accent" />
                <span className="font-bold text-sm">
                  Level 1: <span className="text-primary">Rights Explorer</span> 
                  
                </span>
              </div>
            </motion.div>

            {/* XP Counter */}
            <motion.div
              className="bg-card/90 backdrop-blur-md rounded-2xl p-3 border-2 border-accent/30 shadow-lg"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9, type: 'spring' }}
            >
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <Zap className="w-5 h-5 text-accent" />
                </motion.div>
                <span className="font-bold text-sm">
                  <motion.span
                    key={Math.random()}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                  >
                    +10 XP
                  </motion.span>
                </span>
              </div>
            </motion.div>
          </div>

          {/* Play/Pause Button */}
          <motion.button
            className="absolute top-4 right-4 w-14 h-14 bg-card/90 backdrop-blur-md rounded-full flex items-center justify-center border-2 border-primary/30 shadow-lg hover:bg-card transition-colors"
            onClick={togglePlay}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.1 }}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 text-primary" />
            ) : (
              <Play className="w-6 h-6 text-primary" />
            )}
          </motion.button>

          {/* Floating Emojis Overlay */}
          <div className="absolute top-4 left-4">
            <motion.div
              className="text-3xl"
              animate={{
                rotate: [0, 15, -15, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              
            </motion.div>
          </div>
          <div className="absolute top-1/2 right-4">
            <motion.div
              className="text-3xl"
              animate={{
                rotate: [0, -15, 15, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                delay: 0.5,
              }}
            >
              
            </motion.div>
          </div>
          <div className="absolute bottom-1/4 left-1/3">
           <motion.div
              className="text-3xl"
              animate={{
                rotate: [0, 20, -20, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: 1,
              }}
            >
              <EmojiIcon emoji="🦸" size={32} />
            </motion.div> 
          </div>
        </div>
      </motion.div>

      {/* Glow Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 rounded-3xl blur-3xl -z-10"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </motion.div>
  );
};

/**
 * Game Flow Step Card
 * Shows individual step in the game flow
 */
const GameFlowStepCard = ({
  step,
  index,
  isLast,
}: {
  step: (typeof gameFlowSteps)[0];
  index: number;
  isLast: boolean;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative flex-1"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        delay: index * 0.15,
        type: 'spring',
        stiffness: 100,
        damping: 15,
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.div
        className="relative bg-card/80 backdrop-blur-xl p-6 rounded-3xl shadow-card border-2 border-border/50 h-full"
        whileHover={{
          y: -8,
          scale: 1.05,
          transition: { type: 'spring', stiffness: 300, damping: 20 },
        }}
      >
        {/* Step Number Badge */}
        <motion.div
          className={`absolute -top-4 left-6 w-12 h-12 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center text-white font-bold text-lg shadow-lg border-4 border-background`}
          animate={isHovered ? { rotate: 360, scale: 1.1 } : { rotate: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {step.step}
        </motion.div>

        {/* Emoji */}
        <motion.div
          className="mb-4 text-center flex items-center justify-center"
          animate={isHovered ? { scale: 1.2, rotate: 10 } : { scale: 1, rotate: 0 }}
          transition={{ duration: 0.3 }}
        >
          <EmojiIcon emoji={step.emoji} size={60} />
        </motion.div>

        {/* Content */}
        <div className="text-center">
          <h3 className="text-xl font-extrabold mb-2">{step.title}</h3>
          <p className="text-muted-foreground text-sm mb-4">{step.description}</p>

          {/* XP Badge */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.15 + 0.3, type: 'spring' }}
          >
            <Badge
              variant="secondary"
              className={`bg-gradient-to-r ${step.color} text-white font-bold`}
            >
              <Zap className="w-3 h-3 mr-1" />
              +{step.xp} XP
            </Badge>
          </motion.div>
        </div>

        {/* Hover Glow */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 rounded-3xl blur-2xl -z-10`}
          animate={{ opacity: isHovered ? 0.2 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>

      {/* Connector Arrow */}
      {!isLast && (
        <motion.div
          className="absolute top-1/2 -right-6 z-10 hidden lg:block"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.15 + 0.5 }}
        >
          <motion.div
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronRight className="w-12 h-12 text-primary" />
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

/**
 * Game Mode Card
 * Showcases different game modes with difficulty indicators
 */
const GameModeCard = ({
  mode,
  index,
}: {
  mode: (typeof gameModes)[0];
  index: number;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="group relative"
      initial={{ opacity: 0, y: 50, rotateY: -15 }}
      whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{
        delay: index * 0.15,
        type: 'spring',
        stiffness: 100,
        damping: 15,
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.div
        className={`relative bg-card/80 backdrop-blur-xl p-8 rounded-3xl shadow-card border-2 border-border/50 overflow-hidden h-full`}
        whileHover={{
          y: -12,
          rotateY: 5,
          rotateX: 5,
          transition: { type: 'spring', stiffness: 300, damping: 20 },
        }}
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Gradient Background */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${mode.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
        />

        {/* Large Emoji */}
        <motion.div
          className="mb-6 text-center flex items-center justify-center"
          animate={isHovered ? { scale: 1.2, rotate: 10 } : { scale: 1, rotate: 0 }}
          transition={{ duration: 0.3 }}
        >
          <EmojiIcon emoji={mode.emoji} size={72} />
        </motion.div>

        {/* Icon */}
        <motion.div
          className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${mode.color} flex items-center justify-center mb-4 mx-auto shadow-lg`}
          whileHover={{
            scale: 1.2,
            rotate: [0, -10, 10, -10, 0],
            transition: { duration: 0.5 },
          }}
        >
          <mode.icon className="w-8 h-8 text-white" />
        </motion.div>

        {/* Content */}
        <div className="text-center relative z-10">
          <h3 className="text-2xl font-extrabold mb-3">{mode.title}</h3>
          <p className="text-muted-foreground mb-6 leading-relaxed">{mode.description}</p>

          {/* Difficulty Indicator */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-xs font-semibold text-muted-foreground">Difficulty:</span>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 + 0.2 + i * 0.1, type: 'spring' }}
                >
                  <Star
                    className={`w-4 h-4 ${
                      i < mode.difficulty
                        ? 'text-accent fill-accent'
                        : 'text-muted fill-muted'
                    }`}
                  />
                </motion.div>
              ))}
            </div>
          </div>

          {/* XP Badge */}
          <Badge
            variant="secondary"
            className={`bg-gradient-to-r ${mode.color} text-white font-bold`}
          >
            <Zap className="w-3 h-3 mr-1" />
            +{mode.xp} XP
          </Badge>
        </div>

        {/* Hover Glow */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${mode.color} opacity-0 group-hover:opacity-15 rounded-3xl blur-3xl`}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </motion.div>
  );
};

/**
 * Badge Card Component
 * Shows individual badge with locked/unlocked states
 */
const BadgeCard = ({
  badge,
  index,
}: {
  badge: (typeof badges)[0];
  index: number;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const rarityColors = {
    common: 'from-gray-400 to-gray-600',
    rare: 'from-blue-400 to-blue-600',
    epic: 'from-purple-400 to-purple-600',
    legendary: 'from-yellow-400 to-orange-600',
  };

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, scale: 0, rotate: -180 }}
      whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        delay: index * 0.1,
        type: 'spring',
        stiffness: 200,
        damping: 15,
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.div
        className={`relative w-32 h-32 rounded-full bg-card/80 backdrop-blur-xl shadow-card border-4 ${
          badge.unlocked
            ? `border-primary/50`
            : 'border-muted/50 grayscale opacity-60'
        } flex flex-col items-center justify-center cursor-pointer overflow-hidden`}
        whileHover={{
          scale: 1.15,
          rotate: badge.unlocked ? 360 : 0,
          transition: { duration: 0.5 },
        }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Badge Emoji */}
        <motion.div
          className="mb-1 flex items-center justify-center"
          animate={
            isHovered && badge.unlocked
              ? {
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0],
                }
              : {}
          }
          transition={{ duration: 0.5 }}
        >
          <EmojiIcon emoji={badge.emoji} size={48} />
        </motion.div>

        {/* Lock Icon for Locked Badges */}
        {!badge.unlocked && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
          >
            <Lock className="w-8 h-8 text-muted-foreground" />
          </motion.div>
        )}

        {/* Sparkles on Hover (Unlocked Only) */}
        {isHovered && badge.unlocked && (
          <>
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 1, scale: 0 }}
                animate={{
                  opacity: [1, 0],
                  scale: [0, 1.5],
                  x: Math.cos((i * 45 * Math.PI) / 180) * 60,
                  y: Math.sin((i * 45 * Math.PI) / 180) * 60,
                }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
              >
                <Sparkles className="w-4 h-4 text-accent" />
              </motion.div>
            ))}
          </>
        )}

        {/* Rarity Ring */}
        <motion.div
          className={`absolute inset-0 rounded-full border-4 bg-gradient-to-br ${rarityColors[badge.rarity]} opacity-0 group-hover:opacity-30`}
          animate={
            isHovered && badge.unlocked
              ? {
                  scale: [1, 1.2, 1],
                  opacity: [0, 0.3, 0],
                }
              : {}
          }
          transition={{ duration: 1, repeat: Infinity }}
        />
      </motion.div>

      {/* Tooltip */}
      <motion.div
        className="absolute top-full left-1/2 -translate-x-1/2 mt-4 bg-card/95 backdrop-blur-md rounded-xl p-3 shadow-2xl border-2 border-border min-w-[200px] z-20"
        initial={{ opacity: 0, y: -10, scale: 0.8 }}
        animate={{
          opacity: isHovered ? 1 : 0,
          y: isHovered ? 0 : -10,
          scale: isHovered ? 1 : 0.8,
        }}
        transition={{ duration: 0.2 }}
      >
        <h4 className="font-bold text-sm mb-1 text-center">{badge.name}</h4>
        <p className="text-xs text-muted-foreground text-center">{badge.description}</p>
        {!badge.unlocked && (
          <Badge
            variant="outline"
            className="mt-2 mx-auto block w-fit text-xs"
          >
            <Lock className="w-3 h-3 mr-1" />
            Locked
          </Badge>
        )}
      </motion.div>
    </motion.div>
  );
};

// ============================================================================
// MAIN LANDING PAGE COMPONENT
// ============================================================================

export default function Landing() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: containerRef });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Mouse position for interactive effects
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'hi' : 'en');
  };

  // Navigation sections
  const navSections = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'features', label: 'Features', icon: Star },
    { id: 'how-it-works', label: 'How It Works', icon: BookOpen },
    { id: 'game-modes', label: 'Game Modes', icon: Gamepad2 },
    { id: 'badges', label: 'Badges', icon: Trophy },
  ];

  // Scroll to section function
  const scrollToSection = (sectionId: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Navbar height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  // Parallax transforms for scroll effects
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background overflow-x-hidden relative"
      onMouseMove={handleMouseMove}
    >
      {/* Animated Background with Parallax */}
      <motion.div
        className="fixed inset-0 pointer-events-none overflow-hidden -z-10"
        style={{ y: backgroundY }}
      >
        {/* Gradient Orbs */}
        <motion.div
          className="absolute top-20 left-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-accent/15 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        />

        {/* Interactive Floating Emojis */}
        {floatingEmojis.map((emoji, i) => (
          <InteractiveFloatingEmoji
            key={i}
            emoji={emoji}
            index={i}
            mouseX={mouseX}
            mouseY={mouseY}
          />
        ))}
      </motion.div>

      {/* Header */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 w-full"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        {/* Glassmorphism Navbar Background */}
        <div className="absolute inset-0 bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm" />
        
        <div className="relative container mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo Section */}
            <motion.div
              className="flex items-center space-x-3 cursor-pointer group"
              whileHover={{ scale: 1.02 }}
              onClick={() => scrollToSection('home')}
            >
              <motion.div
                className="relative w-12 h-12 bg-gradient-to-br from-primary via-secondary to-accent rounded-xl flex items-center justify-center shadow-lg overflow-hidden"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Animated Background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent"
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  style={{ backgroundSize: '200% 200%' }}
                />
                {/* Shine Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 1 }}
                />
                <Star className="w-6 h-6 text-white relative z-10" />
              </motion.div>
              <div className="flex flex-col">
                <motion.span
                  className="text-2xl font-extrabold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-tight"
                  whileHover={{ scale: 1.05 }}
                >
                  LittleLoom
                </motion.span>
                <span className="text-xs text-muted-foreground font-medium">Empowering Children</span>
              </div>
            </motion.div>

            {/* Desktop Navigation Menu */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navSections.map((section) => (
                <motion.button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-primary/10 hover:text-primary transition-colors relative group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <section.icon className="w-4 h-4" />
                  <span>{section.label}</span>
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent scale-x-0 group-hover:scale-x-100 transition-transform"
                  />
                </motion.button>
              ))}
            </nav>

            {/* Navigation Actions */}
            <motion.div
              className="flex items-center space-x-2 md:space-x-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* Language Toggle */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleLanguage}
                  className="hidden sm:flex items-center gap-2 text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  <span className="text-lg">{i18n.language === 'en' ? '🇮🇳' : '🇬🇧'}</span>
                  <span className="font-medium">{i18n.language === 'en' ? 'हिंदी' : 'English'}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleLanguage}
                  className="sm:hidden p-2"
                >
                  <span className="text-lg">{i18n.language === 'en' ? '🇮🇳' : '🇬🇧'}</span>
                </Button>
              </motion.div>

              {/* Mobile Menu Toggle */}
              <motion.button
                className="lg:hidden p-2 rounded-lg hover:bg-primary/10 transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6 text-foreground" />
                ) : (
                  <Menu className="w-6 h-6 text-foreground" />
                )}
              </motion.button>

              {/* Login Button */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => navigate('/auth')}
                  className="bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border-0"
                  size="default"
                >
                  <User className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">{t('auth.login')}</span>
                  <span className="sm:hidden">Login</span>
                </Button>
              </motion.div>
            </motion.div>
          </div>

          {/* Mobile Navigation Menu */}
          <motion.nav
            className="lg:hidden overflow-hidden"
            initial={false}
            animate={{
              height: isMobileMenuOpen ? 'auto' : 0,
              opacity: isMobileMenuOpen ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            <div className="py-4 space-y-2 border-t border-border/50 mt-2">
              {navSections.map((section, index) => (
                <motion.button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{
                    opacity: isMobileMenuOpen ? 1 : 0,
                    x: isMobileMenuOpen ? 0 : -20,
                  }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <section.icon className="w-5 h-5" />
                  <span>{section.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.nav>
        </div>
      </motion.header>

      {/* Full Screen Background Video Section */}
      <section id="home" className="relative w-full h-screen overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0 w-full h-full z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            style={{ zIndex: 0 }}
            onError={(e) => {
              console.error('Video failed to load:', e);
            }}
          >
            <source src="/videos/Animated_Educational_Background_Video_Creation.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          {/* Fallback gradient background if video doesn't load */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-secondary/30 to-accent/30 z-0 pointer-events-none" />
        </div>

        {/* Minimal Overlay Gradient - Very light for maximum video visibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/5 via-transparent to-background/15 z-[1]" />

        {/* Content Overlay */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 100 }}
            className="max-w-4xl mx-auto"
          >
            {/* Main Title */}
            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold mb-6 leading-tight drop-shadow-2xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 100 }}
            >
              <span className="bg-gradient-to-r from-white via-white to-white bg-clip-text text-transparent" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.5), 0 2px 10px rgba(0,0,0,0.3)' }}>
                LittleLoom
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="text-xl md:text-2xl lg:text-3xl text-white mb-8 max-w-3xl mx-auto leading-relaxed font-semibold drop-shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              style={{ textShadow: '0 2px 15px rgba(0,0,0,0.6), 0 1px 5px rgba(0,0,0,0.4)' }}
            >
              Empowering children through interactive learning and play
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <GamifiedButton
                onClick={() => navigate('/auth')}
                className="text-lg px-10 py-7 shadow-2xl bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90 text-white font-bold"
              >
                <Gamepad2 className="mr-2 w-5 h-5" />
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </GamifiedButton>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-10 py-7 bg-white/10 backdrop-blur-md border-2 border-white/30 text-white hover:bg-white/20 font-bold"
                  onClick={() => scrollToSection('features')}
                >
                  <BookOpen className="mr-2 w-5 h-5" />
                  Learn More
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Simple Scroll Indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-white text-sm font-semibold drop-shadow-lg" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>Scroll to explore</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ChevronRight className="w-6 h-6 text-white drop-shadow-lg rotate-90" style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.5))' }} />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Hero Section */}
      <section id="hero" className="relative z-10 container mx-auto px-4 pt-8 pb-24">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <motion.div
            className="flex-1 text-center lg:text-left"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
            style={{ y: heroY }}
          >
            {/* Badge */}
            <motion.div
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-accent/20 to-primary/20 backdrop-blur-md text-foreground px-5 py-2.5 rounded-full mb-6 border border-primary/20 shadow-md"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              whileHover={{ scale: 1.1 }}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkles className="w-4 h-4 text-primary" />
              </motion.div>
              <span className="font-bold text-sm">Learn Your Rights Through Play! </span>
            </motion.div>

            {/* Animated Title */}
            <div className="mb-6">
              <AnimatedText
                text="Every Child Has Rights!"
                className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight"
                delay={0.3}
              />
              <motion.div
                className="mt-4 flex items-center justify-center"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <EmojiIcon emoji="✨" size={60} animated />
              </motion.div>
            </div>

            <motion.p
              className="text-xl md:text-2xl text-muted-foreground max-w-xl mb-8 mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              Join thousands of young heroes learning about their rights, staying safe, and making
              the world a better place — all while having fun! 
            </motion.p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <GamifiedButton
                onClick={() => navigate('/auth')}
                className="text-lg px-10 py-7 shadow-2xl bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90 text-white font-bold"
              >
                <Gamepad2 className="mr-2 w-5 h-5" />
                Start Your Adventure
                <ArrowRight className="ml-2 w-5 h-5" />
              </GamifiedButton>
            </div>

            {/* XP Progress Bar */}
            <div className="flex justify-center lg:justify-start mb-6">
              <XPProgressBar />
            </div>

            {/* Safety Trust Indicator */}
            <div className="flex justify-center lg:justify-start mb-8">
              <SafetyTrustIndicator />
            </div>

            {/* Social Proof */}
            <motion.div
              className="flex items-center gap-6 justify-center lg:justify-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <div className="flex -space-x-3">
                {['🧒', '👧', '👦', '🧒'].map((emoji, i) => (
                  <motion.div
                    key={i}
                    className="w-12 h-12 bg-card rounded-full border-2 border-background flex items-center justify-center shadow-lg"
                    initial={{ opacity: 0, scale: 0, rotate: -180 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{
                      delay: 0.9 + i * 0.1,
                      type: 'spring',
                      stiffness: 200,
                    }}
                    whileHover={{ scale: 1.2, zIndex: 10 }}
                  >
                    <EmojiIcon emoji={emoji} size={20} />
                  </motion.div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                <span className="font-bold text-foreground text-lg">1000+</span> young heroes
                already learning! <EmojiIcon emoji="🎉" size={16} className="inline" />
              </p>
            </motion.div>
          </motion.div>

          {/* Video Hero */}
          <motion.div
            className="flex-1 relative order-first lg:order-last"
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 100 }}
          >
            <VideoHero mouseX={mouseX} mouseY={mouseY} />
          </motion.div>
        </div>
      </section>

      {/* Gamified Features Section */}
      <section id="features" className="relative z-10 container mx-auto px-4 py-24">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ type: 'spring', stiffness: 100 }}
        >
          <motion.div
            className="inline-block mb-4"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <EmojiIcon emoji="🎯" size={48} />
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
            Why Join <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">LittleLoom</span>?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Complete missions, earn XP, and unlock badges as you learn! <EmojiIcon emoji="🏆" size={20} className="inline" />
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, i) => (
            <GamifiedFeatureCard key={i} feature={feature} index={i} />
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative z-10 container mx-auto px-4 py-24">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ type: 'spring', stiffness: 100 }}
        >
          <motion.div
            className="inline-block mb-4"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <EmojiIcon emoji="🎮" size={48} />
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
            How It <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Works</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your journey from explorer to hero in 5 simple steps! 
          </p>
        </motion.div>

        {/* Game Flow Steps */}
        <div className="relative">
          {/* Progress Line (Desktop Only) */}
          <motion.div
            className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-secondary -translate-y-1/2 z-0"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            style={{ originX: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{
                x: ['-100%', '200%'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-4 relative z-10">
            {gameFlowSteps.map((step, i) => (
              <GameFlowStepCard
                key={step.step}
                step={step}
                index={i}
                isLast={i === gameFlowSteps.length - 1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Game Modes Section */}
      <section id="game-modes" className="relative z-10 container mx-auto px-4 py-24 bg-gradient-to-b from-background via-muted/10 to-background">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ type: 'spring', stiffness: 100 }}
        >
          <motion.div
            className="inline-block mb-4"
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <EmojiIcon emoji="🎯" size={48} />
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
            Choose Your <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Adventure</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Multiple game modes to suit every learning style! Pick what excites you most! 🌟
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {gameModes.map((mode, i) => (
            <GameModeCard key={i} mode={mode} index={i} />
          ))}
        </div>
      </section>

      {/* Badges & Rewards Showcase */}
      <section id="badges" className="relative z-10 container mx-auto px-4 py-24">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ type: 'spring', stiffness: 100 }}
        >
          <motion.div
            className="inline-block mb-4"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          >
            <EmojiIcon emoji="🏆" size={48} />
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
            Collect <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Badges</span> & Rewards
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Unlock amazing achievements as you progress! Each badge tells a story of your journey! ✨
          </p>
        </motion.div>

        {/* Badge Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8 justify-items-center max-w-6xl mx-auto">
          {badges.map((badge, i) => (
            <BadgeCard key={badge.id} badge={badge} index={i} />
          ))}
        </div>

        {/* Progress Stats */}
        <motion.div
          className="mt-16 bg-card/60 backdrop-blur-md rounded-3xl p-8 border-2 border-primary/20 shadow-lg max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, type: 'spring' }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            {[
              { label: 'Badges Unlocked', value: '3/8', emoji: '🏅', color: 'from-primary to-accent' },
              { label: 'Total XP Earned', value: '1,250', emoji: '⭐', color: 'from-accent to-secondary' },
              { label: 'Games Completed', value: '12', emoji: '🎮', color: 'from-secondary to-primary' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                className="flex flex-col items-center gap-3"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + i * 0.1, type: 'spring' }}
              >
                <motion.div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                >
                  <EmojiIcon emoji={stat.emoji} size={28} />
                </motion.div>
                <div>
                  <p className="text-3xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground font-semibold">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Enhanced CTA Section */}
      <section id="cta" className="relative z-10 container mx-auto px-4 py-24">
        <motion.div
          className="relative bg-gradient-to-br from-primary via-secondary to-accent rounded-[3rem] p-12 md:p-16 text-center overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ type: 'spring', stiffness: 100 }}
        >
          {/* Animated Background Stars & Emojis */}
          <div className="absolute inset-0 opacity-20">
            {[...Array(25)].map((_, i) => {
              // Mix of stars, trophies, gems, and superheroes
              const emojiTypes = ['⭐', '🌟', '✨', '🏆', '💎', '🦸', '🎯', '🧠'];
              const emoji = emojiTypes[i % emojiTypes.length];
              const isIcon = ['🏆', '💎', '🦸', '🎯', '🧠'].includes(emoji);
              
              return (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.15, 0.5, 0.15],
                    rotate: [0, 180, 360],
                    y: [0, -25, 0],
                    x: [0, Math.sin(i * 0.3) * 20, 0],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: i * 0.08,
                  }}
                >
                  {isIcon ? (
                    <EmojiIcon emoji={emoji} size={28} animated />
                  ) : (
                    <span className="text-3xl md:text-4xl">{emoji}</span>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Content */}
          <div className="relative z-10">
            <motion.div
              className="mb-6 inline-block"
              animate={{
                rotate: [0, 15, -15, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <EmojiIcon emoji="🚀" size={96} animated />
            </motion.div>
            <motion.h2
              className="text-4xl md:text-5xl font-extrabold text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Ready to Become a LittleLoom Champion?
            </motion.h2>
            <motion.p
              className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Start your journey today and learn how to protect yourself and help others! Every
              mission completed is a step toward becoming a champion! <EmojiIcon emoji="💪" size={20} className="inline" />
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, type: 'spring' }}
            >
              <GamifiedButton
                onClick={() => navigate('/auth')}
                variant="secondary"
                className="text-lg px-12 py-7 bg-white text-primary hover:bg-white/90 shadow-2xl font-bold"
              >
                <Heart className="mr-2 w-5 h-5" />
                Join Free Today!
                <Award className="ml-2 w-5 h-5" />
              </GamifiedButton>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              className="flex flex-wrap items-center justify-center gap-6 mt-10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              {[
                { icon: Shield, text: '100% Safe', emoji: '🛡️' },
                { icon: CheckCircle2, text: 'Free Forever', emoji: '✨' },
                { icon: Users, text: 'Trusted by 1000+', emoji: '👥' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20"
                  whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.2)' }}
                >
                  <EmojiIcon emoji={item.emoji} size={20} />
                  <item.icon className="w-4 h-4 text-white" />
                  <span className="text-white font-semibold text-sm">{item.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <motion.footer
        className="relative z-10 container mx-auto px-4 py-12 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <motion.div
          className="flex items-center justify-center gap-2 mb-4"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <EmojiIcon emoji="💖" size={24} />
        </motion.div>
        <p className="text-muted-foreground text-sm md:text-base">
          Made with <EmojiIcon emoji="💖" size={16} className="inline" /> for children everywhere • Protecting rights, one game at a time <EmojiIcon emoji="🎮" size={16} className="inline" />
        </p>
        <motion.p
          className="text-xs text-muted-foreground/70 mt-2"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          © {new Date().getFullYear()} LittleLoom. All rights reserved.
        </motion.p>
      </motion.footer>
    </div>
  );
}
