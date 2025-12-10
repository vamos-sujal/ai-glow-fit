import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, User, Sparkles, Users } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg">FitCoach AI</span>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            {user ? (
              <>
                <Button variant="ghost" onClick={() => navigate('/profiles')}>
                  <Users className="w-4 h-4 mr-2" />
                  Profiles
                </Button>
                <Button variant="ghost" onClick={() => navigate('/dashboard')}>
                  <User className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
                <Button variant="outline" onClick={signOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Button variant="hero" onClick={handleGetStarted}>
                Get Started
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="pt-16">
        <Hero onGetStarted={handleGetStarted} />
        <Features />

        {/* CTA Section */}
        <section className="py-24 px-4 relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(82_100%_50%/0.08),transparent_50%)]" />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center relative z-10"
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Join thousands who've already started their AI-powered fitness journey.
            </p>
            <Button variant="hero" size="xl" onClick={handleGetStarted}>
              {user ? 'Go to Dashboard' : 'Start Free Today'}
            </Button>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-primary-foreground" />
            </div>
            <span className="font-display font-semibold">FitCoach AI</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 FitCoach AI. Powered by AI.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
