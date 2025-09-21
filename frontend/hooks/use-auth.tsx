"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { type User } from "@/lib/auth";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void
  updateUser: (updates: Partial<User>) => void
  signIn: () => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates })
    }
  }

  useEffect(() => {
    // fetch user from backend
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/getUser", {
          credentials: "include",
        });

        if (res.ok) {
          const data: User = await res.json();
          setUser(data);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error(err);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const signIn = () => {
    window.location.href = "http://localhost:5000/api/auth/google"; // redirect to Google login
  };

  const signOut = async () => {
    await fetch("http://localhost:5000/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, setUser, updateUser, signIn, signOut}}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be inside AuthProvider");
  return context;
}
