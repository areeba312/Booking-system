const studentService = require('../services/studentService');
const bookingService = require('../services/bookingService');

exports.create = async (req, res, next) => {
  try {
    res.status(201).json(await studentService.createStudent(req.body));
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    res.status(200).json(await studentService.getStudent(req.params.regNo));
  } catch (err) {
    next(err);
  }
};

exports.book = async (req, res, next) => {
  try {
    const slot = await bookingService.bookSlot(req.params.regNo, req.body.slotId);
    res.status(201).json({ message: 'Booked', slot });
  } catch (err) {
    next(err);
  }
};

exports.listBookings = async (req, res, next) => {
  try {
    res.status(200).json(await bookingService.listBookings(req.params.regNo));
  } catch (err) {
    next(err);
  }
};

exports.cancel = async (req, res, next) => {
  try {
    await bookingService.cancelBooking(req.params.regNo, req.params.slotId);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
