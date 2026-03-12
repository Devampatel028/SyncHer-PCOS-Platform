const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');

const SkinAnalysis = require('../models/SkinAnalysis');
const authMiddleware = require('../middleware/auth');
const doctorAuthMiddleware = require('../middleware/doctorAuth');
const Appointment = require('../models/Appointment');

// ── Multer config ─────────────────────────────────────────────────────────────
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename:    (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `skin-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowed.includes(file.mimetype)) return cb(null, true);
  cb(new Error('Only JPEG, PNG, and WebP images are allowed'), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10 MB
});

const PYTHON_SERVICE = process.env.OPENCV_SERVICE_URL || 'http://localhost:8000';

// ── POST /api/opencv/analyze-skin ─────────────────────────────────────────────
router.post('/analyze-skin', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    // Forward image to Python OpenCV service
    let analysisResult;
    try {
      const formData = new FormData();
      formData.append('image', fs.createReadStream(req.file.path), {
        filename: req.file.filename,
        contentType: req.file.mimetype
      });

      const pythonRes = await axios.post(`${PYTHON_SERVICE}/analyze-skin`, formData, {
        headers: formData.getHeaders(),
        timeout: 30000
      });
      analysisResult = pythonRes.data;
    } catch (pythonErr) {
      console.error('Python service error:', pythonErr.message);
      // Clean up uploaded file on Python failure
      fs.unlink(req.file.path, () => {});
      return res.status(503).json({
        message: 'Skin analysis service is unavailable. Please ensure the Python service is running on port 8000.',
        hint: 'Run: cd opencv_service && python app.py'
      });
    }

    // Save to MongoDB
    const skinAnalysis = new SkinAnalysis({
      userId:       req.userId,
      imageUrl,
      acneLevel:    analysisResult.acneLevel,
      detectedSpots: analysisResult.detectedSpots,
      affectedAreas: analysisResult.affectedAreas,
      zoneBreakdown: analysisResult.zoneBreakdown || {}
    });
    await skinAnalysis.save();

    res.status(201).json({
      message: 'Skin analysis complete',
      analysis: skinAnalysis
    });
  } catch (err) {
    console.error('SKIN ANALYSIS ERROR:', err);
    res.status(500).json({ message: 'Server error during skin analysis' });
  }
});

// ── GET /api/opencv/my-analyses ───────────────────────────────────────────────
router.get('/my-analyses', authMiddleware, async (req, res) => {
  try {
    const analyses = await SkinAnalysis.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(analyses);
  } catch (err) {
    console.error('MY ANALYSES ERROR:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ── GET /api/opencv/patient/:id/analyses (doctor access) ──────────────────────
router.get('/patient/:id/analyses', doctorAuthMiddleware, async (req, res) => {
  try {
    const patientId = req.params.id;

    // Security: verify patient has appointment with this doctor
    const appointment = await Appointment.findOne({
      userId:   patientId,
      doctorId: req.doctorId
    });
    if (!appointment) {
      return res.status(403).json({ message: 'Not authorized to view this patient\'s skin reports' });
    }

    const analyses = await SkinAnalysis.find({ userId: patientId })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(analyses);
  } catch (err) {
    console.error('PATIENT ANALYSES ERROR:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ── PUT /api/opencv/analysis/:id/review (doctor marks reviewed + notes) ───────
router.put('/analysis/:id/review', doctorAuthMiddleware, async (req, res) => {
  try {
    const { doctorNotes } = req.body;

    const analysis = await SkinAnalysis.findById(req.params.id);
    if (!analysis) {
      return res.status(404).json({ message: 'Analysis not found' });
    }

    // Verify this doctor has access to the patient
    const appointment = await Appointment.findOne({
      userId:   analysis.userId,
      doctorId: req.doctorId
    });
    if (!appointment) {
      return res.status(403).json({ message: 'Not authorized to review this analysis' });
    }

    analysis.doctorViewed = true;
    analysis.reviewedBy   = req.doctorId;
    if (doctorNotes !== undefined) analysis.doctorNotes = doctorNotes;
    await analysis.save();

    res.json({ message: 'Analysis reviewed', analysis });
  } catch (err) {
    console.error('REVIEW ANALYSIS ERROR:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
