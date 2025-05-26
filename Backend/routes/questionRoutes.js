// routes/questionRoutes.js
const express = require('express');
const router = express.Router();
const { getQuestionsByCategory, updateQuestion, deleteQuestion } = require('../controllers/questionController');

router.get('/by-category/:id', getQuestionsByCategory);
router.delete('/:id', deleteQuestion);
router.put('/:id', updateQuestion);
module.exports = router;
