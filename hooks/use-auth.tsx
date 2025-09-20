"use client"

import type React from "react"

import { useState, useEffect, createContext, useContext } from "react"
import { type User, type AuthState, signInWithGoogle, signOut } from "@/lib/auth"

interface AuthContextType extends AuthState {
  signIn: () => Promise<void>
  signOut: () => Promise<void>
  updateUser: (updates: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
  })

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem("career-user")
    if (savedUser) {
      setAuthState({
        user: JSON.parse(savedUser),
        isLoading: false,
      })
    } else {
      setAuthState((prev) => ({ ...prev, isLoading: false }))
    }
  }, [])

  const handleSignIn = async () => {
    setAuthState((prev) => ({ ...prev, isLoading: true }))
    try {
      const user = await signInWithGoogle()
      localStorage.setItem("career-user", JSON.stringify(user))
      setAuthState({ user, isLoading: false })
    } catch (error) {
      setAuthState({ user: null, isLoading: false })
    }
  }

  const handleSignOut = async () => {
    setAuthState((prev) => ({ ...prev, isLoading: true }))
    try {
      await signOut()
      localStorage.removeItem("career-user")
      setAuthState({ user: null, isLoading: false })
    } catch (error) {
      setAuthState((prev) => ({ ...prev, isLoading: false }))
    }
  }

  const updateUser = (updates: Partial<User>) => {
    if (authState.user) {
      const updatedUser = { ...authState.user, ...updates }
      localStorage.setItem("career-user", JSON.stringify(updatedUser))
      setAuthState((prev) => ({ ...prev, user: updatedUser }))
    }
  }

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        signIn: handleSignIn,
        signOut: handleSignOut,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
