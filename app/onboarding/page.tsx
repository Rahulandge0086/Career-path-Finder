"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, ArrowLeft, CheckCircle, User, Target, Briefcase } from "lucide-react"
import { useRouter } from "next/navigation"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface OnboardingData {
  currentRole: string
  experience: string
  skills: string[]
  interests: string[]
  goals: string
  preferredIndustries: string[]
}

const skillOptions = [
  "JavaScript",
  "Python",
  "React",
  "Node.js",
  "TypeScript",
  "SQL",
  "AWS",
  "Docker",
  "Project Management",
  "Data Analysis",
  "UI/UX Design",
  "Marketing",
  "Sales",
  "Communication",
  "Leadership",
  "Problem Solving",
  "Critical Thinking",
]

const interestOptions = [
  "Web Development",
  "Mobile Development",
  "Data Science",
  "Machine Learning",
  "Cybersecurity",
  "Cloud Computing",
  "DevOps",
  "Product Management",
  "Digital Marketing",
  "Content Creation",
  "Consulting",
  "Entrepreneurship",
]

const industryOptions = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "E-commerce",
  "Media & Entertainment",
  "Non-profit",
  "Government",
  "Consulting",
  "Startup",
]

export default function OnboardingPage() {
  const { user, updateUser } = useAuth()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [data, setData] = useState<OnboardingData>({
    currentRole: "",
    experience: "",
    skills: [],
    interests: [],
    goals: "",
    preferredIndustries: [],
  })

  const totalSteps = 4
  const progress = (currentStep / totalSteps) * 100

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkillToggle = (skill: string) => {
    setData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill) ? prev.skills.filter((s) => s !== skill) : [...prev.skills, skill],
    }))
  }

  const handleInterestToggle = (interest: string) => {
    setData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }))
  }

  const handleIndustryToggle = (industry: string) => {
    setData((prev) => ({
      ...prev,
      preferredIndustries: prev.preferredIndustries.includes(industry)
        ? prev.preferredIndustries.filter((i) => i !== industry)
        : [...prev.preferredIndustries, industry],
    }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Update user with onboarding completion
    updateUser({
      hasCompletedOnboarding: true,
      // In a real app, you'd save the onboarding data
    })

    router.push("/profile")
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return data.currentRole.trim() !== "" && data.experience !== ""
      case 2:
        return data.skills.length > 0
      case 3:
        return data.interests.length > 0
      case 4:
        return data.goals.trim() !== "" && data.preferredIndustries.length > 0
      default:
        return false
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Access Required</CardTitle>
            <CardDescription>Please sign in to complete your profile setup.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Badge variant="secondary" className="mb-4">
            Step {currentStep} of {totalSteps}
          </Badge>
          <h1 className="text-3xl font-bold mb-2">Complete Your Profile</h1>
          <p className="text-muted-foreground">
            Help us understand your background to provide personalized career recommendations
          </p>
          <div className="mt-6">
            <Progress value={progress} className="w-full" />
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-3">
              {currentStep === 1 && <User className="h-6 w-6 text-primary" />}
              {currentStep === 2 && <CheckCircle className="h-6 w-6 text-primary" />}
              {currentStep === 3 && <Target className="h-6 w-6 text-primary" />}
              {currentStep === 4 && <Briefcase className="h-6 w-6 text-primary" />}
              <div>
                <CardTitle>
                  {currentStep === 1 && "Tell us about yourself"}
                  {currentStep === 2 && "What are your skills?"}
                  {currentStep === 3 && "What interests you?"}
                  {currentStep === 4 && "What are your goals?"}
                </CardTitle>
                <CardDescription>
                  {currentStep === 1 && "Share your current role and experience level"}
                  {currentStep === 2 && "Select the skills you currently have"}
                  {currentStep === 3 && "Choose areas that interest you most"}
                  {currentStep === 4 && "Define your career objectives and preferred industries"}
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Step 1: Basic Info */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="currentRole">Current Role or Title</Label>
                  <Input
                    id="currentRole"
                    placeholder="e.g., Software Developer, Student, Marketing Manager"
                    value={data.currentRole}
                    onChange={(e) => setData((prev) => ({ ...prev, currentRole: e.target.value }))}
                  />
                </div>
                <Select onValueChange={(value) => setData((prev) => ({ ...prev, experience: value }))}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-1">0-1 years (Entry level)</SelectItem>
                    <SelectItem value="2-4">2-4 years (Junior)</SelectItem>
                    <SelectItem value="5-7">5-7 years (Mid-level)</SelectItem>
                    <SelectItem value="8-12">8-12 years (Senior)</SelectItem>
                    <SelectItem value="13+">13+ years (Expert/Lead)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Step 2: Skills */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Select all skills that apply to you. Don't worry if you're still learning some of them.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {skillOptions.map((skill) => (
                    <div key={skill} className="flex items-center space-x-2">
                      <Checkbox
                        id={skill}
                        checked={data.skills.includes(skill)}
                        onCheckedChange={() => handleSkillToggle(skill)}
                      />
                      <Label htmlFor={skill} className="text-sm font-normal cursor-pointer">
                        {skill}
                      </Label>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">Selected: {data.skills.length} skills</p>
              </div>
            )}

            {/* Step 3: Interests */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  What areas are you most interested in exploring or developing further?
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {interestOptions.map((interest) => (
                    <div key={interest} className="flex items-center space-x-2">
                      <Checkbox
                        id={interest}
                        checked={data.interests.includes(interest)}
                        onCheckedChange={() => handleInterestToggle(interest)}
                      />
                      <Label htmlFor={interest} className="text-sm font-normal cursor-pointer">
                        {interest}
                      </Label>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">Selected: {data.interests.length} interests</p>
              </div>
            )}

            {/* Step 4: Goals & Industries */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="goals">Career Goals</Label>
                  <Textarea
                    id="goals"
                    placeholder="Describe your career goals and what you hope to achieve in the next 2-3 years..."
                    value={data.goals}
                    className="resize-none m-2"
                    onChange={(e) => setData((prev) => ({ ...prev, goals: e.target.value }))}
                    rows={4}
                  />
                </div>
                <div>
                  <Label>Preferred Industries</Label>
                  <p className="text-sm text-muted-foreground mb-3">Which industries interest you most?</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {industryOptions.map((industry) => (
                      <div key={industry} className="flex items-center space-x-2">
                        <Checkbox
                          id={industry}
                          checked={data.preferredIndustries.includes(industry)}
                          onCheckedChange={() => handleIndustryToggle(industry)}
                        />
                        <Label htmlFor={industry} className="text-sm font-normal cursor-pointer">
                          {industry}
                        </Label>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Selected: {data.preferredIndustries.length} industries
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1} className="gradient-primary text-white">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          {currentStep < totalSteps ? (
            <Button onClick={handleNext} disabled={!canProceed()} className="gradient-primary rounded-[50px] cursor-pointer text-white">
              Next
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!canProceed() || isSubmitting}
              className="gradient-primary text-white"
            >
              {isSubmitting ? "Creating Profile..." : "Complete Setup"}
              <CheckCircle className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
