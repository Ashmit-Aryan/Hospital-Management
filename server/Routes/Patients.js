const express = require("express");
const router = express.Router();
const {  handleCreatePatients,
  handleGetPatients,
  handleGetPatientsById,
  handleDeletePatients,
  handleUpdatePatients } = require('../controller/PaitentsController');
const { getUser } = require("../middleware/auth");

router.use(getUser)
router.get("/", handleGetPatients);

router.get("/:id", handleGetPatientsById);

router.post("/", handleCreatePatients);

router.delete("/delete/:id", handleDeletePatients);

router.put("/update/:id", handleUpdatePatients);


module.exports = router;
