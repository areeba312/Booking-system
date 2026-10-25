const mongoose = require('mongoose');
const Slot = require('../models/Slot');
const Room = require('../models/Room');
const { AppError } = require('../middleware/errors');

async function createSlot(data) {
  if (!data.roomCode) throw new AppError(400, 'roomCode is required');

  const room = await Room.findOne({ roomCode: String(data.roomCode).toUpperCase() });
  if (!room) throw new AppError(404, 'Room not found');

  // seats room se copy hoti hain, request se nahi
  return Slot.create({
    roomCode: room.roomCode,
    date: data.date,
    startHour: data.startHour,
    seats: room.seats,
    booked: 0,
  });
}

async function getSlot(id) {
  if (!mongoose.isValidObjectId(id)) throw new AppError(400, 'Invalid slot id');
  const slot = await Slot.findById(id);
  if (!slot) throw new AppError(404, 'Slot not found');
  return slot;
}

async function listSlots(query) {
  const { roomCode, date, hasSeats } = query;
  const filter = {};

  if (roomCode) filter.roomCode = String(roomCode).toUpperCase();
  if (date) filter.date = date;
  if (hasSeats === 'true') filter.$expr = { $lt: ['$booked', '$seats'] };

  const page = Math.max(parseInt(query.page) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit) || 10, 1), 100);

  const [items, total] = await Promise.all([
    Slot.find(filter)
      .sort({ date: 1, startHour: 1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Slot.countDocuments(filter),
  ]);

  return { items, page, limit, total };
}

module.exports = { createSlot, getSlot, listSlots };