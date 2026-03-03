require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const assessmentRoutes = require('./routes/assessment');
const chatbotRoutes = require('./routes/chatbot');
const userRoutes = require('./routes/user');
const { getPCOSPrediction, getChatbotResponse } = require('./services/gemini');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/assessment', assessmentRoutes);
app.use('/api/ai-report', assessmentRoutes); // Alias for compatibility with user request
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/user', userRoutes);

// Debug route — test Gemini directly from within the server process
app.get('/api/debug-gemini', async (req, res) => {
  try {
    console.log('🔥 DEBUG: Testing Gemini directly from server...');
    const testData = {
      age: 24, weight: 65, height: 162,
      mainMeal: 'Lunch', familyHistory: ['PCOS'],
      mealsPerDay: 3, dietPattern: 'Mixed',
      smoking: 'No', diagnosed: 'I think I have symptoms',
      cycleLength: '28-31', symptoms: ['Acne']
    };
    const result = await getPCOSPrediction(testData);
    console.log('🔥 DEBUG RESULT:', result.pcosPrediction, result.riskLevel);
    res.json({ success: true, result });
  } catch (err) {
    console.error('🔥 DEBUG ERROR:', err.message);
    res.json({ success: false, error: err.message });
  }
});

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} - GEMINI v2 LOADED`);
});
