import { motion } from 'framer-motion';
import { User, Target, Dumbbell, MapPin, Utensils, Activity, Calendar, Ruler, Scale } from 'lucide-react';
import { FitnessProfile } from '@/types/fitness';

interface ProfileInfoCardProps {
  profile: FitnessProfile;
}

export function ProfileInfoCard({ profile }: ProfileInfoCardProps) {
  const infoItems = [
    { icon: User, label: 'Name', value: profile.full_name },
    { icon: Calendar, label: 'Age', value: profile.age ? `${profile.age} years` : null },
    { icon: User, label: 'Gender', value: profile.gender },
    { icon: Ruler, label: 'Height', value: profile.height_cm ? `${profile.height_cm} cm` : null },
    { icon: Scale, label: 'Weight', value: profile.weight_kg ? `${profile.weight_kg} kg` : null },
    { icon: Target, label: 'Goal', value: profile.fitness_goal },
    { icon: Dumbbell, label: 'Level', value: profile.fitness_level },
    { icon: MapPin, label: 'Location', value: profile.workout_location },
    { icon: Utensils, label: 'Diet', value: profile.dietary_preference },
    { icon: Activity, label: 'Stress', value: profile.stress_level },
  ].filter(item => item.value);

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
          <User className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-display text-lg font-bold">Profile Details</h3>
          <p className="text-sm text-muted-foreground">{profile.profile_name}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {infoItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex flex-col items-center p-3 rounded-xl bg-secondary/50 text-center"
          >
            <item.icon className="w-4 h-4 text-primary mb-2" />
            <span className="text-xs text-muted-foreground mb-1">{item.label}</span>
            <span className="text-sm font-medium">{item.value}</span>
          </motion.div>
        ))}
      </div>

      {profile.medical_history && (
        <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <p className="text-sm text-amber-500">
            <strong>Medical Note:</strong> {profile.medical_history}
          </p>
        </div>
      )}
    </div>
  );
}
