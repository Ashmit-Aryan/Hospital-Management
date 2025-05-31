const { default: mongoose } = require("mongoose");
const Patient = require("../models/patient");

async function handleCreatePatients(req, res) {
  const patient = new Patient(req.body);
  try {
    await patient.save();
    res.status(201).json(patient);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function handleGetPatients(req, res) {
  try {
    const patients = await Patient.find();
    res.json(patients);
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
  const id = req.params.id;
  const changeReq = req.query.change;
  const Value = req.body.value;

  if (changeReq === "createdBy") {
    return res.status(400).json({ message: "Cannot change createdBy" });
  }

  const updatableFields = [
    "name",
    "age",
    "gender",
    "contact",
    "medicalHistory",
    "address",
    "appointmentId",
    "updatedBy",
  ];

  if (!updatableFields.includes(changeReq)) {
    return res.status(500).json({ error: "Wrong Selection" });
  }

  try {
    await Patient.findByIdAndUpdate(id, { [changeReq]: Value });
    return res.status(202).json({ message: "Done" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

module.exports = {
  handleCreatePatients,
  handleGetPatients,
  handleGetPatientsById,
  handleDeletePatients,
  handleUpdatePatients,
};
