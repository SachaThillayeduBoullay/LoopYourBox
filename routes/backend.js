const express = require('express');
const router = express.Router();
const partnerCtrl = require('../controllers/backend/partner');
const userCtrl = require('../controllers/backend/user');
const multer = require('../middleware/multer-config');
const containerCtrl = require('../controllers/backend/container');
const auth = require("../middleware/auth");


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

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.get('/user', auth, userCtrl.getAllUser);
router.get('/user/:id', auth, userCtrl.getOneUser);
router.put('/user/:id', userCtrl.updateUser);
router.delete('/user/:id', auth, userCtrl.deleteUser);
router.post('/lostpwd', userCtrl.lostPwd);
router.get('/logout', userCtrl.getLogout);


module.exports = router;
