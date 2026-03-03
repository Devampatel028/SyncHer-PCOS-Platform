const { GoogleGenAI } = require('@google/genai');
const ai = new GoogleGenAI({ apiKey: 'AIzaSyAjZ0JtT9p_s5QKMLd33u1V2x-iPMnxGME' });

async function testModels() {
  const models = ['gemini-3-flash-preview', 'gemini-1.5-flash', 'gemini-2.0-flash-lite', 'gemini-1.5-pro'];
  for (const model of models) {
    try {
      const r = await ai.models.generateContent({ model, contents: 'say: WORKING' });
      console.log('✅ SUCCESS:', model, '->', r.text.trim().substring(0, 40));
      return model; // Stop at first working one
    } catch (e) {
      console.error('❌ FAIL:', model, '->', e.message.substring(0, 80));
    }
  }
}
testModels().then(m => console.log('\nBEST MODEL TO USE:', m));
