import mongoose, { mongo } from "mongoose"

const user = new mongoose.Schema({
    name: {type:String,require:true},
    email: {type:String,require:true,unique:true},
    password: {type:String,require:true},
    role: {type:String,require:true},
    phone: {type:String,require:true},
    address: {type:String,require:true},
    createdAt: {type:Date,require:true,default:Date.now}
})

module.exports = mongoose.model("User",user);