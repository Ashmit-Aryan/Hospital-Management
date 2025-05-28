const router = require("express").Router();
const Appointment = require("../Models/appointment");
const mongoose = require("mongoose");

router.get("/", async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  const {
    patientId,
    doctorId,
    appointmentType,
    appointmentReason,
    date,
    time,
    notes,
    followUp,
    followUpDate,
    followUpTime,
    followUpNotes,
    followUpReason,
    createdBy,
    updatedBy,
    updatedAt,
    appointmentStatus,
    billnumber,
  } = req.body;
  const appointment = new Appointment({
    patientId,
    doctorId,
    appointmentType,
    appointmentReason,
    date,
    time,
    notes,
    followUp,
    followUpDate,
    followUpTime,
    followUpNotes,
    followUpReason,
    createdBy,
    updatedBy,
    updatedAt,
    appointmentStatus,
    billnumber,
  });
  try {
    await appointment.save();
    res.status(201).json(appointment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put("/update/:id",async (req,res)=>{
   const { id } = req.params;
   const changeReq = req.query.change;
   const Value = req.body.Value;
   try{
    const appointment = await Appointment.findByIdAndUpdate(id, { $set: { [changeReq]: Value }
      }, { new: true });
      res.status(200).json(appointment);
   }catch (err){
    res.status(400).json({ message: err.message });
   }
})

router.delete("/delete/:id", async (req, res) => {
  const deleteAppointmentId = new mongoose.mongo.ObjectId(req.params["id"]);
  try {
    await Appointment.deleteOne({ _id: deleteAppointmentId });
    res.status(204).json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
