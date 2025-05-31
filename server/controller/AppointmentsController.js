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
   const appointment = new Appointment(req.body);
  try {
    await appointment.save();
    res.status(201).json(appointment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function handleUpdateAppointment(req, res) {
   const { id } = req.params;
   const changeReq = req.query.change;
   const Value = req.body.Value;
     if(changeReq == "createdBy") return res.status(400).json({ message: "Cannot change createdBy" });

   try{
    const appointment = await Appointment.findByIdAndUpdate(id, { $set: { [changeReq]: Value }
      }, { new: true });
      res.status(200).json(appointment);
   }catch (err){
    res.status(400).json({ message: err.message });
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