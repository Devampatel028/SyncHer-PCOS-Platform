require('dotenv').config({ path: 'c:/Users/devam/OneDrive/Desktop/SHyncher/SyncHer-PCOS-Platform/backend/.env' });
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testGemini() {
    console.log("Testing Gemini API Key:", process.env.GEMINI_API_KEY);
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Hello, are you working?");
        console.log("SUCCESS! Response:", result.response.text());
    } catch (error) {
        console.error("FAILURE! Error detailed info:");
        if (error.response) {
            console.error(JSON.stringify(error.response, null, 2));
        } else {
            console.error(error.message);
        }
    }
}

testGemini();
