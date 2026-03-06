console.log("🔥 GEMINI SERVICE LOADED - v3");

const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const FREE_MODEL = "gemini-2.5-flash";

// ================= PCOS PREDICTION =================
const getPCOSPrediction = async (userData) => {
  try {
    const prompt = `
Analyze the following health data for a PCOS patient and create a fully personalized health management plan.

Return ONLY VALID JSON with no markdown, no code block, just raw JSON object.

User Data:
Age: ${userData.age}
Weight: ${userData.weight} kg
Height: ${userData.height} cm
Main Meal: ${userData.mainMeal}
Family History: ${userData.familyHistory?.join(", ") || "None"}
Meals Per Day: ${userData.mealsPerDay}
Diet Pattern: ${userData.dietPattern}
Smoking: ${userData.smoking}
PCOS Diagnosis: ${userData.diagnosed}
Menstrual Cycle Length: ${userData.cycleLength}
Symptoms: ${userData.symptoms?.join(", ") || "None"}

Respond with ONLY this JSON (all fields required, tailored specifically to this user's symptoms and data):
{
  "pcosPrediction": "High Probability / Possible PCOS / Low Risk",
  "riskLevel": "High / Medium / Low",
  "BMI": "calculated BMI as string",
  "symptomScore": 0,
  "lifestyleScore": 0,
  "menstrualIrregularity": "Regular / Irregular / Highly Irregular",
  "hormoneBalanceTips": ["tip1", "tip2", "tip3", "tip4"],
  "personalizedMessage": "personalized message for this user",
  "dietPlan": {
    "todayFocus": "One sentence describing today's key dietary focus for this user based on their symptoms",
    "mealPlan": [
      { "time": "Breakfast", "icon": "🌅", "items": ["food1 specific to user", "food2", "food3"] },
      { "time": "Lunch", "icon": "☀️", "items": ["food1 specific to user", "food2", "food3"] },
      { "time": "Dinner", "icon": "🌙", "items": ["food1 specific to user", "food2", "food3"] },
      { "time": "Snacks", "icon": "🍎", "items": ["snack1 specific to user", "snack2", "snack3"] }
    ],
    "nutritionTips": [
      { "text": "Personalized tip 1 for this user", "tag": "Category", "tagColor": "bg-blue-100 text-blue-700" },
      { "text": "Personalized tip 2 for this user", "tag": "Category", "tagColor": "bg-green-100 text-green-700" },
      { "text": "Personalized tip 3 for this user", "tag": "Category", "tagColor": "bg-amber-100 text-amber-700" },
      { "text": "Personalized tip 4 for this user", "tag": "Category", "tagColor": "bg-purple-100 text-purple-700" }
    ],
    "aiInsight": "2-3 sentences of AI dietary insight personalized to this user's symptoms and risk level"
  },
  "exercisePlan": {
    "weeklySchedule": [
      { "day": "Mon", "focus": "Exercise type", "exercises": ["exercise 1 sets×reps", "exercise 2", "exercise 3"], "icon": "💪", "color": "from-blue-500 to-indigo-500" },
      { "day": "Tue", "focus": "Exercise type", "exercises": ["exercise 1", "exercise 2", "exercise 3"], "icon": "🏃", "color": "from-red-500 to-rose-500" },
      { "day": "Wed", "focus": "Exercise type", "exercises": ["exercise 1", "exercise 2", "exercise 3"], "icon": "🧘", "color": "from-purple-500 to-violet-500" },
      { "day": "Thu", "focus": "Exercise type", "exercises": ["exercise 1", "exercise 2", "exercise 3"], "icon": "💪", "color": "from-blue-500 to-indigo-500" },
      { "day": "Fri", "focus": "Exercise type", "exercises": ["exercise 1", "exercise 2", "exercise 3"], "icon": "🔥", "color": "from-orange-500 to-amber-500" },
      { "day": "Sat", "focus": "Exercise type", "exercises": ["exercise 1", "exercise 2", "exercise 3"], "icon": "🤸", "color": "from-green-500 to-emerald-500" },
      { "day": "Sun", "focus": "Rest", "exercises": ["Light walk", "Meditation", "Deep breathing"], "icon": "😴", "color": "from-slate-400 to-slate-500" }
    ],
    "aiInsight": "2-3 sentences personalizing the exercise plan to this user's PCOS risk, BMI, and symptoms"
  },
  "stressPlan": {
    "todayFocus": "One sentence describing today's key stress management focus based on this user's symptoms",
    "techniques": [
      { "title": "Technique Name", "desc": "Step-by-step instructions for this technique", "icon": "🌬️", "tag": "Category", "tagColor": "bg-blue-100 text-blue-700" },
      { "title": "Technique Name", "desc": "Step-by-step instructions", "icon": "🌍", "tag": "Category", "tagColor": "bg-green-100 text-green-700" },
      { "title": "Technique Name", "desc": "Step-by-step instructions", "icon": "💆", "tag": "Category", "tagColor": "bg-purple-100 text-purple-700" },
      { "title": "Technique Name", "desc": "Step-by-step instructions", "icon": "📝", "tag": "Category", "tagColor": "bg-amber-100 text-amber-700" },
      { "title": "Technique Name", "desc": "Step-by-step instructions", "icon": "🌿", "tag": "Category", "tagColor": "bg-emerald-100 text-emerald-700" },
      { "title": "Technique Name", "desc": "Step-by-step instructions", "icon": "🧘", "tag": "Category", "tagColor": "bg-indigo-100 text-indigo-700" }
    ],
    "weeklyFocus": [
      { "day": "Mon–Wed", "focus": "Activity focus for early week", "icon": "🌬️" },
      { "day": "Thu–Fri", "focus": "Activity focus for mid week", "icon": "📝" },
      { "day": "Sat–Sun", "focus": "Activity focus for weekend", "icon": "🍃" }
    ],
    "aiInsight": "2-3 sentences of AI stress insight personalized to this user's cortisol, symptoms, and cycle"
  },
  "skinHairPlan": {
    "todayFocus": "One sentence describing today's key skin/hair focus based on this user's symptoms",
    "skinTips": [
      { "title": "Tip Title", "desc": "Personalized skin tip for this user based on their symptoms", "icon": "🧴", "tag": "Category", "tagColor": "bg-blue-100 text-blue-700" },
      { "title": "Tip Title", "desc": "Personalized skin tip", "icon": "💧", "tag": "Category", "tagColor": "bg-purple-100 text-purple-700" },
      { "title": "Tip Title", "desc": "Personalized skin tip", "icon": "☀️", "tag": "Category", "tagColor": "bg-amber-100 text-amber-700" },
      { "title": "Tip Title", "desc": "Personalized skin tip", "icon": "🌿", "tag": "Category", "tagColor": "bg-green-100 text-green-700" }
    ],
    "hairTips": [
      { "title": "Tip Title", "desc": "Personalized hair tip for this user based on their symptoms", "icon": "💆", "tag": "Category", "tagColor": "bg-blue-100 text-blue-700" },
      { "title": "Tip Title", "desc": "Personalized hair tip", "icon": "💊", "tag": "Category", "tagColor": "bg-teal-100 text-teal-700" },
      { "title": "Tip Title", "desc": "Personalized hair tip", "icon": "🍵", "tag": "Category", "tagColor": "bg-emerald-100 text-emerald-700" },
      { "title": "Tip Title", "desc": "Personalized hair tip", "icon": "🥜", "tag": "Category", "tagColor": "bg-orange-100 text-orange-700" }
    ],
    "aiInsight": "2-3 sentences of AI skin/hair insight personalized to this user's androgen levels and hormonal symptoms"
  }
}
`;

    console.log("✅ Calling Gemini for PCOS prediction, model:", FREE_MODEL);

    const response = await ai.models.generateContent({
      model: FREE_MODEL,
      contents: prompt,
    });

    const text = response.text;
    console.log("✅ Gemini PCOS raw response length:", text.length);

    // Extract JSON - handle markdown code blocks too
    let jsonStr = text;
    const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlockMatch) jsonStr = codeBlockMatch[1];
    const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      console.error("❌ No JSON found in response:", text.substring(0, 200));
      throw new Error("Invalid AI JSON response");
    }

    const result = JSON.parse(jsonMatch[0]);
    console.log("✅ PCOS analysis complete, riskLevel:", result.riskLevel);
    return result;

  } catch (error) {
    console.error("❌ GEMINI PCOS ERROR:", error.message);
    console.error("❌ ERROR STACK:", error.stack);

    return {
      pcosPrediction: "Analysis Failed",
      riskLevel: "Unknown",
      BMI: "0",
      symptomScore: 0,
      lifestyleScore: 0,
      menstrualIrregularity: "Unknown",
      hormoneBalanceTips: [
        "Maintain balanced diet",
        "Exercise regularly",
        "Consult healthcare professional"
      ],
      personalizedMessage: "We could not complete AI analysis right now. Please try again.",
      dietPlan: null,
      exercisePlan: null,
      stressPlan: null,
      skinHairPlan: null,
    };
  }
};

// ================= CHATBOT =================
const getChatbotResponse = async (context, userMessage) => {
  try {
    const prompt = `
You are Saheli AI Assistant — a compassionate expert in PCOS care and women's health.

User Health Context:
${JSON.stringify(context, null, 2)}

User Question: ${userMessage}

Rules:
- Be empathetic and supportive
- Provide PCOS-focused guidance based on their health context
- Keep response under 4 sentences
- Do NOT use markdown formatting in your response
`;

    console.log("✅ Calling Gemini for chatbot...");

    const response = await ai.models.generateContent({
      model: FREE_MODEL,
      contents: prompt,
    });

    const text = response.text;
    console.log("✅ Chatbot response received, length:", text.length);
    return text;

  } catch (error) {
    console.error("❌ CHATBOT GEMINI ERROR:", error.message);
    if (error.message?.includes("429")) {
      return "I'm receiving too many requests right now. Please wait a moment and try again.";
    }
    return "I'm temporarily offline. Please try again in a moment.";
  }
};

module.exports = {
  getPCOSPrediction,
  getChatbotResponse
};