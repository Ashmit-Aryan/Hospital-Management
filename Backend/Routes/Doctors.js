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

router.post("/", async (req, res) => {
  const { name, specialization, contact, availability } = req.body;
  const doctor = new Doctor({ name, specialization, contact, availability });
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
router.put("/update/:id/:changeReq/", async (req, res) => {
  const id = req.params["id"];
  const changeReq = req.params["changeReq"];
  const Value = req.body.value;
  const availChange = req.body.avail_change;
  const prevValue = req.body.prev_value;
  const query = {};
  if (
    changeReq == "name" ||
    changeReq == "specialization" ||
    changeReq == "contact"
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
    //   try {
    //     await Doctor.findByIdAndUpdate(new mongoose.mongo.ObjectId(_id), {
    //       $set: { changeReq: value },
    //     });
    //     res.status(202).json({ message: "Updates Successful" });
    //   } catch (error) {
    //     res.status(500).json({ message: error.message });
    //   }
    // } else if (changeReq == "availability") {
    //   if (availChange == "add") {
    //     try {
    //       await Doctor.updateOne(
    //         { _id: new mongoose.mongo.BSON.ObjectId(id) },
    //         { availability: value }
    //       );
    //       res.status(202).json({ message: "Done" });
    //     } catch (error) {
    //       res.status(500).json({ message: error.message });
    //     }
    //   }
    //   }else if(availChange == 'delete' && prevValue != undefined){
    //     try {
    //       await Doctor.findByIdAndUpdate(
    //         new mongoose.mongo.ObjectId(_id),
    //         {$:{availability:value}},
    //         {upsert:true}
    //       )
    //     } catch (error) {
    //       res.status(500).json({message:error.message});
    //     }
    //   }
  }else if(changeReq == "availability"){
    if(availChange == "add"){
      try {
        await Doctor.findByIdAndUpdate(new mongoose.mongo.ObjectId(id), {$push:{availability:Value}});
        res.status(202).json({ message: "Updates Successful" });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
    if(availChange == "delete"){
      try {
        await Doctor.findByIdAndUpdate(new mongoose.mongo.ObjectId(id), {$pull:{availability:Value}});
        res.status(202).json({ message: "Updates Successful" });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
    if(availChange == "update"){
      try {
        await Doctor.findById(id).setUpdate({prevValue},{$set:{"availability.$":Value}});
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
