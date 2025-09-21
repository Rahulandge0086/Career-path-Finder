"use client"

import {Onboarding,UserWithOnboarding} from "../../lib/auth";
import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Target,
  TrendingUp,
  BookOpen,
  Award,
  Settings,
  ArrowRight,
  Star,
  Clock,
  CheckCircle,
  ExternalLink,
} from "lucide-react"
import Link from "next/link"

const mockUserData = {
  skills: [
    { name: "JavaScript", level: 85, category: "Technical" },
    { name: "React", level: 80, category: "Technical" },
    { name: "Node.js", level: 70, category: "Technical" },
    { name: "Project Management", level: 60, category: "Soft Skills" },
    { name: "Communication", level: 75, category: "Soft Skills" },
    { name: "Problem Solving", level: 90, category: "Soft Skills" },
  ],
  careerPaths: [
    {
      title: "Senior Frontend Developer",
      match: 92,
      description: "Lead frontend development projects and mentor junior developers",
      requirements: ["Advanced React", "TypeScript", "Team Leadership"],
      salaryRange: "$90k - $130k",
      timeToAchieve: "6-12 months",
    },
    {
      title: "Full Stack Developer",
      match: 85,
      description: "Work on both frontend and backend systems",
      requirements: ["Backend Development", "Database Design", "API Development"],
      salaryRange: "$80k - $120k",
      timeToAchieve: "8-15 months",
    },
    {
      title: "Technical Lead",
      match: 78,
      description: "Lead technical decisions and architecture planning",
      requirements: ["System Design", "Team Management", "Strategic Thinking"],
      salaryRange: "$110k - $160k",
      timeToAchieve: "12-24 months",
    },
  ],
  recommendations: [
    {
      type: "Course",
      title: "Advanced React Patterns",
      provider: "Frontend Masters",
      duration: "8 hours",
      rating: 4.8,
      url: "#",
    },
    {
      type: "Article",
      title: "Building Scalable React Applications",
      provider: "Dev.to",
      duration: "15 min read",
      rating: 4.6,
      url: "#",
    },
    {
      type: "Video",
      title: "System Design Interview Prep",
      provider: "YouTube",
      duration: "2 hours",
      rating: 4.9,
      url: "#",
    },
  ],
  achievements: [
    { name: "Skill Explorer", description: "Completed first skill assessment", date: "2024-01-15" },
    { name: "Goal Setter", description: "Set your first career goal", date: "2024-01-16" },
    { name: "Learning Streak", description: "7 days of continuous learning", date: "2024-01-22" },
  ],
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserWithOnboarding | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserWithOnboarding = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/users/getUserWithOnboarding", {
          method: "GET",
          credentials: "include", // important if you're using cookies/session
        });

        if (!res.ok) throw new Error("Failed to fetch user data");

        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Error fetching user with onboarding:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserWithOnboarding();
  }, []);

  if (loading) {
  return <p>Loading...</p>;
}

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Access Required</CardTitle>
            <CardDescription>Please sign in to view your profile.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>No user found</p>;

  if (!user.onboarding.has_completed) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Complete Your Setup</CardTitle>
            <CardDescription>Finish your profile setup to access your personalized dashboard.</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild className="gradient-primary text-white">
              <Link href="/onboarding">
                Complete Setup
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            {/* <Avatar className="h-16 w-16">
              <AvatarImage src={user.picture || "/placeholder.svg"} alt={user.name} />
              <AvatarFallback className="text-lg">{user.name.charAt(0)}</AvatarFallback>
            </Avatar> */}
            <p className="h-15 w-15 bg-black text-white rounded-full flex justify-center items-center">P</p>
            <div>
              <h1 className="text-2xl font-bold">Welcome back, {user.name ? user.name.split(" ")[0] : "User"}!</h1>
              <p className="text-muted-foreground">Track your progress and discover new opportunities</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button asChild className="gradient-primary text-white">
              <Link href="/assessment">
                Take Assessment
                <Target className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" className="bg-gray-300/50 cursor-pointer hover:bg-bg-gray-300 text-black hover:text-black">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 h-max">
            <TabsTrigger value="overview" className="py-2">Overview</TabsTrigger>
            <TabsTrigger value="skills" className="py-2">Skills</TabsTrigger>
            <TabsTrigger value="paths" className="py-2">Career Paths</TabsTrigger>
            <TabsTrigger value="learning" className="py-2">Learning</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Progress Overview */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">78%</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                  <Progress value={78} className="mt-3" />
                </CardContent>
              </Card>

              {/* Skills Count */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Skills Tracked</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockUserData.skills.length}</div>
                  <p className="text-xs text-muted-foreground">Across technical & soft skills</p>
                </CardContent>
              </Card>

              {/* Learning Streak */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Learning Streak</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">7 days</div>
                  <p className="text-xs text-muted-foreground">Keep it up!</p>
                </CardContent>
              </Card>
            </div>

            {/* Top Career Matches */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Top Career Matches
                </CardTitle>
                <CardDescription>Based on your skills and interests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockUserData.careerPaths.slice(0, 2).map((path, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">{path.title}</h3>
                          <Badge variant="secondary">{path.match}% match</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{path.description}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{path.salaryRange}</span>
                          <span>•</span>
                          <span>{path.timeToAchieve}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockUserData.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-8 h-8 gradient-primary rounded-full flex items-center justify-center">
                        <Award className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{achievement.name}</p>
                        <p className="text-xs text-muted-foreground">{achievement.description}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{achievement.date}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Skills</CardTitle>
                <CardDescription>Track your skill levels and identify areas for improvement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {["Technical", "Soft Skills"].map((category) => (
                    <div key={category}>
                      <h3 className="font-semibold mb-4">{category}</h3>
                      <div className="space-y-4">
                        {mockUserData.skills
                          .filter((skill) => skill.category === category)
                          .map((skill, index) => (
                            <div key={index} className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="font-medium">{skill.name}</span>
                                <span className="text-sm text-muted-foreground">{skill.level}%</span>
                              </div>
                              <Progress value={skill.level} />
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Career Paths Tab */}
          <TabsContent value="paths" className="space-y-6">
            <div className="grid gap-6">
              {mockUserData.careerPaths.map((path, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-3">
                          {path.title}
                          <Badge variant="secondary">{path.match}% match</Badge>
                        </CardTitle>
                        <CardDescription>{path.description}</CardDescription>
                      </div>
                      <Button variant="outline">
                        View Details
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Requirements</h4>
                        <div className="space-y-1">
                          {path.requirements.map((req, reqIndex) => (
                            <Badge key={reqIndex} variant="outline" className="mr-1 mb-1">
                              {req}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Salary Range</h4>
                        <p className="text-sm text-muted-foreground">{path.salaryRange}</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Time to Achieve</h4>
                        <p className="text-sm text-muted-foreground">{path.timeToAchieve}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Learning Tab */}
          <TabsContent value="learning" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Recommended Learning Resources
                </CardTitle>
                <CardDescription>Curated content to help you reach your career goals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockUserData.recommendations.map((resource, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">{resource.type}</Badge>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs">{resource.rating}</span>
                          </div>
                        </div>
                        <CardTitle className="text-base">{resource.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">{resource.provider}</p>
                          <p className="text-xs text-muted-foreground">{resource.duration}</p>
                          <Button size="sm" variant="outline" className="w-full bg-transparent">
                            <ExternalLink className="mr-2 h-3 w-3" />
                            View Resource
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
