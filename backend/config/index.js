//aici condensam toate rutele
const express = require("express");
const router = express.Router();

const usersRoute = require("../routes/angajati");
const commentsRoute = require("../routes/comentarii");
const departamentsRoute = require("../routes/departament");
const tasksRoute = require("../routes/taskuri");
const grupTasksRoute = require("../routes/grup_taskuri");
const statusUserRoute = require("../routes/status_user");
const statusTaskRoute = require("../routes/status_task");
const LoginRoute = require("../routes/auth");
const middleware = require("../controllers/middleware");

router.use("/angajati", usersRoute);
router.use("/comentarii", commentsRoute);
router.use("/departament", departamentsRoute);
router.use("/taskuri", tasksRoute);
router.use("/status_user", statusUserRoute);
router.use("/status_task", statusTaskRoute);
router.use("/grup_task", grupTasksRoute);
router.use("/", LoginRoute);

module.exports = router;
