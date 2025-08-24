const router = require("express").Router();
const {
  handleGetBills,
  handleCreateBills,
  handleDeleteBills,
  handleUpdateBills,
  handleGetBillsById,
} = require("../controller/BillingsController");
const { verifyAuthToken,setAuth } = require("../middleware/auth");

router.use(verifyAuthToken)
// Get all bills
router.get("/",handleGetBills);

// Get a Bill By id
router.get("/:id",handleGetBillsById);

// Create a new bill
router.post("/",handleCreateBills);

// Update a bill
router.put("/update/:id",handleUpdateBills);

// Delete a bill
router.delete("/delete/:id",setAuth,handleDeleteBills);

module.exports = router;

// generate me an example of a billing record
// {
//   "patientId": "1234567890",
//   "services": "Consultation, X-Ray",
//   "paymentStatus": "Pending",
//   "paymentMethod": "Cash",
//   "insuranceDetails": {
//     "provider": "ABC Insurance",
//     "policyNumber": "XYZ123456",
//     "coverageAmount": 1000
//   },
//   "discount": 10,
//   "tax": 5,
//   "totalAmount": 100,
//   "amountPaid": 50,
//   "balance": 50,
//   "dueDate": "2023-12-31",
//   "paymentDate": null,
//   "invoiceNumber": "INV123456",
//   "notes": "Follow up in 2 weeks",
//   "createdBy": "admin",
//   "updatedBy": "admin",
//   "updatedAt": "2023-10-01T00:00:00Z",
//   "createdAt": "2023-10-01T00:00:00Z"
// }
