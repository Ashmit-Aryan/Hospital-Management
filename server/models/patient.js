const mongoose = require('mongoose');
const appointment = require('./appointment');

const patientSchema = new mongoose.Schema({
  name: {type:String,required:true},
  age: { type: Number, required: true },
  gender: {type:String,required:true},
  address: {type:String,required:true},
  contact: {type:String,required:true},
  appointmentId:{type:[String]},
  medicalHistory: {type:String,required:true},
  createdAt: { type: Date, default: Date.now },
  createdBy:{type:mongoose.mongo.ObjectId,required:true},
  updatedBy:{type:mongoose.mongo.ObjectId,required:true},
  updatedAt: { type: Date, default: Date.now }
  
});

patientSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Patient', patientSchema);
