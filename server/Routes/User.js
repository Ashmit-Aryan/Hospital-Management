const router = require("express").Router();
const { default: mongoose} = require("mongoose");
const User = require("../Models/user");

router.get("/", async(req,res)=>{
    res.sendStatus(200);
    console.log(req.params.id);
})

module.exports = router;