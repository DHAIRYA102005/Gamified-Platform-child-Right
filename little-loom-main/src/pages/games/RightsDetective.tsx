import { useState, useEffect, useCallback, useRef } from 'react';
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
  Clock, 
  FileText, 
  CheckCircle,
  XCircle,
  Search,
  Lightbulb,
  Gavel,
  Maximize,
  Minimize
} from 'lucide-react';
import { toast } from 'sonner';
import Confetti from 'react-confetti';
import { useFullscreen } from '@/hooks/use-fullscreen';

interface Case {
  id: number;
  title_en: string;
  title_hi: string;
  description_en: string;
  description_hi: string;
  clues_en: string[];
  clues_hi: string[];
  emoji: string;
  rights: { id: string; name_en: string; name_hi: string; correct: boolean }[];
  explanation_en: string;
  explanation_hi: string;
  points: number;
}

const cases: Case[] = [
  {
    id: 1,
    title_en: "The Missing School",
    title_hi: "गुमशुदा स्कूल",
    description_en: "In a small village, many children aged 8-12 have never been to school. The nearest school is 10 km away with no transport.",
    description_hi: "एक छोटे गांव में, 8-12 साल के कई बच्चे कभी स्कूल नहीं गए। निकटतम स्कूल 10 किमी दूर है और कोई परिवहन नहीं है।",
    clues_en: [
      "🔍 Children walk 2 hours to reach school",
      "📝 Village has 50+ children of school age",
      "🏫 No school within 1 km radius",
      "📋 Government rule: school within 1 km for every habitation"
    ],
    clues_hi: [
      "🔍 बच्चे स्कूल पहुंचने के लिए 2 घंटे पैदल चलते हैं",
      "📝 गांव में 50+ स्कूली उम्र के बच्चे हैं",
      "🏫 1 किमी के दायरे में कोई स्कूल नहीं",
      "📋 सरकारी नियम: हर बस्ती के लिए 1 किमी के भीतर स्कूल"
    ],
    emoji: "🏫",
    rights: [
      { id: "education", name_en: "Right to Education", name_hi: "शिक्षा का अधिकार", correct: true },
      { id: "health", name_en: "Right to Health", name_hi: "स्वास्थ्य का अधिकार", correct: false },
      { id: "play", name_en: "Right to Play", name_hi: "खेलने का अधिकार", correct: false },
      { id: "food", name_en: "Right to Food", name_hi: "भोजन का अधिकार", correct: false },
    ],
    explanation_en: "Under the Right to Education Act (RTE), the government must provide a school within 1 km for children aged 6-14. This is a clear violation of the Right to Education!",
    explanation_hi: "शिक्षा का अधिकार अधिनियम (RTE) के तहत, सरकार को 6-14 वर्ष के बच्चों के लिए 1 किमी के भीतर स्कूल प्रदान करना होगा। यह शिक्षा के अधिकार का स्पष्ट उल्लंघन है!",
    points: 75,
  },
  {
    id: 2,
    title_en: "The Factory Secret",
    title_hi: "फैक्ट्री का रहस्य",
    description_en: "Detective, we received a tip about a brick factory. Young children are seen working there during school hours.",
    description_hi: "जासूस, हमें एक ईंट भट्ठे के बारे में सूचना मिली। वहां स्कूल के समय छोटे बच्चे काम करते दिखे।",
    clues_en: [
      "👀 Children aged 10-12 carrying heavy bricks",
      "⏰ Working 8-10 hours daily",
      "📚 None attending school",
      "💰 Paid very little money"
    ],
    clues_hi: [
      "👀 10-12 साल के बच्चे भारी ईंटें उठाते हैं",
      "⏰ रोजाना 8-10 घंटे काम करते हैं",
      "📚 कोई स्कूल नहीं जाता",
      "💰 बहुत कम पैसे मिलते हैं"
    ],
    emoji: "🏭",
    rights: [
      { id: "protection", name_en: "Right to Protection from Child Labour", name_hi: "बाल श्रम से सुरक्षा का अधिकार", correct: true },
      { id: "name", name_en: "Right to Name", name_hi: "नाम का अधिकार", correct: false },
      { id: "nationality", name_en: "Right to Nationality", name_hi: "राष्ट्रीयता का अधिकार", correct: false },
      { id: "opinion", name_en: "Right to Opinion", name_hi: "राय का अधिकार", correct: false },
    ],
    explanation_en: "Child labour is illegal under the Child Labour (Prohibition) Act! Children under 14 cannot work in factories. This is a serious violation of the Right to Protection!",
    explanation_hi: "बाल श्रम (निषेध) अधिनियम के तहत बाल श्रम अवैध है! 14 साल से कम उम्र के बच्चे फैक्ट्रियों में काम नहीं कर सकते। यह सुरक्षा के अधिकार का गंभीर उल्लंघन है!",
    points: 75,
  },
  {
    id: 3,
    title_en: "The Hungry Children",
    title_hi: "भूखे बच्चे",
    description_en: "A government school is reported to have stopped serving mid-day meals. Many children come from poor families.",
    description_hi: "एक सरकारी स्कूल में मध्याह्न भोजन बंद होने की खबर है। कई बच्चे गरीब परिवारों से आते हैं।",
    clues_en: [
      "🍽️ No mid-day meals for 2 months",
      "👨‍🍳 School cook hasn't been paid",
      "📉 Attendance dropped by 40%",
      "😢 Children complaining of hunger"
    ],
    clues_hi: [
      "🍽️ 2 महीने से मध्याह्न भोजन नहीं",
      "👨‍🍳 स्कूल के रसोइए को भुगतान नहीं हुआ",
      "📉 उपस्थिति 40% कम हुई",
      "😢 बच्चे भूख की शिकायत करते हैं"
    ],
    emoji: "🍱",
    rights: [
      { id: "food", name_en: "Right to Food & Nutrition", name_hi: "भोजन और पोषण का अधिकार", correct: true },
      { id: "privacy", name_en: "Right to Privacy", name_hi: "गोपनीयता का अधिकार", correct: false },
      { id: "play", name_en: "Right to Play", name_hi: "खेलने का अधिकार", correct: false },
      { id: "name", name_en: "Right to Name", name_hi: "नाम का अधिकार", correct: false },
    ],
    explanation_en: "The Mid-Day Meal Scheme is a legal right! It ensures children get nutritious food at school, improving both health and attendance. This is a violation of the Right to Food!",
    explanation_hi: "मध्याह्न भोजन योजना एक कानूनी अधिकार है! यह सुनिश्चित करती है कि बच्चों को स्कूल में पौष्टिक भोजन मिले। यह भोजन के अधिकार का उल्लंघन है!",
    points: 75,
  },
  {
    id: 4,
    title_en: "The Unregistered Baby",
    title_hi: "अपंजीकृत बच्चा",
    description_en: "A 5-year-old named Meera has no birth certificate. Without it, she cannot be enrolled in school.",
    description_hi: "5 साल की मीरा के पास जन्म प्रमाण पत्र नहीं है। इसके बिना उसे स्कूल में दाखिला नहीं मिल सकता।",
    clues_en: [
      "📄 No birth certificate issued",
      "🏥 Born at home, not hospital",
      "🎒 Cannot enroll in school",
      "🆔 No official identity proof"
    ],
    clues_hi: [
      "📄 जन्म प्रमाण पत्र जारी नहीं हुआ",
      "🏥 अस्पताल में नहीं, घर पर जन्म",
      "🎒 स्कूल में दाखिला नहीं हो सकता",
      "🆔 कोई आधिकारिक पहचान प्रमाण नहीं"
    ],
    emoji: "👶",
    rights: [
      { id: "identity", name_en: "Right to Identity (Birth Registration)", name_hi: "पहचान का अधिकार (जन्म पंजीकरण)", correct: true },
      { id: "health", name_en: "Right to Health", name_hi: "स्वास्थ्य का अधिकार", correct: false },
      { id: "play", name_en: "Right to Play", name_hi: "खेलने का अधिकार", correct: false },
      { id: "opinion", name_en: "Right to Opinion", name_hi: "राय का अधिकार", correct: false },
    ],
    explanation_en: "Every child has the Right to Identity! Birth registration is mandatory and free. It gives children access to education, health services, and legal protection.",
    explanation_hi: "हर बच्चे को पहचान का अधिकार है! जन्म पंजीकरण अनिवार्य और मुफ्त है। यह बच्चों को शिक्षा, स्वास्थ्य सेवाओं और कानूनी सुरक्षा तक पहुंच देता है।",
    points: 75,
  },
];

export default function RightsDetective() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const lang = i18n.language;
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const { isFullscreen, toggleFullscreen } = useFullscreen();
  
  const [currentCase, setCurrentCase] = useState(0);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameStarted, setGameStarted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [casesCompleted, setCasesCompleted] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const caseData = cases[currentCase];

  // Timer
  useEffect(() => {
    if (!gameStarted || showResult || gameComplete) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeUp();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, showResult, gameComplete]);

  const handleTimeUp = () => {
    setShowResult(true);
    setIsCorrect(false);
    toast.error(lang === 'hi' ? 'समय समाप्त!' : "Time's up!");
  };

  const handleStartGame = () => {
    setGameStarted(true);
    setTimeLeft(60);
  };

  const handleSelectRight = (rightId: string) => {
    if (showResult) return;
    setSelectedRight(rightId);
  };

  const handleSubmit = async () => {
    if (!selectedRight) return;

    const selectedRightData = caseData.rights.find(r => r.id === selectedRight);
    const correct = selectedRightData?.correct || false;
    
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      const pointsEarned = caseData.points + Math.floor(timeLeft * 0.5);
      setScore(score + pointsEarned);
      setCasesCompleted(casesCompleted + 1);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      toast.success(`+${pointsEarned} points! (Time bonus: +${Math.floor(timeLeft * 0.5)})`);

      // Save to database
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await supabase.from('profiles').update({
          points: score + pointsEarned,
        }).eq('id', session.user.id);
      }
    }
  };

  const handleNextCase = () => {
    if (currentCase >= cases.length - 1) {
      setGameComplete(true);
      return;
    }

    setCurrentCase(currentCase + 1);
    setSelectedRight(null);
    setShowResult(false);
    setTimeLeft(60);
    setShowHint(false);
  };

  if (!gameStarted) {
    return (
      <div className="max-w-2xl mx-auto">
        <Button variant="ghost" onClick={() => navigate('/games')} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          {lang === 'hi' ? 'वापस' : 'Back'}
        </Button>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <Card className="text-center p-8">
            <CardContent className="space-y-6">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-8xl"
              >
                🔍
              </motion.div>
              <h1 className="text-4xl font-extrabold">
                {lang === 'hi' ? 'अधिकार जासूस' : 'Rights Detective'}
              </h1>
              <p className="text-lg text-muted-foreground">
                {lang === 'hi' 
                  ? 'मामलों को सुलझाएं! सुरागों को पढ़ें और सही बाल अधिकार खोजें।'
                  : 'Solve cases! Read the clues and identify the correct child right being violated.'
                }
              </p>
              <div className="flex justify-center gap-8 py-4 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <span>60s per case</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-secondary" />
                  <span>{cases.length} cases</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-accent" />
                  <span>Time bonus</span>
                </div>
              </div>
              <Button size="lg" onClick={handleStartGame} className="text-lg px-8">
                {lang === 'hi' ? 'जांच शुरू करें' : 'Start Investigation'} 🔍
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (gameComplete) {
    return (
      <div className="max-w-2xl mx-auto">
        <Confetti numberOfPieces={300} recycle={false} />
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
                🏆
              </motion.div>
              <h1 className="text-4xl font-extrabold text-success">
                {lang === 'hi' ? 'महान जासूस!' : 'Great Detective!'}
              </h1>
              <div className="flex justify-center gap-8 py-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary">{score}</div>
                  <div className="text-muted-foreground">Total Points</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-success">{casesCompleted}</div>
                  <div className="text-muted-foreground">Cases Solved</div>
                </div>
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

  return (
    <div 
      ref={gameContainerRef}
      className={`max-w-4xl mx-auto space-y-6 ${isFullscreen ? 'p-6' : ''}`}
    >
      {showConfetti && <Confetti numberOfPieces={150} recycle={false} />}

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <Button variant="ghost" onClick={() => navigate('/games')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          {lang === 'hi' ? 'वापस' : 'Back'}
        </Button>
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${timeLeft <= 10 ? 'bg-destructive/20 text-destructive animate-pulse' : 'bg-muted'}`}>
            <Clock className="w-5 h-5" />
            <span className="font-bold text-lg">{timeLeft}s</span>
          </div>
          <Badge variant="secondary" className="text-lg px-4 py-1">
            <Star className="w-4 h-4 mr-1 text-accent" />
            {score} pts
          </Badge>
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
          <span className="text-muted-foreground">Case {currentCase + 1}/{cases.length}</span>
          <span className="font-medium">{Math.round(((currentCase) / cases.length) * 100)}%</span>
        </div>
        <Progress value={((currentCase) / cases.length) * 100} className="h-3" />
      </div>

      {/* Case File */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentCase}
          initial={{ opacity: 0, rotateY: -90 }}
          animate={{ opacity: 1, rotateY: 0 }}
          exit={{ opacity: 0, rotateY: 90 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-secondary/20 to-primary/20 pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <motion.div
                    className="text-5xl"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {caseData.emoji}
                  </motion.div>
                  <div>
                    <Badge variant="outline" className="mb-2">Case #{currentCase + 1}</Badge>
                    <CardTitle className="text-2xl">
                      {lang === 'hi' ? caseData.title_hi : caseData.title_en}
                    </CardTitle>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowHint(!showHint)}
                  className="gap-2"
                >
                  <Lightbulb className="w-4 h-4" />
                  Hint
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {/* Description */}
              <div className="bg-muted/50 p-4 rounded-xl">
                <p className="text-lg">
                  {lang === 'hi' ? caseData.description_hi : caseData.description_en}
                </p>
              </div>

              {/* Clues */}
              <div>
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <Search className="w-5 h-5 text-primary" />
                  {lang === 'hi' ? 'सुराग:' : 'Clues:'}
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {(lang === 'hi' ? caseData.clues_hi : caseData.clues_en).map((clue, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.15 }}
                      className="p-3 bg-card border rounded-lg text-sm"
                    >
                      {clue}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Hint */}
              <AnimatePresence>
                {showHint && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 bg-accent/10 border border-accent/30 rounded-xl"
                  >
                    <div className="flex items-start gap-3">
                      <Lightbulb className="w-5 h-5 text-accent mt-0.5" />
                      <p className="text-sm">
                        {lang === 'hi' 
                          ? 'सोचें: कौन सा मूल अधिकार यहां छीना जा रहा है? क्या यह शिक्षा, सुरक्षा, स्वास्थ्य या पहचान से संबंधित है?'
                          : 'Think: Which fundamental right is being denied here? Is it related to education, protection, health, or identity?'
                        }
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Rights Selection */}
              <div>
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <Gavel className="w-5 h-5 text-secondary" />
                  {lang === 'hi' ? 'कौन सा अधिकार का उल्लंघन हो रहा है?' : 'Which right is being violated?'}
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {caseData.rights.map((right, index) => (
                    <motion.button
                      key={right.id}
                      onClick={() => handleSelectRight(right.id)}
                      disabled={showResult}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={!showResult ? { scale: 1.02 } : {}}
                      whileTap={!showResult ? { scale: 0.98 } : {}}
                      className={`
                        p-4 rounded-xl border-2 text-left transition-all flex items-center gap-3
                        ${selectedRight === right.id 
                          ? showResult
                            ? right.correct
                              ? 'border-success bg-success/10'
                              : 'border-destructive bg-destructive/10'
                            : 'border-primary bg-primary/10'
                          : showResult && right.correct
                            ? 'border-success bg-success/10'
                            : 'border-border hover:border-muted-foreground'
                        }
                        ${showResult ? 'cursor-default' : 'cursor-pointer'}
                      `}
                    >
                      <span className="flex-1 font-medium">
                        {lang === 'hi' ? right.name_hi : right.name_en}
                      </span>
                      {showResult && right.correct && (
                        <CheckCircle className="w-5 h-5 text-success" />
                      )}
                      {showResult && selectedRight === right.id && !right.correct && (
                        <XCircle className="w-5 h-5 text-destructive" />
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Result */}
              <AnimatePresence>
                {showResult && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className={`p-4 rounded-xl ${isCorrect ? 'bg-success/10 border border-success' : 'bg-destructive/10 border border-destructive'}`}
                  >
                    <div className="flex items-start gap-3">
                      <Gavel className={`w-6 h-6 mt-1 ${isCorrect ? 'text-success' : 'text-destructive'}`} />
                      <div>
                        <p className="font-bold mb-1">
                          {isCorrect 
                            ? (lang === 'hi' ? '🎉 सही! मामला सुलझाया!' : '🎉 Correct! Case Solved!') 
                            : (lang === 'hi' ? '❌ गलत जवाब' : '❌ Wrong Answer')}
                        </p>
                        <p className="text-sm">
                          {lang === 'hi' ? caseData.explanation_hi : caseData.explanation_en}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Button */}
              {!showResult ? (
                <Button 
                  onClick={handleSubmit} 
                  disabled={!selectedRight}
                  className="w-full text-lg py-6"
                  size="lg"
                >
                  {lang === 'hi' ? 'जवाब जमा करें' : 'Submit Answer'} ⚖️
                </Button>
              ) : (
                <Button 
                  onClick={handleNextCase}
                  className="w-full text-lg py-6"
                  size="lg"
                >
                  {currentCase >= cases.length - 1
                    ? (lang === 'hi' ? 'परिणाम देखें' : 'See Results')
                    : (lang === 'hi' ? 'अगला मामला' : 'Next Case')
                  } →
                </Button>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
