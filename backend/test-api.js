require('dotenv').config();

const { getPCOSPrediction, getChatbotResponse } = require('./services/gemini');

// ✅ Exact same shape & values as the real Questionnaire form now sends
const sampleUserData = {
  age: "24",
  weight: "68",
  height: "162",
  mainMeal: "Lunch",                    // radio button
  familyHistory: ["PCOS", "Diabetes"],  // checkboxes
  mealsPerDay: "3",                     // select
  dietPattern: "Mixed",                 // select (now in form)
  smoking: "No",                        // select
  diagnosed: "I think I have symptoms", // select (now in form)
  cycleLength: "28–31",                 // select
  symptoms: ["Acne", "Irregular menstrual periods"] // checkboxes
};

// ✅ Exact same shape chatbot route builds from DB
const sampleContext = {
  questionnaireAnswers: sampleUserData,
  aiReport: {
    riskLevel: "Moderate",
    pcosPrediction: "Possible PCOS",
    BMI: 25.9
  }
};

async function runTests() {
  console.log("\n==============================");
  console.log("🧪 TEST 1: PCOS PREDICTION");
  console.log("📤 Sending form data:", JSON.stringify(sampleUserData, null, 2));
  console.log("==============================\n");

  const report = await getPCOSPrediction(sampleUserData);
  console.log("📊 Report:");
  console.log(JSON.stringify(report, null, 2));

  console.log("\n==============================");
  console.log("🧪 TEST 2: CHATBOT");
  console.log("📤 Message: What foods should I avoid with PCOS?");
  console.log("==============================\n");

  const reply = await getChatbotResponse(sampleContext, "What foods should I avoid with PCOS?");
  console.log("💬 Reply:", reply);

  console.log("\n✅ All tests done!\n");
}

runTests();
