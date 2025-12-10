import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Play, Pause, StopCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FitnessPlan } from '@/types/fitness';

interface VoicePlayerBrowserProps {
  plan: FitnessPlan;
}

export function VoicePlayerBrowser({ plan }: VoicePlayerBrowserProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedSection, setSelectedSection] = useState<'workout' | 'diet'>('workout');
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

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

  const playAudio = () => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech not supported in this browser');
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
      return;
    }

    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPlaying(true);
      return;
    }

    const text = formatPlanForSpeech(selectedSection);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    // Get available voices and prefer a natural English voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => 
      v.name.includes('Google') || v.name.includes('Natural') || v.lang.startsWith('en')
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);
    
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  const stopAudio = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  };

  const handleSectionChange = (section: 'workout' | 'diet') => {
    stopAudio();
    setSelectedSection(section);
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
          onClick={() => handleSectionChange('workout')}
        >
          Workout
        </Button>
        <Button
          variant={selectedSection === 'diet' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleSectionChange('diet')}
        >
          Diet
        </Button>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={playAudio}
          className="flex-1"
          variant="glass"
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 mr-2" />
          ) : (
            <Play className="w-4 h-4 mr-2" />
          )}
          {isPlaying ? 'Pause' : 'Play'}
        </Button>
        {isPlaying && (
          <Button variant="outline" onClick={stopAudio}>
            <StopCircle className="w-4 h-4" />
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
