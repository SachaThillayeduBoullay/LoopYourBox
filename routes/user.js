const express = require('express');
const router = express.Router();

const auth = require("../middleware/auth");
const userCtrl = require('../controllers/user');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

router.get('/user', auth, userCtrl.getAllUser);
router.get('/user/:id', auth, userCtrl.getOneUser);
router.put('/user/:id', userCtrl.updateUser);
router.delete('/user/:id', auth, userCtrl.deleteUser);

router.post('/lostpwd', userCtrl.lostPwd);


module.exports = router;