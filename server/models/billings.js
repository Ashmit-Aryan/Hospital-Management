const mongoose = require("mongoose");

const billingSchema = new mongoose.Schema({
  patientId: { type: mongoose.mongo.ObjectId, required: true },
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Appointment",
    required: true,
  },
  services: { type: String, required: true },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Paid", "Partially Paid"],
    default: "Pending",
  },
  paymentMethod: {
    type: String,
    enum: ["Cash", "Credit Card", "Insurance"],
    default: "Cash",
  },
  insuranceDetails: {
    provider: { type: String, default: "" },
    policyNumber: { type: String, default: "" },
    coverageAmount: { type: Number, default: 0 },
  },
  discount: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  amountPaid: { type: Number, required: true },
  balance: { type: Number, default: 0 },
  dueDate: { type: Date, required: true },
  paymentDate: { type: Date },
  invoiceNumber: { type: String, required: true, unique: true },
  notes: { type: String, default: "" },
  createdBy: { type: mongoose.mongo.ObjectId, required: true }, // ID of the user who created the billing record
  updatedBy: { type: mongoose.mongo.ObjectId }, // ID of the user who last updated the billing record
  updatedAt: { type: Date, default: Date.now }, // Set default to current date
  createdAt: { type: Date, default: Date.now },
});

// Optional: Add a pre-save hook to update the updatedAt field
billingSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Billing = mongoose.model("Billing", billingSchema);
module.exports = Billing;
