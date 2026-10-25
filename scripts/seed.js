require('dotenv').config();
const mongoose = require('mongoose');
const Room = require('../src/models/Room');
const Slot = require('../src/models/Slot');
const Student = require('../src/models/Student');
const Booking = require('../src/models/Booking');

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  await Promise.all([Room.deleteMany({}), Slot.deleteMany({}), Student.deleteMany({}), Booking.deleteMany({})]);

  const rooms = await Room.insertMany([
    { roomCode: 'ROOM-01', name: 'Quiet Room', building: 'Library', seats: 4 },
    { roomCode: 'ROOM-02', name: 'Group Study Room', building: 'CS Block', seats: 6 },
    { roomCode: 'ROOM-03', name: 'Mini Lab', building: 'Library', seats: 2 },
  ]);

  const slots = [];
  const dates = ['2026-11-02', '2026-11-03'];
  const hours = [8, 10, 12];
  for (const r of rooms) {
    for (const date of dates) {
      for (const startHour of hours) {
        slots.push({ roomCode: r.roomCode, date, startHour, seats: r.seats, booked: 0 });
      }
    }
  }
  await Slot.insertMany(slots); // 3 rooms x 2 dates x 3 hours = 18 slots

  await Student.insertMany([
    { regNo: 'FA23-BCS-045', name: 'Ali Khan', email: 'ali@example.com' },
    { regNo: 'FA23-BCS-046', name: 'Sara Ahmed', email: 'sara@example.com' },
    { regNo: 'FA23-BCS-047', name: 'Usman Raza', email: 'usman@example.com' },
  ]);

  console.log(`Seeded ${rooms.length} rooms, ${slots.length} slots, 3 students`);
  await mongoose.disconnect();
})().catch((e) => { console.error(e); process.exit(1); });
