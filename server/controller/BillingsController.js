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
const Appointment = require("../models/appointment");

async function handleCreateBills(req, res) {
  const { appointmentId } = req.body;

  try {
    // 1️⃣ Ensure appointment exists
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment || appointment.appointmentStatus !== "Completed") {
      return res.status(400).json({
        error: "Billing allowed only for completed appointments",
      });
    }

    const updatedData = {
     ...req.body
    };

    // 3️⃣ BACKEND COMPUTATION (SOURCE OF TRUTH)
    const totalAmount =
      updatedData.totalAmount !== undefined
        ? Number(updatedData.totalAmount)
        : bill.totalAmount;

    const amountPaid =
      updatedData.amountPaid !== undefined
        ? Number(updatedData.amountPaid)
        : bill.amountPaid;

    const balance = totalAmount - amountPaid;

    let paymentStatus = "Pending";
    let paymentDate = null;

    if (amountPaid === 0) {
      paymentStatus = "Pending";
    } else if (amountPaid < totalAmount) {
      paymentStatus = "Partially Paid";
    } else {
      paymentStatus = "Paid";
      paymentDate = bill.paymentDate || new Date();
    }

    updatedData.balance = balance;
    updatedData.paymentStatus = paymentStatus;
    updatedData.paymentDate = paymentDate;
    const billing = new Billing({
      ...updatedData,
      createdBy: req.user._id,
      updatedBy: req.user._id,
    });

    await billing.save();

    // 3️⃣ Update appointment with billnumber
    appointment.billId = billing._id;
    appointment.updatedBy = req.user._id;
    await appointment.save();

    return res.status(201).json({
      message: "Billing created and appointment updated",
      billing,
      appointment,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
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

  // ❌ fields never allowed from frontend
  const forbiddenFields = [
    "_id",
    "appointmentId",
    "patientId",
    "createdBy",
    "createdAt",
    "updatedAt",
    "invoiceNumber",
    "balance",
    "paymentStatus",
    "paymentDate",
  ];

  for (const field of forbiddenFields) {
    if (field in req.body) {
      return res.status(400).json({
        error: `Field '${field}' cannot be updated`,
      });
    }
  }

  try {
    // 1️⃣ Fetch existing bill
    const bill = await Billing.findById(id);
    if (!bill) {
      return res.status(404).json({
        error: "Billing record not found",
      });
    }

    // 2️⃣ Merge allowed updates
    const updatedData = {
      ...req.body,
      updatedBy: req.user._id,
    };

    // 3️⃣ BACKEND COMPUTATION (SOURCE OF TRUTH)
    const totalAmount =
      updatedData.totalAmount !== undefined
        ? Number(updatedData.totalAmount)
        : bill.totalAmount;

    const amountPaid =
      updatedData.amountPaid !== undefined
        ? Number(updatedData.amountPaid)
        : bill.amountPaid;

    const balance = totalAmount - amountPaid;

    let paymentStatus = "Pending";
    let paymentDate = null;

    if (amountPaid === 0) {
      paymentStatus = "Pending";
    } else if (amountPaid < totalAmount) {
      paymentStatus = "Partially Paid";
    } else {
      paymentStatus = "Paid";
      paymentDate = bill.paymentDate || new Date();
    }

    updatedData.balance = balance;
    updatedData.paymentStatus = paymentStatus;
    updatedData.paymentDate = paymentDate;

    // 4️⃣ Save
    const updatedBill = await Billing.findByIdAndUpdate(
      id,
      updatedData,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      message: "Billing updated successfully",
      billing: updatedBill,
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
  handleGetBillsById,
};
