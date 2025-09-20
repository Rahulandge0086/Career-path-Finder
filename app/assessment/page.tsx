"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { CheckCircle, ArrowRight, ArrowLeft, Target, BookOpen, TrendingUp, Clock } from "lucide-react"
import { useRouter } from "next/navigation"

interface Question {
  id: number
  category: string
  question: string
  options: string[]
  correctAnswer?: number
  skillWeight: { [key: string]: number }
}

interface AssessmentResult {
  skillScores: { [key: string]: number }
  recommendations: {
    title: string
    type: string
    description: string
    priority: "high" | "medium" | "low"
    estimatedTime: string
    resources: Array<{
      title: string
      type: string
      provider: string
      url: string
    }>
  }[]
  careerPaths: Array<{
    title: string
    match: number
    description: string
    nextSteps: string[]
  }>
}

const assessmentQuestions: Question[] = [
  {
    id: 1,
    category: "Technical Skills",
    question:
      "How comfortable are you with JavaScript ES6+ features like arrow functions, destructuring, and async/await?",
    options: [
      "I'm not familiar with these concepts",
      "I understand the basics but need more practice",
      "I'm comfortable using them in projects",
      "I can teach others and use advanced patterns",
    ],
    skillWeight: { JavaScript: 1, "Frontend Development": 0.8 },
  },
  {
    id: 2,
    category: "Technical Skills",
    question: "What's your experience with React or similar frontend frameworks?",
    options: [
      "No experience with frontend frameworks",
      "I've built simple components and understand basics",
      "I can build complete applications with state management",
      "I'm proficient with advanced patterns, testing, and optimization",
    ],
    skillWeight: { React: 1, "Frontend Development": 0.9, "Component Architecture": 0.7 },
  },
  {
    id: 3,
    category: "Technical Skills",
    question: "How would you approach debugging a performance issue in a web application?",
    options: [
      "I would ask for help from a senior developer",
      "I'd use browser dev tools to identify obvious issues",
      "I'd systematically profile and optimize bottlenecks",
      "I'd implement monitoring and create performance budgets",
    ],
    skillWeight: { "Problem Solving": 1, "Performance Optimization": 0.8, Debugging: 0.9 },
  },
  {
    id: 4,
    category: "Soft Skills",
    question: "When working on a team project with conflicting opinions, how do you typically handle it?",
    options: [
      "I usually go along with the majority decision",
      "I present my viewpoint and listen to others",
      "I facilitate discussion to find common ground",
      "I lead collaborative decision-making processes",
    ],
    skillWeight: { Communication: 1, Leadership: 0.8, "Conflict Resolution": 0.9 },
  },
  {
    id: 5,
    category: "Soft Skills",
    question: "How do you approach learning new technologies or skills?",
    options: [
      "I wait for formal training opportunities",
      "I follow tutorials and documentation",
      "I build projects and experiment actively",
      "I mentor others while learning and contribute to communities",
    ],
    skillWeight: { "Learning Agility": 1, "Self-Direction": 0.8, "Knowledge Sharing": 0.6 },
  },
  {
    id: 6,
    category: "Project Management",
    question: "How do you handle project deadlines and priorities?",
    options: [
      "I work on tasks as they're assigned to me",
      "I create basic to-do lists and track progress",
      "I use project management tools and break down tasks",
      "I optimize workflows and help teams improve processes",
    ],
    skillWeight: { "Project Management": 1, "Time Management": 0.8, "Process Improvement": 0.7 },
  },
  {
    id: 7,
    category: "Technical Skills",
    question: "What's your experience with version control systems like Git?",
    options: [
      "I'm not familiar with version control",
      "I can commit and push basic changes",
      "I understand branching, merging, and collaboration workflows",
      "I can resolve complex conflicts and optimize team workflows",
    ],
    skillWeight: { Git: 1, Collaboration: 0.7, "Development Workflow": 0.8 },
  },
  {
    id: 8,
    category: "Problem Solving",
    question: "When faced with a complex technical problem, what's your approach?",
    options: [
      "I look for similar solutions online",
      "I break it down into smaller, manageable parts",
      "I research thoroughly and consider multiple approaches",
      "I design systematic solutions and document for future reference",
    ],
    skillWeight: { "Problem Solving": 1, "Analytical Thinking": 0.9, "Research Skills": 0.7 },
  },
]

export default function AssessmentPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<{ [key: number]: number }>({})
  const [isCompleted, setIsCompleted] = useState(false)
  const [results, setResults] = useState<AssessmentResult | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  const progress = ((currentQuestion + 1) / assessmentQuestions.length) * 100

  const handleAnswer = (questionId: number, answerIndex: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answerIndex }))
  }

  const handleNext = () => {
    if (currentQuestion < assessmentQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      calculateResults()
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const calculateResults = async () => {
    setIsCalculating(true)

    // Simulate calculation time
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Calculate skill scores based on answers
    const skillScores: { [key: string]: number } = {}

    assessmentQuestions.forEach((question) => {
      const answerIndex = answers[question.id] || 0
      const score = (answerIndex / 3) * 100 // Convert to percentage

      Object.entries(question.skillWeight).forEach(([skill, weight]) => {
        if (!skillScores[skill]) {
          skillScores[skill] = 0
        }
        skillScores[skill] += score * weight
      })
    })

    // Normalize scores
    Object.keys(skillScores).forEach((skill) => {
      const questionCount = assessmentQuestions.filter((q) => Object.keys(q.skillWeight).includes(skill)).length
      skillScores[skill] = Math.round(skillScores[skill] / questionCount)
    })

    // Generate recommendations based on scores
    const recommendations = generateRecommendations(skillScores)
    const careerPaths = generateCareerPaths(skillScores)

    setResults({
      skillScores,
      recommendations,
      careerPaths,
    })

    setIsCompleted(true)
    setIsCalculating(false)
  }

  const generateRecommendations = (scores: { [key: string]: number }) => {
    const recommendations = []

    // Find areas for improvement (scores < 60)
    const improvementAreas = Object.entries(scores)
      .filter(([_, score]) => score < 60)
      .sort(([_, a], [__, b]) => a - b)

    if (improvementAreas.length > 0) {
      const [skill, score] = improvementAreas[0]
      recommendations.push({
        title: `Improve ${skill} Skills`,
        type: "Skill Development",
        description: `Focus on strengthening your ${skill.toLowerCase()} abilities to unlock new opportunities.`,
        priority: "high" as const,
        estimatedTime: "2-3 months",
        resources: [
          {
            title: `${skill} Fundamentals Course`,
            type: "Course",
            provider: "Online Learning Platform",
            url: "#",
          },
          {
            title: `${skill} Best Practices Guide`,
            type: "Article",
            provider: "Tech Blog",
            url: "#",
          },
        ],
      })
    }

    // Find strengths (scores > 80)
    const strengths = Object.entries(scores)
      .filter(([_, score]) => score > 80)
      .sort(([_, a], [__, b]) => b - a)

    if (strengths.length > 0) {
      const [skill] = strengths[0]
      recommendations.push({
        title: `Leverage Your ${skill} Expertise`,
        type: "Career Advancement",
        description: `Your strong ${skill.toLowerCase()} skills position you well for senior roles and mentoring opportunities.`,
        priority: "medium" as const,
        estimatedTime: "1-2 months",
        resources: [
          {
            title: `Advanced ${skill} Techniques`,
            type: "Course",
            provider: "Professional Development",
            url: "#",
          },
          {
            title: `${skill} Leadership Guide`,
            type: "Book",
            provider: "Industry Expert",
            url: "#",
          },
        ],
      })
    }

    return recommendations
  }

  const generateCareerPaths = (scores: { [key: string]: number }) => {
    const paths = []

    const avgTechnicalScore =
      ((scores["JavaScript"] || 0) + (scores["React"] || 0) + (scores["Frontend Development"] || 0)) / 3

    const avgSoftSkillsScore =
      ((scores["Communication"] || 0) + (scores["Leadership"] || 0) + (scores["Problem Solving"] || 0)) / 3

    if (avgTechnicalScore > 70) {
      paths.push({
        title: "Senior Frontend Developer",
        match: Math.round(avgTechnicalScore),
        description: "Lead frontend development projects and architect scalable solutions",
        nextSteps: ["Master advanced React patterns", "Learn system design principles", "Develop mentoring skills"],
      })
    }

    if (avgSoftSkillsScore > 70 && avgTechnicalScore > 60) {
      paths.push({
        title: "Technical Team Lead",
        match: Math.round((avgSoftSkillsScore + avgTechnicalScore) / 2),
        description: "Combine technical expertise with leadership to guide development teams",
        nextSteps: [
          "Strengthen project management skills",
          "Practice technical communication",
          "Learn team building strategies",
        ],
      })
    }

    if (scores["Problem Solving"] > 75) {
      paths.push({
        title: "Solutions Architect",
        match: Math.round(scores["Problem Solving"]),
        description: "Design and implement complex technical solutions for business challenges",
        nextSteps: [
          "Study system architecture patterns",
          "Learn cloud technologies",
          "Develop business analysis skills",
        ],
      })
    }

    return paths.sort((a, b) => b.match - a.match)
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Access Required</CardTitle>
            <CardDescription>Please sign in to take the assessment.</CardDescription>
            <Link
              href="/"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-300 relative group"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 gradient-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (isCalculating) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="h-8 w-8 text-white animate-pulse" />
            </div>
            <CardTitle>Analyzing Your Responses</CardTitle>
            <CardDescription>
              We're calculating your skill levels and generating personalized recommendations...
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={100} className="animate-pulse" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isCompleted && results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Assessment Complete!</h1>
            <p className="text-muted-foreground">Here are your personalized results and recommendations</p>
          </div>

          {/* Skill Scores */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Your Skill Assessment
              </CardTitle>
              <CardDescription>Based on your responses, here's how you scored in different areas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {Object.entries(results.skillScores).map(([skill, score]) => (
                  <div key={skill} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{skill}</span>
                      <Badge variant={score > 80 ? "default" : score > 60 ? "secondary" : "outline"}>{score}%</Badge>
                    </div>
                    <Progress value={score} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Career Paths */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Recommended Career Paths
              </CardTitle>
              <CardDescription>Based on your assessment, these roles align well with your skills</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.careerPaths.map((path, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold">{path.title}</h3>
                      <Badge variant="secondary">{path.match}% match</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{path.description}</p>
                    <div>
                      <h4 className="font-medium text-sm mb-2">Next Steps:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {path.nextSteps.map((step, stepIndex) => (
                          <li key={stepIndex} className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-primary" />
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Learning Recommendations
              </CardTitle>
              <CardDescription>Curated resources to help you improve and grow</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {results.recommendations.map((rec, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{rec.title}</h3>
                          <Badge
                            variant={
                              rec.priority === "high"
                                ? "destructive"
                                : rec.priority === "medium"
                                  ? "default"
                                  : "secondary"
                            }
                          >
                            {rec.priority} priority
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{rec.description}</p>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {rec.estimatedTime}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm mb-2">Recommended Resources:</h4>
                      <div className="grid md:grid-cols-2 gap-2">
                        {rec.resources.map((resource, resourceIndex) => (
                          <div
                            key={resourceIndex}
                            className="flex items-center justify-between p-2 bg-muted rounded text-sm"
                          >
                            <div>
                              <p className="font-medium">{resource.title}</p>
                              <p className="text-xs text-muted-foreground">{resource.provider}</p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {resource.type}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => router.push("/profile")} className="gradient-primary text-white">
              View Your Profile
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Retake Assessment
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const question = assessmentQuestions[currentQuestion]
  const currentAnswer = answers[question.id]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Badge variant="secondary" className="mb-4">
            Question {currentQuestion + 1} of {assessmentQuestions.length}
          </Badge>
          <h1 className="text-2xl font-bold mb-2">Skill Assessment</h1>
          <p className="text-muted-foreground">Answer honestly to get the most accurate recommendations</p>
          <div className="mt-6">
            <Progress value={progress} className="w-full" />
          </div>
        </div>

        {/* Question */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
                <Target className="h-5 w-5 absolute text-white" />
              </div>
              <div>
                <Badge variant="outline" className="mb-2">
                  {question.category}
                </Badge>
                <CardTitle className="text-lg">{question.question}</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={currentAnswer?.toString()}
              onValueChange={(value) => handleAnswer(question.id, Number.parseInt(value))}
            >
              {question.options.map((option, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          <Button onClick={handleNext} disabled={currentAnswer === undefined} className="gradient-primary text-white">
            {currentQuestion === assessmentQuestions.length - 1 ? "Complete Assessment" : "Next"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
