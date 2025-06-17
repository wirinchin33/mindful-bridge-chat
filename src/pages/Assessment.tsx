
import { useState } from "react";
import { ArrowLeft, ChevronRight, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

const Assessment = () => {
  const { toast } = useToast();
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState({});
  const [completedSections, setCompletedSections] = useState([]);

  const assessmentSections = [
    {
      title: "Mental Health (PHQ-9 Sample)",
      description: "Questions about your mood and feelings",
      questions: [
        {
          id: "phq1",
          question: "Over the last 2 weeks, how often have you been bothered by little interest or pleasure in doing things?",
          options: [
            { value: "0", label: "Not at all" },
            { value: "1", label: "Several days" },
            { value: "2", label: "More than half the days" },
            { value: "3", label: "Nearly every day" }
          ]
        },
        {
          id: "phq2",
          question: "Over the last 2 weeks, how often have you been bothered by feeling down, depressed, or hopeless?",
          options: [
            { value: "0", label: "Not at all" },
            { value: "1", label: "Several days" },
            { value: "2", label: "More than half the days" },
            { value: "3", label: "Nearly every day" }
          ]
        }
      ]
    },
    {
      title: "Anxiety Assessment (GAD-7 Sample)",
      description: "Questions about anxiety and worry",
      questions: [
        {
          id: "gad1",
          question: "Over the last 2 weeks, how often have you been bothered by feeling nervous, anxious, or on edge?",
          options: [
            { value: "0", label: "Not at all" },
            { value: "1", label: "Several days" },
            { value: "2", label: "More than half the days" },
            { value: "3", label: "Nearly every day" }
          ]
        },
        {
          id: "gad2",
          question: "Over the last 2 weeks, how often have you been bothered by not being able to stop or control worrying?",
          options: [
            { value: "0", label: "Not at all" },
            { value: "1", label: "Several days" },
            { value: "2", label: "More than half the days" },
            { value: "3", label: "Nearly every day" }
          ]
        }
      ]
    },
    {
      title: "Communication Style",
      description: "Understanding your communication preferences",
      questions: [
        {
          id: "comm1",
          question: "When discussing difficult topics, you prefer:",
          options: [
            { value: "direct", label: "Direct, straightforward communication" },
            { value: "gentle", label: "Gentle, gradual approach" },
            { value: "structured", label: "Structured, organized discussion" },
            { value: "supportive", label: "Supportive, empathetic tone" }
          ]
        },
        {
          id: "comm2",
          question: "When you're feeling overwhelmed, you prefer others to:",
          options: [
            { value: "space", label: "Give you space and time" },
            { value: "check", label: "Check in regularly but briefly" },
            { value: "listen", label: "Listen without offering solutions" },
            { value: "problem-solve", label: "Help problem-solve together" }
          ]
        }
      ]
    }
  ];

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNextSection = () => {
    const currentQuestions = assessmentSections[currentSection].questions;
    const allAnswered = currentQuestions.every(q => answers[q.id]);
    
    if (!allAnswered) {
      toast({
        title: "Please complete all questions",
        description: "Answer all questions in this section before proceeding.",
        variant: "destructive"
      });
      return;
    }

    if (!completedSections.includes(currentSection)) {
      setCompletedSections(prev => [...prev, currentSection]);
    }

    if (currentSection < assessmentSections.length - 1) {
      setCurrentSection(currentSection + 1);
    } else {
      // Assessment complete
      toast({
        title: "Assessment Complete!",
        description: "Your responses will help personalize your MindBridge experience.",
      });
    }
  };

  const progressPercentage = ((currentSection + 1) / assessmentSections.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-slate-600 hover:text-purple-600 transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <h1 className="text-2xl font-bold text-slate-800">Wellness Assessment</h1>
            </div>
            <div className="text-sm text-slate-600">
              Section {currentSection + 1} of {assessmentSections.length}
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

        {/* Section Navigation */}
        <div className="flex space-x-2 mb-8 overflow-x-auto pb-2">
          {assessmentSections.map((section, index) => (
            <div
              key={index}
              className={`flex items-center space-x-2 px-3 py-2 rounded-full text-sm whitespace-nowrap ${
                index === currentSection
                  ? 'bg-purple-100 text-purple-800'
                  : completedSections.includes(index)
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {completedSections.includes(index) && (
                <CheckCircle className="w-4 h-4" />
              )}
              <span>{section.title}</span>
            </div>
          ))}
        </div>

        {/* Current Section */}
        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-slate-800">
              {assessmentSections[currentSection].title}
            </CardTitle>
            <CardDescription className="text-lg">
              {assessmentSections[currentSection].description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {assessmentSections[currentSection].questions.map((question, qIndex) => (
              <div key={question.id} className="space-y-4">
                <h3 className="text-lg font-medium text-slate-800">
                  {qIndex + 1}. {question.question}
                </h3>
                <RadioGroup
                  value={answers[question.id] || ""}
                  onValueChange={(value) => handleAnswerChange(question.id, value)}
                  className="space-y-3"
                >
                  {question.options.map((option) => (
                    <div key={option.value} className="flex items-center space-x-3">
                      <RadioGroupItem value={option.value} id={`${question.id}-${option.value}`} />
                      <Label
                        htmlFor={`${question.id}-${option.value}`}
                        className="flex-1 cursor-pointer text-slate-700 hover:text-slate-900"
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ))}

            <div className="flex justify-end pt-6">
              <Button
                onClick={handleNextSection}
                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
              >
                {currentSection === assessmentSections.length - 1 ? "Complete Assessment" : "Next Section"}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Assessment Info */}
        <Card className="mt-6 border-0 bg-gradient-to-r from-purple-50 to-blue-50">
          <CardContent className="p-6">
            <h3 className="font-semibold text-slate-800 mb-2">About This Assessment</h3>
            <p className="text-slate-600 text-sm">
              This assessment helps MindBridge understand your mental health needs and communication preferences. 
              Your responses are private and used only to personalize your experience. If you're experiencing 
              mental health concerns, please consider speaking with a healthcare professional.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Assessment;
