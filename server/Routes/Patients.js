const express = require("express");
const router = express.Router();
const {  handleCreatePatients,
  handleGetPatients,
  handleGetPatientsById,
  handleDeletePatients,
  handleUpdatePatients } = require('../controller/PaitentsController');

router.get("/", handleGetPatients);

router.get("/:id", handleGetPatientsById);

router.post("/", handleCreatePatients);

router.delete("/delete/:id", handleDeletePatients);

router.put("/update/:id", handleUpdatePatients);


module.exports = router;
