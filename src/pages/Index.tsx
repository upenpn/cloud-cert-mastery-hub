import { useState } from "react";
import Layout from "@/components/Layout";
import AuthCard from "@/components/AuthCard";
import Dashboard from "@/components/Dashboard";
import QuizInterface from "@/components/QuizInterface";
import ResultsScreen from "@/components/ResultsScreen";
import QuestionReview from "@/components/QuestionReview";
import AdminCMS from "@/pages/AdminCMS";
import { useToast } from "@/hooks/use-toast";
import heroImage from "@/assets/hero-image.jpg";

type AppState = 'auth' | 'dashboard' | 'practice' | 'exam' | 'results' | 'review' | 'cms';

const Index = () => {
  const [appState, setAppState] = useState<AppState>('auth');
  const [user, setUser] = useState<any>(null);
  const [quizMode, setQuizMode] = useState<'practice' | 'exam'>('practice');
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  const handleLogin = (email: string, password: string) => {
    // Mock authentication - in real app, would connect to Supabase
    const mockUser = { 
      email, 
      name: email.split('@')[0],
      id: '1'
    };
    setUser(mockUser);
    setAppState('dashboard');
    toast({
      title: "Welcome back!",
      description: "Successfully signed in to AWS CertPrep Pro",
    });
  };

  const handleSignup = (email: string, password: string, name: string) => {
    // Mock signup - in real app, would connect to Supabase
    const mockUser = { email, name, id: '1' };
    setUser(mockUser);
    setAppState('dashboard');
    toast({
      title: "Account created!",
      description: "Welcome to AWS CertPrep Pro",
    });
  };

  const handleLogout = () => {
    setUser(null);
    setAppState('auth');
    toast({
      title: "Signed out",
      description: "Come back soon!",
    });
  };

  const handleStartPractice = () => {
    setQuizMode('practice');
    setAppState('practice');
  };

  const handleStartExam = () => {
    setQuizMode('exam');
    setAppState('exam');
  };

  const handleQuizComplete = (quizResults: any) => {
    setResults(quizResults);
    setAppState('results');
  };

  const handleRetake = () => {
    setAppState(quizMode);
  };

  const handleReviewQuestions = () => {
    setAppState('review');
  };

  const handleBackToDashboard = () => {
    setAppState('dashboard');
  };

  const handleViewAnalytics = () => {
    toast({
      title: "Analytics Coming Soon",
      description: "Detailed analytics will be available soon!",
    });
  };

  const handleOpenCMS = () => {
    setAppState('cms');
  };

  // Auth screen with hero section
  if (appState === 'auth') {
    return (
      <div className="min-h-screen">
        {/* Hero Section */}
        <div 
          className="relative h-screen bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 to-background/70" />
          <div className="relative z-10 h-full flex items-center">
            <div className="container mx-auto px-4">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-8 animate-fade-in">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
                        <span className="text-primary-foreground font-bold text-lg">AWS</span>
                      </div>
                      <h1 className="text-4xl lg:text-6xl font-bold text-foreground">
                        CertPrep Pro
                      </h1>
                    </div>
                    <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed">
                      Master AWS certifications with our comprehensive exam preparation platform
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-foreground">1000+ realistic practice questions</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-accent rounded-full"></div>
                      <span className="text-foreground">Detailed explanations for every answer</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <span className="text-foreground">Real exam simulation with timing</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-warning rounded-full"></div>
                      <span className="text-foreground">Performance analytics and progress tracking</span>
                    </div>
                  </div>
                </div>
                
                <div className="animate-scale-in">
                  <AuthCard onLogin={handleLogin} onSignup={handleSignup} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Layout user={user} onLogout={handleLogout}>
      {appState === 'dashboard' && (
        <Dashboard
          user={user}
          onStartPractice={handleStartPractice}
          onStartExam={handleStartExam}
          onViewAnalytics={handleViewAnalytics}
          onOpenCMS={handleOpenCMS}
        />
      )}

      {appState === 'cms' && (
        <AdminCMS onBack={handleBackToDashboard} />
      )}
      
      {(appState === 'practice' || appState === 'exam') && (
        <QuizInterface
          mode={quizMode}
          onComplete={handleQuizComplete}
          onBack={handleBackToDashboard}
        />
      )}
      
      {appState === 'results' && results && (
        <ResultsScreen
          results={results}
          mode={quizMode}
          onRetake={handleRetake}
          onBackToDashboard={handleBackToDashboard}
          onReview={handleReviewQuestions}
        />
      )}
      
      {appState === 'review' && results && (
        <QuestionReview
          results={results}
          onBack={() => setAppState('results')}
        />
      )}
    </Layout>
  );
};

export default Index;
