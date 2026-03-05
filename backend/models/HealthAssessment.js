const mongoose = require('mongoose');

const healthAssessmentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    questionnaireAnswers: {
        age: Number,
        weight: Number,
        height: Number,
        mainMeal: String,
        familyHistory: [String],
        mealsPerDay: Number,
        dietPattern: String,
        smoking: String,
        diagnosed: String,
        cycleLength: String,
        symptoms: [String],
        advancedAnswers: [String],
        intensityAnswers: [String]
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('HealthAssessment', healthAssessmentSchema);
