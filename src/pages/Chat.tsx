
import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Send, Pause, RefreshCw, Shield, AlertTriangle, CheckCircle, Bot, Lightbulb, Zap, MessageCircle, Users, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useOpenAI } from "@/hooks/useOpenAI";
import { useAuth } from "@/contexts/AuthContext";
import FriendsList from "@/components/messaging/FriendsList";
import ConversationsList from "@/components/messaging/ConversationsList";
import ChatWindow from "@/components/messaging/ChatWindow";
import AddFriendDialog from "@/components/messaging/AddFriendDialog";

const Chat = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { analyzeSensitivity, rephraseText, generateSuggestion } = useOpenAI();
  
  // AI Chat state
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
  
  // Messaging state
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [activeTab, setActiveTab] = useState("ai-chat");
  
  // Add ref to track the last analyzed message
  const lastAnalyzedMessage = useRef("");

  // Real-time sensitivity analysis with debouncing and change detection
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (currentMessage.trim() && currentMessage !== lastAnalyzedMessage.current && activeTab === "ai-chat") {
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
  }, [currentMessage, analyzeSensitivity, activeTab]);

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
    if (!currentMessage.trim() || isEmergencyBreak || activeTab !== "ai-chat") return;
    
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
    lastAnalyzedMessage.current = "";

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
    if (!currentMessage.trim() || isRephrasing || activeTab !== "ai-chat") return;
    
    console.log('Starting rephrase for message:', currentMessage);
    setIsRephrasing(true);
    
    try {
      const rephrased = await rephraseText(currentMessage);
      console.log('Rephrased result:', rephrased);
      
      if (rephrased && rephrased !== currentMessage) {
        setCurrentMessage(rephrased);
        lastAnalyzedMessage.current = "";
        
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
    if (isLoading || activeTab !== "ai-chat") return;
    
    setIsLoading(true);
    try {
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

  if (!user) {
    return <div>Please sign in to access the chat</div>;
  }

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
              <h1 className="text-2xl font-bold text-slate-800">Safe Chat & Messaging</h1>
            </div>
            <div className="flex items-center space-x-2">
              {activeTab === "ai-chat" && (
                <>
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
                </>
              )}
              <div className="text-sm text-slate-600">
                AI Support Active
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4 max-w-6xl h-[calc(100vh-100px)] flex flex-col">
        {/* Main Chat Interface */}
        <Card className="flex-1 border-0 shadow-lg bg-white/70 backdrop-blur-sm overflow-hidden">
          <CardContent className="p-0 h-full flex">
            {/* Sidebar */}
            <div className="w-80 border-r bg-gray-50 flex flex-col">
              <div className="p-4 border-b bg-white">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="ai-chat" className="flex items-center gap-2">
                      <Bot size={16} />
                      AI Chat
                    </TabsTrigger>
                    <TabsTrigger value="messaging" className="flex items-center gap-2">
                      <MessageCircle size={16} />
                      Messages
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="ai-chat" className="mt-4">
                    {/* Sensitivity Legend */}
                    <div className="mb-4 p-3 bg-white/50 rounded-lg">
                      <h3 className="font-medium text-slate-800 text-sm mb-2">Sensitivity Indicators:</h3>
                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-green-100 text-green-800 border-green-300 text-xs">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Safe
                        </Badge>
                        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300 text-xs">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Sensitive
                        </Badge>
                        <Badge className="bg-red-100 text-red-800 border-red-300 text-xs">
                          <Shield className="w-3 h-3 mr-1" />
                          High Risk
                        </Badge>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="messaging" className="mt-4">
                    <Tabs defaultValue="chats" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="chats" className="flex items-center gap-2">
                          <MessageCircle size={14} />
                          Chats
                        </TabsTrigger>
                        <TabsTrigger value="friends" className="flex items-center gap-2">
                          <Users size={14} />
                          Friends
                        </TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="chats" className="mt-4">
                        <ConversationsList 
                          selectedConversation={selectedConversation}
                          onSelectConversation={(id) => {
                            setSelectedConversation(id);
                            setActiveTab("messaging");
                          }}
                        />
                      </TabsContent>
                      
                      <TabsContent value="friends" className="mt-4">
                        <div className="space-y-4">
                          <Button 
                            onClick={() => setShowAddFriend(true)}
                            className="w-full flex items-center gap-2"
                            size="sm"
                          >
                            <Plus size={14} />
                            Add Friend
                          </Button>
                          <FriendsList onStartChat={(id) => {
                            setSelectedConversation(id);
                            setActiveTab("messaging");
                          }} />
                        </div>
                      </TabsContent>
                    </Tabs>
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {activeTab === "ai-chat" ? (
                <>
                  {/* AI Chat Messages */}
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

                  {/* AI Chat Input */}
                  <div className="p-4 border-t bg-white">
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
                              lastAnalyzedMessage.current = "";
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
                  </div>
                </>
              ) : selectedConversation ? (
                <ChatWindow 
                  conversationId={selectedConversation}
                  onBack={() => setSelectedConversation(null)}
                />
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <MessageCircle size={48} className="mx-auto mb-4 text-gray-300" />
                    <p className="text-lg">Select a conversation to start messaging</p>
                    <p className="text-sm mt-2">Or switch to AI Chat for AI-assisted communication</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      </main>

      <AddFriendDialog 
        open={showAddFriend}
        onOpenChange={setShowAddFriend}
      />
    </div>
  );
};

export default Chat;
