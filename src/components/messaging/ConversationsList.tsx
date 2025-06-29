
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';

interface Conversation {
  id: string;
  name: string | null;
  is_group: boolean;
  updated_at: string;
  conversation_participants: Array<{
    user_id: string;
    profiles: {
      name: string;
      email: string;
    };
  }>;
  latest_message?: {
    content: string;
    created_at: string;
    sender_id: string;
  };
}

interface ConversationsListProps {
  selectedConversation: string | null;
  onSelectConversation: (conversationId: string) => void;
}

const ConversationsList: React.FC<ConversationsListProps> = ({
  selectedConversation,
  onSelectConversation,
}) => {
  const { user } = useAuth();

  const { data: conversations, isLoading } = useQuery({
    queryKey: ['conversations', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('conversation_participants')
        .select(`
          conversation_id,
          conversations!inner(
            id,
            name,
            is_group,
            updated_at
          )
        `)
        .eq('user_id', user?.id);

      if (error) throw error;

      // Get detailed conversation info
      const conversationIds = data.map(item => item.conversation_id);
      
      const { data: detailedConversations, error: detailError } = await supabase
        .from('conversations')
        .select(`
          *,
          conversation_participants!inner(
            user_id,
            profiles!inner(name, email)
          )
        `)
        .in('id', conversationIds);

      if (detailError) throw detailError;

      // Get latest messages for each conversation
      const conversationsWithMessages = await Promise.all(
        detailedConversations.map(async (conv) => {
          const { data: latestMessage } = await supabase
            .from('messages')
            .select('content, created_at, sender_id')
            .eq('conversation_id', conv.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          return {
            ...conv,
            latest_message: latestMessage,
          };
        })
      );

      return conversationsWithMessages as Conversation[];
    },
    enabled: !!user?.id,
  });

  const getConversationName = (conversation: Conversation) => {
    if (conversation.name) return conversation.name;
    
    // For direct messages, show the other person's name
    const otherParticipant = conversation.conversation_participants.find(
      p => p.user_id !== user?.id
    );
    
    return otherParticipant?.profiles?.name || otherParticipant?.profiles?.email || 'Unknown';
  };

  if (isLoading) {
    return <div className="p-4 text-center">Loading conversations...</div>;
  }

  if (!conversations || conversations.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p>No conversations yet</p>
        <p className="text-sm">Add friends to start chatting!</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {conversations.map((conversation) => (
        <div
          key={conversation.id}
          onClick={() => onSelectConversation(conversation.id)}
          className={`p-3 rounded-lg cursor-pointer transition-colors ${
            selectedConversation === conversation.id
              ? 'bg-blue-100 border-blue-200'
              : 'hover:bg-gray-100'
          }`}
        >
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarFallback>
                {getConversationName(conversation)[0]?.toUpperCase() || '?'}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-sm truncate">
                  {getConversationName(conversation)}
                </h3>
                {conversation.latest_message && (
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(conversation.latest_message.created_at), {
                      addSuffix: true,
                    })}
                  </span>
                )}
              </div>
              
              {conversation.latest_message && (
                <p className="text-sm text-gray-600 truncate">
                  {conversation.latest_message.content}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ConversationsList;
