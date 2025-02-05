const router = require("express").Router();
const Billing = require("../Models/billings");

router.get("/", async (req, res) => {
  try {
    const bills = await Billing.find();
    res.json(bills);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  const { patientId, amount, services, paymentStatus, date } = req.body;
  const bill = new Billing({
    patientId,
    amount,
    services,
    paymentStatus,
    date,
  });
  try {
    await bill.save();
    res.status(201).json(bill);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/delete/:id", async (req, res) => {
  const deleteBillId = new mongoose.mongo.ObjectId(req.params["id"]);
  try {
    await billings.deleteOne({ _id: deleteBillId });
    res.status(204).json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
