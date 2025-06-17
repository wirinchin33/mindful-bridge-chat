
import { useState } from "react";
import { ArrowLeft, MessageSquare, Brain, Target, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

const Practice = () => {
  const { toast } = useToast();
  const [practiceMessage, setPracticeMessage] = useState("");
  const [currentScenario, setCurrentScenario] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [practiceStats, setPracticeStats] = useState({
    clarity: 85,
    empathy: 78,
    tone: 92,
    sessionsCompleted: 12
  });

  const practiceScenarios = [
    {
      title: "Expressing Frustration Constructively",
      description: "Practice expressing frustration about a work situation without being aggressive",
      context: "Your colleague missed an important deadline that affects your project. Write a message to address this professionally.",
      aiPrompt: "Focus on using 'I' statements and expressing the impact rather than attacking the person."
    },
    {
      title: "Setting Boundaries Kindly",
      description: "Learn to set boundaries while maintaining relationships",
      context: "A friend keeps asking you to work extra hours when you need personal time. How would you communicate your boundaries?",
      aiPrompt: "Practice being firm but understanding, and offer alternatives when possible."
    },
    {
      title: "Asking for Help",
      description: "Practice reaching out for support when you need it",
      context: "You're feeling overwhelmed with your mental health and need to ask a friend for support. Write that message.",
      aiPrompt: "Focus on being honest about your needs while being specific about what kind of help you're looking for."
    },
    {
      title: "Giving Constructive Feedback",
      description: "Learn to provide feedback that helps rather than hurts",
      context: "A teammate's work quality has declined, and you need to address it supportively.",
      aiPrompt: "Focus on specific behaviors and their impact, and offer support for improvement."
    }
  ];

  const analyzeMessage = (message) => {
    // Simulate AI analysis
    const hasIStatements = message.toLowerCase().includes('i feel') || message.toLowerCase().includes('i think');
    const isConstructive = !message.toLowerCase().includes('you always') && !message.toLowerCase().includes('you never');
    const showsEmpathy = message.toLowerCase().includes('understand') || message.toLowerCase().includes('appreciate');
    
    const scores = {
      clarity: Math.random() * 30 + 70, // 70-100
      empathy: showsEmpathy ? Math.random() * 20 + 80 : Math.random() * 40 + 50,
      tone: isConstructive ? Math.random() * 20 + 80 : Math.random() * 40 + 50,
      structure: hasIStatements ? Math.random() * 20 + 80 : Math.random() * 40 + 60
    };

    const suggestions = [];
    if (scores.empathy < 70) suggestions.push("Try acknowledging the other person's perspective");
    if (scores.tone < 70) suggestions.push("Consider using more positive language");
    if (scores.structure < 70) suggestions.push("Use 'I' statements to express your feelings");
    if (!isConstructive) suggestions.push("Focus on specific behaviors rather than character");

    return { scores, suggestions };
  };

  const handleAnalyze = () => {
    if (!practiceMessage.trim()) {
      toast({
        title: "Please write a message",
        description: "Enter a message to receive AI feedback and suggestions.",
        variant: "destructive"
      });
      return;
    }

    const analysis = analyzeMessage(practiceMessage);
    setFeedback(analysis);
    
    // Update practice stats
    setPracticeStats(prev => ({
      ...prev,
      clarity: (prev.clarity + analysis.scores.clarity) / 2,
      empathy: (prev.empathy + analysis.scores.empathy) / 2,
      tone: (prev.tone + analysis.scores.tone) / 2,
      sessionsCompleted: prev.sessionsCompleted + 1
    }));

    toast({
      title: "Analysis Complete",
      description: "Review your feedback and suggestions below.",
    });
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBg = (score) => {
    if (score >= 80) return "bg-green-100";
    if (score >= 60) return "bg-yellow-100";
    return "bg-red-100";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-teal-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-slate-600 hover:text-teal-600 transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <h1 className="text-2xl font-bold text-slate-800">Communication Practice</h1>
            </div>
            <div className="text-sm text-slate-600">
              Session #{practiceStats.sessionsCompleted + 1}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Progress & Stats */}
          <div className="space-y-6">
            {/* Progress Stats */}
            <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-teal-600" />
                  Your Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Clarity</span>
                    <span className={`text-sm font-bold ${getScoreColor(practiceStats.clarity)}`}>
                      {Math.round(practiceStats.clarity)}%
                    </span>
                  </div>
                  <Progress value={practiceStats.clarity} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Empathy</span>
                    <span className={`text-sm font-bold ${getScoreColor(practiceStats.empathy)}`}>
                      {Math.round(practiceStats.empathy)}%
                    </span>
                  </div>
                  <Progress value={practiceStats.empathy} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Tone</span>
                    <span className={`text-sm font-bold ${getScoreColor(practiceStats.tone)}`}>
                      {Math.round(practiceStats.tone)}%
                    </span>
                  </div>
                  <Progress value={practiceStats.tone} className="h-2" />
                </div>
                <div className="pt-2 border-t">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-teal-600">{practiceStats.sessionsCompleted}</div>
                    <div className="text-sm text-slate-600">Sessions Completed</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Scenario Selection */}
            <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Target className="w-5 h-5 mr-2 text-teal-600" />
                  Practice Scenarios
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {practiceScenarios.map((scenario, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentScenario(index)}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                      index === currentScenario
                        ? 'bg-teal-100 border-2 border-teal-300'
                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                    }`}
                  >
                    <div className="font-medium text-sm">{scenario.title}</div>
                    <div className="text-xs text-slate-600 mt-1">{scenario.description}</div>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Center Column - Practice Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Scenario */}
            <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <MessageSquare className="w-6 h-6 mr-2 text-teal-600" />
                  {practiceScenarios[currentScenario].title}
                </CardTitle>
                <CardDescription className="text-base">
                  {practiceScenarios[currentScenario].description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg mb-6">
                  <h4 className="font-medium text-slate-800 mb-2">Scenario:</h4>
                  <p className="text-slate-700">{practiceScenarios[currentScenario].context}</p>
                  <div className="mt-3 p-3 bg-white/60 rounded border-l-4 border-teal-400">
                    <p className="text-sm text-slate-600">
                      <Brain className="w-4 h-4 inline mr-1" />
                      AI Tip: {practiceScenarios[currentScenario].aiPrompt}
                    </p>
                  </div>
                </div>

                {/* Message Input */}
                <div className="space-y-4">
                  <Textarea
                    value={practiceMessage}
                    onChange={(e) => setPracticeMessage(e.target.value)}
                    placeholder="Write your response here..."
                    className="min-h-[120px] text-base"
                  />
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-slate-600">
                      {practiceMessage.length} characters
                    </div>
                    <Button
                      onClick={handleAnalyze}
                      className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700"
                    >
                      <Brain className="w-4 h-4 mr-2" />
                      Analyze Message
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feedback */}
            {feedback && (
              <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl text-slate-800">AI Feedback & Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Scores */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(feedback.scores).map(([key, score]) => (
                      <div key={key} className={`text-center p-3 rounded-lg ${getScoreBg(score)}`}>
                        <div className={`text-2xl font-bold ${getScoreColor(score)}`}>
                          {Math.round(score)}
                        </div>
                        <div className="text-sm capitalize font-medium text-slate-700">
                          {key}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Suggestions */}
                  {feedback.suggestions.length > 0 && (
                    <div>
                      <h4 className="font-medium text-slate-800 mb-3">Suggestions for Improvement:</h4>
                      <div className="space-y-2">
                        {feedback.suggestions.map((suggestion, index) => (
                          <div key={index} className="flex items-start space-x-2 p-3 bg-blue-50 rounded-lg">
                            <Badge variant="secondary" className="mt-0.5 bg-blue-100 text-blue-800">
                              {index + 1}
                            </Badge>
                            <p className="text-slate-700">{suggestion}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setPracticeMessage("");
                        setFeedback(null);
                      }}
                    >
                      Try Again
                    </Button>
                    <Button
                      onClick={() => {
                        setCurrentScenario((prev) => (prev + 1) % practiceScenarios.length);
                        setPracticeMessage("");
                        setFeedback(null);
                      }}
                      className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700"
                    >
                      Next Scenario
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Practice;
