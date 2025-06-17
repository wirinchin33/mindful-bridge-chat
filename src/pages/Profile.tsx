
import { useState } from "react";
import { ArrowLeft, Save, Edit } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Alex Johnson",
    email: "alex@example.com",
    communicationStyle: "Direct but empathetic",
    sensitiveTriggers: ["Loud criticism", "Sudden changes", "Financial stress"],
    supportPreferences: ["Active listening", "Solution-focused", "Patient communication"],
    comfortZones: ["One-on-one conversations", "Written communication", "Scheduled check-ins"],
    emergencyContacts: ["Dr. Smith - Therapist", "Jamie - Best Friend"]
  });

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your communication preferences have been saved successfully.",
    });
  };

  const addTrigger = (trigger: string) => {
    if (trigger && !profile.sensitiveTriggers.includes(trigger)) {
      setProfile(prev => ({
        ...prev,
        sensitiveTriggers: [...prev.sensitiveTriggers, trigger]
      }));
    }
  };

  const removeTrigger = (trigger: string) => {
    setProfile(prev => ({
      ...prev,
      sensitiveTriggers: prev.sensitiveTriggers.filter(t => t !== trigger)
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-slate-600 hover:text-blue-600 transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <h1 className="text-2xl font-bold text-slate-800">Personal Profile</h1>
            </div>
            <Button
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            >
              {isEditing ? <Save className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
              {isEditing ? "Save Changes" : "Edit Profile"}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          {/* Basic Information */}
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl text-slate-800">Basic Information</CardTitle>
              <CardDescription>Your essential profile details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Communication Style */}
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl text-slate-800">Communication Style</CardTitle>
              <CardDescription>How you prefer to communicate and be communicated with</CardDescription>
            </CardHeader>
            <CardContent>
              <Label htmlFor="commStyle">Preferred Communication Style</Label>
              <Textarea
                id="commStyle"
                value={profile.communicationStyle}
                onChange={(e) => setProfile(prev => ({ ...prev, communicationStyle: e.target.value }))}
                disabled={!isEditing}
                className="mt-2"
                rows={3}
                placeholder="Describe how you like to communicate..."
              />
            </CardContent>
          </Card>

          {/* Sensitive Topics */}
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl text-slate-800">Sensitive Topics & Triggers</CardTitle>
              <CardDescription>Topics or situations that may cause distress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {profile.sensitiveTriggers.map((trigger, index) => (
                  <Badge key={index} variant="secondary" className="bg-red-100 text-red-800">
                    {trigger}
                    {isEditing && (
                      <button
                        onClick={() => removeTrigger(trigger)}
                        className="ml-2 text-red-600 hover:text-red-800"
                      >
                        ×
                      </button>
                    )}
                  </Badge>
                ))}
              </div>
              {isEditing && (
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a sensitive topic..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        addTrigger(e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                  <Button
                    variant="outline"
                    onClick={(e) => {
                      const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                      addTrigger(input.value);
                      input.value = '';
                    }}
                  >
                    Add
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Support Preferences */}
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl text-slate-800">Support Preferences</CardTitle>
              <CardDescription>How you like to receive support and comfort</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile.supportPreferences.map((pref, index) => (
                  <Badge key={index} variant="secondary" className="bg-green-100 text-green-800">
                    {pref}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Comfort Zones */}
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl text-slate-800">Comfort Zones</CardTitle>
              <CardDescription>Communication methods and environments where you feel most comfortable</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile.comfortZones.map((zone, index) => (
                  <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                    {zone}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Profile;
