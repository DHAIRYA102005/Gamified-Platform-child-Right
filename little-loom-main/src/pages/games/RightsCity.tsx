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
  School,
  Hospital,
  ShieldCheck,
  Building,
  TreePine,
  Users,
  AlertTriangle,
  CheckCircle,
  Coins,
  Zap,
  Maximize,
  Minimize
} from 'lucide-react';
import { toast } from 'sonner';
import Confetti from 'react-confetti';
import { useFullscreen } from '@/hooks/use-fullscreen';

interface Building {
  id: string;
  name_en: string;
  name_hi: string;
  emoji: string;
  cost: number;
  education: number;
  health: number;
  safety: number;
  icon: React.ElementType;
  description_en: string;
  description_hi: string;
}

interface Challenge {
  id: string;
  title_en: string;
  title_hi: string;
  description_en: string;
  description_hi: string;
  solution_building: string;
  penalty: { education: number; health: number; safety: number };
}

const buildings: Building[] = [
  {
    id: 'school',
    name_en: 'School',
    name_hi: 'स्कूल',
    emoji: '🏫',
    cost: 100,
    education: 25,
    health: 5,
    safety: 10,
    icon: School,
    description_en: 'Provides education to children',
    description_hi: 'बच्चों को शिक्षा प्रदान करता है',
  },
  {
    id: 'hospital',
    name_en: 'Hospital',
    name_hi: 'अस्पताल',
    emoji: '🏥',
    cost: 150,
    education: 5,
    health: 30,
    safety: 10,
    icon: Hospital,
    description_en: 'Provides healthcare services',
    description_hi: 'स्वास्थ्य सेवाएं प्रदान करता है',
  },
  {
    id: 'police',
    name_en: 'Police Station',
    name_hi: 'पुलिस स्टेशन',
    emoji: '🚔',
    cost: 120,
    education: 5,
    health: 5,
    safety: 30,
    icon: ShieldCheck,
    description_en: 'Protects children from harm',
    description_hi: 'बच्चों को नुकसान से बचाता है',
  },
  {
    id: 'library',
    name_en: 'Library',
    name_hi: 'पुस्तकालय',
    emoji: '📚',
    cost: 80,
    education: 20,
    health: 0,
    safety: 5,
    icon: Building,
    description_en: 'Books and learning resources',
    description_hi: 'किताबें और सीखने के संसाधन',
  },
  {
    id: 'playground',
    name_en: 'Playground',
    name_hi: 'खेल का मैदान',
    emoji: '🎡',
    cost: 60,
    education: 5,
    health: 15,
    safety: 5,
    icon: TreePine,
    description_en: 'Safe place for children to play',
    description_hi: 'बच्चों के खेलने के लिए सुरक्षित जगह',
  },
  {
    id: 'shelter',
    name_en: 'Child Shelter',
    name_hi: 'बाल आश्रय',
    emoji: '🏠',
    cost: 100,
    education: 10,
    health: 10,
    safety: 25,
    icon: Users,
    description_en: 'Safe home for orphaned children',
    description_hi: 'अनाथ बच्चों के लिए सुरक्षित घर',
  },
];

const challenges: Challenge[] = [
  {
    id: 'dropout',
    title_en: 'School Dropout Crisis!',
    title_hi: 'स्कूल छोड़ने का संकट!',
    description_en: 'Many children are dropping out of school. Build a school to solve this!',
    description_hi: 'कई बच्चे स्कूल छोड़ रहे हैं। इसे हल करने के लिए स्कूल बनाएं!',
    solution_building: 'school',
    penalty: { education: -15, health: 0, safety: -5 },
  },
  {
    id: 'illness',
    title_en: 'Health Emergency!',
    title_hi: 'स्वास्थ्य आपातकाल!',
    description_en: 'Children are falling sick. Build a hospital to help them!',
    description_hi: 'बच्चे बीमार पड़ रहे हैं। उनकी मदद के लिए अस्पताल बनाएं!',
    solution_building: 'hospital',
    penalty: { education: -5, health: -20, safety: 0 },
  },
  {
    id: 'danger',
    title_en: 'Safety Threat!',
    title_hi: 'सुरक्षा खतरा!',
    description_en: 'Children are in danger! Build a police station to protect them!',
    description_hi: 'बच्चे खतरे में हैं! उनकी सुरक्षा के लिए पुलिस स्टेशन बनाएं!',
    solution_building: 'police',
    penalty: { education: 0, health: -5, safety: -20 },
  },
];

interface PlacedBuilding {
  buildingId: string;
  position: number;
}

export default function RightsCity() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const lang = i18n.language;
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const { isFullscreen, toggleFullscreen } = useFullscreen();
  
  const [coins, setCoins] = useState(500);
  const [education, setEducation] = useState(30);
  const [health, setHealth] = useState(30);
  const [safety, setSafety] = useState(30);
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [placedBuildings, setPlacedBuildings] = useState<PlacedBuilding[]>([]);
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  const gridSize = 16; // 4x4 grid

  // Check for level up
  useEffect(() => {
    if (xp >= level * 100) {
      setLevel(level + 1);
      setCoins(coins + 200);
      toast.success(`Level Up! You're now level ${level + 1}! +200 coins 🎉`);
    }
  }, [xp]);

  // Check win condition
  useEffect(() => {
    if (education >= 80 && health >= 80 && safety >= 80 && !gameWon) {
      setGameWon(true);
      setShowConfetti(true);
      saveProgress();
    }
  }, [education, health, safety]);

  // Random challenges
  useEffect(() => {
    if (gameWon || activeChallenge) return;
    
    const challengeTimer = setTimeout(() => {
      if (placedBuildings.length >= 2 && Math.random() > 0.5) {
        const randomChallenge = challenges[Math.floor(Math.random() * challenges.length)];
        setActiveChallenge(randomChallenge);
        toast.warning(lang === 'hi' ? randomChallenge.title_hi : randomChallenge.title_en);
      }
    }, 15000);

    return () => clearTimeout(challengeTimer);
  }, [placedBuildings, activeChallenge, gameWon]);

  // Apply challenge penalty
  useEffect(() => {
    if (!activeChallenge) return;

    const penaltyTimer = setTimeout(() => {
      if (activeChallenge) {
        setEducation(Math.max(0, education + activeChallenge.penalty.education));
        setHealth(Math.max(0, health + activeChallenge.penalty.health));
        setSafety(Math.max(0, safety + activeChallenge.penalty.safety));
        toast.error(lang === 'hi' ? 'चुनौती विफल! स्कोर कम हुआ।' : 'Challenge failed! Scores decreased.');
        setActiveChallenge(null);
      }
    }, 20000);

    return () => clearTimeout(penaltyTimer);
  }, [activeChallenge]);

  const saveProgress = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      await supabase.from('profiles').update({
        points: xp,
        level: level,
      }).eq('id', session.user.id);
    }
  };

  const handlePlaceBuilding = (position: number) => {
    if (!selectedBuilding) {
      toast.info(lang === 'hi' ? 'पहले एक इमारत चुनें!' : 'Select a building first!');
      return;
    }

    if (placedBuildings.some(b => b.position === position)) {
      toast.error(lang === 'hi' ? 'यहां पहले से इमारत है!' : 'Already occupied!');
      return;
    }

    if (coins < selectedBuilding.cost) {
      toast.error(lang === 'hi' ? 'पर्याप्त सिक्के नहीं!' : 'Not enough coins!');
      return;
    }

    // Place building
    setPlacedBuildings([...placedBuildings, { buildingId: selectedBuilding.id, position }]);
    setCoins(coins - selectedBuilding.cost);
    setEducation(Math.min(100, education + selectedBuilding.education));
    setHealth(Math.min(100, health + selectedBuilding.health));
    setSafety(Math.min(100, safety + selectedBuilding.safety));
    setXp(xp + 25);

    // Check if challenge is solved
    if (activeChallenge && activeChallenge.solution_building === selectedBuilding.id) {
      toast.success(lang === 'hi' ? 'चुनौती पूरी! +50 XP' : 'Challenge solved! +50 XP');
      setXp(xp + 50);
      setCoins(coins + 100);
      setActiveChallenge(null);
    }

    toast.success(`${lang === 'hi' ? selectedBuilding.name_hi : selectedBuilding.name_en} built! +25 XP`);
    setSelectedBuilding(null);
  };

  const getBuildingAtPosition = (position: number) => {
    const placed = placedBuildings.find(b => b.position === position);
    if (!placed) return null;
    return buildings.find(b => b.id === placed.buildingId);
  };

  if (gameWon) {
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
                🏙️
              </motion.div>
              <h1 className="text-4xl font-extrabold text-success">
                {lang === 'hi' ? 'बधाई हो!' : 'City Complete!'}
              </h1>
              <p className="text-lg text-muted-foreground">
                {lang === 'hi' 
                  ? 'आपने एक ऐसा शहर बनाया जो सभी बच्चों के अधिकारों की रक्षा करता है!'
                  : "You've built a city that protects all children's rights!"
                }
              </p>
              <div className="grid grid-cols-3 gap-4 py-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{education}%</div>
                  <div className="text-sm text-muted-foreground">Education</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-success">{health}%</div>
                  <div className="text-sm text-muted-foreground">Health</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-secondary">{safety}%</div>
                  <div className="text-sm text-muted-foreground">Safety</div>
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
            Level {level}
          </Badge>
          <Badge variant="secondary" className="text-lg px-4 py-1">
            <Coins className="w-4 h-4 mr-1 text-accent" />
            {coins}
          </Badge>
          <Badge variant="default" className="text-lg px-4 py-1">
            <Zap className="w-4 h-4 mr-1" />
            {xp} XP
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

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <School className="w-5 h-5 text-primary" />
            <span className="font-medium">Education</span>
          </div>
          <Progress value={education} className="h-3" />
          <span className="text-sm text-muted-foreground mt-1">{education}%</span>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Hospital className="w-5 h-5 text-success" />
            <span className="font-medium">Health</span>
          </div>
          <Progress value={health} className="h-3" />
          <span className="text-sm text-muted-foreground mt-1">{health}%</span>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-5 h-5 text-secondary" />
            <span className="font-medium">Safety</span>
          </div>
          <Progress value={safety} className="h-3" />
          <span className="text-sm text-muted-foreground mt-1">{safety}%</span>
        </Card>
      </div>

      {/* Active Challenge */}
      <AnimatePresence>
        {activeChallenge && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="border-2 border-destructive bg-destructive/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-8 h-8 text-destructive animate-pulse" />
                  <div className="flex-1">
                    <h3 className="font-bold text-destructive">
                      {lang === 'hi' ? activeChallenge.title_hi : activeChallenge.title_en}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {lang === 'hi' ? activeChallenge.description_hi : activeChallenge.description_en}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* City Grid */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                🏙️ {lang === 'hi' ? 'आपका शहर' : 'Your City'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-2 p-4 bg-gradient-to-br from-success/10 to-secondary/10 rounded-xl">
                {[...Array(gridSize)].map((_, index) => {
                  const building = getBuildingAtPosition(index);
                  return (
                    <motion.button
                      key={index}
                      onClick={() => handlePlaceBuilding(index)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`
                        aspect-square rounded-lg border-2 border-dashed flex items-center justify-center text-3xl
                        ${building 
                          ? 'bg-card border-solid border-primary' 
                          : selectedBuilding 
                            ? 'border-primary bg-primary/5 cursor-pointer hover:bg-primary/10' 
                            : 'border-muted hover:border-muted-foreground'
                        }
                      `}
                    >
                      {building ? (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="text-4xl"
                        >
                          {building.emoji}
                        </motion.span>
                      ) : selectedBuilding ? (
                        <span className="text-2xl opacity-30">{selectedBuilding.emoji}</span>
                      ) : null}
                    </motion.button>
                  );
                })}
              </div>
              <p className="text-center text-sm text-muted-foreground mt-4">
                {lang === 'hi' 
                  ? 'सभी स्कोर 80% तक पहुंचाएं जीतने के लिए!'
                  : 'Reach 80% in all scores to win!'
                }
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Buildings Panel */}
        <div>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                🏗️ {lang === 'hi' ? 'इमारतें' : 'Buildings'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {buildings.map((building) => (
                <motion.button
                  key={building.id}
                  onClick={() => setSelectedBuilding(building)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={coins < building.cost}
                  className={`
                    w-full p-3 rounded-xl border-2 text-left transition-all
                    ${selectedBuilding?.id === building.id 
                      ? 'border-primary bg-primary/10' 
                      : 'border-border hover:border-muted-foreground'
                    }
                    ${coins < building.cost ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{building.emoji}</span>
                    <div className="flex-1">
                      <div className="font-medium text-sm">
                        {lang === 'hi' ? building.name_hi : building.name_en}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Coins className="w-3 h-3" />
                        {building.cost}
                      </div>
                    </div>
                    <div className="text-xs text-right">
                      <div className="text-primary">+{building.education} 📚</div>
                      <div className="text-success">+{building.health} ❤️</div>
                      <div className="text-secondary">+{building.safety} 🛡️</div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </CardContent>
          </Card>

          {/* Selected Building Info */}
          <AnimatePresence>
            {selectedBuilding && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                <Card className="mt-4 border-primary">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl">{selectedBuilding.emoji}</span>
                      <div>
                        <h4 className="font-bold">
                          {lang === 'hi' ? selectedBuilding.name_hi : selectedBuilding.name_en}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {lang === 'hi' ? selectedBuilding.description_hi : selectedBuilding.description_en}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-primary">
                      {lang === 'hi' ? 'ग्रिड पर क्लिक करें लगाने के लिए!' : 'Click on the grid to place!'}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
