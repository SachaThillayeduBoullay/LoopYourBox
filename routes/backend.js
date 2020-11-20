const express = require('express');
const router = express.Router();
const partnerCtrl = require('../controllers/backend/partner');
const multer = require('../middleware/multer-config');
const containerCtrl = require('../controllers/backend/container');
const userCtrl = require('../controllers/backend/user');
const historyCtrl = require('../controllers/backend/history');
const auth = require("../middleware/auth");



router.post('/partner', multer, partnerCtrl.createPartner);
router.get('/partner/container/:userId', partnerCtrl.getPartnerFromUserId);
router.get('/partner', partnerCtrl.getAllPartner);
router.get('/partner/:id', partnerCtrl.getOnePartner);
router.put('/partner/:id', multer, partnerCtrl.updatePartner);
router.get('/partner/delete/:id', partnerCtrl.deletePartner);


router.post('/container', multer, containerCtrl.createContainer);
router.get('/container', containerCtrl.getAllContainer);
router.get('/container/partner/:default', containerCtrl.getAllDefaultContainer);
router.get('/containerpartner/:id', containerCtrl.getAllPartnerContainer);
router.get('/container/:id', containerCtrl.getOneContainer);
router.put('/container/:id', multer, containerCtrl.updateContainer);
router.get('/container/delete/:id', containerCtrl.deleteContainer);

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.get('/user',  userCtrl.getAllUser);
router.get('/user/:id',  userCtrl.getOneUser);
router.put('/user/:id', userCtrl.updateUser);
router.get('/user/delete/:id',  userCtrl.deleteUser);
router.post('/lostpwd', userCtrl.lostPwd);
router.get('/logout', userCtrl.getLogout);

router.get('/history', historyCtrl.getAllHistory);
router.post('/history', historyCtrl.createHistory);
/*router.get('/history/:id', historyCtrl.getOneHistory);
router.put('/history/:id', historyCtrl.updateHistory);
router.get('/history/delete/:id', historyCtrl.deleteHistory);*/


module.exports = router;







