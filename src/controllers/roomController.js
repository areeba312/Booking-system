const roomService = require('../services/roomService');

exports.create = async (req, res, next) => {
  try {
    const room = await roomService.createRoom(req.body);
    res.status(201).json(room);
  } catch (err) {
    next(err);
  }
};

exports.list = async (req, res, next) => {
  try {
    res.status(200).json(await roomService.listRooms());
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    res.status(200).json(await roomService.getRoom(req.params.roomCode));
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const room = await roomService.updateRoom(
      req.params.roomCode,
      req.body
    );
    res.status(200).json(room);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    await roomService.deleteRoom(req.params.roomCode);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
