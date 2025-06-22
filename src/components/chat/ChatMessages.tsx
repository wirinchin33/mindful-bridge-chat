
import { Card, CardContent } from "@/components/ui/card";

interface Message {
  id: number;
  sender: string;
  content: string;
  timestamp: Date;
  isAI: boolean;
}

interface ChatMessagesProps {
  messages: Message[];
}

export const ChatMessages = ({ messages }: ChatMessagesProps) => {
  return (
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
  );
};
