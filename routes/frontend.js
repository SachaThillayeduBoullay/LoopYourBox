const express = require("express");
const router = express.Router();
//const auth = require("../..//middleware/auth");

const partnerCtrl = require("../controllers/frontend/partner");

router.get("/", partnerCtrl.partnerPage);

module.exports = router;
