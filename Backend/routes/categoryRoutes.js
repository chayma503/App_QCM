const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// Route pour obtenir toutes les catégories
router.get('/categories', categoryController.getAllCategories);

// ✅ Route pour supprimer une catégorie par ID
router.delete('/categories/:id', categoryController.deleteCategory);

module.exports = router;
