const { default: mongoose } = require("mongoose");
const User = require("../models/user");
const bcryptjs = require('bcryptjs');

async function handleGetUsers(req, res) {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.sendStatus(500).send({ message: err.message });
  }
}

async function handleGetUserById(req, res) {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.sendStatus(500).send({ message: err.message });
  }
}

async function handleCreateUser(req, res) {
   const emailExist = await User.findOne({email:req.body.email});
    if(emailExist) return res.status(400).json({message:'Email already exist'});

    const hash = await bcryptjs.hashSync(req.body.password,10);

    req.body.password = hash;

    const user = new User(req.body);
    try {
       const savedUser = await user.save();
        return res.status(201).send({ user: savedUser });
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}

async function handleUpdateUser(req, res) {
  const { id } = req.params;
  const changeReq = req.query.change;
  const Value = req.body.value;

  try {
    if (changeReq == "createdBy")
      return res.status(400).json({ message: "Cannot change createdBy" });
    const user = await User.findByIdAndUpdate(
      id,
      { $set: { [changeReq]: Value } },
      { new: true }
    );
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: err.message });
  }
}

async function handleDeleteUser(req, res) {
  const deleteUserId = new mongoose.mongo.ObjectId(req.params["id"]);
  try {
    await User.deleteOne({ _id: deleteUserId });
    res.status(204).json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
    handleGetUsers,
    handleCreateUser,
    handleDeleteUser,
    handleUpdateUser,
    handleGetUserById
}