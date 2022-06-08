const express = require("express");
const middleware = require("../controllers/middleware");
const router = express.Router();

//incercam sa ne logam
router.post("/login", middleware.Auth);
router.get("/login", middleware.validation);

module.exports = router;
