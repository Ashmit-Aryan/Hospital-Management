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
  const bill = new Billing(req.body);

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
  const deleteBillId = new mongoose.Types.ObjectId(req.params["id"]);
  try {
    await Billing.deleteOne({ _id: deleteBillId });
    res.status(204).json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function handleUpdateBills(req, res) {
  const { id } = req.params;
  const {
    change: changeReq,
    value: Value,
    avail_change: availChange,
    insuranceDetails,
  } = req.body;
  const _id = new mongoose.Types.ObjectId(id);

  if (changeReq === "createdBy") {
    return res.status(400).json({ message: "Cannot change createdBy" });
  }

  try {
    if (changeReq !== "InsuranceDetails") {
      await Billing.findByIdAndUpdate(
        _id,
        { [changeReq]: Value },
        { new: true }
      );
      return res.status(202).json({ message: "Update successful" });
    }

    const updateOperations = {
      add: { $set: { insuranceDetails } },
      delete: { $unset: { insuranceDetails: "" } },
      update: { $set: { [`insuranceDetails.${changeReq}`]: Value } },
    };

    if (!updateOperations[availChange]) {
      return res.status(400).json({ error: "Invalid operation" });
    }

    await Billing.findByIdAndUpdate(_id, updateOperations[availChange]);
    return res
      .status(202)
      .json({ message: "Insurance details updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = {
    handleGetBills,
    handleCreateBills,
    handleDeleteBills,
    handleUpdateBills,
    handleGetBillsById
}