const router = require('express').Router();
const roomController = require('../controllers/roomController');

router.get('/', roomController.list);
router.post('/', roomController.create);
router.get('/:roomCode', roomController.getOne);
router.put('/:roomCode', roomController.update);
router.patch('/:roomCode', roomController.update);
router.delete('/:roomCode', roomController.remove);

module.exports = router;