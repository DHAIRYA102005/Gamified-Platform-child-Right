import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Star, Trophy, Sparkles, Heart, CheckCircle, XCircle, Maximize, Minimize } from 'lucide-react';
import { toast } from 'sonner';
import Confetti from 'react-confetti';
import { useFullscreen } from '@/hooks/use-fullscreen';

interface Scenario {
  id: number;
  title_en: string;
  title_hi: string;
  story_en: string;
  story_hi: string;
  image_emoji: string;
  choices: {
    id: string;
    text_en: string;
    text_hi: string;
  }[];
  correct_choice: string;
  explanation_en: string;
  explanation_hi: string;
  right_covered: string;
  points: number;
}

const scenarios: Scenario[] = [
  {
    id: 1,
    title_en: "Riya's School Dream",
    title_hi: "रिया का स्कूल का सपना",
    story_en: "Riya is a 10-year-old girl who loves learning. But her parents say she should stop school and help at home. Her neighbor says all children have the right to go to school. What should Riya do?",
    story_hi: "रिया 10 साल की लड़की है जिसे पढ़ना बहुत पसंद है। लेकिन उसके माता-पिता कहते हैं कि उसे स्कूल छोड़कर घर पर मदद करनी चाहिए। उसकी पड़ोसन कहती है कि सभी बच्चों को स्कूल जाने का अधिकार है। रिया को क्या करना चाहिए?",
    image_emoji: "📚",
    choices: [
      { id: "a", text_en: "Stop going to school", text_hi: "स्कूल जाना बंद करें" },
      { id: "b", text_en: "Talk to a teacher for help", text_hi: "मदद के लिए शिक्षक से बात करें" },
      { id: "c", text_en: "Run away from home", text_hi: "घर से भाग जाएं" },
      { id: "d", text_en: "Stay silent and accept it", text_hi: "चुप रहें और स्वीकार करें" },
    ],
    correct_choice: "b",
    explanation_en: "Under the Right to Education Act (RTE), every child between 6-14 years has the right to free and compulsory education. Teachers and schools can help families understand this important right!",
    explanation_hi: "शिक्षा का अधिकार अधिनियम (RTE) के तहत, 6-14 वर्ष के हर बच्चे को मुफ्त और अनिवार्य शिक्षा का अधिकार है। शिक्षक और स्कूल परिवारों को इस महत्वपूर्ण अधिकार को समझने में मदद कर सकते हैं!",
    right_covered: "Right to Education",
    points: 50,
  },
  {
    id: 2,
    title_en: "Arjun's Safety",
    title_hi: "अर्जुन की सुरक्षा",
    story_en: "Arjun, 12 years old, is being bullied at school by older students. They take his lunch money and push him around. He's scared to tell anyone. What should Arjun do?",
    story_hi: "12 साल का अर्जुन स्कूल में बड़े छात्रों द्वारा तंग किया जा रहा है। वे उसके लंच के पैसे छीन लेते हैं और उसे धक्का देते हैं। उसे किसी को बताने में डर लगता है। अर्जुन को क्या करना चाहिए?",
    image_emoji: "🛡️",
    choices: [
      { id: "a", text_en: "Fight back with violence", text_hi: "हिंसा से जवाब दें" },
      { id: "b", text_en: "Skip school to avoid bullies", text_hi: "बदमाशों से बचने के लिए स्कूल छोड़ें" },
      { id: "c", text_en: "Tell a trusted adult like a parent or teacher", text_hi: "माता-पिता या शिक्षक जैसे विश्वसनीय वयस्क को बताएं" },
      { id: "d", text_en: "Give them whatever they want", text_hi: "उन्हें जो चाहिए वह दे दें" },
    ],
    correct_choice: "c",
    explanation_en: "Every child has the Right to Protection from harm and abuse. Adults like parents, teachers, and Childline (1098) can help protect you. Never suffer in silence - speaking up is brave!",
    explanation_hi: "हर बच्चे को नुकसान और दुर्व्यवहार से सुरक्षा का अधिकार है। माता-पिता, शिक्षक और चाइल्डलाइन (1098) जैसे वयस्क आपकी सुरक्षा में मदद कर सकते हैं। कभी चुप न रहें - बोलना बहादुरी है!",
    right_covered: "Right to Protection",
    points: 50,
  },
  {
    id: 3,
    title_en: "Priya's Health",
    title_hi: "प्रिया का स्वास्थ्य",
    story_en: "Priya has been feeling sick for days but her family says they can't afford a doctor. She knows there's a government hospital nearby. What should she do?",
    story_hi: "प्रिया कई दिनों से बीमार है लेकिन उसका परिवार कहता है कि वे डॉक्टर का खर्च नहीं उठा सकते। उसे पता है कि पास में एक सरकारी अस्पताल है। उसे क्या करना चाहिए?",
    image_emoji: "🏥",
    choices: [
      { id: "a", text_en: "Ignore the illness and hope it goes away", text_hi: "बीमारी को अनदेखा करें और उम्मीद करें कि ठीक हो जाए" },
      { id: "b", text_en: "Ask to visit the government hospital for free treatment", text_hi: "मुफ्त इलाज के लिए सरकारी अस्पताल जाने के लिए कहें" },
      { id: "c", text_en: "Buy medicines from a shop without prescription", text_hi: "बिना पर्चे के दुकान से दवाई खरीदें" },
      { id: "d", text_en: "Stay home from school forever", text_hi: "हमेशा के लिए स्कूल से घर रहें" },
    ],
    correct_choice: "b",
    explanation_en: "Every child has the Right to Health! Government hospitals provide free or low-cost treatment. Under various government schemes, children can get free healthcare. Your health is important!",
    explanation_hi: "हर बच्चे को स्वास्थ्य का अधिकार है! सरकारी अस्पताल मुफ्त या कम लागत पर इलाज प्रदान करते हैं। विभिन्न सरकारी योजनाओं के तहत बच्चों को मुफ्त स्वास्थ्य सेवा मिल सकती है। आपका स्वास्थ्य महत्वपूर्ण है!",
    right_covered: "Right to Health",
    points: 50,
  },
  {
    id: 4,
    title_en: "Equal Treatment",
    title_hi: "समान व्यवहार",
    story_en: "In Maya's village, girls are not allowed to play sports. The boys say sports are only for them. Maya loves cricket and wants to play. What should she do?",
    story_hi: "माया के गांव में लड़कियों को खेल खेलने की अनुमति नहीं है। लड़के कहते हैं कि खेल केवल उनके लिए हैं। माया को क्रिकेट पसंद है और वह खेलना चाहती है। उसे क्या करना चाहिए?",
    image_emoji: "⚽",
    choices: [
      { id: "a", text_en: "Accept that sports are not for girls", text_hi: "स्वीकार करें कि खेल लड़कियों के लिए नहीं हैं" },
      { id: "b", text_en: "Speak to elders about girls' right to play", text_hi: "लड़कियों के खेलने के अधिकार के बारे में बड़ों से बात करें" },
      { id: "c", text_en: "Play secretly and hide from everyone", text_hi: "गुप्त रूप से खेलें और सबसे छुपें" },
      { id: "d", text_en: "Stop liking sports", text_hi: "खेल पसंद करना बंद करें" },
    ],
    correct_choice: "b",
    explanation_en: "The Right to Equality means all children - boys and girls - have equal rights to play, learn, and grow! No child should be treated differently because of their gender.",
    explanation_hi: "समानता का अधिकार का मतलब है कि सभी बच्चों - लड़कों और लड़कियों - को खेलने, सीखने और बढ़ने के समान अधिकार हैं! किसी भी बच्चे के साथ उसके लिंग के कारण अलग व्यवहार नहीं होना चाहिए।",
    right_covered: "Right to Equality",
    points: 50,
  },
  {
    id: 5,
    title_en: "Child Labor",
    title_hi: "बाल श्रम",
    story_en: "Rahul, 11, is asked by a factory owner to work there instead of going to school. The owner promises money for his family. What should Rahul's family do?",
    story_hi: "11 साल के राहुल को एक फैक्ट्री मालिक ने स्कूल के बजाय वहां काम करने के लिए कहा। मालिक उसके परिवार के लिए पैसे का वादा करता है। राहुल के परिवार को क्या करना चाहिए?",
    image_emoji: "🏭",
    choices: [
      { id: "a", text_en: "Accept the job - money is important", text_hi: "नौकरी स्वीकार करें - पैसा महत्वपूर्ण है" },
      { id: "b", text_en: "Report to Childline 1098 and keep Rahul in school", text_hi: "चाइल्डलाइन 1098 में रिपोर्ट करें और राहुल को स्कूल में रखें" },
      { id: "c", text_en: "Let Rahul decide on his own", text_hi: "राहुल को खुद फैसला करने दें" },
      { id: "d", text_en: "Wait until Rahul is 14 to start work", text_hi: "काम शुरू करने के लिए 14 साल तक इंतजार करें" },
    ],
    correct_choice: "b",
    explanation_en: "Child labor is illegal! Children under 14 cannot work in factories or hazardous jobs. The Child Labour Act protects children's right to education and a safe childhood. Call Childline 1098 to report violations!",
    explanation_hi: "बाल श्रम अवैध है! 14 साल से कम उम्र के बच्चे फैक्ट्रियों या खतरनाक नौकरियों में काम नहीं कर सकते। बाल श्रम अधिनियम बच्चों के शिक्षा और सुरक्षित बचपन के अधिकार की रक्षा करता है। उल्लंघन की रिपोर्ट के लिए चाइल्डलाइन 1098 पर कॉल करें!",
    right_covered: "Right to Protection",
    points: 50,
  },
];

export default function RightsRescue() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const lang = i18n.language;
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const { isFullscreen, toggleFullscreen } = useFullscreen();
  
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [showConfetti, setShowConfetti] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);

  const scenario = scenarios[currentScenario];
  const progress = ((currentScenario) / scenarios.length) * 100;

  const handleChoiceSelect = (choiceId: string) => {
    if (showResult) return;
    setSelectedChoice(choiceId);
  };

  const handleSubmit = async () => {
    if (!selectedChoice) return;

    const correct = selectedChoice === scenario.correct_choice;
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      setScore(score + scenario.points);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      toast.success(`+${scenario.points} points! 🎉`);
    } else {
      setLives(lives - 1);
      if (lives <= 1) {
        toast.error('Game Over! Try again!');
      }
    }

    // Save progress to database
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      await supabase.from('profiles').update({
        points: score + (correct ? scenario.points : 0),
      }).eq('id', session.user.id);
    }
  };

  const handleNext = () => {
    if (lives <= 0) {
      // Reset game
      setCurrentScenario(0);
      setScore(0);
      setLives(3);
      setShowResult(false);
      setSelectedChoice(null);
      return;
    }

    if (currentScenario >= scenarios.length - 1) {
      setGameComplete(true);
      return;
    }

    setCurrentScenario(currentScenario + 1);
    setSelectedChoice(null);
    setShowResult(false);
  };

  if (gameComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-4">
        <Confetti numberOfPieces={300} recycle={false} />
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-2xl w-full"
        >
          <Card className="p-10 border-4 border-success shadow-2xl bg-gradient-to-br from-card to-card/80">
            <CardContent className="space-y-8">
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-9xl drop-shadow-2xl"
              >
                🏆
              </motion.div>
              <h1 className="text-5xl font-extrabold bg-gradient-to-r from-success to-green-400 bg-clip-text text-transparent">
                {lang === 'hi' ? 'बधाई हो!' : 'Congratulations!'}
              </h1>
              <p className="text-xl text-muted-foreground">
                {lang === 'hi' 
                  ? 'आपने सभी परिदृश्यों को पूरा कर लिया!'
                  : 'You completed all scenarios!'
                }
              </p>
              <div className="grid grid-cols-2 gap-6 py-6">
                <Card className="p-6 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-500/30">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-blue-400 mb-2">{score}</div>
                    <div className="text-muted-foreground font-medium">{lang === 'hi' ? 'कुल अंक' : 'Total Points'}</div>
                  </div>
                </Card>
                <Card className="p-6 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/30">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-purple-400 mb-2">{scenarios.length}</div>
                    <div className="text-muted-foreground font-medium">{lang === 'hi' ? 'अधिकार सीखे' : 'Rights Learned'}</div>
                  </div>
                </Card>
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  size="lg" 
                  onClick={() => navigate('/games')} 
                  className="w-full bg-gradient-to-r from-primary to-accent text-white shadow-lg hover:shadow-xl text-lg py-7"
                >
                  {lang === 'hi' ? 'वापस जाएं' : 'Back to Games'}
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div 
      ref={gameContainerRef}
      className={`min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex flex-col items-center justify-center p-4 ${isFullscreen ? 'p-6' : ''}`}
    >
      {showConfetti && <Confetti numberOfPieces={200} recycle={false} />}

      <div className={`max-w-4xl w-full space-y-6 ${isFullscreen ? 'max-w-6xl' : ''}`}>
        {/* Header - Enhanced */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <Button 
            variant="ghost" 
            onClick={() => navigate('/games')}
            className="hover:bg-primary/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {lang === 'hi' ? 'वापस' : 'Back'}
          </Button>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-card/80 backdrop-blur-sm px-4 py-2 rounded-full border border-border shadow-md">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={i < lives ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                >
                  <Heart
                    className={`w-6 h-6 ${i < lives ? 'text-destructive fill-destructive' : 'text-muted opacity-30'}`}
                  />
                </motion.div>
              ))}
            </div>
            <Badge variant="secondary" className="text-lg px-5 py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/50 shadow-md">
              <Star className="w-4 h-4 mr-2 text-yellow-500 fill-yellow-500" />
              <span className="font-bold">{score}</span> {lang === 'hi' ? 'अंक' : 'pts'}
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

        {/* Progress - Enhanced */}
        <Card className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/30">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground font-medium">
                {lang === 'hi' ? 'परिदृश्य' : 'Scenario'} {currentScenario + 1}/{scenarios.length}
              </span>
              <span className="font-bold text-primary">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3 bg-muted" />
          </div>
        </Card>

        {/* Scenario Card - Enhanced */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScenario}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <Card className="overflow-hidden border-2 border-primary/20 shadow-2xl">
              {/* Story Section - Enhanced */}
              <div className="bg-gradient-to-br from-indigo-600/20 via-purple-600/20 to-pink-600/20 p-8 relative overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 opacity-20">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-32 h-32 rounded-full bg-white/10 blur-2xl"
                      style={{
                        left: `${20 + i * 30}%`,
                        top: `${20 + i * 20}%`,
                      }}
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.2, 0.4, 0.2],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: i * 0.5,
                      }}
                    />
                  ))}
                </div>
                <motion.div
                  className="text-8xl text-center mb-4 relative z-10 drop-shadow-2xl"
                  animate={{ 
                    y: [0, -15, 0],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {scenario.image_emoji}
                </motion.div>
                <Badge className="absolute top-4 right-4 bg-gradient-to-r from-accent to-primary text-white shadow-lg z-10 border-2 border-white/20">
                  <Sparkles className="w-3 h-3 mr-1" />
                  {scenario.right_covered}
                </Badge>
              </div>

              <CardContent className="p-8 space-y-6 bg-gradient-to-br from-card to-card/50">
                <div>
                  <h2 className="text-3xl font-extrabold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {lang === 'hi' ? scenario.title_hi : scenario.title_en}
                  </h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {lang === 'hi' ? scenario.story_hi : scenario.story_en}
                  </p>
                </div>

                {/* Choices - Enhanced */}
                <div className="space-y-3">
                  <h3 className="font-bold text-xl mb-4">
                    {lang === 'hi' ? 'आपकी पसंद:' : 'Your Choice:'}
                  </h3>
                  {scenario.choices.map((choice, index) => (
                    <motion.button
                      key={choice.id}
                      onClick={() => handleChoiceSelect(choice.id)}
                      disabled={showResult}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={!showResult ? { scale: 1.02, x: 5 } : {}}
                      whileTap={!showResult ? { scale: 0.98 } : {}}
                      className={`
                        w-full p-5 rounded-xl border-2 text-left transition-all flex items-center gap-4 shadow-md
                        ${selectedChoice === choice.id 
                          ? showResult
                            ? choice.id === scenario.correct_choice
                              ? 'border-success bg-gradient-to-r from-success/20 to-green-500/10 shadow-success/20'
                              : 'border-destructive bg-gradient-to-r from-destructive/20 to-red-500/10 shadow-destructive/20'
                            : 'border-primary bg-gradient-to-r from-primary/20 to-blue-500/10 shadow-primary/20'
                          : showResult && choice.id === scenario.correct_choice
                            ? 'border-success bg-gradient-to-r from-success/20 to-green-500/10 shadow-success/20'
                            : 'border-border hover:border-primary/50 hover:bg-primary/5'
                        }
                        ${showResult ? 'cursor-default' : 'cursor-pointer'}
                      `}
                    >
                      <motion.span 
                        className={`
                          w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-lg
                          ${selectedChoice === choice.id 
                            ? showResult
                              ? choice.id === scenario.correct_choice
                                ? 'bg-gradient-to-br from-success to-green-600 text-white'
                                : 'bg-gradient-to-br from-destructive to-red-600 text-white'
                              : 'bg-gradient-to-br from-primary to-blue-600 text-white'
                            : 'bg-gradient-to-br from-muted to-muted-foreground/20'
                          }
                        `}
                        animate={selectedChoice === choice.id && !showResult ? { scale: [1, 1.1, 1] } : {}}
                        transition={{ duration: 0.5, repeat: Infinity }}
                      >
                        {String.fromCharCode(65 + index)}
                      </motion.span>
                      <span className="flex-1 font-semibold text-base">
                        {lang === 'hi' ? choice.text_hi : choice.text_en}
                      </span>
                      {showResult && choice.id === scenario.correct_choice && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring' }}
                        >
                          <CheckCircle className="w-7 h-7 text-success" />
                        </motion.div>
                      )}
                      {showResult && selectedChoice === choice.id && choice.id !== scenario.correct_choice && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring' }}
                        >
                          <XCircle className="w-7 h-7 text-destructive" />
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </div>

                {/* Result/Explanation - Enhanced */}
                <AnimatePresence>
                  {showResult && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, y: -20 }}
                      animate={{ opacity: 1, height: 'auto', y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      className={`p-6 rounded-xl border-2 shadow-lg ${
                        isCorrect 
                          ? 'bg-gradient-to-br from-success/20 to-green-500/10 border-success shadow-success/20' 
                          : 'bg-gradient-to-br from-destructive/20 to-red-500/10 border-destructive shadow-destructive/20'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <motion.div
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        >
                          <Sparkles className={`w-8 h-8 ${isCorrect ? 'text-success' : 'text-destructive'}`} />
                        </motion.div>
                        <div className="flex-1">
                          <p className="font-bold text-lg mb-2">
                            {isCorrect 
                              ? (lang === 'hi' ? '✨ सही जवाब!' : '✨ Correct!') 
                              : (lang === 'hi' ? '💪 लगभग!' : '💪 Almost!')}
                          </p>
                          <p className="text-base leading-relaxed">
                            {lang === 'hi' ? scenario.explanation_hi : scenario.explanation_en}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Action Button - Enhanced */}
                {!showResult ? (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      onClick={handleSubmit} 
                      disabled={!selectedChoice}
                      className="w-full text-lg py-7 bg-gradient-to-r from-primary to-accent text-white shadow-lg hover:shadow-xl transition-all"
                      size="lg"
                    >
                      {lang === 'hi' ? 'जवाब जमा करें' : 'Submit Answer'} 🚀
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      onClick={handleNext}
                      className="w-full text-lg py-7 bg-gradient-to-r from-success to-green-600 text-white shadow-lg hover:shadow-xl transition-all"
                      size="lg"
                    >
                      {lives <= 0 
                        ? (lang === 'hi' ? 'फिर से खेलें' : 'Play Again')
                        : currentScenario >= scenarios.length - 1
                          ? (lang === 'hi' ? 'परिणाम देखें' : 'See Results')
                          : (lang === 'hi' ? 'अगला' : 'Next')
                      } →
                    </Button>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
