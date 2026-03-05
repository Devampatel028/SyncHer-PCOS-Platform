const GEMINI_MODEL = "gemini-3-flash-preview"; // ✅ CONFIRMED WORKING
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth");

const HealthAssessment = require("../models/HealthAssessment");
const AIReport = require("../models/AIReport");
const User = require("../models/User");

// ✅ Call Gemini DIRECTLY here — no external service module to avoid stale cache
const { GoogleGenAI } = require("@google/genai");

// ======================================================
// ✅ SUBMIT HEALTH ASSESSMENT
// ======================================================
router.post("/submit", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    console.log("✅ [ASSESSMENT] Route hit for user:", userId);
    console.log("✅ [ASSESSMENT] Form data received:", JSON.stringify(req.body).substring(0, 200));

    // Save questionnaire
    const assessment = new HealthAssessment({ userId, questionnaireAnswers: req.body });
    await assessment.save();
    console.log("✅ [ASSESSMENT] Saved to DB");

    // ---- CALL GEMINI DIRECTLY ----
    const data = req.body;
    const bmiCalc = (data.weight / ((data.height / 100) ** 2)).toFixed(1);
    const bmiNum = parseFloat(bmiCalc);

    // Classify BMI into category
    let bmiCategory;
    if (bmiNum < 16) bmiCategory = "Very Underweight (Severely below healthy range)";
    else if (bmiNum < 18.5) bmiCategory = "Underweight (Below healthy range)";
    else if (bmiNum < 25) bmiCategory = "Normal / Healthy Weight";
    else if (bmiNum < 30) bmiCategory = "Overweight";
    else if (bmiNum < 35) bmiCategory = "Obese (Class I)";
    else if (bmiNum < 40) bmiCategory = "Very Obese (Class II)";
    else bmiCategory = "Extremely Obese (Class III – requires urgent intervention)";

    const prompt = `
Analyze the following health data for a PCOS patient and create a fully personalized, BMI-aware health management plan.
Return ONLY VALID JSON with no markdown, no code block, just raw JSON.

Patient Data:
- Age: ${data.age}
- Weight: ${data.weight} kg
- Height: ${data.height} cm
- BMI: ${bmiCalc} → Category: ${bmiCategory}
- Main Meal: ${data.mainMeal}
- Family History: ${Array.isArray(data.familyHistory) ? data.familyHistory.join(", ") : data.familyHistory || "None"}
- Meals Per Day: ${data.mealsPerDay}
- Diet Pattern: ${data.dietPattern}
- Smoking: ${data.smoking}
- PCOS Diagnosis Status: ${data.diagnosed}
- Menstrual Cycle Length: ${data.cycleLength}
- Symptoms: ${Array.isArray(data.symptoms) ? data.symptoms.join(", ") : data.symptoms || "None"}

CRITICAL INSTRUCTIONS — tailor ALL recommendations based on BOTH:
1. PCOS risk level (from symptoms + diagnosis)
2. BMI category: "${bmiCategory}"
   - Very Underweight → focus on calorie-dense nutrient-rich foods, gentle exercise, no caloric deficit
   - Underweight → mild caloric surplus, strength building, hormone-supporting nutrients
   - Normal → maintenance diet, balanced exercise, hormone optimization
   - Overweight → moderate caloric deficit, insulin-sensitizing foods, cardio + strength mix
   - Obese / Very Obese / Extremely Obese → stronger caloric restriction guidance, low-GI anti-inflammatory foods, low-impact cardio first, progressive intensity
3. DIETARY PREFERENCE STRICT ENFORCEMENT: The user's Diet Pattern is "${data.dietPattern}". You have strict negative constraints:
   - If Vegetarian: ABSOLUTELY NO meat, fish, poultry, OR EGGS. (In India, Vegetarian means lacto-vegetarian, no eggs allowed).
   - If Vegan: ABSOLUTELY NO animal products (no dairy, no eggs, no honey).
   - If Gluten-Free: MUST explicitly suggest gluten-free alternatives for carbs.
   - If Keto: ABSOLUTELY NO high-carb foods (no rice, bread, sugar). Focus on healthy fats.
   FAILURE TO COMPLY WITH "${data.dietPattern}" WILL RESULT IN A SEVERE PENALTY.

4. CONTENT PARROTING PREVENTION: YOU MUST GENERATE ACTUAL, PERSONALIZED CONTENT FOR EVERY SINGLE FIELD BELLOW. 
   - DO NOT output the placeholder text like "3-4 specific food items" or "Specific nutrition tip 1". 
   - YOU MUST WRITE REAL MEALS, REAL EXERCISES, REAL STRESS TECHNIQUES, AND REAL SKINCARE ADVICE.

Return ONLY this JSON (all fields required, recommendations must reflect the BMI category, follow the "${data.dietPattern}" diet STRICTLY, and contain NO PLACEHOLDERS):
{
  "pcosPrediction": "High Probability of PCOS / Possible PCOS / Low PCOS Risk",
  "riskLevel": "High / Medium / Low",
  "BMI": "${bmiCalc}",
  "bmiCategory": "${bmiCategory}",
  "symptomScore": <number 1-10>,
  "lifestyleScore": <number 1-10>,
  "menstrualIrregularity": "Regular / Irregular / Highly Irregular",
  "hormoneBalanceTips": ["4 personalized short tips reflecting BMI+PCOS"],
  "personalizedMessage": "A warm, 2-sentence personalized message reflecting BMI category and PCOS status",
  "dietModule": {
    "todayFocus": "One sentence dietary focus for this patient based on their symptoms",
    "mealPlan": [
      { "time": "Breakfast", "icon": "🌅", "items": ["Generate 2-3 REAL breakfast foods"] },
      { "time": "Lunch",     "icon": "☀️", "items": ["Generate 2-3 REAL lunch foods"] },
      { "time": "Dinner",    "icon": "🌙", "items": ["Generate 2-3 REAL dinner foods"] },
      { "time": "Snacks",    "icon": "🍎", "items": ["Generate 2-3 REAL snack foods"] }
    ],
    "nutritionTips": [
      { "text": "Generate a REAL, specific nutrition tip", "tag": "Hydration", "tagColor": "bg-blue-100 text-blue-700" },
      { "text": "Generate a REAL, specific nutrition tip", "tag": "Vitamins", "tagColor": "bg-green-100 text-green-700" },
      { "text": "Generate a REAL, specific nutrition tip", "tag": "Protein", "tagColor": "bg-amber-100 text-amber-700" },
      { "text": "Generate a REAL, specific nutrition tip", "tag": "General", "tagColor": "bg-purple-100 text-purple-700" }
    ],
    "aiInsight": "2-3 sentence dietary insight personalized to this patient"
  },
  "exerciseModule": {
    "weeklySchedule": [
      { "day": "Mon", "focus": "Generate REAL focus (e.g. Cardio)", "exercises": ["Generate 2 REAL exercises"], "icon": "💪", "color": "from-blue-500 to-indigo-500" },
      { "day": "Tue", "focus": "Generate REAL focus", "exercises": ["Generate 2 REAL exercises"], "icon": "🏃", "color": "from-red-500 to-rose-500" },
      { "day": "Wed", "focus": "Generate REAL focus", "exercises": ["Generate 2 REAL exercises"], "icon": "🧘", "color": "from-purple-500 to-violet-500" },
      { "day": "Thu", "focus": "Generate REAL focus", "exercises": ["Generate 2 REAL exercises"], "icon": "💪", "color": "from-blue-500 to-indigo-500" },
      { "day": "Fri", "focus": "Generate REAL focus", "exercises": ["Generate 2 REAL exercises"], "icon": "🔥", "color": "from-orange-500 to-amber-500" },
      { "day": "Sat", "focus": "Generate REAL focus", "exercises": ["Generate 2 REAL exercises"], "icon": "🤸", "color": "from-green-500 to-emerald-500" },
      { "day": "Sun", "focus": "Rest & Recover", "exercises": ["Generate 1 gentle activity"], "icon": "💤", "color": "from-slate-400 to-slate-500" }
    ],
    "aiInsight": "2-3 sentence exercise insight personalized to this patient's PCOS risk and BMI"
  },
  "stressModule": {
    "todayFocus": "One sentence stress focus for this patient based on their symptoms",
    "techniques": [
      { "title": "Generate REAL Technique (e.g. Box Breathing)", "desc": "Generate REAL instructions", "icon": "🌬️", "tag": "Breathing",   "tagColor": "bg-blue-100 text-blue-700" },
      { "title": "Generate REAL Technique", "desc": "Generate REAL instructions", "icon": "🌍", "tag": "Mindfulness", "tagColor": "bg-green-100 text-green-700" },
      { "title": "Generate REAL Technique", "desc": "Generate REAL instructions", "icon": "💆", "tag": "Physical",    "tagColor": "bg-purple-100 text-purple-700" },
      { "title": "Generate REAL Technique", "desc": "Generate REAL instructions", "icon": "📝", "tag": "Journaling",  "tagColor": "bg-amber-100 text-amber-700" },
      { "title": "Generate REAL Technique", "desc": "Generate REAL instructions", "icon": "🌿", "tag": "Activity",    "tagColor": "bg-emerald-100 text-emerald-700" },
      { "title": "Generate REAL Technique", "desc": "Generate REAL instructions", "icon": "🧘", "tag": "Meditation",  "tagColor": "bg-indigo-100 text-indigo-700" }
    ],
    "weeklyFocus": [
      { "day": "Mon–Wed", "focus": "Generate a REAL specific stress focus", "icon": "🌬️" },
      { "day": "Thu–Fri", "focus": "Generate a REAL specific stress focus", "icon": "📝" },
      { "day": "Sat–Sun", "focus": "Generate a REAL specific stress focus", "icon": "🍃" }
    ],
    "aiInsight": "2-3 sentence stress insight personalized to this patient's cortisol and cycle"
  },
  "skinCareModule": {
    "todayFocus": "One sentence skin/hair focus for this patient based on their symptoms",
    "skinTips": [
      { "title": "Generate REAL Skin Tip", "desc": "Generate REAL description", "icon": "🧼", "tag": "Daily",     "tagColor": "bg-blue-100 text-blue-700" },
      { "title": "Generate REAL Serum Tip", "desc": "Generate REAL description", "icon": "💧", "tag": "Serum",     "tagColor": "bg-purple-100 text-purple-700" },
      { "title": "Generate REAL Essential Tip", "desc": "Generate REAL description", "icon": "☀️", "tag": "Essential", "tagColor": "bg-amber-100 text-amber-700" },
      { "title": "Generate REAL Diet Tip", "desc": "Generate REAL description", "icon": "🌿", "tag": "Diet",      "tagColor": "bg-green-100 text-green-700" }
    ],
    "hairTips": [
      { "title": "Generate REAL Daily Hair Tip", "desc": "Generate REAL description", "icon": "💆", "tag": "Daily",      "tagColor": "bg-blue-100 text-blue-700" },
      { "title": "Generate REAL Supplement Tip", "desc": "Generate REAL description", "icon": "💊", "tag": "Supplement", "tagColor": "bg-teal-100 text-teal-700" },
      { "title": "Generate REAL Natural Tip", "desc": "Generate REAL description", "icon": "🍵", "tag": "Natural",    "tagColor": "bg-emerald-100 text-emerald-700" },
      { "title": "Generate REAL Diet Tip", "desc": "Generate REAL description", "icon": "🥜", "tag": "Diet",       "tagColor": "bg-orange-100 text-orange-700" }
    ],
    "aiInsight": "2-3 sentence skin/hair insight personalized to this patient's androgen and hormonal symptoms"
  }
}`;

    let report;
    try {
      console.log("✅ [ASSESSMENT] Calling Gemini API...");
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
      });

      const text = response.text;
      console.log("✅ [ASSESSMENT] Gemini raw response (first 300 chars):", text.substring(0, 300));

      // Strip markdown code blocks if present
      let jsonStr = text;
      const codeBlock = text.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (codeBlock) jsonStr = codeBlock[1];
      const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON found in Gemini response: " + text.substring(0, 100));

      report = JSON.parse(jsonMatch[0]);
      console.log("✅ [ASSESSMENT] Parsed result - risk:", report.riskLevel, "bmi:", report.BMI);

    } catch (geminiErr) {
      let errorReason = "An unexpected error occurred.";
      if (geminiErr.message?.includes("503") || geminiErr.message?.includes("UNAVAILABLE")) {
         errorReason = "Our clinical AI is currently experiencing extremely high demand. Please wait a few minutes and try again.";
      } else if (geminiErr.message?.includes("429")) {
         errorReason = "Our clinical AI is receiving too many requests. Please wait a moment.";
      } else {
         errorReason = `Analysis paused. (Error: ${geminiErr.message.substring(0, 50)})`;
      }

      const bmi = (data.weight / ((data.height / 100) ** 2)).toFixed(1);
      report = {
        pcosPrediction: "Analysis Paused (AI Server Busy)",
        riskLevel: "Unknown",
        BMI: bmi,
        symptomScore: 0,
        lifestyleScore: 0,
        menstrualIrregularity: "Unknown",
        hormoneBalanceTips: ["Maintain balanced diet", "Exercise regularly", "Consult healthcare professional"],
        personalizedMessage: errorReason,
        dietModule: null,
        exerciseModule: null,
        stressModule: null,
        skinCareModule: null,
        dietPlan: null,
        exercisePlan: null,
        stressPlan: null,
        skinHairPlan: null,
      };
    }

    // Save AI Report to DB
    const aiReport = new AIReport({
      userId,
      pcosPrediction: report.pcosPrediction,
      riskLevel: report.riskLevel,
      BMI: Number(report.BMI) || 0,
      bmiCategory: report.bmiCategory || bmiCategory,
      symptomScore: Number(report.symptomScore) || 0,
      lifestyleScore: Number(report.lifestyleScore) || 0,
      menstrualIrregularity: report.menstrualIrregularity || "Unknown",
      hormoneBalanceTips: report.hormoneBalanceTips || [],
      personalizedMessage: report.personalizedMessage || "",
      aiInsight: report.aiInsight || "",
      dailyTip: report.dailyTip || "",
      // Populate both for compatibility
      dietModule: report.dietModule || null,
      dietPlan: report.dietModule || null,
      exerciseModule: report.exerciseModule || null,
      exercisePlan: report.exerciseModule || null,
      stressModule: report.stressModule || null,
      stressPlan: report.stressModule || null,
      skinCareModule: report.skinCareModule || null,
      skinHairPlan: report.skinCareModule || null,
      
      // --- PART 1: ADVANCED DETECTION LOGIC ---
      advancedScore: (() => {
        let score = 0;
        if (data.advancedAnswers && Array.isArray(data.advancedAnswers)) {
          data.advancedAnswers.forEach(ans => {
            if (typeof ans === 'string') {
              if (ans.startsWith('B')) score += 2;
              else if (ans.startsWith('C')) score += 4;
              else if (ans.startsWith('D')) score += 6;
            }
          });
        }
        return score;
      })(),
      combinedRiskLevel: (() => {
        let score = 0;
        if (data.advancedAnswers && Array.isArray(data.advancedAnswers)) {
          data.advancedAnswers.forEach(ans => {
            if (typeof ans === 'string') {
              if (ans.startsWith('B')) score += 2;
              else if (ans.startsWith('C')) score += 4;
              else if (ans.startsWith('D')) score += 6;
            }
          });
          const baseRisk = report.riskLevel || 'Unknown';
          if ((baseRisk.includes('Low')) && score < 8) return 'Low Risk';
          if (baseRisk.includes('High') || baseRisk.includes('Positive') || score > 15) return 'High Risk';
          return 'Moderate Risk';
        }
        return 'Not evaluated yet';
      })(),

      // --- PART 2: ADVANCED SEVERITY LOGIC ---
      intensityScore: (() => {
        let score = 0;
        if (data.intensityAnswers && Array.isArray(data.intensityAnswers)) {
          data.intensityAnswers.forEach(ans => score += (Number(ans) || 0));
        }
        return score;
      })(),
      refinedSeverityLevel: (() => {
        if (data.intensityAnswers && Array.isArray(data.intensityAnswers)) {
          let iScore = 0;
          data.intensityAnswers.forEach(ans => iScore += (Number(ans) || 0));
          // Assuming base severity (symptomScore) is out of 10, scale it up to combine
          const oldSeverityScore = (Number(report.symptomScore) || 0) * 5; 
          const combined = oldSeverityScore + iScore;
          if (combined <= 20) return 'Mild';
          if (combined <= 40) return 'Moderate';
          if (combined <= 60) return 'High';
          return 'Severe';
        }
        return 'Not evaluated yet';
      })()
    });
    await aiReport.save();
    console.log("✅ [ASSESSMENT] AIReport saved to DB");

    res.json({ message: "Assessment completed", report: aiReport });

  } catch (error) {
    console.error("❌ [ASSESSMENT] TOP-LEVEL ERROR:", error.message);
    res.status(500).json({ message: "Server error: " + error.message });
  }
});


// ======================================================
// ✅ GET LATEST AI REPORT (Standard Endpoint)
// ======================================================
router.get("/latest", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const report = await AIReport.findOne({ userId }).sort({ createdAt: -1 });
    if (!report) return res.status(404).json({ message: "Report not found" });
    res.json(report);
  } catch (error) {
    console.error("❌ [ASSESSMENT] FETCH REPORT ERROR:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ GET LATEST AI REPORT (User Requested Alias: /api/ai-report/latest)
// Note: Mounted at /api/assessment, so this becomes /api/assessment/ai-report/latest
router.get("/ai-report/latest", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const report = await AIReport.findOne({ userId }).sort({ createdAt: -1 });
    if (!report) return res.status(404).json({ message: "Report not found" });
    res.json(report);
  } catch (error) {
    console.error("❌ [ASSESSMENT] FETCH ALIAS REPORT ERROR:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ======================================================
// ✅ GET LATEST FORM (For pre-filling Questionnaire)
// ======================================================
router.get("/latest-form", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const assessment = await HealthAssessment.findOne({ userId }).sort({ createdAt: -1 });
    const user = await User.findById(userId);

    res.json({
      formData: assessment ? assessment.questionnaireAnswers : null,
      hormonalData: user && user.hormonalIndex && user.hormonalIndex.answers ? user.hormonalIndex.answers : null
    });
  } catch (error) {
    console.error("❌ [ASSESSMENT] FETCH LATEST FORM ERROR:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;