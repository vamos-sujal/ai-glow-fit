import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, RefreshCw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

interface MotivationCardProps {
  initialQuote?: string;
}

export function MotivationCard({ initialQuote }: MotivationCardProps) {
  const [quote, setQuote] = useState(initialQuote || "Every workout brings you closer to the best version of yourself.");
  const [isLoading, setIsLoading] = useState(false);

  const fetchNewQuote = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('daily-motivation');
      if (error) throw error;
      if (data?.quote) {
        setQuote(data.quote);
      }
    } catch (error) {
      console.error('Error fetching motivation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!initialQuote) {
      fetchNewQuote();
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 relative overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(82_100%_50%/0.1),transparent_70%)]" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Daily Motivation</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchNewQuote}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
          </Button>
        </div>
        
        <blockquote className="font-display text-lg md:text-xl font-medium italic text-foreground leading-relaxed">
          "{quote}"
        </blockquote>
      </div>
    </motion.div>
  );
}
