"use client";

import { useState } from "react";
import { Onboarding } from "../../lib/auth";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  User,
  Target,
  Briefcase,
  Loader2,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
];

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
];

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
];

export default function OnboardingPage() {
  const { user, isLoading, signIn, updateUser } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [data, setData] = useState<Onboarding>({
    currentrole: "",
    experience: "",
    skills: [],
    interests: [],
    goals: "",
    preferred_industries: [],
    has_completed: false,
  });

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkillToggle = (skill: string) => {
    setData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const handleInterestToggle = (interest: string) => {
    setData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleIndustryToggle = (industry: string) => {
    setData((prev) => ({
      ...prev,
      preferred_industries: prev.preferred_industries.includes(industry)
        ? prev.preferred_industries.filter((i) => i !== industry)
        : [...prev.preferred_industries, industry],
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const res = await fetch("http://localhost:5001/api/users/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          userId: user?.id,
          onboarding: {
            ...data,
            currentRole: data.currentrole,
            preferredIndustries: data.preferred_industries,
            has_completed: true,
          },
        }),
      });

      if (res.ok) {
        updateUser({ onboarding: { ...data, has_completed: true } });
        router.push("/profile");
      } else {
        const errorData = await res.json().catch(() => ({}));
        console.error("Failed to save onboarding data:", errorData);
      }
    } catch (err) {
      console.error("Error submitting onboarding:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return data.currentrole.trim() !== "" && data.experience !== "";
      case 2:
        return data.skills.length > 0;
      case 3:
        return data.interests.length > 0;
      case 4:
        return data.goals.trim() !== "" && data.preferred_industries.length > 0;
      default:
        return false;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
          <span>Loading your profile...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="w-full max-w-md bg-zinc-950/90 border border-white/10 text-white shadow-2xl backdrop-blur-xl">
          <CardHeader className="text-center">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center mx-auto mb-3 text-white shadow-lg shadow-cyan-500/20">
              <User className="w-6 h-6" />
            </div>
            <CardTitle className="text-2xl">Access Required</CardTitle>
            <CardDescription className="text-zinc-400">
              Please sign in to complete your profile setup and access personalized guidance.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center pt-2">
            <Button
              onClick={() => signIn("login")}
              className="w-full gradient-primary text-white font-medium h-11 rounded-lg cursor-pointer"
            >
              Sign In to Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Badge variant="secondary" className="mb-4">
            Step {currentStep} of {totalSteps}
          </Badge>
          <h1 className="text-3xl font-bold mb-2">Complete Your Profile</h1>
          <p className="text-muted-foreground text-sm">
            Help us understand your background to provide personalized career recommendations
          </p>
          <div className="mt-6">
            <Progress value={progress} className="w-full h-2" />
          </div>
        </div>

        <Card className="mb-8 border border-white/10 shadow-xl bg-card/60 backdrop-blur-lg">
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
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="currentRole" className="text-sm font-medium">
                    Current Role or Target Job
                  </Label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <Input
                      id="currentRole"
                      placeholder="e.g., Software Developer, Student, Marketing Specialist"
                      value={data.currentrole}
                      onChange={(e) =>
                        setData((prev) => ({ ...prev, currentrole: e.target.value }))
                      }
                      className="pl-9 h-11"
                      autoFocus
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience" className="text-sm font-medium">
                    Years of Experience
                  </Label>
                  <Select
                    value={data.experience}
                    onValueChange={(value) =>
                      setData((prev) => ({ ...prev, experience: value }))
                    }
                  >
                    <SelectTrigger id="experience" className="w-full h-11">
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-1">0-1 years (Entry level / Student)</SelectItem>
                      <SelectItem value="2-4">2-4 years (Junior)</SelectItem>
                      <SelectItem value="5-7">5-7 years (Mid-level)</SelectItem>
                      <SelectItem value="8-12">8-12 years (Senior)</SelectItem>
                      <SelectItem value="13+">13+ years (Expert / Lead)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
                    <div
                      key={skill}
                      className={`flex items-center space-x-2.5 p-3 rounded-lg border transition-all cursor-pointer ${
                        data.skills.includes(skill)
                          ? "bg-primary/10 border-primary/40 text-foreground"
                          : "border-border/50 hover:bg-muted/50 text-muted-foreground"
                      }`}
                      onClick={() => handleSkillToggle(skill)}
                    >
                      <Checkbox
                        id={skill}
                        checked={data.skills.includes(skill)}
                        onCheckedChange={() => handleSkillToggle(skill)}
                      />
                      <Label
                        htmlFor={skill}
                        className="text-sm font-normal cursor-pointer flex-1"
                      >
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
                    <div
                      key={interest}
                      className={`flex items-center space-x-2.5 p-3 rounded-lg border transition-all cursor-pointer ${
                        data.interests.includes(interest)
                          ? "bg-primary/10 border-primary/40 text-foreground"
                          : "border-border/50 hover:bg-muted/50 text-muted-foreground"
                      }`}
                      onClick={() => handleInterestToggle(interest)}
                    >
                      <Checkbox
                        id={interest}
                        checked={data.interests.includes(interest)}
                        onCheckedChange={() => handleInterestToggle(interest)}
                      />
                      <Label
                        htmlFor={interest}
                        className="text-sm font-normal cursor-pointer flex-1"
                      >
                        {interest}
                      </Label>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Selected: {data.interests.length} interests
                </p>
              </div>
            )}

            {/* Step 4: Goals & Industries */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="goals" className="text-sm font-medium">
                    Career Goals
                  </Label>
                  <Textarea
                    id="goals"
                    placeholder="Describe your career goals and what you hope to achieve in the next 2-3 years..."
                    value={data.goals}
                    className="resize-none min-h-[110px]"
                    onChange={(e) => setData((prev) => ({ ...prev, goals: e.target.value }))}
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Preferred Industries</Label>
                  <p className="text-xs text-muted-foreground mb-3">Which industries interest you most?</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {industryOptions.map((industry) => (
                      <div
                        key={industry}
                        className={`flex items-center space-x-2.5 p-3 rounded-lg border transition-all cursor-pointer ${
                          data.preferred_industries.includes(industry)
                            ? "bg-primary/10 border-primary/40 text-foreground"
                            : "border-border/50 hover:bg-muted/50 text-muted-foreground"
                        }`}
                        onClick={() => handleIndustryToggle(industry)}
                      >
                        <Checkbox
                          id={industry}
                          checked={data.preferred_industries.includes(industry)}
                          onCheckedChange={() => handleIndustryToggle(industry)}
                        />
                        <Label
                          htmlFor={industry}
                          className="text-sm font-normal cursor-pointer flex-1"
                        >
                          {industry}
                        </Label>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Selected: {data.preferred_industries.length} industries
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="cursor-pointer"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          {currentStep < totalSteps ? (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="gradient-primary text-white rounded-full px-6 cursor-pointer"
            >
              Next
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!canProceed() || isSubmitting}
              className="gradient-primary text-white rounded-full px-6 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving Profile...
                </>
              ) : (
                <>
                  Complete Setup
                  <CheckCircle className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
