
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { useOpenAI } from "@/hooks/useOpenAI";

interface Message {
  id: number;
  sender: string;
  content: string;
  timestamp: Date;
  isAI: boolean;
}

export const useChatLogic = () => {
  const { toast } = useToast();
  const { analyzeSensitivity, rephraseText, generateSuggestion } = useOpenAI();
  
  const [messages, setMessages] = useState<Message[]>([
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
        content: responses[currentSensitivity as keyof typeof responses] || "I'm here to listen and support you.",
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
    if (isLoading) return;
    
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

  const applySuggestion = () => {
    setCurrentMessage(aiSuggestion);
    setShowSuggestions(false);
    setAiSuggestion("");
    lastAnalyzedMessage.current = "";
  };

  return {
    messages,
    currentMessage,
    setCurrentMessage,
    currentSensitivity,
    isPaused,
    showSuggestions,
    aiSuggestion,
    isEmergencyBreak,
    isLoading,
    isAnalyzing,
    isRephrasing,
    handleSendMessage,
    handleAiRephrase,
    handleAiSuggest,
    handleEmergencyBreak,
    togglePause,
    applySuggestion
  };
};
