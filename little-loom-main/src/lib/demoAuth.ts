/**
 * Demo Authentication System
 * Used when Supabase is not configured
 * Stores user data in localStorage
 */

export interface DemoUser {
  id: string;
  email: string;
  display_name: string;
  age_group?: string;
}

export interface DemoProfile {
  id: string;
  display_name: string;
  avatar_body: string;
  level: number;
  points: number;
  current_streak: number;
  created_at: string;
}

// Generate a simple ID
const generateId = () => `demo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Demo authentication functions
export const demoAuth = {
  signIn: async (email: string, password: string) => {
    const users = JSON.parse(localStorage.getItem('demo_users') || '[]');
    const user = users.find((u: DemoUser) => u.email === email);
    
    if (!user) {
      throw new Error('User not found. Please sign up first.');
    }
    
    // Store current session
    localStorage.setItem('demo_session', JSON.stringify({
      user,
      access_token: 'demo_token',
      expires_at: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    }));
    
    return { data: { user, session: { user } }, error: null };
  },

  signUp: async (email: string, password: string, displayName: string, ageGroup?: string) => {
    const users = JSON.parse(localStorage.getItem('demo_users') || '[]');
    
    if (users.find((u: DemoUser) => u.email === email)) {
      throw new Error('User already exists. Please sign in.');
    }
    
    const newUser: DemoUser = {
      id: generateId(),
      email,
      display_name: displayName,
      age_group: ageGroup,
    };
    
    users.push(newUser);
    localStorage.setItem('demo_users', JSON.stringify(users));
    
    // Create demo profile
    const profile: DemoProfile = {
      id: newUser.id,
      display_name: displayName,
      avatar_body: '👤',
      level: 1,
      points: 0,
      current_streak: 0,
      created_at: new Date().toISOString(),
    };
    
    const profiles = JSON.parse(localStorage.getItem('demo_profiles') || '[]');
    profiles.push(profile);
    localStorage.setItem('demo_profiles', JSON.stringify(profiles));
    
    // Store session
    localStorage.setItem('demo_session', JSON.stringify({
      user: newUser,
      access_token: 'demo_token',
      expires_at: Date.now() + 7 * 24 * 60 * 60 * 1000,
    }));
    
    return { data: { user: newUser, session: { user: newUser } }, error: null };
  },

  getSession: async () => {
    const sessionStr = localStorage.getItem('demo_session');
    if (!sessionStr) {
      return { data: { session: null }, error: null };
    }
    
    const session = JSON.parse(sessionStr);
    
    // Check if session expired
    if (session.expires_at < Date.now()) {
      localStorage.removeItem('demo_session');
      return { data: { session: null }, error: null };
    }
    
    return { data: { session }, error: null };
  },

  signOut: async () => {
    localStorage.removeItem('demo_session');
    return { error: null };
  },

  getProfile: async (userId: string): Promise<DemoProfile | null> => {
    const profiles = JSON.parse(localStorage.getItem('demo_profiles') || '[]');
    return profiles.find((p: DemoProfile) => p.id === userId) || null;
  },

  updateProfile: async (userId: string, updates: Partial<DemoProfile>) => {
    const profiles = JSON.parse(localStorage.getItem('demo_profiles') || '[]');
    const index = profiles.findIndex((p: DemoProfile) => p.id === userId);
    
    if (index === -1) {
      throw new Error('Profile not found');
    }
    
    profiles[index] = { ...profiles[index], ...updates };
    localStorage.setItem('demo_profiles', JSON.stringify(profiles));
    
    return { data: profiles[index], error: null };
  },
};

