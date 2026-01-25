const Appointment = require("../models/appointment");
const mongoose = require("mongoose");

async function handleGetAppointments(req, res) {
  try {
    const appointments = await Appointment.find();
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function handleGetAppointmentsById(req, res) {
  try {
    const id = req.params.id;
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function handleCreateAppointment(req, res) {
   try {
    const appointment = new Appointment({
      ...req.body,
      createdBy: req.user._doc._id,
      updatedBy: req.user._doc._id,
    });

    await appointment.save();

    // 🔑 AUTO-SYNC PATIENT
    await Patient.findByIdAndUpdate(
      req.body.patientId,
      {
        $addToSet: { appointmentId: appointment._id.toString() },
        updatedBy: req.user._doc._id,
      }
    );

    res.status(201).json(appointment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
async function handleUpdateAppointment(req, res) {
  const { id } = req.params;
  const updates = req.body;

  // Fields allowed to be updated
  const allowedFields = [
    "patientId",
    "doctorId",
    "appointmentReason",
    "appointmentType",
    "date",
    "time",
    "notes",
    "followUp",
    "appointmentStatus",
    "billnumber",
  ];

  // ❌ Prevent createdBy tampering
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

  // ❌ Nothing valid to update
  if (Object.keys(sanitizedUpdates).length === 0) {
    return res.status(400).json({
      error: "No valid fields to update",
    });
  }

  // ✅ Audit field set by backend
  sanitizedUpdates.updatedBy = req.user._doc._id;

  try {
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      sanitizedUpdates,
      { new: true, runValidators: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({
        error: "Appointment not found",
      });
    }

    return res.status(200).json({
      message: "Appointment updated successfully",
      appointment: updatedAppointment,
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
}


async function handleDeleteAppointment(req, res) {
     const deleteAppointmentId = new mongoose.mongo.ObjectId(req.params["id"]);
  try {
    await Appointment.deleteOne({ _id: deleteAppointmentId });
    res.status(204).json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
    handleGetAppointmentsById,
    handleCreateAppointment,
    handleUpdateAppointment,
    handleDeleteAppointment,
    handleGetAppointments
}