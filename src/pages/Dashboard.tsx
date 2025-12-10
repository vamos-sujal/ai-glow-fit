import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { ProfileForm, ProfileData } from '@/components/onboarding/ProfileForm';
import { WorkoutPlanCard } from '@/components/dashboard/WorkoutPlanCard';
import { DietPlanCard } from '@/components/dashboard/DietPlanCard';
import { VoicePlayer } from '@/components/dashboard/VoicePlayer';
import { MotivationCard } from '@/components/dashboard/MotivationCard';
import { AITipsCard } from '@/components/dashboard/AITipsCard';
import { ExportButton } from '@/components/dashboard/ExportButton';
import { Button } from '@/components/ui/button';
import { FitnessPlan, UserProfile } from '@/types/fitness';
import { toast } from 'sonner';
import { LogOut, RefreshCw, Loader2, Sparkles, ArrowLeft, User } from 'lucide-react';

type ViewState = 'loading' | 'onboarding' | 'generating' | 'dashboard';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const [viewState, setViewState] = useState<ViewState>('loading');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [fitnessPlan, setFitnessPlan] = useState<FitnessPlan | null>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/');
    } else if (user) {
      loadUserData();
    }
  }, [user, authLoading]);

  const loadUserData = async () => {
    if (!user) return;

    try {
      // Load profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      setProfile(profileData as UserProfile);

      // Check if profile is complete
      const isProfileComplete = profileData?.fitness_goal && profileData?.fitness_level;

      if (!isProfileComplete) {
        setViewState('onboarding');
        return;
      }

      // Load existing fitness plan
      const { data: planData, error: planError } = await supabase
        .from('fitness_plans')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (planData) {
      setFitnessPlan({
        ...planData,
        workout_plan: planData.workout_plan as unknown as FitnessPlan['workout_plan'],
        diet_plan: planData.diet_plan as unknown as FitnessPlan['diet_plan'],
      });
        setViewState('dashboard');
      } else {
        // Generate plan for user with complete profile
        await generatePlan(profileData as UserProfile);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      setViewState('onboarding');
    }
  };

  const handleProfileSubmit = async (data: ProfileData) => {
    if (!user) return;

    try {
      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update(data)
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      const updatedProfile = { ...profile, ...data, user_id: user.id } as UserProfile;
      setProfile(updatedProfile);
      
      // Generate plan
      await generatePlan(updatedProfile);
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile');
    }
  };

  const generatePlan = async (userProfile: UserProfile) => {
    if (!user) return;

    setViewState('generating');
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-fitness-plan', {
        body: { profile: userProfile }
      });

      if (error) throw error;

      if (data?.error) {
        throw new Error(data.error);
      }

      // Save plan to database
      const { data: savedPlan, error: saveError } = await supabase
        .from('fitness_plans')
        .insert({
          user_id: user.id,
          workout_plan: data.workout_plan,
          diet_plan: data.diet_plan,
          ai_tips: data.ai_tips,
          motivation_quote: data.motivation_quote
        })
        .select()
        .single();

      if (saveError) throw saveError;

      setFitnessPlan({
        ...savedPlan,
        workout_plan: savedPlan.workout_plan as unknown as FitnessPlan['workout_plan'],
        diet_plan: savedPlan.diet_plan as unknown as FitnessPlan['diet_plan'],
      });
      setViewState('dashboard');
      toast.success('Your personalized plan is ready!');
    } catch (error: any) {
      console.error('Error generating plan:', error);
      toast.error(error.message || 'Failed to generate plan');
      setViewState('onboarding');
    }
  };

  const handleRegenerate = async () => {
    if (!profile) return;
    setIsRegenerating(true);
    await generatePlan(profile);
    setIsRegenerating(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (authLoading || viewState === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (viewState === 'onboarding') {
    return (
      <div className="min-h-screen bg-background">
        <ProfileForm
          onSubmit={handleProfileSubmit}
          onBack={() => navigate('/')}
          initialData={profile || undefined}
        />
      </div>
    );
  }

  if (viewState === 'generating') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/20 flex items-center justify-center"
          >
            <Sparkles className="w-8 h-8 text-primary" />
          </motion.div>
          <h2 className="font-display text-2xl font-bold mb-2">Creating Your Plan</h2>
          <p className="text-muted-foreground">Our AI is crafting a personalized fitness journey just for you...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Home
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary">
              <User className="w-4 h-4" />
              <span className="text-sm">{profile?.full_name || user?.email}</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold mb-1">Your Fitness Plan</h1>
            <p className="text-muted-foreground">Personalized for your goals</p>
          </div>
          
          <div className="flex items-center gap-3">
            {fitnessPlan && <ExportButton plan={fitnessPlan} userName={profile?.full_name || undefined} />}
            <Button onClick={handleRegenerate} disabled={isRegenerating}>
              {isRegenerating ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Regenerate
            </Button>
          </div>
        </div>

        {/* Motivation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <MotivationCard initialQuote={fitnessPlan?.motivation_quote} />
        </motion.div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Workout Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            {fitnessPlan?.workout_plan && <WorkoutPlanCard plan={fitnessPlan.workout_plan} />}
          </motion.div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Voice Player */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {fitnessPlan && <VoicePlayer plan={fitnessPlan} />}
            </motion.div>

            {/* AI Tips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {fitnessPlan?.ai_tips && <AITipsCard tips={fitnessPlan.ai_tips} />}
            </motion.div>
          </div>

          {/* Diet Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            {fitnessPlan?.diet_plan && <DietPlanCard plan={fitnessPlan.diet_plan} />}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
