const express = require("express");
const router = express.Router();

const authAdmin = require("../middleware/authAdmin");
const authPartner = require("../middleware/authPartner");
const authMember = require("../middleware/authMember");
const authUser = require("../middleware/authUser");

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
router.get("/createPartner", authPartner, partnerCtrl.createPartnerPage);
router.get("/updatePartner/:id", authPartner, partnerCtrl.updatePartnerPage);

// CONTAINER
router.get("/container", containerCtrl.containerPage);
router.get("/container/:id", containerCtrl.containerDetailsPage);
router.get("/createContainer", authPartner, containerCtrl.createContainerPage);
router.get("/updateContainer/:id", authPartner, containerCtrl.updateContainerPage);

// USER
router.get("/user/:id", authUser, userCtrl.userDetailsPage);
router.get("/register", userCtrl.createUserPage);
router.get("/updateUser/:id", authUser, userCtrl.updateUserPage);
router.get("/login", userCtrl.loginPage);
router.get("/changepassword/:id", authUser, userCtrl.changePasswordPage);
router.get("/lostpassword", userCtrl.lostPasswordPage);
router.get("/passwordrecovery", userCtrl.passwordRecoveryPage);


router.get("/myaccount", authMember, myAccountCtrl.myAccountPage);
router.get("/mypartner", authPartner, myAccountCtrl.myPartnerPage);
router.get("/mycontainer", authMember, myAccountCtrl.myContainerPage);


router.get("/dashboard", authAdmin, dashboardCtrl.dashboardPage);
router.get("/dashboard/user", authAdmin, dashboardCtrl.userPage);
router.get("/dashboard/partner", authAdmin, dashboardCtrl.partnerPage);
router.get("/dashboard/container", authAdmin, dashboardCtrl.containerPage);
router.get("/dashboard/history", authAdmin, dashboardCtrl.historyPage);

router.get("/point", authMember, pointCtrl.pointPage);

router.get("/map", mapCtrl.mapPage);

router.get("/qrcode", authMember, qrCodeCtrl.qrCodePage);
//router.get("/qrcodepartner", authPartner, qrCodeCtrl.qrCodePartnerPage);
router.get("/confirmation", qrCodeCtrl.confirmationPage); /////////////

module.exports = router;


