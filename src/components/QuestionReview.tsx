import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ArrowLeft, 
  ArrowRight, 
  Home,
  Filter,
  Lightbulb
} from "lucide-react";

interface QuestionReviewProps {
  results: {
    answers: { [key: number]: number };
    questions: any[];
  };
  onBack: () => void;
}

export default function QuestionReview({ results, onBack }: QuestionReviewProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [filter, setFilter] = useState<'all' | 'correct' | 'incorrect' | 'unanswered'>('all');
  
  const getFilteredQuestions = () => {
    return results.questions.map((question, index) => {
      const userAnswer = results.answers[index];
      const isCorrect = userAnswer === question.correctAnswer;
      const isUnanswered = userAnswer === undefined;
      
      return {
        ...question,
        index,
        userAnswer,
        isCorrect,
        isUnanswered
      };
    }).filter(question => {
      switch (filter) {
        case 'correct':
          return question.isCorrect;
        case 'incorrect':
          return !question.isCorrect && !question.isUnanswered;
        case 'unanswered':
          return question.isUnanswered;
        default:
          return true;
      }
    });
  };

  const filteredQuestions = getFilteredQuestions();
  const question = filteredQuestions[currentQuestion];

  if (!question) {
    return (
      <div className="max-w-4xl mx-auto text-center space-y-4">
        <p className="text-muted-foreground">No questions match the current filter.</p>
        <Button onClick={() => setFilter('all')}>Show All Questions</Button>
      </div>
    );
  }

  const handleNext = () => {
    if (currentQuestion < filteredQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const getStatusIcon = () => {
    if (question.isUnanswered) {
      return <AlertTriangle className="w-5 h-5 text-warning" />;
    }
    return question.isCorrect ? 
      <CheckCircle2 className="w-5 h-5 text-success" /> : 
      <XCircle className="w-5 h-5 text-destructive" />;
  };

  const getStatusText = () => {
    if (question.isUnanswered) return "Unanswered";
    return question.isCorrect ? "Correct" : "Incorrect";
  };

  const getStatusBadge = () => {
    if (question.isUnanswered) return "secondary";
    return question.isCorrect ? "default" : "destructive";
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack}>
            <Home className="w-4 h-4 mr-2" />
            Back to Results
          </Button>
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <Badge variant={getStatusBadge() as any}>
              {getStatusText()}
            </Badge>
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground">
          Question {currentQuestion + 1} of {filteredQuestions.length}
        </div>
      </div>

      {/* Filter Tabs */}
      <Tabs value={filter} onValueChange={(value) => {
        setFilter(value as any);
        setCurrentQuestion(0);
      }}>
        <TabsList>
          <TabsTrigger value="all">All ({results.questions.length})</TabsTrigger>
          <TabsTrigger value="correct">
            Correct ({results.questions.filter((_, i) => results.answers[i] === results.questions[i].correctAnswer).length})
          </TabsTrigger>
          <TabsTrigger value="incorrect">
            Incorrect ({results.questions.filter((_, i) => results.answers[i] !== undefined && results.answers[i] !== results.questions[i].correctAnswer).length})
          </TabsTrigger>
          <TabsTrigger value="unanswered">
            Unanswered ({results.questions.filter((_, i) => results.answers[i] === undefined).length})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Question Card */}
      <Card className="shadow-elegant">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-lg">
                Question {question.index + 1}
              </CardTitle>
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
            <div className="flex items-center space-x-2">
              {getStatusIcon()}
              <Badge variant={getStatusBadge() as any}>
                {getStatusText()}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-base leading-relaxed">
            {question.question}
          </div>
          
          <div className="space-y-3">
            {question.options.map((option: string, index: number) => {
              const isUserAnswer = question.userAnswer === index;
              const isCorrectAnswer = index === question.correctAnswer;
              
              let variant = 'outline';
              let icon = null;
              let className = '';
              
              if (isCorrectAnswer) {
                variant = 'default';
                icon = <CheckCircle2 className="w-4 h-4 text-success" />;
                className = 'border-success bg-success/5';
              } else if (isUserAnswer && !isCorrectAnswer) {
                variant = 'destructive';
                icon = <XCircle className="w-4 h-4 text-destructive" />;
                className = 'border-destructive bg-destructive/5';
              } else if (isUserAnswer) {
                variant = 'default';
              }

              return (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${className} transition-colors`}
                >
                  <div className="flex items-start space-x-3">
                    <span className="font-semibold">{String.fromCharCode(65 + index)}.</span>
                    <div className="flex-1">{option}</div>
                    {icon}
                  </div>
                  
                  {/* Show if this was user's answer */}
                  {isUserAnswer && (
                    <div className="mt-2 ml-6">
                      <Badge variant="secondary" className="text-xs">
                        Your Answer
                      </Badge>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Explanation */}
          <div className="border-t pt-6">
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-full bg-accent/10">
                <Lightbulb className="w-5 h-5 text-accent" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold mb-2">Explanation</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {question.explanation}
                </p>
                
                {/* Additional info for incorrect answers */}
                {!question.isCorrect && !question.isUnanswered && (
                  <div className="mt-4 p-3 bg-accent/5 rounded-lg border border-accent/20">
                    <p className="text-xs font-medium text-accent mb-1">
                      Correct Answer: {String.fromCharCode(65 + question.correctAnswer)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {question.options[question.correctAnswer]}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
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
        
        <Button 
          onClick={handleNext}
          disabled={currentQuestion === filteredQuestions.length - 1}
        >
          Next
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}