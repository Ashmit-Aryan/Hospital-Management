const router = require("express").Router();
const { default: mongoose } = require("mongoose");
const User = require("../Models/user");

router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.sendStatus(500).send({ message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  const { name, email, password ,role, phone, address, createdBy } = req.body;
  const user = new User({
    name,
    email,
    password,
    role,
    phone,
    address,
    createdBy,
  });
  try {
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: err.message });
  }
});
router.delete("/delete/:id", async (req, res) => {
  const deleteUserId = new mongoose.mongo.ObjectId(req.params["id"]);
  try {
    await User.deleteOne({ _id: deleteUserId });
    res.status(204).json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/update/:id/")

module.exports = router;
