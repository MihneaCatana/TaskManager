const angajatiController = require("../controllers/angajatiController");
const middleware = require("../controllers/middleware");
const express = require("express");
const router = express.Router();

//--------------------------------NU UITA SA TESTEZI CU /angajati inainte--------------------------------

//cautam toti angajatii din firma  - CHECKED
router.get("/", angajatiController.angajati_get);

router.get("/ang", angajatiController.angajati_get_employees);

router.get("/:id", angajatiController.angajati_get_id);

//cautam utilizatorii dupa nume - CHECKED
router.get("/:utilizator", angajatiController.angajati_get_utilizator);

//adaugam un angajat nou -- CHECKED
router.post("/add", angajatiController.angajati_post);

//update dupa id -- CHECKED
router.put("/update/:id", angajatiController.angajati_put);

//activate dupa id
router.put("/activate/:id", angajatiController.angajati_activate);

//sters dupa id -- CHECKED
router.delete("/delete/:id", angajatiController.angajati_delete);

module.exports = router;
