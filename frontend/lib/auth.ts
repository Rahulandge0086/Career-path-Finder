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

export interface CareerPath {
  title: string;
  suggested_job_titles: string[];
  required_skills: {
    existing: string[];
    to_develop: string[];
  };
  next_steps: string[];
  industries: string[];
}

export interface GeminiResponse {
  career_paths: CareerPath[];
}
