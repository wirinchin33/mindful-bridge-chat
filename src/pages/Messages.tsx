
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import FriendsList from '@/components/messaging/FriendsList';
import ConversationsList from '@/components/messaging/ConversationsList';
import ChatWindow from '@/components/messaging/ChatWindow';
import AddFriendDialog from '@/components/messaging/AddFriendDialog';
import { Button } from '@/components/ui/button';
import { MessageCircle, Users, Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Messages = () => {
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [showAddFriend, setShowAddFriend] = useState(false);

  if (!user) {
    return <div>Please sign in to access messages</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden h-[calc(100vh-8rem)]">
          <div className="flex h-full">
            {/* Sidebar */}
            <div className="w-80 border-r bg-gray-50 flex flex-col">
              <div className="p-4 border-b bg-white">
                <h1 className="text-xl font-bold text-gray-800 mb-4">Messages</h1>
                <Tabs defaultValue="chats" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="chats" className="flex items-center gap-2">
                      <MessageCircle size={16} />
                      Chats
                    </TabsTrigger>
                    <TabsTrigger value="friends" className="flex items-center gap-2">
                      <Users size={16} />
                      Friends
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="chats" className="mt-4">
                    <ConversationsList 
                      selectedConversation={selectedConversation}
                      onSelectConversation={setSelectedConversation}
                    />
                  </TabsContent>
                  
                  <TabsContent value="friends" className="mt-4">
                    <div className="space-y-4">
                      <Button 
                        onClick={() => setShowAddFriend(true)}
                        className="w-full flex items-center gap-2"
                      >
                        <Plus size={16} />
                        Add Friend
                      </Button>
                      <FriendsList onStartChat={setSelectedConversation} />
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {selectedConversation ? (
                <ChatWindow 
                  conversationId={selectedConversation}
                  onBack={() => setSelectedConversation(null)}
                />
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <MessageCircle size={48} className="mx-auto mb-4 text-gray-300" />
                    <p className="text-lg">Select a conversation to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <AddFriendDialog 
        open={showAddFriend}
        onOpenChange={setShowAddFriend}
      />
    </div>
  );
};

export default Messages;
