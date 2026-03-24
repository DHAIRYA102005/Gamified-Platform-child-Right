import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import { demoAuth } from '@/lib/demoAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { Sparkles, Shield, User, Mail, Lock, ArrowRight, Star } from 'lucide-react';
import { EmojiIcon } from '@/components/EmojiIcon';

export default function Auth() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [ageGroup, setAgeGroup] = useState('10-12');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSupabaseConfigured) {
        // Use Supabase authentication
        if (isLogin) {
          const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) throw error;

          toast.success('Welcome back! 🎉');
          navigate('/dashboard');
        } else {
          const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: `${window.location.origin}/`,
              data: {
                display_name: displayName,
                age_group: ageGroup,
              },
            },
          });

          if (error) throw error;

          toast.success('Account created! Welcome! 🌟');
          navigate('/dashboard');
        }
      } else {
        // Use demo authentication (no Supabase)
        if (isLogin) {
          const { error } = await demoAuth.signIn(email, password);
          if (error) throw error;
          toast.success('Welcome back! 🎉 (Demo Mode)');
          navigate('/dashboard');
        } else {
          if (!displayName) {
            throw new Error('Please enter your name');
          }
          const { error } = await demoAuth.signUp(email, password, displayName, ageGroup);
          if (error) throw error;
          toast.success('Account created! Welcome! 🌟 (Demo Mode)');
          navigate('/dashboard');
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/20 blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-secondary/20 blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.6, 0.4]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent/10 blur-3xl"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Floating decorative elements */}
      {[...Array(12)].map((_, i) => {
        const emojis = ['⭐', '🌟', '✨', '🏆', '🎯', '🧠', '🛡️', '💫', '🔮', '🦸', '🏅', '💎'];
        return (
          <motion.div
            key={i}
            className="absolute pointer-events-none"
            style={{
              left: `${10 + i * 8}%`,
              top: `${15 + (i % 4) * 22}%`,
            }}
            animate={{
              y: [0, -25, 0],
              rotate: [0, 15, -15, 0],
              opacity: [0.2, 0.5, 0.2],
              x: [0, Math.sin(i * 0.5) * 15, 0],
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 4 + i * 0.3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.4,
            }}
          >
            <EmojiIcon emoji={emojis[i]} size={22} animated />
          </motion.div>
        );
      })}

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md"
        >
          {/* Glass card */}
          <div className="relative backdrop-blur-xl bg-card/80 rounded-3xl border border-border/50 shadow-2xl overflow-hidden">
            {/* Gradient accent line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-secondary" />
            
            {/* Header */}
            <div className="p-8 pb-0 text-center">
              <motion.div
                className="relative w-20 h-20 mx-auto mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary to-accent rotate-6" />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Shield className="w-10 h-10 text-primary-foreground" />
                </div>
                <motion.div
                  className="absolute -top-2 -right-2"
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="w-6 h-6 text-accent" />
                </motion.div>
              </motion.div>

              <motion.h1
                className="text-3xl font-extrabold text-foreground mb-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {isLogin ? t('auth.login') : t('auth.signup')}
              </motion.h1>
              <motion.p
                className="text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Join the Children's Rights Adventure!
              </motion.p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-5 overflow-hidden"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="displayName" className="text-sm font-semibold flex items-center gap-2">
                        <User className="w-4 h-4 text-primary" />
                        {t('auth.displayName')}
                      </Label>
                      <Input
                        id="displayName"
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Young Hero"
                        required
                        className="h-12 rounded-xl bg-muted/50 border-border/50 focus:border-primary focus:ring-primary/20 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ageGroup" className="text-sm font-semibold flex items-center gap-2">
                        <Star className="w-4 h-4 text-accent" />
                        {t('auth.ageGroup')}
                      </Label>
                      <Select value={ageGroup} onValueChange={setAgeGroup}>
                        <SelectTrigger className="h-12 rounded-xl bg-muted/50 border-border/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="7-9">7-9 years</SelectItem>
                          <SelectItem value="10-12">10-12 years</SelectItem>
                          <SelectItem value="13-15">13-15 years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  {t('auth.email')}
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hero@example.com"
                  required
                  className="h-12 rounded-xl bg-muted/50 border-border/50 focus:border-primary focus:ring-primary/20 transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold flex items-center gap-2">
                  <Lock className="w-4 h-4 text-primary" />
                  {t('auth.password')}
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="h-12 rounded-xl bg-muted/50 border-border/50 focus:border-primary focus:ring-primary/20 transition-all"
                />
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 rounded-xl text-lg font-bold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/25 transition-all duration-300"
                >
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <span className="flex items-center gap-2">
                      {isLogin ? t('auth.login') : t('auth.signup')}
                      <ArrowRight className="w-5 h-5" />
                    </span>
                  )}
                </Button>
              </motion.div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/50" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-3 text-muted-foreground">or</span>
                </div>
              </div>

              <Button
                type="button"
                variant="ghost"
                className="w-full h-12 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Login'}
              </Button>
            </form>
          </div>

          {/* Back to home link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-6"
          >
            <Button
              variant="link"
              onClick={() => navigate('/')}
              className="text-muted-foreground hover:text-foreground"
            >
              ← Back to home
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
