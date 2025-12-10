import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ThemeToggle } from '@/components/ThemeToggle';
import { toast } from 'sonner';
import { ArrowLeft, Loader2, User, Target, Dumbbell, Utensils, Activity } from 'lucide-react';

const fitnessGoals = ['Weight Loss', 'Muscle Gain', 'Endurance', 'Flexibility', 'General Fitness'];
const fitnessLevels = ['Beginner', 'Intermediate', 'Advanced'];
const workoutLocations = ['Home', 'Gym', 'Outdoor'];
const dietaryPreferences = ['No Preference', 'Vegetarian', 'Vegan', 'Keto', 'Paleo'];

export default function ProfileFormPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState({
    profile_name: '',
    full_name: '',
    age: '',
    gender: '',
    height_cm: '',
    weight_kg: '',
    fitness_goal: '',
    fitness_level: '',
    workout_location: '',
    dietary_preference: '',
    medical_history: '',
    stress_level: '',
  });

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!user) return;
    
    if (!formData.profile_name || !formData.fitness_goal || !formData.fitness_level) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from('fitness_profiles')
        .insert({
          user_id: user.id,
          profile_name: formData.profile_name,
          full_name: formData.full_name || null,
          age: formData.age ? parseInt(formData.age) : null,
          gender: formData.gender || null,
          height_cm: formData.height_cm ? parseFloat(formData.height_cm) : null,
          weight_kg: formData.weight_kg ? parseFloat(formData.weight_kg) : null,
          fitness_goal: formData.fitness_goal,
          fitness_level: formData.fitness_level,
          workout_location: formData.workout_location || null,
          dietary_preference: formData.dietary_preference || null,
          medical_history: formData.medical_history || null,
          stress_level: formData.stress_level || null,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Profile created successfully!');
      navigate(`/profiles/${data.id}`);
    } catch (error) {
      console.error('Error creating profile:', error);
      toast.error('Failed to create profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep1 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/20 flex items-center justify-center">
          <User className="w-8 h-8 text-primary" />
        </div>
        <h2 className="font-display text-2xl font-bold">Basic Info</h2>
        <p className="text-muted-foreground">Tell us about yourself</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="profile_name">Profile Name *</Label>
          <Input
            id="profile_name"
            placeholder="e.g., Morning Workout, Competition Prep"
            value={formData.profile_name}
            onChange={(e) => updateField('profile_name', e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="full_name">Full Name</Label>
          <Input
            id="full_name"
            placeholder="Your name"
            value={formData.full_name}
            onChange={(e) => updateField('full_name', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              placeholder="25"
              value={formData.age}
              onChange={(e) => updateField('age', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="gender">Gender</Label>
            <select
              id="gender"
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
              value={formData.gender}
              onChange={(e) => updateField('gender', e.target.value)}
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="height_cm">Height (cm)</Label>
            <Input
              id="height_cm"
              type="number"
              placeholder="175"
              value={formData.height_cm}
              onChange={(e) => updateField('height_cm', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="weight_kg">Weight (kg)</Label>
            <Input
              id="weight_kg"
              type="number"
              placeholder="70"
              value={formData.weight_kg}
              onChange={(e) => updateField('weight_kg', e.target.value)}
            />
          </div>
        </div>
      </div>

      <Button onClick={() => setStep(2)} className="w-full" variant="hero">
        Continue
      </Button>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/20 flex items-center justify-center">
          <Target className="w-8 h-8 text-primary" />
        </div>
        <h2 className="font-display text-2xl font-bold">Fitness Goals</h2>
        <p className="text-muted-foreground">What do you want to achieve?</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Fitness Goal *</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {fitnessGoals.map((goal) => (
              <button
                key={goal}
                onClick={() => updateField('fitness_goal', goal)}
                className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                  formData.fitness_goal === goal
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                {goal}
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label>Fitness Level *</Label>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {fitnessLevels.map((level) => (
              <button
                key={level}
                onClick={() => updateField('fitness_level', level)}
                className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                  formData.fitness_level === level
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label>Workout Location</Label>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {workoutLocations.map((location) => (
              <button
                key={location}
                onClick={() => updateField('workout_location', location)}
                className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                  formData.workout_location === location
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                {location}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button onClick={() => setStep(1)} variant="outline" className="flex-1">
          Back
        </Button>
        <Button onClick={() => setStep(3)} className="flex-1" variant="hero">
          Continue
        </Button>
      </div>
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/20 flex items-center justify-center">
          <Utensils className="w-8 h-8 text-primary" />
        </div>
        <h2 className="font-display text-2xl font-bold">Diet & Lifestyle</h2>
        <p className="text-muted-foreground">Final details for your plan</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Dietary Preference</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {dietaryPreferences.map((pref) => (
              <button
                key={pref}
                onClick={() => updateField('dietary_preference', pref)}
                className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                  formData.dietary_preference === pref
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                {pref}
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="medical_history">Medical History (optional)</Label>
          <Input
            id="medical_history"
            placeholder="Any conditions or injuries"
            value={formData.medical_history}
            onChange={(e) => updateField('medical_history', e.target.value)}
          />
        </div>

        <div>
          <Label>Stress Level</Label>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {['Low', 'Medium', 'High'].map((level) => (
              <button
                key={level}
                onClick={() => updateField('stress_level', level)}
                className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                  formData.stress_level === level
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button onClick={() => setStep(2)} variant="outline" className="flex-1">
          Back
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={isSubmitting}
          className="flex-1" 
          variant="hero"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Creating...
            </>
          ) : (
            'Create Profile'
          )}
        </Button>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate('/profiles')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <ThemeToggle />
        </div>
      </header>

      {/* Form */}
      <main className="max-w-md mx-auto px-4 py-8">
        {/* Progress indicator */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-colors ${
                s <= step ? 'bg-primary' : 'bg-border'
              }`}
            />
          ))}
        </div>

        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </main>
    </div>
  );
}
