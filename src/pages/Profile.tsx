
import { useState, useEffect } from "react";
import { ArrowLeft, Save, Edit, Brain, TrendingUp, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { assessmentTests } from "@/data/assessmentTests";

const Profile = () => {
  const { profile, setProfile, loading, saving, saveProfile } = useProfile();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [assessmentResults, setAssessmentResults] = useState<any[]>([]);
  const [loadingResults, setLoadingResults] = useState(true);

  const handleSave = async () => {
    await saveProfile(profile);
    setIsEditing(false);
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

  const addSupportPreference = (preference: string) => {
    if (preference && !profile.supportPreferences.includes(preference)) {
      setProfile(prev => ({
        ...prev,
        supportPreferences: [...prev.supportPreferences, preference]
      }));
    }
  };

  const removeSupportPreference = (preference: string) => {
    setProfile(prev => ({
      ...prev,
      supportPreferences: prev.supportPreferences.filter(p => p !== preference)
    }));
  };

  const addComfortZone = (zone: string) => {
    if (zone && !profile.comfortZones.includes(zone)) {
      setProfile(prev => ({
        ...prev,
        comfortZones: [...prev.comfortZones, zone]
      }));
    }
  };

  const removeComfortZone = (zone: string) => {
    setProfile(prev => ({
      ...prev,
      comfortZones: prev.comfortZones.filter(z => z !== zone)
    }));
  };

  useEffect(() => {
    const fetchAssessmentResults = async () => {
      if (!user) {
        setLoadingResults(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('assessment_results')
          .select('*')
          .eq('user_id', user.id)
          .order('completed_at', { ascending: false });

        if (error) {
          console.error('Error fetching assessment results:', error);
        } else {
          setAssessmentResults(data || []);
        }
      } catch (error) {
        console.error('Error fetching assessment results:', error);
      } finally {
        setLoadingResults(false);
      }
    };

    fetchAssessmentResults();
  }, [user]);

  const getTestDisplayName = (testType: string) => {
    const test = assessmentTests.find(t => t.id === testType);
    return test ? test.shortTitle : testType.toUpperCase();
  };

  const getLatestResults = () => {
    const latest = assessmentResults.reduce((acc, result) => {
      if (!acc[result.test_type] || new Date(result.completed_at) > new Date(acc[result.test_type].completed_at)) {
        acc[result.test_type] = result;
      }
      return acc;
    }, {});
    return Object.values(latest);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

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
              disabled={saving}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              ) : isEditing ? (
                <Save className="w-4 h-4 mr-2" />
              ) : (
                <Edit className="w-4 h-4 mr-2" />
              )}
              {saving ? "Saving..." : isEditing ? "Save Changes" : "Edit Profile"}
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
              <div className="flex flex-wrap gap-2 mb-4">
                {profile.supportPreferences.map((pref, index) => (
                  <Badge key={index} variant="secondary" className="bg-green-100 text-green-800">
                    {pref}
                    {isEditing && (
                      <button
                        onClick={() => removeSupportPreference(pref)}
                        className="ml-2 text-green-600 hover:text-green-800"
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
                    placeholder="Add a support preference..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        addSupportPreference(e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                  <Button
                    variant="outline"
                    onClick={(e) => {
                      const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                      addSupportPreference(input.value);
                      input.value = '';
                    }}
                  >
                    Add
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Comfort Zones */}
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl text-slate-800">Comfort Zones</CardTitle>
              <CardDescription>Communication methods and environments where you feel most comfortable</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {profile.comfortZones.map((zone, index) => (
                  <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                    {zone}
                    {isEditing && (
                      <button
                        onClick={() => removeComfortZone(zone)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
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
                    placeholder="Add a comfort zone..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        addComfortZone(e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                  <Button
                    variant="outline"
                    onClick={(e) => {
                      const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                      addComfortZone(input.value);
                      input.value = '';
                    }}
                  >
                    Add
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Mental Health Assessment Results */}
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl text-slate-800 flex items-center">
                <Brain className="w-5 h-5 mr-2 text-purple-600" />
                Mental Health Assessment Results
              </CardTitle>
              <CardDescription>Your recent assessment scores and progress</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingResults ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-slate-600">Loading your results...</p>
                </div>
              ) : assessmentResults.length === 0 ? (
                <div className="text-center py-8">
                  <Brain className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 mb-4">No assessment results yet</p>
                  <Link to="/assessment">
                    <Button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700">
                      Take Your First Assessment
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {getLatestResults().map((result: any) => (
                      <div key={result.test_type} className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border border-purple-100">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-slate-800">
                            {getTestDisplayName(result.test_type)}
                          </h4>
                          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                            {result.percentage.toFixed(0)}%
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-600">Score:</span>
                            <span className="font-medium">{result.score}/{result.max_score}</span>
                          </div>
                          {result.severity_level && (
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-600">Level:</span>
                              <span className="font-medium">{result.severity_level}</span>
                            </div>
                          )}
                          <div className="flex items-center text-xs text-slate-500">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(result.completed_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {assessmentResults.length > 3 && (
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-slate-800 flex items-center">
                            <TrendingUp className="w-4 h-4 mr-2 text-blue-600" />
                            Track Your Progress
                          </h4>
                          <p className="text-sm text-slate-600">
                            You have {assessmentResults.length} total assessment{assessmentResults.length > 1 ? 's' : ''} completed
                          </p>
                        </div>
                        <Link to="/assessment">
                          <Button variant="outline" size="sm">
                            View All
                          </Button>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Profile;
