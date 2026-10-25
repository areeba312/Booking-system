const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema(
  {
    roomCode: { type: String, required: true, uppercase: true, trim: true },
    date: {
      type: String,
      required: true,
      match: [/^\d{4}-\d{2}-\d{2}$/, 'date must be YYYY-MM-DD'],
    },
    startHour: {
      type: Number,
      required: true,
      enum: [8, 10, 12, 14, 16],
    },
    seats: { type: Number, required: true, min: 1 },
    booked: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

// ek room ka ek din ek waqt par sirf ek slot
slotSchema.index({ roomCode: 1, date: 1, startHour: 1 }, { unique: true });

module.exports = mongoose.model('Slot', slotSchema);