import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import { demoAuth } from '@/lib/demoAuth';
import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  LayoutDashboard,
  Gamepad2,
  Trophy,
  BookOpen,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Star,
  Zap,
  Menu,
} from 'lucide-react';
import { toast } from 'sonner';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Gamepad2, label: 'Games', path: '/games' },
  { icon: Trophy, label: 'Achievements', path: '/achievements' },
  { icon: BookOpen, label: 'Learn Rights', path: '/learn' },
  { icon: BookOpen, label: 'Legal Awareness', path: '/awareness' },
  { icon: User, label: 'Profile', path: '/profile' },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async () => {
    if (isSupabaseConfigured) {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/auth');
        return;
      }

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      setProfile(profileData);
      setLoading(false);
    } else {
      // Demo mode - use localStorage
      const { data: { session } } = await demoAuth.getSession();
      
      if (!session) {
        navigate('/auth');
        return;
      }

      const profileData = await demoAuth.getProfile(session.user.id);
      
      if (!profileData) {
        // Create default profile
        const defaultProfile = {
          id: session.user.id,
          display_name: session.user.display_name || 'Demo User',
          avatar_body: '👤',
          level: 1,
          points: 0,
          current_streak: 0,
        };
        await demoAuth.updateProfile(session.user.id, defaultProfile);
        setProfile(defaultProfile);
      } else {
        setProfile(profileData);
      }
      
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  // Listen for profile updates coming from the Profile page
  useEffect(() => {
    const handleProfileUpdated = () => {
      loadProfile();
    };

    window.addEventListener('profile-updated', handleProfileUpdated);
    return () => window.removeEventListener('profile-updated', handleProfileUpdated);
  }, []);

  const handleLogout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    } else {
      await demoAuth.signOut();
    }
    navigate('/');
    toast.success('Logged out successfully!');
  };

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'hi' : 'en');
  };

  const calculateProgress = () => {
    if (!profile) return 0;
    return Math.min((profile.points / 1000) * 100, 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Star className="w-12 h-12 text-primary" />
        </motion.div>
      </div>
    );
  }

  const sidebarVariants = {
    expanded: { width: 280 },
    collapsed: { width: 80 },
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        animate={collapsed ? 'collapsed' : 'expanded'}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`
          fixed lg:relative z-50 h-screen
          bg-card border-r border-border
          flex flex-col shadow-card
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          transition-transform lg:transition-none
        `}
      >
        {/* Logo Area */}
        <motion.div 
          className="p-6 border-b border-border"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex items-center justify-between">
            <AnimatePresence mode="wait">
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <span className="text-xl">🛡️</span>
                  </div>
                  <span className="font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Little Loom
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex hover:bg-muted"
            >
              {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </Button>
          </div>
        </motion.div>

        {/* User Profile Section */}
        {profile && (
          <div className="p-4 border-b border-border">
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
            >
              <Avatar size="sm" avatarBody={profile.avatar_body} />
              <AnimatePresence mode="wait">
                {!collapsed && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="flex-1 min-w-0"
                  >
                    <p className="font-semibold truncate">{profile.display_name}</p>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Star className="w-3 h-3 text-accent" />
                      <span>Level {profile.level}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* XP Progress */}
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4"
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Knowledge Progress</span>
                    <span className="font-medium text-primary">{Math.round(calculateProgress())}%</span>
                  </div>
                  <Progress value={calculateProgress()} className="h-2" />
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-1 text-xs">
                      <Zap className="w-3 h-3 text-accent" />
                      <span>{profile.points} XP</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <Trophy className="w-3 h-3 text-primary" />
                      <span>{profile.current_streak} streak</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <motion.button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setMobileOpen(false);
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  w-full flex items-center gap-3 p-3 rounded-xl transition-all
                  ${isActive 
                    ? 'bg-primary text-primary-foreground shadow-soft' 
                    : 'hover:bg-muted text-foreground'
                  }
                  ${collapsed ? 'justify-center' : ''}
                `}
              >
                <item.icon className={`w-5 h-5 ${isActive ? '' : 'text-muted-foreground'}`} />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="font-medium whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-border space-y-2">
          <Button
            variant="outline"
            size={collapsed ? 'icon' : 'default'}
            onClick={toggleLanguage}
            className="w-full"
          >
            {collapsed ? (i18n.language === 'en' ? '🇮🇳' : '🇬🇧') : (i18n.language === 'en' ? '🇮🇳 हिंदी' : '🇬🇧 English')}
          </Button>
          <Button
            variant="ghost"
            size={collapsed ? 'icon' : 'default'}
            onClick={handleLogout}
            className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut className="w-5 h-5" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="ml-2"
                >
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar (Mobile) */}
        <header className="lg:hidden sticky top-0 z-30 bg-card/80 backdrop-blur-sm border-b border-border p-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <span className="text-sm">🛡️</span>
              </div>
              <span className="font-bold">Little Loom</span>
            </div>
            <Avatar size="sm" avatarBody={profile?.avatar_body} />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
