
import { Link } from "react-router-dom";
import { User, MessageSquare, Brain, FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                MindBridge
              </h1>
            </div>
            <nav className="hidden md:flex space-x-6">
              <Link to="/profile" className="text-slate-600 hover:text-blue-600 transition-colors">Profile</Link>
              <Link to="/assessment" className="text-slate-600 hover:text-blue-600 transition-colors">Assessment</Link>
              <Link to="/chat" className="text-slate-600 hover:text-blue-600 transition-colors">Chat</Link>
              <Link to="/practice" className="text-slate-600 hover:text-blue-600 transition-colors">Practice</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            Safer Communication for
            <span className="block bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Mental Wellness
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            AI-powered communication support that understands your needs, respects your boundaries, and helps you connect meaningfully with others.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Link to="/profile" className="group">
            <Card className="h-full border-0 shadow-lg bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <User className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl">Personal Profile</CardTitle>
                <CardDescription>
                  Customize your communication preferences and sensitive topics
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/assessment" className="group">
            <Card className="h-full border-0 shadow-lg bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl">Assessment</CardTitle>
                <CardDescription>
                  Complete wellness questionnaires to personalize your experience
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/chat" className="group">
            <Card className="h-full border-0 shadow-lg bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl">Safe Chat</CardTitle>
                <CardDescription>
                  AI-supported messaging with sensitivity indicators and support tools
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/practice" className="group">
            <Card className="h-full border-0 shadow-lg bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl">Practice</CardTitle>
                <CardDescription>
                  Develop communication skills with AI guidance and feedback
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {/* Welcome Message */}
        <Card className="max-w-4xl mx-auto border-0 shadow-lg bg-gradient-to-r from-blue-50 to-green-50">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-semibold text-slate-800 mb-4">
              Welcome to Your Safe Space
            </h3>
            <p className="text-slate-600 mb-6">
              MindBridge is designed to support your mental wellness journey through thoughtful, AI-assisted communication. 
              Start by completing your profile or take an assessment to personalize your experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/profile" className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
                Set Up Profile
              </Link>
              <Link to="/assessment" className="bg-white text-blue-600 border-2 border-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-all duration-300 hover:-translate-y-0.5">
                Take Assessment
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Index;
