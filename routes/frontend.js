const express = require("express");
const router = express.Router();

const authAdmin = require("../middleware/authAdmin");
const authPartner = require("../middleware/authPartner");
const authOwnPartner = require("../middleware/authOwnPartner");
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
const myHistoryCtrl = require("../controllers/frontend/history");
const dashboardCtrl = require("../controllers/frontend/dashboard");

//LANDING PAGE
router.get("/", indexCtrl.indexPage);
router.get("/home", indexCtrl.homePage);

// PARTNER
router.get("/partner", partnerCtrl.partnerPage);
router.get("/partner/:id", partnerCtrl.partnerDetailsPage);
router.get("/createPartner", authPartner, partnerCtrl.createPartnerPage);
router.get("/updatePartner/:id", authOwnPartner, partnerCtrl.updatePartnerPage);

// CONTAINER
router.get("/container/:id", containerCtrl.containerDetailsPage);
router.get("/createContainer", authOwnPartner, containerCtrl.createContainerPage);
router.get("/updateContainer/:id", authOwnPartner, containerCtrl.updateContainerPage);

// USER
router.get("/user/:id", authUser, userCtrl.userDetailsPage);
router.get("/register", userCtrl.createUserPage);
router.get("/updateUser/:id", authUser, userCtrl.updateUserPage);
router.get("/login", userCtrl.loginPage);
router.get("/changepassword/:id", authUser, userCtrl.changePasswordPage);
router.get("/lostpassword", userCtrl.lostPasswordPage);
router.get("/passwordrecovery", userCtrl.passwordRecoveryPage);

// MY ACCOUNT pages
router.get("/myaccount", authMember, myAccountCtrl.myAccountPage);
router.get("/mycontainer/:id", authUser, myAccountCtrl.myContainerPage);
router.get("/myhistory/:id", authUser, myAccountCtrl.myHistoryPage);
router.get("/cgv", myAccountCtrl.cgvPage);
router.get("/contact", myAccountCtrl.contactPage);
router.get("/faq", myAccountCtrl.faqPage);
router.get("/aboutus", myAccountCtrl.aboutUsPage);

// HISTORY details
router.get("/history/:reference", myHistoryCtrl.historyDetailsPage);

//DASHBOARD
router.get("/dashboard", authAdmin, dashboardCtrl.dashboardPage);
router.get("/dashboard/user", authAdmin, dashboardCtrl.userPage);
router.get("/dashboard/partner", authAdmin, dashboardCtrl.partnerPage);
router.get("/dashboard/container", authAdmin, dashboardCtrl.containerPage);
router.get("/dashboard/history", authAdmin, dashboardCtrl.historyPage);

//POINT
router.get("/point", authMember, pointCtrl.pointPage);

//MAP
router.get("/map", mapCtrl.mapPage);

//QRCODE
router.get("/qrcode", authMember, qrCodeCtrl.qrCodePage);
router.get("/confirmation", qrCodeCtrl.confirmationPage);

module.exports = router;


