import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  color: string;
  delay?: number;
}

export function StatsCard({ icon: Icon, label, value, color, delay = 0 }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: 'spring', stiffness: 200 }}
    >
      <Card className="shadow-card hover:shadow-glow transition-shadow">
        <CardContent className="p-6 flex items-center space-x-4">
          <motion.div
            className={`p-3 rounded-full ${color}`}
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <Icon className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <p className="text-sm text-muted-foreground font-medium">{label}</p>
            <motion.p
              className="text-2xl font-bold"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: delay + 0.2 }}
            >
              {value}
            </motion.p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
