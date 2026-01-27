const mongoose = require('mongoose');

const user = new mongoose.Schema({
    name: {type:String,required:true,min:6,max:255},
    email: {type:String,required:true,unique:true,min:6,max:255},
    password: {type:String,required:true,min:8,max:1024},
    roles: {type:[String],required:true},
    phone: {type:String,required:true,min:10,max:10},
    address: {type:String,required:true,min:6,max:255},
    createdBy:{type:mongoose.mongo.ObjectId,required:true,min:6,max:255},
    updatedBy:{type:mongoose.mongo.ObjectId,required:true,min:6,max:255},
    updatedAt:{type:Date,required:true,default:Date.now},
    createdAt: {type:Date,required:true,default:Date.now}
})
user.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});
module.exports = mongoose.model("User",user);