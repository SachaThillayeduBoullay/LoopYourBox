const express = require('express');
const router = express.Router();
const partnerCtrl = require('../controllers/backend/partner');
const multer = require('../middleware/multer-config');


router.post('/partner', multer, partnerCtrl.createPartner);
router.get('/partner', partnerCtrl.getAllPartner);
router.get('/partner/:id', partnerCtrl.getOnePartner);
router.put('/partner/:id', multer, partnerCtrl.updatePartner);
router.get('/partner/delete/:id', partnerCtrl.deletePartner);


module.exports = router;
