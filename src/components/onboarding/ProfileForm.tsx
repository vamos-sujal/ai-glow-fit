import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, ArrowLeft, User, Ruler, Target, Utensils, Activity, Heart } from 'lucide-react';

interface ProfileFormProps {
  onSubmit: (data: ProfileData) => void;
  onBack: () => void;
  initialData?: Partial<ProfileData>;
}

export interface ProfileData {
  full_name: string;
  age: number | null;
  gender: string;
  height_cm: number | null;
  weight_kg: number | null;
  fitness_goal: string;
  fitness_level: string;
  workout_location: string;
  dietary_preference: string;
  medical_history: string;
  stress_level: string;
}

const steps = [
  { id: 1, title: 'Personal Info', icon: User },
  { id: 2, title: 'Body Stats', icon: Ruler },
  { id: 3, title: 'Fitness Goals', icon: Target },
  { id: 4, title: 'Preferences', icon: Utensils },
];

export function ProfileForm({ onSubmit, onBack, initialData }: ProfileFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<ProfileData>({
    full_name: initialData?.full_name || '',
    age: initialData?.age || null,
    gender: initialData?.gender || '',
    height_cm: initialData?.height_cm || null,
    weight_kg: initialData?.weight_kg || null,
    fitness_goal: initialData?.fitness_goal || '',
    fitness_level: initialData?.fitness_level || '',
    workout_location: initialData?.workout_location || '',
    dietary_preference: initialData?.dietary_preference || '',
    medical_history: initialData?.medical_history || '',
    stress_level: initialData?.stress_level || '',
  });

  const updateField = (field: keyof ProfileData, value: string | number | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
    else onSubmit(formData);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else onBack();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {steps.map((s) => (
              <div key={s.id} className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                    step >= s.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-muted-foreground'
                  }`}
                >
                  <s.icon className="w-5 h-5" />
                </div>
                <span className={`text-xs mt-2 ${step >= s.id ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {s.title}
                </span>
              </div>
            ))}
          </div>
          <div className="h-1 bg-secondary rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: '0%' }}
              animate={{ width: `${(step / 4) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Form */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="glass-card p-8"
        >
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="font-display text-2xl font-bold mb-2">Let's get to know you</h2>
                <p className="text-muted-foreground">Basic information to personalize your experience</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    value={formData.full_name}
                    onChange={(e) => updateField('full_name', e.target.value)}
                    className="input-field mt-2"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="25"
                      value={formData.age || ''}
                      onChange={(e) => updateField('age', e.target.value ? parseInt(e.target.value) : null)}
                      className="input-field mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <Select value={formData.gender} onValueChange={(v) => updateField('gender', v)}>
                      <SelectTrigger className="input-field mt-2">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="font-display text-2xl font-bold mb-2">Your Body Stats</h2>
                <p className="text-muted-foreground">This helps us calculate accurate plans for you</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="175"
                    value={formData.height_cm || ''}
                    onChange={(e) => updateField('height_cm', e.target.value ? parseFloat(e.target.value) : null)}
                    className="input-field mt-2"
                  />
                </div>
                
                <div>
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="70"
                    value={formData.weight_kg || ''}
                    onChange={(e) => updateField('weight_kg', e.target.value ? parseFloat(e.target.value) : null)}
                    className="input-field mt-2"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="stress">Stress Level</Label>
                <Select value={formData.stress_level} onValueChange={(v) => updateField('stress_level', v)}>
                  <SelectTrigger className="input-field mt-2">
                    <SelectValue placeholder="Select stress level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="font-display text-2xl font-bold mb-2">Your Fitness Goals</h2>
                <p className="text-muted-foreground">Tell us what you want to achieve</p>
              </div>
              
              <div>
                <Label>Fitness Goal</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {['Weight Loss', 'Muscle Gain', 'Maintain Weight', 'Improve Endurance', 'Build Strength', 'General Fitness'].map((goal) => (
                    <button
                      key={goal}
                      onClick={() => updateField('fitness_goal', goal)}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        formData.fitness_goal === goal
                          ? 'border-primary bg-primary/10 text-foreground'
                          : 'border-border bg-card hover:border-primary/50'
                      }`}
                    >
                      <span className="font-medium">{goal}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Current Fitness Level</Label>
                <div className="grid grid-cols-3 gap-3 mt-2">
                  {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                    <button
                      key={level}
                      onClick={() => updateField('fitness_level', level)}
                      className={`p-4 rounded-xl border text-center transition-all ${
                        formData.fitness_level === level
                          ? 'border-primary bg-primary/10 text-foreground'
                          : 'border-border bg-card hover:border-primary/50'
                      }`}
                    >
                      <span className="font-medium">{level}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="font-display text-2xl font-bold mb-2">Preferences & Health</h2>
                <p className="text-muted-foreground">Final details to perfect your plan</p>
              </div>
              
              <div>
                <Label>Workout Location</Label>
                <div className="grid grid-cols-3 gap-3 mt-2">
                  {['Home', 'Gym', 'Outdoor'].map((loc) => (
                    <button
                      key={loc}
                      onClick={() => updateField('workout_location', loc)}
                      className={`p-4 rounded-xl border text-center transition-all ${
                        formData.workout_location === loc
                          ? 'border-primary bg-primary/10 text-foreground'
                          : 'border-border bg-card hover:border-primary/50'
                      }`}
                    >
                      <span className="font-medium">{loc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Dietary Preference</Label>
                <Select value={formData.dietary_preference} onValueChange={(v) => updateField('dietary_preference', v)}>
                  <SelectTrigger className="input-field mt-2">
                    <SelectValue placeholder="Select preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no_preference">No Preference</SelectItem>
                    <SelectItem value="vegetarian">Vegetarian</SelectItem>
                    <SelectItem value="vegan">Vegan</SelectItem>
                    <SelectItem value="non_vegetarian">Non-Vegetarian</SelectItem>
                    <SelectItem value="keto">Keto</SelectItem>
                    <SelectItem value="paleo">Paleo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="medical">Medical History (Optional)</Label>
                <Textarea
                  id="medical"
                  placeholder="Any injuries, conditions, or allergies we should know about..."
                  value={formData.medical_history}
                  onChange={(e) => updateField('medical_history', e.target.value)}
                  className="input-field mt-2 min-h-[100px]"
                />
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button variant="ghost" onClick={handleBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button variant="hero" onClick={handleNext}>
              {step === 4 ? 'Generate My Plan' : 'Continue'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
