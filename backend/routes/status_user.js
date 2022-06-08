const status_userController = require("../controllers/status_userController");
const express = require("express");
const middleware = require("../controllers/middleware");
const router = express.Router();

//--------------------------------NU UITA SA TESTEZI CU /status_user inainte--------------------------------

//cautam toate statusurile userilor - CHECKED
router.get("/", middleware.validation, status_userController.status_user_get);

module.exports = router;
