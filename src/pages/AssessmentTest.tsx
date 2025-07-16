import { useState, useEffect } from "react";
import { ArrowLeft, ChevronRight, RotateCcw } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { assessmentTests, type AssessmentTest } from "@/data/assessmentTests";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const AssessmentTest = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isComplete, setIsComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [saving, setSaving] = useState(false);

  const test: AssessmentTest | undefined = assessmentTests.find(t => t.id === testId);

  useEffect(() => {
    if (!test) {
      navigate("/assessment");
      return;
    }
  }, [test, navigate]);

  if (!test) return null;

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNext = () => {
    const currentQuestionId = test.questions[currentQuestion].id;
    
    if (!answers[currentQuestionId]) {
      toast({
        title: "Please select an answer",
        description: "Choose an option before proceeding.",
        variant: "destructive"
      });
      return;
    }

    if (currentQuestion < test.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      completeAssessment();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const completeAssessment = async () => {
    // Calculate score
    const totalScore = test.questions.reduce((sum, question) => {
      const answer = answers[question.id];
      return sum + (answer ? parseInt(answer) : 0);
    }, 0);

    setScore(totalScore);
    setIsComplete(true);

    // Save to Supabase
    await saveAssessmentResult(totalScore);

    toast({
      title: "Assessment Complete!",
      description: `Your ${test.shortTitle} score has been calculated and saved.`,
    });
  };

  const saveAssessmentResult = async (totalScore: number) => {
    if (!user) return;

    setSaving(true);
    try {
      const maxScore = test.questions.length * (test.id === 'who5' ? 5 : 3);
      const percentage = (totalScore / maxScore) * 100;
      const severity = getScoreSeverity(totalScore);

      const { error } = await supabase
        .from('assessment_results')
        .upsert({
          user_id: user.id,
          test_type: test.id,
          test_name: test.title,
          score: totalScore,
          max_score: maxScore,
          percentage: percentage,
          severity_level: severity?.severity || null,
          completed_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,test_type',
          ignoreDuplicates: false
        });

      if (error) {
        console.error('Error saving assessment result:', error);
        toast({
          title: "Save Error",
          description: "Could not save your results. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error saving assessment result:', error);
    } finally {
      setSaving(false);
    }
  };

  const getScoreSeverity = (score: number) => {
    return test.scoringInfo.ranges.find(range => 
      score >= range.min && score <= range.max
    );
  };

  const restartAssessment = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setIsComplete(false);
    setScore(0);
  };

  const progressPercentage = ((currentQuestion + 1) / test.questions.length) * 100;
  const currentQuestionData = test.questions[currentQuestion];
  const allQuestionsAnswered = test.questions.every(q => answers[q.id]);

  if (isComplete) {
    const severity = getScoreSeverity(score);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center space-x-4">
              <Link to="/assessment" className="text-slate-600 hover:text-purple-600 transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <h1 className="text-2xl font-bold text-slate-800">{test.title} Results</h1>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-3xl">
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl text-slate-800 mb-2">
                Assessment Complete
              </CardTitle>
              <CardDescription className="text-lg">
                Your {test.shortTitle} results
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-6xl font-bold text-purple-600 mb-2">
                  {score}
                </div>
                <div className="text-sm text-slate-600 mb-4">
                  out of {test.questions.length * (test.id === 'who5' ? 5 : 3)} points
                </div>
                {severity && (
                  <div className="space-y-2">
                    <Badge className="text-lg px-4 py-2" variant="secondary">
                      {severity.severity}
                    </Badge>
                    <p className="text-slate-600">
                      {severity.description}
                    </p>
                  </div>
                )}
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold text-slate-800 mb-3">What this means:</h3>
                <p className="text-slate-600 text-sm mb-4">
                  This score is based on your responses to the {test.shortTitle} questionnaire. 
                  It provides a snapshot of your current state and can help guide conversations 
                  with healthcare professionals.
                </p>
                <p className="text-slate-600 text-sm">
                  Remember: This is a screening tool, not a diagnosis. If you have concerns 
                  about your mental health, please consult with a qualified healthcare provider.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={restartAssessment}
                  variant="outline" 
                  className="flex-1"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Retake Assessment
                </Button>
                <Link to="/assessment" className="flex-1">
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700">
                    Back to Assessments
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/assessment" className="text-slate-600 hover:text-purple-600 transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <h1 className="text-2xl font-bold text-slate-800">{test.title}</h1>
            </div>
            <div className="text-sm text-slate-600">
              Question {currentQuestion + 1} of {test.questions.length}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-slate-600">Progress</span>
            <span className="text-sm text-slate-600">{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <Badge variant="secondary">
                {test.shortTitle}
              </Badge>
              <span className="text-sm text-slate-500">
                {currentQuestion + 1}/{test.questions.length}
              </span>
            </div>
            <CardTitle className="text-xl text-slate-800 leading-relaxed">
              {currentQuestionData.question}
            </CardTitle>
            <CardDescription>
              Over the last 2 weeks, how often have you been bothered by:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup
              value={answers[currentQuestionData.id] || ""}
              onValueChange={(value) => handleAnswerChange(currentQuestionData.id, value)}
              className="space-y-4"
            >
              {currentQuestionData.options.map((option) => (
                <div key={option.value} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                  <RadioGroupItem 
                    value={option.value} 
                    id={`${currentQuestionData.id}-${option.value}`} 
                  />
                  <Label
                    htmlFor={`${currentQuestionData.id}-${option.value}`}
                    className="flex-1 cursor-pointer text-slate-700 hover:text-slate-900"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <div className="flex justify-between pt-6">
              <Button
                onClick={handlePrevious}
                variant="outline"
                disabled={currentQuestion === 0}
              >
                Previous
              </Button>
              <Button
                onClick={handleNext}
                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
              >
                {currentQuestion === test.questions.length - 1 ? "Complete Assessment" : "Next Question"}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Assessment Info */}
        <Card className="mt-6 border-0 bg-gradient-to-r from-purple-50 to-blue-50">
          <CardContent className="p-6">
            <h3 className="font-semibold text-slate-800 mb-2">About {test.shortTitle}</h3>
            <p className="text-slate-600 text-sm">
              {test.fullDescription} Your responses are private and help personalize your MindBridge experience.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AssessmentTest;