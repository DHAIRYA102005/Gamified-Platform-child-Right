/**
 * Rights Quiz Challenge - Example New Game
 * A quiz game where players answer questions about children's rights
 */

import { useState, useEffect, useRef } from 'react';
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
  Zap,
  Lightbulb,
  Maximize,
  Minimize
} from 'lucide-react';
import { toast } from 'sonner';
import Confetti from 'react-confetti';
import { useFullscreen } from '@/hooks/use-fullscreen';

interface Question {
  id: number;
  question_en: string;
  question_hi: string;
  options: Array<{ id: string; text_en: string; text_hi: string }>;
  correct: string;
  explanation_en: string;
  explanation_hi: string;
  points: number;
  category: string;
}

const questions: Question[] = [
  {
    id: 1,
    question_en: 'At what age does a child have the right to free education in India?',
    question_hi: 'भारत में किस उम्र तक बच्चे को मुफ्त शिक्षा का अधिकार है?',
    options: [
      { id: 'a', text_en: '6 to 14 years', text_hi: '6 से 14 वर्ष' },
      { id: 'b', text_en: '5 to 12 years', text_hi: '5 से 12 वर्ष' },
      { id: 'c', text_en: '8 to 16 years', text_hi: '8 से 16 वर्ष' },
      { id: 'd', text_en: '10 to 18 years', text_hi: '10 से 18 वर्ष' },
    ],
    correct: 'a',
    explanation_en: 'The Right to Education Act (RTE) guarantees free education for children aged 6-14 years.',
    explanation_hi: 'शिक्षा का अधिकार अधिनियम (RTE) 6-14 वर्ष के बच्चों के लिए मुफ्त शिक्षा की गारंटी देता है।',
    points: 20,
    category: 'Education',
  },
  {
    id: 2,
    question_en: 'Which right protects children from working in factories?',
    question_hi: 'कौन सा अधिकार बच्चों को फैक्ट्रियों में काम करने से बचाता है?',
    options: [
      { id: 'a', text_en: 'Right to Education', text_hi: 'शिक्षा का अधिकार' },
      { id: 'b', text_en: 'Right to Protection from Child Labour', text_hi: 'बाल श्रम से सुरक्षा का अधिकार' },
      { id: 'c', text_en: 'Right to Play', text_hi: 'खेलने का अधिकार' },
      { id: 'd', text_en: 'Right to Health', text_hi: 'स्वास्थ्य का अधिकार' },
    ],
    correct: 'b',
    explanation_en: 'The Child Labour (Prohibition) Act protects children under 14 from working in factories.',
    explanation_hi: 'बाल श्रम (निषेध) अधिनियम 14 साल से कम उम्र के बच्चों को फैक्ट्रियों में काम करने से बचाता है।',
    points: 20,
    category: 'Protection',
  },
  {
    id: 3,
    question_en: 'Every child has the right to:',
    question_hi: 'हर बच्चे को अधिकार है:',
    options: [
      { id: 'a', text_en: 'A name and nationality', text_hi: 'एक नाम और राष्ट्रीयता' },
      { id: 'b', text_en: 'Only education', text_hi: 'केवल शिक्षा' },
      { id: 'c', text_en: 'Only food', text_hi: 'केवल भोजन' },
      { id: 'd', text_en: 'Only play', text_hi: 'केवल खेल' },
    ],
    correct: 'a',
    explanation_en: 'Every child has the right to a name, nationality, and identity from birth.',
    explanation_hi: 'हर बच्चे को जन्म से ही नाम, राष्ट्रीयता और पहचान का अधिकार है।',
    points: 15,
    category: 'Identity',
  },
  {
    id: 4,
    question_en: 'What should you do if you see a child being bullied?',
    question_hi: 'यदि आप किसी बच्चे को परेशान होते देखें तो क्या करना चाहिए?',
    options: [
      { id: 'a', text_en: 'Ignore it', text_hi: 'इसे अनदेखा करें' },
      { id: 'b', text_en: 'Tell a trusted adult', text_hi: 'किसी भरोसेमंद वयस्क को बताएं' },
      { id: 'c', text_en: 'Join the bullying', text_hi: 'बदमाशी में शामिल हों' },
      { id: 'd', text_en: 'Do nothing', text_hi: 'कुछ न करें' },
    ],
    correct: 'b',
    explanation_en: 'Always tell a trusted adult (teacher, parent, or guardian) if you see bullying. It\'s important to protect children\'s right to safety.',
    explanation_hi: 'यदि आप बदमाशी देखते हैं तो हमेशा किसी भरोसेमंद वयस्क (शिक्षक, माता-पिता, या अभिभावक) को बताएं।',
    points: 25,
    category: 'Protection',
  },
  {
    id: 5,
    question_en: 'Children have the right to express their opinions about matters affecting them.',
    question_hi: 'बच्चों को उनसे जुड़े मामलों पर अपनी राय व्यक्त करने का अधिकार है।',
    options: [
      { id: 'a', text_en: 'True', text_hi: 'सत्य' },
      { id: 'b', text_en: 'False', text_hi: 'असत्य' },
    ],
    correct: 'a',
    explanation_en: 'Yes! Children have the right to express their views and be heard in matters that affect them.',
    explanation_hi: 'हाँ! बच्चों को अपने विचार व्यक्त करने और उनसे जुड़े मामलों में सुने जाने का अधिकार है।',
    points: 20,
    category: 'Participation',
  },
];

export default function RightsQuiz() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const lang = i18n.language;
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const { isFullscreen, toggleFullscreen } = useFullscreen();
  
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [streak, setStreak] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);

  // Timer
  useEffect(() => {
    if (gameWon || isAnswered || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isAnswered, gameWon]);

  // Check win condition
  useEffect(() => {
    if (currentQuestion >= questions.length && score > 0 && !gameWon) {
      setGameWon(true);
      setShowConfetti(true);
      saveProgress();
      toast.success(lang === 'hi' ? 'बधाई हो! क्विज पूरा!' : 'Congratulations! Quiz Complete!');
    }
  }, [currentQuestion, score, gameWon, lang]);

  const handleAnswer = (answerId: string) => {
    if (isAnswered) return;

    setSelectedAnswer(answerId);
    setIsAnswered(true);

    const question = questions[currentQuestion];
    const isCorrect = answerId === question.correct;

    if (isCorrect) {
      const basePoints = question.points;
      const streakBonus = streak * 5;
      const timeBonus = Math.floor(timeLeft / 5);
      const totalPoints = basePoints + streakBonus + timeBonus;

      setScore(prev => prev + totalPoints);
      setStreak(prev => prev + 1);
      
      toast.success(
        lang === 'hi' 
          ? `सही! +${totalPoints} अंक (${basePoints} + ${streakBonus} streak + ${timeBonus} time)`
          : `Correct! +${totalPoints} points (${basePoints} + ${streakBonus} streak + ${timeBonus} time)`
      );
    } else {
      setStreak(0);
      toast.error(lang === 'hi' ? 'गलत! कोई अंक नहीं मिले' : 'Wrong! No points earned');
    }
  };

  const handleTimeUp = () => {
    setIsAnswered(true);
    setStreak(0);
    toast.warning(lang === 'hi' ? 'समय समाप्त!' : 'Time\'s up!');
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setTimeLeft(30);
    } else {
      setGameWon(true);
      saveProgress();
    }
  };

  const handleHint = () => {
    if (hintsUsed >= 2) {
      toast.info(lang === 'hi' ? 'आपने सभी संकेत उपयोग कर लिए!' : 'You\'ve used all hints!');
      return;
    }
    setHintsUsed(prev => prev + 1);
    toast.info(lang === 'hi' ? 'संकेत: सही उत्तर के बारे में सोचें!' : 'Hint: Think about the right answer!');
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
    const percentage = Math.round((score / (questions.length * 25)) * 100);
    
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
                {lang === 'hi' ? 'क्विज पूरा!' : 'Quiz Complete!'}
              </h1>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">{score} {lang === 'hi' ? 'अंक' : 'Points'}</div>
                <div className="text-lg text-muted-foreground">{percentage}% {lang === 'hi' ? 'स्कोर' : 'Score'}</div>
                {streak > 0 && (
                  <div className="text-sm text-accent">🔥 {streak} {lang === 'hi' ? 'लगातार सही' : 'Streak'}</div>
                )}
              </div>
              <Button size="lg" onClick={() => navigate('/games')} className="w-full">
                {lang === 'hi' ? 'वापस जाएं' : 'Back to Games'}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (currentQuestion >= questions.length) {
    return null;
  }

  const currentQ = questions[currentQuestion];

  return (
    <div 
      ref={gameContainerRef}
      className={`space-y-6 ${isFullscreen ? 'p-6' : ''}`}
    >
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
            <Clock className="w-4 h-4 mr-1" />
            {timeLeft}s
          </Badge>
          {streak > 0 && (
            <Badge variant="default" className="text-lg px-4 py-1 bg-accent">
              🔥 {streak}
            </Badge>
          )}
          <Button
            variant="outline"
            size="icon"
            onClick={() => gameContainerRef.current && toggleFullscreen(gameContainerRef.current)}
            className="hover:bg-primary/10 border-border shadow-md"
            title={isFullscreen ? (lang === 'hi' ? 'पूर्ण स्क्रीन से बाहर निकलें' : 'Exit Fullscreen') : (lang === 'hi' ? 'पूर्ण स्क्रीन' : 'Fullscreen')}
          >
            {isFullscreen ? (
              <Minimize className="w-5 h-5" />
            ) : (
              <Maximize className="w-5 h-5" />
            )}
          </Button>
        </div>
      </motion.div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>{lang === 'hi' ? 'प्रश्न' : 'Question'} {currentQuestion + 1} / {questions.length}</span>
          <span>{lang === 'hi' ? 'श्रेणी' : 'Category'}: {currentQ.category}</span>
        </div>
        <Progress value={((currentQuestion + 1) / questions.length) * 100} className="h-2" />
      </div>

      {/* Question Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            {lang === 'hi' ? currentQ.question_hi : currentQ.question_en}
          </CardTitle>
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

          {/* Action Buttons */}
          <div className="flex gap-3">
            {!isAnswered && (
              <Button 
                variant="outline"
                onClick={handleHint}
                disabled={hintsUsed >= 2}
                className="flex-1"
              >
                <Lightbulb className="w-4 h-4 mr-2" />
                {lang === 'hi' ? 'संकेत' : 'Hint'} ({2 - hintsUsed} {lang === 'hi' ? 'बचे' : 'left'})
              </Button>
            )}
            {isAnswered && (
              <Button 
                size="lg" 
                onClick={handleNext}
                className="flex-1"
              >
                {currentQuestion < questions.length - 1
                  ? lang === 'hi' ? 'अगला प्रश्न' : 'Next Question'
                  : lang === 'hi' ? 'समाप्त करें' : 'Finish Quiz'
                }
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

