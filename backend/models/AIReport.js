const mongoose = require('mongoose');

const aiReportSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assessmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'HealthAssessment' },
    BMI: Number,
    bmiCategory: { type: String, default: '' },
    riskLevel: String,
    symptomScore: Number,
    lifestyleScore: Number,
    menstrualIrregularity: String,
    pcosPrediction: String,
    hormoneBalanceTips: [String],
    personalizedMessage: String,
    aiInsight: { type: String, default: '' },
    dailyTip: { type: String, default: '' },
    // New standardized names
    dietModule: { type: mongoose.Schema.Types.Mixed, default: null },
    exerciseModule: { type: mongoose.Schema.Types.Mixed, default: null },
    stressModule: { type: mongoose.Schema.Types.Mixed, default: null },
    skinCareModule: { type: mongoose.Schema.Types.Mixed, default: null },
    // Backward compatibility
    dietPlan: { type: mongoose.Schema.Types.Mixed, default: null },
    exercisePlan: { type: mongoose.Schema.Types.Mixed, default: null },
    stressPlan: { type: mongoose.Schema.Types.Mixed, default: null },
    skinHairPlan: { type: mongoose.Schema.Types.Mixed, default: null },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AIReport', aiReportSchema);

