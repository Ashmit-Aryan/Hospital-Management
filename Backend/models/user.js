import mongoose, { mongo } from "mongoose"

const user = new mongoose.Schema({
    name: {type:String,required:true,min:6,max:255},
    email: {type:String,required:true,unique:true,min:6,max:255},
    password: {type:String,required:true,min:8,max:1024},
    role: {type:String,required:true,min:6,max:255},
    phone: {type:String,required:true,min:10,max:10},
    address: {type:String,required:true,min:6,max:255},
    createdBy:{type:String,required:true,min:6,max:255},
    createdAt: {type:Date,required:true,default:Date.now}
})

module.exports = mongoose.model("User",user);