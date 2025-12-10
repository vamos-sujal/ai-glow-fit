import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Dumbbell, Zap, Target } from 'lucide-react';

interface HeroProps {
  onGetStarted: () => void;
}

export function Hero({ onGetStarted }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,hsl(var(--primary)/0.12),transparent_50%)]" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      
      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
            <Zap className="w-4 h-4" />
            AI-Powered Fitness Coach
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6"
        >
          Transform Your
          <span className="block text-gradient">Fitness Journey</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
        >
          Get personalized workout and diet plans powered by AI. 
          Voice guidance, visual demonstrations, and daily motivation—all in one app.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
        >
          <Button variant="hero" size="xl" onClick={onGetStarted}>
            <Dumbbell className="w-5 h-5 mr-2" />
            Start Your Journey
          </Button>
          <Button 
            variant="glass" 
            size="xl"
            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <Target className="w-5 h-5 mr-2" />
            Learn More
          </Button>
        </motion.div>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-3"
        >
          {['AI Workout Plans', 'Custom Diet Plans', 'Voice Guidance', 'Image Generation'].map((feature, i) => (
            <span
              key={feature}
              className="px-4 py-2 rounded-full bg-card/50 border border-border/50 text-sm text-muted-foreground"
            >
              {feature}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Floating elements */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/3 right-10 hidden lg:block"
      >
        <div className="w-16 h-16 rounded-2xl bg-primary/20 backdrop-blur border border-primary/30 flex items-center justify-center">
          <Dumbbell className="w-8 h-8 text-primary" />
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-1/3 left-10 hidden lg:block"
      >
        <div className="w-14 h-14 rounded-xl bg-card/50 backdrop-blur border border-border/50 flex items-center justify-center">
          <Target className="w-7 h-7 text-muted-foreground" />
        </div>
      </motion.div>
    </section>
  );
}
