/**
 * GAME TEMPLATE - Rights Rangers
 * 
 * Copy this file and rename it to create a new game
 * Follow the structure and customize for your game type
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  Star, 
  Trophy, 
  CheckCircle,
  XCircle,
  Clock,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';
import Confetti from 'react-confetti';

export default function YourGameName() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const lang = i18n.language;
  
  // Game State
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameWon, setGameWon] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  // Example questions - replace with your game logic
  const questions = [
    {
      id: 1,
      question_en: 'What is the Right to Education?',
      question_hi: 'शिक्षा का अधिकार क्या है?',
      options: [
        { id: 'a', text_en: 'Right to go to school', text_hi: 'स्कूल जाने का अधिकार' },
        { id: 'b', text_en: 'Right to play', text_hi: 'खेलने का अधिकार' },
        { id: 'c', text_en: 'Right to food', text_hi: 'भोजन का अधिकार' },
      ],
      correct: 'a',
      explanation_en: 'Every child has the right to free and compulsory education.',
      explanation_hi: 'हर बच्चे को मुफ्त और अनिवार्य शिक्षा का अधिकार है।',
      points: 10,
    },
    // Add more questions...
  ];

  // Timer effect
  useEffect(() => {
    if (gameWon || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleGameOver();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, gameWon]);

  // Check win condition
  useEffect(() => {
    if (score >= 100 && !gameWon) {
      setGameWon(true);
      setShowConfetti(true);
      saveProgress();
      toast.success(lang === 'hi' ? 'बधाई हो! आप जीत गए!' : 'Congratulations! You won!');
    }
  }, [score, gameWon, lang]);

  const handleAnswer = async (answerId: string) => {
    if (isAnswered) return;

    setSelectedAnswer(answerId);
    setIsAnswered(true);

    const question = questions[currentQuestion];
    const isCorrect = answerId === question.correct;

    if (isCorrect) {
      setScore(prev => prev + question.points);
      toast.success(lang === 'hi' ? 'सही! +' + question.points + ' अंक' : `Correct! +${question.points} points`);
    } else {
      setLives(prev => prev - 1);
      toast.error(lang === 'hi' ? 'गलत! एक जीवन खो गया' : 'Wrong! Lost a life');
      
      if (lives <= 1) {
        handleGameOver();
      }
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      // Game complete
      setGameWon(true);
      saveProgress();
    }
  };

  const handleGameOver = () => {
    toast.error(lang === 'hi' ? 'गेम समाप्त!' : 'Game Over!');
    saveProgress();
    setTimeout(() => navigate('/games'), 2000);
  };

  const saveProgress = async () => {
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
            points: (profile?.points || 0) + score 
          })
          .eq('id', session.user.id);
      }
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  if (gameWon) {
    return (
      <div className="max-w-2xl mx-auto">
        {showConfetti && <Confetti numberOfPieces={300} recycle={false} />}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <Card className="p-8 text-center border-4 border-success">
            <CardContent className="space-y-6">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-8xl"
              >
                🎉
              </motion.div>
              <h1 className="text-4xl font-extrabold text-success">
                {lang === 'hi' ? 'बधाई हो!' : 'You Won!'}
              </h1>
              <p className="text-lg text-muted-foreground">
                {lang === 'hi' 
                  ? `आपने ${score} अंक अर्जित किए!`
                  : `You earned ${score} points!`
                }
              </p>
              <Button size="lg" onClick={() => navigate('/games')} className="w-full">
                {lang === 'hi' ? 'वापस जाएं' : 'Back to Games'}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="space-y-6">
      {showConfetti && <Confetti numberOfPieces={150} recycle={false} />}

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center justify-between gap-4"
      >
        <Button variant="ghost" onClick={() => navigate('/games')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          {lang === 'hi' ? 'वापस' : 'Back'}
        </Button>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-lg px-4 py-1">
            <Star className="w-4 h-4 mr-1 text-accent" />
            {score}
          </Badge>
          <Badge variant="secondary" className="text-lg px-4 py-1">
            <Trophy className="w-4 h-4 mr-1" />
            Level {level}
          </Badge>
          <Badge variant="destructive" className="text-lg px-4 py-1">
            ❤️ {lives}
          </Badge>
          <Badge variant="default" className="text-lg px-4 py-1">
            <Clock className="w-4 h-4 mr-1" />
            {timeLeft}s
          </Badge>
        </div>
      </motion.div>

      {/* Progress Bar */}
      <Progress value={(currentQuestion / questions.length) * 100} className="h-2" />

      {/* Game Content */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            {lang === 'hi' ? currentQ.question_hi : currentQ.question_en}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Question {currentQuestion + 1} of {questions.length}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Options */}
          <div className="grid gap-3">
            {currentQ.options.map((option) => {
              const isSelected = selectedAnswer === option.id;
              const isCorrect = option.id === currentQ.correct;
              const showResult = isAnswered;

              return (
                <motion.button
                  key={option.id}
                  onClick={() => handleAnswer(option.id)}
                  disabled={isAnswered}
                  whileHover={!isAnswered ? { scale: 1.02 } : {}}
                  whileTap={!isAnswered ? { scale: 0.98 } : {}}
                  className={`
                    p-4 rounded-xl border-2 text-left transition-all
                    ${isSelected && showResult
                      ? isCorrect
                        ? 'border-success bg-success/10'
                        : 'border-destructive bg-destructive/10'
                      : isSelected
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-muted-foreground'
                    }
                    ${isAnswered ? 'cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    {showResult && (
                      <div>
                        {isCorrect && isSelected ? (
                          <CheckCircle className="w-6 h-6 text-success" />
                        ) : isSelected ? (
                          <XCircle className="w-6 h-6 text-destructive" />
                        ) : isCorrect ? (
                          <CheckCircle className="w-6 h-6 text-success opacity-50" />
                        ) : null}
                      </div>
                    )}
                    <span className="font-medium text-lg mr-2">{option.id.toUpperCase()}.</span>
                    <span>{lang === 'hi' ? option.text_hi : option.text_en}</span>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Explanation */}
          {isAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-muted rounded-xl"
            >
              <p className="text-sm">
                <strong>{lang === 'hi' ? 'व्याख्या:' : 'Explanation:'}</strong>{' '}
                {lang === 'hi' ? currentQ.explanation_hi : currentQ.explanation_en}
              </p>
            </motion.div>
          )}

          {/* Next Button */}
          {isAnswered && (
            <Button 
              size="lg" 
              onClick={handleNext}
              className="w-full"
            >
              {currentQuestion < questions.length - 1
                ? lang === 'hi' ? 'अगला' : 'Next Question'
                : lang === 'hi' ? 'समाप्त करें' : 'Finish'
              }
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

