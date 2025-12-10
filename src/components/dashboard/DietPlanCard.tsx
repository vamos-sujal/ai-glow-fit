import { useState } from 'react';
import { motion } from 'framer-motion';
import { Utensils, Flame, Droplets, ChevronDown, ChevronUp, ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DietPlan } from '@/types/fitness';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface DietPlanCardProps {
  plan: DietPlan;
}

export function DietPlanCard({ plan }: DietPlanCardProps) {
  const [expandedMeal, setExpandedMeal] = useState<string | null>(null);
  const [generatingImage, setGeneratingImage] = useState<string | null>(null);
  const [foodImages, setFoodImages] = useState<Record<string, string>>({});

  const generateFoodImage = async (foodName: string) => {
    setGeneratingImage(foodName);
    try {
      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: { prompt: foodName, type: 'food' }
      });

      if (error) throw error;
      
      if (data?.imageUrl) {
        setFoodImages(prev => ({ ...prev, [foodName]: data.imageUrl }));
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
          <Utensils className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-display text-xl font-bold">Diet Plan</h3>
          <p className="text-sm text-muted-foreground">Your daily nutrition guide</p>
        </div>
      </div>

      {/* Macros Overview */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="p-4 rounded-xl bg-primary/10 text-center">
          <Flame className="w-5 h-5 text-primary mx-auto mb-1" />
          <p className="font-display text-2xl font-bold">{plan.daily_calories}</p>
          <p className="text-xs text-muted-foreground">Daily Calories</p>
        </div>
        <div className="p-4 rounded-xl bg-secondary text-center">
          <p className="text-sm text-muted-foreground mb-1">Protein</p>
          <p className="font-display text-xl font-bold text-primary">{plan.macros?.protein}</p>
        </div>
        <div className="p-4 rounded-xl bg-secondary text-center">
          <p className="text-sm text-muted-foreground mb-1">Carbs</p>
          <p className="font-display text-xl font-bold">{plan.macros?.carbs}</p>
        </div>
      </div>

      {/* Hydration */}
      <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-500/10 mb-6">
        <Droplets className="w-5 h-5 text-blue-400" />
        <p className="text-sm">{plan.hydration}</p>
      </div>

      {/* Meals */}
      <div className="space-y-3">
        {plan.meals?.map((meal, index) => (
          <motion.div
            key={meal.meal}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="border border-border rounded-xl overflow-hidden"
          >
            <button
              onClick={() => setExpandedMeal(expandedMeal === meal.meal ? null : meal.meal)}
              className="w-full p-4 flex items-center justify-between hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <span className="font-display font-bold text-primary">{meal.meal}</span>
                <span className="text-sm text-muted-foreground">{meal.time}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">
                  {meal.foods?.reduce((sum, f) => sum + f.calories, 0)} cal
                </span>
                {expandedMeal === meal.meal ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </div>
            </button>

            {expandedMeal === meal.meal && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-t border-border"
              >
                <div className="p-4 space-y-3">
                  {meal.foods?.map((food, i) => (
                    <div key={i} className="p-3 rounded-xl bg-secondary/30">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h5 className="font-semibold">{food.name}</h5>
                          <p className="text-sm text-muted-foreground">{food.portion}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-primary">{food.calories} cal</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => generateFoodImage(food.name)}
                            disabled={!!generatingImage}
                          >
                            {generatingImage === food.name ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <ImageIcon className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      
                      {foodImages[food.name] && (
                        <img
                          src={foodImages[food.name]}
                          alt={food.name}
                          className="w-full h-32 object-cover rounded-lg mt-2"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
