
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ProfileData {
  name: string;
  email: string;
  communicationStyle: string;
  sensitiveTriggers: string[];
  supportPreferences: string[];
  comfortZones: string[];
}

export const useProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<ProfileData>({
    name: '',
    email: '',
    communicationStyle: '',
    sensitiveTriggers: [],
    supportPreferences: [],
    comfortZones: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadProfile = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Load basic profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error loading profile:', profileError);
        throw profileError;
      }

      // Load sensitive triggers
      const { data: triggers, error: triggersError } = await supabase
        .from('sensitive_triggers')
        .select('trigger_text')
        .eq('user_id', user.id);

      if (triggersError) {
        console.error('Error loading triggers:', triggersError);
        throw triggersError;
      }

      // Load support preferences
      const { data: preferences, error: preferencesError } = await supabase
        .from('support_preferences')
        .select('preference_text')
        .eq('user_id', user.id);

      if (preferencesError) {
        console.error('Error loading preferences:', preferencesError);
        throw preferencesError;
      }

      // Load comfort zones
      const { data: zones, error: zonesError } = await supabase
        .from('comfort_zones')
        .select('zone_text')
        .eq('user_id', user.id);

      if (zonesError) {
        console.error('Error loading comfort zones:', zonesError);
        throw zonesError;
      }

      setProfile({
        name: profileData?.name || '',
        email: profileData?.email || user.email || '',
        communicationStyle: profileData?.communication_style || '',
        sensitiveTriggers: triggers?.map(t => t.trigger_text) || [],
        supportPreferences: preferences?.map(p => p.preference_text) || [],
        comfortZones: zones?.map(z => z.zone_text) || []
      });

    } catch (error) {
      console.error('Error loading profile:', error);
      toast({
        title: "Error Loading Profile",
        description: "Failed to load your profile data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async (profileData: ProfileData) => {
    if (!user) return;

    try {
      setSaving(true);

      // Save/update basic profile data
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          name: profileData.name,
          email: profileData.email,
          communication_style: profileData.communicationStyle
        });

      if (profileError) {
        console.error('Error saving profile:', profileError);
        throw profileError;
      }

      // Delete existing triggers and insert new ones
      await supabase
        .from('sensitive_triggers')
        .delete()
        .eq('user_id', user.id);

      if (profileData.sensitiveTriggers.length > 0) {
        const { error: triggersError } = await supabase
          .from('sensitive_triggers')
          .insert(
            profileData.sensitiveTriggers.map(trigger => ({
              user_id: user.id,
              trigger_text: trigger
            }))
          );

        if (triggersError) {
          console.error('Error saving triggers:', triggersError);
          throw triggersError;
        }
      }

      // Delete existing preferences and insert new ones
      await supabase
        .from('support_preferences')
        .delete()
        .eq('user_id', user.id);

      if (profileData.supportPreferences.length > 0) {
        const { error: preferencesError } = await supabase
          .from('support_preferences')
          .insert(
            profileData.supportPreferences.map(preference => ({
              user_id: user.id,
              preference_text: preference
            }))
          );

        if (preferencesError) {
          console.error('Error saving preferences:', preferencesError);
          throw preferencesError;
        }
      }

      // Delete existing comfort zones and insert new ones
      await supabase
        .from('comfort_zones')
        .delete()
        .eq('user_id', user.id);

      if (profileData.comfortZones.length > 0) {
        const { error: zonesError } = await supabase
          .from('comfort_zones')
          .insert(
            profileData.comfortZones.map(zone => ({
              user_id: user.id,
              zone_text: zone
            }))
          );

        if (zonesError) {
          console.error('Error saving comfort zones:', zonesError);
          throw zonesError;
        }
      }

      setProfile(profileData);
      toast({
        title: "Profile Updated",
        description: "Your communication preferences have been saved successfully."
      });

    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error Saving Profile",
        description: "Failed to save your profile data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  return {
    profile,
    setProfile,
    loading,
    saving,
    saveProfile,
    refreshProfile: loadProfile
  };
};
