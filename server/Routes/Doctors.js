const router = require("express").Router();
const {
  handleGetDoctors,
  handleCreateDoctors,
  handleDeleteDoctors,
  handleGetDoctorsById,
  handleUpdateDoctors,
} = require("../controller/DoctorsController");
const { verifyAuthToken,setAuth } = require("../middleware/auth");

router.use(verifyAuthToken)
router.get("/", handleGetDoctors);
router.get("/:id", handleGetDoctorsById);
router.post("/", setAuth,handleCreateDoctors);
router.delete("/delete/:id",setAuth ,handleDeleteDoctors);
router.put("/update/:id", setAuth ,handleUpdateDoctors);

module.exports = router;
