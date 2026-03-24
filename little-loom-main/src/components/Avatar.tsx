import { motion } from 'framer-motion';
import { User } from '@supabase/supabase-js';

interface AvatarProps {
  size?: 'sm' | 'md' | 'lg';
  avatarBody?: string;
  animated?: boolean;
}

const sizeClasses = {
  sm: 'w-12 h-12',
  md: 'w-20 h-20',
  lg: 'w-32 h-32',
};

export function Avatar({ size = 'md', avatarBody = 'default', animated = true }: AvatarProps) {
  const Container = animated ? motion.div : 'div';
  const animationProps = animated ? {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { type: 'spring' as const, stiffness: 200, damping: 15 },
  } : {};

  return (
    <Container
      className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg`}
      {...animationProps}
    >
      {/* Star mascot SVG */}
      <svg viewBox="0 0 100 100" className="w-full h-full p-2">
        <motion.path
          d="M50 10 L60 35 L88 40 L69 58 L73 88 L50 73 L27 88 L31 58 L12 40 L40 35 Z"
          fill="white"
          animate={animated ? {
            rotate: [0, 5, -5, 0],
          } : {}}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
        <circle cx="42" cy="40" r="4" fill="#333" />
        <circle cx="58" cy="40" r="4" fill="#333" />
        <path d="M 40 55 Q 50 62 60 55" stroke="#333" strokeWidth="3" fill="none" strokeLinecap="round" />
      </svg>
    </Container>
  );
}
