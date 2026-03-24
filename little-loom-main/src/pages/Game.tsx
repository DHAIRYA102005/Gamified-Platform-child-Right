import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Star, Trophy, Sparkles, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import Confetti from 'react-confetti';
import { EmojiIcon } from '@/components/EmojiIcon';

interface SceneData {
  scenes: Array<{
    id: number;
    text_en: string;
    text_hi: string;
    image?: string;
    emotion?: string;
    choices?: Array<{
      id: string;
      text_en: string;
      text_hi: string;
    }>;
  }>;
}

/**
 * Interactive Floating Emoji Component
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
  const springConfig = { stiffness: 150, damping: 15 };
  const x = useSpring(useTransform(mouseX, [0, 1], [-15, 15]), springConfig);
  const y = useSpring(useTransform(mouseY, [0, 1], [-15, 15]), springConfig);
  const isSuperhero = emoji === '🦸';

  // Enhanced animation for superheroes - more dynamic flying
  const superheroAnimation = isSuperhero ? {
    y: [0, -40, -20, -40, 0],
    x: [0, Math.sin(index) * 30, Math.cos(index) * 20, Math.sin(index) * 30, 0],
    rotate: [0, 25, -25, 25, 0],
    scale: [1, 1.2, 1.1, 1.2, 1],
  } : {
    y: [0, -25, 0],
    rotate: [0, 15, -15, 0],
    scale: [1, 1.1, 1],
  };

  return (
    <motion.div
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
        ease: 'easeInOut',
        delay: index * 0.2,
      }}
      whileHover={{ scale: 1.5, zIndex: 10 }}
      whileTap={{ scale: 0.9 }}
    >
      <EmojiIcon emoji={emoji} size={isSuperhero ? 45 : 40} animated={!isSuperhero} />
    </motion.div>
  );
};

export default function Game() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const [scenario, setScenario] = useState<any>(null);
  const [currentScene, setCurrentScene] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  // Mouse position for interactive effects
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const floatingEmojis = ['⭐', '🌟', '✨', '🏆', '🎯', '🧠', '💪', '🎨', '📚', '🌈', '🎪', '🎭', '🎲', '🦸', '🦸', '🦸', '🏅', '⚡', '💎', '🎁'];

  useEffect(() => {
    loadGame();
  }, [id]);

  const loadGame = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/auth');
      return;
    }
    setUser(session.user);

    // Load scenario
    const { data: scenarios } = await supabase
      .from('game_scenarios')
      .select('*')
      .eq('game_id', id)
      .limit(1);

    if (scenarios && scenarios.length > 0) {
      setScenario(scenarios[0]);
    } else {
      toast.error('Game not found!');
      navigate('/');
    }
    setLoading(false);
  };

  const handleChoiceSelect = (choiceId: string) => {
    setSelectedChoice(choiceId);
  };

  const handleSubmitChoice = async () => {
    if (!selectedChoice || !scenario) return;

    const correct = selectedChoice === scenario.correct_choice;
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);

      // Award points
      const { data: profile } = await supabase
        .from('profiles')
        .select('points')
        .eq('id', user.id)
        .single();

      await supabase
        .from('profiles')
        .update({ points: (profile?.points || 0) + scenario.points_value })
        .eq('id', user.id);

      // Save/update game progress
      await supabase
        .from('game_progress')
        .upsert({
          user_id: user.id,
          game_id: id!,
          current_scene: currentScene + 1,
          score: (profile?.points || 0) + scenario.points_value,
          completed: true,
          completed_at: new Date().toISOString(),
        }, { onConflict: 'user_id,game_id' });

      toast.success(`Amazing! You earned ${scenario.points_value} points! 🎉`);
    } else {
      toast.error('Not quite right. Try again! 💪');
    }
  };

  const handleNextOrRetry = () => {
    if (isCorrect) {
      navigate('/');
    } else {
      setShowResult(false);
      setSelectedChoice(null);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background via-muted/20 to-background relative overflow-hidden">
        {/* Animated Background */}
        <motion.div
          className="absolute inset-0 pointer-events-none overflow-hidden -z-10"
        >
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
        </motion.div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Star className="w-16 h-16 text-primary" />
        </motion.div>
      </div>
    );
  }

  if (!scenario) {
    return null;
  }

  const sceneData: SceneData = scenario.scene_data;
  const scenes = sceneData.scenes;
  const currentSceneData = scenes[currentScene];
  const lang = i18n.language;

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background overflow-x-hidden relative"
      onMouseMove={handleMouseMove}
    >
      {showConfetti && <Confetti numberOfPieces={200} recycle={false} />}

      {/* Animated Background with Parallax */}
      <motion.div
        className="fixed inset-0 pointer-events-none overflow-hidden -z-10"
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
        className="relative z-20 bg-card/80 backdrop-blur-xl border-b border-border/50 shadow-lg sticky top-0"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="ghost" onClick={() => navigate('/')} className="font-semibold">
              <ArrowLeft className="mr-2" /> Back
            </Button>
          </motion.div>
          <motion.h2
            className="font-extrabold text-lg md:text-xl bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent"
            whileHover={{ scale: 1.05 }}
          >
            {lang === 'hi' ? scenario.title_hi : scenario.title_en}
          </motion.h2>
          <motion.div
            className="flex items-center space-x-2 bg-gradient-to-r from-accent/20 to-primary/20 backdrop-blur-md px-4 py-2 rounded-full border border-primary/20"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            >
              <Trophy className="w-5 h-5 text-accent" />
            </motion.div>
            <span className="font-bold text-accent">{scenario.points_value} pts</span>
          </motion.div>
        </div>
      </motion.header>

      {/* Game Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl relative z-10">
        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div
              key="game"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              {/* Scene Display */}
              <motion.div
                className="mb-8 overflow-hidden rounded-3xl bg-card/80 backdrop-blur-xl shadow-2xl border-2 border-border/50"
                whileHover={{ scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                {/* Emoji/Illustration Area */}
                <div className="h-64 bg-gradient-to-br from-primary/30 via-secondary/30 to-accent/30 flex items-center justify-center relative overflow-hidden">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                    className="flex items-center justify-center"
                  >
                    {currentSceneData.emotion === 'concerned' && <EmojiIcon emoji="😟" size={128} />}
                    {currentSceneData.emotion === 'thinking' && <EmojiIcon emoji="🤔" size={128} />}
                    {currentSceneData.emotion === 'worried' && <EmojiIcon emoji="😰" size={128} />}
                    {currentSceneData.emotion === 'sad' && <EmojiIcon emoji="😢" size={128} />}
                    {currentSceneData.emotion === 'angry' && <EmojiIcon emoji="😠" size={128} />}
                    {currentSceneData.emotion === 'sick' && <EmojiIcon emoji="🤢" size={128} />}
                    {!currentSceneData.emotion && <EmojiIcon emoji="📖" size={128} />}
                  </motion.div>
                  {/* Animated background particles */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-primary/30 rounded-full"
                        style={{
                          left: `${20 + i * 15}%`,
                          top: `${30 + i * 10}%`,
                        }}
                        animate={{
                          y: [0, -20, 0],
                          opacity: [0.3, 0.7, 0.3],
                        }}
                        transition={{
                          duration: 2 + i * 0.5,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                      />
                    ))}
                  </motion.div>
                </div>

                <div className="p-8">
                  <motion.p
                    className="text-xl md:text-2xl leading-relaxed text-foreground font-medium"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    {lang === 'hi' ? currentSceneData.text_hi : currentSceneData.text_en}
                  </motion.p>
                </div>
              </motion.div>

              {/* Choices */}
              {currentSceneData.choices && (
                <motion.div
                  className="space-y-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <motion.h3
                    className="text-2xl md:text-3xl font-extrabold mb-6 text-center bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.65 }}
                  >
                    Choose your action:
                  </motion.h3>
                  <div className="grid gap-4">
                    {currentSceneData.choices.map((choice, index) => (
                      <motion.div
                        key={choice.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                      >
                        <motion.div
                          className={`cursor-pointer transition-all rounded-3xl bg-card/80 backdrop-blur-xl shadow-lg border-2 overflow-hidden ${
                            selectedChoice === choice.id
                              ? 'ring-4 ring-primary bg-primary/10 border-primary/50 shadow-2xl'
                              : 'border-border/50 hover:bg-muted/50 hover:border-primary/30'
                          }`}
                          onClick={() => handleChoiceSelect(choice.id)}
                          whileHover={{ y: -4, scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="p-6 flex items-center space-x-4">
                            <motion.div
                              className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl shadow-lg ${
                                selectedChoice === choice.id
                                  ? 'bg-gradient-to-br from-primary to-accent text-white'
                                  : 'bg-muted text-foreground'
                              }`}
                              whileHover={{ scale: 1.1, rotate: 10 }}
                              whileTap={{ scale: 0.95 }}
                              animate={
                                selectedChoice === choice.id
                                  ? {
                                      scale: [1, 1.1, 1],
                                      rotate: [0, 10, -10, 0],
                                    }
                                  : {}
                              }
                              transition={{ duration: 0.5 }}
                            >
                              {String.fromCharCode(65 + index)}
                            </motion.div>
                            <p className="text-lg md:text-xl font-semibold flex-1">
                              {lang === 'hi' ? choice.text_hi : choice.text_en}
                            </p>
                            {selectedChoice === choice.id && (
                              <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: 'spring', stiffness: 200 }}
                              >
                                <Sparkles className="w-6 h-6 text-primary" />
                              </motion.div>
                            )}
                          </div>
                        </motion.div>
                      </motion.div>
                    ))}
                  </div>

                  <motion.div
                    className="pt-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        onClick={handleSubmitChoice}
                        disabled={!selectedChoice}
                        className="w-full text-lg py-6 font-bold bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90 text-white shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                        size="lg"
                      >
                        <Zap className="mr-2 w-5 h-5" />
                        Submit Answer
                        <Sparkles className="ml-2 w-5 h-5" />
                      </Button>
                    </motion.div>
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <motion.div
                className={`rounded-3xl bg-card/80 backdrop-blur-xl shadow-2xl border-4 overflow-hidden ${
                  isCorrect
                    ? 'border-success/50 bg-gradient-to-br from-success/10 to-primary/10'
                    : 'border-destructive/50 bg-gradient-to-br from-destructive/10 to-secondary/10'
                }`}
                whileHover={{ scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <div className="p-12 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, rotate: 360 }}
                    transition={{ type: 'spring', stiffness: 150 }}
                    className="mb-6"
                  >
                    {isCorrect ? (
                      <EmojiIcon emoji="🎉" size={128} />
                    ) : (
                      <EmojiIcon emoji="💪" size={128} />
                    )}
                  </motion.div>

                  <motion.h2
                    className={`text-4xl font-bold mb-4 ${isCorrect ? 'text-success' : 'text-destructive'}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {isCorrect ? 'Amazing! You got it right!' : 'Not quite! Let\'s try again!'}
                  </motion.h2>

                  <motion.div
                    className="bg-card/60 backdrop-blur-md rounded-2xl p-6 mb-8 border-2 border-border/50"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="flex items-start space-x-3">
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                      >
                        <Sparkles className="w-6 h-6 text-accent mt-1 flex-shrink-0" />
                      </motion.div>
                      <p className="text-lg md:text-xl text-left font-medium">
                        {lang === 'hi' ? scenario.explanation_hi : scenario.explanation_en}
                      </p>
                    </div>
                  </motion.div>

                  {isCorrect && (
                    <motion.div
                      className="mb-6 inline-flex items-center space-x-2 bg-gradient-to-r from-accent/30 to-primary/30 backdrop-blur-md px-6 py-3 rounded-full border-2 border-accent/50 shadow-lg"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
                    >
                      <motion.div
                        animate={{ scale: [1, 1.2, 1], rotate: [0, 360] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Star className="w-6 h-6 text-accent fill-accent" />
                      </motion.div>
                      <span className="text-2xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                        +{scenario.points_value} Points!
                      </span>
                    </motion.div>
                  )}

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      onClick={handleNextOrRetry}
                      className={`text-lg py-6 px-12 font-bold shadow-2xl ${
                        isCorrect
                          ? 'bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90 text-white'
                          : 'bg-gradient-to-r from-destructive to-secondary hover:opacity-90 text-white'
                      }`}
                      size="lg"
                    >
                      {isCorrect ? (
                        <>
                          <Trophy className="mr-2 w-5 h-5" />
                          Back to Dashboard
                        </>
                      ) : (
                        <>
                          <Zap className="mr-2 w-5 h-5" />
                          Try Again
                        </>
                      )}
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
