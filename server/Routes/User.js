const router = require("express").Router();
const {
  handleGetUsers,
  handleCreateUser,
  handleDeleteUser,
  handleUpdateUser,
  handleGetUserById,
} = require("../controller/UserController");
const { getUser } = require("../middleware/auth");

router.use(getUser)

router.get("/", handleGetUsers);

router.get("/:id", handleGetUserById);

router.post("/", handleCreateUser);

router.delete("/delete/:id", handleDeleteUser);

router.put("/update/:id", handleUpdateUser);

module.exports = router;
