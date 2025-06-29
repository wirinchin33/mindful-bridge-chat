
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface AddFriendDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddFriendDialog: React.FC<AddFriendDialogProps> = ({ open, onOpenChange }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const queryClient = useQueryClient();

  const addFriendMutation = useMutation({
    mutationFn: async (friendEmail: string) => {
      // First, find the user by email
      const { data: friendProfile, error: profileError } = await supabase
        .from('profiles')
        .select('id, email, name')
        .eq('email', friendEmail)
        .single();

      if (profileError || !friendProfile) {
        throw new Error('User not found');
      }

      if (friendProfile.id === user?.id) {
        throw new Error('You cannot add yourself as a friend');
      }

      // Check if friendship already exists
      const { data: existingFriendship, error: checkError } = await supabase
        .from('friends')
        .select('*')
        .or(`and(user_id.eq.${user?.id},friend_id.eq.${friendProfile.id}),and(user_id.eq.${friendProfile.id},friend_id.eq.${user?.id})`);

      if (checkError) throw checkError;

      if (existingFriendship && existingFriendship.length > 0) {
        throw new Error('Friend request already exists');
      }

      // Send friend request
      const { error } = await supabase
        .from('friends')
        .insert({
          user_id: user?.id,
          friend_id: friendProfile.id,
          status: 'pending',
        });

      if (error) throw error;

      return friendProfile;
    },
    onSuccess: (friendProfile) => {
      toast({
        title: 'Friend request sent!',
        description: `Friend request sent to ${friendProfile.name || friendProfile.email}`,
      });
      setEmail('');
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ['friends'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      addFriendMutation.mutate(email.trim());
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Friend</DialogTitle>
          <DialogDescription>
            Enter the email address of the person you want to add as a friend.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="friend@example.com"
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={addFriendMutation.isPending || !email.trim()}
            >
              Send Request
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddFriendDialog;
