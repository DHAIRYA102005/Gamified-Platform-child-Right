import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

interface GameCardProps {
  id: string;
  titleKey: string;
  description: string;
  difficulty: number;
  thumbnailUrl?: string;
  onPlay: () => void;
}

const difficultyColors = {
  1: 'bg-success',
  2: 'bg-accent',
  3: 'bg-destructive',
};

const difficultyLabels = {
  1: 'Easy',
  2: 'Medium',
  3: 'Hard',
};

export function GameCard({ id, titleKey, description, difficulty, thumbnailUrl, onPlay }: GameCardProps) {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card className="overflow-hidden cursor-pointer shadow-card hover:shadow-glow transition-shadow">
        {thumbnailUrl && (
          <div className="h-40 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <div className="text-6xl">🎮</div>
          </div>
        )}
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="text-xl font-bold">{t(titleKey)}</CardTitle>
            <Badge className={`${difficultyColors[difficulty as keyof typeof difficultyColors]} text-white`}>
              {difficultyLabels[difficulty as keyof typeof difficultyLabels]}
            </Badge>
          </div>
          <CardDescription className="line-clamp-2">{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={onPlay} className="w-full font-semibold">
            {t('playGame')} 🎯
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
