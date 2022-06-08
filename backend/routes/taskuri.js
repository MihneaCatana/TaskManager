const taskuriController = require("../controllers/taskuriController");
const express = require("express");
const middleware = require("../controllers/middleware");
const router = express.Router();

//--------------------------------NU UITA SA TESTEZI CU /taskuri inainte--------------------------------

//cautam toate taskurile - CHECKED
router.get("/", taskuriController.taskuri_get);

//cautam toate taskurile neterminate - CHECKED
router.get("/neterminate", taskuriController.taskuri_get_neterminate);

//calculam cate taskuri sunt in total - CHECKED
router.get("/total", taskuriController.taskuri_totale);

//calculam cate taskuri sunt finalizate - CHECKED
router.get("/finalizate", taskuriController.taskuri_finalizate);

//calculam cate taskuri neterminate are angajatul X - CHECKED
router.get("/finalizate/:id", taskuriController.taskuri_finalizate_angajat);

//calculam cate taskuri in total are angajatul X - CHECKED
router.get("/totale/:id", taskuriController.taskuri_totale_angajat);

//adaugam taskuri - CHECKED
router.post("/add", taskuriController.taskuri_post);

//updatam un task - CHECKED
router.put("/update/:id", taskuriController.taskuri_put);

//finalizare task de catre angajat - CHECKED
router.put("/update/finalizare/:id", taskuriController.taskuri_put_finalizare);

//stergere task - CHECKED
router.delete("/delete/:id", taskuriController.taskuri_delete);

module.exports = router;
