const departamentController = require("../controllers/departamentController");
const middleware = require("../controllers/middleware");
const express = require("express");
const router = express.Router();

//--------------------------------NU UITA SA TESTEZI CU /departament inainte--------------------------------

//cautam toate departamentele din companie - CHECKED
router.get("/", departamentController.departament_get);

//Toti angajatii din departamentul x - CHECKED
router.get("/angajati/:id", departamentController.departament_get_angajati);

//cautare in baza de date dupa nume - CHECKED
router.get("/:nume_departament", departamentController.departament_get_numedep);

//adaugam un nou departament in baza de date - CHECKED
router.post("/add", departamentController.departament_post);

//updatam departament - CHECKED
router.put("/update/:id", departamentController.departament_put);

//adaugam un angajat intr-un nou departament - CHECKED
router.put("/angajat/:id", departamentController.departament_angajat_put);

//stergem departament - CHECKED
router.delete("/delete/:id", departamentController.departament_delete);

module.exports = router;
