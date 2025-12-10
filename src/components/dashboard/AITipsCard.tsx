import { motion } from 'framer-motion';
import { Lightbulb } from 'lucide-react';

interface AITipsCardProps {
  tips: string;
}

export function AITipsCard({ tips }: AITipsCardProps) {
  // Split tips by newline or period to create list
  const tipsList = tips
    .split(/[.\n]/)
    .map(t => t.trim())
    .filter(t => t.length > 10);

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
          <Lightbulb className="w-5 h-5 text-yellow-400" />
        </div>
        <div>
          <h3 className="font-display text-lg font-bold">AI Tips & Advice</h3>
          <p className="text-sm text-muted-foreground">Personalized recommendations</p>
        </div>
      </div>

      <ul className="space-y-3">
        {tipsList.slice(0, 5).map((tip, index) => (
          <motion.li
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start gap-3 text-sm"
          >
            <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 text-xs font-bold">
              {index + 1}
            </span>
            <span className="text-muted-foreground">{tip}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
