const router = require("express").Router();
const {    handleGetAppointmentsById,
    handleCreateAppointment,
    handleUpdateAppointment,
    handleDeleteAppointment,
    handleGetAppointments
} = require('../controller/AppointmentsController');

router.get("/", handleUpdateAppointment);

router.get("/:id",handleGetAppointmentsById);

router.post("/", handleCreateAppointment);

router.put("/update/:id",handleUpdateAppointment)

router.delete("/delete/:id", handleDeleteAppointment);

module.exports = router;
