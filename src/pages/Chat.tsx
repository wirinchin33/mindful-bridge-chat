
import { useChatLogic } from "@/hooks/useChatLogic";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { SensitivityLegend } from "@/components/chat/SensitivityLegend";
import { ChatMessages } from "@/components/chat/ChatMessages";
import { ChatMessageInput } from "@/components/chat/ChatMessageInput";

const Chat = () => {
  const {
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
  } = useChatLogic();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <ChatHeader
        isPaused={isPaused}
        isEmergencyBreak={isEmergencyBreak}
        onTogglePause={togglePause}
        onEmergencyBreak={handleEmergencyBreak}
      />

      <main className="container mx-auto px-4 py-4 max-w-4xl h-[calc(100vh-100px)] flex flex-col">
        <SensitivityLegend />
        
        <ChatMessages messages={messages} />
        
        <ChatMessageInput
          currentMessage={currentMessage}
          setCurrentMessage={setCurrentMessage}
          currentSensitivity={currentSensitivity}
          isPaused={isPaused}
          isEmergencyBreak={isEmergencyBreak}
          isAnalyzing={isAnalyzing}
          isRephrasing={isRephrasing}
          isLoading={isLoading}
          showSuggestions={showSuggestions}
          aiSuggestion={aiSuggestion}
          onSendMessage={handleSendMessage}
          onAiRephrase={handleAiRephrase}
          onAiSuggest={handleAiSuggest}
          onApplySuggestion={applySuggestion}
        />
      </main>
    </div>
  );
};

export default Chat;
