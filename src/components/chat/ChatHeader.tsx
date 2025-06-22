
import { ArrowLeft, Pause, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ChatHeaderProps {
  isPaused: boolean;
  isEmergencyBreak: boolean;
  onTogglePause: () => void;
  onEmergencyBreak: () => void;
}

export const ChatHeader = ({ 
  isPaused, 
  isEmergencyBreak, 
  onTogglePause, 
  onEmergencyBreak 
}: ChatHeaderProps) => {
  return (
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
              onClick={onTogglePause}
              className={isPaused ? "bg-red-50 border-red-200" : ""}
            >
              <Pause className="w-4 h-4 mr-2" />
              {isPaused ? "Paused" : "Pause"}
            </Button>
            <Button
              onClick={onEmergencyBreak}
              variant="outline"
              size="sm"
              className={isEmergencyBreak ? "bg-red-50 border-red-200" : ""}
              title="Emergency Break"
            >
              <Zap className="w-4 h-4" />
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
  );
};
