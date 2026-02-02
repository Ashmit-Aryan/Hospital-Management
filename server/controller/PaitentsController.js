const { default: mongoose, model } = require("mongoose");
const Patient = require("../models/patient");

async function handleCreatePatients(req, res) {
  console.log(req.user)
  const patient = new Patient({...req.body, createdBy: req.user._id , updatedBy: req.user._id });
  try {
    await patient.save();
    res.status(201).json(patient);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function handleGetPatients(req, res) {
  try {  const patients = await Patient.find()
  .populate({
    path: "appointmentId",
    model: "Appointment",
    select: "date time appointmentStatus doctorId",
    populate: {
      path: "doctorId",
      model: "Doctor",
      select: "name",
    },
  })
  .populate("createdBy", "name")
  .populate("updatedBy", "name");
    return res.json(patients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function handleGetPatientsById(req, res) {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.json(patient);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function handleDeletePatients(req, res) {
  const deletePatientId = new mongoose.mongo.ObjectId(req.params["id"]);
  try {
    await Patient.deleteOne({ _id: deletePatientId });
    res.status(204).json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
async function handleUpdatePatients(req, res) {
  const { id } = req.params;
  const updates = req.body;

  // Fields that are allowed to be updated
  const allowedFields = [
    "name",
    "age",
    "gender",
    "contact",
    "medicalHistory",
    "address",
    "appointmentId",
  ];

  // ❌ Block createdBy explicitly
  if ("createdBy" in updates) {
    return res.status(400).json({
      error: "createdBy cannot be modified",
    });
  }

  // Filter only allowed fields
  const sanitizedUpdates = {};
  for (const key of Object.keys(updates)) {
    if (allowedFields.includes(key)) {
      sanitizedUpdates[key] = updates[key];
    }
  }

  // ❌ No valid fields provided
  if (Object.keys(sanitizedUpdates).length === 0) {
    return res.status(400).json({
      error: "No valid fields to update",
    });
  }

  // ✅ Backend-controlled audit field
  sanitizedUpdates.updatedBy = req.user._id;

  try {
    const updatedPatient = await Patient.findByIdAndUpdate(
      id,
      sanitizedUpdates,
      { new: true, runValidators: true }
    );

    if (!updatedPatient) {
      return res.status(404).json({
        error: "Patient not found",
      });
    }

    return res.status(200).json({
      message: "Patient updated successfully",
      patient: updatedPatient,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
}


module.exports = {
  handleCreatePatients,
  handleGetPatients,
  handleGetPatientsById,
  handleDeletePatients,
  handleUpdatePatients,
};
