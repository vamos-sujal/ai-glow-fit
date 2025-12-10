import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { FitnessProfile } from '@/types/fitness';
import { toast } from 'sonner';
import { 
  Plus, 
  User, 
  Dumbbell, 
  Target, 
  ArrowLeft,
  LogOut,
  Sparkles,
  Trash2
} from 'lucide-react';

const profileImages = [
  'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=400&h=400&fit=crop',
];

export default function Profiles() {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const [profiles, setProfiles] = useState<FitnessProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    } else if (user) {
      loadProfiles();
    }
  }, [user, authLoading]);

  const loadProfiles = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('fitness_profiles')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProfiles((data as FitnessProfile[]) || []);
    } catch (error) {
      console.error('Error loading profiles:', error);
      toast.error('Failed to load profiles');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProfile = () => {
    navigate('/profiles/new');
  };

  const handleProfileClick = (profile: FitnessProfile) => {
    navigate(`/profiles/${profile.id}`);
  };

  const handleDeleteProfile = async (e: React.MouseEvent, profileId: string) => {
    e.stopPropagation();
    
    if (!confirm('Are you sure you want to delete this profile?')) return;

    try {
      const { error } = await supabase
        .from('fitness_profiles')
        .delete()
        .eq('id', profileId);

      if (error) throw error;
      
      setProfiles(prev => prev.filter(p => p.id !== profileId));
      toast.success('Profile deleted');
    } catch (error) {
      console.error('Error deleting profile:', error);
      toast.error('Failed to delete profile');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (authLoading || isLoading) {
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

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold mb-1">Your Profiles</h1>
            <p className="text-muted-foreground">Manage multiple fitness profiles</p>
          </div>
          
          <Button onClick={handleCreateProfile} variant="hero">
            <Plus className="w-4 h-4 mr-2" />
            Add Profile
          </Button>
        </div>

        {profiles.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
              <User className="w-10 h-10 text-primary" />
            </div>
            <h2 className="font-display text-2xl font-bold mb-2">No profiles yet</h2>
            <p className="text-muted-foreground mb-6">Create your first fitness profile to get started</p>
            <Button onClick={handleCreateProfile} variant="hero">
              <Plus className="w-4 h-4 mr-2" />
              Create Profile
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles.map((profile, index) => (
              <motion.div
                key={profile.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleProfileClick(profile)}
                className="glass-card overflow-hidden cursor-pointer group hover:border-primary/50 transition-all duration-300"
              >
                {/* Profile Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={profile.avatar_url || profileImages[index % profileImages.length]}
                    alt={profile.profile_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                  
                  {/* Delete button */}
                  <button
                    onClick={(e) => handleDeleteProfile(e, profile.id)}
                    className="absolute top-3 right-3 p-2 rounded-lg bg-destructive/80 text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Profile Info */}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <h3 className="font-display text-lg font-bold">{profile.profile_name}</h3>
                  </div>
                  
                  {profile.full_name && (
                    <p className="text-sm text-muted-foreground mb-3">{profile.full_name}</p>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {profile.fitness_goal && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        <Target className="w-3 h-3" />
                        {profile.fitness_goal}
                      </span>
                    )}
                    {profile.fitness_level && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                        <Dumbbell className="w-3 h-3" />
                        {profile.fitness_level}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
