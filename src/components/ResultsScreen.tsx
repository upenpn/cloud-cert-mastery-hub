import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Trophy, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  BarChart3,
  BookOpen,
  Home,
  RotateCcw,
  Download
} from "lucide-react";

interface ResultsScreenProps {
  results: {
    totalQuestions: number;
    correctAnswers: number;
    incorrectAnswers: number;
    unanswered: number;
    score: number;
    passed: boolean;
    timeSpent: number;
    answers: { [key: number]: number };
    questions: any[];
  };
  mode: 'practice' | 'exam';
  onRetake: () => void;
  onBackToDashboard: () => void;
  onReview: () => void;
}

export default function ResultsScreen({ 
  results, 
  mode, 
  onRetake, 
  onBackToDashboard, 
  onReview 
}: ResultsScreenProps) {
  const [activeTab, setActiveTab] = useState("overview");
  
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 70) return "text-warning";
    return "text-destructive";
  };

  const getPerformanceByService = () => {
    const serviceStats: { [key: string]: { correct: number; total: number } } = {};
    
    Object.entries(results.answers).forEach(([questionIndex, answer]) => {
      const question = results.questions[parseInt(questionIndex)];
      const service = question.service;
      
      if (!serviceStats[service]) {
        serviceStats[service] = { correct: 0, total: 0 };
      }
      
      serviceStats[service].total++;
      if (answer === question.correctAnswer) {
        serviceStats[service].correct++;
      }
    });

    return Object.entries(serviceStats).map(([service, stats]) => ({
      service,
      percentage: Math.round((stats.correct / stats.total) * 100),
      correct: stats.correct,
      total: stats.total
    })).sort((a, b) => b.percentage - a.percentage);
  };

  const servicePerformance = getPerformanceByService();

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          {results.passed ? (
            <div className="w-20 h-20 bg-gradient-success rounded-full flex items-center justify-center shadow-glow">
              <Trophy className="w-10 h-10 text-success-foreground" />
            </div>
          ) : (
            <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-10 h-10 text-destructive" />
            </div>
          )}
        </div>
        
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {results.passed ? 'Congratulations!' : 'Keep Learning!'}
          </h1>
          <p className="text-muted-foreground">
            {mode === 'exam' ? 'Exam' : 'Practice'} completed - Here are your results
          </p>
        </div>
      </div>

      {/* Score Overview */}
      <Card className="shadow-elegant">
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <div className={`text-4xl font-bold ${getScoreColor(results.score)}`}>
                {results.score}%
              </div>
              <p className="text-sm text-muted-foreground mt-1">Overall Score</p>
              <Badge 
                variant={results.passed ? "default" : "destructive"} 
                className="mt-2"
              >
                {results.passed ? 'PASSED' : 'FAILED'}
              </Badge>
            </div>
            
            <div>
              <div className="text-4xl font-bold text-success">
                {results.correctAnswers}
              </div>
              <p className="text-sm text-muted-foreground mt-1">Correct</p>
              <div className="flex items-center justify-center mt-2">
                <CheckCircle2 className="w-4 h-4 text-success" />
              </div>
            </div>
            
            <div>
              <div className="text-4xl font-bold text-destructive">
                {results.incorrectAnswers}
              </div>
              <p className="text-sm text-muted-foreground mt-1">Incorrect</p>
              <div className="flex items-center justify-center mt-2">
                <XCircle className="w-4 h-4 text-destructive" />
              </div>
            </div>
            
            <div>
              <div className="text-4xl font-bold text-muted-foreground">
                {results.unanswered}
              </div>
              <p className="text-sm text-muted-foreground mt-1">Unanswered</p>
              <div className="flex items-center justify-center mt-2">
                <AlertTriangle className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analysis */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="review">Review</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Score Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Correct Answers</span>
                    <span className="font-medium">{Math.round((results.correctAnswers / results.totalQuestions) * 100)}%</span>
                  </div>
                  <Progress value={(results.correctAnswers / results.totalQuestions) * 100} className="h-2" />
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Pass Threshold</span>
                    <span className="font-medium">70%</span>
                  </div>
                  <Progress value={70} className="h-2 opacity-50" />
                </div>
                
                {mode === 'exam' && (
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        Time Spent
                      </span>
                      <span className="font-medium">{formatTime(results.timeSpent)}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {results.passed ? (
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <Trophy className="w-5 h-5 text-success mt-1" />
                      <div>
                        <p className="font-medium text-success">Excellent Performance!</p>
                        <p className="text-sm text-muted-foreground">
                          You're ready for the certification exam.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <TrendingUp className="w-5 h-5 text-accent mt-1" />
                      <div>
                        <p className="font-medium">Continue practicing</p>
                        <p className="text-sm text-muted-foreground">
                          Focus on areas with lower scores to achieve mastery.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <BookOpen className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <p className="font-medium">More Practice Needed</p>
                        <p className="text-sm text-muted-foreground">
                          Focus on weak areas and retake practice tests.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <TrendingUp className="w-5 h-5 text-accent mt-1" />
                      <div>
                        <p className="font-medium">Study Plan</p>
                        <p className="text-sm text-muted-foreground">
                          Review explanations and practice more questions.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance by AWS Service</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {servicePerformance.map((service, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{service.service}</span>
                      <span className={`font-medium ${getScoreColor(service.percentage)}`}>
                        {service.percentage}% ({service.correct}/{service.total})
                      </span>
                    </div>
                    <Progress value={service.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="review" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Question Review</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Review all questions to understand correct answers and explanations.
              </p>
              <Button onClick={onReview} className="w-full">
                <BookOpen className="w-4 h-4 mr-2" />
                Start Question Review
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-center gap-4">
        <Button variant="outline" onClick={onBackToDashboard}>
          <Home className="w-4 h-4 mr-2" />
          Dashboard
        </Button>
        
        <Button onClick={onRetake}>
          <RotateCcw className="w-4 h-4 mr-2" />
          {mode === 'exam' ? 'Retake Exam' : 'Practice Again'}
        </Button>
        
        <Button variant="accent" onClick={onReview}>
          <BookOpen className="w-4 h-4 mr-2" />
          Review Questions
        </Button>
        
        <Button variant="secondary">
          <Download className="w-4 h-4 mr-2" />
          Export Results
        </Button>
      </div>
    </div>
  );
}