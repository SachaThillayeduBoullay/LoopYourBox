const express = require('express');
const router = express.Router();
const partnerCtrl = require('../controllers/backend/partner');
const multer = require('../middleware/multer-config');
const containerCtrl = require('../controllers/backend/container');
const userCtrl = require('../controllers/backend/user');
const historyCtrl = require('../controllers/backend/history');
const qrcodeCtrl = require('../controllers/backend/qrcode');
const pointCtrl = require('../controllers/backend/point');
const userContainerCtrl = require('../controllers/backend/userContainer');
const authAdminBack = require("../middleware/authAdminBack");
const authPartnerBack = require("../middleware/authPartnerBack");
const authMemberBack = require("../middleware/authMemberBack");
const authUserBack = require("../middleware/authUserBack");



router.post('/partner', authPartnerBack, multer, partnerCtrl.createPartner);
router.get('/partner/container/:userId', partnerCtrl.getPartnerFromUserId);
router.get('/partner', partnerCtrl.getAllPartner);
router.get('/partner/:id', partnerCtrl.getOnePartner);
router.put('/partner/:id', authPartnerBack, multer, partnerCtrl.updatePartner);
router.get('/partner/delete/:id', authPartnerBack, partnerCtrl.deletePartner);


router.post('/container', authPartnerBack, multer, containerCtrl.createContainer);
router.get('/container', containerCtrl.getAllContainer);
router.get('/container/partner/:default', containerCtrl.getAllDefaultContainer);
router.get('/containerpartner/:id', containerCtrl.getAllPartnerContainer);
router.get('/container/:id', containerCtrl.getOneContainer);
router.put('/container/:id', authPartnerBack, multer, containerCtrl.updateContainer);
router.get('/container/delete/:id', authPartnerBack, containerCtrl.deleteContainer);

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.get('/user', authAdminBack, userCtrl.getAllUser);
router.get('/user/:id', /*authUserBack,*/ userCtrl.getOneUser);
router.put('/user/:id', /*authUserBack,*/ userCtrl.updateUser);
router.put('/user/password/:id', /*authUserBack,*/ userCtrl.modifyPassword);
router.put('/user/passwordrecovery/:id', userCtrl.recoveryPassword);
router.get('/user/delete/:id',  /*authUserBack,*/ userCtrl.deleteUser);
router.post('/lostpwd', userCtrl.lostPwd);
router.get('/logout', /*authUserBack,*/ userCtrl.getLogout);

router.get('/history', authAdminBack, historyCtrl.getAllHistory);
router.post('/history', authMemberBack, historyCtrl.createHistory);
router.get('/history/:reference', historyCtrl.getOneHistory); // nouveau auth
/*router.put('/history/:id', historyCtrl.updateHistory);
router.get('/history/delete/:id', historyCtrl.deleteHistory);*/

router.post('/qrcode', authPartnerBack, qrcodeCtrl.saveQrcode);
router.get('/qrcode/:reference', authMemberBack, qrcodeCtrl.getOneQrcode);

router.get('/point/:userId', /*authUserBack,*/ pointCtrl.getOneUserPoint);
router.put('/point/:userId', pointCtrl.updateOneUserPoint); //a supprimer plus tard



router.get('/userContainer/:userId', /*authUserBack,*/ userContainerCtrl.getAllUserContainer);
router.get('/userContainer/:containerId/:userId', /*authUserBack,*/ userContainerCtrl.getOneUserContainer);



module.exports = router;







