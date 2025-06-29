
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Check, X, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Friend {
  id: string;
  user_id: string;
  friend_id: string;
  status: string;
  created_at: string;
  friend_profile: {
    name: string;
    email: string;
  };
}

interface FriendsListProps {
  onStartChat: (conversationId: string) => void;
}

const FriendsList: React.FC<FriendsListProps> = ({ onStartChat }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: friends, isLoading } = useQuery({
    queryKey: ['friends', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('friends')
        .select(`
          *,
          friend_profile:profiles!friends_friend_id_fkey(name, email)
        `)
        .eq('user_id', user?.id);

      if (error) throw error;
      return data as Friend[];
    },
    enabled: !!user?.id,
  });

  const { data: friendRequests } = useQuery({
    queryKey: ['friend-requests', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('friends')
        .select(`
          *,
          requester_profile:profiles!friends_user_id_fkey(name, email)
        `)
        .eq('friend_id', user?.id)
        .eq('status', 'pending');

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const acceptFriendMutation = useMutation({
    mutationFn: async (friendshipId: string) => {
      const { error } = await supabase
        .from('friends')
        .update({ status: 'accepted' })
        .eq('id', friendshipId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      queryClient.invalidateQueries({ queryKey: ['friend-requests'] });
      toast({ title: 'Friend request accepted!' });
    },
  });

  const startChatMutation = useMutation({
    mutationFn: async (friendId: string) => {
      // Check if conversation already exists
      const { data: existingConversation } = await supabase
        .from('conversation_participants')
        .select(`
          conversation_id,
          conversations!inner(*)
        `)
        .eq('user_id', user?.id);

      if (existingConversation) {
        for (const participant of existingConversation) {
          const { data: otherParticipants } = await supabase
            .from('conversation_participants')
            .select('user_id')
            .eq('conversation_id', participant.conversation_id)
            .neq('user_id', user?.id);

          if (otherParticipants?.length === 1 && otherParticipants[0].user_id === friendId) {
            return participant.conversation_id;
          }
        }
      }

      // Create new conversation
      const { data: conversation, error: conversationError } = await supabase
        .from('conversations')
        .insert({
          created_by: user?.id,
          is_group: false,
        })
        .select()
        .single();

      if (conversationError) throw conversationError;

      // Add participants
      const { error: participantsError } = await supabase
        .from('conversation_participants')
        .insert([
          { conversation_id: conversation.id, user_id: user?.id },
          { conversation_id: conversation.id, user_id: friendId },
        ]);

      if (participantsError) throw participantsError;

      return conversation.id;
    },
    onSuccess: (conversationId) => {
      onStartChat(conversationId);
    },
  });

  if (isLoading) {
    return <div className="p-4 text-center">Loading friends...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Friend Requests */}
      {friendRequests && friendRequests.length > 0 && (
        <div>
          <h3 className="font-semibold text-sm text-gray-600 mb-2">Friend Requests</h3>
          <div className="space-y-2">
            {friendRequests.map((request: any) => (
              <div key={request.id} className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>
                      {request.requester_profile?.name?.[0] || request.requester_profile?.email?.[0] || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{request.requester_profile?.name || 'Unknown'}</p>
                    <p className="text-xs text-gray-500">{request.requester_profile?.email}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => acceptFriendMutation.mutate(request.id)}
                  >
                    <Check size={12} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Friends List */}
      <div>
        <h3 className="font-semibold text-sm text-gray-600 mb-2">Friends</h3>
        <div className="space-y-2">
          {friends?.filter(friend => friend.status === 'accepted').map((friend) => (
            <div key={friend.id} className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-lg">
              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarFallback>
                    {friend.friend_profile?.name?.[0] || friend.friend_profile?.email?.[0] || '?'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{friend.friend_profile?.name || 'Unknown'}</p>
                  <p className="text-xs text-gray-500">{friend.friend_profile?.email}</p>
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => startChatMutation.mutate(friend.friend_id)}
              >
                <MessageCircle size={14} />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FriendsList;
