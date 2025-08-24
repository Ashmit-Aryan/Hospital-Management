const router = require("express").Router();
const {
  handleGetUsers,
  handleCreateUser,
  handleDeleteUser,
  handleUpdateUser,
  handleGetUserById,
} = require("../controller/UserController");
const { verifyAuthToken,setAuth } = require("../middleware/auth");

router.use(verifyAuthToken)

router.get("/", handleGetUsers);

router.get("/:id", handleGetUserById);

router.delete("/delete/:id", handleDeleteUser);

router.put("/update/:id", setAuth ,handleUpdateUser);

module.exports = router;
