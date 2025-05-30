const router = require("express").Router();
const { default: mongoose } = require("mongoose");
const Doctor = require("../models/doctor");

router.get("/", async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id",async (req,res)=>{
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found"})
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
})

router.post("/", async (req, res) => {
  const doctor = new Doctor(req.body);
  try {
    await doctor.save();
    res.status(201).json(doctor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    await Doctor.deleteOne({ _id: req.params["id"] });
    res.status(204).json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.put("/update/:id", async (req, res) => {
  const id = req.params.id;
  const { change: changeReq, value: Value, avail_change: availChange } = req.body;

  if (changeReq === "createdBy") {
    return res.status(400).json({ message: "Cannot change createdBy" });
  }

  const updatableFields = [
    "name", "specialization", "contact", "experience", 
    "qualifications", "hospitalAffiliation", "updatedBy"
  ];

  if (updatableFields.includes(changeReq)) {
    try {
      await Doctor.findByIdAndUpdate(id, { [changeReq]: Value });
      return res.status(202).json({ message: "Updates Successful" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  if (["availability", "languagesSpoken", "appointments"].includes(changeReq)) {
    const updateOperation = availChange === "add" ? { $addToSet: { [changeReq]: Value } } : { $pull: { [changeReq]: Value } };
    try {
      await Doctor.findByIdAndUpdate(id, updateOperation);
      return res.status(202).json({ message: "Updates Successful" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(400).send();
});



module.exports = router;
