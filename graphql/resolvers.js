const { GraphQLError } = require('graphql');
const roomService = require('../src/services/roomService');
const slotService = require('../src/services/slotService');
const studentService = require('../src/services/studentService');
const bookingService = require('../src/services/bookingService');

// AppError ko GraphQL error mein badalta hai
async function run(fn) {
  try {
    return await fn();
  } catch (err) {
    if (err.status) {
      throw new GraphQLError(err.message, {
        extensions: { code: err.appCode || String(err.status), status: err.status },
      });
    }
    throw err;
  }
}

const slotOut = (s) => ({
  id: String(s._id), roomCode: s.roomCode, date: s.date,
  startHour: s.startHour, seats: s.seats, booked: s.booked,
});

module.exports = {
  Query: {
    rooms: () => run(() => roomService.listRooms()),
    slots: (_, { roomCode, date }) =>
      run(async () => (await slotService.listSlots({ roomCode, date, limit: 100 })).items.map(slotOut)),
    student: (_, { regNo }) => run(() => studentService.getStudent(regNo)),
  },
  Student: {
    bookings: (parent) => run(() => bookingService.listBookings(parent.regNo)),
  },
  Mutation: {
    bookSlot: (_, { regNo, slotId }) => run(async () => slotOut(await bookingService.bookSlot(regNo, slotId))),
    cancelBooking: (_, { regNo, slotId }) => run(() => bookingService.cancelBooking(regNo, slotId)),
  },
};
