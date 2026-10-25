const slotService = require('../services/slotService');

exports.create = async (req, res, next) => {
  try {
    res.status(201).json(await slotService.createSlot(req.body));
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    res.status(200).json(await slotService.getSlot(req.params.id));
  } catch (err) {
    next(err);
  }
};

exports.list = async (req, res, next) => {
  try {
    res.status(200).json(await slotService.listSlots(req.query));
  } catch (err) {
    next(err);
  }
};