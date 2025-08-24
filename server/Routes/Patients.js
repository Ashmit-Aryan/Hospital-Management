const express = require("express");
const router = express.Router();
const {  handleCreatePatients,
  handleGetPatients,
  handleGetPatientsById,
  handleDeletePatients,
  handleUpdatePatients } = require('../controller/PaitentsController');
const { verifyAuthToken,setAuth } = require("../middleware/auth");

router.use(verifyAuthToken)
router.get("/", handleGetPatients);

router.get("/:id", handleGetPatientsById);

router.post("/", handleCreatePatients);

router.delete("/delete/:id", handleDeletePatients);

router.put("/update/:id",setAuth ,handleUpdatePatients);


module.exports = router;
