const { default: mongoose } = require("mongoose");
const Patient = require("../models/patient");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.json(patient);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  const patient = new Patient(req.body);
  try {
    await patient.save();
    res.status(201).json(patient);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/delete/:id", async (req, res) => {
  const deletePatientId = new mongoose.mongo.ObjectId(req.params["id"]);
  try {
    await Patient.deleteOne({ _id: deletePatientId });
    res.status(204).json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/update/:id", async (req, res) => {
  const id = req.params.id;
  const changeReq = req.query.change;
  const Value = req.body.value;

  if (changeReq === "createdBy") {
    return res.status(400).json({ message: "Cannot change createdBy" });
  }

  const updatableFields = [
    "name", "age", "gender", "contact", 
    "medicalHistory", "address", "appointmentId", "updatedBy"
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
});


module.exports = router;
