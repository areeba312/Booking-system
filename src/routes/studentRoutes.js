const router = require('express').Router();
const c = require('../controllers/studentController');
router.post('/', c.create);
router.get('/:regNo', c.getOne);
router.post('/:regNo/bookings', c.book);
router.get('/:regNo/bookings', c.listBookings);
router.delete('/:regNo/bookings/:slotId', c.cancel);
module.exports = router;
