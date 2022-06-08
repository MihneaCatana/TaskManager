const status_taskController = require("../controllers/status_taskController");
const express = require("express");
const middleware = require("../controllers/middleware");

const router = express.Router();

//--------------------------------NU UITA SA TESTEZI CU /status_task inainte--------------------------------

//cautam toate statusurile taskurilor - CHECKED
router.get("/", middleware.validation, status_taskController.status_task_get);

module.exports = router;
