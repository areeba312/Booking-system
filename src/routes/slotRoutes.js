const router = require('express').Router();
const slotController = require('../controllers/slotController');

router.get('/', slotController.list);
router.post('/', slotController.create);
router.get('/:id', slotController.getOne);

module.exports = router;