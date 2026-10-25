const { Server } = require('socket.io');
const Slot = require('./models/Slot');
let io;

function initSocket(server) {
  io = new Server(server);

  io.on('connection', (socket) => {
    socket.on('join:room', async (roomCode, ack) => {
      try {
        const code = String(roomCode || '').toUpperCase();
        socket.join(code);
        const slots = await Slot.find({ roomCode: code }).sort({ date: 1, startHour: 1 }).lean();
        if (typeof ack === 'function') ack({ ok: true, slots });
      } catch (err) {
        if (typeof ack === 'function') ack({ ok: false, error: 'Could not load slots' });
      }
    });
  });

  const admin = io.of('/admin');
  admin.use((socket, next) => {
    const key = socket.handshake.auth && socket.handshake.auth.adminKey;
    if (!process.env.ADMIN_KEY || key !== process.env.ADMIN_KEY) {
      return next(new Error('Invalid admin key'));
    }
    next();
  });
  admin.on('connection', (socket) => {
    socket.on('announce', (message) => {
      io.emit('announcement', { message: String(message).slice(0, 300) });
    });
  });
  return io;
}

function emitSlotUpdated(slot) {
  if (!io || !slot) return;
  io.to(slot.roomCode).emit('slot:updated', {
    slotId: String(slot._id),
    seatsLeft: slot.seats - slot.booked,
  });
}

module.exports = { initSocket, emitSlotUpdated };
