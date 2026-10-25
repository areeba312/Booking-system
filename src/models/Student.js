const mongoose = require('mongoose');
const studentSchema = new mongoose.Schema(
  {
    regNo: {
      type: String, required: true, unique: true, uppercase: true, trim: true,
      match: [/^[A-Z]{2}\d{2}-[A-Z]{3}-\d{3}$/, 'regNo must look like FA23-BCS-045'],
    },
    name: { type: String, required: true, trim: true },
    email: {
      type: String, required: true, unique: true, lowercase: true, trim: true,
      match: [/^\S+@\S+\.\S+$/, 'invalid email'],
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model('Student', studentSchema);
