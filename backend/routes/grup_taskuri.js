const grup_taskuriController = require("../controllers/grup_taskuriController");
const express = require("express");
const middleware = require("../controllers/middleware");

const router = express.Router();

//--------------------------------NU UITA SA TESTEZI CU /grup_task inainte--------------------------------

//cautam toate grupurile de taskuri - CHECKED
router.get("/", grup_taskuriController.grup_taskuri_get);

//cautam taskurile pentru angajatul X
router.get("/:id", grup_taskuriController.grup_taskuri_get_angajat);

//adaugam un nou grup de taskuri - CHECKED
router.post("/add", grup_taskuriController.grup_taskuri_post);

//updatam dupa id la grup de taskuri - CHECKED
router.put(
  "/update/:id",

  grup_taskuriController.grup_taskuri_put
);

//stergem grupul de taskuri dupa id - CHECKED
router.delete(
  "/delete/:id",

  grup_taskuriController.grup_taskuri_delete
);

module.exports = router;
