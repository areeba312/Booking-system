const mongoose = require('mongoose');
const Student = require('../models/Student');
const Slot = require('../models/Slot');
const Room = require('../models/Room');
const Booking = require('../models/Booking');
const { AppError } = require('../middleware/errors');
const { emitSlotUpdated } = require('../socket');

async function findStudent(regNo) {
  const student = await Student.findOne({ regNo: String(regNo).toUpperCase() });
  if (!student) throw new AppError(404, 'Student not found');
  return student;
}

function checkSlotId(slotId) {
  if (!mongoose.isValidObjectId(slotId)) throw new AppError(400, 'Invalid slotId');
}

async function bookSlot(regNo, slotId) {
  const student = await findStudent(regNo);
  checkSlotId(slotId);
  const slot = await Slot.findById(slotId);
  if (!slot) throw new AppError(404, 'Slot not found');

  if (await Booking.exists({ student: student._id, slot: slot._id })) {
    throw new AppError(409, 'Student already booked this slot', 'ALREADY_BOOKED');
  }

  // ek hi atomic step: seat tabhi barhti hai jab booked < seats
  const updated = await Slot.findOneAndUpdate(
    { _id: slot._id, $expr: { $lt: ['$booked', '$seats'] } },
    { $inc: { booked: 1 } },
    { returnDocument: 'after' }
  );
  if (!updated) throw new AppError(409, 'No free seats in this slot', 'SLOT_FULL');

  try {
    await Booking.create({ student: student._id, slot: slot._id });
  } catch (err) {
    await Slot.updateOne({ _id: slot._id }, { $inc: { booked: -1 } }); // seat wapas
    if (err.code === 11000) throw new AppError(409, 'Student already booked this slot', 'ALREADY_BOOKED');
    throw err;
  }

  emitSlotUpdated(updated);
  return updated;
}

async function cancelBooking(regNo, slotId) {
  const student = await findStudent(regNo);
  checkSlotId(slotId);
  const deleted = await Booking.findOneAndDelete({ student: student._id, slot: slotId });
  if (!deleted) throw new AppError(404, 'Booking not found');
  const updated = await Slot.findByIdAndUpdate(slotId, { $inc: { booked: -1 } }, { returnDocument: 'after' });
  emitSlotUpdated(updated);
  return true;
}

async function listBookings(regNo) {
  const student = await findStudent(regNo);
  const bookings = await Booking.find({ student: student._id }).populate('slot');
  const valid = bookings.filter((b) => b.slot);
  const codes = [...new Set(valid.map((b) => b.slot.roomCode))];
  const rooms = await Room.find({ roomCode: { $in: codes } });
  const nameOf = Object.fromEntries(rooms.map((r) => [r.roomCode, r.name]));

  return valid
    .map((b) => ({
      slotId: String(b.slot._id),
      roomCode: b.slot.roomCode,
      roomName: nameOf[b.slot.roomCode] || b.slot.roomCode,
      date: b.slot.date,
      startHour: b.slot.startHour,
    }))
    .sort((a, b) => a.date.localeCompare(b.date) || a.startHour - b.startHour);
}

module.exports = { bookSlot, cancelBooking, listBookings };
