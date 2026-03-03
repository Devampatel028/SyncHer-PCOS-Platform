const express = require("express");
const router = express.Router();
const User = require("../models/User");
const AIReport = require("../models/AIReport");
const HealthAssessment = require("../models/HealthAssessment");
const authMiddleware = require("../middleware/auth");

// =============================================
// GET /api/user/profile — Fetch user profile
// =============================================
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password").lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get latest assessment data to populate profile fields
    const assessment = await HealthAssessment.findOne({ userId: req.userId })
      .sort({ createdAt: -1 })
      .lean();

    const report = await AIReport.findOne({ userId: req.userId })
      .sort({ createdAt: -1 })
      .lean();

    // Merge assessment data into profile for display
    const profile = {
      ...user,
      age: user.age || assessment?.questionnaireAnswers?.age || null,
      height: user.height || assessment?.questionnaireAnswers?.height || null,
      weight: user.weight || assessment?.questionnaireAnswers?.weight || null,
      cycleLength: user.cycleLength !== "Unknown"
        ? user.cycleLength
        : assessment?.questionnaireAnswers?.cycleLength || "Unknown",
      pcosStatus: user.pcosStatus !== "Not assessed"
        ? user.pcosStatus
        : report?.pcosPrediction || "Not assessed"
    };

    res.json(profile);
  } catch (error) {
    console.error("PROFILE FETCH ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// =============================================
// PUT /api/user/profile — Update user profile
// =============================================
router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const { name, phone, age, height, weight } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      { name, phone, age, height, weight },
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (error) {
    console.error("PROFILE UPDATE ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// =============================================
// PUT /api/user/settings — Update user settings
// =============================================
router.put("/settings", authMiddleware, async (req, res) => {
  try {
    const { darkMode, language, notificationPrefs } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      { darkMode, language, notificationPrefs },
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (error) {
    console.error("SETTINGS UPDATE ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// =============================================
// DELETE /api/user/account — Delete user account
// =============================================
router.delete("/account", authMiddleware, async (req, res) => {
  try {
    await HealthAssessment.deleteMany({ userId: req.userId });
    await AIReport.deleteMany({ userId: req.userId });
    await User.findByIdAndDelete(req.userId);

    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("ACCOUNT DELETE ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// =============================================
// PUT /api/user/change-password
// =============================================
router.put("/change-password", authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const bcrypt = require("bcryptjs");

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });

    user.password = newPassword; // Will be hashed by pre-save hook
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("PASSWORD CHANGE ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
