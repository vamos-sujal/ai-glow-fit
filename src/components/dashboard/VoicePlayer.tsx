import { useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Loader2, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { FitnessPlan } from '@/types/fitness';

interface VoicePlayerProps {
  plan: FitnessPlan;
}

export function VoicePlayer({ plan }: VoicePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [selectedSection, setSelectedSection] = useState<'workout' | 'diet'>('workout');

  const formatPlanForSpeech = (section: 'workout' | 'diet') => {
    if (section === 'workout' && plan.workout_plan) {
      let text = "Here is your workout plan. ";
      plan.workout_plan.weekly_schedule?.forEach(day => {
        text += `${day.day}, ${day.focus}. `;
        day.exercises?.forEach(ex => {
          text += `${ex.name}, ${ex.sets} sets of ${ex.reps} reps with ${ex.rest} rest. `;
        });
      });
      return text;
    } else if (section === 'diet' && plan.diet_plan) {
      let text = `Your daily calorie target is ${plan.diet_plan.daily_calories} calories. `;
      plan.diet_plan.meals?.forEach(meal => {
        text += `For ${meal.meal} at ${meal.time}: `;
        meal.foods?.forEach(food => {
          text += `${food.name}, ${food.portion}. `;
        });
      });
      return text;
    }
    return "";
  };

  const playAudio = async () => {
    if (audioElement) {
      if (isPlaying) {
        audioElement.pause();
        setIsPlaying(false);
      } else {
        audioElement.play();
        setIsPlaying(true);
      }
      return;
    }

    setIsLoading(true);
    try {
      const text = formatPlanForSpeech(selectedSection);
      
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { text }
      });

      if (error) throw error;
      
      if (data?.error?.includes('API key not configured')) {
        toast.error('Voice feature requires ElevenLabs API key. Add it in settings.');
        setIsLoading(false);
        return;
      }

      if (data?.audioContent) {
        const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
        audio.onended = () => setIsPlaying(false);
        setAudioElement(audio);
        audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error with voice:', error);
      toast.error('Voice playback unavailable');
    } finally {
      setIsLoading(false);
    }
  };

  const stopAudio = () => {
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
      setIsPlaying(false);
    }
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
          <Volume2 className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-display text-lg font-bold">Voice Guidance</h3>
          <p className="text-sm text-muted-foreground">Listen to your plan</p>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <Button
          variant={selectedSection === 'workout' ? 'default' : 'outline'}
          size="sm"
          onClick={() => {
            setSelectedSection('workout');
            setAudioElement(null);
          }}
        >
          Workout
        </Button>
        <Button
          variant={selectedSection === 'diet' ? 'default' : 'outline'}
          size="sm"
          onClick={() => {
            setSelectedSection('diet');
            setAudioElement(null);
          }}
        >
          Diet
        </Button>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={playAudio}
          disabled={isLoading}
          className="flex-1"
          variant="glass"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : isPlaying ? (
            <Pause className="w-4 h-4 mr-2" />
          ) : (
            <Play className="w-4 h-4 mr-2" />
          )}
          {isLoading ? 'Loading...' : isPlaying ? 'Pause' : 'Play'}
        </Button>
        {audioElement && (
          <Button variant="outline" onClick={stopAudio}>
            <VolumeX className="w-4 h-4" />
          </Button>
        )}
      </div>

      {isPlaying && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center gap-1 mt-4"
        >
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ height: [8, 24, 8] }}
              transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
              className="w-1 bg-primary rounded-full"
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}
