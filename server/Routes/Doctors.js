const router = require("express").Router();
const {
  handleGetDoctors,
  handleCreateDoctors,
  handleDeleteDoctors,
  handleGetDoctorsById,
  handleUpdateDoctors,
} = require("../controller/DoctorsController");
const { getUser } = require("../middleware/auth");

router.use(getUser)
router.get("/", handleGetDoctors);
router.get("/:id", handleGetDoctorsById);
router.post("/", handleCreateDoctors);
router.delete("/delete/:id", handleDeleteDoctors);
router.put("/update/:id", handleUpdateDoctors);

module.exports = router;
