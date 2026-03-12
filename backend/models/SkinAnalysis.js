const mongoose = require('mongoose');

const SkinAnalysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  acneLevel: {
    type: String,
    enum: ['Low', 'Moderate', 'Severe'],
    required: true
  },
  detectedSpots: {
    type: Number,
    default: 0
  },
  affectedAreas: {
    type: [String],
    default: []
  },
  zoneBreakdown: {
    type: Object,
    default: {}
  },
  doctorViewed: {
    type: Boolean,
    default: false
  },
  doctorNotes: {
    type: String,
    default: ''
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('SkinAnalysis', SkinAnalysisSchema);
