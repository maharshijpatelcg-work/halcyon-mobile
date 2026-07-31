import { create } from 'zustand';
import { User } from '@/types/auth';

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: {
    uid: 'usr-halcyon-engineer-01',
    email: 'engineer@halcyon.ai',
    displayName: 'HALCYON PRINCIPAL ENGINEER',
    photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    emailVerified: true,
    providerId: 'google.com',
  },
  isAuthenticated: true,
  isLoading: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));
