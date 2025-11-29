const router = require("express").Router();
const {    handleGetAppointmentsById,
    handleCreateAppointment,
    handleUpdateAppointment,
    handleDeleteAppointment,
    handleGetAppointments
} = require('../controller/AppointmentsController');
const { verifyAuthToken,setAuth } = require("../middleware/auth");

router.use(verifyAuthToken)
router.get("/", handleGetAppointments);

router.get("/:id",handleGetAppointmentsById);

router.post("/",setAuth ,handleCreateAppointment);

router.put("/update/:id",setAuth,handleUpdateAppointment)

router.delete("/delete/:id", setAuth,handleDeleteAppointment);

module.exports = router;
