const Room = require('../models/Room');
const { AppError } = require('../middleware/errors');

async function createRoom(data) {
  return Room.create(data);
}

async function listRooms() {
  return Room.find().sort({ roomCode: 1 });
}

async function getRoom(roomCode) {
  const room = await Room.findOne({ roomCode: roomCode.toUpperCase() });
  if (!room) throw new AppError(404, 'Room not found');
  return room;
}

async function updateRoom(roomCode, data) {
  const code = roomCode.toUpperCase();

  if (data.roomCode !== undefined && String(data.roomCode).toUpperCase() !== code) {
    throw new AppError(422, 'roomCode cannot be changed');
  }
  delete data.roomCode;

  const room = await Room.findOneAndUpdate({ roomCode: code }, data, {
    new: true,
    runValidators: true,
  });
  if (!room) throw new AppError(404, 'Room not found');
  return room;
}

async function deleteRoom(roomCode) {
  const room = await Room.findOneAndDelete({ roomCode: roomCode.toUpperCase() });
  if (!room) throw new AppError(404, 'Room not found');
}

module.exports = { createRoom, listRooms, getRoom, updateRoom, deleteRoom };