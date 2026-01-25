const mongoose = require("mongoose");
const Billing = require("../models/billings");

async function handleGetBills(req, res) {
  try {
    const bills = await Billing.find();
    res.json(bills);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function handleCreateBills(req, res) {
  const bill = new Billing({...req.body, createdBy: req.user._doc._id, updatedBy: req.user._doc._id});

  try {
    const savedBill = await bill.save();
    res.status(201).json(savedBill);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function handleGetBillsById(req, res) {
  const id = req.params.id;
  try {
    const bills = await Billing.findById(id);
    if (!bills) return res.status(404).json({ message: "Bill not found" });
    res.json(bills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
async function handleDeleteBills(req, res) {
  const { id } = req.params;

  try {
    const deletedBill = await Billing.findByIdAndDelete(id);

    if (!deletedBill) {
      return res.status(404).json({
        error: "Billing record not found",
      });
    }

    return res.status(200).json({
      message: "Billing record deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
}


async function handleUpdateBills(req, res) {
  const { id } = req.params;
  const {
    change,
    value,
    action, // add | update | delete (for insuranceDetails)
    insuranceDetails,
  } = req.body;

  // ❌ Prevent audit tampering
  if (change === "createdBy") {
    return res.status(400).json({
      error: "createdBy cannot be modified",
    });
  }

  // Fields allowed for direct update
  const allowedFields = [
    "services",
    "paymentStatus",
    "paymentMethod",
    "discount",
    "tax",
    "totalAmount",
    "amountPaid",
    "dueDate",
    "paymentDate",
    "notes",
  ];

  try {
    // ==============================
    // NORMAL FIELD UPDATE
    // ==============================
    if (change !== "insuranceDetails") {
      if (!allowedFields.includes(change)) {
        return res.status(400).json({
          error: "Invalid field update",
        });
      }

      await Billing.findByIdAndUpdate(
        id,
        {
          [change]: value,
          updatedBy: req.user._doc._id,
        },
        { runValidators: true }
      );

      return res.status(200).json({
        message: "Billing updated successfully",
      });
    }

    // ==============================
    // INSURANCE DETAILS UPDATE
    // ==============================
    let updateOperation;

    switch (action) {
      case "add":
        updateOperation = {
          $set: { insuranceDetails },
          $setOnInsert: {},
        };
        break;

      case "update":
        updateOperation = {
          $set: { insuranceDetails },
        };
        break;

      case "delete":
        updateOperation = {
          $unset: { insuranceDetails: "" },
        };
        break;

      default:
        return res.status(400).json({
          error: "Invalid insuranceDetails action",
        });
    }

    updateOperation.$set = {
      ...(updateOperation.$set || {}),
      updatedBy: req.user._doc._id,
    };

    await Billing.findByIdAndUpdate(id, updateOperation);

    return res.status(200).json({
      message: "Insurance details updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
}

module.exports = {
    handleGetBills,
    handleCreateBills,
    handleDeleteBills,
    handleUpdateBills,
    handleGetBillsById
}