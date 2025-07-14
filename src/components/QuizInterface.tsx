import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  ArrowLeft, 
  Home,
  BookOpen,
  AlertCircle,
  Lightbulb
} from "lucide-react";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  service: string;
  domain: string;
  difficulty: 'Simple' | 'Medium' | 'Hard';
  image?: string;
}

interface QuizInterfaceProps {
  mode: 'practice' | 'exam';
  onComplete: (results: any) => void;
  onBack: () => void;
}

export default function QuizInterface({ mode, onComplete, onBack }: QuizInterfaceProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(mode === 'exam' ? 5400 : 0); // 90 minutes for exam
  const [questions] = useState<Question[]>(generateMockQuestions());

  useEffect(() => {
    if (mode === 'exam' && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeRemaining, mode]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setAnswers(prev => ({ ...prev, [currentQuestion]: answerIndex }));
    
    if (mode === 'practice') {
      setShowExplanation(true);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(answers[currentQuestion + 1] || null);
      setShowExplanation(false);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      setSelectedAnswer(answers[currentQuestion - 1] || null);
      setShowExplanation(mode === 'practice' && answers[currentQuestion - 1] !== undefined);
    }
  };

  const handleSubmit = () => {
    const correctAnswers = Object.entries(answers).filter(
      ([questionIndex, answer]) => questions[parseInt(questionIndex)].correctAnswer === answer
    ).length;
    
    const results = {
      totalQuestions: questions.length,
      correctAnswers,
      incorrectAnswers: Object.keys(answers).length - correctAnswers,
      unanswered: questions.length - Object.keys(answers).length,
      score: Math.round((correctAnswers / questions.length) * 100),
      passed: (correctAnswers / questions.length) >= 0.7,
      timeSpent: mode === 'exam' ? 5400 - timeRemaining : 0,
      answers,
      questions
    };
    
    onComplete(results);
  };

  const question = questions[currentQuestion];
  const isAnswered = selectedAnswer !== null;
  const isCorrect = isAnswered && selectedAnswer === question.correctAnswer;

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack}>
            <Home className="w-4 h-4 mr-2" />
            Dashboard
          </Button>
          <Badge variant={mode === 'exam' ? 'destructive' : 'default'}>
            {mode === 'exam' ? 'Exam Mode' : 'Practice Mode'}
          </Badge>
        </div>
        
        {mode === 'exam' && (
          <div className="flex items-center space-x-2 text-sm">
            <Clock className="w-4 h-4" />
            <span className="font-mono">{formatTime(timeRemaining)}</span>
          </div>
        )}
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Question {currentQuestion + 1} of {questions.length}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question Card */}
      <Card className="shadow-elegant">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-lg">Question {currentQuestion + 1}</CardTitle>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{question.service}</Badge>
                <Badge variant="outline">{question.domain}</Badge>
                <Badge variant={
                  question.difficulty === 'Simple' ? 'default' : 
                  question.difficulty === 'Medium' ? 'secondary' : 'destructive'
                }>
                  {question.difficulty}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-base leading-relaxed">
            {question.question}
          </div>
          
          {question.image && (
            <div className="bg-muted rounded-lg p-4 text-center">
              <div className="text-muted-foreground text-sm">
                [Architecture Diagram would be displayed here]
              </div>
            </div>
          )}

          <div className="space-y-3">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrectOption = index === question.correctAnswer;
              const showCorrectness = mode === 'practice' && showExplanation;
              
              let variant = 'outline';
              let icon = null;
              
              if (showCorrectness) {
                if (isCorrectOption) {
                  variant = 'default';
                  icon = <CheckCircle2 className="w-4 h-4 text-success" />;
                } else if (isSelected && !isCorrectOption) {
                  variant = 'destructive';
                  icon = <XCircle className="w-4 h-4 text-destructive" />;
                }
              } else if (isSelected) {
                variant = 'default';
              }

              return (
                <Button
                  key={index}
                  variant={variant as any}
                  className="w-full justify-start h-auto p-4 text-left"
                  onClick={() => handleAnswerSelect(index)}
                  disabled={mode === 'practice' && showExplanation}
                >
                  <div className="flex items-start space-x-3">
                    <span className="font-semibold">{String.fromCharCode(65 + index)}.</span>
                    <div className="flex-1">{option}</div>
                    {icon}
                  </div>
                </Button>
              );
            })}
          </div>

          {/* Explanation for Practice Mode */}
          {mode === 'practice' && showExplanation && (
            <div className="border-t pt-6">
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-full ${isCorrect ? 'bg-success/10' : 'bg-destructive/10'}`}>
                  {isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  ) : (
                    <XCircle className="w-5 h-5 text-destructive" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-2 flex items-center">
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Explanation
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {question.explanation}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        
        <div className="flex space-x-2">
          {mode === 'exam' && (
            <Button variant="destructive" onClick={handleSubmit}>
              Submit Exam
            </Button>
          )}
          
          <Button 
            onClick={handleNext}
            disabled={mode === 'practice' && !showExplanation && selectedAnswer === null}
          >
            {currentQuestion === questions.length - 1 ? 'Finish' : 'Next'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Mock question generator
function generateMockQuestions(): Question[] {
  const services = ['EC2', 'S3', 'Lambda', 'RDS', 'VPC', 'IAM', 'CloudFormation', 'API Gateway'];
  const domains = ['Security', 'Networking', 'Storage', 'Compute', 'Database', 'Management'];
  const difficulties: ('Simple' | 'Medium' | 'Hard')[] = ['Simple', 'Medium', 'Hard'];
  
  const questions: Question[] = [];
  
  for (let i = 0; i < 65; i++) {
    const service = services[Math.floor(Math.random() * services.length)];
    const domain = domains[Math.floor(Math.random() * domains.length)];
    const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
    
    questions.push({
      id: i + 1,
      question: `Which ${service} feature would be most appropriate for implementing ${domain.toLowerCase()} in a ${difficulty.toLowerCase()} scenario? Consider scalability, cost-effectiveness, and security requirements when designing your solution architecture.`,
      options: [
        `Option A: Use ${service} with basic configuration and default security groups`,
        `Option B: Implement ${service} with advanced monitoring and custom VPC settings`,
        `Option C: Deploy ${service} using Infrastructure as Code with CloudFormation templates`,
        `Option D: Configure ${service} with multi-AZ deployment and automated backup strategies`
      ],
      correctAnswer: Math.floor(Math.random() * 4),
      explanation: `The correct answer considers ${domain.toLowerCase()} best practices for ${service}. This approach ensures optimal performance, security, and cost management in accordance with AWS Well-Architected Framework principles. The solution provides scalability, reliability, and maintainability while following AWS security guidelines.`,
      service,
      domain,
      difficulty
    });
  }
  
  return questions;
}