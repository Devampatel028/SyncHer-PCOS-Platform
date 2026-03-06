const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const Notification = require('../models/Notification');
const User = require('../models/User');
const AIReport = require('../models/AIReport');
const authMiddleware = require('../middleware/auth');
const doctorAuthMiddleware = require('../middleware/doctorAuth');

// ================= USER-FACING: List all doctors =================
router.get('/list', async (req, res) => {
  try {
    const doctors = await Doctor.find({}, '-password');
    res.json(doctors);
  } catch (err) {
    console.error("LIST DOCTORS ERROR:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ================= USER-FACING: Book appointment =================
router.post('/appoint', authMiddleware, async (req, res) => {
  try {
    const { doctorId } = req.body;
    if (!doctorId) return res.status(400).json({ message: 'Doctor ID required' });

    // Check if already has pending appointment with this doctor
    const existing = await Appointment.findOne({
      userId: req.userId,
      doctorId,
      status: { $in: ['pending', 'confirmed'] }
    });
    if (existing) {
      return res.status(400).json({ message: 'You already have an active appointment with this doctor' });
    }

    const appointment = new Appointment({
      userId: req.userId,
      doctorId,
      status: 'pending'
    });
    await appointment.save();

    // Get doctor info for notification
    const doctor = await Doctor.findById(doctorId);
    
    // Notify doctor would happen on their dashboard poll
    // Create notification for the user confirming booking
    const notification = new Notification({
      userId: req.userId,
      type: 'appointment',
      message: `Your appointment with ${doctor.name} (${doctor.specialty}) has been booked successfully. Status: Pending.`,
      data: { appointmentId: appointment._id, doctorName: doctor.name }
    });
    await notification.save();

    res.status(201).json({ message: 'Appointment booked successfully', appointment });
  } catch (err) {
    console.error("APPOINT ERROR:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ================= USER-FACING: Get user's notifications =================
router.get('/notifications', authMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(notifications);
  } catch (err) {
    console.error("NOTIFICATIONS ERROR:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ================= USER-FACING: Mark notification as read =================
router.put('/notifications/:id/read', authMiddleware, async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { read: true });
    res.json({ message: 'Marked as read' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ================= USER-FACING: Get user's appointments =================
router.get('/my-appointments', authMiddleware, async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.userId })
      .populate('doctorId', 'name specialty subSpecialty email')
      .sort({ createdAt: -1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ================= DOCTOR-FACING: Get patients =================
router.get('/patients', doctorAuthMiddleware, async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctorId: req.doctorId })
      .populate('userId', 'name email phone age height weight pcosStatus cycleLength createdAt')
      .sort({ createdAt: -1 });

    // Group by unique patients
    const patientMap = new Map();
    appointments.forEach(apt => {
      if (apt.userId && !patientMap.has(apt.userId._id.toString())) {
        patientMap.set(apt.userId._id.toString(), {
          patient: apt.userId,
          latestAppointment: apt
        });
      }
    });

    res.json(Array.from(patientMap.values()));
  } catch (err) {
    console.error("GET PATIENTS ERROR:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ================= DOCTOR-FACING: Get patient health data =================
router.get('/patient/:id', doctorAuthMiddleware, async (req, res) => {
  try {
    const patientId = req.params.id;

    // Verify this patient has an appointment with this doctor
    const appointment = await Appointment.findOne({
      userId: patientId,
      doctorId: req.doctorId
    });
    if (!appointment) {
      return res.status(403).json({ message: 'Not authorized to view this patient' });
    }

    const user = await User.findById(patientId, '-password');
    const report = await AIReport.findOne({ userId: patientId }).sort({ createdAt: -1 });
    
    // Also get the questionnaire answers
    const HealthAssessment = require('../models/HealthAssessment');
    const assessment = await HealthAssessment.findOne({ userId: patientId }).sort({ createdAt: -1 });

    res.json({ user, report, assessment });
  } catch (err) {
    console.error("GET PATIENT ERROR:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ================= DOCTOR-FACING: Get doctor's appointments =================
router.get('/appointments', doctorAuthMiddleware, async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctorId: req.doctorId })
      .populate('userId', 'name email phone')
      .sort({ date: 1, createdAt: -1 });
    res.json(appointments);
  } catch (err) {
    console.error("GET APPOINTMENTS ERROR:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ================= DOCTOR-FACING: Schedule/update appointment =================
router.put('/appointment/:id', doctorAuthMiddleware, async (req, res) => {
  try {
    const { date, status, notes } = req.body;
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      doctorId: req.doctorId
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (date) appointment.date = date;
    if (status) appointment.status = status;
    if (notes !== undefined) appointment.notes = notes;
    await appointment.save();

    // Get doctor info
    const doctor = await Doctor.findById(req.doctorId);

    // Notify the patient
    const notification = new Notification({
      userId: appointment.userId,
      type: 'appointment',
      message: date
        ? `Dr. ${doctor.name} has scheduled your appointment for ${new Date(date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at ${new Date(date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}.`
        : `Your appointment with Dr. ${doctor.name} has been updated. Status: ${status || appointment.status}.`,
      data: { appointmentId: appointment._id, doctorName: doctor.name, date }
    });
    await notification.save();

    res.json({ message: 'Appointment updated', appointment });
  } catch (err) {
    console.error("UPDATE APPOINTMENT ERROR:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
