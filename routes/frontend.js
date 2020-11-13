const express = require("express");
const router = express.Router();
//const auth = require("../..//middleware/auth");

const partnerCtrl = require("../controllers/frontend/partner");
const containerCtrl = require("../controllers/frontend/container");

router.get("/partner", partnerCtrl.partnerPage);
router.get("/partner/:id", partnerCtrl.partnerDetailsPage);
router.get("/createPartner", partnerCtrl.createPartnerPage);
router.get("/updatePartner/:id", partnerCtrl.updatePartnerPage);


router.get("/container", containerCtrl.containerPage);
router.get("/container/:id", containerCtrl.containerDetailsPage);
router.get("/createContainer", containerCtrl.createContainerPage);
router.get("/updateContainer/:id", containerCtrl.updateContainerPage);

module.exports = router;
