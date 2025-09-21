export interface Onboarding {
  currentrole: string;
  experience: string;
  skills: string[];
  interests: string[];
  goals: string;
  preferred_industries: string[];
  has_completed: boolean;
}

export interface UserWithOnboarding {
  id: number;
  name: string;
  email: string;
  googleid: string;
  created_at: string;
  onboarding: Onboarding;
}

export interface User {
  id: number
  googleid: string
  name: string | null
  email: string | null
  hasCompletedOnboarding?: boolean
  onboarding?: Onboarding;
}


