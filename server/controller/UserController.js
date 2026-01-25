const { default: mongoose } = require("mongoose");
const User = require("../models/user");
const bcryptjs = require("bcryptjs");

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
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist)
    return res.status(400).json({ message: "Email already exist" });

  const hash = await bcryptjs.hashSync(req.body.password, 10);

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
  const updates = req.body;

  // ❌ Block audit fields
  if ("createdBy" in updates) {
    return res.status(400).json({
      error: "createdBy cannot be modified",
    });
  }

  // Scalar fields allowed
  const allowedScalarFields = [
    "name",
    "email",
    "phone",
    "address",
  ];

  // Array fields (RBAC)
  const allowedArrayFields = ["roles"];

  const updatePayload = {};
  const arrayOperations = [];

  // Handle scalar updates
  for (const key of allowedScalarFields) {
    if (key in updates) {
      updatePayload[key] = updates[key];
    }
  }

  // Handle array updates
  for (const key of allowedArrayFields) {
    if (key in updates) {
      const { action, value } = updates[key];

      if (!["add", "remove"].includes(action)) {
        return res.status(400).json({
          error: `Invalid action for ${key}`,
        });
      }

      arrayOperations.push(
        action === "add"
          ? { $addToSet: { [key]: value } }
          : { $pull: { [key]: value } }
      );
    }
  }

  // ❌ Nothing to update
  if (
    Object.keys(updatePayload).length === 0 &&
    arrayOperations.length === 0
  ) {
    return res.status(400).json({
      error: "No valid fields to update",
    });
  }

  try {
    // ✅ Apply scalar updates + updatedBy
    if (Object.keys(updatePayload).length > 0) {
      await User.findByIdAndUpdate(
        id,
        {
          ...updatePayload,
          updatedBy: req.user._id,
        },
        { runValidators: true }
      );
    }

    // ✅ Apply array updates + updatedBy
    for (const op of arrayOperations) {
      await User.findByIdAndUpdate(id, {
        ...op,
        $set: { updatedBy: req.user._doc._id },
      });
    }

    const updatedUser = await User.findById(id);

    if (!updatedUser) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    return res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
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
  handleGetUserById,
};
