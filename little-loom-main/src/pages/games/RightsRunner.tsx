/**
 * Rights Runner - Subway Surfer Style Endless Runner
 * Collect rights symbols while avoiding obstacles!
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Star, 
  Trophy, 
  Play,
  RotateCcw,
  Zap,
  Shield,
  Heart,
  BookOpen,
  Users,
  Maximize,
  Minimize,
  Pause
} from 'lucide-react';
import { toast } from 'sonner';
import Confetti from 'react-confetti';
import { useFullscreen } from '@/hooks/use-fullscreen';
import { EmojiIcon } from '@/components/EmojiIcon';

interface Collectible {
  id: string;
  x: number;
  y: number;
  type: 'education' | 'health' | 'protection' | 'play' | 'food';
  collected: boolean;
}

interface Obstacle {
  id: string;
  x: number;
  y: number;
  type: 'violation' | 'barrier';
}

interface GameState {
  score: number;
  distance: number;
  speed: number;
  isPlaying: boolean;
  isPaused: boolean;
  isGameOver: boolean;
  lane: number; // 0 = left, 1 = center, 2 = right
  collectibles: Collectible[];
  obstacles: Obstacle[];
  rightsCollected: number;
  combo: number;
}

const LANES = [0, 1, 2]; // 3 lanes
const LANE_WIDTH = 120;
const GAME_WIDTH = 360;
const COLLECTIBLE_TYPES = ['education', 'health', 'protection', 'play', 'food'] as const;

const collectibleIcons = {
  education: '📚',
  health: '🏥',
  protection: '🛡️',
  play: '⚽',
  food: '🍎',
};

const collectiblePoints = {
  education: 10,
  health: 10,
  protection: 15,
  play: 5,
  food: 8,
};

export default function RightsRunner() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const lang = i18n.language;
  
  const gameRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    distance: 0,
    speed: 2,
    isPlaying: false,
    isPaused: false,
    isGameOver: false,
    lane: 1, // Start in center
    collectibles: [],
    obstacles: [],
    rightsCollected: 0,
    combo: 0,
  });

  const [highScore, setHighScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const { isFullscreen, toggleFullscreen } = useFullscreen();

  // Movement functions
  const moveLeft = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      lane: Math.max(0, prev.lane - 1),
    }));
  }, []);

  const moveRight = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      lane: Math.min(2, prev.lane + 1),
    }));
  }, []);

  // Load high score
  useEffect(() => {
    const loadHighScore = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('points')
            .eq('id', session.user.id)
            .single();
          // Could store high score separately, using points as reference
        }
      } catch (error) {
        console.error('Error loading high score:', error);
      }
    };
    loadHighScore();
  }, []);


  // Game loop
  useEffect(() => {
    if (!gameState.isPlaying || gameState.isPaused || gameState.isGameOver) {
      return;
    }

    const gameLoop = (currentTime: number) => {
      if (lastTimeRef.current === 0) {
        lastTimeRef.current = currentTime;
      }

      const deltaTime = currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;

      if (deltaTime > 0) {
        updateGame(deltaTime);
      }

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameState.isPlaying, gameState.isPaused, gameState.isGameOver]);

  // Keyboard controls
  useEffect(() => {
    if (!gameState.isPlaying || gameState.isPaused) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        moveLeft();
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        moveRight();
      } else if (e.key === ' ' || e.key === 'ArrowUp') {
        e.preventDefault();
        // Jump action (can be added later)
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState.isPlaying, gameState.isPaused, moveLeft, moveRight]);

  const updateGame = (deltaTime: number) => {
    setGameState(prev => {
      const newState = { ...prev };
      const speedMultiplier = deltaTime / 16; // Normalize to 60fps

      // Update distance and speed
      newState.distance += newState.speed * speedMultiplier;
      newState.speed = Math.min(8, 2 + newState.distance / 1000); // Speed increases with distance

      // Get game area dimensions once
      const gameArea = gameRef.current;
      const gameHeight = gameArea ? gameArea.offsetHeight : 500;
      const heroY = gameHeight - 80; // Hero position (screen height - 80px from bottom)

      // Update collectibles
      newState.collectibles = newState.collectibles
        .map(item => ({
          ...item,
          y: item.y + newState.speed * speedMultiplier * 2,
        }))
        .filter(item => {
          // Check collision
          const heroX = (newState.lane * LANE_WIDTH) + (LANE_WIDTH / 2);
          const distance = Math.sqrt(
            Math.pow(item.x - heroX, 2) + Math.pow(item.y - heroY, 2)
          );

          if (distance < 40 && !item.collected) {
            // Collected!
            const points = collectiblePoints[item.type] * (1 + newState.combo * 0.1);
            newState.score += Math.floor(points);
            newState.rightsCollected++;
            newState.combo++;
            toast.success(`${collectibleIcons[item.type]} +${Math.floor(points)} ${lang === 'hi' ? 'अंक' : 'points'}!`);
            return false; // Remove collected item
          }

          return item.y < gameHeight; // Keep if still on screen
        });

      // Update obstacles
      newState.obstacles = newState.obstacles
        .map(obs => ({
          ...obs,
          y: obs.y + newState.speed * speedMultiplier * 2,
        }))
        .filter(obs => {
          // Check collision
          const heroX = (newState.lane * LANE_WIDTH) + (LANE_WIDTH / 2);
          const distance = Math.sqrt(
            Math.pow(obs.x - heroX, 2) + Math.pow(obs.y - heroY, 2)
          );

          if (distance < 50) {
            // Collision! Game over
            newState.isGameOver = true;
            newState.isPlaying = false;
            handleGameOver(newState.score);
            return false;
          }

          return obs.y < gameHeight;
        });

      // Spawn new collectibles
      if (Math.random() < 0.02 * speedMultiplier) {
        const lane = Math.floor(Math.random() * 3);
        const type = COLLECTIBLE_TYPES[Math.floor(Math.random() * COLLECTIBLE_TYPES.length)];
        newState.collectibles.push({
          id: `collectible-${Date.now()}-${Math.random()}`,
          x: (lane * LANE_WIDTH) + (LANE_WIDTH / 2),
          y: -50,
          type,
          collected: false,
        });
      }

      // Spawn obstacles
      if (Math.random() < 0.01 * speedMultiplier) {
        const lane = Math.floor(Math.random() * 3);
        newState.obstacles.push({
          id: `obstacle-${Date.now()}-${Math.random()}`,
          x: (lane * LANE_WIDTH) + (LANE_WIDTH / 2),
          y: -50,
          type: 'violation',
        });
      }

      // Reset combo if no collection for a while
      if (newState.combo > 0 && Math.random() < 0.01) {
        newState.combo = 0;
      }

      return newState;
    });
  };

  const startGame = () => {
    setGameState({
      score: 0,
      distance: 0,
      speed: 2,
      isPlaying: true,
      isPaused: false,
      isGameOver: false,
      lane: 1,
      collectibles: [],
      obstacles: [],
      rightsCollected: 0,
      combo: 0,
    });
    lastTimeRef.current = 0;
    setShowConfetti(false);
  };

  const pauseGame = () => {
    setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  };

  const handleGameOver = async (finalScore: number) => {
    if (finalScore > highScore) {
      setHighScore(finalScore);
      setShowConfetti(true);
      toast.success(lang === 'hi' ? 'नया उच्च स्कोर!' : 'New High Score!');
    }

    // Save progress
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('points')
          .eq('id', session.user.id)
          .single();

        await supabase
          .from('profiles')
          .update({ 
            points: (profile?.points || 0) + Math.floor(finalScore / 10) // Convert to profile points
          })
          .eq('id', session.user.id);
      }
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const getLanePosition = (lane: number) => {
    return (lane * LANE_WIDTH) + (LANE_WIDTH / 2) - 20; // Center of lane, minus half hero width
  };

  return (
    <div 
      ref={gameContainerRef}
      className={`min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex flex-col items-center justify-center ${isFullscreen ? 'p-0' : 'p-4'}`}
    >
      {showConfetti && <Confetti numberOfPieces={200} recycle={false} />}

      {/* Header - Enhanced */}
      <div className={`w-full ${isFullscreen ? 'px-8 py-6' : 'container mx-auto px-4 py-4'} max-w-7xl`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {!isFullscreen && (
              <Button 
                variant="ghost" 
                onClick={() => navigate('/games')}
                className="hover:bg-primary/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {lang === 'hi' ? 'वापस' : 'Back'}
              </Button>
            )}
            <Button
              variant="ghost"
              onClick={() => gameContainerRef.current && toggleFullscreen(gameContainerRef.current)}
              className="hover:bg-primary/10"
              title={isFullscreen ? (lang === 'hi' ? 'पूर्ण स्क्रीन से बाहर निकलें' : 'Exit Fullscreen') : (lang === 'hi' ? 'पूर्ण स्क्रीन' : 'Enter Fullscreen')}
            >
              {isFullscreen ? (
                <Minimize className="w-4 h-4" />
              ) : (
                <Maximize className="w-4 h-4" />
              )}
            </Button>
          </div>
          
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ scale: gameState.score > 0 ? [1, 1.1, 1] : 1 }}
              transition={{ duration: 0.3 }}
            >
              <Badge variant="outline" className="text-lg px-5 py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/50 shadow-md">
                <Star className="w-4 h-4 mr-2 text-yellow-500 fill-yellow-500" />
                <span className="font-bold">{gameState.score}</span>
              </Badge>
            </motion.div>
            <Badge variant="secondary" className="text-lg px-5 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 shadow-md">
              <Trophy className="w-4 h-4 mr-2 text-purple-500" />
              <span className="font-semibold">{lang === 'hi' ? 'उच्च' : 'High'}: {highScore}</span>
            </Badge>
            {gameState.combo > 0 && (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                <Badge variant="default" className="text-lg px-5 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg">
                  🔥 <span className="font-bold">{gameState.combo}x</span> {lang === 'hi' ? 'कॉम्बो' : 'COMBO'}
                </Badge>
              </motion.div>
            )}
          </div>
        </div>

        {/* Game Stats - Enhanced */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <Card className="p-3 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/30">
            <div className="text-center">
              <div className="font-bold text-2xl text-blue-400">{Math.floor(gameState.distance)}m</div>
              <div className="text-xs text-muted-foreground mt-1">{lang === 'hi' ? 'दूरी' : 'Distance'}</div>
            </div>
          </Card>
          <Card className="p-3 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30">
            <div className="text-center">
              <div className="font-bold text-2xl text-green-400">{gameState.rightsCollected}</div>
              <div className="text-xs text-muted-foreground mt-1">{lang === 'hi' ? 'अधिकार एकत्रित' : 'Rights Collected'}</div>
            </div>
          </Card>
          <Card className="p-3 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30">
            <div className="text-center">
              <div className="font-bold text-2xl text-purple-400">{Math.floor(gameState.speed * 10)}</div>
              <div className="text-xs text-muted-foreground mt-1">{lang === 'hi' ? 'गति' : 'Speed'}</div>
            </div>
          </Card>
        </div>
      </div>

      {/* Game Area - Centered and Responsive */}
      <div className={`w-full ${isFullscreen ? 'px-8' : 'container mx-auto px-4'} max-w-7xl flex-1 flex items-center justify-center`}>
        <Card className="overflow-hidden border-4 border-primary/30 shadow-2xl w-full max-w-4xl bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
          <div 
            ref={gameRef}
            className={`relative w-full bg-gradient-to-b from-indigo-900/40 via-purple-900/30 via-pink-900/20 to-orange-900/30 overflow-hidden ${isFullscreen ? 'h-[calc(100vh-200px)]' : 'h-[500px]'}`}
            style={{ 
              backgroundImage: `
                radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(219, 39, 119, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 40% 20%, rgba(59, 130, 246, 0.2) 0%, transparent 50%),
                repeating-linear-gradient(90deg, transparent, transparent 120px, rgba(255,255,255,0.03) 120px, rgba(255,255,255,0.03) 140px),
                repeating-linear-gradient(0deg, transparent, transparent 25px, rgba(255,255,255,0.05) 25px, rgba(255,255,255,0.05) 27px)
              `,
            }}
          >
            {/* Animated Background Elements - Enhanced */}
            <div className="absolute inset-0 opacity-30">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full blur-2xl"
                  style={{
                    width: `${60 + Math.random() * 80}px`,
                    height: `${60 + Math.random() * 80}px`,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    background: i % 3 === 0 
                      ? 'radial-gradient(circle, rgba(59, 130, 246, 0.4), transparent)'
                      : i % 3 === 1
                      ? 'radial-gradient(circle, rgba(168, 85, 247, 0.4), transparent)'
                      : 'radial-gradient(circle, rgba(236, 72, 153, 0.4), transparent)',
                  }}
                  animate={{
                    y: [0, -50, 0],
                    x: [0, Math.random() * 30 - 15, 0],
                    scale: [1, 1.3, 1],
                    opacity: [0.2, 0.4, 0.2],
                  }}
                  transition={{
                    duration: 4 + Math.random() * 3,
                    repeat: Infinity,
                    delay: Math.random() * 3,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </div>

            {/* Floating Particles */}
            <div className="absolute inset-0">
              {[...Array(15)].map((_, i) => (
                <motion.div
                  key={`particle-${i}`}
                  className="absolute w-1 h-1 bg-white/40 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -100],
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                    ease: 'linear',
                  }}
                />
              ))}
            </div>

            {/* Lane Markers - Enhanced with Glow */}
            {LANES.map((lane, index) => (
              <div key={lane} className="absolute top-0 bottom-0" style={{ left: `${lane * LANE_WIDTH + LANE_WIDTH / 2}px` }}>
                <motion.div
                  className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-yellow-400/60 via-cyan-400/40 to-yellow-400/60"
                  animate={{
                    opacity: [0.4, 0.8, 0.4],
                    boxShadow: [
                      '0 0 10px rgba(250, 204, 21, 0.3)',
                      '0 0 20px rgba(250, 204, 21, 0.6)',
                      '0 0 10px rgba(250, 204, 21, 0.3)',
                    ],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: index * 0.2,
                  }}
                />
                <motion.div
                  className="absolute top-0 bottom-0 w-0.5 bg-white/20 blur-sm"
                  style={{ left: '50%', transform: 'translateX(-50%)' }}
                />
              </div>
            ))}

            {/* Road Lines - Enhanced Moving Effect */}
            <div className="absolute inset-0">
              {LANES.map((lane) => (
                <div key={`road-${lane}`} style={{ left: `${lane * LANE_WIDTH + LANE_WIDTH / 2}px` }}>
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={`line-${i}`}
                      className="absolute w-0.5 h-8 bg-gradient-to-b from-yellow-400/50 via-cyan-400/40 to-transparent"
                      style={{
                        left: '50%',
                        transform: 'translateX(-50%)',
                        top: `${i * 100}%`,
                      }}
                      animate={{
                        y: [0, 500],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: 'linear',
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>

            {/* Collectibles - Enhanced with Better Graphics */}
            {gameState.collectibles.map(item => {
              const colors = {
                education: 'from-blue-400 to-cyan-400',
                health: 'from-green-400 to-emerald-400',
                protection: 'from-purple-400 to-pink-400',
                play: 'from-yellow-400 to-orange-400',
                food: 'from-red-400 to-rose-400',
              };
              
              return (
                <motion.div
                  key={item.id}
                  className="absolute pointer-events-none z-30"
                  style={{
                    left: `${item.x - 35}px`,
                    top: `${item.y}px`,
                  }}
                  animate={{ 
                    y: item.y,
                    rotate: [0, 360],
                    scale: [1, 1.15, 1],
                  }}
                  transition={{ 
                    rotate: { duration: 2, repeat: Infinity, ease: 'linear' },
                    scale: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' }
                  }}
                >
                  <div className="relative">
                    {/* Outer Glow Ring */}
                    <motion.div
                      className={`absolute inset-0 rounded-full bg-gradient-to-r ${colors[item.type]} opacity-30 blur-xl`}
                      style={{ width: '70px', height: '70px', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.2, 0.5, 0.2],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                      }}
                    />
                    {/* Icon with Enhanced Shadow */}
                    <div className="text-6xl drop-shadow-2xl filter brightness-110 contrast-110 relative z-10">
                      {collectibleIcons[item.type]}
                    </div>
                    {/* Sparkle Effect */}
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-white rounded-full"
                        style={{
                          left: '50%',
                          top: '50%',
                        }}
                        animate={{
                          x: [0, Math.cos((i * 120) * Math.PI / 180) * 30],
                          y: [0, Math.sin((i * 120) * Math.PI / 180) * 30],
                          opacity: [0, 1, 0],
                          scale: [0, 1, 0],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: i * 0.3,
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              );
            })}

            {/* Obstacles - Enhanced with Better Graphics */}
            {gameState.obstacles.map(obs => (
              <motion.div
                key={obs.id}
                className="absolute z-20"
                style={{
                  left: `${obs.x - 35}px`,
                  top: `${obs.y}px`,
                }}
                animate={{ 
                  y: obs.y,
                  rotate: [0, 15, -15, 0],
                  scale: [1, 1.15, 1],
                }}
                transition={{
                  rotate: { duration: 0.6, repeat: Infinity, ease: 'easeInOut' },
                  scale: { duration: 0.9, repeat: Infinity, ease: 'easeInOut' },
                }}
              >
                <div className="relative">
                  {/* Danger Pulse Ring */}
                  <motion.div
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500/40 to-orange-500/40 blur-2xl"
                    style={{ width: '80px', height: '80px', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.3, 0.7, 0.3],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                    }}
                  />
                  {/* Warning Icon */}
                  <div className="text-6xl drop-shadow-2xl filter brightness-110 contrast-110 relative z-10">
                    ⚠️
                  </div>
                  {/* Rotating Danger Lines */}
                  {[...Array(4)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-8 bg-red-500/60 rounded-full"
                      style={{
                        left: '50%',
                        top: '50%',
                        transformOrigin: '50% 0',
                      }}
                      animate={{
                        rotate: [i * 90, i * 90 + 360],
                        opacity: [0.4, 0.8, 0.4],
                      }}
                      transition={{
                        rotate: { duration: 2, repeat: Infinity, ease: 'linear' },
                        opacity: { duration: 1, repeat: Infinity },
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            ))}

            {/* Hero - Enhanced with Better Graphics */}
            {gameState.isPlaying && (
              <motion.div
                className="absolute z-50 pointer-events-none"
                style={{
                  left: `${getLanePosition(gameState.lane)}px`,
                  bottom: '80px',
                }}
                animate={{
                  y: [0, -12, 0],
                }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <div className="relative">
                  {/* Hero Aura/Glow */}
                  <motion.div
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/30 via-purple-400/30 to-pink-400/30 blur-2xl"
                    style={{ width: '100px', height: '100px', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                    }}
                  />
                  {/* Hero Shadow with Motion */}
                  <motion.div 
                    className="absolute w-20 h-10 bg-black/30 blur-2xl rounded-full"
                    style={{
                      bottom: '-25px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                    }}
                    animate={{
                      scaleX: [1, 1.3, 1],
                      opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                    }}
                  />
                  {/* Hero Character with Enhanced Effects */}
                  <motion.div
                    className="text-7xl drop-shadow-2xl filter brightness-110 relative z-10"
                    animate={{
                      rotate: [0, 3, -3, 0],
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    <EmojiIcon emoji="🦸" size={64} />
                  </motion.div>
                  {/* Speed Lines Behind Hero */}
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-16 h-1 bg-gradient-to-r from-transparent via-yellow-400/60 to-transparent blur-sm"
                      style={{
                        bottom: `${-5 - i * 8}px`,
                        left: '50%',
                        transform: 'translateX(-50%)',
                      }}
                      animate={{
                        scaleX: [0.6, 1.4, 0.6],
                        opacity: [0.3, 0.7, 0.3],
                      }}
                      transition={{
                        duration: 0.4,
                        repeat: Infinity,
                        delay: i * 0.1,
                      }}
                    />
                  ))}
                  {/* Energy Particles */}
                  {[...Array(2)].map((_, i) => (
                    <motion.div
                      key={`particle-${i}`}
                      className="absolute w-2 h-2 bg-cyan-400 rounded-full blur-sm"
                      style={{
                        left: `${i === 0 ? '20%' : '80%'}`,
                        top: '30%',
                      }}
                      animate={{
                        y: [0, -20, 0],
                        x: [0, i === 0 ? -10 : 10, 0],
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.5,
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Start Screen - Enhanced */}
            {!gameState.isPlaying && !gameState.isGameOver && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-black/60 via-black/50 to-black/60 backdrop-blur-md z-50">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="p-8 text-center max-w-md border-2 border-primary/50 shadow-2xl bg-gradient-to-br from-card to-card/80">
                    <CardContent className="space-y-6">
                      <motion.div
                        animate={{ 
                          y: [0, -10, 0],
                          rotate: [0, 5, -5, 0]
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          ease: 'easeInOut'
                        }}
                        className="text-7xl mb-4"
                      >
                        🏃
                      </motion.div>
                      <h2 className="text-4xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        {lang === 'hi' ? 'अधिकार रनर' : 'Rights Runner'}
                      </h2>
                      <p className="text-muted-foreground text-lg">
                        {lang === 'hi' 
                          ? 'अधिकार एकत्र करें और बाधाओं से बचें! बाएं/दाएं तीर कुंजी का उपयोग करें।'
                          : 'Collect rights and avoid obstacles! Use left/right arrow keys.'
                        }
                      </p>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button 
                          size="lg" 
                          onClick={startGame} 
                          className="w-full bg-gradient-to-r from-primary to-accent text-white shadow-lg hover:shadow-xl transition-all"
                        >
                          <Play className="w-5 h-5 mr-2" />
                          {lang === 'hi' ? 'खेल शुरू करें' : 'Start Game'}
                        </Button>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            )}

            {/* Pause Screen */}
            {gameState.isPaused && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <Card className="p-6 text-center">
                  <CardContent className="space-y-4">
                    <h3 className="text-2xl font-bold">
                      {lang === 'hi' ? 'रोक दिया गया' : 'Paused'}
                    </h3>
                    <Button onClick={pauseGame}>
                      {lang === 'hi' ? 'जारी रखें' : 'Resume'}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Game Over Screen - Enhanced */}
            {gameState.isGameOver && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-red-900/60 via-black/70 to-purple-900/60 backdrop-blur-md z-50">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, type: 'spring' }}
                >
                  <Card className="p-8 text-center max-w-md border-2 border-red-500/50 shadow-2xl bg-gradient-to-br from-card to-card/90">
                    <CardContent className="space-y-6">
                      <motion.div
                        animate={{ 
                          rotate: [0, 10, -10, 0],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{ 
                          duration: 0.5,
                          repeat: Infinity 
                        }}
                        className="text-7xl mb-4"
                      >
                        💥
                      </motion.div>
                      <h2 className="text-4xl font-extrabold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                        {lang === 'hi' ? 'गेम समाप्त!' : 'Game Over!'}
                      </h2>
                      <div className="space-y-3 pt-4">
                        <Card className="p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30">
                          <div className="text-3xl font-bold text-yellow-400">
                            {gameState.score} {lang === 'hi' ? 'अंक' : 'Points'}
                          </div>
                        </Card>
                        <div className="grid grid-cols-2 gap-3">
                          <Card className="p-3 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-500/30">
                            <div className="text-xl font-bold text-blue-400">
                              {Math.floor(gameState.distance)}m
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {lang === 'hi' ? 'दूरी' : 'Distance'}
                            </div>
                          </Card>
                          <Card className="p-3 bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30">
                            <div className="text-xl font-bold text-green-400">
                              {gameState.rightsCollected}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {lang === 'hi' ? 'अधिकार' : 'Rights'}
                            </div>
                          </Card>
                        </div>
                      </div>
                      <div className="flex gap-3 pt-2">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                          <Button 
                            variant="outline" 
                            onClick={() => navigate('/games')} 
                            className="w-full border-2"
                          >
                            {lang === 'hi' ? 'वापस' : 'Back'}
                          </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                          <Button 
                            onClick={startGame} 
                            className="w-full bg-gradient-to-r from-primary to-accent text-white shadow-lg"
                          >
                            <RotateCcw className="w-4 h-4 mr-2" />
                            {lang === 'hi' ? 'फिर से खेलें' : 'Play Again'}
                          </Button>
                        </motion.div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            )}
          </div>
        </Card>

        {/* Controls Info */}
        {gameState.isPlaying && !gameState.isPaused && (
          <div className="mt-4 text-center text-sm text-muted-foreground">
            {lang === 'hi' 
              ? '← → तीर कुंजियाँ या A/D दबाएं'
              : 'Press ← → Arrow Keys or A/D'
            }
          </div>
        )}

        {/* Mobile Controls - Enhanced */}
        {gameState.isPlaying && !gameState.isPaused && (
          <div className="mt-6 flex justify-center gap-4">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                size="lg"
                variant="outline"
                onClick={moveLeft}
                className="w-20 h-20 text-3xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-500/50 hover:bg-blue-500/30 shadow-lg"
              >
                ←
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                size="lg"
                variant="outline"
                onClick={pauseGame}
                className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/50 hover:bg-purple-500/30 shadow-lg"
              >
                ⏸
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                size="lg"
                variant="outline"
                onClick={moveRight}
                className="w-20 h-20 text-3xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/50 hover:bg-green-500/30 shadow-lg"
              >
                →
              </Button>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}

