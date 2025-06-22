
import { Send, RefreshCw, Bot, Lightbulb } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ChatMessageInputProps {
  currentMessage: string;
  setCurrentMessage: (message: string) => void;
  currentSensitivity: string;
  isPaused: boolean;
  isEmergencyBreak: boolean;
  isAnalyzing: boolean;
  isRephrasing: boolean;
  isLoading: boolean;
  showSuggestions: boolean;
  aiSuggestion: string;
  onSendMessage: () => void;
  onAiRephrase: () => void;
  onAiSuggest: () => void;
  onApplySuggestion: () => void;
}

export const ChatMessageInput = ({
  currentMessage,
  setCurrentMessage,
  currentSensitivity,
  isPaused,
  isEmergencyBreak,
  isAnalyzing,
  isRephrasing,
  isLoading,
  showSuggestions,
  aiSuggestion,
  onSendMessage,
  onAiRephrase,
  onAiSuggest,
  onApplySuggestion
}: ChatMessageInputProps) => {
  const getInputBorderColor = (sensitivity: string) => {
    switch (sensitivity) {
      case "green": return "border-green-300 focus-visible:ring-green-500";
      case "yellow": return "border-yellow-300 focus-visible:ring-yellow-500";
      case "red": return "border-red-300 focus-visible:ring-red-500";
      default: return "border-input";
    }
  };

  return (
    <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="space-y-3">
          {showSuggestions && aiSuggestion && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <h4 className="text-sm font-medium text-blue-800 mb-2">AI Suggestion:</h4>
              <button
                className="block w-full text-left text-sm p-2 bg-white rounded border hover:bg-blue-50 transition-colors"
                onClick={onApplySuggestion}
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
                    onSendMessage();
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
                onClick={onAiRephrase}
                variant="outline"
                size="sm"
                disabled={!currentMessage.trim() || isPaused || isEmergencyBreak || isRephrasing}
                title="AI Rephrase"
              >
                {isRephrasing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Bot className="w-4 h-4" />}
              </Button>
              <Button
                onClick={onAiSuggest}
                variant="outline"
                size="sm"
                disabled={isPaused || isEmergencyBreak || isLoading}
                title="AI Suggest"
              >
                {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Lightbulb className="w-4 h-4" />}
              </Button>
              <Button
                onClick={onSendMessage}
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
  );
};
