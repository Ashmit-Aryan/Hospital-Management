const mongoose = require('mongoose');

const billingSchema = new mongoose.Schema({
  patientId: String,
  amount: Number,
  services: String,
  paymentStatus: { type: String, enum: ['Pending', 'Paid'], default: 'Pending' },
  date: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Billing', billingSchema);
