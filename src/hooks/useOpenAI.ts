
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useOpenAI = () => {
  const { toast } = useToast();

  const analyzeSensitivity = async (text: string): Promise<string> => {
    try {
      const { data, error } = await supabase.functions.invoke('analyze-sensitivity', {
        body: { text }
      });

      if (error) throw error;

      return data.sensitivity || 'green';
    } catch (error) {
      console.error('Error analyzing sensitivity:', error);
      toast({
        title: "Error",
        description: "Failed to analyze message sensitivity",
        variant: "destructive"
      });
      return 'green';
    }
  };

  const rephraseText = async (text: string): Promise<string> => {
    try {
      const { data, error } = await supabase.functions.invoke('rephrase-text', {
        body: { text }
      });

      if (error) throw error;

      return data.rephrasedText || text;
    } catch (error) {
      console.error('Error rephrasing text:', error);
      toast({
        title: "Error",
        description: "Failed to rephrase message",
        variant: "destructive"
      });
      return text;
    }
  };

  const generateSuggestion = async (chatHistory: any[]): Promise<string> => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-suggestion', {
        body: { chatHistory }
      });

      if (error) throw error;

      return data.suggestion || '';
    } catch (error) {
      console.error('Error generating suggestion:', error);
      toast({
        title: "Error",
        description: "Failed to generate suggestion",
        variant: "destructive"
      });
      return '';
    }
  };

  return {
    analyzeSensitivity,
    rephraseText,
    generateSuggestion
  };
};
