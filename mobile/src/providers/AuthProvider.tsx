import React, { createContext, useContext, useState } from "react";

interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  plan: "free" | "premium";
}

interface RegisteredUser {
  name: string;
  email: string;
  password?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, avatar?: string) => Promise<void>;
  logout: () => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  upgradeToPremium: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const INITIAL_USERS: RegisteredUser[] = [
  {
    name: "Enter Your Email",
    email: "Enter Your Email",
    password: "*****",
  },
  {
    name: "John Admin",
    email: "admin@halcyon.ai",
    password: "adminpassword",
  }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [usersDb, setUsersDb] = useState<RegisteredUser[]>(INITIAL_USERS);

  const login = async (email: string, password: string) => {
    const foundUser = usersDb.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (!foundUser) {
      throw new Error("Email not registered. Please sign up first.");
    }

    if (foundUser.password !== password) {
      throw new Error("Incorrect password. Please try again.");
    }

    setIsAuthenticated(true);
    setUser({
      name: foundUser.name,
      email: foundUser.email,
      role: foundUser.email.includes("admin") ? "Incident Administrator" : "Lead Incident Responder",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
      plan: "free",
    });
  };

  const signup = async (name: string, email: string, password: string, avatar?: string) => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      throw new Error("All registration fields are required.");
    }

    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters.");
    }

    const exists = usersDb.some(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    if (exists) {
      throw new Error("Email is already registered. Please login.");
    }

    const newUser: RegisteredUser = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password,
    };

    setUsersDb((prev) => [...prev, newUser]);
    setIsAuthenticated(true);
    setUser({
      name: newUser.name,
      email: newUser.email,
      role: "Incident Response Engineer",
      avatar: avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
      plan: "free",
    });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  const updateProfile = (profile: Partial<UserProfile>) => {
    if (user) {
      setUser({ ...user, ...profile } as UserProfile);
    }
  };

  const upgradeToPremium = () => {
    if (user) {
      setUser((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          plan: "premium",
        };
      });
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, signup, logout, updateProfile, upgradeToPremium }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
