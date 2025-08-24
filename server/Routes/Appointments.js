const router = require("express").Router();
const {    handleGetAppointmentsById,
    handleCreateAppointment,
    handleUpdateAppointment,
    handleDeleteAppointment,
    handleGetAppointments
} = require('../controller/AppointmentsController');
const { verifyAuthToken,setAuth } = require("../middleware/auth");

router.use(verifyAuthToken)
router.get("/", handleUpdateAppointment);

router.get("/:id",handleGetAppointmentsById);

router.post("/", handleCreateAppointment);

router.put("/update/:id",handleUpdateAppointment)

router.delete("/delete/:id", setAuth,handleDeleteAppointment);

module.exports = router;
