const router = require("express").Router();
const { default: mongoose } = require("mongoose");
const Doctor = require("../Models/doctor");

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
  const { name, specialization, experience, qualifications, hospitalAffiliations, languageSpoken, contact, appointments ,  availability } = req.body;
  const doctor = new Doctor({ name, specialization, experience, qualifications, hospitalAffiliations, languageSpoken, contact, appointments ,availability});
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
  const id = req.params["id"];
  const changeReq = req.query.change;
  const Value = req.body.value;
  const availChange = req.body.avail_change;
  const query = {};
  // console.log("Value: ", Value);
  // console.log("ChangeReq: ", changeReq);
  // console.log("AvailChange: ", availChange);
  if (
    changeReq == "name" ||
    changeReq == "specialization" ||
    changeReq == "contact" ||
    changeReq == "experience" ||
    changeReq == "qualifications" ||
    changeReq == "hospitalAffiliation"
  ) {
    Object.defineProperty(query, changeReq, {
      value: Value,
      writable: false,
      enumerable: true,
      configurable: false,
    });
    try {
      await Doctor.findByIdAndUpdate(new mongoose.mongo.ObjectId(id), query);
      res.status(202).json({ message: "Updates Successful" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }else if(changeReq == "availability" || changeReq == "languagesSpoken" || changeReq == "appointments"){
    if(availChange == "add"){
      try {
        await Doctor.findByIdAndUpdate({_id:id}, {$addToSet:{changeReq:Value}});
        res.status(202).json({ message: "Updates Successful" });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
    if(availChange == "delete"){
      try {
        await Doctor.findByIdAndUpdate({_id:id}, {$pull:{changeReq:Value}});
        res.status(202).json({ message: "Updates Successful" });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
      
  }else {
    res.status(400).send();
  }
});


module.exports = router;
