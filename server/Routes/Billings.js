const router = require("express").Router();
const mongoose = require("mongoose");
const Billing = require("../models/billings");

// Get all bills
router.get("/", async (req, res) => {
  try {
    const bills = await Billing.find();
    res.json(bills);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new bill
router.post("/", async (req, res) => {
  const bill = new Billing(req.body);

  try {
    const savedBill = await bill.save();
    res.status(201).json(savedBill);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a bill
router.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { change: changeReq, value: Value, avail_change: availChange, insuranceDetails } = req.body;
  const _id = new mongoose.Types.ObjectId(id);

  if (changeReq === "createdBy") {
    return res.status(400).json({ message: "Cannot change createdBy" });
  }

  try {
    if (changeReq !== "InsuranceDetails") {
      await Billing.findByIdAndUpdate(_id, { [changeReq]: Value }, { new: true });
      return res.status(202).json({ message: "Update successful" });
    }

    const updateOperations = {
      add: { $set: { insuranceDetails } },
      delete: { $unset: { insuranceDetails: "" } },
      update: { $set: { [`insuranceDetails.${changeReq}`]: Value } }
    };

    if (!updateOperations[availChange]) {
      return res.status(400).json({ error: "Invalid operation" });
    }

    await Billing.findByIdAndUpdate(_id, updateOperations[availChange]);
    return res.status(202).json({ message: "Insurance details updated successfully" });
    
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});


// Delete a bill
router.delete("/delete/:id", async (req, res) => {
  const deleteBillId = new mongoose.Types.ObjectId(req.params["id"]);
  try {
    await Billing.deleteOne({ _id: deleteBillId });
    res.status(204).json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

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
