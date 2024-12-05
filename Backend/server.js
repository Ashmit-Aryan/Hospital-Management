const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config(); // Load environment variables

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB connection error: ", err));

// Models
const Patient = require('./models/patient');
const Doctor = require('./models/doctor');
const Appointment = require('./models/appointment');
const Billing = require('./models/billings');

// Routes for Patients
app.get('/api/patients', async (req, res) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/patients', async (req, res) => {
  const { name, age, gender, contact, medicalHistory } = req.body;
  const patient = new Patient({ name, age, gender, contact, medicalHistory });
  try {
    await patient.save();
    res.status(201).json(patient);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Routes for Doctors
app.get('/api/doctors', async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/doctors', async (req, res) => {
  const { name, specialization, contact, availability } = req.body;
  const doctor = new Doctor({ name, specialization, contact, availability });
  try {
    await doctor.save();
    res.status(201).json(doctor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Routes for Appointments
app.get('/api/appointments', async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/appointments', async (req, res) => {
  const { patientId, doctorId, date, status } = req.body;
  const appointment = new Appointment({ patientId, doctorId, date, status });
  try {
    await appointment.save();
    res.status(201).json(appointment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Routes for Billing
app.get('/api/billing', async (req, res) => {
  try {
    const bills = await Billing.find();
    res.json(bills);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/billing', async (req, res) => {
  const { patientId, amount, services, paymentStatus, date } = req.body;
  const bill = new Billing({ patientId, amount, services, paymentStatus, date });
  try {
    await bill.save();
    res.status(201).json(bill);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

