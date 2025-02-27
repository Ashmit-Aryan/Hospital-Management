const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config(); // Load environment variables

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB connection error: ", err));

//Routes
const patients = require('./Routes/Patients');
const doctors = require('./Routes/Doctors');
const appointments = require('./Routes/Appointments');
const billings = require('./Routes/Billings');

app.use('/api/patients',patients);
app.use('/api/doctors',doctors);
app.use('/api/appointments',appointments);
app.use('/api/billings',billings);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});