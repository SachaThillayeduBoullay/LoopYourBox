const express = require("express");
const router = express.Router();
//const auth = require("../..//middleware/auth");

const partnerCtrl = require("../controllers/frontend/partner");

router.get("/partner", partnerCtrl.partnerPage);
router.get("/partner/:id", partnerCtrl.partnerDetailsPage);
router.get("/createPartner", partnerCtrl.createPartnerPage);
router.get("/updatePartner/:id", partnerCtrl.updatePartnerPage);

module.exports = router;
