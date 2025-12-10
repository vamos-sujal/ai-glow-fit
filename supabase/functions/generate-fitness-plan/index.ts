import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { profile } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an expert fitness coach and nutritionist. Generate personalized workout and diet plans based on user profiles. Always respond in valid JSON format.`;

    const userPrompt = `Create a comprehensive fitness plan for this user:
- Name: ${profile.full_name || 'User'}
- Age: ${profile.age || 'Not specified'}
- Gender: ${profile.gender || 'Not specified'}
- Height: ${profile.height_cm ? profile.height_cm + ' cm' : 'Not specified'}
- Weight: ${profile.weight_kg ? profile.weight_kg + ' kg' : 'Not specified'}
- Fitness Goal: ${profile.fitness_goal || 'General fitness'}
- Fitness Level: ${profile.fitness_level || 'Beginner'}
- Workout Location: ${profile.workout_location || 'Home'}
- Dietary Preference: ${profile.dietary_preference || 'No preference'}
- Medical History: ${profile.medical_history || 'None'}
- Stress Level: ${profile.stress_level || 'Moderate'}

Respond with ONLY a valid JSON object (no markdown, no code blocks) in this exact format:
{
  "workout_plan": {
    "weekly_schedule": [
      {
        "day": "Monday",
        "focus": "Upper Body",
        "exercises": [
          {
            "name": "Exercise Name",
            "sets": 3,
            "reps": "10-12",
            "rest": "60 seconds",
            "description": "Brief description"
          }
        ],
        "duration": "45 minutes"
      }
    ],
    "warm_up": ["Exercise 1", "Exercise 2"],
    "cool_down": ["Stretch 1", "Stretch 2"]
  },
  "diet_plan": {
    "daily_calories": 2000,
    "macros": { "protein": "30%", "carbs": "40%", "fats": "30%" },
    "meals": [
      {
        "meal": "Breakfast",
        "time": "7:00 AM",
        "foods": [
          { "name": "Food item", "portion": "1 cup", "calories": 200 }
        ]
      },
      {
        "meal": "Lunch",
        "time": "12:00 PM",
        "foods": [
          { "name": "Food item", "portion": "1 serving", "calories": 400 }
        ]
      },
      {
        "meal": "Dinner",
        "time": "7:00 PM",
        "foods": [
          { "name": "Food item", "portion": "1 serving", "calories": 500 }
        ]
      },
      {
        "meal": "Snacks",
        "time": "Various",
        "foods": [
          { "name": "Snack item", "portion": "1 piece", "calories": 150 }
        ]
      }
    ],
    "hydration": "8-10 glasses of water daily"
  },
  "ai_tips": "3-5 personalized lifestyle and posture tips",
  "motivation_quote": "An inspiring motivational message"
}

Make the plan realistic, actionable, and tailored to the user's specific needs. Include 5-7 days of workouts and detailed meal plans.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Usage limit reached. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in AI response");
    }

    // Parse the JSON response - handle potential markdown code blocks
    let cleanContent = content.trim();
    if (cleanContent.startsWith("```json")) {
      cleanContent = cleanContent.slice(7);
    } else if (cleanContent.startsWith("```")) {
      cleanContent = cleanContent.slice(3);
    }
    if (cleanContent.endsWith("```")) {
      cleanContent = cleanContent.slice(0, -3);
    }
    cleanContent = cleanContent.trim();

    const plan = JSON.parse(cleanContent);

    return new Response(JSON.stringify(plan), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Error generating fitness plan:", error);
    const message = error instanceof Error ? error.message : "Failed to generate fitness plan";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
