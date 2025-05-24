const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: {type:String,required:true},
  specialization: {type:String,required:true},
  experience: { type: Number, required: true }, // in years
  qualifications: {type:String,required:true},
  hospitalAffiliation: {type:String,required:true},
  languagesSpoken: [String], // Array of languages
  contact: {type:String,required:true},
  appointments:[String],
  availability: [String], // Array of available days/times
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Doctor', doctorSchema);
