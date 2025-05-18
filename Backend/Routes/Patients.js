const { default: mongoose } = require("mongoose");
const Patient = require("../Models/patient");
const express = require('express')
const router = express.Router();


router.get("/", async (req, res) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.post("/", async (req, res) => {
  const { name, age, gender, address , contact, medicalHistory } = req.body;
  const patient = new Patient({ name, age, gender, address,contact, medicalHistory });
  try {
    await patient.save();
    res.status(201).json(patient);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/delete/:id", async (req, res) => {
  const deletePatientId = new mongoose.mongo.ObjectId(req.params["id"]);
  try {
    await Patient.deleteOne({ _id: deletePatientId });
    res.status(204).json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/update/:id/:changeReq", async (req, res) => {
  const id = req.params.id;
  const changeReq = req.params.changeReq;
  const Value = req.body.value;
  const query = {};
  if (
    changeReq == "name" ||
    changeReq == "age" ||
    changeReq == "gender" ||
    changeReq == "contact" ||
    changeReq == "medicalHistory" ||
    changeReq == "address"
  ) {
    Object.defineProperty(query,changeReq,{
      value:Value,writable:false,enumerable:true,configurable:false
    });
  } else {
    return res.send(500,{error:"Wrong Selection"})
  }
  const _id = new mongoose.mongo.ObjectId(id);
  try {
    await Patient.findByIdAndUpdate(_id,query);
    res.status(202).json({message:"Done"});
  } catch (error) {
    res.status(500).json({ error: error.message });    
  }
});

module.exports = router;
