const { default: mongoose } = require("mongoose");
const Doctor = require("../models/doctor");

async function handleGetDoctors(req,res){
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function handleGetDoctorsById(req,res){
     try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found"})
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function handleCreateDoctors(req,res){
    const doctor = new Doctor({...req.body, createdBy: req.user._doc._id, updatedBy: req.user._doc._id});
  try {
    await doctor.save();
    res.status(201).json(doctor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function handleDeleteDoctors(req, res) {
  const { id } = req.params;

  try {
    const deletedDoctor = await Doctor.findByIdAndDelete(id);

    if (!deletedDoctor) {
      return res.status(404).json({
        error: "Doctor not found",
      });
    }

    return res.status(200).json({
      message: "Doctor deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
}

async function handleUpdateDoctors(req, res) {
  const { id } = req.params;
  const updates = req.body;

  // ❌ Block audit tampering
  if ("createdBy" in updates) {
    return res.status(400).json({
      error: "createdBy cannot be modified",
    });
  }

  // Scalar fields allowed
  const allowedScalarFields = [
    "name",
    "specialization",
    "contact",
    "experience",
    "qualifications",
    "hospitalAffiliation",
  ];

  // Array fields allowed
  const allowedArrayFields = [
    "availability",
    "languagesSpoken",
    "appointments",
  ];

  const updatePayload = {};
  const arrayOperations = {};

  // Process scalar updates
  for (const key of allowedScalarFields) {
    if (key in updates) {
      updatePayload[key] = updates[key];
    }
  }

  // Process array updates
  for (const key of allowedArrayFields) {
    if (key in updates) {
      const { action, value } = updates[key];

      if (!["add", "remove"].includes(action)) {
        return res.status(400).json({
          error: `Invalid action for ${key}`,
        });
      }

      arrayOperations[key] =
        action === "add"
          ? { $addToSet: { [key]: value } }
          : { $pull: { [key]: value } };
    }
  }

  // ❌ Nothing valid provided
  if (
    Object.keys(updatePayload).length === 0 &&
    Object.keys(arrayOperations).length === 0
  ) {
    return res.status(400).json({
      error: "No valid fields to update",
    });
  }

  // ✅ Backend-controlled audit field
  updatePayload.updatedBy = req.user._doc._id;

  try {
    // Apply scalar updates
    if (Object.keys(updatePayload).length > 0) {
      await Doctor.findByIdAndUpdate(id, updatePayload, {
        runValidators: true,
      });
    }

    // Apply array updates
    for (const op of Object.values(arrayOperations)) {
      await Doctor.findByIdAndUpdate(id, op);
    }

    const updatedDoctor = await Doctor.findById(id);

    if (!updatedDoctor) {
      return res.status(404).json({
        error: "Doctor not found",
      });
    }

    return res.status(200).json({
      message: "Doctor updated successfully",
      doctor: updatedDoctor,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
}

module.exports = {
    handleGetDoctors,
    handleCreateDoctors,
    handleDeleteDoctors,
    handleGetDoctorsById,
    handleUpdateDoctors
}