const router = require('express').Router();

router.use('/rooms', require('./roomRoutes'));
router.use('/slots', require('./slotRoutes'));
router.use('/students', require('./studentRoutes'));

module.exports = router;
