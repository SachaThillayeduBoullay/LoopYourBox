const express = require("express");
const router = express.Router();
//const auth = require("../..//middleware/auth");

const indexCtrl = require("../controllers/frontend/index");
const partnerCtrl = require("../controllers/frontend/partner");
const containerCtrl = require("../controllers/frontend/container");
const userCtrl = require("../controllers/frontend/user");

const mapCtrl = require("../controllers/frontend/map");
const qrCodeCtrl = require("../controllers/frontend/qrCode");
const myAccountCtrl = require("../controllers/frontend/myaccount");

router.get("/", indexCtrl.indexPage);
router.get("/home", indexCtrl.homePage);

// PARTNER
router.get("/partner", partnerCtrl.partnerPage);
router.get("/partner/:id", partnerCtrl.partnerDetailsPage);
router.get("/createPartner", partnerCtrl.createPartnerPage);
router.get("/updatePartner/:id", partnerCtrl.updatePartnerPage);
router.get('/home',  )
// CONTAINER

router.get("/container", containerCtrl.containerPage);
router.get("/container/:id", containerCtrl.containerDetailsPage);
router.get("/createContainer", containerCtrl.createContainerPage);
router.get("/updateContainer/:id", containerCtrl.updateContainerPage);
// USER
router.get("/user", userCtrl.userPage);
router.get("/user/:id", userCtrl.userDetailsPage);
router.get("/register", userCtrl.createUserPage);
router.get("/updateUser/:id", userCtrl.updateUserPage);
router.get("/login", userCtrl.loginPage);


router.get("/myaccount", myAccountCtrl.myAccountPage);

router.get("/map", mapCtrl.mapPage);

router.get("/qrcode", qrCodeCtrl.qrCodePage);

module.exports = router;


