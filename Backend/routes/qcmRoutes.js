const express = require("express");
const router = express.Router();
const { ajouterQCM, getCategories, modifierQCM } = require("../controllers/qcmController");

router.post("/ajouter-qcm", ajouterQCM);
router.get("/categories", getCategories);
router.put('/modifierQCM', modifierQCM);
module.exports = router;