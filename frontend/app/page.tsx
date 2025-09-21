"use client"

import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Target, TrendingUp, Users, BookOpen, Award, CheckCircle, Sparkles, Zap, Brain } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const { user, isLoading, signIn, signOut } = useAuth();

  const handleGetStarted = async () => {
    if (!user) await signIn();
  }

  const hasCompletedOnboarding = user?.onboarding?.has_completed ?? false;

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden gradient-hero min-h-screen flex items-center">
        <div className="absolute top-20 left-10 w-96 h-96 bg-violet-500 rounded-full opacity-20 blur-3xl animate-float" />
        <div
          className="absolute bottom-20 right-10 w-80 h-80 bg-accent rounded-full opacity-15 blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] gradient-primary rounded-full opacity-10 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-10 animate-fade-in">
              <div className="space-y-6">
                <Badge
                  variant="secondary"
                  className="w-fit glass-card border-white/30 text-primary font-semibold px-4 py-2"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI-Powered Career Guidance
                </Badge>
                <h1 className="text-5xl lg:text-7xl font-bold leading-tight text-balance">
                  Discover Your <span className="text-gradient">Perfect Career Path</span>
                </h1>
                <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed text-pretty font-light">
                  Get personalized career recommendations based on your unique skills, interests, and goals. Take
                  assessments, track progress, and unlock your professional potential with AI-powered insights.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-6">
                {user ? (
                  <Button
                    asChild
                    size="lg"
                    className="gradient-primary rounded-[50px] text-white transition-all duration-300 shadow-xl hover:shadow-2xl px-8 py-6 text-md font-semibold"
                  >
                    <Link href={hasCompletedOnboarding ? "/profile" : "/onboarding"}>
                      {hasCompletedOnboarding ? "View Dashboard" : "Complete Setup"}
                      <ArrowRight className="ml-3 h-5 w-5" />
                    </Link>
                  </Button>
                ) : (
                  <Button
                    onClick={handleGetStarted}
                    size="lg"
                    className="gradient-primary rounded-[50px] text-white cursor-pointer transition-all duration-300 shadow-xl hover:shadow-2xl px-8 py-6 text-md font-semibold hover-glow"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing In..." : "Get Started Free"}
                    <ArrowRight className="ml-3 h-5 w-5" />
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="glass-card border-white/30 hover:bg-gray-300/50 hover:text-black px-8 py-6 text-md font-medium bg-transparent"
                >
                  <Link href="#features">Learn More</Link>
                </Button>
              </div>

              <div className="flex items-center gap-8 pt-6">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-primary" />
                  <span className="text-base text-muted-foreground font-medium">Free to start</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-primary" />
                  <span className="text-base text-muted-foreground font-medium">No extra things required</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-primary" />
                  <span className="text-base text-muted-foreground font-medium">AI-powered insights</span>
                </div>
              </div>
            </div>

            <div className="relative animate-slide-up">
              <div className="relative z-10">
                <Card className="p-8 glass-card border-white/20 shadow-2xl hover-lift">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold">Career Progress</h3>
                      <Badge variant="secondary" className="gradient-primary text-white px-3 py-1 font-semibold">
                        85% Match
                      </Badge>
                    </div>
                    <div className="space-y-5">
                      <div className="space-y-3">
                        <div className="flex justify-between text-base font-medium">
                          <span>Frontend Development</span>
                          <span className="text-muted-foreground">Advanced</span>
                        </div>
                        <div className="w-full bg-muted/30 rounded-full h-3">
                          <div className="gradient-primary h-3 rounded-full shadow-sm" style={{ width: "85%" }} />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between text-base font-medium">
                          <span>UI/UX Design</span>
                          <span className="text-muted-foreground">Intermediate</span>
                        </div>
                        <div className="w-full bg-muted/30 rounded-full h-3">
                          <div className="gradient-primary h-3 rounded-full shadow-sm" style={{ width: "65%" }} />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between text-base font-medium">
                          <span>Project Management</span>
                          <span className="text-muted-foreground">Beginner</span>
                        </div>
                        <div className="w-full bg-muted/30 rounded-full h-3">
                          <div className="gradient-primary h-3 rounded-full shadow-sm" style={{ width: "30%" }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="features" className="py-32 bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6 mb-20 animate-fade-in">
            <Badge
              variant="secondary"
              className="w-fit mx-auto glass-card border-white/30 text-primary font-semibold px-4 py-2"
            >
              <Zap className="w-4 h-4 mr-2" />
              Platform Features
            </Badge>
            <h2 className="text-4xl lg:text-6xl font-bold text-balance">
              Everything you need to <span className="text-gradient">build your career</span>
            </h2>
            <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto text-pretty font-light">
              Our comprehensive platform provides personalized guidance, skill assessments, and career tracking to help
              you achieve your professional goals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="relative overflow-hidden group glass-card border-white/20 hover-lift hover-glow">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold">Personalized Assessments</CardTitle>
                <CardDescription className="text-base text-muted-foreground font-light">
                  Take comprehensive skill assessments to identify your strengths and areas for growth.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    Technical skill evaluation
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    Personality assessment
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    Career interest analysis
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden group glass-card border-white/20 hover-lift hover-glow">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold">AI Career Matching</CardTitle>
                <CardDescription className="text-base text-muted-foreground font-light">
                  Get tailored career suggestions based on your unique profile and market trends.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    AI-powered matching
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    Industry insights
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    Salary expectations
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden group glass-card border-white/20 hover-lift hover-glow">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold">Learning Resources</CardTitle>
                <CardDescription className="text-base text-muted-foreground font-light">
                  Access curated courses, articles, and resources to develop your skills.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    Curated course recommendations
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    Industry articles
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    Video tutorials
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden group glass-card border-white/20 hover-lift hover-glow">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold">Progress Tracking</CardTitle>
                <CardDescription className="text-base text-muted-foreground font-light">
                  Monitor your skill development and career advancement over time.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    Skill progression charts
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    Goal setting & tracking
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    Achievement badges
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden group glass-card border-white/20 hover-lift hover-glow">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold">Expert Guidance</CardTitle>
                <CardDescription className="text-base text-muted-foreground font-light">
                  Get insights from industry professionals and career counselors.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    Career counseling sessions
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    Industry mentor matching
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    Resume & interview prep
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden group glass-card border-white/20 hover-lift hover-glow">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold">Market Insights</CardTitle>
                <CardDescription className="text-base text-muted-foreground font-light">
                  Stay updated with the latest job market trends and opportunities.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    Job market analytics
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    Salary benchmarking
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    Emerging skill trends
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      <section className="py-32 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8 animate-fade-in">
            <h2 className="text-4xl lg:text-6xl font-bold text-balance">
              Ready to accelerate your <span className="text-gradient">career growth?</span>
            </h2>
            <p className="text-xl lg:text-2xl text-muted-foreground text-pretty font-light max-w-3xl mx-auto">
              Join thousands of professionals who have discovered their ideal career path with our AI-powered guidance
              platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-4">
              {user ? (
                <Button
                  asChild
                  size="lg"
                  className="gradient-primary rounded-[10px] text-white hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl px-8 py-4 text-lg font-semibold hover-glow"
                >
                  <Link href={isLoading ? "/profile" : "/onboarding"}>
                    {isLoading ? "Go to Dashboard" : "Complete Your Profile"}
                    <ArrowRight className="ml-3 h-5 w-5" />
                  </Link>
                </Button>
              ) : (
                <Button
                  onClick={handleGetStarted}
                  size="lg"
                  className="gradient-primary rounded-[10px] text-white cursor-pointer transition-all duration-300 shadow-xl hover:shadow-2xl px-8 py-4 text-lg font-semibold hover-glow"
                  disabled={hasCompletedOnboarding}
                >
                  {hasCompletedOnboarding ? "Signing In..." : "Start Your Journey"}
                  <ArrowRight className="ml-3 h-5 w-5" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
