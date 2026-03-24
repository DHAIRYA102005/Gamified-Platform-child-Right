import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import { demoAuth } from '@/lib/demoAuth';
import { Avatar } from '@/components/Avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Star, Trophy, Zap, Award, BookOpen, Lock, User } from 'lucide-react';
import { EmojiIcon } from '@/components/EmojiIcon';
import { GlassCard, XPBadge, XPProgress } from '@/components/gamified/GamifiedUI';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function Profile() {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const [profile, setProfile] = useState<any>(null);
  const [displayName, setDisplayName] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (isSupabaseConfigured) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
          setProfile(data);
          if (data?.display_name) {
            setDisplayName(data.display_name);
          }
        }
      } else {
        const { data: { session } } = await demoAuth.getSession();
        if (session) {
          const profileData = await demoAuth.getProfile(session.user.id);
          setProfile(profileData);
          if (profileData?.display_name) {
            setDisplayName(profileData.display_name);
          }
        }
      }
    };
    load();
  }, []);

  if (!profile) return null;

  const currentXP = profile.points ?? 0;
  const xpToNext = 1000;

  const handleSaveProfile = async () => {
    if (!displayName.trim()) {
      toast.error(lang === 'hi' ? 'कृपया नाम दर्ज करें।' : 'Please enter a name.');
      return;
    }

    try {
      setSavingProfile(true);
      
      if (isSupabaseConfigured) {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          toast.error(lang === 'hi' ? 'कृपया पहले लॉग इन करें।' : 'Please log in first.');
          return;
        }

        const { error } = await supabase
          .from('profiles')
          .update({ display_name: displayName.trim() })
          .eq('id', session.user.id);

        if (error) {
          throw error;
        }
      } else {
        const { data: { session } } = await demoAuth.getSession();
        if (!session) {
          toast.error(lang === 'hi' ? 'कृपया पहले लॉग इन करें।' : 'Please log in first.');
          return;
        }

        await demoAuth.updateProfile(session.user.id, { display_name: displayName.trim() });
      }

      setProfile((prev: any) => prev ? { ...prev, display_name: displayName.trim() } : prev);
      // Notify other parts of the app (like the sidebar) to refresh profile data
      window.dispatchEvent(new Event('profile-updated'));
      toast.success(lang === 'hi' ? 'प्रोफ़ाइल अपडेट हो गई।' : 'Profile updated.');
    } catch (err) {
      console.error(err);
      toast.error(lang === 'hi' ? 'प्रोफ़ाइल अपडेट नहीं हो सकी।' : 'Could not update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!password || !confirmPassword) {
      toast.error(lang === 'hi' ? 'कृपया दोनों पासवर्ड फ़ील्ड भरें।' : 'Please fill both password fields.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error(lang === 'hi' ? 'पासवर्ड मेल नहीं खा रहे हैं।' : 'Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      toast.error(lang === 'hi' ? 'पासवर्ड कम से कम 6 अक्षर का होना चाहिए।' : 'Password must be at least 6 characters.');
      return;
    }

    try {
      setUpdatingPassword(true);
      
      if (isSupabaseConfigured) {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          toast.error(lang === 'hi' ? 'कृपया पहले लॉग इन करें।' : 'Please log in first.');
          return;
        }

        const { error } = await supabase.auth.updateUser({
          password,
        });

        if (error) {
          throw error;
        }
      } else {
        // In demo mode, password update is stored in localStorage
        toast.info(lang === 'hi' ? 'डेमो मोड: पासवर्ड सहेजा गया (स्थानीय रूप से)' : 'Demo Mode: Password saved (locally)');
      }

      setPassword('');
      setConfirmPassword('');
      toast.success(lang === 'hi' ? 'पासवर्ड अपडेट हो गया।' : 'Password updated.');
    } catch (err) {
      console.error(err);
      toast.error(lang === 'hi' ? 'पासवर्ड अपडेट नहीं हो सका।' : 'Could not update password.');
    } finally {
      setUpdatingPassword(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 relative overflow-hidden">
      {[...Array(6)].map((_, i) => {
        const emojis = ['⭐', '🌟', '✨', '🏆', '🧠', '🦸'];
        return (
          <motion.div
            key={i}
            className="absolute pointer-events-none opacity-10"
            style={{
              left: `${10 + i * 15}%`,
              top: `${12 + (i % 3) * 30}%`,
            }}
            animate={{
              y: [0, -24, 0],
              x: [0, Math.cos(i * 0.7) * 18, 0],
              rotate: [0, 18, -18, 0],
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 5 + i * 0.4,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.5,
            }}
          >
            <EmojiIcon emoji={emojis[i]} size={26} animated />
          </motion.div>
        );
      })}

      {/* Profile Hero */}
      <GlassCard className="p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row items-center gap-6">
          <div className="flex items-center gap-4 flex-1">
            <Avatar size="lg" avatarBody={profile.avatar_body} />
            <div className="space-y-1">
              <h1 className="text-2xl lg:text-3xl font-extrabold">
                {profile.display_name}
              </h1>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Star className="w-4 h-4 text-accent" />
                {lang === 'hi'
                  ? `स्तर ${profile.level} • ${profile.points} XP`
                  : `Level ${profile.level} • ${profile.points} XP`}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <XPBadge xp={profile.points} label={lang === 'hi' ? 'कुल XP' : 'Total XP'} />
                <XPBadge
                  xp={profile.current_streak}
                  label={lang === 'hi' ? 'स्ट्रिक' : 'Streak'}
                  className="bg-gradient-to-r from-secondary to-accent"
                />
              </div>
            </div>
          </div>
          <div className="w-full lg:max-w-xs">
            <XPProgress
              currentXP={currentXP}
              xpToNext={xpToNext}
              levelLabel={lang === 'hi' ? 'अगले स्तर तक प्रगति' : 'Progress to next level'}
            />
          </div>
        </div>
      </GlassCard>

      {/* Level Timeline & Streak */}
      <div className="grid md:grid-cols-[2fr,1.5fr] gap-4">
        <GlassCard className="p-5 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <EmojiIcon emoji="🛤️" size={22} />
            <h3 className="font-bold text-sm">
              {lang === 'hi' ? 'स्तर यात्रा' : 'Level Journey'}
            </h3>
          </div>
          <p className="text-xs text-muted-foreground">
            {lang === 'hi'
              ? 'देखें आपने अब तक कितनी दूर तक प्रगति की है।'
              : 'See how far you have progressed so far.'}
          </p>
          <div className="flex items-center gap-2 mt-2">
            {[...Array(5)].map((_, i) => {
              const levelNumber = i + 1;
              const reached = profile.level >= levelNumber;
              return (
                <motion.div
                  key={levelNumber}
                  className={`flex-1 h-2 rounded-full ${
                    reached ? 'bg-gradient-to-r from-primary to-accent' : 'bg-muted'
                  }`}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: i * 0.1 }}
                  style={{ transformOrigin: 'left' }}
                />
              );
            })}
          </div>
          <div className="flex justify-between text-[11px] text-muted-foreground mt-1">
            <span>{lang === 'hi' ? 'शुरुआत' : 'Start'}</span>
            <span>{lang === 'hi' ? 'चैंपियन' : 'Champion'}</span>
          </div>
        </GlassCard>

        <GlassCard className="p-5 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <EmojiIcon emoji="🔥" size={22} />
            <h3 className="font-bold text-sm">
              {lang === 'hi' ? 'स्ट्रिक ट्रैकर' : 'Streak Tracker'}
            </h3>
          </div>
          <p className="text-xs text-muted-foreground">
            {lang === 'hi'
              ? 'लगातार कितने दिनों से आप सीख रहे हैं।'
              : 'How many days in a row you have been learning.'}
          </p>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <Zap className="w-6 h-6 text-accent" />
              <span className="text-xl font-bold">{profile.current_streak}</span>
              <span className="text-xs text-muted-foreground">
                {lang === 'hi' ? 'दिन' : 'days'}
              </span>
            </div>
            <EmojiIcon emoji="💪" size={24} />
          </div>
        </GlassCard>
      </div>

      {/* XP & Badges Grid */}
      <div className="grid md:grid-cols-3 gap-4">
        <GlassCard className="p-4 text-center">
          <Trophy className="w-8 h-8 mx-auto text-primary mb-2" />
          <div className="text-2xl font-bold">{profile.points}</div>
          <div className="text-sm text-muted-foreground">
            {lang === 'hi' ? 'कुल XP' : 'Total XP'}
          </div>
        </GlassCard>
        <GlassCard className="p-4 text-center">
          <Award className="w-8 h-8 mx-auto text-secondary mb-2" />
          <div className="text-2xl font-bold">3</div>
          <div className="text-sm text-muted-foreground">
            {lang === 'hi' ? 'बैज प्राप्त' : 'Badges earned'}
          </div>
        </GlassCard>
        <GlassCard className="p-4 text-center">
          <BookOpen className="w-8 h-8 mx-auto text-accent mb-2" />
          <div className="text-2xl font-bold">6</div>
          <div className="text-sm text-muted-foreground">
            {lang === 'hi' ? 'अधिकार पूरे' : 'Rights completed'}
          </div>
        </GlassCard>
      </div>

      {/* Settings - Profile & Password */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Profile settings */}
        <GlassCard className="p-5 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <User className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-sm">
              {lang === 'hi' ? 'प्रोफ़ाइल सेटिंग्स' : 'Profile settings'}
            </h3>
          </div>
          <p className="text-xs text-muted-foreground">
            {lang === 'hi'
              ? 'यहाँ से अपना नाम अपडेट करें।'
              : 'Update your basic profile details here.'}
          </p>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="displayName">
                {lang === 'hi' ? 'नाम' : 'Name'}
              </Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder={lang === 'hi' ? 'अपना नाम लिखें' : 'Enter your name'}
              />
            </div>
            <Button
              onClick={handleSaveProfile}
              disabled={savingProfile}
              className="w-full"
            >
              {savingProfile
                ? lang === 'hi'
                  ? 'सेव हो रहा है...'
                  : 'Saving...'
                : lang === 'hi'
                  ? 'प्रोफ़ाइल सेव करें'
                  : 'Save profile'}
            </Button>
          </div>
        </GlassCard>

        {/* Password settings */}
        <GlassCard className="p-5 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Lock className="w-5 h-5 text-destructive" />
            <h3 className="font-bold text-sm">
              {lang === 'hi' ? 'पासवर्ड बदलें' : 'Change password'}
            </h3>
          </div>
          <p className="text-xs text-muted-foreground">
            {lang === 'hi'
              ? 'एक मज़बूत पासवर्ड चुनें जिसे आप याद रख सकें।'
              : 'Choose a strong password that you can remember.'}
          </p>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="newPassword">
                {lang === 'hi' ? 'नया पासवर्ड' : 'New password'}
              </Label>
              <Input
                id="newPassword"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={lang === 'hi' ? 'नया पासवर्ड' : 'New password'}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="confirmPassword">
                {lang === 'hi' ? 'पासवर्ड दोहराएँ' : 'Confirm password'}
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={lang === 'hi' ? 'फिर से लिखें' : 'Type again'}
              />
            </div>
            <Button
              variant="outline"
              onClick={handleUpdatePassword}
              disabled={updatingPassword}
              className="w-full"
            >
              {updatingPassword
                ? lang === 'hi'
                  ? 'अपडेट हो रहा है...'
                  : 'Updating...'
                : lang === 'hi'
                  ? 'पासवर्ड अपडेट करें'
                  : 'Update password'}
            </Button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
