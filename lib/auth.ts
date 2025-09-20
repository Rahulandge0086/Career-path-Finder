export interface User {
  id: string
  email: string
  name: string
  picture?: string
  hasCompletedOnboarding?: boolean
}

export interface AuthState {
  user: User | null
  isLoading: boolean
}

// Mock authentication for demo purposes
// In production, this would integrate with NextAuth.js or similar
export const mockUsers: User[] = [
  {
    id: "1",
    email: "demo@example.com",
    name: "Demo User",
    picture: "/professional-headshot.png",
    hasCompletedOnboarding: false,
  },
]

export const signInWithGoogle = async (): Promise<User> => {
  // Simulate Google OAuth flow
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockUsers[0])
    }, 1000)
  })
}

export const signOut = async (): Promise<void> => {
  // Simulate sign out
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, 500)
  })
}
