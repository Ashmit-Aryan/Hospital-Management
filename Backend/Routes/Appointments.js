const router = require("express").Router();
const Appointment = require("../Models/appointment");
router.get("/", async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  const { patientId, doctorId, date, status } = req.body;
  const appointment = new Appointment({ patientId, doctorId, date, status });
  try {
    await appointment.save();
    res.status(201).json(appointment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/delete/:id", async (req, res) => {
  const deleteAppointmentId = new mongoose.mongo.ObjectId(req.params["id"]);
  try {
    await appointment.deleteOne({ _id: deleteAppointmentId });
    res.status(204).json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
