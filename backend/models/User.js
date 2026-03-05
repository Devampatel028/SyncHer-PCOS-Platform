const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, lowercase: true, trim: true },
  password: String,
  name: { type: String, default: "" },
  phone: { type: String, default: "" },
  age: { type: Number, default: null },
  height: { type: Number, default: null },
  weight: { type: Number, default: null },
  pcosStatus: { type: String, default: "Not assessed" },
  cycleLength: { type: String, default: "Unknown" },
  darkMode: { type: Boolean, default: false },
  language: { type: String, default: "English" },
  notificationPrefs: {
    cycleReminders: { type: Boolean, default: true },
    doctorTips: { type: Boolean, default: true },
    aiAlerts: { type: Boolean, default: true },
    healthWarnings: { type: Boolean, default: true }
  },
  hormonalIndex: {
    answers: [
      {
        questionId: Number,
        selectedOption: String,
        numericScore: Number
      }
    ],
    totalScore: { type: Number, default: null },
    category: { type: String, default: null },
    completedAt: { type: Date, default: null }
  },
  createdAt: { type: Date, default: Date.now }
});

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model("User", UserSchema);