const express = require('express');
const router = express.Router();
const controller = require('./gen.ctrl');

router.get('/', controller.index);
router.post('/', controller.generate);
router.post('/fromjson', controller.generateFromJson);
router.post('/listapi', controller.listapi);
// router.get('/:id', ctrl.show);
// router.delete('/:id', ctrl.destroy);
// router.post('/', ctrl.create);
// router.put('/:id',ctrl.update);

module.exports = router;
