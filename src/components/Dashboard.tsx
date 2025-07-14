import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Clock, 
  Target, 
  TrendingUp, 
  Award, 
  Play, 
  BarChart3,
  Filter,
  Star,
  CheckCircle2,
  XCircle,
  Settings
} from "lucide-react";

interface DashboardProps {
  user: any;
  onStartPractice: () => void;
  onStartExam: () => void;
  onViewAnalytics: () => void;
  onOpenCMS: () => void;
}

export default function Dashboard({ user, onStartPractice, onStartExam, onViewAnalytics, onOpenCMS }: DashboardProps) {
  const [selectedCertification] = useState("AWS Solutions Architect - Associate");
  
  // Mock data - would come from backend
  const stats = {
    totalQuestions: 1250,
    practiceCompleted: 340,
    examsTaken: 5,
    averageScore: 78,
    strongAreas: ["EC2", "S3", "IAM"],
    weakAreas: ["Lambda", "API Gateway", "CloudFormation"],
    recentResults: [
      { date: "2024-01-10", score: 82, passed: true },
      { date: "2024-01-08", score: 68, passed: false },
      { date: "2024-01-05", score: 75, passed: true },
    ]
  };

  const certifications = [
    { name: "AWS Solutions Architect - Associate", progress: 68, total: 1250 },
    { name: "AWS Developer - Associate", progress: 45, total: 980 },
    { name: "AWS SysOps Administrator - Associate", progress: 23, total: 1100 },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <div className="bg-gradient-primary rounded-lg p-6 text-primary-foreground">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back, {user.name || user.email}!</h1>
            <p className="opacity-90">Ready to advance your AWS certification journey?</p>
          </div>
          <Button variant="secondary" onClick={onOpenCMS} className="bg-white/20 hover:bg-white/30 text-white border-white/30">
            <Settings className="w-4 h-4 mr-2" />
            Manage Questions
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="hover:shadow-elegant transition-shadow cursor-pointer" onClick={onStartPractice}>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Practice Mode</CardTitle>
            <BookOpen className="h-4 w-4 ml-auto text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">Practice</div>
            <p className="text-xs text-muted-foreground">
              Learn with immediate feedback and explanations
            </p>
            <Button className="w-full mt-4" variant="accent">
              <Play className="w-4 h-4 mr-2" />
              Start Practice
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-elegant transition-shadow cursor-pointer" onClick={onStartExam}>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Exam Mode</CardTitle>
            <Clock className="h-4 w-4 ml-auto text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">Mock Exam</div>
            <p className="text-xs text-muted-foreground">
              90-minute timed exam simulation
            </p>
            <Button className="w-full mt-4" variant="default">
              <Target className="w-4 h-4 mr-2" />
              Take Exam
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Progress Overview */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Certification Progress</CardTitle>
            <CardDescription>Track your progress across different AWS certifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {certifications.map((cert, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{cert.name}</span>
                  <span className="text-muted-foreground">{cert.progress}%</span>
                </div>
                <Progress value={cert.progress} className="h-2" />
                <div className="text-xs text-muted-foreground">
                  {Math.round((cert.progress / 100) * cert.total)} of {cert.total} questions practiced
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Average Score</span>
              <Badge variant={stats.averageScore >= 70 ? "default" : "destructive"}>
                {stats.averageScore}%
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Exams Taken</span>
              <span className="text-sm">{stats.examsTaken}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Questions Practiced</span>
              <span className="text-sm">{stats.practiceCompleted}</span>
            </div>
            <Button variant="outline" className="w-full" onClick={onViewAnalytics}>
              <BarChart3 className="w-4 h-4 mr-2" />
              View Analytics
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Knowledge Areas */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-success" />
              Strong Areas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {stats.strongAreas.map((area, index) => (
                <Badge key={index} variant="secondary" className="bg-success/10 text-success">
                  <Star className="w-3 h-3 mr-1" />
                  {area}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="w-5 h-5 mr-2 text-warning" />
              Areas to Improve
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {stats.weakAreas.map((area, index) => (
                <Badge key={index} variant="secondary" className="bg-warning/10 text-warning">
                  {area}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Exam Results */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Exam Results</CardTitle>
          <CardDescription>Your latest mock exam performances</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.recentResults.map((result, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {result.passed ? (
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  ) : (
                    <XCircle className="w-5 h-5 text-destructive" />
                  )}
                  <span className="text-sm">{result.date}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={result.passed ? "default" : "destructive"}>
                    {result.score}%
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {result.passed ? "Passed" : "Failed"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}