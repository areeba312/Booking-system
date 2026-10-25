const mongoose = require('mongoose');
const bookingSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    slot: { type: mongoose.Schema.Types.ObjectId, ref: 'Slot', required: true },
  },
  { timestamps: true }
);
// ek student ek slot do baar book nahi kar sakta
bookingSchema.index({ student: 1, slot: 1 }, { unique: true });
module.exports = mongoose.model('Booking', bookingSchema);
