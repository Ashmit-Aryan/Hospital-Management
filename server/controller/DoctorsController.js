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
    const doctor = new Doctor({...req.body, createdBy: req.user._id, updatedBy: req.user._id});
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
  const { field, action, value } = req.body;

  // ❌ Block audit tampering
  if (field === "createdBy") {
    return res.status(400).json({
      error: "createdBy cannot be modified",
    });
  }

  try {
    /* ================= AVAILABILITY (ARRAY OF OBJECTS) ================= */
    if (field === "availability") {
      if (!["add", "remove"].includes(action)) {
        return res.status(400).json({
          error: "Invalid availability operation",
        });
      }

      const updateOp =
        action === "add"
          ? { $push: { availability: value } }
          : { $pull: { availability: value } };

      const updatedDoctor = await Doctor.findByIdAndUpdate(
        id,
        {
          ...updateOp,
          updatedBy: req.user._id,
        },
        { new: true, runValidators: true }
      );

      if (!updatedDoctor) {
        return res.status(404).json({ error: "Doctor not found" });
      }

      return res.status(200).json({
        message: "Availability updated successfully",
        doctor: updatedDoctor,
      });
    }

    /* ================= LANGUAGES / APPOINTMENTS (ARRAY OF STRINGS / IDS) ================= */
    if (["languagesSpoken", "appointments"].includes(field)) {
      if (!["add", "remove"].includes(action)) {
        return res.status(400).json({
          error: "Invalid array operation",
        });
      }

      const updateOp =
        action === "add"
          ? { $addToSet: { [field]: value } }
          : { $pull: { [field]: value } };

      const updatedDoctor = await Doctor.findByIdAndUpdate(
        id,
        {
          ...updateOp,
          updatedBy: req.user._id,
        },
        { new: true }
      );

      if (!updatedDoctor) {
        return res.status(404).json({ error: "Doctor not found" });
      }

      return res.status(200).json({
        message: `${field} updated successfully`,
        doctor: updatedDoctor,
      });
    }

    /* ================= SCALAR FIELDS ================= */
    const allowedScalarFields = [
      "name",
      "specialization",
      "contact",
      "experience",
      "qualifications",
      "hospitalAffiliation",
    ];

    if (!allowedScalarFields.includes(field)) {
      return res.status(400).json({
        error: "Invalid field update",
      });
    }

    const updatedDoctor = await Doctor.findByIdAndUpdate(
      id,
      {
        [field]: value,
        updatedBy: req.user._id,
      },
      { new: true, runValidators: true }
    );

    if (!updatedDoctor) {
      return res.status(404).json({ error: "Doctor not found" });
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