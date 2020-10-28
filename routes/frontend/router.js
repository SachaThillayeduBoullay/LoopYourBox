const express = require("express");
const router = express.Router();
//const auth = require("../..//middleware/auth");

const homeCtrl = require("../../controller/frontend/home");

router.get("/", homeCtrl.indexPage);
router.get("/home", homeCtrl.homePage);

module.exports = router;
