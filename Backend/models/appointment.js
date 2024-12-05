const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patientId: String,
  doctorId: String,
  date: { type: Date, required: true },
  status: { type: String, enum: ['Scheduled', 'Completed', 'Cancelled'], default: 'Scheduled' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Appointment', appointmentSchema);
