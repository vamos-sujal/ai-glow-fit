import { useState } from 'react';
import { FileDown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { FitnessPlan } from '@/types/fitness';
import jsPDF from 'jspdf';

interface ExportButtonProps {
  plan: FitnessPlan;
  userName?: string;
}

export function ExportButton({ plan, userName }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const exportToPDF = async () => {
    setIsExporting(true);
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      let y = 20;

      // Title
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('Your Fitness Plan', pageWidth / 2, y, { align: 'center' });
      y += 10;

      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100);
      doc.text(`Generated for ${userName || 'You'}`, pageWidth / 2, y, { align: 'center' });
      y += 20;

      // Motivation Quote
      if (plan.motivation_quote) {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(80);
        const quoteLines = doc.splitTextToSize(`"${plan.motivation_quote}"`, pageWidth - 40);
        doc.text(quoteLines, pageWidth / 2, y, { align: 'center' });
        y += quoteLines.length * 5 + 15;
      }

      // Workout Plan
      doc.setTextColor(0);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Workout Plan', 20, y);
      y += 10;

      plan.workout_plan?.weekly_schedule?.forEach(day => {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(`${day.day} - ${day.focus}`, 20, y);
        y += 6;

        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        day.exercises?.forEach(ex => {
          if (y > 280) {
            doc.addPage();
            y = 20;
          }
          doc.text(`• ${ex.name}: ${ex.sets} sets × ${ex.reps} (${ex.rest} rest)`, 25, y);
          y += 5;
        });
        y += 5;
      });

      // Diet Plan
      doc.addPage();
      y = 20;
      
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Diet Plan', 20, y);
      y += 10;

      doc.setFontSize(11);
      doc.text(`Daily Calories: ${plan.diet_plan?.daily_calories}`, 20, y);
      y += 8;

      if (plan.diet_plan?.macros) {
        doc.setFont('helvetica', 'normal');
        doc.text(`Macros: Protein ${plan.diet_plan.macros.protein}, Carbs ${plan.diet_plan.macros.carbs}, Fats ${plan.diet_plan.macros.fats}`, 20, y);
        y += 12;
      }

      plan.diet_plan?.meals?.forEach(meal => {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text(`${meal.meal} (${meal.time})`, 20, y);
        y += 6;

        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        meal.foods?.forEach(food => {
          doc.text(`• ${food.name} - ${food.portion} (${food.calories} cal)`, 25, y);
          y += 5;
        });
        y += 5;
      });

      // AI Tips
      if (plan.ai_tips) {
        if (y > 230) {
          doc.addPage();
          y = 20;
        }
        
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Tips & Advice', 20, y);
        y += 8;

        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        const tipsLines = doc.splitTextToSize(plan.ai_tips, pageWidth - 40);
        doc.text(tipsLines, 20, y);
      }

      doc.save('fitness-plan.pdf');
      toast.success('Plan exported successfully!');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export plan');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button variant="outline" onClick={exportToPDF} disabled={isExporting}>
      {isExporting ? (
        <Loader2 className="w-4 h-4 animate-spin mr-2" />
      ) : (
        <FileDown className="w-4 h-4 mr-2" />
      )}
      Export PDF
    </Button>
  );
}
