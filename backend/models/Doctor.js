const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const DoctorSchema = new mongoose.Schema({
  email: { type: String, unique: true, lowercase: true, trim: true },
  password: String,
  name: { type: String, required: true },
  specialty: { type: String, required: true },
  subSpecialty: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now }
});

DoctorSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model("Doctor", DoctorSchema);
