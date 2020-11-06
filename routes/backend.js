const express = require('express');
const router = express.Router();
const partnerCtrl = require('../controllers/backend/partner');
const multer = require('../middleware/multer-config');
const containerCtrl = require('../controllers/backend/container');


router.post('/partner', multer, partnerCtrl.createPartner);
router.get('/partner', partnerCtrl.getAllPartner);
router.get('/partner/:id', partnerCtrl.getOnePartner);
router.put('/partner/:id', multer, partnerCtrl.updatePartner);
router.get('/partner/delete/:id', partnerCtrl.deletePartner);


router.post('/container', multer, containerCtrl.createContainer);
router.get('/container', containerCtrl.getAllContainer);
router.get('/container/:id', containerCtrl.getOneContainer);
router.put('/container/:id', multer, containerCtrl.updateContainer);
router.get('/container/delete/:id', containerCtrl.deleteContainer);



module.exports = router;
