const express = require('express');
const router = express.Router();
const testController = require('../controllers/testController');


router.post('/generate-test', testController.generateTest);
router.get('/download/:filename', testController.downloadTestFile);
router.get('/tests', testController.getAllTests);
router.get('/full/:testId', testController.getFullTestDetails);
router.delete('/tests/:id', testController.deleteTest); // ✅ Pas de parenthèses ici
router.get('/tests/:testId/categories', testController.getTestCategories);



module.exports = router;
