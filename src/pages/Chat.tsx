
import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Send, Pause, RefreshCw, Shield, AlertTriangle, CheckCircle, Bot, Lightbulb, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useOpenAI } from "@/hooks/useOpenAI";

const Chat = () => {
  const { toast } = useToast();
  const { analyzeSensitivity, rephraseText, generateSuggestion } = useOpenAI();
  
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "AI Assistant",
      content: "Hello! I'm here to help you communicate safely and effectively. How are you feeling today?",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      isAI: true
    },
    {
      id: 2,
      sender: "You",
      content: "I've been feeling a bit overwhelmed lately with work and personal stuff.",
      timestamp: new Date(Date.now() - 1000 * 60 * 3),
      isAI: false
    },
    {
      id: 3,
      sender: "AI Assistant",
      content: "I understand that feeling overwhelmed can be really challenging. It sounds like you have a lot on your plate right now. Would you like to talk through what's contributing to these feelings, or would you prefer some strategies for managing overwhelm?",
      timestamp: new Date(Date.now() - 1000 * 60 * 2),
      isAI: true
    }
  ]);
  
  const [currentMessage, setCurrentMessage] = useState("");
  const [currentSensitivity, setCurrentSensitivity] = useState("green");
  const [isPaused, setIsPaused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [isEmergencyBreak, setIsEmergencyBreak] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRephrasing, setIsRephrasing] = useState(false);
  
  // Add ref to track the last analyzed message
  const lastAnalyzedMessage = useRef("");

  // Real-time sensitivity analysis with debouncing and change detection
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (currentMessage.trim() && currentMessage !== lastAnalyzedMessage.current) {
        setIsAnalyzing(true);
        lastAnalyzedMessage.current = currentMessage;
        try {
          const sensitivity = await analyzeSensitivity(currentMessage);
          setCurrentSensitivity(sensitivity);
        } catch (error) {
          console.error('Failed to analyze sensitivity:', error);
          setCurrentSensitivity("green");
        } finally {
          setIsAnalyzing(false);
        }
      } else if (!currentMessage.trim()) {
        setCurrentSensitivity("green");
        lastAnalyzedMessage.current = "";
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [currentMessage, analyzeSensitivity]);

  const getSensitivityColor = (level: string) => {
    switch (level) {
      case "green": return "bg-green-100 border-green-300 text-green-800";
      case "yellow": return "bg-yellow-100 border-yellow-300 text-yellow-800";
      case "red": return "bg-red-100 border-red-300 text-red-800";
      default: return "bg-gray-100 border-gray-300 text-gray-800";
    }
  };

  const getSensitivityIcon = (level: string) => {
    switch (level) {
      case "green": return <CheckCircle className="w-4 h-4" />;
      case "yellow": return <AlertTriangle className="w-4 h-4" />;
      case "red": return <Shield className="w-4 h-4" />;
      default: return null;
    }
  };

  const getInputBorderColor = (sensitivity: string) => {
    switch (sensitivity) {
      case "green": return "border-green-300 focus-visible:ring-green-500";
      case "yellow": return "border-yellow-300 focus-visible:ring-yellow-500";
      case "red": return "border-red-300 focus-visible:ring-red-500";
      default: return "border-input";
    }
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || isEmergencyBreak) return;
    
    const newMessage = {
      id: messages.length + 1,
      sender: "You",
      content: currentMessage,
      timestamp: new Date(),
      isAI: false
    };

    setMessages(prev => [...prev, newMessage]);
    setCurrentMessage("");
    setCurrentSensitivity("green");
    setShowSuggestions(false);
    setAiSuggestion("");
    lastAnalyzedMessage.current = ""; // Reset the last analyzed message

    // Simulate AI response
    setTimeout(() => {
      const responses = {
        green: "Thank you for sharing that with me. Your message shows good self-awareness.",
        yellow: "I notice this might be a sensitive topic for you. I'm here to support you through this.",
        red: "I can sense this is really difficult for you. Please remember that you're not alone, and it's okay to reach out for professional support if you need it."
      };

      const aiResponse = {
        id: messages.length + 2,
        sender: "AI Assistant",
        content: responses[currentSensitivity] || "I'm here to listen and support you.",
        timestamp: new Date(),
        isAI: true
      };

      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleAiRephrase = async () => {
    if (!currentMessage.trim() || isRephrasing) return;
    
    console.log('Starting rephrase for message:', currentMessage);
    setIsRephrasing(true);
    
    try {
      const rephrased = await rephraseText(currentMessage);
      console.log('Rephrased result:', rephrased);
      
      if (rephrased && rephrased !== currentMessage) {
        setCurrentMessage(rephrased);
        lastAnalyzedMessage.current = ""; // Reset so the rephrased message gets analyzed
        
        toast({
          title: "Message Rephrased",
          description: "Your message has been refined for better communication.",
        });
      } else {
        toast({
          title: "No Changes Made",
          description: "The message is already well-phrased.",
        });
      }
    } catch (error) {
      console.error('Failed to rephrase:', error);
      toast({
        title: "Error",
        description: "Failed to rephrase message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsRephrasing(false);
    }
  };

  const handleAiSuggest = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      // Send last 10 messages for context
      const recentMessages = messages.slice(-10);
      const suggestion = await generateSuggestion(recentMessages);
      setAiSuggestion(suggestion);
      setShowSuggestions(true);
      
      toast({
        title: "AI Suggestion",
        description: "Here's a suggested message to help you get started.",
      });
    } catch (error) {
      console.error('Failed to generate suggestion:', error);
      toast({
        title: "Error",
        description: "Failed to generate suggestion. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmergencyBreak = () => {
    setIsEmergencyBreak(!isEmergencyBreak);
    setIsPaused(!isEmergencyBreak);
    
    toast({
      title: isEmergencyBreak ? "Emergency Break Lifted" : "Emergency Break Activated",
      description: isEmergencyBreak 
        ? "You can now continue communicating. Take your time." 
        : "Communication is paused. Take a moment to breathe and center yourself.",
      variant: isEmergencyBreak ? "default" : "destructive"
    });
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
    toast({
      title: isPaused ? "Chat Resumed" : "Chat Paused",
      description: isPaused ? "You can now receive messages again." : "Incoming messages are temporarily paused.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-green-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-slate-600 hover:text-green-600 transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <h1 className="text-2xl font-bold text-slate-800">Safe Chat</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={togglePause}
                className={isPaused ? "bg-red-50 border-red-200" : ""}
              >
                <Pause className="w-4 h-4 mr-2" />
                {isPaused ? "Paused" : "Pause"}
              </Button>
              {isEmergencyBreak && (
                <Badge className="bg-red-100 text-red-800 border-red-300">
                  Emergency Break Active
                </Badge>
              )}
              <div className="text-sm text-slate-600">
                AI Support Active
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4 max-w-4xl h-[calc(100vh-100px)] flex flex-col">
        {/* Sensitivity Legend */}
        <Card className="mb-4 border-0 shadow-sm bg-white/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-slate-800">Sensitivity Indicators:</h3>
              <div className="flex space-x-4">
                <Badge className="bg-green-100 text-green-800 border-green-300">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Safe
                </Badge>
                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Sensitive
                </Badge>
                <Badge className="bg-red-100 text-red-800 border-red-300">
                  <Shield className="w-3 h-3 mr-1" />
                  High Risk
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Messages */}
        <Card className="flex-1 border-0 shadow-lg bg-white/70 backdrop-blur-sm mb-4 overflow-hidden">
          <CardContent className="p-0 h-full flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isAI ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`max-w-[70%] ${message.isAI ? 'order-1' : 'order-2'}`}>
                    <div className="flex items-center mb-1">
                      <span className="text-sm font-medium text-slate-600">
                        {message.sender}
                      </span>
                    </div>
                    <div
                      className={`p-3 rounded-lg ${
                        message.isAI
                          ? 'bg-slate-100 text-slate-800'
                          : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                      }`}
                    >
                      {message.content}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Message Input */}
        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="space-y-3">
              {showSuggestions && aiSuggestion && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-800 mb-2">AI Suggestion:</h4>
                  <button
                    className="block w-full text-left text-sm p-2 bg-white rounded border hover:bg-blue-50 transition-colors"
                    onClick={() => {
                      setCurrentMessage(aiSuggestion);
                      setShowSuggestions(false);
                      setAiSuggestion("");
                      lastAnalyzedMessage.current = ""; // Reset so the suggestion gets analyzed
                    }}
                  >
                    "{aiSuggestion}"
                  </button>
                </div>
              )}
              
              <div className="flex space-x-2">
                <div className="flex-1 relative">
                  <Textarea
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    placeholder={isEmergencyBreak ? "Emergency break is active..." : isPaused ? "Chat is paused..." : "Type your message here..."}
                    disabled={isPaused || isEmergencyBreak}
                    className={`min-h-[60px] resize-none transition-colors ${getInputBorderColor(currentSensitivity)}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  {(isAnalyzing || isRephrasing) && (
                    <div className="absolute top-2 right-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex flex-col space-y-2">
                  <Button
                    onClick={handleAiRephrase}
                    variant="outline"
                    size="sm"
                    disabled={!currentMessage.trim() || isPaused || isEmergencyBreak || isRephrasing}
                    title="AI Rephrase"
                  >
                    {isRephrasing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Bot className="w-4 h-4" />}
                  </Button>
                  <Button
                    onClick={handleAiSuggest}
                    variant="outline"
                    size="sm"
                    disabled={isPaused || isEmergencyBreak || isLoading}
                    title="AI Suggest"
                  >
                    {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Lightbulb className="w-4 h-4" />}
                  </Button>
                  <Button
                    onClick={handleEmergencyBreak}
                    variant="outline"
                    size="sm"
                    className={isEmergencyBreak ? "bg-red-50 border-red-200" : ""}
                    title="Emergency Break"
                  >
                    <Zap className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!currentMessage.trim() || isPaused || isEmergencyBreak}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Chat;
