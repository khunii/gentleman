const express = require('express');
const router = express.Router();
const controller = require('./gen.ctrl');
var multer = require('multer');
var upload = multer({storage: multer.memoryStorage()});


router.get('/', controller.index);
router.post('/', controller.generate);
router.post('/fromjson', controller.generateFromJson);
router.post('/listapi', controller.listapi);
router.post('/checkdupid', controller.checkDupId);
router.post('/import', upload.single('jsonFile'), controller.importcoll);
router.post('/showapis', controller.showapis);
// router.get('/:id', ctrl.show);
// router.delete('/:id', ctrl.destroy);
// router.post('/', ctrl.create);
// router.put('/:id',ctrl.update);

module.exports = router;
