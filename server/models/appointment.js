const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  patientId: { type: mongoose.mongo.ObjectId, required: true },
  doctorId: { type: mongoose.mongo.ObjectId, required: true },
  appointmentType: {
    type: String,
    enum: ["In-Person", "Telemedicine"],
    default: "In-Person",
  },
  appointmentReason: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true }, // Consider using a DateTime type for better handling
  notes: { type: String },
  followUp: { type: Boolean, default: false },
  followUpDate: { type: Date },
  followUpTime: { type: String },
  followUpNotes: { type: String },
  followUpReason: { type: String },
  createdBy: { type: mongoose.mongo.ObjectId, required: true }, // ID of the user who created the appointment
  updatedBy: { type: mongoose.mongo.ObjectId }, // ID of the user who last updated the appointment
  updatedAt: { type: Date },
  appointmentStatus: {
    type: String,
    enum: ["Scheduled", "Completed", "Cancelled"],
    default: "Scheduled",
  },
  billId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Billing",
    default: null,
  }, // Unique bill number for the appointment
  createdAt: { type: Date, default: Date.now },
});
appointmentSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Appointment", appointmentSchema);
