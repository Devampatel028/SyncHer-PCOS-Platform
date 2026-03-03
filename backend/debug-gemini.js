require('dotenv').config();

// Simulate EXACT same code path as gemini.js running in the server
const { GoogleGenAI } = require('@google/genai');
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const FREE_MODEL = 'gemini-3-flash-preview';

const userData = {
  age: '24', weight: '65', height: '162',
  mainMeal: 'Lunch',
  familyHistory: ['PCOS'],
  mealsPerDay: '3', dietPattern: 'Mixed',
  smoking: 'No', diagnosed: 'I think I have symptoms',
  cycleLength: '28-31',
  symptoms: ['Acne']
};

const prompt = `
Analyze the following health data for PCOS risk assessment.

Return ONLY VALID JSON with no markdown, no explanation, just raw JSON.

User Data:
Age: ${userData.age}
Weight: ${userData.weight} kg
Height: ${userData.height} cm
Main Meal: ${userData.mainMeal}
Family History: ${userData.familyHistory?.join(', ')}
Meals Per Day: ${userData.mealsPerDay}
Diet Pattern: ${userData.dietPattern}
Smoking: ${userData.smoking}
PCOS Diagnosis: ${userData.diagnosed}
Menstrual Cycle Length: ${userData.cycleLength}
Symptoms: ${userData.symptoms?.join(', ')}

Required JSON Format:
{
 "pcosPrediction": "",
 "riskLevel": "",
 "BMI": "",
 "symptomScore": "",
 "lifestyleScore": "",
 "menstrualIrregularity": "",
 "hormoneBalanceTips": [],
 "personalizedMessage": ""
}
`;

async function run() {
  try {
    console.log('✅ Calling Gemini API for PCOS prediction...');
    const response = await ai.models.generateContent({
      model: FREE_MODEL,
      contents: prompt,
      config: {
        systemInstruction: 'You are a medical AI assistant specializing in PCOS analysis. Always respond with valid JSON only.'
      }
    });

    console.log('response object keys:', Object.keys(response));
    console.log('response.text value:', typeof response.text);
    const text = response.text;
    console.log('✅ TEXT RECEIVED, length:', text.length);
    console.log('TEXT PREVIEW:', text.substring(0, 300));

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    console.log('JSON MATCH FOUND:', !!jsonMatch);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      console.log('✅ PARSED RESULT:', JSON.stringify(parsed, null, 2));
    }
  } catch (err) {
    console.error('❌ ERROR NAME:', err.constructor.name);
    console.error('❌ ERROR MESSAGE:', err.message);
    console.error('❌ STACK:', err.stack);
  }
}

run();
