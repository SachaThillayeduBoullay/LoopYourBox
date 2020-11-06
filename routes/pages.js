const express = require('express');
const router = express.Router();

const pageCtrl = require('../controllers/pages');


router.get('/checkout', pageCtrl.getCheckout);


module.exports = router;