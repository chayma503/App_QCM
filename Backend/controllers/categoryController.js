const pool = require('../config/db');

// controllers/categoryController.js
const { getAllCategoriesFromDB } = require("../Models/categoryModel");

// Fonction contrôleur pour récupérer toutes les catégories
const getAllCategories = async (req, res) => {
  try {
    const categories = await getAllCategoriesFromDB();
    res.status(200).json(categories);
  } catch (err) {
    console.error('Erreur lors de la récupération des catégories :', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

const deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    // Supprimer les questions liées à cette catégorie
    await pool.query('DELETE FROM question WHERE id_categorie = $1', [id]);

    // Supprimer la catégorie
    await pool.query('DELETE FROM categorie WHERE id = $1', [id]);

    res.status(200).json({ message: 'Catégorie supprimée avec succès' });
  } catch (error) {
    console.error('Erreur suppression catégorie :', error);
    res.status(500).json({ error: 'Erreur serveur lors de la suppression de la catégorie' });
  }
};

module.exports = {
  getAllCategories,
  deleteCategory
};
