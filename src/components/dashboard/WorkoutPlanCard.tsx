import { useState } from 'react';
import { motion } from 'framer-motion';
import { Dumbbell, ChevronDown, ChevronUp, Clock, Repeat, Timer, ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WorkoutPlan, Exercise } from '@/types/fitness';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface WorkoutPlanCardProps {
  plan: WorkoutPlan;
}

export function WorkoutPlanCard({ plan }: WorkoutPlanCardProps) {
  const [expandedDay, setExpandedDay] = useState<string | null>(null);
  const [generatingImage, setGeneratingImage] = useState<string | null>(null);
  const [exerciseImages, setExerciseImages] = useState<Record<string, string>>({});

  const generateExerciseImage = async (exerciseName: string) => {
    setGeneratingImage(exerciseName);
    try {
      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: { prompt: exerciseName, type: 'exercise' }
      });

      if (error) throw error;
      
      if (data?.imageUrl) {
        setExerciseImages(prev => ({ ...prev, [exerciseName]: data.imageUrl }));
      }
    } catch (error) {
      console.error('Error generating image:', error);
      toast.error('Failed to generate image');
    } finally {
      setGeneratingImage(null);
    }
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
          <Dumbbell className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-display text-xl font-bold">Workout Plan</h3>
          <p className="text-sm text-muted-foreground">Your weekly exercise routine</p>
        </div>
      </div>

      {/* Warm-up */}
      {plan.warm_up && plan.warm_up.length > 0 && (
        <div className="mb-4 p-4 rounded-xl bg-secondary/50">
          <h4 className="font-semibold text-sm text-muted-foreground mb-2">Warm-up</h4>
          <div className="flex flex-wrap gap-2">
            {plan.warm_up.map((item, i) => (
              <span key={i} className="px-3 py-1 rounded-full bg-card text-sm">{item}</span>
            ))}
          </div>
        </div>
      )}

      {/* Weekly Schedule */}
      <div className="space-y-3">
        {plan.weekly_schedule?.map((day, index) => (
          <motion.div
            key={day.day}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="border border-border rounded-xl overflow-hidden"
          >
            <button
              onClick={() => setExpandedDay(expandedDay === day.day ? null : day.day)}
              className="w-full p-4 flex items-center justify-between hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <span className="font-display font-bold text-primary">{day.day}</span>
                <span className="text-muted-foreground">|</span>
                <span className="font-medium">{day.focus}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {day.duration}
                </span>
                {expandedDay === day.day ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </div>
            </button>

            {expandedDay === day.day && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-t border-border"
              >
                <div className="p-4 space-y-4">
                  {day.exercises?.map((exercise, i) => (
                    <div key={i} className="p-4 rounded-xl bg-secondary/30">
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-semibold">{exercise.name}</h5>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => generateExerciseImage(exercise.name)}
                          disabled={!!generatingImage}
                        >
                          {generatingImage === exercise.name ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <ImageIcon className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                      
                      {exerciseImages[exercise.name] && (
                        <img
                          src={exerciseImages[exercise.name]}
                          alt={exercise.name}
                          className="w-full h-48 object-cover rounded-lg mb-3"
                        />
                      )}
                      
                      <p className="text-sm text-muted-foreground mb-3">{exercise.description}</p>
                      
                      <div className="flex flex-wrap gap-3">
                        <span className="flex items-center gap-1 text-sm bg-card px-3 py-1 rounded-full">
                          <Repeat className="w-3 h-3" />
                          {exercise.sets} sets
                        </span>
                        <span className="flex items-center gap-1 text-sm bg-card px-3 py-1 rounded-full">
                          <Dumbbell className="w-3 h-3" />
                          {exercise.reps} reps
                        </span>
                        <span className="flex items-center gap-1 text-sm bg-card px-3 py-1 rounded-full">
                          <Timer className="w-3 h-3" />
                          {exercise.rest} rest
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Cool-down */}
      {plan.cool_down && plan.cool_down.length > 0 && (
        <div className="mt-4 p-4 rounded-xl bg-secondary/50">
          <h4 className="font-semibold text-sm text-muted-foreground mb-2">Cool-down</h4>
          <div className="flex flex-wrap gap-2">
            {plan.cool_down.map((item, i) => (
              <span key={i} className="px-3 py-1 rounded-full bg-card text-sm">{item}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
