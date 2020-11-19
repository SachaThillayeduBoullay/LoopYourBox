const express = require("express");
const router = express.Router();
//const auth = require("../..//middleware/auth");

const indexCtrl = require("../controllers/frontend/index");
const partnerCtrl = require("../controllers/frontend/partner");
const containerCtrl = require("../controllers/frontend/container");
const userCtrl = require("../controllers/frontend/user");

const pointCtrl = require("../controllers/frontend/point");
const mapCtrl = require("../controllers/frontend/map");
const qrCodeCtrl = require("../controllers/frontend/qrCode");
const myAccountCtrl = require("../controllers/frontend/myaccount");

const dashboardCtrl = require("../controllers/frontend/dashboard");

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
router.get("/mypartner", myAccountCtrl.myPartnerPage);
router.get("/mycontainer", myAccountCtrl.myContainerPage);


router.get("/dashboard", dashboardCtrl.dashboardPage);
router.get("/dashboard/user", dashboardCtrl.userPage);
router.get("/dashboard/partner", dashboardCtrl.partnerPage);
router.get("/dashboard/container", dashboardCtrl.containerPage);
router.get("/dashboard/history", dashboardCtrl.historyPage);

router.get("/point", pointCtrl.pointPage);

router.get("/map", mapCtrl.mapPage);

router.get("/qrcode", qrCodeCtrl.qrCodePage);

router.get("/qrcodepartner", qrCodeCtrl.qrCodePartnerPage);

module.exports = router;


