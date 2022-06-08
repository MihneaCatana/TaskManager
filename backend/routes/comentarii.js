const comentariiController = require("../controllers/comentariiController");
const express = require("express");
const middleware = require("../controllers/middleware");
const router = express.Router();

//--------------------------------NU UITA SA TESTEZI CU /comentarii inainte--------------------------------

//afiseaza toate comentariile - CHECKED
router.get("/", middleware.validation, comentariiController.comentarii_get);

//afiseaza toate comentariile scrise de acel autor- CHECKED
router.get(
  "/:autor",
  middleware.validation,
  comentariiController.comentarii_get_autor
);

//adauga comentariu - CHECKED
router.post(
  "/add",
  middleware.validation,
  comentariiController.comentarii_post
);

//update comentariu - CHECKED
router.put(
  "/update/:id",
  middleware.validation,
  comentariiController.comentarii_put
);

//stergere comentariu selectat - CHECKED
router.delete(
  "/delete/:id",
  middleware.validation,
  comentariiController.comentarii_delete
);

module.exports = router;
