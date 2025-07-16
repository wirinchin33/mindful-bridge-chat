import { ArrowLeft, Brain, Heart, Zap, ChevronRight, CheckCircle, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { assessmentTests } from "@/data/assessmentTests";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const AssessmentOverview = () => {
  const { user } = useAuth();
  const [completedTests, setCompletedTests] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  const testIcons = {
    phq9: Brain,
    gad7: Zap,
    who5: Heart
  };

  const testColors = {
    phq9: "from-blue-500 to-blue-600",
    gad7: "from-amber-500 to-amber-600", 
    who5: "from-green-500 to-green-600"
  };

  const testBadgeColors = {
    phq9: "bg-blue-100 text-blue-800",
    gad7: "bg-amber-100 text-amber-800",
    who5: "bg-green-100 text-green-800"
  };

  useEffect(() => {
    const fetchCompletedTests = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('assessment_results')
          .select('*')
          .eq('user_id', user.id)
          .order('completed_at', { ascending: false });

        if (error) {
          console.error('Error fetching assessment results:', error);
        } else {
          const resultsMap = data.reduce((acc, result) => {
            if (!acc[result.test_type] || new Date(result.completed_at) > new Date(acc[result.test_type].completed_at)) {
              acc[result.test_type] = result;
            }
            return acc;
          }, {});
          setCompletedTests(resultsMap);
        }
      } catch (error) {
        console.error('Error fetching assessment results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedTests();
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-slate-600 hover:text-purple-600 transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-2xl font-bold text-slate-800">Mental Health Assessments</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Introduction */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">
            Choose Your Assessment
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Select from validated mental health screening tools to better understand your well-being. 
            Each assessment provides insights to help personalize your MindBridge experience.
          </p>
        </div>

        {/* Assessment Cards */}
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
          {assessmentTests.map((test) => {
            const IconComponent = testIcons[test.id as keyof typeof testIcons];
            const gradientClass = testColors[test.id as keyof typeof testColors];
            const badgeClass = testBadgeColors[test.id as keyof typeof testBadgeColors];
            
            return (
              <Card key={test.id} className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/70 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-3 rounded-full bg-gradient-to-r ${gradientClass}`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <Badge className={badgeClass}>
                      {test.questions.length} questions
                    </Badge>
                  </div>
                  <CardTitle className="text-xl text-slate-800">
                    {test.title}
                  </CardTitle>
                  <CardDescription className="text-slate-600">
                    {test.description}
                  </CardDescription>
                </CardHeader>
                 <CardContent className="pt-0">
                   <p className="text-sm text-slate-600 mb-4">
                     {test.fullDescription}
                   </p>
                   
                   {completedTests[test.id] && (
                     <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                       <div className="flex items-center justify-between">
                         <div>
                           <p className="text-sm font-medium text-green-800">
                             Last Score: {completedTests[test.id].score}/{completedTests[test.id].max_score}
                           </p>
                           <p className="text-xs text-green-600">
                             {completedTests[test.id].severity_level}
                           </p>
                         </div>
                         <div className="text-xs text-green-600 flex items-center">
                           <Calendar className="w-3 h-3 mr-1" />
                           {new Date(completedTests[test.id].completed_at).toLocaleDateString()}
                         </div>
                       </div>
                     </div>
                   )}
                   
                   <Link to={`/assessment/${test.id}`}>
                     <Button 
                       className={`w-full bg-gradient-to-r ${gradientClass} hover:opacity-90 transition-opacity group-hover:shadow-md`}
                     >
                       {completedTests[test.id] ? `Retake ${test.shortTitle}` : `Start ${test.shortTitle}`}
                       <ChevronRight className="w-4 h-4 ml-2" />
                     </Button>
                   </Link>
                 </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Information Section */}
        <Card className="mt-10 border-0 bg-gradient-to-r from-purple-50 to-blue-50">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-slate-800 mb-3 flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  About These Assessments
                </h3>
                <ul className="text-slate-600 text-sm space-y-2">
                  <li>• Clinically validated screening tools</li>
                  <li>• Used by healthcare professionals worldwide</li>
                  <li>• Results help personalize your experience</li>
                  <li>• All responses are kept private and secure</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-3 flex items-center">
                  <Brain className="w-5 h-5 text-purple-600 mr-2" />
                  Important Note
                </h3>
                <p className="text-slate-600 text-sm">
                  These assessments are screening tools and not diagnostic instruments. 
                  If you're experiencing mental health concerns, please consult with a 
                  qualified healthcare professional for proper evaluation and treatment.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AssessmentOverview;